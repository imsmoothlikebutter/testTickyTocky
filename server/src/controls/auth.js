// Import required modules and constants
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { UserModel } from "../models/Users.js";
import { OtpModel } from "../models/Otp.js";
import { createLog } from "../controls/securityLogs.js";

// Obtain environment variables
import { EMAIL_NAME, EMAIL_PASS, EMAIL_USER } from "../constants.js";

// Function to lock a user's account
const lockAccount = async (user_id) => {
  try {
    const result = await UserModel.updateOne(
      { _id: user_id },
      { $set: { account_lock: true } }
    );
    if (result.acknowledged) return true;
    return false;
  } catch (error) {
    throw new Error("Something went wrong");
  }
};

// Function to unlock a user's account and create a log entry
const unlockAccount = async (user_id, ip_address) => {
  try {
    const resetLoginAttempt = {
      user_id,
      ip_address,
      login_attempts: 0,
    };
    const result = await createLog(resetLoginAttempt);
    if (result.acknowledged) return true;
    return false;
  } catch (error) {
    throw new Error("Something went wrong");
  }
};

// Middleware to check if a user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    checkCSRFTokenSTP(req, res, next);
    next();
  } else {
    return res.status(200).json({ success: false, message: "Invalid session" });
  }
};

// Middleware to check if a user is an admin
const isAdmin = async (req, res, next) => {
  const user = await UserModel.findOne({
    email: req.session.user.email,
  }).select("-_id role");
  if (user.role === "admin") {
    next();
  } else {
    return res
      .status(403)
      .json({ success: false, message: "Unauthorized Access" });
  }
};

// Function to check if a user with a given email exists
const userExists = async (email) => {
  const user = await UserModel.findOne({ email });
  if (user) {
    return true;
  }
  return false;
};

// Function to generate a secure random token
const generateSecureToken = (length) => {
  return crypto.randomBytes(length).toString("hex");
};

// Middleware to check if a user is authenticated, extract user_id and add it to the request
const checkAuth = async (req, res, next) => {
  const user = await UserModel.findOne({
    email: req.session.user.email,
  }).lean();

  if (!user) {
    return res.status(201).json({
      email: req.session.user.email,
      success: false,
      message: "Something went wrong",
      role: "",
    });
  }

  req.user_id = user._id;
  next();

  return res.status(201).json({
    email: req.session.user.email,
    success: true,
    message: "User is authenticated",
    role: user.role,
  });
};

