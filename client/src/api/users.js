// Import necessary functions and constants from other modules
import {
  requestGet,
  requestPost,
  requestPut,
  requestDelete,
} from "../utils/request";
import {
  CREATE_USER_API,
  GET_ALL_USERS_API,
  GET_USER_API,
  UPDATE_USER_API,
  UPDATE_USER_ADMIN_API,
  DELETE_USER_API,
} from "../constants";

// Function to create a new user
export async function createUser(req) {
  return requestPost(CREATE_USER_API, { req });
}

// Function to retrieve information about all users
export async function getAllUsers(req) {
  return requestGet(GET_ALL_USERS_API, { req });
}

// Function to retrieve information about a specific user by email
export async function getUser(req) {
  const api = GET_USER_API.replace(":email", req);
  return requestGet(api, { req });
}

// Function to update user information
export async function updateUser(req) {
  return requestPut(UPDATE_USER_API, req);
}

// Function to update user information with admin privileges
export async function updateUserAsAdmin(req) {
  return requestPut(UPDATE_USER_ADMIN_API, req);
}

// Function to delete a user
export async function deleteUser(req) {
  return requestDelete(DELETE_USER_API, { req });
}
