import dotenv from 'dotenv';

dotenv.config();

const getEnvVariable = (key: string, defaultValue?: string): string => {
  const value = process.env[key];
  if (!value && !defaultValue) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value || defaultValue || '';
};

export const env = {
  // Server
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  API_URL: getEnvVariable('API_URL', 'http://localhost:5000'),
  FRONTEND_URL: getEnvVariable('FRONTEND_URL', 'http://localhost:5173'),

  // Database
  DATABASE_URL: getEnvVariable('DATABASE_URL'),

  // JWT
  JWT_SECRET: getEnvVariable('JWT_SECRET'),
  JWT_REFRESH_SECRET: getEnvVariable('JWT_REFRESH_SECRET'),
  JWT_EXPIRY: getEnvVariable('JWT_EXPIRY', '15m'),
  JWT_REFRESH_EXPIRY: getEnvVariable('JWT_REFRESH_EXPIRY', '7d'),

  // OAuth2 - Google
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL: getEnvVariable('GOOGLE_CALLBACK_URL'),

  // OpenAI
  OPENAI_API_KEY: getEnvVariable('OPENAI_API_KEY'),

  // Security
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS || '10', 10),

  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',
  LOG_FORMAT: process.env.LOG_FORMAT || 'json',

  // Email
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,

  // Redis
  REDIS_URL: process.env.REDIS_URL,

  // Feature flags
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
};

export const validateEnv = (): void => {
  const requiredVars = [
    'DATABASE_URL',
    'JWT_SECRET',
    'JWT_REFRESH_SECRET',
    'OPENAI_API_KEY',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
  ];

  const missing = requiredVars.filter((varName) => !process.env[varName]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
};
