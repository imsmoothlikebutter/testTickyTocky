import React, { useEffect } from "react";
import { useReducer } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthData } from "../../auth/AuthWrapper";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import "../styles/Login.css";
import { getCsrfTokenFromAPI } from "../../api/auth";

// Login component for user authentication
export const Login = () => {
  // React Router's navigate function for redirection
  const navigate = useNavigate();

  // Retrieve authentication data and functions from AuthData context
  const { login, user } = AuthData();

  // Use reducer to manage form data (email and password)
  const [formData, setFormData] = useReducer(
    (formData, newItem) => {
      return { ...formData, ...newItem };
    },
    { email: "", password: "" }
  );

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

  // Handle the login process when the form is submitted
  const handleLogin = async () => {
    try {
      // Attempt to log in with the provided email and password
      const response = await login(formData.email, formData.password);

      if (response.success) {
        message.success("Login successfully");
        // Redirect to the account page upon successful login
        navigate("/account");
      } else {
        message.error("Login failed");
      }
    } catch (error) {
      message.error("Something went wrong");
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="logo">
          <h2>Ticky Tocky</h2>
        </div>
        <Form name="login-form" onFinish={handleLogin}>
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Email is required",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              className="input-box"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ email: e.target.value })}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Password is required",
              },
            ]}
          >
            <Input
              prefix={<LockOutlined />}
              className="input-box"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ password: e.target.value })}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-button">
              Log In
            </Button>
          </Form.Item>

          <p>
            <Link to="/forgotpassword">Forgot Password?</Link>
          </p>
          <p>
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </Form>
      </div>
    </div>
  );
};
