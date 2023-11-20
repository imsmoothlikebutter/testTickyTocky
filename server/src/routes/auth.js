import express from "express";
import {
  isAuthenticated,
  checkAuth,
  register,
  login,
  logout,
  generateOTP,
  resetPassword,
  updatePassword,
  generateCSRFToken,
} from "../controls/auth.js";
import { logRequest as accessLogRequest } from "../controls/accessLogs.js";
import { logRequest as securityLogRequest } from "../controls/securityLogs.js";
import { validateRegister } from "../controls/validation.js";

// Create an Express Router for handling authentication-related routes
const authRouter = express.Router();

// Route to check if a user is authenticated
authRouter.get("/check-auth", isAuthenticated, checkAuth, accessLogRequest);

// Route to register a new user, with validation
authRouter.post("/register", validateRegister, register, accessLogRequest);

// Route to log in a user
authRouter.post("/login", login, securityLogRequest);

// Route to log out a user
authRouter.get("/logout", logout);

// Route to generate an OTP (One-Time Password)
authRouter.post("/generate-otp", generateOTP, accessLogRequest);

// Route to reset the user's password
authRouter.post("/reset-password", resetPassword, accessLogRequest);

// Route to update the user's password
authRouter.post("/update-password", updatePassword, accessLogRequest);

// Route to generate a CSRF token
authRouter.get("/generate-csrf-token", generateCSRFToken);

// Export the authentication router for use in your application
export { authRouter };
