import React, { useState } from "react";
import { Form, Input, Button, message, Spin } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import "../styles/ForgotPassword.css";
import { generateOTP } from "../../api/auth";

// ForgotPassword component for handling password reset requests
export const ForgotPassword = () => {
  // State variable for loading state
  const [loading, setLoading] = useState(false);

  // React Router navigate hook
  const navigate = useNavigate();

  // Handle form submission when user requests a password reset
  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      // Extract the email from the form values
      const email = values.email;

      // Call the API to generate an OTP and send a reset email
      const response = await generateOTP({ email });

      if (response.success) {
        setLoading(false);

        // Show a success message and navigate to the login page with the email parameter
        message.success("Password reset email sent");
        navigate("/login", { state: { email: email } });
      } else {
        setLoading(false);

        // Show an error message if the email send fails
        message.error("Password reset email failed to send");
      }
    } catch (error) {
      setLoading(false);

      // Show a generic error message if something goes wrong
      message.error("Something went wrong");
    }
  };

  return (
    <Spin size="large" spinning={loading}>
      <div className="forgot-password-container">
        <Form onFinish={handleSubmit} className="forgot-password-form">
          <h2>Forgot Password</h2>
          <p>An OTP will be sent to the email provided below.</p>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Email is required" },
              {
                pattern: /^[a-zA-Z0-9._%+-]{1,64}@gmail\.com$/,
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
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Send Code
            </Button>
          </Form.Item>
          <p>
            Remember your password? <Link to="/login">Login</Link>
          </p>
        </Form>
      </div>
    </Spin>
  );
};
