import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Form,
  Input,
  Select,
  Switch,
  message,
  Spin,
} from "antd";
import { updateUserAsAdmin } from "../../api/users";
import { generateOTP } from "../../api/auth";
import { UserOutlined } from "@ant-design/icons";

// UserForm component for editing user profiles
export const UserForm = ({ user, visible, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  // Populate form fields with user data when the component mounts or user changes
  useEffect(() => {
    form.setFieldsValue({
      role: user.role,
      account_lock: user.account_lock,
      email_verified: user.email_verified,
      f_name: user.f_name,
      l_name: user.l_name,
    });
  }, [form, user]);

  const handleCancel = () => {
    onCancel();
  };
  // Handle form submission for updating user profile
  const handleFinish = async (values) => {
    try {
      setLoading(true);
      // Send a request to update the user profile
      const response = await updateUserAsAdmin({
        email: user.email,
        ...values,
      });
      if (response.success) {
        message.success("Profile updated successfully.");
      } else {
        message.error("Profile failed to update");
      }
      setLoading(false);
      handleCancel();
    } catch (error) {
      setLoading(false);
      message.error("Something went wrong");
    }
  };
  // Handle sending a password reset email
  const handleResetPassword = async () => {
    try {
      setLoading(true);
      // Send a request to generate a password reset email for the user
      const response = await generateOTP({ email: user.email });
      if (response.success) {
        setLoading(false);
        message.success("Password reset email sent");
      } else {
        setLoading(false);
        message.error("Password reset email failed to send");
      }
    } catch (error) {
      setLoading(false);
      message.error("Something went wrong");
    }
  };

  return (
    <Modal
      forceRender
      title="User Form"
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={600}
    >
      <Spin size="large" spinning={loading}>
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item
            label="First Name"
            name="f_name"
            rules={[
              { required: true, message: "First Name is required" },
              {
                pattern: /^[A-Za-z\s-']{2,50}$/,
                message:
                  "First name must be between 2 to 50 characters. Use only letters, spaces, hyphens, and single quotes.",
              },
            ]}
          >
            <Input
              maxLength={50}
              className="input-box"
              placeholder="Enter your first name"
              prefix={<UserOutlined />}
            />
          </Form.Item>
          <Form.Item
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
            <Input
              maxLength={50}
              className="input-box"
              placeholder="Enter your last name"
              prefix={<UserOutlined />}
            />
          </Form.Item>
          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: "Please select a role." }]}
          >
            <Select placeholder="Select a role" size="large">
              <Select.Option value="member">member</Select.Option>
              <Select.Option value="admin">admin</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Account Lock"
            name="account_lock"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item
            label="Email Verified"
            name="email_verified"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={handleResetPassword}>
              Reset Password
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};
