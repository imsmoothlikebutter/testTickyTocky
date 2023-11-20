import express from "express";
const certRouter = express.Router();
import {
  createCert,
  createCerts,
  getAllCerts,
  getCert,
  getCertsByEmail,
  transferOwnershipCert,
  updateCert,
  deleteCert,
} from "../controls/certs.js";
import {
  validateCert,
  validateCerts,
  validateTransferOwnership,
} from "../controls/validation.js";
import { isAuthenticated, isAdmin } from "../controls/auth.js";
import { logRequest } from "../controls/databaseLogs.js";

// Route to create a single certificate (requires authentication and admin privileges)
certRouter.post(
  "/create-cert",
  isAuthenticated,
  isAdmin,
  validateCert, // Validate certificate data
  createCert, // Create a single certificate
  logRequest // Log the request
);

// Route to create multiple certificates (requires authentication and admin privileges)
certRouter.post(
  "/create-certs",
  isAuthenticated,
  isAdmin,
  validateCerts, // Validate multiple certificates data
  createCerts // Create multiple certificates
);

// Route to get all certificates (requires authentication)
certRouter.get("/all-certs", isAuthenticated, getAllCerts);

// Route to get a specific certificate by ID
certRouter.get("/:certID", getCert, logRequest);

// Route to get certificates by email (requires authentication)
certRouter.post("/email", isAuthenticated, getCertsByEmail, logRequest);

// Route to transfer ownership of a certificate (requires authentication and validation)
certRouter.put(
  "/transfer-ownership",
  isAuthenticated,
  validateTransferOwnership, // Validate transfer ownership request
  transferOwnershipCert, // Transfer ownership of a certificate
  logRequest // Log the request
);

// Route to update a certificate (requires authentication and admin privileges)
certRouter.put("/", isAuthenticated, isAdmin, updateCert, logRequest);

// Route to delete a certificate (requires authentication and admin privileges)
certRouter.delete("/", isAuthenticated, isAdmin, deleteCert, logRequest);

// Export the certificate router for use in your application
export { certRouter };
