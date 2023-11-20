import express from "express";

import { getAllSecurityLogs } from "../controls/securityLogs.js";
import { isAuthenticated, isAdmin } from "../controls/auth.js";

const securityLogsRouter = express.Router();

securityLogsRouter.get(
  "/all-security-logs",
  isAuthenticated,
  isAdmin,
  getAllSecurityLogs
);
export { securityLogsRouter };
