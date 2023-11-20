import express from "express";

import { getAllAccessLogs } from "../controls/accessLogs.js";
import { isAuthenticated, isAdmin } from "../controls/auth.js";

const accessLogsRouter = express.Router();

accessLogsRouter.get(
  "/all-access-logs",
  isAuthenticated,
  isAdmin,
  getAllAccessLogs
);
export { accessLogsRouter };
