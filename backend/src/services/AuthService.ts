import { UserRepository } from '@repositories/UserRepository.js';
import { JWTService } from '@utils/jwt.js';
import { PasswordService } from '@utils/password.js';
import { AppErrorHandler } from '@utils/errors.js';
import { TokenPair, AuthPayload } from '@app-types/index.js';
import logger from '@config/logger.js';

export class AuthService {
  static async register(data: {
    email: string;
    username: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }): Promise<any> {
    // Check if user exists
    const existingEmail = await UserRepository.findByEmail(data.email);
    if (existingEmail) {
      throw AppErrorHandler.conflict('Email already registered');
    }

    const existingUsername = await UserRepository.findByUsername(data.username);
    if (existingUsername) {
      throw AppErrorHandler.conflict('Username already taken');
    }

    // Validate password strength
    const passwordCheck = PasswordService.validatePasswordStrength(data.password);
    if (!passwordCheck.isStrong) {
      throw AppErrorHandler.badRequest(passwordCheck.errors.join(', '));
    }

    // Hash password
    const hashedPassword = await PasswordService.hash(data.password);

    // Create user
    const user = await UserRepository.create({
      email: data.email,
      username: data.username,
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      role: 'STUDENT',
    });

    logger.info(`New user registered: ${user.id} (${user.email})`);

    // Generate tokens
    const tokens = this.generateTokenPair(user.id, user.email, user.username, user.role);

    // Save refresh token
    const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await UserRepository.saveRefreshToken(user.id, tokens.refreshToken, expiryDate);

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      ...tokens,
    };
  }

  static async login(email: string, password: string): Promise<any> {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw AppErrorHandler.unauthorized('Invalid credentials');
    }

    if (!user.password) {
      throw AppErrorHandler.badRequest('User registered via OAuth. Use OAuth login.');
    }

    const isPasswordValid = await PasswordService.compare(password, user.password);
    if (!isPasswordValid) {
      throw AppErrorHandler.unauthorized('Invalid credentials');
    }

    if (!user.isActive) {
      throw AppErrorHandler.forbidden('User account is inactive');
    }

    logger.info(`User logged in: ${user.id}`);

    // Generate tokens
    const tokens = this.generateTokenPair(user.id, user.email, user.username, user.role);

    // Save refresh token
    const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await UserRepository.saveRefreshToken(user.id, tokens.refreshToken, expiryDate);

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      ...tokens,
    };
  }

  static async refreshToken(refreshToken: string): Promise<TokenPair> {
    try {
      const decoded = JWTService.verifyRefreshToken(refreshToken);

      // Check if token exists in database
      const storedToken = await UserRepository.findRefreshToken(refreshToken);
      if (!storedToken || storedToken.expiresAt < new Date()) {
        throw AppErrorHandler.unauthorized('Refresh token expired or invalid');
      }

      // Get user
      const user = await UserRepository.findById(decoded.id);
      if (!user) {
        throw AppErrorHandler.notFound('User');
      }

      // Generate new token pair
      const tokens = this.generateTokenPair(user.id, user.email, user.username, user.role);

      // Revoke old refresh token
      await UserRepository.revokeRefreshToken(refreshToken);

      // Save new refresh token
      const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      await UserRepository.saveRefreshToken(user.id, tokens.refreshToken, expiryDate);

      return tokens;
    } catch (error) {
      if (error instanceof Error) {
        throw AppErrorHandler.unauthorized(error.message);
      }
      throw AppErrorHandler.unauthorized('Invalid refresh token');
    }
  }

  static async googleAuth(profile: any): Promise<any> {
    const email = profile.emails?.[0]?.value;
    const googleId = profile.id;

    if (!email) {
      throw AppErrorHandler.badRequest('No email provided by Google');
    }

    // Check if user exists by Google ID
    let user = await UserRepository.findByGoogleId(googleId);

    if (!user) {
      // Check if user exists by email
      user = await UserRepository.findByEmail(email);

      if (!user) {
        // Create new user
        user = await UserRepository.create({
          email,
          username: email.split('@')[0],
          googleId,
          googleEmail: email,
          firstName: profile.displayName?.split(' ')[0],
          lastName: profile.displayName?.split(' ').slice(1).join(' '),
          role: 'STUDENT',
        });

        logger.info(`New user created via Google OAuth: ${user.id}`);
      } else {
        // Link Google account to existing user
        user = await UserRepository.update(user.id, {
          googleId,
          googleEmail: email,
        });
      }
    }

    // Generate tokens
    const tokens = this.generateTokenPair(user.id, user.email, user.username, user.role);

    // Save refresh token
    const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await UserRepository.saveRefreshToken(user.id, tokens.refreshToken, expiryDate);

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      ...tokens,
    };
  }

  static async logout(refreshToken: string): Promise<void> {
    try {
      await UserRepository.revokeRefreshToken(refreshToken);
      logger.info('User logged out');
    } catch (error) {
      logger.warn('Logout error:', error);
    }
  }

  private static generateTokenPair(
    userId: string,
    email: string,
    username: string,
    role: string
  ): TokenPair {
    const payload: Omit<AuthPayload, 'iat' | 'exp'> = {
      id: userId,
      email,
      username,
      role: role,
    };

    return JWTService.generateTokenPair(payload);
  }
}
