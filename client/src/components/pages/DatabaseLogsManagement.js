import React, { useEffect, useState } from "react";
import { Table, Input, message } from "antd";
import { getAllDatabaseLogs } from "../../api/databaseLogs";

export const DatabaseLogsManagement = () => {
  // State variables to store data and manage the component's behavior
  const [databaseLogs, setDatabaseLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5); // Define the number of items per page
  const [searchText, setSearchText] = useState(""); // Store the search input text
  const [originalDatabaseLogs, setOriginalDatabaseLogs] = useState([]); // Store the original data before filtering

  // Define the table columns with titles, data keys, and sorting functions
  const columns = [
    {
      title: "Certificate ID",
      dataIndex: "cert_id",
      key: "cert_id",
      sorter: (a, b) => a.cert_id.localeCompare(b.cert_id),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Owner",
      dataIndex: "user_email",
      key: "user_email",
      sorter: (a, b) => a.user_email.localeCompare(b.user_email),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Query Type",
      dataIndex: "query_type",
      key: "query_type",
      sorter: (a, b) => a.query_type.localeCompare(b.query_type),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Date Time",
      dataIndex: "timestamps",
      key: "timestamps",
      sorter: (a, b) => a.timestamps.localeCompare(b.timestamps),
      sortDirections: ["ascend", "descend"],
      render: (timestamps) => {
        const date = new Date(timestamps);

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const formattedDate = `${day}-${month}-${year} ${hours}:${minutes}`;
        return formattedDate;
      },
    },
  ];

  // useEffect hook to fetch database logs when the component mounts
  useEffect(() => {
    const fetchDatabaseLogs = async () => {
      try {
        setLoading(true);
        const response = await getAllDatabaseLogs();
        if (response.success) {
          const data = response.logs;
          // Transform the data and set it in the state
          const modifiedData = data.map((item) => ({
            // Map the data to match the table columns
            _id: item._id,
            cert_id: item.certificate_id ? item.certificate_id.cert_id : "N/A",
            user_email: item.certificate_id
              ? item.certificate_id.user_email
              : "N/A",
            query_type: item.query_type,
            timestamps: item.timestamps,
          }));
          setDatabaseLogs(modifiedData);
          setOriginalDatabaseLogs(modifiedData); // Save the original data for filtering
          setLoading(false);
        } else {
          message.error("Database logs failed to retrieve");
        }
      } catch (error) {
        message.error("Something went wrong");
        setLoading(false);
      }
    };

    fetchDatabaseLogs(); // Trigger the data fetching when the component mounts
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (value) => {
    setSearchText(value);
    filterDatabaseLogs(value);
  };

  // Function to filter database logs based on the search text
  const filterDatabaseLogs = (searchText) => {
    if (searchText) {
      const lowerCaseSearchText = searchText.toLowerCase();
      // Filter the data based on the search text
      const filteredDatabaseLogs = originalDatabaseLogs.filter(
        (databaseLog) => {
          return (
            // Include items that match the search text in cert_id, user_email, or IP address
            databaseLog.cert_id.toLowerCase().includes(lowerCaseSearchText) ||
            databaseLog.user_email.toLowerCase().includes(lowerCaseSearchText)
          );
        }
      );
      setDatabaseLogs(filteredDatabaseLogs); // Set the filtered data
    } else {
      // If search text is empty, show the original data
      setDatabaseLogs(originalDatabaseLogs);
    }
    setCurrentPage(1); // Reset the current page to 1 after filtering
  };

  return (
    <>
      <div>
        <Input
          placeholder="Search by Certificate ID or Owner"
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)} // Attach the search handler
        />
        <Table
          columns={columns}
          dataSource={databaseLogs}
          loading={loading}
          rowKey="_id"
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: databaseLogs.length,
            onChange: handlePageChange, // Attach the page change handler
            style: { textAlign: "center" },
          }}
        />
      </div>
    </>
  );
};
