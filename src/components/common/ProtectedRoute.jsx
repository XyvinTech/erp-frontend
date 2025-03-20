import { Navigate, Outlet, useLocation } from "react-router-dom";
import authService from "@/services/auth.service";

/**
 * ProtectedRoute component that checks if the user is authenticated
 * It will redirect to the login page if the user is not authenticated
 * Role-based access control is handled by the RoleGuard component
 */
const ProtectedRoute = () => {
<<<<<<< HEAD
  const isAuthenticated = authService.isAuthenticated();
=======
  const isAuthenticated = localStorage.getItem('token');
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
>>>>>>> 9f80462c18602ff3bf6a966f3e14c49b5aa27e63
  const location = useLocation();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

<<<<<<< HEAD
  // If authenticated, render child routes
=======
  // Check role-based access
  const path = location.pathname.toLowerCase();
  const userRoles = currentUser?.roles?.map(role => role.name) || [];
  console.log('Current user roles:', userRoles);
  console.log('Current path:', path);

  // Define role-based route permissions
  const routePermissions = {
    'Employee': [
      '/dashboard',
      '/profile',
      '/projects',
      '/employee',
      '/employee/dashboard',
      '/employee/profile',
      '/employee/leaveapplication',
      '/employee/myattendance',
      '/employee/payslip',
      '/employee/projects'
    ],
    'ERP System Administrator': [
      '/dashboard',
      '/employee',
      '/profile',
      '/hrm',
      '/clients',
      '/projects',
      '/frm',
      '/hrm/dashboard',
      '/hrm/employees',
      '/hrm/departments',
      '/hrm/positions',
      '/hrm/attendance',
      '/hrm/leave',
      '/hrm/payroll',
      '/hrm/events',
      '/clients/list',
      '/projects/list',
      '/projects/details',
      '/frm/dashboard',
      '/frm/expenses',
      '/frm/personal-loans',
      '/frm/office-loans',
      '/frm/profits'
    ],
    'IT Manager': [
      '/dashboard',
      '/profile',
      '/projects',
      '/projects/list',
      '/projects/details',
      '/hrm/departments',
      '/hrm/positions'
    ],
    'Project Manager': [
      '/dashboard',
      '/profile',
      '/projects',
      '/projects/list',
      '/projects/details',
      '/hrm/departments',
      '/hrm/positions'
    ],
    'HR Manager': [
      '/dashboard',
      '/profile',
      '/hrm',
      '/hrm/dashboard',
      '/hrm/employees',
      '/hrm/departments',
      '/hrm/positions',
      '/hrm/attendance',
      '/hrm/leave',
      '/hrm/payroll',
      '/hrm/events'
    ]
  };

  // Check if user has access to the current path
   // Check if user has access to the current path based on any of their roles
   const hasAccess = userRoles.some(role => {
    // Get allowed paths for this role
    const allowedPaths = routePermissions[role] || [];
    
    // Check if any of the allowed paths match the current path
    return allowedPaths.some(allowedPath => {
      const normalizedPath = path.toLowerCase();
      const normalizedAllowedPath = allowedPath.toLowerCase();
      
      // Handle exact matches and parent paths
      if (normalizedPath === normalizedAllowedPath) return true;
      
      // Handle child paths (e.g., /projects/details/123 should match /projects/details)
      if (normalizedPath.startsWith(normalizedAllowedPath + '/')) return true;
      
      // Handle parent paths (e.g., /projects should match /projects/list)
      if (normalizedAllowedPath.startsWith(normalizedPath + '/')) return true;
      
      return false;
    });
  });

  console.log('Has access:', hasAccess, 'for path:', path);

  // If user doesn't have access to the current path, redirect to dashboard
  if (!hasAccess && path !== '/') {
    return <Navigate to="/dashboard" replace />;
  }

  // If authenticated and has access, render child routes
>>>>>>> 9f80462c18602ff3bf6a966f3e14c49b5aa27e63
  return <Outlet />;
};

export default ProtectedRoute;
