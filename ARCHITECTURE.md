# 📊 Architecture & Integration Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                           │
│                    http://localhost:5173                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  COMPONENTS          HOOKS           SERVICES                  │
│  ─────────────────────────────────────────────────────────────  │
│  LoginPageExample → useApi() → authService.login()             │
│  CoursesPageExample → useApi() → courseService.getAllCourses() │
│  TerminalPageExample → useApi() → terminalService.execute()    │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │            API CLIENT LAYER (Axios)                        │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │ Request Interceptor:                                 │  │ │
│  │  │ • Add JWT token from localStorage                    │  │ │
│  │  │ • Add Content-Type header                           │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │ Response Interceptor:                                │  │ │
│  │  │ • Handle 401 → Logout & redirect to /login          │  │ │
│  │  │ • Handle 4xx/5xx errors → Show user messages        │  │ │
│  │  │ • Log errors for debugging                          │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  │                                                              │ │
│  │  Endpoint: http://localhost:5000/api                       │ │
│  │  Timeout: 30 seconds                                       │ │
│  │  Headers: Content-Type: application/json                  │ │
│  │           Authorization: Bearer <token>                   │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │            ERROR HANDLING LAYER                           │ │
│  │  • User-friendly error messages                          │ │
│  │  • HTTP status code handling                             │ │
│  │  • Validation error formatting                           │ │
│  │  • Error logging for production monitoring              │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  LOCAL STORAGE:                                                │
│  • authToken (JWT)                                            │
│  • refreshToken (JWT)                                         │
│  • user (User object)                                         │
│  • terminalSessionId (string)                                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                        HTTP/HTTPS
                  (With Authorization Header)
                              │
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND (Express)                          │
│                    http://localhost:5000                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  CORS MIDDLEWARE:                                              │
│  ✓ Allows: http://localhost:5173                              │
│  ✓ Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS            │
│  ✓ Headers: Content-Type, Authorization                       │
│  ✓ Credentials: true                                          │
│                                                                  │
│  ROUTES:                                                       │
│  ├── /api/auth/                                              │
│  │   ├── POST /login                                        │
│  │   ├── POST /register                                     │
│  │   ├── POST /logout                                       │
│  │   ├── POST /refresh                                      │
│  │   └── GET /me (protected)                               │
│  ├── /api/courses/                                          │
│  │   ├── GET / (list all)                                   │
│  │   ├── GET /:id (single course)                           │
│  │   ├── POST / (create)                                    │
│  │   ├── PUT /:id (update)                                  │
│  │   ├── DELETE /:id                                        │
│  │   ├── POST /:id/enroll                                   │
│  │   └── GET /my-courses (protected)                        │
│  ├── /api/terminal/                                         │
│  │   ├── POST /execute                                      │
│  │   ├── POST /session/start                                │
│  │   ├── GET /commands                                      │
│  │   └── POST /feedback                                     │
│  └── /api/health/                                           │
│      └── GET / (no auth required)                           │
│                                                                  │
│  MIDDLEWARE STACK:                                            │
│  1. Helmet (security headers)                                │
│  2. CORS                                                      │
│  3. Express JSON parser                                       │
│  4. Request logger                                            │
│  5. Rate limiter                                              │
│  6. Route handlers                                            │
│  7. Error handler                                             │
│                                                                  │
│  AUTHENTICATION:                                              │
│  • JWT (JSON Web Tokens)                                      │
│  • Tokens in localStorage (frontend)                          │
│  • Tokens validated in Authorization header (backend)         │
│  • 15-minute token expiry + 7-day refresh tokens            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────▼─────────────────────────────────┐
│                      DATABASE                                 │
│                   PostgreSQL via Prisma                       │
├─────────────────────────────────────────────────────────────────┤
│  ├── users                                                    │
│  ├── courses                                                  │
│  ├── lessons                                                  │
│  ├── enrollments                                              │
│  ├── terminal_sessions                                        │
│  ├── command_history                                          │
│  └── news                                                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Examples

### 1. User Login Flow

```
User submits email/password
        ↓
Component calls: authService.login(credentials)
        ↓
Request Interceptor adds headers
        ↓
POST /api/auth/login → Backend
        ↓
Backend validates & returns { token, refreshToken, user }
        ↓
authService stores in localStorage
        ↓
Component shows success toast
        ↓
User redirected to /dashboard
        ↓
Future requests include Authorization header automatically
```

### 2. Protected Route Access

```
User visits /courses
        ↓
useApi() hook calls: courseService.getAllCourses()
        ↓
Request Interceptor adds:
  • Authorization: Bearer <token from localStorage>
  • Content-Type: application/json
        ↓
GET /api/courses → Backend
        ↓
Backend middleware validates JWT
        ↓
If valid: Return courses
If invalid (401): Response Interceptor triggers logout
        ↓
Component displays data or error
```

### 3. Token Expiration Handling

```
User makes API request with expired token
        ↓
Backend returns 401 Unauthorized
        ↓
Response Interceptor catches 401
        ↓
Clear localStorage (tokens, user)
        ↓
Redirect to /login
        ↓
User must log in again
```

---

## File Dependency Map

