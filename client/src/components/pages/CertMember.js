import React from "react";
import { CertTable } from "./CertTable";

// CertMember component displays the certification table for a member
// It takes the member's email as a prop
export const CertMember = ({ email }) => {
  // Render the CertTable component for a member with the given email
  return <CertTable role="member" email={email} />;
};
