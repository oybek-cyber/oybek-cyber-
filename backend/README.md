# Cybersecurity LMS Backend - Production Setup Guide

## Project Structure

```
backend/
├── src/
│   ├── controllers/          # Request handlers
│   │   ├── AuthController.ts
│   │   └── TerminalController.ts
│   ├── services/             # Business logic
│   │   ├── AuthService.ts
│   │   └── TerminalService.ts
│   ├── repositories/         # Data access layer
│   │   ├── UserRepository.ts
│   │   └── CourseRepository.ts
│   ├── middleware/           # Express middleware
│   │   ├── auth.ts
│   │   ├── error.ts
│   │   └── rateLimiter.ts
│   ├── guards/               # Authorization guards
│   ├── routes/               # API routes
│   │   ├── auth.ts
│   │   ├── terminal.ts
│   │   └── health.ts
│   ├── validators/           # Input validation schemas
│   │   └── schemas.ts
│   ├── utils/                # Utility functions
│   │   ├── jwt.ts
│   │   ├── password.ts
│   │   ├── errors.ts
│   │   └── prisma.ts
│   ├── types/                # TypeScript types
│   │   └── index.ts
│   ├── config/               # Configuration
│   │   ├── env.ts
│   │   ├── logger.ts
│   │   └── setup.ts
│   └── server.ts             # Entry point
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── migrations/           # Database migrations
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## Architecture Pattern: Controller-Service-Repository

### Layer Responsibilities:

1. **Controllers** - Handle HTTP requests/responses
   - Parse and validate input
   - Call services
   - Return formatted responses
   - Error handling delegation

2. **Services** - Core business logic
   - Domain operations
   - Data validation
   - Business rules enforcement
   - External API integration

3. **Repositories** - Data access abstraction
   - Prisma queries
   - Database operations
   - Data transformation
   - Single responsibility per entity

## Installation & Setup

### Prerequisites
- Node.js 18+ 
- PostgreSQL 13+
- npm or yarn

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

### Step 2: Configure Environment

```bash
cp .env.example .env
```

Update `.env` with your credentials:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/cybersecurity_lms"

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_ultra_secure_secret_key_min_32_chars
JWT_REFRESH_SECRET=your_ultra_secure_refresh_secret_min_32_chars

# OAuth2 (Get from Google Cloud Console)
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_secret

# OpenAI
OPENAI_API_KEY=sk-your_key_here
```

### Step 3: Setup Database

```bash
# Run Prisma migrations
npm run db:migrate

# Or push schema (development only)
npm run db:push

# Open Prisma Studio to view data
npm run db:studio
```

### Step 4: Start Development Server

```bash
npm run dev
```

