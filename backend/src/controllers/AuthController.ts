import { Response } from 'express';
import { AuthenticatedRequest, ApiResponse } from '@types/index.js';
import { AuthService } from '@services/AuthService.js';
import { loginSchema, registerSchema, refreshTokenSchema, validateData } from '@validators/schemas.js';
import logger from '@config/logger.js';

export class AuthController {
  static async register(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { data, error } = await validateData(registerSchema, req.body);
      if (error) {
        res.status(422).json({
          success: false,
          status: 422,
          message: error,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const result = await AuthService.register(data);

      const response: ApiResponse = {
        success: true,
        status: 201,
        message: 'User registered successfully',
        data: result,
        timestamp: new Date().toISOString(),
      };

      res.status(201).json(response);
      logger.info(`User registration successful: ${result.user.id}`);
    } catch (error) {
      logger.error('Registration error:', error);
      throw error;
    }
  }

  static async login(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { data, error } = await validateData(loginSchema, req.body);
      if (error) {
        res.status(422).json({
          success: false,
          status: 422,
          message: error,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const result = await AuthService.login(data.email, data.password);

      const response: ApiResponse = {
        success: true,
        status: 200,
        message: 'Login successful',
        data: result,
        timestamp: new Date().toISOString(),
      };

      res.json(response);
      logger.info(`User login successful: ${result.user.id}`);
    } catch (error) {
      logger.error('Login error:', error);
      throw error;
    }
  }

  static async refreshToken(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { data, error } = await validateData(refreshTokenSchema, req.body);
      if (error) {
        res.status(422).json({
          success: false,
          status: 422,
          message: error,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const tokens = await AuthService.refreshToken(data.refreshToken);

      const response: ApiResponse = {
        success: true,
        status: 200,
        message: 'Token refreshed successfully',
        data: tokens,
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error) {
      logger.error('Refresh token error:', error);
      throw error;
    }
  }

  static async logout(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({
          success: false,
          status: 400,
          message: 'Refresh token required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      await AuthService.logout(refreshToken);

      const response: ApiResponse = {
        success: true,
        status: 200,
        message: 'Logout successful',
        timestamp: new Date().toISOString(),
      };

      res.json(response);
      logger.info(`User logout: ${req.userId}`);
    } catch (error) {
      logger.error('Logout error:', error);
      throw error;
    }
  }

  static async getCurrentUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const response: ApiResponse = {
        success: true,
        status: 200,
        message: 'User retrieved successfully',
        data: req.user,
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error) {
      logger.error('Get current user error:', error);
      throw error;
    }
  }

  // OAuth2 Google callback
  static async googleCallback(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          status: 401,
          message: 'Authentication failed',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const result = await AuthService.googleAuth(req.user);

      // In production, you'd redirect to frontend with tokens
      res.json({
        success: true,
        status: 200,
        message: 'Google authentication successful',
        data: result,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error('Google OAuth error:', error);
      throw error;
    }
  }
}
