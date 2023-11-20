import React, { useEffect, useState, useCallback } from "react";
import { Table, Button, Input, Popconfirm, message } from "antd";
import {
  getAllCerts,
  getCert,
  deleteCert,
  getCertsByEmail,
} from "../../api/certs";
import { TransferOwnershipModal } from "./TransferOwnershipModal";
import { getAllUsers } from "../../api/users";

// CertTable component displays a table of certificates and provides various actions based on the user's role.
export const CertTable = ({
  role,
  email,
  setRefetchCertForAdmin,
  refetchCertForAdmin,
}) => {
  // State variables
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [searchText, setSearchText] = useState("");
  const [originalCerts, setOriginalCerts] = useState([]);
  const [transferOwnershipModalVisible, setTransferOwnershipModalVisible] =
    useState(false);
  const [emails, setUserEmails] = useState([]);
  const [selectedCert, setSelectedCert] = useState([]);
  const [refetchCert, setRefetchCert] = useState(false);

  // Define columns for the table
  const columns = [
    {
      title: "Certificate ID",
      dataIndex: "cert_id",
      key: "cert_id",
      sorter: (a, b) => a.cert_id.localeCompare(b.cert_id),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "User Email",
      dataIndex: "user_email",
      key: "user_email",
      sorter: (a, b) => a.user_email.localeCompare(b.user_email),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (text, cert) => (
        <div>
          {/* Button to view the PDF content of the certificate */}
          <Button type="primary" onClick={() => handleViewPDF(cert)}>
            View PDF
          </Button>

          {/* Button to download the PDF of the certificate */}
          <Button type="primary" onClick={() => handleDownloadPDF(cert)}>
            Download PDF
          </Button>

          {/* Delete button, only shown to admin users */}
          {role === "admin" && (
            <Popconfirm
              title="Are you sure you want to delete this certificate?"
              onConfirm={() => handleDeleteCert(cert.cert_id)}
            >
              <Button type="primary" danger>
                Delete
              </Button>
            </Popconfirm>
          )}

          {/* Transfer Ownership button, not shown to admin users */}
          {role !== "admin" && (
            <Button
              type="primary"
              onClick={() => showTransferOwnsershipModal(cert)}
            >
              Transfer Ownership
            </Button>
          )}
        </div>
      ),
    },
  ];

  // Function to fetch certificates based on the user's role
  const fetchCertificates = useCallback(async () => {
    try {
      const response =
        role === "admin"
          ? await getAllCerts()
          : await getCertsByEmail({ email });
      const data = response.certs;
      setCerts(data);
      setOriginalCerts(data);
      setRefetchCert(false);
      if (role === "admin") {
        setRefetchCertForAdmin(false);
      }
    } catch (error) {
      message.error("Something went wrong");
    }
  }, [role, email, setRefetchCert, setRefetchCertForAdmin]);

  // Function to fetch user emails (for non-admin users)
  const fetchUserEmails = useCallback(async () => {
    try {
      const response = await getAllUsers();
      if (response.success) {
        const filteredEmails = response.emails.filter((item) => item !== email);
        setUserEmails(filteredEmails);
      }
    } catch (error) {
      message.error("Something went wrong");
    }
  }, [email]);

  // Use useEffect to fetch certificates and user emails when the component mounts or when refetch is triggered
  useEffect(() => {
    setLoading(true);
    fetchCertificates();
    if (role !== "admin") {
      fetchUserEmails();
    }
    setLoading(false);
  }, [
    refetchCert,
    refetchCertForAdmin,
    fetchCertificates,
    fetchUserEmails,
    role,
  ]);

  // Function to show the Transfer Ownership modal
  const showTransferOwnsershipModal = (cert) => {
    setTransferOwnershipModalVisible(true);
    setSelectedCert(cert.cert_id);
  };

  // Function to handle the cancel action of the Transfer Ownership modal
  const handleCancel = () => {
    setTransferOwnershipModalVisible(false);
  };

  // Function to view the PDF content of a certificate
  const handleViewPDF = async (cert) => {
    try {
      setLoading(true);
      const response = await getCert(cert.cert_id);
      const pdf = response.pdf_content;
      const pdfDataURL = `data:application/pdf;base64,${pdf}`;
      const newTab = window.open();
      newTab.document.title = `${cert.cert_id}`;
      newTab.document.write(
        '<iframe width="100%" height="100%" src="' + pdfDataURL + '"></iframe>'
      );
      setLoading(false);
    } catch (error) {
      message.error("Something went wrong");
      setLoading(false);
    }
  };

  // Function to download the PDF of a certificate
  const handleDownloadPDF = async (cert) => {
    try {
      setLoading(true);
      const response = await getCert(cert.cert_id);
      const pdf = response.pdf_content;
      const pdfDataURL = `data:application/pdf;base64,${pdf}`;
      const a = document.createElement("a");
      a.href = pdfDataURL;
      a.download = `${cert.cert_id}.pdf`;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setLoading(false);
    } catch (error) {
      message.error("Something went wrong");
      setLoading(false);
    }
  };

  // Function to handle the deletion of a certificate
  const handleDeleteCert = async (certId) => {
    try {
      setLoading(true);
      const deletedCert = { cert_id: certId };
      await deleteCert(deletedCert);
      message.success("Certificate deleted successfully");
      // After deletion, refresh the certificate list
      const response = await getAllCerts();
      const data = response.certs;
      setCerts(data);
      setOriginalCerts(data);
      setLoading(false);
    } catch (error) {
      message.error("Certificate failed to delete");
      setLoading(false);
    }
  };

  // Function to handle page change in the table
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Function to handle search input and filter certificates
  const handleSearch = (value) => {
    setSearchText(value);
    filterCertificates(value);
  };

  // Function to filter certificates based on the search text
  const filterCertificates = (searchText) => {
    if (searchText) {
      const lowerCaseSearchText = searchText.toLowerCase();
      const filteredCerts = originalCerts.filter((cert) => {
        const lowerCaseCertId = cert.cert_id.toLowerCase();
        const lowerCaseUserEmail = cert.user_email.toLowerCase();
        return (
          lowerCaseCertId.includes(lowerCaseSearchText) ||
          lowerCaseUserEmail.includes(lowerCaseSearchText)
        );
      });
      setCerts(filteredCerts);
    } else {
      setCerts(originalCerts);
    }
    setCurrentPage(1);
  };

  return (
    <div>
      {/* Input for searching certificates by Certificate ID or User Email */}
      <Input
        placeholder="Search by Certificate ID or User Email"
        value={searchText}
        onChange={(e) => handleSearch(e.target.value)}
      />

      {/* Table displaying the certificates */}
      <Table
        columns={columns}
        dataSource={certs}
        loading={loading}
        rowKey="cert_id"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: certs.length,
          onChange: handlePageChange,
          style: { textAlign: "center" },
        }}
      />

      {/* Transfer Ownership modal (only for non-admin users) */}
      {role !== "admin" && (
        <TransferOwnershipModal
          visible={transferOwnershipModalVisible}
          onCancel={handleCancel}
          emails={emails}
          user_email={email}
          cert_id={selectedCert}
          setRefetchCert={setRefetchCert}
        />
      )}
    </div>
  );
};
