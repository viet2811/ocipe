import { useAuth } from "@/contexts/AuthContext";
import React from "react";
import { Navigate, Outlet } from "react-router-dom"; // Adjust path as necessary

const PublicOnlyRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (!isLoading) {
    // Outlet renders child routes
    if (!isAuthenticated) {
      return <Outlet />;
    }
    // Send authenticated to the home page
    return <Navigate to="/home" replace />;
  }
};

export default PublicOnlyRoute;
