import mongoose from "mongoose";
import { CertModel } from "./Certs.js";
// Define the schema for database logs
const DatabaseLogSchema = new mongoose.Schema({
  certificate_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: CertModel,
  },
  timestamps: {
    type: Date,
    required: true,
    default: Date.now,
  },
  query_type: {
    type: String,
    maxlength: 255,
    required: true,
  },
});

// Create the DatabaseLogModel using the schema
export const DatabaseLogModel = mongoose.model(
  "database_logs",
  DatabaseLogSchema
);
