import express from "express";
const userRouter = express.Router();
import {
  createUser,
  getAllUsersEmails,
  getUser,
  updateUser,
  deleteUser,
  updateUserAsAdmin,
} from "../controls/users.js";

import { isAuthenticated, isAdmin } from "../controls/auth.js";
import { logRequest } from "../controls/accessLogs.js";

// Route to create a user (requires authentication and admin privileges)
userRouter.post("/", isAuthenticated, isAdmin, createUser, logRequest);

// Route to get all user emails (requires authentication)
userRouter.get("/all-users", isAuthenticated, getAllUsersEmails);

// Route to get a specific user by email (only available for the user that owns the account, requires authentication)
userRouter.get("/:email", isAuthenticated, getUser, logRequest);

// Route to update user information (only available for the user that owns the account, requires authentication)
userRouter.put("/", isAuthenticated, updateUser, logRequest);

// Route to delete a user (requires authentication and admin privileges)
userRouter.delete("/", isAuthenticated, isAdmin, deleteUser, logRequest);

// Route to update user information as an admin (requires authentication and admin privileges)
userRouter.put(
  "/admin",
  isAuthenticated,
  isAdmin,
  updateUserAsAdmin,
  logRequest
);

// Export the user router for use in your application
export { userRouter };
