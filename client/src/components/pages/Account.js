// Import necessary modules and components
import React, { useEffect, useState } from "react";
import { AuthData } from "../../auth/AuthWrapper";
import {
  Tabs,
  Card,
  Typography,
  Spin,
  Avatar,
  Button,
  Modal,
  Form,
  Input,
  message,
  Checkbox,
} from "antd";
import { getUser, updateUser } from "../../api/users";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import "../styles/Account.css";
import { CertsManagement } from "./CertsManagement";
import { UsersManagement } from "./UsersManagement";
import { AccessLogsManagement } from "./AccessLogsManagement";
import { DatabaseLogsManagement } from "./DatabaseLogsManagement";
import { SecurityLogsManagement } from "./SecurityLogsManagement";
import { CertMember } from "./CertMember";
import { updatePassword } from "../../api/auth";

const { Text } = Typography;
const { Item } = Form;
const { TabPane } = Tabs;

// Functional component representing an "Account" page
export const Account = () => {
  const { user } = AuthData();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editProfileModalVisible, setEditProfileModalVisible] = useState(false);
  const [resetPasswordModalVisible, setResetPasswordModalVisible] =
    useState(false);
  const [form] = Form.useForm();
  const [resetPasswordForm] = Form.useForm();

  // Reset the password form fields when the form is visible
  useEffect(() => {
    resetPasswordForm.setFieldValue({
      new_password: "",
      cfm_new_password: "",
    });
  }, [resetPasswordForm]);

  // Fetch user data when the component mounts
  useEffect(() => {
    const fetchUser = async () => {
      const response = await getUser(user.email);
      if (response.success) {
        setUserData(response.user);
      }
      setLoading(false);
    };
    fetchUser();
  }, [user.email, setUserData, setLoading]);

  // Handle opening the "Edit Profile" modal
  const handleEditProfile = () => {
    setEditProfileModalVisible(true);
    form.setFieldsValue({
      f_name: userData.f_name,
      l_name: userData.l_name,
    });
  };

  // Handle saving the user profile
  const handleSaveProfile = async () => {
    try {
      const values = await form.validateFields();
      const response = await updateUser({
        f_name: values.f_name,
        l_name: values.l_name,
        email: user.email,
      });

      if (response.success) {
        setUserData({
          ...userData,
          f_name: values.f_name,
          l_name: values.l_name,
        });
        message.success("Profile updated successfully");
      } else {
        message.error("Profile failed to update");
      }

      setEditProfileModalVisible(false);
    } catch (error) {
      message.error("Something went wrong");
    }
  };

  // Handle showing the "Reset Password" modal
  const handleShowResetPasswordModal = () => {
    setResetPasswordModalVisible(true);
  };

  // Handle resetting the password
  const handleResetPassword = async () => {
    const values = await resetPasswordForm.validateFields();
    try {
      setLoading(true);
      const response = await updatePassword({
        email: userData.email,
        password: values.new_password,
      });
      if (response.success) {
        message.success("Password reset successfully");
        setResetPasswordModalVisible(false);
      } else {
        message.error("Password failed to reset");
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error("Something went wrong");
    }
  };

  // If data is still loading, display a loading spinner
  if (loading) {
    return <Spin size="large" />;
  }

  // If user data is not available, display an error message
  if (!userData) {
    return <Text type="danger">Something went wrong</Text>;
  }

  // Render the account content, including tabs for different sections
  return (
    <div className="account">
      <Card className="account-card">
        <Tabs>
          <TabPane tab="Profile" key="profile">
            {/* User profile content */}
            <div className="profile-container">
              <div className="profile-avatar">
                <Avatar size={100} icon={<UserOutlined />} />
              </div>
              <div className="profile-info">
                <h1 className="user-name">
                  {userData.f_name} {userData.l_name}
                </h1>
                <p className="user-email">Email: {userData.email}</p>
                <Button type="primary" onClick={handleEditProfile}>
                  Edit Profile
                </Button>
              </div>
            </div>
            {/* Modal for editing user profile */}
            <Modal
              forceRender
              title="Edit Profile"
              open={editProfileModalVisible}
              onOk={handleSaveProfile}
              onCancel={() => setEditProfileModalVisible(false)}
            >
              <Form form={form} layout="vertical" validateTrigger="onChange">
                <Item
                  label="First Name"
                  name="f_name"
                  rules={[
                    { required: true, message: "First name is required" },
                    {
                      pattern: /^[A-Za-z\s-']{2,50}$/,
                      message:
                        "First name must be between 2 to 50 characters. Use only letters, spaces, hyphens, and single quotes.",
                    },
                  ]}
                >
                  <Input placeholder="First Name" maxLength={50} />
                </Item>
                <Item
                  label="Last Name"
                  name="l_name"
                  rules={[
                    { required: true, message: "Last name is required" },
                    {
                      pattern: /^[A-Za-z\s-']{2,50}$/,
                      message:
                        "Last name must be between 2 to 50 characters. Use only letters, spaces, hyphens, and single quotes.",
                    },
                  ]}
                >
                  <Input placeholder="Last Name" maxLength={50} />
                </Item>
              </Form>
            </Modal>
            {/* Modal for resetting the password */}
            <Modal
              forceRender
              title="Reset Password"
              open={resetPasswordModalVisible}
              onCancel={() => setResetPasswordModalVisible(false)}
              onOk={handleResetPassword}
            >
              <Spin size="large" spinning={loading}>
                <Form form={resetPasswordForm} layout="vertical">
                  <Form.Item
                    label="New Password"
                    name="new_password"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your new password",
                      },
                      {
                        pattern:
                          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#%^&*()\-_+]).{12,64}$/,
                        message:
                          "New Password must be 12-64 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character (!@#%^&*()-_+).",
                      },
                    ]}
                  >
                    <Input.Password
                      className="input-box"
                      placeholder="Enter your password"
                      prefix={<LockOutlined />} // Icon for confirm password
                    />
                  </Form.Item>
                  <Form.Item
                    label="Confirm New Password"
                    name="cfm_new_password"
                    dependencies={["new_password"]}
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: "Please re-enter the same password",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (
                            !value ||
                            getFieldValue("new_password") === value
                          ) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error("Passwords do not match")
                          );
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      className="input-box"
                      placeholder="Re-enter your password"
                      prefix={<LockOutlined />} // Icon for confirm password
                    />
                  </Form.Item>
                </Form>
              </Spin>
            </Modal>
          </TabPane>
          {/* Display tabs for Certificates, Certificate Management, User Management, and Settings */}
          {user.role !== "admin" && (
            <TabPane tab="Certificates" key="certificates">
              <CertMember email={user.email} />
              {/* Certificates content (only visible to normal users) */}
            </TabPane>
          )}
          {user.role === "admin" && (
            <TabPane tab="Certificate Management" key="certificateManagement">
              <CertsManagement />
            </TabPane>
          )}
          {user.role === "admin" && (
            <TabPane tab="User Management" key="userManagement">
              <UsersManagement />
              {/* User Management content (only visible to admins) */}
            </TabPane>
          )}
          {user.role === "admin" && (
            <TabPane tab="Access Logs Management" key="accessLogManagement">
              <AccessLogsManagement />
              {/* Access Logs Management content (only visible to admins) */}
            </TabPane>
          )}
          {user.role === "admin" && (
            <TabPane tab="Database Logs Management" key="databaseLogManagement">
              <DatabaseLogsManagement />
              {/* Database Logs Management content (only visible to admins) */}
            </TabPane>
          )}
          {user.role === "admin" && (
            <TabPane tab="Security Logs Management" key="securityLogManagement">
              <SecurityLogsManagement />
              {/* Security Logs Management content (only visible to admins) */}
            </TabPane>
          )}
          <TabPane tab="Settings" key="settings">
            {/* Settings content */}
            <div className="settings-form">
              <div className="settings-form">
                <Form layout="vertical">
                  <Form.Item label="Security Settings">
                    <Checkbox>Enable Two-Factor Authentication</Checkbox>
                  </Form.Item>
                  <Form.Item label="Notification Preferences">
                    <Checkbox>Email Notifications</Checkbox>
                    <Checkbox>Push Notifications</Checkbox>
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary">Save Settings</Button>
                    <Button
                      type="default"
                      onClick={handleShowResetPasswordModal}
                    >
                      Reset Password
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </div>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};
