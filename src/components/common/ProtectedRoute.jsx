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

  // Regular employees can access dashboard, profile, and project-related routes
  if (role === 'employee') {
    const allowedPaths = [
      '/dashboard',
      '/profile',
      '/projects',
      '/employee'
    ];
    
    if (!allowedPaths.some(allowedPath => path.startsWith(allowedPath)) && path !== '/') {
      return <Navigate to="/" replace />;
    }
  }

  // If authenticated and has access, render child routes
  return <Outlet />;
};

export default ProtectedRoute; 