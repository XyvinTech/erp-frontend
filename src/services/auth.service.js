import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

class AuthService {
  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true // Enable sending cookies in cross-origin requests
    });

    // Add a request interceptor to include the token in requests
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getToken();
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
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.logout();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Login user
   */
  async login(email, password) {
    try {
      const response = await this.api.post('/api/auth/login', { email, password });
      const { token, user } = response?.data?.data || {};
      
      if (token && user) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Register new user
   */
  async register(userData) {
    try {
      const response = await this.api.post('/api/auth/register', userData);
      const { token, user } = response?.data?.data || {};
      
      if (token && user) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
      }
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  /**
   * Logout user
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  /**
   * Get current user profile
   */
  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(userData) {
    try {
      const user = this.getCurrentUser();
      if (!user || !user._id) {
        throw new Error('User not found in local storage');
      }

      // First try the /me endpoint
      try {
        const response = await this.api.patch('/api/hrm/employees/me', userData);
        if (response.data.status === 'success') {
          const updatedUser = {
            ...user,
            ...response.data.data.employee
          };
          this.updateUser(updatedUser);
          return response.data;
        }
      } catch (error) {
        // If /me endpoint fails, try with ID
        if (error.response?.status === 404) {
          const response = await this.api.patch(`/api/hrm/employees/${user._id}`, userData);
          if (response.data.status === 'success') {
            const updatedUser = {
              ...user,
              ...response.data.data.employee
            };
            this.updateUser(updatedUser);
            return response.data;
          }
        }
        throw error;
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  /**
   * Get user profile
   */
  async getProfile() {
    try {
      const response = await this.api.get('/api/hrm/employees/me');
      if (response.data.status === 'success') {
        this.updateUser(response.data.data.employee);
        return response.data;
      }
      throw new Error('Failed to get profile');
    } catch (error) {
      console.error('Error getting profile:', error);
      throw error;
    }
  }

  /**
   * Update profile picture
   */
  async updateProfilePicture(formData) {
    try {
      const response = await this.api.post('/api/hrm/employees/me/profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Raw profile picture update response:', response);

      if (response?.data?.status === 'success' && response.data.data) {
        const updatedUser = response.data.data.employee;
        
        if (!updatedUser) {
          console.error('Invalid response format:', response.data);
          throw new Error('No employee data in response');
        }

        if (!updatedUser.profilePicture) {
          console.error('No profile picture in response:', updatedUser);
          throw new Error('No profile picture URL in response');
        }

        // Store the user data
        this.updateUser(updatedUser);
        return {
          data: {
            status: 'success',
            data: { employee: updatedUser }
          }
        };
      }
      
      throw new Error(response?.data?.message || 'Failed to update profile picture');
    } catch (error) {
      console.error('Error updating profile picture:', error);
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error.message || 'Server error');
      }
      throw error;
    }
  }

  /**
   * Update user password
   */
  async updatePassword(passwordData) {
    try {
      const response = await this.api.patch('/updatePassword', passwordData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!this.getToken();
  }

  getToken() {
    return localStorage.getItem('token');
  }

  updateToken(token) {
    if (token) {
      localStorage.setItem('token', token);
    }
  }

  updateUser(user) {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }
}

// Create and export a singleton instance
const authService = new AuthService();
export default authService; 