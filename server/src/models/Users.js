import mongoose from "mongoose";

// Define the schema for user data
const UserSchema = new mongoose.Schema({
  f_name: {
    type: String,
    maxlength: 50,
    required: true,
  },
  l_name: {
    type: String,
    maxlength: 50,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure email uniqueness
    match: [
      /^[a-zA-Z0-9._%+-]{1,64}@gmail\.com$/, // Use a regular expression for valid Gmail addresses
      "Please use a valid email address.",
    ],
  },
  email_verified: {
    type: Boolean,
    default: false, // Default email verification status to false
    required: true,
  },
  encrypted_password: {
    type: String,
    maxlength: 255,
    required: true,
  },
  salt: {
    type: String,
    required: false, // Optional salt field
  },
  role: {
    type: String,
    required: true,
    default: "member", // Default user role to "member"
  },
  account_lock: {
    type: Boolean,
    default: false, // Default account lock status to false
    required: true,
  },
});

// Create the UserModel using the schema
export const UserModel = mongoose.model("users", UserSchema);
