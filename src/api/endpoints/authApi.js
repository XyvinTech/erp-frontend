import apiClient from '../apiClient';

/**
 * Authentication API endpoints
 */
const authApi = {
    /**
     * Login user
     * @param {Object} credentials - User credentials
     * @param {String} credentials.email - User email
     * @param {String} credentials.password - User password
     * @returns {Promise} - API response
     */
    login: (credentials) => {
        return apiClient.post('/api/auth/login', credentials);
    },

    /**
     * Register user
     * @param {Object} userData - User data
     * @returns {Promise} - API response
     */
    register: (userData) => {
        return apiClient.post('/api/auth/register', userData);
    },

    /**
     * Get current user
     * @returns {Promise} - API response
     */
    getCurrentUser: () => {
        return apiClient.get('/api/auth/me');
    },

    /**
     * Update user profile
     * @param {Object} userData - User data
     * @returns {Promise} - API response
     */
    updateProfile: (userData) => {
        return apiClient.patch('/api/hrm/employees/me', userData);
    },

    /**
     * Update profile picture
     * @param {FormData} formData - Form data with profile picture
     * @returns {Promise} - API response
     */
    updateProfilePicture: (formData) => {
        return apiClient.post('/api/hrm/employees/me/profile-picture', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    /**
     * Update password
     * @param {Object} passwordData - Password data
     * @returns {Promise} - API response
     */
    updatePassword: (passwordData) => {
        return apiClient.patch('/api/auth/update-password', passwordData);
    },

    /**
     * Logout user
     * @returns {Promise} - API response
     */
    logout: () => {
        return apiClient.post('/api/auth/logout');
    }
};

export default authApi; 