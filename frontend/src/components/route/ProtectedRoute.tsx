import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext"; // Adjust path as necessary

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (!isLoading) {
    // Outlet renders child routes
    if (isAuthenticated) {
      return <Outlet />;
    }
    // Send unauthenticated to the login page
    // 'replace' ensures they can't just hit back to bypass login
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
