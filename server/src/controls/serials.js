// Import the SerialModel from the specified module
import { SerialModel } from "../models/Serial.js";

// Function to create a new serial entry with the provided data
const createSerial = async (serial, session) => {
  try {
    // Configure session options if provided
    const sessionOptions = session ? { session } : {};

    // Extract serial information from the input
    const { case_serial, movement_serial, dial, bracelet_strap, crown_pusher } =
      serial;

    // Create a new SerialModel instance with the extracted data
    const serialData = new SerialModel({
      case_serial,
      movement_serial,
      dial,
      bracelet_strap,
      crown_pusher,
    });

    // Save the serial data to the database using the session options
    await serialData.save(sessionOptions);

    // Return the ID of the newly created serial entry
    return serialData._id;
  } catch (error) {
    // Handle any errors that occur during serial creation
    throw new Error("Something went wrong");
  }
};

// Function to retrieve all serial entries from the database
const getAllSerials = async () => {
  try {
    // Retrieve and return all serial entries from the SerialModel
    return await SerialModel.find();
  } catch (error) {
    // Handle any errors that occur during retrieval
    throw new Error("Something went wrong");
  }
};

// Function to get a serial entry by its ID
const getSerial = async (serialId) => {
  try {
    // Find the serial entry by its ID
    const serial = await SerialModel.findById(serialId);

    // Check if the serial entry exists, if not, throw an error
    if (!serial) {
      throw new Error("Serial Numbers not found");
    }

    // Return the found serial entry
    return serial;
  } catch (error) {
    // Handle any errors that occur during retrieval
    throw new Error("Something went wrong");
  }
};

// Function to update a serial entry with the provided data
const updateSerial = async (serial, session) => {
  try {
    // Extract serial information and session options if provided
    const {
      serial_id,
      case_serial,
      movement_serial,
      dial,
      bracelet_strap,
      crown_pusher,
    } = serial;
    const sessionOptions = session ? { session } : {};

    // Find the existing serial entry by its ID
    const serialData = await SerialModel.findById(serial_id);
    if (!serialData) throw new Error("Serial Numbers not found");

    // Update the serial entry with the provided data and return the updated entry
    const updatedSerial = await SerialModel.findOneAndUpdate(
      { _id: serial_id },
      { case_serial, movement_serial, dial, bracelet_strap, crown_pusher },
      { new: true, ...sessionOptions }
    );

    // Check if the update was successful, if not, throw an error
    if (!updatedSerial) {
      throw new Error("Serial Numbers not found");
    }

    // Return the ID of the updated serial entry
    return updatedSerial._id;
  } catch (error) {
    // Handle any errors that occur during the update
    throw new Error("Something went wrong");
  }
};

// Function to delete a serial entry by its ID
const deleteSerial = async (serialId, session) => {
  try {
    // Configure session options if provided
    const sessionOptions = session ? { session } : {};

    // Find the serial entry to be deleted by its ID
    const serial = await SerialModel.findById(serialId);

    // Check if the serial entry exists, if not, throw an error
    if (!serial) throw new Error("Serial Numbers not found");

    // Delete the serial entry and return the deleted entry
    const deletedSerial = await SerialModel.findByIdAndRemove(serialId, {
      ...sessionOptions,
    });

    // Check if the deletion was successful, if not, throw an error
    if (!deletedSerial) {
      throw new Error("Something went wrong");
    }

    // Return the deleted serial entry
    return deletedSerial;
  } catch (error) {
    // Handle any errors that occur during deletion
    throw new Error("Something went wrong");
  }
};

// Export the functions for use in other parts of the application
export { createSerial, getAllSerials, getSerial, updateSerial, deleteSerial };