```
src/components/examples/
├── LoginPageExample.tsx
│   └── imports: authService, handleApiError, showErrorToast
│
├── CoursesPageExample.tsx
│   └── imports: courseService, useApi, showErrorToast
│
└── TerminalPageExample.tsx
    └── imports: terminalService, showErrorToast, showInfoToast


src/services/
├── authService.ts
│   └── imports: axiosInstance, handleApiError, logError
│
├── courseService.ts
│   └── imports: axiosInstance, handleApiError, logError
│
└── terminalService.ts
    └── imports: axiosInstance, handleApiError, logError


src/api/
├── axiosInstance.ts
│   └── base config for all API calls
│
├── errorHandler.ts
│   └── utility functions for error handling
│
└── config.ts
    └── environment variables and endpoints


src/hooks/
└── useApi.ts
    └── imports: useState, useCallback, useAsync


src/utils/
└── toast.ts
    └── notification utilities (integrates with react-hot-toast)
```

---

## Environment Setup Flowchart

```
┌──────────────────────────┐
│   Project Root           │
├──────────────────────────┤
│ .env (FRONTEND)          │
│ ├─ VITE_API_BASE_URL     │
│ └─ = http://localhost... │
└──────┬───────────────────┘
       ↓
┌──────────────────────────┐
│ Build Time               │
├──────────────────────────┤
│ import.meta.env resolved │
│ vite plugins process it  │
└──────┬───────────────────┘
       ↓
┌──────────────────────────┐
│ Runtime (Browser)        │
├──────────────────────────┤
│ axiosInstance created    │
│ with baseURL from env    │
│ all requests use it      │
└──────────────────────────┘

┌──────────────────────────┐
│ backend/.env (BACKEND)   │
├──────────────────────────┤
│ FRONTEND_URL             │
│ DATABASE_URL             │
│ JWT_SECRET               │
│ PORT                     │
└──────┬───────────────────┘
       ↓
┌──────────────────────────┐
│ Server Startup           │
├──────────────────────────┤
│ CORS configured with     │
│ FRONTEND_URL             │
│ JWT secrets loaded       │
│ DB connection tested     │
└──────────────────────────┘
```

---

## Integration Checklist

```
SETUP PHASE
─────────────────────────────────────────────
☑ Frontend .env created with VITE_API_BASE_URL
☑ Backend .env configured with FRONTEND_URL
☑ axios instance created with interceptors
☑ Error handler utility implemented
☑ Services created (auth, course, terminal)
☑ React hooks created for API integration
☑ Toast utility prepared
☑ TypeScript paths updated
☑ Example components created

CONFIGURATION PHASE
─────────────────────────────────────────────
⊡ Toast library installed (react-hot-toast or sonner)
⊡ Toast utility updated with library import
⊡ Toast provider added to App root
⊡ Backend CORS verified with FRONTEND_URL
⊡ JWT secrets generated for backend
⊡ Database connection verified

TESTING PHASE
─────────────────────────────────────────────
⊡ Backend server started (npm run dev)
⊡ Frontend dev server started (npm run dev)
⊡ Login works and stores tokens
⊡ Authorization header sent on requests
⊡ 401 redirects to login
⊡ Toast notifications appear
⊡ Courses load successfully
⊡ Terminal commands execute
⊡ Error handling shows proper messages

DEPLOYMENT PHASE
─────────────────────────────────────────────
⊡ Backend: npm run build
⊡ Frontend: npm run build & npm run preview
⊡ Update .env.production with prod URLs
⊡ Update backend .env with prod settings
⊡ Test production build locally
⊡ Deploy backend to hosting
⊡ Deploy frontend to CDN/hosting
⊡ Verify all services working on production
⊡ Monitor error logs on production
```

---

## Key Concepts

### JWT Authentication Flow
1. User logs in with credentials
2. Backend validates and returns JWT (token)
3. Frontend stores token in localStorage
4. Front requests intercepted to add: `Authorization: Bearer <token>`
5. Backend validates token before processing request
6. If token expired, user gets redirected to login

### Error Handling Strategy
1. Backend sends error with status code and message
2. Axios response interceptor catches error
3. Global error handler translates HTTP errors to user messages
4. Toast notification displays user-friendly message
5. If 401, user auto-logged out and redirected

### State Management
- **Local Auth:** authService stores tokens in localStorage
- **Component State:** useApi hook manages loading/error/data
- **Global State:** (Optional) Can add Context API / Redux later

---

## Performance Considerations

✅ **Request Deduplication:** Multiple requests for same data should be canceled  
✅ **Response Caching:** Consider caching course data  
✅ **Pagination:** Courses are paginated (10 per page default)  
✅ **Error Retry:** Failed requests can be retried  
✅ **Loading States:** Show spinner while fetching  
✅ **Code Splitting:** Lazy load example components  

---

## Security Best Practices

✅ **HTTPS in Production:** All requests over HTTPS  
✅ **Token Expiry:** Tokens expire (15 min) and need refresh  
✅ **No Password Storage:** Never store passwords locally  
✅ **CORS Validation:** Only allow your domain  
✅ **Error Messages:** Don't expose sensitive info  
✅ **Rate Limiting:** Backend implements limits  

---

**This integration provides a solid foundation for your full-stack application!** 🎉
