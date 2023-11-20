import mongoose from "mongoose";
import { UserModel } from "./Users.js";
import { WatchModel } from "./Watches.js";

// Define the schema for the Certificate
const CertSchema = new mongoose.Schema({
  cert_id: {
    type: String,
    maxlength: 16,
    required: true,
  },
  user_email: {
    type: String,
    ref: UserModel, // Reference to the UserModel
    required: true,
  },
  validated_by: {
    type: String,
    maxlength: 50,
    required: true,
  },
  date_of_validation: {
    type: Date,
    required: true,
  },
  watch_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: WatchModel, // Reference to the WatchModel
    required: true,
  },
  issue_date: {
    type: Date,
    required: true,
  },
  expiry_date: {
    type: Date,
    required: true,
  },
  remarks: {
    type: String,
    maxlength: 255,
    required: true,
  },
});

// Create the CertModel using the schema
export const CertModel = mongoose.model("certs", CertSchema);
