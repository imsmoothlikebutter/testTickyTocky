// Import necessary modules and components
import { createContext, useContext, useState } from "react";
import {
  RenderMenu,
  RenderRoutes,
} from "../components/structure/RenderNavigation";
import { useEffect } from "react";
import { checkAuth, postLogin, postLogout } from "../api/auth";
import { Spin } from "antd";

// Create a context to manage authentication state
const AuthContext = createContext();

// Custom hook to access authentication data
export const AuthData = () => useContext(AuthContext);

// Authentication Wrapper Component
export const AuthWrapper = () => {
  // Initialize state to manage user authentication and loading state
  const [user, setUser] = useState({
    email: "",
    isAuthenticated: false,
    role: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  // Use useEffect to fetch authentication state when the component mounts
  useEffect(() => {
    fetchAuthState();
  }, []);

  // Function to fetch the authentication state
  const fetchAuthState = async () => {
    setIsLoading(true);

    try {
      const response = await checkAuth();

      if (response.success) {
        setIsLoading(false);
        setUser({ email: response.email, isAuthenticated: response.success });

        if (response.role) {
          setUser((user) => {
            return { ...user, role: response.role };
          });
        }
        return { success: true, message: response.message };
      } else {
        setIsLoading(false);
        setUser({ email: "", isAuthenticated: false });
        return { success: false, message: response.message };
      }
    } catch (error) {
      setIsLoading(false);
      setUser({ email: "", isAuthenticated: false });
      return { success: false, message: "Something went wrong" };
    }
  };

  // Function to handle user login
  const login = async (email, password) => {
    const req = { email: email, password: password };

    try {
      const response = await postLogin(req);

      if (response.success) {
        setUser({ email, isAuthenticated: response.success });

        if (response.role) {
          setUser((user) => {
            return { ...user, role: response.role };
          });
        }
        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      setUser({ email: "", isAuthenticated: false });
      return { success: false, message: "Something went wrong" };
    }
  };

  // Function to handle user logout
  const logout = async () => {
    try {
      const response = await postLogout();

      if (response.success) {
        setUser({ ...user, isAuthenticated: false, role: undefined });
        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      return { success: false, message: "Something went wrong" };
    }
  };

  // Display a loading spinner while loading authentication state
  if (isLoading) {
    return <Spin size="large" />;
  }

  // Provide the authentication context to child components
  return (
    <AuthContext.Provider value={{ user, login, logout, fetchAuthState }}>
      <>
        <RenderMenu />
        <RenderRoutes />
      </>
    </AuthContext.Provider>
  );
};
