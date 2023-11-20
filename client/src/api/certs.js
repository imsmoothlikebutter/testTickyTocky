// Import necessary functions and constants from other modules
import {
  requestGet,
  requestPost,
  requestPut,
  requestDelete,
} from "../utils/request";
import {
  CREATE_CERT_API,
  CREATE_CERTS_API,
  GET_ALL_CERTS_API,
  GET_CERT_API,
  GET_CERTS_BY_EMAIL_API,
  UPDATE_CERT_API,
  DELETE_CERT_API,
  TRANSFER_OWNERSHIP_API,
} from "../constants";

// Function to create a single certificate
export async function createCert(req) {
  return requestPost(CREATE_CERT_API, { req });
}

// Function to create multiple certificates
export async function createCerts(req) {
  return requestPost(CREATE_CERTS_API, { req });
}

// Function to get all certificates
export async function getAllCerts(req) {
  return requestGet(GET_ALL_CERTS_API, { req });
}

// Function to get a specific certificate by its ID
export async function getCert(req) {
  const api = GET_CERT_API.replace(":certID", req);
  return requestGet(api, { req });
}

// Function to get certificates associated with a specific email
export async function getCertsByEmail(req) {
  return requestPost(GET_CERTS_BY_EMAIL_API, { req });
}

// Function to update a certificate
export async function updateCert(req) {
  return requestPut(UPDATE_CERT_API, req);
}

// Function to delete a certificate
export async function deleteCert(req) {
  return requestDelete(DELETE_CERT_API, { req });
}

// Function to transfer ownership of a certificate
export async function transferOwnership(req) {
  return requestPut(TRANSFER_OWNERSHIP_API, req);
}
