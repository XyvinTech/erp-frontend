import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/auth.store';
import authService from '../services/auth.service';
import { hasRole, hasAnyRole, getUserRoles, isAdmin, isManager } from '@/utils/roleUtils';

/**
 * Hook to access authentication state and user information
 * @returns {Object} Authentication state and user information
 */
export const useAuth = () => {
  const navigate = useNavigate();
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    register,
    setUser,
    setIsAuthenticated,
    setError,
    clearError
  } = useAuthStore();

  const [loading, setLoading] = useState(true);

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Check if user is authenticated
        const authenticated = authService.isAuthenticated();

        if (authenticated) {
          // Get current user from local storage
          const currentUser = authService.getCurrentUser();

          if (currentUser) {
            setUser(currentUser);
            setIsAuthenticated(true);
          } else {
            // If no user in local storage, try to fetch from API
            try {
              const response = await authService.api.get('/api/auth/me');
              if (response.data.success) {
                const userData = response.data.data;
                authService.updateUser(userData);
                setUser(userData);
                setIsAuthenticated(true);
              }
            } catch (error) {
              console.error('Error fetching user data:', error);
              // If API call fails, logout user
              logout();
            }
          }
        }

        setLoading(false);
      } catch (error) {
        console.error('Error in useAuth:', error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [setUser, setIsAuthenticated, logout]);

  // Refresh user data
  const refreshUser = useCallback(async () => {
    try {
      setLoading(true);

      // Check if user is authenticated
      const authenticated = authService.isAuthenticated();

      if (authenticated) {
        try {
          const response = await authService.api.get('/api/auth/me');
          if (response.data.success) {
            const userData = response.data.data;
            authService.updateUser(userData);
            setUser(userData);
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error('Error refreshing user data:', error);
        }
      }

      setLoading(false);
    } catch (error) {
      console.error('Error in refreshUser:', error);
      setLoading(false);
    }
  }, [setUser, setIsAuthenticated]);

  // Set up axios interceptor for authentication
  useEffect(() => {
    const interceptor = authService.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logout();
          navigate('/login');
        }
        return Promise.reject(error);
      }
    );

    return () => {
      authService.api.interceptors.response.eject(interceptor);
    };
  }, [token, logout, navigate]);

  // Check if user has a specific role
  const checkRole = useCallback((roleName) => {
    return hasRole(user, roleName);
  }, [user]);

  // Check if user has any of the specified roles
  const checkAnyRole = useCallback((roleNames) => {
    return hasAnyRole(user, roleNames);
  }, [user]);

  return {
    // State
    user,
    loading: loading || isLoading,
    isAuthenticated,
    error,

    // Actions
    login,
    logout,
    register,
    setError,
    clearError,

    // Helper methods
    isAdmin: isAdmin(user),
    isManager: isManager(user),
    checkRole,
    checkAnyRole,
    roles: getUserRoles(user),
    refreshUser
  };
};

export default useAuth; 