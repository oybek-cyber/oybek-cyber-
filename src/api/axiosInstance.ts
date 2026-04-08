import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';

/**
 * Create a custom Axios instance with:
 * - Base URL from environment variables
 * - Default headers
 * - Request/Response interceptors for JWT auth & error handling
 */
const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * - Attach JWT token from localStorage if it exists
 * - Add authorization header automatically
 */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * - Handle global errors (401 Unauthorized, etc.)
 * - Log errors for debugging
 * - Implement custom error handling
 */
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Success response
    return response;
  },
  async (error: AxiosError) => {
    const { status, data } = error.response || {};

    // Handle 401 Unauthorized - Clear auth and redirect to login
    if (status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      // Redirect to login page
      window.location.href = '/login';
    }

    // Handle 403 Forbidden
    if (status === 403) {
      console.warn('Access forbidden:', data);
    }

    // Handle 404 Not Found
    if (status === 404) {
      console.warn('Resource not found:', data);
    }

    // Handle 500 Server errors
    if (status && status >= 500) {
      console.error('Server error:', data);
    }

    // Return error for caller to handle
    return Promise.reject(error);
  }
);

export default axiosInstance;
