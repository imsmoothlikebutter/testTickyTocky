import React, { useEffect, useState } from "react";
import { Table, Button, Input, Popconfirm, message } from "antd";
import { getAllUsers, getUser, deleteUser } from "../../api/users";
import { UserForm } from "./UserForm";

// UsersTable component for displaying and managing users
export const UsersTable = ({
  showModal,
  visible,
  onCancel,
  setReFetchUsers,
}) => {
  const [users, setUsers] = useState([]); // State to store the list of users
  const [user, setUser] = useState({}); // State to store the selected user
  const [loading, setLoading] = useState(false); // State to track loading state
  const [currentPage, setCurrentPage] = useState(1); // State to track the current page
  const [pageSize] = useState(5); // Number of users to display per page
  const [searchText, setSearchText] = useState(""); // State for search input
  const [originalUsers, setOriginalUsers] = useState([]); // State to store the original list of users

  const columns = [
    {
      title: "User Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (text, user) => (
        <div>
          <Button type="primary" onClick={() => handleUpdateUserButton(user)}>
            Update User
          </Button>
          <Popconfirm
            title="Associated certificates will be deleted permanently as well. Are you sure you want to delete this user?"
            onConfirm={() => handleDeleteUser(user.email)}
          >
            <Button type="primary" danger>
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  // Function to fetch the list of users from the server
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await getAllUsers();
        const data = response.emails.map((email) => ({ email }));
        setUsers(data);
        setOriginalUsers(data);
        setReFetchUsers(false);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchUser();
  }, [setReFetchUsers]);

  // Function to handle the "Update User" button click
  const handleUpdateUserButton = async (user) => {
    try {
      setLoading(true);
      const response = await getUser(user.email);
      setUser(response.user);
      showModal();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  // Function to handle user deletion
  const handleDeleteUser = async (email) => {
    try {
      setLoading(true);
      const response = await deleteUser({ email });
      if (response.success) {
        message.success("User deleted successfully");
        const response = await getAllUsers();
        const data = response.emails.map((email) => ({ email }));
        setUsers(data);
        setOriginalUsers(data);
        setLoading(false);
      } else {
        setLoading(false);
        message.error("User failed to delete");
      }
    } catch (error) {
      setLoading(false);
      message.error("Something went wrong");
    }
  };

  // Function to handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Function to handle search input
  const handleSearch = (value) => {
    setSearchText(value);
    filterUsers(value);
  };

  // Function to filter users based on search text
  const filterUsers = (searchText) => {
    if (searchText) {
      const lowerCaseSearchText = searchText.toLowerCase();
      const filteredUsers = originalUsers.filter((user) => {
        const lowerCaseUserEmail = user.email.toLowerCase();
        return lowerCaseUserEmail.includes(lowerCaseSearchText);
      });
      setUsers(filteredUsers);
    } else {
      setUsers(originalUsers);
    }
    setCurrentPage(1);
  };

  return (
    <>
      <UserForm user={user} visible={visible} onCancel={onCancel} />
      <div>
        <Input
          placeholder="Search by User Email"
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <Table
          columns={columns}
          dataSource={users}
          loading={loading}
          rowKey="email"
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: users.length,
            onChange: handlePageChange,
            style: { textAlign: "center" },
          }}
        />
      </div>
    </>
  );
};
