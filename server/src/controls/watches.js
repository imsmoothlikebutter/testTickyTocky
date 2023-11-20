// Import the WatchModel and serial control functions
import { WatchModel } from "../models/Watches.js";
import {
  createSerial,
  updateSerial,
  deleteSerial,
} from "../controls/serials.js";

// Function to create a new watch
const createWatch = async (watch, session) => {
  try {
    // Destructure watch object for its properties
    const {
      case_serial,
      movement_serial,
      dial,
      bracelet_strap,
      crown_pusher,
      brand,
      model_no,
      model_name,
      movement,
      case_material,
      bracelet_strap_material,
      yop,
      gender,
    } = watch;

    // Define session options based on whether a session is provided
    const sessionOptions = session ? { session } : {};

    // Create a serial entry for the watch
    const serial = {
      case_serial,
      movement_serial,
      dial,
      bracelet_strap,
      crown_pusher,
    };
    const serial_id = await createSerial(serial, session);

    // Create a new WatchModel entry with the provided data
    const watchData = new WatchModel({
      brand,
      model_no,
      model_name,
      movement,
      case_material,
      bracelet_strap_material,
      yop,
      gender,
      serial_id,
    });

    // Save the watch entry and return its _id
    await watchData.save(sessionOptions);
    return watchData._id;
  } catch (error) {
    throw new Error("Something went wrong");
  }
};

// Function to get all watches
const getAllWatches = async () => {
  try {
    // Retrieve all watches from the WatchModel
    const watches = await WatchModel.find();
    return watches;
  } catch (error) {
    throw new Error("Something went wrong");
  }
};

// Function to get a watch by its ID
const getWatch = async (watchId) => {
  try {
    // Find a watch by its ID
    const watch = await WatchModel.findById(watchId);
    if (!watch) {
      throw new Error("Watch not found");
    }
    return watch;
  } catch (error) {
    throw new Error("Something went wrong");
  }
};

// Function to update an existing watch
const updateWatch = async (watch, session) => {
  try {
    // Destructure properties from the watch object
    const {
      watch_id,
      case_serial,
      movement_serial,
      dial,
      bracelet_strap,
      crown_pusher,
      brand,
      model_no,
      model_name,
      movement,
      case_material,
      bracelet_strap_material,
      yop,
      gender,
    } = watch;

    // Define session options based on whether a session is provided
    const sessionOptions = session ? { session } : {};

    // Find the watch to be updated by its ID
    const watchData = await WatchModel.findById(watch_id);
    if (!watchData) {
      throw new Error("Watch not found");
    }

    // Create a serial object with updated data
    const serial = {
      serial_id: watchData.serial_id,
      case_serial,
      movement_serial,
      dial,
      bracelet_strap,
      crown_pusher,
    };

    // Update the serial data
    await updateSerial(serial, session);

    // Update the watch data and return the updated watch
    const updatedWatch = await WatchModel.findByIdAndUpdate(
      watch_id,
      {
        brand,
        model_no,
        model_name,
        movement,
        case_material,
        bracelet_strap_material,
        yop,
        gender,
      },
      {
        new: true,
        ...sessionOptions,
      }
    );

    if (!updatedWatch) {
      throw new Error("Watch not found");
    }

    return updatedWatch._id;
  } catch (error) {
    throw new Error("Something went wrong");
  }
};

// Function to delete a watch by its ID
const deleteWatch = async (watch_id, session) => {
  try {
    // Define session options based on whether a session is provided
    const sessionOptions = session ? { session } : {};

    // Find the watch to be deleted by its ID
    const watch = await WatchModel.findById(watch_id);
    if (!watch) {
      throw new Error("Watch not found.");
    }

    // Delete the associated serial data
    await deleteSerial(watch.serial_id, session);

    // Remove the watch entry and return the deleted watch
    const deletedWatch = await WatchModel.findByIdAndRemove(watch_id, {
      ...sessionOptions,
    });

    if (!deletedWatch) {
      throw new Error("Watch not found");
    }

    return deletedWatch;
  } catch (error) {
    throw new Error("Something went wrong");
  }
};

// Export the functions for external use
export { createWatch, getAllWatches, getWatch, updateWatch, deleteWatch };
