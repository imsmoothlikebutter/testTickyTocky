import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, message } from "antd";
import { MailOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import "../styles/Register.css";
import { register } from "../../api/auth";
import { getCsrfTokenFromAPI } from "../../api/auth";
import { AuthData } from "../../auth/AuthWrapper";

// Register component for user registration
export const Register = () => {
  // React Router's navigate function for redirection
  const navigate = useNavigate();

  // Retrieve user data from AuthData context
  const { user } = AuthData();

  // Create a form instance for registration
  const [form] = Form.useForm();

  // Perform actions when the component mounts
  useEffect(() => {
    // Redirect to the homepage if the user is already authenticated
    if (user.isAuthenticated) {
      navigate("/");
    } else {
      // Fetch the CSRF token from the API if the user is not authenticated
      getCsrfTokenFromAPI();
    }
  }, [user.isAuthenticated, navigate]);

  // If the user is already authenticated, return null to prevent rendering
  if (user.isAuthenticated) {
    return null;
  }

  // Handle form submission for user registration
  const handleSubmit = async () => {
    try {
      // Validate form fields and get their values
      const values = await form.validateFields();
      const response = await register(values);
      if (response.success) {
        message.success("Register successfully");
        // Redirect to the login page upon successful registration
        navigate("/login");
      } else {
        message.error("Register failed");
      }
    } catch (error) {
      message.error("Something went wrong");
    }
  };

  // Handle cancellation and navigate to the login page
  const handleCancel = () => {
    navigate("/login");
  };

  return (
    <div className="register-container">
      <Form form={form} onFinish={handleSubmit} className="register-form">
        <h2>Register</h2>
        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Email is required" },
            {
              pattern: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
              message: "Only Gmail addresses are allowed",
            },
          ]}
          className="form-item"
        >
          <Input
            className="input-box"
            placeholder="Enter your email"
            prefix={<MailOutlined />}
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            { required: true, message: "Password is required" },
            {
              pattern:
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#%^&*()\-_+]).{12,64}$/,
              message:
                "Password must be 12-64 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character (!@#%^&*()-_+).",
            },
          ]}
          className="form-item"
        >
          <Input.Password
            className="input-box"
            placeholder="Enter your password"
            prefix={<LockOutlined />}
          />
        </Form.Item>
        <Form.Item
          name="cfmPassword"
          dependencies={["password"]}
          hasFeedback
          rules={[
            { required: true, message: "Please re-enter the same password" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Passwords do not match"));
              },
            }),
          ]}
          className="form-item"
        >
          <Input.Password
            className="input-box"
            placeholder="Reenter your password"
            prefix={<LockOutlined />}
          />
        </Form.Item>
        <Form.Item
          name="f_name"
          rules={[
            { required: true, message: "First name is required" },
            {
              pattern: /^[A-Za-z\s-']{2,50}$/,
              message:
                "First name must be between 2 to 50 characters. Use only letters, spaces, hyphens, and single quotes.",
            },
          ]}
          className="form-item"
        >
          <Input
            className="input-box"
            placeholder="Enter your first name"
            prefix={<UserOutlined />}
            maxLength={50}
          />
        </Form.Item>
        <Form.Item
          name="l_name"
          rules={[
            { required: true, message: "Last name is required" },
            {
              pattern: /^[A-Za-z\s-']{2,50}$/,
              message:
                "Last name must be between 2 to 50 characters. Use only letters, spaces, hyphens, and single quotes.",
            },
          ]}
          className="form-item"
        >
          <Input
            className="input-box"
            placeholder="Enter your last name"
            prefix={<UserOutlined />}
            maxLength={50}
          />
        </Form.Item>
        <Form.Item className="form-button-container">
          <div>
            <Button
              type="default"
              htmlType="button"
              onClick={() => form.resetFields()}
            >
              Clear
            </Button>
            <Button type="default" htmlType="button" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Register
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};
