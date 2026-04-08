import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

// ============================================
// EXTENDED EXPRESS REQUEST
// ============================================

export interface AuthenticatedRequest extends Request {
  user?: AuthPayload;
  userId?: string;
  role?: string;
}

// ============================================
// JWT & AUTH TYPES
// ============================================

export interface AuthPayload extends JwtPayload {
  id: string;
  email: string;
  username: string;
  role: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface OAuthProfile {
  id: string;
  displayName: string;
  emails: Array<{ value: string }>;
  photos: Array<{ value: string }>;
  provider: string;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T = any> {
  success: boolean;
  status: number;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// ============================================
// COURSE & LESSON TYPES
// ============================================

export interface CourseDTO {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  level: string;
  thumbnail?: string;
  duration?: number;
  isPublished: boolean;
  instructorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LessonDTO {
  id: string;
  title: string;
  slug: string;
  description?: string;
  order: number;
  videoUrl?: string;
  youtubeVideoId?: string;
  courseId: string;
  isPublished: boolean;
  createdAt: Date;
}

// ============================================
// TERMINAL & AI TYPES
// ============================================

export interface TerminalMessageDTO {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface TerminalContextData {
  course?: string;
  lesson?: string;
  topic?: string;
  level?: string;
}

export interface OpenAIResponse {
  message: string;
  tokensUsed: number;
}

// ============================================
// NEWS & UPDATES TYPES
// ============================================

export interface NewsArticleDTO {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  source: string;
  category: string;
  severity: string;
  publishedAt: Date;
}

// ============================================
// ERROR TYPES
// ============================================

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational: boolean = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

// ============================================
// VALIDATION TYPES
// ============================================

export interface ValidationError {
  field: string;
  message: string;
}

// ============================================
// QUERY TYPES
// ============================================

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}