// Function to register a new user
const register = async (req, res, next) => {
  try {
    const { f_name, l_name, email, password } = req.body;

    if (await userExists(email))
      return res.status(409).json({
        success: false,
        error: "User already exist",
      });

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new UserModel({
      f_name,
      l_name,
      email,
      encrypted_password: hashedPassword,
    });

    req.isRegister = true;
    const CSRFverified = checkCSRFTokenSTP(req, res);
    if (!CSRFverified.result) {
      return res
        .status(401)
        .json({ success: false, message: CSRFverified.message });
    }

    await newUser.save();

    req.user_id = newUser._id;
    next();

    return res
      .status(201)
      .json({ success: true, message: "Register successfully." });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

// Function to handle user login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credential" });
    }

    if (user.account_lock) {
      req._id = user._id;
      req.attemptSuccess = false;
      next();
      return res.status(401).json({
        success: false,
        message:
          "Account is locked. Reset your password or contact administrator to unlock your account.",
      });
    }

    if (!(await bcrypt.compare(password, user.encrypted_password))) {
      req._id = user._id;
      req.attemptSuccess = false;
      next();
      return res
        .status(401)
        .json({ success: false, message: "Invalid credential" });
    }

    if (
      req.session.user &&
      req.session.user.email &&
      req.session.user.email === email
    ) {
      return res.status(401).json({
        success: false,
        message: "User is already logged in",
      });
    }

    req.session.user = {
      email,
    };

    await req.session.save();

    req.isLogin = true;
    const CSRFverified = checkCSRFTokenSTP(req, res);
    if (!CSRFverified.result) {
      return res
        .status(401)
        .json({ success: false, message: CSRFverified.message });
    }

    req._id = user._id;
    req.attemptSuccess = true;
    next();

    return res
      .status(200)
      .json({ success: true, message: "Login successfully.", role: user.role });
  } catch (error) {
    res.status(500);
    next();
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

// Function to handle user logout
const logout = async (req, res) => {
  req.session.destroy();
  res.clearCookie("CSRFToken");
  res.cookie("CSRFToken", "", { expires: new Date(0) });
  return res
    .status(200)
    .json({ success: true, message: "Log out successfully" });
};

// Function to generate a one-time password (OTP) and send it via email
const generateOTP = async (req, res, next) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res
        .status(200)
        .json({ success: false, message: "Email is required." });
    }

    const user = await UserModel.findOne({ email }).lean();
    if (!user) {
      return res
        .status(200)
        .json({ success: false, message: "Email does not exist" });
    }
    const isOtpExist = await OtpModel.findOne({ user_email: email });
    if (isOtpExist) {
      const currentTime = new Date();
      const storedTime = isOtpExist.timestamps;
      const timeDiff = currentTime.getTime() - storedTime.getTime();
      const minutesLeft = Math.floor((180000 - timeDiff) / 60000);
      return res.status(200).json({
        success: false,
        message: `Please wait for ${minutesLeft} minutes to generate a new OTP.`,
      });
    }

    const token = generateSecureToken(32);

    await OtpModel.create({
      user_email: email,
      token,
    });

    const send = await emailToUser(email, token);

    if (!send.success) {
      return res.status(500).json({ success: false, message: send.message });
    }
    req.user_id = user._id;
    next();
    return res.status(200).json({
      success: true,
      message: `OTP created`,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

// Function to send an email with an OTP to the user
const emailToUser = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  const emailBody = `
  <!DOCTYPE html>
<html>
<head>
    <title>Password Reset</title>
    <style>
        body {
            font-family: Arial, sans-serif;
        }
        .container {
            max-width: 1000px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #3498db;
            color: #fff;
            text-align: center;
            padding: 20px;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
        }
        .card {
            background-color: #fff;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            padding: 20px;
        }
        .button {
            background-color: #3498db;
            color: #fff;
            padding: 10px 20px;
            text-decoration: none;
            display: inline-block;
            border-radius: 5px;
            font-weight: bold;
        }
        .button:hover {
            background-color: #277dbb;
        }
        .footer {
            background-color: #333;
            color: #fff;
            text-align: center;
            padding: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="../img/log.png" alt="TickyTocky" width="150">
        </div>
        <div class="card">
            <h2>TickyTocky Password Reset</h2>
            <p>We heard that you lost your TickyTocky password. Sorry about that!</p>
            <p>But don’t worry! You can use the following button to reset your password:</p>
            <p class="reset-link">
                <a class="button" href="https://gracious-kare.cloud/resetpassword?t=${token}" style="color: #fff;">Reset your password</a>
            </p>
            <p>If you don’t use this link within 10 minutes, it will expire. To get a new password reset link, visit:</p>
            <a href="https://gracious-kare.cloud/forgotpassword">https://gracious-kare.cloud/forgotpassword</a>
            <p>Thanks,</p>
            <p>The TickyTocky Team </p>
        </div>
        <p>You're receiving this email because a password reset was requested for your account.</p>
        <div class="footer">
            &copy; 2023 TickyTocky. All rights reserved.
        </div>
    </div>
</body>
</html>
  `;

  const mailOptions = {
    from: {
      name: EMAIL_NAME,
      address: EMAIL_USER,
    },
    to: email,
    subject: "Ticky Tocky One-Time-Password",
    html: emailBody,
  };

  return new Promise((resolve) => {
    transporter.sendMail(mailOptions, function (error) {
      if (error) {
        resolve({ success: false, message: "Failed to send email" });
      } else {
        resolve({ success: true, message: "Email sent" });
      }
    });
  });
};

// Function to reset a user's password with a valid OTP
const resetPassword = async (req, res, next) => {
  try {
    req.isResetPassword = true;
    const CSRFverified = checkCSRFTokenSTP(req, res);
    if (!CSRFverified.result) {
      return res
        .status(401)
        .json({ success: false, message: CSRFverified.message });
    }
    const { token, password } = req.body;
    const otpRecord = await OtpModel.findOne({ token: token }).lean();

    if (!otpRecord) {
      return res
        .status(200)
        .json({ success: false, message: "An error occurred." });
    }

    const email = otpRecord.user_email;

    if (!email) {
      return res
        .status(200)
        .json({ success: false, message: "Email is required." });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(200)
        .json({ success: false, message: "Email does not exist." });
    }

    const isOtpExist = await OtpModel.findOne({ user_email: email });
    if (isOtpExist.is_used) {
      if (isOtpExist) {
        const currentTime = new Date();
        const storedTime = isOtpExist.timestamps;
        const timeDiff = currentTime.getTime() - storedTime.getTime();
        const minutesLeft = Math.floor((180000 - timeDiff) / 60000);
        return res.status(200).json({
          success: false,
          message: `Please wait ${minutesLeft} minutes to generate a new OTP.`,
        });
      }
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (await bcrypt.compare(password, user.encrypted_password)) {
      return res.status(200).json({
        success: false,
        message: "Old password and new password cannot be the same.",
      });
    }

    const updatedUser = await UserModel.findOneAndUpdate(
      { email },
      { $set: { encrypted_password: hashedPassword, account_lock: false } },
      { new: true }
    ).lean();

    await unlockAccount(updatedUser._id, req.ip);

    if (updatedUser) {
      req.user_id = user._id;
      next();
      await OtpModel.findOneAndUpdate(
        { user_email: email },
        { $set: { is_used: true } },
        { new: true }
      );
      res.status(200).json({
        success: true,
        message: "Password updated successfully",
      });
    } else {
      res
        .status(404)
        .json({ success: false, message: "Password failed to update" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// Function to update a user's password
const updatePassword = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email) {
      return res
        .status(200)
        .json({ success: false, message: "Email is required" });
    }

    const user = await UserModel.findOne({ email });
    req.user_id = user._id;
    next();
    if (!user) {
      return res
        .status(200)
        .json({ success: false, message: "Email does not exist" });
    }

    // Salt and Hash password
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (await bcrypt.compare(password, user.encrypted_password)) {
      return res.status(200).json({
        success: false,
        message: "Old password and new password cannot be the same",
      });
    }

    const updatedUser = await UserModel.findOneAndUpdate(
      { email },
      { $set: { encrypted_password: hashedPassword, account_lock: false } },
      { new: true }
    );

    await unlockAccount(updatedUser._id, req.ip);

    if (updatedUser) {
      res.status(200).json({
        success: true,
        message: "Password updated successfully",
      });
    } else {
      res
        .status(404)
        .json({ success: false, message: "Password failed to update" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// Function to generate a CSRF token and store it in the session
const generateCSRFToken = async (req, res) => {
  try {
    const data = crypto.randomBytes(36).toString("base64");
    const existingCSRFToken = req.cookies.CSRFToken;
    if (existingCSRFToken) {
      res.clearCookie("CSRFToken");
    }
    res.cookie("CSRFToken", data, { httpOnly: true });
    req.session.csrfToken = data;
    res.status(200).json({
      success: true,
      message: "Token created successfully",
    });
  } catch (e) {
    res.status(500).json({ result: false, message: "Something went wrong" });
    return;
  }
};

// Function to check the validity of the CSRF token
const checkCSRFTokenSTP = (req, res) => {
  try {
    const sessionUser = req.session.user;
    const sessionCsrfToken = req.session.csrfToken;
    const requestCsrfToken = req.cookies.CSRFToken;

    if (req.isRegister || req.isResetPassword) {
      delete req.isRegister;
      delete req.isResetPassword;
      if (!requestCsrfToken || !sessionCsrfToken) {
        if (sessionUser) {
          req.session.destroy();
        }
        return {
          result: false,
          message: "Token not found",
        };
      }
      if (requestCsrfToken !== sessionCsrfToken) {
        if (sessionUser) {
          req.session.destroy();
        }
        return {
          result: false,
          message: "Invalid token",
        };
      }
      return { result: true };
    } else if (req.isLogin) {
      delete req.isLogin;
      if (!requestCsrfToken || !sessionCsrfToken || !sessionUser) {
        if (sessionUser) {
          req.session.destroy();
        }
        return {
          result: false,
          message: "Token not found",
        };
      }

      if (requestCsrfToken !== sessionCsrfToken) {
        if (sessionUser) {
          req.session.destroy();
        }
        res.clearCookie("CSRFToken");
        res.cookie("CSRFToken", "", { expires: new Date(0) });
        return {
          result: false,
          message: "Invalid token",
        };
      }
      return { result: true };
    } else {
      if (!requestCsrfToken || !sessionCsrfToken || !sessionUser) {
        if (sessionUser) {
          req.session.destroy();
        }
        return res.status(401).json({
          result: false,
          message: "Token not found",
        });
      }

      if (requestCsrfToken !== sessionCsrfToken) {
        if (sessionUser) {
          req.session.destroy();
        }
        res.clearCookie("CSRFToken");
        res.cookie("CSRFToken", "", { expires: new Date(0) });
        return res.status(401).json({
          result: false,
          message: "Invalid token",
        });
      }
    }
  } catch (e) {
    return res
      .status(500)
      .json({ result: false, message: "Something went wrong" });
  }
};

// Export the functions for use in other parts of the application
export {
  unlockAccount,
  lockAccount,
  isAuthenticated,
  isAdmin,
  userExists,
  checkAuth,
  register,
  login,
  logout,
  generateOTP,
  resetPassword,
  updatePassword,
  generateCSRFToken,
  checkCSRFTokenSTP,
};
