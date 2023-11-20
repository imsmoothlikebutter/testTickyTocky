import React, { useState } from "react";
import { Button, Input, message } from "antd";
import { pdfjs } from "react-pdf";
import { getCert } from "../../api/certs";

import "../styles/Home.css";

// Home component for searching and viewing certificates
export const Home = () => {
  // State variables for search input, certificate details, and PDF data
  const [searchInput, setSearchInput] = useState("");
  const [certificate, setCertificate] = useState(null);
  const [pdfData, setPdfData] = useState(null);

  // Set up the worker source for PDF rendering
  pdfjs.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.js";

  // Handle the search for a certificate when the search button is clicked
  const handleSearch = async (e) => {
    e.preventDefault();

    // Validate the format of the certificate ID
    if (!validateCertID(searchInput)) {
      message.error(
        "Certificate ID must be exactly 16 uppercase letters and digits"
      );
      return;
    } else {
      try {
        // Call the API to retrieve certificate data
        const response = await getCert(searchInput);

        if (response.success) {
          // Set the retrieved certificate data and PDF content
          setCertificate(response.cert);
          setPdfData(response.pdf_content);
        } else {
          message.error("No such certificate");
        }
      } catch (error) {
        setCertificate(null);
        setPdfData(atob(null));
        message.error("Something went wrong");
      }
    }
  };

  // Validate the format of the certificate ID
  const validateCertID = (certID) => {
    const certIDRegex = /^[A-Z0-9]{16}$/;
    return certIDRegex.test(certID);
  };

  // Open a new window to view the PDF content
  const viewPDF = () => {
    const pdfWindow = window.open(``, "_blank", "height=1000,width=800");

    if (!pdfWindow) {
      alert("Please allow pop-ups for this website");
    }

    pdfWindow.document.write(
      "<iframe width='100%' height='100%' src='data:application/pdf;base64, " +
        encodeURI(pdfData) +
        "'></iframe>"
    );
  };

  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="home">
      <div className="search-bar">
        <Input
          placeholder="Search..."
          className="search-input"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onPressEnter={handleSearch}
          allowClear
          maxLength={16}
        />
      </div>
      <div className="cert-info">
        {searchInput && certificate ? (
          <div>
            <h3>Certificate Information</h3>
            <p>Certificate ID: {certificate.cert_id}</p>
            <p>Issuer: {certificate.validated_by}</p>
            <p>Issue Date: {formatDate(certificate.issue_date)}</p>
            <Button type="primary" onClick={viewPDF}>
              View Certificate
            </Button>
          </div>
        ) : searchInput && !certificate ? (
          <p>No certificate found.</p>
        ) : null}
      </div>
    </div>
  );
};
