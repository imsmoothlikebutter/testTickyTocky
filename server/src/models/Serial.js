import mongoose from "mongoose";

// Define the schema for serial numbers
const SerialSchema = new mongoose.Schema({
  case_serial: {
    type: String,
    maxlength: 8,
    required: true,
  },
  movement_serial: {
    type: String,
    maxlength: 12,
    required: true,
  },
  dial: {
    type: String,
    maxlength: 8,
    required: true,
  },
  bracelet_strap: {
    type: String,
    maxlength: 8,
  },
  crown_pusher: {
    type: String,
    maxlength: 7,
  },
});

// Create the SerialModel using the schema
export const SerialModel = mongoose.model("serials", SerialSchema);
