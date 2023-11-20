// Import necessary functions and constants from other modules
import { requestGet } from "../utils/request";
import { GET_ALL_ACCESS_LOGS } from "../constants";

// Function to retrieve information about all access logs
export async function getAllAccessLogs(req) {
  return requestGet(GET_ALL_ACCESS_LOGS, { req });
}
