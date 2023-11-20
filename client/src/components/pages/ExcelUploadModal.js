import React, { useState, useEffect } from "react";
import { Modal, Form, Button, message } from "antd";
import { createCerts } from "../../api/certs";
import * as XLSX from "xlsx";
import { validateExcelData } from "../../utils/validation";

// ExcelUploadModal component for uploading certificates from an Excel file
export const ExcelUploadModal = ({
  visible,
  onCancel,
  setRefetchCertForAdmin,
}) => {
  // State variables
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setSubmitting] = useState(false);

  // Reset form fields and feedback when the modal visibility changes
  useEffect(() => {
    if (!visible) {
      setSelectedFile(null);
      setSubmitting(false);
    }
  }, [visible]);

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  // Handle form submission
  const handleFormSubmit = async () => {
    if (!selectedFile) {
      // Show an error message if no Excel file is selected
      message.error("Excel file is required");
      return;
    }
    setSubmitting(true);
    try {
      const fileData = await parseExcelFile(selectedFile);
      if (fileData.length > 0) {
        const response = await createCerts(fileData);
        if (response.success) {
          // Show a success message after successful certificate creation
          message.success("Certificates created successfully");
          // Trigger a refetch of certificates for admin
          setRefetchCertForAdmin(true);
          // Close the modal upon successful submission
          onCancel();
        } else {
          // Show an error message if certificate creation fails
          message.error("Certificates failed to create");
        }
      }
    } catch (error) {
      // Show an error message if an error occurs during certificate creation
      message.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  // Parse Excel file data and return it as an array of objects
  const parseExcelFile = async (file) => {
    return new Promise(async (resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
            raw: false,
          });

          // Assuming the first row contains column headers (keys)
          const headers = jsonData[0];
          const jsonArray = jsonData.slice(1).map((row) => {
            const obj = {};
            headers.forEach((header, index) => {
              obj[header] = row[index];
            });
            return obj;
          });

          const validationErrors = validateExcelData(jsonArray);

          if (validationErrors.length === 0) {
            resolve(jsonArray);
          } else {
            const uniqueValidationErrors = new Set(validationErrors);
            const uniqueErrorsArray = Array.from(uniqueValidationErrors);
            for (const uniqueError of uniqueErrorsArray) {
              // Show error messages for validation errors
              message.error({
                content: uniqueError,
                duration: 10,
              });
            }
            reject(uniqueErrorsArray);
          }
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsArrayBuffer(file);
    });
  };

  return (
    <Modal
      title="Upload Excel File"
      open={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Form>
        <Form.Item label="Select Excel File">
          {/* Input element for selecting an Excel file */}
          <input type="file" accept=".xlsx" onChange={handleFileChange} />
        </Form.Item>
        <Form.Item>
          {/* Submit button for uploading the Excel file */}
          <Button
            type="primary"
            onClick={handleFormSubmit}
            disabled={isSubmitting}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
