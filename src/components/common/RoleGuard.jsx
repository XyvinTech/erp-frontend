import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import authService from "@/services/auth.service";
import rolePermissions from "@/utils/rolePermissions";
import LoadingSpinner from "./LoadingSpinner";

/**
 * RoleGuard component that checks if the user has the required roles to access a route
 * It will redirect to the login page if the user is not authenticated
 * It will redirect to the dashboard if the user doesn't have the required roles
 */
const RoleGuard = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const currentPath = location.pathname.toLowerCase();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Check if user is authenticated
        if (!authService.isAuthenticated()) {
          setLoading(false);
          return;
        }

        // Get current user from local storage
        const currentUser = authService.getCurrentUser();

        // If we have a user in local storage, use it
        if (currentUser) {
          setUser(currentUser);
          setLoading(false);
          return;
        }

        // If no user in local storage, try to fetch from API
        try {
          const response = await authService.api.get("/api/auth/me");
          if (response.data.success) {
            const userData = response.data.data;
            authService.updateUser(userData);
            setUser(userData);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          // If API call fails, logout user
          authService.logout();
        }

        setLoading(false);
      } catch (error) {
        console.error("Error in RoleGuard:", error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Show loading spinner while checking authentication
  if (loading) {
    return <LoadingSpinner />;
  }

  // If not authenticated, redirect to login
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has access to the current path based on roles
  const hasAccess = checkUserAccess(user, currentPath);

  // If user doesn't have access, redirect to dashboard
  if (!hasAccess) {
    return <Navigate to="/employee/dashboard" replace />;
  }

  // If authenticated and has access, render child routes
  return <Outlet />;
};

/**
 * Check if user has access to the current path based on roles
 * @param {Object} user - The user object
 * @param {String} path - The current path
 * @returns {Boolean} - Whether the user has access to the path
 */
const checkUserAccess = (user, path) => {
  if (!user || !user.roles || user.roles.length === 0) {
    console.error("User has no roles assigned");
    return false;
  }

  // Get user roles
  const userRoles = user.roles.map((role) => role.name);

  // Check if any of the user's roles have access to the path
  return userRoles.some((role) => {
    // Get allowed paths for this role
    const allowedPaths = rolePermissions[role] || [];

    // Check if the current path matches any of the allowed paths
    return allowedPaths.some((allowedPath) => {
      // Handle exact matches
      if (path === allowedPath.toLowerCase()) return true;

      // Handle child paths (e.g., /projects/details/123 should match /projects/details)
      if (path.startsWith(allowedPath.toLowerCase() + "/")) return true;

      // Handle parent paths (e.g., /projects should match /projects/list)
      if (allowedPath.toLowerCase().startsWith(path + "/")) return true;

      return false;
    });
  });
};

export default RoleGuard;
