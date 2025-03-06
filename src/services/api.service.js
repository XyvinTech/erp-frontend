import axios from 'axios';
import { toast } from 'react-hot-toast';
import authService from './auth.service';

const API_URL = import.meta.env.VITE_API_URL;

console.log('API URL:', API_URL); // Log API URL for debugging

/**
 * Base API service that provides common functionality for all API services
 */
class ApiService {
  constructor(baseURL) {
    this.baseURL = baseURL;

    // Ensure baseURL starts with /api
    const apiPath = baseURL.startsWith('/api') ? baseURL : `/api${baseURL}`;
    
    this.api = axios.create({
      baseURL: `${API_URL}${apiPath}`,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // Enable cookies if your backend uses sessions
    });

    // Add request interceptor
    this.api.interceptors.request.use(
      (config) => {
        // Add token to request headers if available
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log('Request URL:', config.url);
          console.log('Auth Header:', config.headers.Authorization);
        }
        return config;
      },
      (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        console.error('API Error Details:', {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          data: error.response?.data,
          headers: error.config?.headers
        });
        
        // If token is expired or invalid, try to refresh it
        if (error.response?.status === 401) {
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken) {
            try {
              const response = await axios.post(`${API_URL}/api/auth/refresh-token`, {
                refreshToken
              });
              const { token } = response.data;
              localStorage.setItem('token', token);
              
              // Retry the original request
              error.config.headers.Authorization = `Bearer ${token}`;
              return this.api.request(error.config);
            } catch (refreshError) {
              console.error('Token refresh failed:', refreshError);
              // Store the current URL before redirecting
              localStorage.setItem('redirectUrl', window.location.pathname);
              authService.logout();
              window.location.href = '/login';
            }
          } else {
            // Store the current URL before redirecting
            localStorage.setItem('redirectUrl', window.location.pathname);
            authService.logout();
            window.location.href = '/login';
          }
        }
        
        this.handleError(error);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Handle API errors
   */
  handleError(error) {
    let message = 'An error occurred';
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      message = error.response.data?.message || `Error: ${error.response.status}`;
      
      // Handle specific status codes
      switch (error.response.status) {
        case 401:
          console.log('401 error detected. Token:', localStorage.getItem('token'));
          authService.logout(); // This will remove token and user from localStorage
          window.location.href = '/login';
          break;
        case 403:
          message = 'You do not have permission to perform this action';
          break;
        case 404:
          message = 'The requested resource was not found';
          break;
        case 422:
          message = 'Validation failed';
          break;
      }
    } else if (error.request) {
      // The request was made but no response was received
      message = 'No response from server. Please check your connection.';
      console.error('No response from server:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }

    if (error.response?.status !== 401) {
      toast.error(message);
    }
  }

  getHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
  }

  /**
   * GET request
   */
  async get(endpoint, params = {}) {
    try {
      const response = await this.api.get(endpoint, {
        params,
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('API Error:', {
        method: 'GET',
        endpoint,
        params,
        error: error.response?.data || error.message
      });
      this.handleError(error);
      throw error;
    }
  }

  /**
   * POST request
   */
  async post(endpoint, data = {}) {
    try {
      const response = await this.api.post(endpoint, data);
      return response.data;
    } catch (error) {
      console.error('API Error:', {
        method: 'POST',
        endpoint,
        data,
        error: error.response?.data || error.message
      });
      this.handleError(error);
      throw error;
    }
  }

  /**
   * PUT request
   */
  async put(endpoint, data = {}) {
    try {
      const response = await this.api.put(endpoint, data);
      return response.data;
    } catch (error) {
      console.error('API Error:', {
        method: 'PUT',
        endpoint,
        data,
        error: error.response?.data || error.message
      });
      this.handleError(error);
      throw error;
    }
  }

  /**
   * PATCH request
   */
  async patch(endpoint, data = {}) {
    try {
      const response = await this.api.patch(endpoint, data);
      return response.data;
    } catch (error) {
      console.error('API Error:', {
        method: 'PATCH',
        endpoint,
        data,
        error: error.response?.data || error.message
      });
      this.handleError(error);
      throw error;
    }
  }

  /**
   * DELETE request
   */
  async delete(endpoint) {
    try {
      const response = await this.api.delete(endpoint);
      return response.data;
    } catch (error) {
      console.error('API Error:', {
        method: 'DELETE',
        endpoint,
        error: error.response?.data || error.message
      });
      this.handleError(error);
      throw error;
    }
  }
}

export default ApiService; 