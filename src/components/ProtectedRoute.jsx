// components/ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("accessToken");
  const user = localStorage.getItem("user");
  const location = useLocation();
//   console.log("ProtectedRoute check - token:", token, "user:", user);

  if (!token || !user) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
