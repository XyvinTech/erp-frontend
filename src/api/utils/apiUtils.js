/**
 * Utility functions for handling API responses
 */

/**
 * Extract data from API response
 * @param {Object} response - API response
 * @returns {Object} - Extracted data
 */
export const extractData = (response) => {
    if (!response) return null;

    // Handle different response formats
    if (response.data?.data) {
        return response.data.data;
    } else if (response.data) {
        return response.data;
    }

    return response;
};

/**
 * Format error message from API error
 * @param {Object} error - API error
 * @returns {String} - Formatted error message
 */
export const formatErrorMessage = (error) => {
    if (!error) return 'An unknown error occurred';

    // Handle different error formats
    if (error.response?.data?.message) {
        return error.response.data.message;
    } else if (error.response?.data?.error) {
        return error.response.data.error;
    } else if (error.message) {
        return error.message;
    }

    return 'An unknown error occurred';
};

/**
 * Check if API response is successful
 * @param {Object} response - API response
 * @returns {Boolean} - Whether the response is successful
 */
export const isSuccessResponse = (response) => {
    if (!response) return false;

    // Handle different response formats
    if (response.data?.success !== undefined) {
        return response.data.success;
    } else if (response.status >= 200 && response.status < 300) {
        return true;
    }

    return false;
}; 