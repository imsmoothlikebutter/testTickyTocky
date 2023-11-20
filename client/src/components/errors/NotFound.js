// Import necessary modules from React and Ant Design
import React from "react";
import { Result, Button } from "antd";

// Functional component representing a "Not Found" page
export const NotFound = () => {
  return (
    // Display a Result component with a 404 status message
    <Result
      status="404"
      title="404 - Not Found"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        // Provide a button to navigate back to the home page
        <Button type="primary" href="/">
          Back to Home
        </Button>
      }
    />
  );
};
