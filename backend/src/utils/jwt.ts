import jwt from 'jsonwebtoken';
import { env } from '@config/env.js';
import { AuthPayload, TokenPair } from '@app-types/index.js';

export class JWTService {
  static generateAccessToken(payload: Omit<AuthPayload, 'iat' | 'exp'>): string {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRY as any,
    });
  }

  static generateRefreshToken(userId: string): string {
    return jwt.sign({ id: userId }, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRY as any,
    });
  }

  static generateTokenPair(payload: Omit<AuthPayload, 'iat' | 'exp'>): TokenPair {
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload.id);

    // Decode to get expiry
    const decoded = jwt.decode(accessToken) as any;

    return {
      accessToken,
      refreshToken,
      expiresIn: decoded.exp - decoded.iat,
    };
  }

  static verifyAccessToken(token: string): AuthPayload {
    try {
      return jwt.verify(token, env.JWT_SECRET) as AuthPayload;
    } catch (error) {
      throw new Error('Invalid or expired access token');
    }
  }

  static verifyRefreshToken(token: string): { id: string; iat: number; exp: number } {
    try {
      return jwt.verify(token, env.JWT_REFRESH_SECRET) as any;
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }

  static decodeToken(token: string): any {
    return jwt.decode(token);
  }
}
