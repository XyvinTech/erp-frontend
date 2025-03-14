import { useEffect, useState } from "react";
import authService from "@/services/auth.service";
import { hasRole, hasAnyRole } from "@/utils/roleUtils";

/**
 * Component that conditionally renders UI elements based on user roles
 * @param {Object} props - Component props
 * @param {Array|String} props.roles - Role or array of roles required to render the children
 * @param {Boolean} props.requireAll - If true, user must have all roles, otherwise any role is sufficient
 * @param {React.ReactNode} props.children - Content to render if user has the required roles
 * @param {React.ReactNode} props.fallback - Content to render if user doesn't have the required roles
 * @returns {React.ReactNode} - Rendered content
 */
const RoleBasedRenderer = ({
  roles,
  requireAll = false,
  children,
  fallback = null,
}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get current user from local storage
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  if (loading) {
    return null;
  }

  // If no roles specified, render children
  if (!roles || (Array.isArray(roles) && roles.length === 0)) {
    return children;
  }

  // Convert single role to array
  const roleArray = Array.isArray(roles) ? roles : [roles];

  // Check if user has the required roles
  let hasRequiredRoles = false;

  if (requireAll) {
    // User must have all roles
    hasRequiredRoles = roleArray.every((role) => hasRole(user, role));
  } else {
    // User must have any of the roles
    hasRequiredRoles = hasAnyRole(user, roleArray);
  }

  // Render children if user has the required roles, otherwise render fallback
  return hasRequiredRoles ? children : fallback;
};

export default RoleBasedRenderer;
