import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { useLogin, useLogout, useCurrentUser, useUpdateProfile } from '../api/hooks/useAuth';
import { hasRole, hasAnyRole, getUserRoles, isAdmin, isManager } from '../utils/roleUtils';

/**
 * Custom hook that combines TanStack Query and Zustand for authentication
 * @returns {Object} - Authentication state and methods
 */
const useAuthHook = () => {
    const navigate = useNavigate();

    // Zustand auth store
    const {
        user,
        token,
        isAuthenticated,
        isLoading,
        error,
        login: storeLogin,
        logout: storeLogout,
        register: storeRegister,
        setUser,
        setToken,
        setIsAuthenticated,
        setIsLoading,
        setError,
        clearError,
        updateUser: storeUpdateUser
    } = useAuthStore();

    // TanStack Query hooks
    const loginMutation = useLogin();
    const logoutMutation = useLogout();
    const { data: currentUser, refetch: refetchUser } = useCurrentUser();
    const updateProfileMutation = useUpdateProfile();

    // Update store when current user changes
    useEffect(() => {
        if (currentUser) {
            setUser(currentUser);
            setIsAuthenticated(true);
        }
    }, [currentUser, setUser, setIsAuthenticated]);

    // Login method
    const login = async (credentials) => {
        try {
            setIsLoading(true);
            clearError();

            const result = await loginMutation.mutateAsync(credentials);

            if (result?.data?.success) {
                const { token, user } = result.data;

                // Update store
                storeLogin(user, token);

                // Navigate to dashboard
                navigate('/employee/dashboard');

                return { success: true };
            } else {
                setError('Invalid credentials');
                return { success: false, error: 'Invalid credentials' };
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Login failed';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setIsLoading(false);
        }
    };

    // Logout method
    const logout = async () => {
        try {
            await logoutMutation.mutateAsync();
            storeLogout();
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
            // Even if API call fails, clear local state
            storeLogout();
            navigate('/login');
        }
    };

    // Register method
    const register = async (userData) => {
        try {
            setIsLoading(true);
            clearError();

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (data.success) {
                const { token, user } = data;

                // Update store
                storeRegister(user, token);

                // Navigate to dashboard
                navigate('/employee/dashboard');

                return { success: true };
            } else {
                setError(data.message || 'Registration failed');
                return { success: false, error: data.message };
            }
        } catch (error) {
            const errorMessage = error.message || 'Registration failed';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setIsLoading(false);
        }
    };

    // Update profile method
    const updateProfile = async (userData) => {
        try {
            setIsLoading(true);
            clearError();

            const result = await updateProfileMutation.mutateAsync(userData);

            if (result?.data?.success) {
                const updatedUser = result.data.data;

                // Update store
                storeUpdateUser(updatedUser);

                return { success: true };
            } else {
                setError('Failed to update profile');
                return { success: false, error: 'Failed to update profile' };
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to update profile';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setIsLoading(false);
        }
    };

    // Check if user has a specific role
    const checkRole = (roleName) => {
        return hasRole(user, roleName);
    };

    // Check if user has any of the specified roles
    const checkAnyRole = (roleNames) => {
        return hasAnyRole(user, roleNames);
    };

    return {
        // State
        user,
        token,
        isAuthenticated,
        isLoading: isLoading || loginMutation.isPending || logoutMutation.isPending || updateProfileMutation.isPending,
        error,

        // Actions
        login,
        logout,
        register,
        updateProfile,
        refetchUser,
        setError,
        clearError,

        // Role checking
        checkRole,
        checkAnyRole,
        roles: getUserRoles(user),
        isAdmin: isAdmin(user),
        isManager: isManager(user)
    };
};

export default useAuthHook; 