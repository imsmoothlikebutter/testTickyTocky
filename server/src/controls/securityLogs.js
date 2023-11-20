// Import the SecurityLogModel and the lockAccount function from the specified modules
import { SecurityLogModel } from "../models/SecurityLogs.js";
import { lockAccount } from "./auth.js";

// Function to create a security log based on the provided log data
const createLog = async (logData) => {
  try {
    // Create a new security log using the SecurityLogModel and return the result
    const result = await SecurityLogModel.create(logData);
    return result;
  } catch (error) {
    // Handle any errors that occur during log creation
    throw new Error("Something went wrong");
  }
};

// Function to log security-related information for a request
const logRequest = async (req, res) => {
  try {
    // Extract user ID and IP address from the request object
    const user_id = req._id;
    const ip_address = req.ip;

    // Initialize login attempts count
    let login_attempts = 0;

    // Check if the login attempt was unsuccessful
    if (!req.attemptSuccess) {
      // Retrieve the latest login attempt for the user, if any
      const latest_login_attempt = await SecurityLogModel.findOne(
        { user_id: user_id },
        {},
        { sort: { timestamps: -1 } }
      );

      // Calculate the new login attempts count
      login_attempts = latest_login_attempt
        ? latest_login_attempt.login_attempts + 1
        : 1;
    }

    // Check if login attempts exceed a threshold (e.g., 5) and lock the user account
    if (login_attempts >= 5) {
      const result = await lockAccount(user_id);
      if (!result) {
        console.error("Error locking user account.");
      }
    }

    // Prepare security log data
    const securityLogData = {
      user_id,
      login_attempts,
      ip_address,
    };

    // Create a security log with the prepared data
    await createLog(securityLogData);
  } catch (error) {
    // Handle any errors that occur during security log creation
    throw new Error("Something went wrong");
  }
};

// Function to retrieve all security logs
const getAllSecurityLogs = async (req, res) => {
  try {
    // Fetch and return all security logs from the database
    const logs = await SecurityLogModel.find().populate({
      path: "user_id",
      select: "f_name l_name role email",
    });
    // Respond with the list of security logs
    res.status(200).json({
      success: true,
      message: "Get all security logs",
      logs,
    });
  } catch (error) {
    // Handle any errors that occur during log retrieval
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// Function to delete a security log by its ID
const deleteSecurityLog = async (logId) => {
  try {
    // Find and remove a security log with the specified ID
    const result = await SecurityLogModel.findByIdAndRemove(logId);
    return result;
  } catch (error) {
    // Handle any errors that occur during log deletion
    throw new Error("Something went wrong");
  }
};

// Export the functions for use in other parts of the application
export { createLog, logRequest, getAllSecurityLogs, deleteSecurityLog };
