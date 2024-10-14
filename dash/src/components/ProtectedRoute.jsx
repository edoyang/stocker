import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ Component }) => {
  const token = useSelector((state) => state.auth.token);

  // If token is not available, redirect to login
  if (!token) {
    return <Navigate to="/login" />;
  }

  return <Component />;
};

export default ProtectedRoute;
