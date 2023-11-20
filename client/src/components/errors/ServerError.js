// Import necessary modules from React and Ant Design
import React from "react";
import { Result, Button } from "antd";

// Functional component representing a "Server Error" page
export const ServerError = () => {
  return (
    // Display a Result component with a 500 status message
    <Result
      status="500"
      title="500 - Internal Server Error"
      subTitle="Sorry, something went wrong on our end."
      extra={
        // Provide a button to navigate back to the home page
        <Button type="primary" href="/">
          Back to Home
        </Button>
      }
    />
  );
};
