import mongoose from "mongoose";
import { UserModel } from "./Users.js";

// Define the schema for the Access Log
const AccessLogSchema = new mongoose.Schema({
  ip_address: {
    type: String,
    maxlength: 255,
    required: false,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: UserModel,
  },
  user_agent: {
    type: String,
    maxlength: 255,
    required: true,
  },
  http_status_codes: {
    type: Number,
    required: true,
  },
  requested_url: {
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

// Create the AccessLogModel using the schema
export const AccessLogModel = mongoose.model("access_logs", AccessLogSchema);
