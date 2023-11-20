import mongoose from "mongoose";
import { UserModel } from "./Users.js";
// Define the schema for security log entries
const SecurityLogSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: UserModel,
  },
  login_attempts: {
    type: Number,
    required: true,
  },
  ip_address: {
    type: String,
    maxlength: 255,
    required: true,
  },
  timestamps: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

// Create the SecurityLogModel using the schema
export const SecurityLogModel = mongoose.model(
  "security_logs",
  SecurityLogSchema
);
