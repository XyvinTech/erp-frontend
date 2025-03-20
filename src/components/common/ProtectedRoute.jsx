import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuthStore from "@/stores/auth.store";
import { useEffect, useState } from "react";

const ProtectedRoute = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();
  const isAuthenticated = localStorage.getItem("token");
  const location = useLocation();

  // If there's a token but no user in the store, try to load from localStorage
  useEffect(() => {
    if (isAuthenticated && !user) {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
          // Update the user in the store
          const { updateUser } = useAuthStore.getState();
          updateUser(storedUser);
        }
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
      }
    }
    setIsLoading(false);
  }, [isAuthenticated, user]);

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If still loading, show nothing
  if (isLoading) {
    return null;
  }

  // Get user from localStorage as fallback if store is empty
  const userFromStorage =
    user ||
    (localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null);

  if (!userFromStorage) {
    // If no user data is available, clear token and redirect to login
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  // Ensure user has a roles property
  if (
    !userFromStorage.roles ||
    !Array.isArray(userFromStorage.roles) ||
    userFromStorage.roles.length === 0
  ) {
    // Assign default Employee role
    userFromStorage.roles = [{ name: "Employee" }];

    // Update localStorage with the updated user object
    localStorage.setItem("user", JSON.stringify(userFromStorage));

    // Update the store
    const { updateUser } = useAuthStore.getState();
    updateUser(userFromStorage);

    console.log("Added default Employee role to user");
  }

  // Check role-based access
  const path = location.pathname.toLowerCase();
  const userRoles = userFromStorage?.roles?.map((role) => role.name) || [];

  // Log for debugging
  console.log("Current user:", userFromStorage);
  console.log("Current user roles:", userRoles);
  console.log("Current path:", path);

  // If user has no roles, grant access to at least basic routes
  if (!userRoles.length) {
    if (path === "/" || path === "/dashboard" || path === "/profile") {
      return <Outlet />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  // Define role-based route permissions
  const routePermissions = {
    Employee: [
      "/",
      "/dashboard",
      "/profile",
      "/projects",
      "/employee",
      "/employee/dashboard",
      "/employee/profile",
      "/employee/leaveapplication",
      "/employee/myattendance",
      "/employee/payslip",
      "/employee/projects",
    ],
    "ERP System Administrator": [
      "/",
      "/dashboard",
      "/employee",
      "/profile",
      "/hrm",
      "/clients",
      "/projects",
      "/frm",
      "/hrm/dashboard",
      "/hrm/employees",
      "/hrm/departments",
      "/hrm/positions",
      "/hrm/attendance",
      "/hrm/leave",
      "/hrm/payroll",
      "/hrm/events",
      "/clients/list",
      "/projects/list",
      "/projects/details",
      "/frm/dashboard",
      "/frm/expenses",
      "/frm/personal-loans",
      "/frm/office-loans",
      "/frm/profits",
    ],
    "IT Manager": [
      "/",
      "/dashboard",
      "/profile",
      "/projects",
      "/projects/list",
      "/projects/details",
      "/hrm/departments",
      "/hrm/positions",
    ],
    "Project Manager": [
      "/",
      "/dashboard",
      "/profile",
      "/projects",
      "/projects/list",
      "/projects/details",
      "/hrm/departments",
      "/hrm/positions",
    ],
    "HR Manager": [
      "/",
      "/dashboard",
      "/profile",
      "/hrm",
      "/hrm/dashboard",
      "/hrm/employees",
      "/hrm/departments",
      "/hrm/positions",
      "/hrm/attendance",
      "/hrm/leave",
      "/hrm/payroll",
      "/hrm/events",
    ],
  };

  // Check if user has access to the current path based on any of their roles
  const hasAccess = userRoles.some((role) => {
    // Get allowed paths for this role
    const allowedPaths = routePermissions[role] || [];

    // Check if any of the allowed paths match the current path
    return allowedPaths.some((allowedPath) => {
      const normalizedPath = path.toLowerCase();
      const normalizedAllowedPath = allowedPath.toLowerCase();

      // Handle exact matches
      if (normalizedPath === normalizedAllowedPath) return true;

      // Handle child paths (e.g., /projects/details/123 should match /projects/details)
      if (normalizedPath.startsWith(normalizedAllowedPath + "/")) return true;

      // Root path check (special case)
      if (normalizedAllowedPath === "/" && normalizedPath === "/") return true;

      return false;
    });
  });

  console.log("Has access:", hasAccess, "for path:", path);

  // If user doesn't have access to the current path, redirect to dashboard
  if (!hasAccess && path !== "/") {
    console.log("Redirecting to /dashboard from:", path);
    return <Navigate to="/dashboard" replace />;
  }

  // If authenticated and has access, render child routes
  return <Outlet />;
};

export default ProtectedRoute;
