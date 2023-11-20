// Import the AccessLogModel from an external module
import { AccessLogModel } from "../models/AccessLogs.js";

// Function to create and store an access log
const createLog = async (logData) => {
  try {
    const result = await AccessLogModel.create(logData); // Create a new access log entry in the database
    return result; // Return the result of the creation
  } catch (error) {
    throw new Error("Something went wrong"); // Throw an error if there's an issue creating the log
  }
};

// Function to log an incoming request and store it in the database
const logRequest = async (req, res) => {
  // Extract relevant data from the request and response objects
  const ip_address = req.ip;
  const user_agent = req.get("User-Agent");
  const http_status_codes = res.statusCode;
  const requested_url = req.url;
  const user_id = req.user_id; // Assuming user_id is available in the request

  // Create an access log data object
  const accessLogData = {
    ip_address,
    user_id,
    user_agent,
    http_status_codes,
    requested_url,
  };

  try {
    const log = await createLog(accessLogData); // Create and store the access log
    return log; // Return the log entry
  } catch (error) {
    throw new Error("Something went wrong"); // Throw an error if there's an issue creating the log
  }
};

// Function to retrieve all access logs from the database
const getAllAccessLogs = async (req, res) => {
  try {
    const logs = await AccessLogModel.find().populate({
      path: "user_id",
      select: "f_name l_name role email",
    }); // Populate the 'user_id' field, which likely represents a related user entity

    // If the retrieval is successful, respond with the list of access logs and a success message
    res.status(200).json({
      success: true,
      message: "Get all access logs",
      logs, // Include the access logs in the response
    });
  } catch (error) {
    // If an error occurs during the retrieval process, handle the error and respond with an error status
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// Function to delete a specific access log entry from the database
const deleteAccessLog = async (logId) => {
  try {
    const result = await AccessLogModel.findByIdAndRemove(logId); // Find and remove the specified access log entry
    return result; // Return the result of the deletion
  } catch (error) {
    throw new Error("Something went wrong"); // Throw an error if there's an issue deleting the log
  }
};

// Export the functions for use in other parts of the application
export { logRequest, getAllAccessLogs, deleteAccessLog };
