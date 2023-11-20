import mongoose from "mongoose";

// Define the schema for OTP (One-Time Password) entries
const OtpSchema = new mongoose.Schema({
  user_email: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  timestamps: {
    type: Date,
    required: true,
    default: Date.now,
    index: true,
  },
  is_used: {
    type: Boolean,
    default: false,
    required: true,
  },
});

// Create an index on the 'timestamps' field to automatically expire entries after 180 seconds
OtpSchema.path("timestamps").index({ expires: 180 });

// Create the OtpModel using the schema
export const OtpModel = mongoose.model("otp", OtpSchema);
