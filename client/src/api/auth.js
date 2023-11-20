// Import necessary functions and constants from other modules
import { requestGet, requestPost } from "../utils/request";
import {
  CHECK_AUTH_API,
  REGISTER_API,
  LOGIN_API,
  LOGOUT_API,
  GENERATE_OTP_API,
  RESET_PASSWORD_API,
  UPDATE_PASSWORD_API,
  GENERATE_CSRF_TOKEN,
} from "../constants";

// Function to check the authentication status
export async function checkAuth(req) {
  return requestGet(CHECK_AUTH_API, { req });
}

// Function to register a user
export async function register(req) {
  return requestPost(REGISTER_API, { req });
}

// Function to post a login request
export async function postLogin(req) {
  return requestPost(LOGIN_API, { req });
}

// Function to post a logout request
export async function postLogout() {
  return requestGet(LOGOUT_API);
}

// Function to generate a one-time password (OTP)
export async function generateOTP(req) {
  return requestPost(GENERATE_OTP_API, { req });
}

// Function to reset a user's password
export async function resetPassword(req) {
  return requestPost(RESET_PASSWORD_API, { req });
}

// Function to update a user's password
export async function updatePassword(req) {
  return requestPost(UPDATE_PASSWORD_API, { req });
}

// Function to generate a CSRF token
export async function generateCSRFToken(req) {
  return requestGet(GENERATE_CSRF_TOKEN, { req });
}

// Function to fetch a CSRF token from the API and handle errors
export const getCsrfTokenFromAPI = async () => {
  try {
    await generateCSRFToken();
  } catch (error) {
    throw new Error("Something went wrong");
  }
};
