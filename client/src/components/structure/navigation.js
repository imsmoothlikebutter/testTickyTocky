import { AboutUs } from "../pages/AboutUs";
import { Account } from "../pages/Account";
import { Home } from "../pages/Home";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { ForgotPassword } from "../pages/ForgotPassword";
import { PasswordReset } from "../pages/PasswordReset";
import { NotFound } from "../errors/NotFound";
import { ServerError } from "../errors/ServerError";
import { Unauthorized } from "../errors/Unauthorized";

// Define an array for website navigation
export const nav = [
  {
    path: "/unauthorized", // Route path
    name: "Unauthorized", // Display name for the route
    element: <Unauthorized />, // Component to render for this route
    isMenu: false, // Indicates if this route is part of a menu (e.g., navigation bar)
    isPrivate: false, // Indicates if the route is accessible only when authenticated
  },
  {
    path: "/servererror",
    name: "Server Error",
    element: <ServerError />,
    isMenu: false,
    isPrivate: false,
  },
  {
    path: "*",
    name: "Not Found",
    element: <NotFound />,
    isMenu: false,
    isPrivate: false,
  },
  {
    path: "/", // Root path (home)
    name: "Home",
    element: <Home />, // Home component to render
    isMenu: true, // Include in the website's menu
    isPrivate: false, // Accessible without authentication
    iconName: "HomeOutlined", // Icon for the route (assuming it's using icons)
  },
  {
    path: "/aboutus",
    name: "About Us",
    element: <AboutUs />,
    isMenu: true,
    isPrivate: false,
    iconName: "InfoCircleOutlined",
  },
  {
    path: "/login",
    name: "Login",
    element: <Login />,
    isMenu: false,
    isPrivate: false,
    iconName: "LoginOutlined",
  },
  {
    path: "/register",
    name: "Register",
    element: <Register />,
    isMenu: false,
    isPrivate: false,
    iconName: "RegisterOutlined",
  },
  {
    path: "/forgotpassword",
    name: "Forgot Password",
    element: <ForgotPassword />,
    isMenu: false,
    isPrivate: false,
  },
  {
    path: "/resetpassword",
    name: "Reset Password",
    element: <PasswordReset />,
    isMenu: false,
    isPrivate: false,
  },
  {
    path: "/account",
    name: "Account",
    element: <Account />,
    isMenu: true,
    isPrivate: true, // Requires authentication to access
    iconName: "UserOutlined",
  },
];
