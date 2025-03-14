import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Create a configured axios instance for API requests
 * @returns {Object} Axios instance
 */
const createApiClient = () => {
    const client = axios.create({
        baseURL: API_URL,
        headers: {
            'Content-Type': 'application/json',
        },
        withCredentials: true // Enable sending cookies in cross-origin requests
    });

    // Add a request interceptor to include the token in requests
    client.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // Add a response interceptor to handle token expiration
    client.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                // Clear local storage
                localStorage.removeItem('token');
                localStorage.removeItem('user');

                // Redirect to login page
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
            }
            return Promise.reject(error);
        }
    );

    return client;
};

const apiClient = createApiClient();

export default apiClient; 