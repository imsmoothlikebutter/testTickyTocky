import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Form,
  Input,
  Spin,
  Switch,
  Select,
  message,
} from "antd";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { UsersTable } from "./UsersTable";
import { createUser } from "../../api/users";

// UsersManagement component for managing users
export const UsersManagement = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [reFetchUsers, setReFetchUsers] = useState(false);

  // Show the user editing modal
  const showModal = () => {
    setModalVisible(true);
  };

  // Show the user creation modal
  const showCreateModal = () => {
    setCreateModalVisible(true);
  };

  // Handle closing of modals
  const handleCancel = () => {
    setModalVisible(false);
    setCreateModalVisible(false);
  };

  return (
    <>
      <UsersTable
        showModal={showModal}
        visible={modalVisible}
        onCancel={handleCancel}
        reFetchUsers={reFetchUsers}
        setReFetchUsers={setReFetchUsers}
      />
      <Button type="primary" title="Create User" onClick={showCreateModal}>
        Create User
      </Button>
      <CreateUserForm
        visible={createModalVisible}
        onCancel={handleCancel}
        setReFetchUsers={setReFetchUsers}
      />
    </>
  );
};

// CreateUserForm component for creating a new user
const CreateUserForm = ({ visible, onCancel, setReFetchUsers }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Initialize form fields
  useEffect(() => {
    form.setFieldsValue({
      create_f_name: "",
      create_l_name: "",
      create_email: "",
      create_password: "",
      create_cfmPassword: "",
      create_account_lock: false,
      create_role: "member",
    });
  }, [form]);

  // Handle form submission for creating a new user
  const handleFinish = async (values) => {
    try {
      setLoading(true);
      // Send a request to create a new user
      const response = await createUser({
        f_name: values.create_f_name,
        l_name: values.create_l_name,
        email: values.create_email,
        password: values.create_password,
        account_lock: values.create_account_lock,
        role: values.create_role,
      });

      if (response.success) {
        message.success("User created successfully");
        form.resetFields();
        setReFetchUsers(true);
      } else {
        message.error("User failed to create");
      }
      setLoading(false);
      onCancel();
    } catch (error) {
      setLoading(false);
      message.error("Something went wrong");
    }
  };

  return (
    <Modal
      forceRender
      title="Create User Form"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <Spin size="large" spinning={loading}>
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item
            label="First Name"
            name="create_f_name"
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
              className="input-box"
              placeholder="Enter your first name"
              prefix={<UserOutlined />}
              maxLength={50}
            />
          </Form.Item>
          <Form.Item
            label="Last Name"
            name="create_l_name"
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
              className="input-box"
              placeholder="Enter your last name"
              prefix={<UserOutlined />}
              maxLength={50}
            />
          </Form.Item>
          <Form.Item
            label="Email"
            name="create_email"
            rules={[
              { required: true, message: "Email is required" },
              {
                pattern: /^[a-z0-9.]{6,30}@gmail\.com$/,
                message: "Only Gmail addresses are allowed",
              },
            ]}
          >
            <Input
              className="input-box"
              placeholder="Enter your email"
              prefix={<MailOutlined />}
            />
          </Form.Item>
          <Form.Item
            label="Password"
            name="create_password"
            rules={[
              { required: true, message: "Password is required" },
              {
                pattern:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@!%*?&])[A-Za-z\d@!%*?&]{12,64}$/,
                message:
                  "Password must be at least 12 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character (!@#%^&+=).",
              },
            ]}
          >
            <Input.Password
              className="input-box"
              placeholder="Enter your password"
              prefix={<LockOutlined />}
            />
          </Form.Item>
          <Form.Item
            label="Confirm Password"
            name="create_cfmPassword"
            dependencies={["create_password"]}
            hasFeedback
            rules={[
              { required: true, message: "Please re-enter the same password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("create_password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match"));
                },
              }),
            ]}
          >
            <Input.Password
              className="input-box"
              placeholder="Reenter your password"
              prefix={<LockOutlined />}
            />
          </Form.Item>
          <Form.Item
            label="Role"
            name="create_role"
            rules={[{ required: true, message: "Please select a role." }]}
          >
            <Select placeholder="Select a role" size="large">
              <Select.Option value="member">member</Select.Option>
              <Select.Option value="admin">admin</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Account Lock"
            name="create_account_lock"
            valuePropName="checked"
          >
            <Switch />
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
