import express from "express";

import { getAllDatabaseLogs } from "../controls/databaseLogs.js";
import { isAuthenticated, isAdmin } from "../controls/auth.js";

const databaseLogsRouter = express.Router();

databaseLogsRouter.get(
  "/all-database-logs",
  isAuthenticated,
  isAdmin,
  getAllDatabaseLogs
);
export { databaseLogsRouter };