Server will start at: `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user (protected)

### Terminal/AI Features
- `POST /api/terminal/chat` - Send message to AI mentor (protected, rate-limited)
- `GET /api/terminal/sessions` - List terminal sessions (protected)
- `GET /api/terminal/sessions/:sessionId` - Get session details (protected)
- `DELETE /api/terminal/sessions/:sessionId` - Delete session (protected)

### Health
- `GET /health` - Health check
- `GET /status` - API status

## Security Features

### 1. **Authentication & Authorization**
- JWT-based token authentication
- Refresh token rotation
- Role-based access control (Student, Instructor, Admin)
- OAuth2 Google login integration
- Secure password hashing (bcrypt)

### 2. **Input Validation**
- Zod-based schema validation
- Type-safe data parsing
- Request sanitization
- File upload restrictions

### 3. **HTTP Security**
- Helmet.js for security headers
- CORS configuration
- Rate limiting (global and per-endpoint)
- Body size limits

### 4. **Data Protection**
- SQL injection prevention (Prisma)
- XSS protection
- CSRF tokens (optional)
- Sensitive data masking in logs

### 5. **AI Safety**
- Dangerous prompt detection
- System message prevention
- Content filtering
- Token usage monitoring

### 6. **Audit & Logging**
- Structured logging (Winston)
- Request/response logging
- Error tracking
- User action auditing

## Key Technologies

### Core
- **TypeScript** - Type safety
- **Express.js** - Web framework
- **Node.js** - Runtime

### Database
- **PostgreSQL** - Relational database
- **Prisma** - ORM & migrations

### Authentication
- **jsonwebtoken** - JWT implementation
- **bcrypt** - Password hashing
- **passport.js** - OAuth2 handling

### AI Integration
- **OpenAI API** - GPT-4 integration
- Custom system prompts for safety

### Validation & Error Handling
- **Zod** - Schema validation
- Custom AppError class
- Global error handler middleware

### Security
- **Helmet.js** - Security headers
- **express-rate-limit** - Rate limiting
- **CORS** - Cross-origin requests

### Monitoring
- **Winston** - Structured logging
- Request/response timing
- Error tracking

## Database Schema Highlights

### Users Table
- Role-based access (RBAC)
- OAuth2 integration fields
- Profile management

### Courses & Lessons
- Dynamic course structure
- Video integration (YouTube)
- Resource attachments (.pkt, .iso, .sh files)

### Learning Progress
- Enrollment tracking
- Lesson completion
- Quiz management
- Assignment submissions

### AI Terminal
- Session persistence
- Message history
- Token usage tracking

### News & Updates
- RSS feed integration
- Severity classification
- Category organization

## Best Practices Implemented

### Code Organization
✓ Clear separation of concerns
✓ DRY (Don't Repeat Yourself)
✓ Single Responsibility Principle
✓ Modular route structure

### Error Handling
✓ Centralized error middleware
✓ Meaningful HTTP status codes
✓ User-friendly error messages
✓ Error logging with context

### Type Safety
✓ Strict TypeScript configuration
✓ Request/response types
✓ Enum usage for constants
✓ Union types for flexibility

### Security
✓ No secrets in code
✓ Environment-based configuration
✓ SQL injection prevention
✓ Rate limiting
✓ CORS whitelist

### Performance
✓ Query optimization (Prisma)
✓ Pagination support
✓ Connection pooling
✓ Async/await patterns

## Development Workflow

### Adding New Features

1. **Define Model** → `prisma/schema.prisma`
2. **Create Migration** → `npm run db:migrate`
3. **Create Repository** → `src/repositories/EntityRepository.ts`
4. **Create Service** → `src/services/EntityService.ts`
5. **Create Controller** → `src/controllers/EntityController.ts`
6. **Create Routes** → `src/routes/entity.ts`
7. **Add Validation** → `src/validators/schemas.ts`
8. **Test Endpoints** → Use Postman/Insomnia

### Database Updates

```bash
# Create migration
npx prisma migrate dev --name add_new_field

# Apply migrations
npm run db:push

# Review pending migrations
npx prisma migrate status
```

## Deployment

### Production Checklist

- [ ] All environment variables configured
- [ ] Database backups enabled
- [ ] SSL/TLS certificates installed
- [ ] Rate limits adjusted for production
- [ ] Logging level set to 'info'
- [ ] Build optimization enabled
- [ ] Health checks configured
- [ ] Monitoring and alerting setup
- [ ] API documentation deployed
- [ ] Security headers verified

### Build & Deploy

```bash
# Build TypeScript
npm run build

# Start production server
npm start
```

## Monitoring & Logging

### Log Levels
- **error** - Errors only
- **warn** - Warnings and errors
- **info** - Info, warnings, and errors
- **debug** - All messages (development)

### Log Files
- `logs/error.log` - Error logs
- `logs/all.log` - All logs
- `logs/exceptions.log` - Uncaught exceptions
- `logs/rejections.log` - Unhandled Promise rejections

## Testing

```bash
# Run tests
npm run test

# Coverage report
npm run test:coverage
```

## Troubleshooting

### Database Connection Issues
```bash
# Test connection
psql $DATABASE_URL

# Reset migrations (development only)
npx prisma migrate reset
```

### JWT Token Issues
- Verify JWT_SECRET is set and >= 32 characters
- Check token expiry times
- Ensure refresh token is stored in database

### OpenAI API Issues
- Verify API key is valid
- Check account credit balance
- Monitor rate limits
- Test with curl: `curl https://api.openai.com/v1/models -H "Authorization: Bearer $OPENAI_API_KEY"`

## Support & Documentation

- [Prisma Docs](https://www.prisma.io/docs)
- [Express.js Guide](https://expressjs.com)
- [JWT.io](https://jwt.io)
- [OpenAI API Docs](https://platform.openai.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

**Ready for Production**
This backend follows enterprise-level standards and is ready for deployment to production environments.
