# Cybersecurity LMS Backend - Quick Start Guide (Windows PowerShell)

```powershell
# 1. Navigate to backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Create environment file
Copy-Item .env.example -Destination .env
# Update .env with your configuration (open in editor)

# 4. Create logs directory
mkdir logs -Force

# 5. Build TypeScript
npm run build

# 6. Setup database (PostgreSQL must be running)
npm run db:push
# For migrations:
npm run db:migrate

# 7. Start development server
npm run dev

# Server will start at: http://localhost:5000
```

## 📋 Environment Configuration

Before starting, create `.env` file with these essential variables:

```env
# Database (PostgreSQL)
DATABASE_URL="postgresql://lms_user:password@localhost:5432/cybersecurity_lms"

# JWT Secrets (Use strong, random values)
JWT_SECRET="your_32_character_minimum_secret_here"
JWT_REFRESH_SECRET="your_32_character_minimum_secret_here"

# OAuth2 (Get from Google Cloud Console)
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"

# OpenAI API
OPENAI_API_KEY="sk-your-api-key-here"

# Server
PORT=5000
NODE_ENV=development
API_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173
```

## 🐳 Docker Setup (Alternative)

```powershell
# Build and run with Docker
docker-compose up --build

# In another terminal, run migrations:
docker-compose exec backend npm run db:migrate
```

## 📂 File Structure Overview

```
backend/
├── src/
│   ├── controllers/       # API handlers
│   ├── services/          # Business logic
│   ├── repositories/      # Database queries
│   ├── routes/            # API endpoints
│   ├── middleware/        # Auth, errors, logging
│   ├── validators/        # Input validation
│   ├── utils/             # Helper functions
│   ├── config/            # Configuration
│   └── server.ts          # Entry point
├── prisma/
│   └── schema.prisma      # Database schema
├── package.json           # Dependencies
└── README.md              # Full documentation
```

## 🎯 Key API Endpoints

```
# Authentication
POST   /api/auth/register           # Register new user
POST   /api/auth/login              # User login
POST   /api/auth/refresh-token      # Refresh JWT
GET    /api/auth/me                 # Get current user (protected)

# Courses
GET    /api/courses                 # List courses
GET    /api/courses/:id             # Get course
POST   /api/courses                 # Create (instructor)
POST   /api/courses/:id/enroll      # Enroll

# Terminal (AI Chat)
POST   /api/terminal/chat           # Chat with AI mentor (protected)
GET    /api/terminal/sessions       # List sessions

# News
GET    /api/news                    # Latest cybersecurity news
GET    /api/news/category/:cat      # News by category

# Health
GET    /health                      # Server status
GET    /status                      # API status
```

## 🧪 Testing with cURL

```powershell
# Test health check
curl http://localhost:5000/health

# Register user
curl -X POST http://localhost:5000/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{
    "email":"user@example.com",
    "username":"johndoe",
    "password":"SecurePass123!"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{
    "email":"user@example.com",
    "password":"SecurePass123!"
  }'

# Chat with AI (replace TOKEN with actual)
curl -X POST http://localhost:5000/api/terminal/chat `
  -H "Authorization: Bearer TOKEN" `
  -H "Content-Type: application/json" `
  -d '{
    "message":"How do I scan for open ports with Nmap?"
  }'
```

## 🔍 Useful npm Commands

```bash
npm run dev              # Start dev server
npm run build            # Build TypeScript
npm start                # Run built version
npm run db:push          # Apply schema changes
npm run db:migrate       # Create migration
npm run db:studio        # Open Prisma Studio GUI
npm run lint             # Run ESLint
npm run typecheck        # TypeScript check
npm test                 # Run tests (if configured)
```

## 📖 Documentation

- **[README.md](./README.md)** - Full project guide
- **[API.md](./API.md)** - API endpoint documentation
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deployment guide
- **[prisma/schema.prisma](./prisma/schema.prisma)** - Database schema

## ⚠️ Troubleshooting

### Database connection error?
```powershell
# Make sure PostgreSQL is running
# Docker: docker run -d -e POSTGRES_PASSWORD=password -p 5432:5432 postgres:16-alpine

# Check connection
$env:DATABASE_URL = "postgresql://user:password@localhost:5432/db"
```

### Port already in use?
```powershell
# Change port in .env
PORT=5001

# Or kill process using port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### JWT secret too short?
```powershell
# Generate secure random string
[System.Convert]::ToBase64String([System.Random]::new().GetBytes(32))
```

## 🚀 Production Deployment

```powershell
# Build for production
npm run build

# Deploy with Docker
docker build -t cybersecurity-lms-api .
docker run -p 5000:5000 --env-file .env cybersecurity-lms-api

# Or use Docker Compose
docker-compose -f docker-compose.yml up -d
```

## 📞 Support

- Check logs in `logs/` directory
- Review error messages in console
- See API.md for endpoint errors
- Check ARCHITECTURE.md for design questions
- File issues on GitHub

---

**Backend Ready!** 🎉 Start developing with a production-grade API.
