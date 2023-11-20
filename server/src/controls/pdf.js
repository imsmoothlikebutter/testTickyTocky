// Import required libraries
import { PDFDocument, rgb } from "pdf-lib";
import fs from "fs/promises";

// Function to create a PDF document based on provided data
async function createPdfContent(data) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([841.89, 595.28]); // Create a new PDF page with dimensions

  // Fetch and embed a watermark image onto the page
  const watermarkImageBytes = await fetchWatermarkImage();
  const { width, height } = page.getSize();
  const watermarkImage = await pdfDoc.embedPng(watermarkImageBytes);
  const imageWidth = 600;
  const imageHeight = 300;
  const imageX = width / 2 - imageWidth / 2;
  const imageY = height / 2 - imageHeight / 2;
  page.drawImage(watermarkImage, {
    x: imageX,
    y: imageY,
    width: imageWidth,
    height: imageHeight,
    opacity: 0.1,
  });

  // Add title and content to the PDF page
  const fontSize = 26;
  const text = "WATCH CERTIFICATE";

  page.drawText(text, {
    x: 60,
    y: height - 60,
    size: fontSize,
    color: rgb(0, 0, 0),
    font: await pdfDoc.embedFont("Times-BoldItalic"),
  });

  // Define the content and formatting for the certificate details, watch details, and serial number details
  const lines = [
    { text: "Certificate Details", isBold: true },
    `Certificate ID: ${data.cert_id}`,
    `Email: ${data.user_email}`,
    `Validated By: ${data.validated_by}`,
    `Date of Validation: ${formatDateDDMMYYYY(data.date_of_validation)}`,
    `Issue Date: ${formatDateDDMMYYYY(data.issue_date)}`,
    `Expiry Date: ${formatDateDDMMYYYY(data.expiry_date)}`,
    `Remarks: ${data.remarks}`,
    { text: "Watch Details", isBold: true },
    `Brand: ${data.watch_id.brand}`,
    `Model Numbers: ${data.watch_id.model_no}`,
    `Model Name: ${data.watch_id.model_name}`,
    `Movement: ${data.watch_id.movement}`,
    `Case Material: ${data.watch_id.case_material}`,
    `Bracelet/Strap Material: ${data.watch_id.bracelet_strap_material}`,
    `Year of Production: ${formatYear(data.watch_id.yop)}`,
    `Gender: ${data.watch_id.gender}`,
    { text: "Serial Number Details", isBold: true },
    `Case Serial Numbers: ${data.watch_id.serial_id.case_serial}`,
    `Model Numbers: ${data.watch_id.serial_id.movement_serial}`,
    `Model Name: ${data.watch_id.serial_id.dial}`,
    `Movement: ${data.watch_id.serial_id.bracelet_strap}`,
    `Case Material: ${data.watch_id.serial_id.crown_pusher}`,
  ];

  // Start drawing the text on the page
  let startY = height - 100;
  for (const line of lines) {
    if (typeof line === "string") {
      // Draw regular text lines
      page.drawText(line, {
        x: 60,
        y: startY,
        size: 11,
        color: rgb(0, 0, 0),
        font: await pdfDoc.embedFont("Courier"),
      });
    } else if (line.isBold) {
      // Draw bold text lines
      page.drawText(line.text, {
        x: 60,
        y: startY,
        size: 20,
        font: await pdfDoc.embedFont("Helvetica-Bold"),
        color: rgb(0, 0, 0),
      });
    }
    startY -= 20;
  }
  // Set the PDF title and save the PDF document
  pdfDoc.setTitle(data.cert_id);
  const pdfBytes = await pdfDoc.save();
  // Convert the PDF bytes to base64 and return
  return Buffer.from(pdfBytes).toString("base64");
}

// Function to fetch a watermark image
async function fetchWatermarkImage() {
  try {
    // Read the watermark image file and return its bytes
    const imageBytes = await fs.readFile("../app/src/img/logo.png");
    return new Uint8Array(imageBytes);
  } catch (error) {
    throw new Error("Something went wrong");
  }
}

// Function to format a date as DD-MM-YYYY
function formatDateDDMMYYYY(date) {
  date = new Date(date);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

// Function to format a year
function formatYear(date) {
  date = new Date(date);
  const year = date.getFullYear();
  return year;
}

// Export the createPdfContent function for use in other parts of the application
export { createPdfContent };
