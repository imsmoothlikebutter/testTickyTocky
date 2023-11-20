// Import necessary modules from React and Ant Design
import React from "react";
import { Result, Button } from "antd";

// Functional component representing an "Unauthorized" page
export const Unauthorized = () => {
  return (
    // Display a Result component with a 403 status message
    <Result
      status="403"
      title="403"
      subTitle="Sorry, you are not authorized to access this page."
      extra={[
        // Provide a button to navigate back to the home page
        <Button type="primary" href="/">
          Back Home
        </Button>,
      ]}
    />
  );
};
