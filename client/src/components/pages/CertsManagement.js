import React, { useState } from "react";
import { Button } from "antd";
import { CertForm } from "./CertForm";
import { CertTable } from "../pages/CertTable";
import { ExcelUploadModal } from "../pages/ExcelUploadModal";

// CertsManagement component manages certification-related functionality for admins.
export const CertsManagement = () => {
  // State variables to manage modals
  const [modalVisible, setModalVisible] = useState(false);
  const [excelUploadModalVisible, setExcelUploadModalVisible] = useState(false);

  // State variable to trigger certification data refetch
  const [refetchCertForAdmin, setRefetchCertForAdmin] = useState(false);

  // Function to show the Create New Certification modal
  const showModal = () => {
    setModalVisible(true);
  };

  // Function to show the Bulk Upload Certifications modal
  const showExcelUploadModal = () => {
    setExcelUploadModalVisible(true);
  };

  // Function to handle closing of modals
  const handleCancel = () => {
    setModalVisible(false);
    setExcelUploadModalVisible(false);
  };

  return (
    <div>
      {/* Render the ExcelUploadModal component */}
      <ExcelUploadModal
        visible={excelUploadModalVisible}
        onCancel={handleCancel}
        setRefetchCertForAdmin={setRefetchCertForAdmin}
      />

      {/* Render the CertForm component for creating new certifications */}
      <CertForm
        visible={modalVisible}
        onCancel={handleCancel}
        setRefetchCertForAdmin={setRefetchCertForAdmin}
      />

      {/* Render the CertTable component for displaying certifications (admin view) */}
      <CertTable
        role="admin"
        setRefetchCertForAdmin={setRefetchCertForAdmin}
        refetchCertForAdmin={refetchCertForAdmin}
      />

      {/* Button to trigger the Create New Certification modal */}
      <Button type="primary" onClick={showModal}>
        Create New Certification
      </Button>

      {/* Button to trigger the Bulk Upload Certifications modal */}
      <Button type="primary" onClick={showExcelUploadModal}>
        Bulk Upload Certifications
      </Button>
    </div>
  );
};
