import { CertModel } from "../models/Certs.js";
import { SerialModel } from "../models/Serial.js";
import { UserModel } from "../models/Users.js";
import {
  WATCH_BRANDS,
  WATCH_MOVEMENTS,
  WATCH_CASE_MATERIALS,
  BRACELET_STRAP_MATERIALS,
  GENDER,
} from "../constants.js";

// AUTH
const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#%^&*()\-_+]).{12,64}$/;

  return passwordRegex.test(password);
};

const validateName = (firstName, lastName) => {
  const nameRegex = /^[A-Za-z\s-']{2,50}$/;

  if (firstName && lastName) {
    return nameRegex.test(firstName) && nameRegex.test(lastName);
  }

  return false;
};

const checkDupEmail = async (email) => {
  const dupEmail = await UserModel.findOne({ email });
  return dupEmail ? true : false;
};

export const validateRegister = async (req, res, next) => {
  const { email, password, f_name, l_name } = req.body;

  const isDupEmail = await checkDupEmail(email);

  const errors = {
    conflict_409: [],
    badRequest_400: [],
  };

  if (isDupEmail) {
    errors.conflict_409.push(
      "A user with this email address already exists. Please use a different email address."
    );
  }

  if (!validateEmail(email)) {
    errors.badRequest_400.push(
      "Invalid email address. Please enter a valid Gmail address."
    );
  }

  if (!validatePassword(password)) {
    errors.badRequest_400.push(
      "Invalid password. Password must be within 12 to 64 characters long, and include a combination of uppercase characters, lowercase characters, numbers, and special characters."
    );
  }

  if (!validateName(f_name, l_name)) {
    errors.badRequest_400.push(
      "Invalid name. Please provide a valid name with 2 to 50 characters, including letters, spaces, hyphens, and apostrophes."
    );
  }

  // Check for any validation errors
  if (errors.conflict_409.length > 0 || errors.badRequest_400.length > 0) {
    const response = {};

    if (errors.conflict_409.length > 0) {
      response.conflict_409 = errors.conflict_409;
    }

    if (errors.badRequest_400.length > 0) {
      response.badRequest_400 = errors.badRequest_400;
    }

    return res.status(400).json(response);
  }

  next();
};

// SERIAL_NUMBERS
const validateCaseSerial = (caseSerial) => {
  const caseSerialRegex = /^[A-Za-z0-9]{8}$/;
  return caseSerialRegex.test(caseSerial);
};

const validateMovementSerial = (movementSerial) => {
  const movementSerialRegex = /^[A-Za-z0-9]{10,12}$/;
  return movementSerialRegex.test(movementSerial);
};

const validateDial = (dial) => {
  const dialRegex = /^[A-Za-z0-9]{8}$/;
  return dialRegex.test(dial);
};

const validateBraceletStrap = (braceletStrap) => {
  const braceletStrapRegex = /^[A-Za-z0-9]{6,8}$/;
  return braceletStrapRegex.test(braceletStrap);
};

const validateCrownPusher = (crownPusher) => {
  const crownPusherRegex = /^[A-Za-z0-9]{5,7}$/;
  return crownPusherRegex.test(crownPusher);
};

const checkDupSerial = async (
  case_serial,
  movement_serial,
  dial,
  bracelet_strap,
  crown_pusher
) => {
  const dupSerial = await SerialModel.findOne({
    $or: [
      { case_serial },
      { movement_serial },
      { dial },
      { bracelet_strap },
      { crown_pusher },
    ],
  });
  return dupSerial ? true : false;
};

// WATCHES
const validateBrand = (brand) => {
  return WATCH_BRANDS.includes(brand);
};

const validateModelNumber = (modelNumber) => {
  const modelNumberRegex = /[A-Za-z0-9-]{10}/;
  return modelNumberRegex.test(modelNumber);
};

const validateModelName = (modelName) => {
  const modelNameRegex = /^[A-Za-z0-9\s-]+$/;
  return modelNameRegex.test(modelName);
};

const validateMovement = (movement) => {
  return WATCH_MOVEMENTS.includes(movement);
};

const validateCaseMaterial = (caseMaterial) => {
  return WATCH_CASE_MATERIALS.includes(caseMaterial);
};

const validateBraceletStrapMaterial = (braceletStrapMaterial) => {
  return BRACELET_STRAP_MATERIALS.includes(braceletStrapMaterial);
};

const validateYOP = (yop) => {
  const year = parseInt(yop);
  const current = new Date().getFullYear();

  if (year < 1969 || year > current) {
    return false;
  }
  return true;
};

// CERT
const validateValidatedBy = (validatedBy) => {
  const validatedByRegex = /^[A-Za-z\s-']{2,50}$/;
  return validatedByRegex.test(validatedBy);
};

const checkPastDate = (dateOfValidation, issueDate) => {
  const currentDate = new Date();
  if (dateOfValidation >= currentDate || issueDate >= currentDate) {
    return false;
  }
  return true;
};

const checkFutureDate = (expiryDate) => {
  const currentDate = new Date();
  if (expiryDate <= currentDate) {
    return false;
  }
  return true;
};

const validateRemarks = (remarks) => {
  const remarksRegex = /^.{1,255}$/;
  return remarksRegex.test(remarks);
};

export const checkDupCertId = async (cert_id) => {
  const dupCertId = await CertModel.findOne({ cert_id });
  return dupCertId ? true : false;
};

export const validateCert = async (req, res, next) => {
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
    user_email,
    validated_by,
    date_of_validation,
    issue_date,
    expiry_date,
    remarks,
  } = req.body;

  const isDupSerial = await checkDupSerial(
    case_serial,
    movement_serial,
    dial,
    bracelet_strap,
    crown_pusher
  );

  const isDupEmail = await checkDupEmail(user_email);

  const isPastDate = checkPastDate(date_of_validation, issue_date);

  const isFutureDate = checkFutureDate(expiry_date);

  const errors = {
    conflict_409: [],
    badRequest_400: [],
    notFound_404: [],
  };

  if (!isDupEmail) {
    errors.notFound_404.push(
      "User does not exist. Please provide a valid email."
    );
  }

  if (isDupSerial) {
    errors.conflict_409.push(
      "A record with these serial numbers already exists. Please check and provide unique serial numbers."
    );
  }

  if (!validateCaseSerial(case_serial)) {
    errors.badRequest_400.push(
      "Case serial numbers must be 8 characters long and contain only letters and numbers."
    );
  }

  if (!validateMovementSerial(movement_serial)) {
    errors.badRequest_400.push(
      "Movement serial numbers must be 10-12 characters long and contain only letters and numbers."
    );
  }

  if (!validateDial(dial)) {
    errors.badRequest_400.push(
      "Dial serial numbers must be 8 characters long and contain only letters and numbers."
    );
  }

  if (!validateBraceletStrap(bracelet_strap)) {
    errors.badRequest_400.push(
      "Bracelet or strap serial numbers must be 6-8 characters long and contain only letters and numbers."
    );
  }

  if (!validateCrownPusher(crown_pusher)) {
    errors.badRequest_400.push(
      "Crown pusher serial numbers must be 5-7 characters long and contain only letters and numbers."
    );
  }

  if (!validateBrand(brand)) {
    errors.badRequest_400.push(
      `Invalid brand: ${brand}. Please choose from the list of valid watch brands.`
    );
  }

  if (!validateModelNumber(model_no)) {
    errors.badRequest_400.push(
      "Model number must consist of 10 alphanumeric characters or hyphens."
    );
  }

  if (!validateModelName(model_name)) {
    errors.badRequest_400.push(
      "Model name must contain only letters, numbers, and hyphens, separated by spaces."
    );
  }

  if (!validateMovement(movement)) {
    errors.badRequest_400.push(
      `Invalid movmement: ${movement}. Please choose from the list of valid watch movement.`
    );
  }

  if (!validateCaseMaterial(case_material)) {
    errors.badRequest_400.push(
      `Invalid case material: ${case_material}. Please choose from the list of valid watch case material.`
    );
  }

  if (!validateBraceletStrapMaterial(bracelet_strap_material)) {
    errors.badRequest_400.push(
      `Invalid case material: ${bracelet_strap_material}. Please choose from the list of valid watch bracelet/strap material.`
    );
  }

  if (!validateYOP(yop)) {
    errors.badRequest_400.push(
      `Invalid year: ${yop}. Please choose from the list of valid year of production.`
    );
  }

  if (!validateValidatedBy(validated_by)) {
    errors.badRequest_400.push(
      "Validated by must be between 2 and 50 characters, using only letters, spaces, hyphens, and single quotes."
    );
  }

  if (!isPastDate) {
    errors.badRequest_400.push(
      "Date of validation and issue date cannot be current or future date."
    );
  }

  if (!isFutureDate) {
    errors.badRequest_400.push("Expiry date cannot be current or past date.");
  }

  // Date validations
  if (date_of_validation >= issue_date) {
    errors.badRequest_400.push(
      "The Date of Validation must occur before the Issue Date."
    );
  }

  if (date_of_validation >= expiry_date) {
    errors.badRequest_400.push(
      "The Date of Validation must occur before the Expiry Date."
    );
  }

  if (issue_date >= expiry_date) {
    errors.badRequest_400.push(
      "The Issue Date must occur before the Expiry Date."
    );
  }

  if (!validateRemarks(remarks)) {
    errors.badRequest_400.push(
      "Remarks must not exceed 255 characters in length."
    );
  }

  // Check for any validation errors
  if (
    errors.conflict_409.length > 0 ||
    errors.badRequest_400.length > 0 ||
    errors.notFound_404.length > 0
  ) {
    const response = {};

    if (errors.conflict_409.length > 0) {
      response.conflict_409 = errors.conflict_409;
    }

    if (errors.badRequest_400.length > 0) {
      response.badRequest_400 = errors.badRequest_400;
    }

    if (errors.notFound_404.length > 0) {
      response.notFound_404 = errors.notFound_404;
    }

    return res.status(400).json(response);
  }

  // If there are no errors, proceed
  next();
};

export const validateCerts = async (req, res, next) => {
  const data = req.body;

  const errors = {
    conflict_409: [],
    badRequest_400: [],
    notFound_404: [],
  };

  for (let row of data) {
    const isDupSerial = await checkDupSerial(
      row.case_serial,
      row.movement_serial,
      row.dial,
      row.bracelet_strap,
      row.crown_pusher
    );

    const isDupEmail = await checkDupEmail(row.user_email);
    const isPastDate = checkPastDate(row.date_of_validation, row.issue_date);
    const isFutureDate = checkFutureDate(row.expiry_date);

    if (!isDupEmail) {
      errors.notFound_404.push(
        "User does not exist. Please provide a valid email."
      );
    }

    if (isDupSerial) {
      errors.conflict_409.push(
        "A record with these serial numbers already exists. Please check and provide unique serial numbers."
      );
    }

    if (!validateCaseSerial(row.case_serial)) {
      errors.badRequest_400.push("Invalid Case serial numbers.");
    }

    if (!validateMovementSerial(row.movement_serial)) {
      errors.badRequest_400.push("Invalid Movement serial numbers.");
    }

    if (!validateDial(row.dial)) {
      errors.badRequest_400.push("Invalid Dial serial numbers.");
    }

    if (!validateBraceletStrap(row.bracelet_strap)) {
      errors.badRequest_400.push("Invalid Bracelet or strap serial numbers.");
    }

    if (!validateCrownPusher(row.crown_pusher)) {
      errors.badRequest_400.push("Invalid Crown pusher serial numbers.");
    }

    if (!validateBrand(row.brand)) {
      errors.badRequest_400.push(`Invalid brand.`);
    }

    if (!validateModelNumber(row.model_no)) {
      errors.badRequest_400.push("Invalid Model number.");
    }

    if (!validateModelName(row.model_name)) {
      errors.badRequest_400.push("Invalid Model name.");
    }

    if (!validateMovement(row.movement)) {
      errors.badRequest_400.push(`Invalid movmement.`);
    }

    if (!validateCaseMaterial(row.case_material)) {
      errors.badRequest_400.push(`Invalid case material.`);
    }

    if (!validateBraceletStrapMaterial(row.bracelet_strap_material)) {
      errors.badRequest_400.push(`Invalid bracelet/strap material.`);
    }

    if (!validateYOP(row.yop)) {
      errors.badRequest_400.push(`Invalid year of production.`);
    }

    if (!validateValidatedBy(row.validated_by)) {
      errors.badRequest_400.push("Invalid Validator.");
    }

    if (!isPastDate) {
      errors.badRequest_400.push(
        "Date of validation and issue date cannot be current or future date."
      );
    }

    if (!isFutureDate) {
      errors.badRequest_400.push("Expiry date cannot be current or past date.");
    }

    // Date validations
    if (row.date_of_validation >= row.issue_date) {
      errors.badRequest_400.push(
        "The Date of Validation must occur before the Issue Date."
      );
    }

    if (row.date_of_validation >= row.expiry_date) {
      errors.badRequest_400.push(
        "The Date of Validation must occur before the Expiry Date."
      );
    }

    if (row.issue_date >= row.expiry_date) {
      errors.badRequest_400.push(
        "The Issue Date must occur before the Expiry Date."
      );
    }

    if (!validateRemarks(row.remarks)) {
      errors.badRequest_400.push(
        "Remarks must not exceed 255 characters in length."
      );
    }
  }

  // Check for any validation errors
  if (
    errors.conflict_409.length > 0 ||
    errors.badRequest_400.length > 0 ||
    errors.notFound_404.length > 0
  ) {
    const response = {};

    if (errors.conflict_409.length > 0) {
      response.conflict_409 = errors.conflict_409;
    }

    if (errors.badRequest_400.length > 0) {
      response.badRequest_400 = errors.badRequest_400;
    }

    if (errors.notFound_404.length > 0) {
      response.notFound_404 = errors.notFound_404;
    }

    return res.status(400).json(response);
  }

  // If there are no errors, proceed
  next();
};

export const validateTransferOwnership = async (req, res, next) => {
  const { cert_id, current_email, next_email } = req.body;
  const errors = {
    conflict_409: [],
    badRequest_400: [],
    notFound_404: [],
  };

  if (current_email === next_email) {
    errors.conflict_409.push(
      "The provided email for the transfer of ownership is the same as the current email. Please choose a different email for the transfer to proceed."
    );
  }

  if (!checkDupCertId(cert_id)) {
    errors.notFound_404.push("The provided certificate does not exist.");
  }

  // Check for any validation errors
  if (
    errors.conflict_409.length > 0 ||
    errors.badRequest_400.length > 0 ||
    errors.notFound_404.length > 0
  ) {
    const response = {};

    if (errors.conflict_409.length > 0) {
      response.conflict_409 = errors.conflict_409;
    }

    if (errors.badRequest_400.length > 0) {
      response.badRequest_400 = errors.badRequest_400;
    }

    if (errors.notFound_404.length > 0) {
      response.notFound_404 = errors.notFound_404;
    }
    return res.status(400).json({ success: false, response });
  }

  next();
};
