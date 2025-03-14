import { Navigate, Outlet, useLocation } from "react-router-dom";
import authService from "@/services/auth.service";

/**
 * ProtectedRoute component that checks if the user is authenticated
 * It will redirect to the login page if the user is not authenticated
 * Role-based access control is handled by the RoleGuard component
 */
const ProtectedRoute = () => {
  const isAuthenticated = authService.isAuthenticated();
  const location = useLocation();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated, render child routes
  return <Outlet />;
};

export default ProtectedRoute;
