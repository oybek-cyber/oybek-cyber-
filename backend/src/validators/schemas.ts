import { z } from 'zod';

// ============================================
// AUTH VALIDATORS
// ============================================

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z.string().min(3).max(20),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain uppercase letter')
    .regex(/[a-z]/, 'Must contain lowercase letter')
    .regex(/[0-9]/, 'Must contain number')
    .regex(/[!@#$%^&*]/, 'Must contain special character'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z
    .string()
    .min(8)
    .regex(/[A-Z]/, 'Must contain uppercase letter')
    .regex(/[a-z]/, 'Must contain lowercase letter')
    .regex(/[0-9]/, 'Must contain number'),
});

// ============================================
// COURSE VALIDATORS
// ============================================

export const createCourseSchema = z.object({
  title: z.string().min(5).max(255),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Invalid slug format'),
  description: z.string().min(10).max(2000),
  category: z.enum([
    'CISCO',
    'WINDOWS_SERVER',
    'LINUX',
    'ETHICAL_HACKING',
    'MALWARE_ANALYSIS',
    'CLOUD_SECURITY',
    'NETWORK_SECURITY',
    'WEB_SECURITY',
  ]),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']),
  thumbnail: z.string().url().optional(),
  duration: z.number().optional(),
});

export const updateCourseSchema = createCourseSchema.partial();

export const publishCourseSchema = z.object({
  isPublished: z.boolean(),
});

// ============================================
// LESSON VALIDATORS
// ============================================

export const createLessonSchema = z.object({
  title: z.string().min(3).max(255),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
  content: z.string().min(1),
  order: z.number().int().positive(),
  videoUrl: z.string().url().optional(),
  youtubeVideoId: z.string().optional(),
});

export const updateLessonSchema = createLessonSchema.partial();

// ============================================
// PAGE VALIDATORS
// ============================================

export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
  search: z.string().optional(),
});

// ============================================
// TERMINAL VALIDATORS
// ============================================

export const terminalChatSchema = z.object({
  message: z.string().min(1).max(2000),
  sessionId: z.string().optional(),
  context: z
    .object({
      course: z.string().optional(),
      lesson: z.string().optional(),
      topic: z.string().optional(),
      level: z.string().optional(),
    })
    .optional(),
});

// ============================================
// QUIZ VALIDATORS
// ============================================

export const submitQuizSchema = z.object({
  answers: z.record(z.string(), z.any()),
});

// ============================================
// VALIDATOR HELPER
// ============================================

export const validateData = async <T>(
  schema: z.ZodSchema,
  data: any
): Promise<{ data?: T; error?: string }> => {
  try {
    const validated = await schema.parseAsync(data);
    return { data: validated };
  } catch (err) {
    if (err instanceof z.ZodError) {
      const errorMessages = err.errors.map((e) => e.message).join(', ');
      return { error: errorMessages };
    }
    return { error: 'Validation failed' };
  }
};
