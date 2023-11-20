// Import the DatabaseLogModel from the specified module
import { DatabaseLogModel } from "../models/DatabaseLogs.js";

// Function to create a database log
const createLog = async (logData) => {
  try {
    // Create a new database log entry with the provided data
    const result = await DatabaseLogModel.create(logData);
    return result;
  } catch (error) {
    // Handle errors and throw a generic error message
    throw new Error("Something went wrong");
  }
};

// Function to log a request
const logRequest = async (req, next) => {
  // Extract necessary data from the request
  const certificate_id = req.certificate_id;
  const query_type = req.method;

  // Prepare the database log data
  const databaseLogData = {
    certificate_id,
    query_type,
  };

  try {
    // Call the createLog function to log the request in the database
    await createLog(databaseLogData);
  } catch (error) {
    // Handle errors and throw a generic error message
    throw new Error("Something went wrong");
  }
};

// Function to get all database logs
const getAllDatabaseLogs = async (req, res) => {
  try {
    // Retrieve all database logs from the DatabaseLogModel
    const logs = await DatabaseLogModel.find().populate({
      path: "certificate_id",
      select: "cert_id user_email",
    });
    // Respond with the list of database logs
    res.status(200).json({
      success: true,
      message: "Get all database logs",
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

// Function to delete a specific database log entry by ID
const deleteDatabaseLog = async (logId) => {
  try {
    // Find and remove a specific database log entry by its ID
    const result = await DatabaseLogModel.findByIdAndRemove(logId);
    return result;
  } catch (error) {
    // Handle errors and throw a generic error message
    throw new Error("Something went wrong");
  }
};

// Export the functions for use in other parts of the application
export { logRequest, getAllDatabaseLogs, deleteDatabaseLog };
