import { useMutation, useQuery } from '@tanstack/react-query';
import authApi from '../endpoints/authApi';
import { extractData, formatErrorMessage } from '../utils/apiUtils';

/**
 * Hook for user login
 * @returns {Object} - Login mutation
 */
export const useLogin = () => {
    return useMutation({
        mutationFn: (credentials) => authApi.login(credentials),
        onSuccess: (response) => {
            const { token, user } = extractData(response) || {};

            if (token && user) {
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
            }
        }
    });
};

/**
 * Hook for user registration
 * @returns {Object} - Registration mutation
 */
export const useRegister = () => {
    return useMutation({
        mutationFn: (userData) => authApi.register(userData),
        onSuccess: (response) => {
            const { token, user } = extractData(response) || {};

            if (token && user) {
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
            }
        }
    });
};

/**
 * Hook for getting current user
 * @returns {Object} - Current user query
 */
export const useCurrentUser = () => {
    return useQuery({
        queryKey: ['currentUser'],
        queryFn: () => authApi.getCurrentUser(),
        select: (response) => extractData(response),
        onSuccess: (data) => {
            if (data) {
                localStorage.setItem('user', JSON.stringify(data));
            }
        },
        enabled: !!localStorage.getItem('token')
    });
};

/**
 * Hook for updating user profile
 * @returns {Object} - Update profile mutation
 */
export const useUpdateProfile = () => {
    return useMutation({
        mutationFn: (userData) => authApi.updateProfile(userData),
        onSuccess: (response) => {
            const userData = extractData(response);
            if (userData) {
                const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
                localStorage.setItem('user', JSON.stringify({ ...currentUser, ...userData }));
            }
        }
    });
};

/**
 * Hook for updating profile picture
 * @returns {Object} - Update profile picture mutation
 */
export const useUpdateProfilePicture = () => {
    return useMutation({
        mutationFn: (formData) => authApi.updateProfilePicture(formData),
        onSuccess: (response) => {
            const userData = extractData(response);
            if (userData) {
                const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
                localStorage.setItem('user', JSON.stringify({ ...currentUser, ...userData }));
            }
        }
    });
};

/**
 * Hook for updating password
 * @returns {Object} - Update password mutation
 */
export const useUpdatePassword = () => {
    return useMutation({
        mutationFn: (passwordData) => authApi.updatePassword(passwordData)
    });
};

/**
 * Hook for user logout
 * @returns {Object} - Logout mutation
 */
export const useLogout = () => {
    return useMutation({
        mutationFn: () => {
            // Clear local storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // Call logout API
            return authApi.logout();
        }
    });
}; 