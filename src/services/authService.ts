import axiosInstance from '@api/axiosInstance';
import { handleApiError, logError } from '@api/errorHandler';
import { AxiosError } from 'axios';

/**
 * Type definitions for Auth Service
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string; // Required by backend
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: 'student' | 'instructor' | 'admin';
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    avatar?: string;
  };
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  avatar?: string;
  createdAt: string;
}

/**
 * Authentication Service
 * Handles login, registration, logout, and user management
 */
class AuthService {
  /**
   * Login with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse | null> {
    try {
      const response = await axiosInstance.post(
        '/auth/login',
        credentials
      );

      const payload = response.data.data;
      const { accessToken: token, refreshToken, user } = payload;

      // Store tokens and user data in localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      return payload;
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        'Failed to login. Please check your email and password.'
      );
      logError('AuthService.login', error);
      throw new Error(errorMessage);
    }
  }

  /**
   * Register a new user
   */
  async register(data: RegisterData): Promise<AuthResponse | null> {
    try {
      // Remove confirmPassword before sending to backend
      const { confirmPassword, ...registerPayload } = data;

      const response = await axiosInstance.post(
        '/auth/register',
        registerPayload
      );

      const payload = response.data.data;
      const { accessToken: token, refreshToken, user } = payload;

      // Store tokens and user data in localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      return payload;
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        'Failed to register. Please try again.'
      );
      logError('AuthService.register', error);
      throw new Error(errorMessage);
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      // Call logout endpoint to invalidate token on backend
      await axiosInstance.post('/auth/logout');

      // Clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    } catch (error) {
      // Even if logout API fails, clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');

      logError('AuthService.logout', error);
      // Don't throw - logout should always succeed locally
    }
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<AuthResponse | null> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await axiosInstance.post(
        '/auth/refresh',
        { refreshToken }
      );

      const payload = response.data.data;
      const { accessToken: token, refreshToken: newRefreshToken, user } = payload;

      // Update tokens in localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('refreshToken', newRefreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      return payload;
    } catch (error) {
      // If refresh fails, logout the user
      this.logout();
      logError('AuthService.refreshToken', error);
      throw new Error('Session expired. Please log in again.');
    }
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await axiosInstance.get<User>('/auth/me');
      return response.data;
    } catch (error) {
      logError('AuthService.getCurrentUser', error);
      return null;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(userData: Partial<User>): Promise<User | null> {
    try {
      const response = await axiosInstance.put<User>(
        '/auth/profile',
        userData
      );

      // Update user in localStorage
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        'Failed to update profile. Please try again.'
      );
      logError('AuthService.updateProfile', error);
      throw new Error(errorMessage);
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  /**
   * Get stored user data from localStorage
   */
  getStoredUser(): User | null {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  }

  /**
   * Get auth token from localStorage
   */
  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }
}

export default new AuthService();
