// Import necessary functions and constants from other modules
import { requestGet } from "../utils/request";
import { GET_ALL_SECURITY_LOGS } from "../constants";

// Function to retrieve information about all security logs
export async function getAllSecurityLogs(req) {
  return requestGet(GET_ALL_SECURITY_LOGS, { req });
}
