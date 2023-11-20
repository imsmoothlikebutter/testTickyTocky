import React, { useEffect, useState } from "react";
import { Table, Input, message } from "antd";
import { getAllAccessLogs } from "../../api/accessLogs";

export const AccessLogsManagement = () => {
  // State variables to store data and manage the component's behavior
  const [accessLogs, setAccessLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(2); // Define the number of items per page
  const [searchText, setSearchText] = useState(""); // Store the search input text
  const [originalAccessLogs, setOriginalAccessLogs] = useState([]); // Store the original data before filtering

  // Define the table columns with titles, data keys, and sorting functions
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      sorter: (a, b) => a.role.localeCompare(b.role),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "IP Address",
      dataIndex: "ip_address",
      key: "ip_address",
      sorter: (a, b) => a.ip_address.localeCompare(b.ip_address),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "User Agent",
      dataIndex: "user_agent",
      key: "user_agent",
      sorter: (a, b) => a.user_agent.localeCompare(b.user_agent),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Status Code",
      dataIndex: "http_status_codes",
      key: "http_status_codes",
    },
    {
      title: "URL",
      dataIndex: "requested_url",
      key: "requested_url",
      sorter: (a, b) => a.requested_url.localeCompare(b.requested_url),
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

  // useEffect hook to fetch access logs when the component mounts
  useEffect(() => {
    const fetchAccessLogs = async () => {
      try {
        setLoading(true);
        const response = await getAllAccessLogs();
        if (response.success) {
          const data = response.logs;
          // Transform the data and set it in the state
          const modifiedData = data.map((item) => ({
            // Map the data to match the table columns
            _id: item._id,
            name: `${item.user_id ? item.user_id.f_name : "N/A"} ${
              item.user_id ? item.user_id.l_name : "N/A"
            }`,
            email: item.user_id ? item.user_id.email : "N/A",
            role: item.user_id ? item.user_id.role : "N/A",
            ip_address: item.ip_address,
            user_agent: item.user_agent,
            http_status_codes: item.http_status_codes,
            requested_url: item.requested_url,
            timestamps: item.timestamps,
          }));
          setAccessLogs(modifiedData);
          setOriginalAccessLogs(modifiedData); // Save the original data for filtering
          setLoading(false);
        } else {
          message.error("Access logs failed to retrieve");
        }
      } catch (error) {
        message.error("Something went wrong");
        setLoading(false);
      }
    };

    fetchAccessLogs(); // Trigger the data fetching when the component mounts
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (value) => {
    setSearchText(value);
    filterAccessLogs(value);
  };

  // Function to filter access logs based on the search text
  const filterAccessLogs = (searchText) => {
    if (searchText) {
      const lowerCaseSearchText = searchText.toLowerCase();
      // Filter the data based on the search text
      const filteredAccessLogs = originalAccessLogs.filter((accessLog) => {
        return (
          // Include items that match the search text in name, email, or IP address
          accessLog.name.toLowerCase().includes(lowerCaseSearchText) ||
          accessLog.email.toLowerCase().includes(lowerCaseSearchText) ||
          accessLog.ip_address.toLowerCase().includes(lowerCaseSearchText)
        );
      });
      setAccessLogs(filteredAccessLogs); // Set the filtered data
    } else {
      // If search text is empty, show the original data
      setAccessLogs(originalAccessLogs);
    }
    setCurrentPage(1); // Reset the current page to 1 after filtering
  };

  return (
    <>
      <div>
        <Input
          placeholder="Search by Name, Email or IP Address"
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)} // Attach the search handler
        />
        <Table
          columns={columns}
          dataSource={accessLogs}
          loading={loading}
          rowKey="_id"
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: accessLogs.length,
            onChange: handlePageChange, // Attach the page change handler
            style: { textAlign: "center" },
          }}
        />
      </div>
    </>
  );
};
