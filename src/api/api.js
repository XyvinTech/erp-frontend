import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api/v1',
  // baseURL: 'https://erp-backend-189792861103.us-central1.run.app/api/v1',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000, 
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config; 
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default api;
