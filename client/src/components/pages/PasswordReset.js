import React, { useState, useEffect } from "react";
import { Form, Input, Button, Spin, message } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom"; // If using React Router for navigation
import "../styles/PasswordReset.css"; // You can reuse the CSS for the password reset page
import { resetPassword } from "../../api/auth";
import { getCsrfTokenFromAPI } from "../../api/auth";

export const PasswordReset = () => {
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const [password, setPassword] = useState("");
  const [cfmPassword, setCfmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("t");
  useEffect(() => {
    if (!token) {
      navigate("/");
    } else {
      getCsrfTokenFromAPI();
    }
  }, [token, navigate]);
  if (!token) {
    return null; // Return null to prevent rendering the login page.
  }

  // Function to handle form submission
  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      const response = await resetPassword({
        token,
        password,
      });
      if (response.success) {
        setLoading(false);
        setPasswordUpdated(true);
        message.success("Password reset successfully");
      } else {
        setLoading(false);
        setPasswordUpdated(false);
        message.error("Password failed to reset");
      }
    } catch (error) {
      setLoading(false);
      setPasswordUpdated(false);
      message.error("Something went wrong");
    }
  };

  return (
    <Spin size="large" spinning={loading}>
      <div className="forgot-password-container">
        <Form onFinish={handleSubmit} className="forgot-password-form">
          <h2>Password Reset</h2>
          {passwordUpdated ? (
            <p>
              Your password has been successfully updated. Click{" "}
              <Link to="/login">Login</Link> to continue.
            </p>
          ) : (
            <>
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Please enter your new password" },
                  {
                    pattern:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#%^&*()\-_+]).{12,64}$/,
                    message:
                      "Password must be 12-64 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character (!@#%^&*()-_+).",
                  },
                ]}
              >
                <Input
                  prefix={<LockOutlined />}
                  className="input-box"
                  type="password"
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                dependencies={["password"]}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Please re-enter the same password",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Passwords do not match")
                      );
                    },
                  }),
                ]}
              >
                <Input
                  prefix={<LockOutlined />}
                  className="input-box"
                  type="password"
                  placeholder="Confirm Password"
                  value={cfmPassword}
                  onChange={(e) => setCfmPassword(e.target.value)}
                />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Update Password
                </Button>
              </Form.Item>
            </>
          )}
        </Form>
      </div>
    </Spin>
  );
};
