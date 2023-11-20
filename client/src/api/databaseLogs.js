// Import necessary functions and constants from other modules
import { requestGet } from "../utils/request";
import { GET_ALL_DATABASE_LOGS } from "../constants";

// Function to retrieve information about all database logs
export async function getAllDatabaseLogs(req) {
  return requestGet(GET_ALL_DATABASE_LOGS, { req });
}
