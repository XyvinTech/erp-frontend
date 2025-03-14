import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import authService from "@/services/auth.service";
import { hasRole, hasAnyRole } from "@/utils/roleUtils";
import UnauthorizedAccess from "./UnauthorizedAccess";
import LoadingSpinner from "./LoadingSpinner";

/**
 * Higher-order component (HOC) that protects a component based on user roles
 * @param {React.Component} Component - The component to protect
 * @param {Object} options - Configuration options
 * @param {Array|String} options.roles - Role or array of roles required to access the component
 * @param {Boolean} options.requireAll - If true, user must have all roles, otherwise any role is sufficient
 * @param {String} options.redirectPath - Path to redirect to if user doesn't have the required roles
 * @param {Boolean} options.showUnauthorized - If true, show unauthorized message instead of redirecting
 * @param {String} options.unauthorizedMessage - Custom message to display if unauthorized
 * @returns {React.Component} - Protected component
 */
const withRoleAccess = (
  Component,
  {
    roles = [],
    requireAll = false,
    redirectPath = "/employee/dashboard",
    showUnauthorized = true,
    unauthorizedMessage = "You don't have permission to access this page.",
  } = {}
) => {
  // Return a new component
  return (props) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hasAccess, setHasAccess] = useState(false);

    useEffect(() => {
      const checkAccess = async () => {
        try {
          // Check if user is authenticated
          if (!authService.isAuthenticated()) {
            setLoading(false);
            return;
          }

          // Get current user from local storage
          const currentUser = authService.getCurrentUser();

          if (currentUser) {
            setUser(currentUser);

            // If no roles specified, grant access
            if (!roles || (Array.isArray(roles) && roles.length === 0)) {
              setHasAccess(true);
              setLoading(false);
              return;
            }

            // Convert single role to array
            const roleArray = Array.isArray(roles) ? roles : [roles];

            // Check if user has the required roles
            let userHasRequiredRoles = false;

            if (requireAll) {
              // User must have all roles
              userHasRequiredRoles = roleArray.every((role) =>
                hasRole(currentUser, role)
              );
            } else {
              // User must have any of the roles
              userHasRequiredRoles = hasAnyRole(currentUser, roleArray);
            }

            setHasAccess(userHasRequiredRoles);
          } else {
            // If no user in local storage, try to fetch from API
            try {
              const response = await authService.api.get("/api/auth/me");
              if (response.data.success) {
                const userData = response.data.data;
                authService.updateUser(userData);
                setUser(userData);

                // Check if user has the required roles
                let userHasRequiredRoles = false;

                // If no roles specified, grant access
                if (!roles || (Array.isArray(roles) && roles.length === 0)) {
                  userHasRequiredRoles = true;
                } else {
                  // Convert single role to array
                  const roleArray = Array.isArray(roles) ? roles : [roles];

                  if (requireAll) {
                    // User must have all roles
                    userHasRequiredRoles = roleArray.every((role) =>
                      hasRole(userData, role)
                    );
                  } else {
                    // User must have any of the roles
                    userHasRequiredRoles = hasAnyRole(userData, roleArray);
                  }
                }

                setHasAccess(userHasRequiredRoles);
              }
            } catch (error) {
              console.error("Error fetching user data:", error);
              // If API call fails, logout user
              authService.logout();
            }
          }

          setLoading(false);
        } catch (error) {
          console.error("Error in withRoleAccess:", error);
          setLoading(false);
        }
      };

      checkAccess();
    }, []);

    // Show loading spinner while checking access
    if (loading) {
      return <LoadingSpinner />;
    }

    // If not authenticated, redirect to login
    if (!authService.isAuthenticated()) {
      return <Navigate to="/login" replace />;
    }

    // If user doesn't have access
    if (!hasAccess) {
      // Show unauthorized message or redirect
      if (showUnauthorized) {
        return (
          <UnauthorizedAccess
            message={unauthorizedMessage}
            redirectPath={redirectPath}
          />
        );
      } else {
        return <Navigate to={redirectPath} replace />;
      }
    }

    // If user has access, render the component
    return <Component {...props} />;
  };
};

export default withRoleAccess;
