// Import required modules and functions
import { UserModel } from "../models/Users.js";
import { CertModel } from "../models/Certs.js";
import { deleteWatch } from "./watches.js";
import { unlockAccount, userExists } from "./auth.js";
import bcrypt from "bcrypt";

// Function to handle and send error responses
const handleError = (res, message, status = 500) => {
  res.status(status).json({ success: false, message });
};

// Function to create a new user
const createUser = async (req, res, next) => {
  try {
    // Check if the requesting user is an admin
    const admin = await UserModel.findOne({
      email: req.session.user.email,
      role: "admin",
    });

    // If not an admin, return an unauthorized response
    if (!admin) {
      res.status(401).json({
        success: false,
        message: `Unauthorized`,
      });
    } else {
      req.user_id = admin._id;
      next();
    }

    // Extract user data from the request
    const { f_name, l_name, password, email, account_lock, role } = req.body;

    // Check if the user with the provided email already exists
    if (await userExists(email))
      return res.status(409).json({
        success: false,
        error: "User already exists",
      });

    // Generate a salt and hash the user's password
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new UserModel instance with the user's data
    const newUser = new UserModel({
      f_name: f_name,
      l_name: l_name,
      email: email,
      encrypted_password: hashedPassword,
      account_lock: account_lock,
      role: role,
    });

    // Save the new user to the database
    await newUser.save();

    // Check if the user was successfully created, and respond accordingly
    if (!newUser) {
      handleError(res, "Something went wrong");
    }

    res.status(200).json({
      success: true,
      message: `User ${newUser.f_name} ${newUser.l_name} created successfully.`,
    });
  } catch (error) {
    handleError(res, "Something went wrong");
  }
};

// Function to get emails of all users
const getAllUsersEmails = async (req, res) => {
  try {
    // Retrieve email addresses of all users
    const users = await UserModel.find({}).select("email");
    const emails = users.map((user) => user.email);

    // Respond with the list of emails
    res.status(200).json({
      success: true,
      message: "Get all user emails",
      emails,
    });
  } catch (error) {
    handleError(res, "Something went wrong");
  }
};

// Function to get user information
const getUser = async (req, res, next) => {
  try {
    // Find the requested user based on their email
    const requested = await UserModel.findOne({
      email: req.session.user.email,
    });
    req.user_id = requested._id;
    next();
    const { email } = req.params;
    const user = await UserModel.findOne({ email: email }).select(
      "-_id -encrypted_password"
    );

    // Check if the user was found and respond accordingly
    if (user) {
      res.status(200).json({
        success: true,
        user,
      });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    handleError(res, "Something went wrong");
  }
};

// Function to update user information
const updateUser = async (req, res, next) => {
  const { f_name, l_name, email } = req.body;
  try {
    // Update the user's first and last name
    const updatedUser = await UserModel.findOneAndUpdate(
      { email },
      { $set: { f_name, l_name } },
      { new: true }
    );

    req.user_id = updatedUser._id;
    next();

    // Check if the update was successful and respond accordingly
    if (updatedUser) {
      res.status(200).json({
        success: true,
        message: "User updated successfully",
        user: updatedUser,
      });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    handleError(res, "Something went wrong");
  }
};

// Function to update user information as an admin
const updateUserAsAdmin = async (req, res, next) => {
  const { f_name, l_name, email, account_lock, email_verified, role } =
    req.body;
  try {
    // Check if the requesting user is an admin
    const admin = await UserModel.findOne({
      email: req.session.user.email,
      role: "admin",
    });

    // If not an admin, return an unauthorized response
    if (!admin) {
      res.status(401).json({
        success: false,
        message: `Unauthorized`,
      });
    } else {
      req.user_id = admin._id;
      next();
    }

    // Find the current user
    const currentUser = await UserModel.findOne({ email });

    // Update the user's information
    const updatedUser = await UserModel.findOneAndUpdate(
      { email },
      { $set: { f_name, l_name, account_lock, email_verified, role } },
      { new: true }
    );

    // Check if the update was successful and respond accordingly
    if (updatedUser) {
      if (currentUser.account_lock && !updatedUser.account_lock) {
        await unlockAccount(updatedUser._id, req.ip);
      }

      res.status(200).json({
        success: true,
        message: "User updated successfully",
        user: updatedUser,
      });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    handleError(res, "Something went wrong");
  }
};

// Function to delete a user
const deleteUser = async (req, res, next) => {
  const session = await CertModel.startSession();
  const { email } = req.body;
  try {
    // Check if the requesting user is an admin
    const admin = await UserModel.findOne({
      email: req.session.user.email,
      role: "admin",
    });

    // If not an admin, return an unauthorized response
    if (!admin) {
      res.status(401).json({
        success: false,
        message: `Unauthorized`,
      });
    } else {
      req.user_id = admin._id;
      next();
    }

    // Find and delete certificates associated with the user
    const certs = await CertModel.find({ user_email: email });
    session.startTransaction();
    if (certs && certs.length > 0) {
      for (const cert of certs) {
        await deleteWatch(cert.watch_id, session);
      }
      const user_email = certs[0].user_email;
      await CertModel.deleteMany({ user_email: user_email }, { session });
    }

    // Delete the user and respond accordingly
    const result = await UserModel.deleteOne({ email });

    await session.commitTransaction();
    session.endSession();

    if (result.deletedCount === 1) {
      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    handleError(res, "Something went wrong");
  }
};

// Export the functions for use in other parts of the application
export {
  createUser,
  getAllUsersEmails,
  getUser,
  updateUser,
  deleteUser,
  updateUserAsAdmin,
};
