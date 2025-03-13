import { Navigate, Outlet, useLocation } from 'react-router-dom';
import authService from '@/services/auth.service';

const ProtectedRoute = () => {
  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();
  const location = useLocation();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role-based access
  const path = location.pathname.toLowerCase();
  const role = currentUser?.role;
  console.log('Current user role:', role);
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
  const hasAccess = routePermissions[role]?.some(allowedPath => {
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

  console.log('Has access:', hasAccess, 'for path:', path);

  // If user doesn't have access to the current path, redirect to dashboard
  if (!hasAccess && path !== '/') {
    return <Navigate to="/dashboard" replace />;
  }

  // If authenticated and has access, render child routes
  return <Outlet />;
};

export default ProtectedRoute; 