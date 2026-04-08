# Backend-Frontend Integration Guide

## 📋 Overview

This guide covers the complete integration between your Node.js/Express backend and React frontend with professional API client setup, authentication, and service layers.

---

## ✅ Phase 1: Backend CORS & Security (COMPLETED)

Your backend already has CORS configured in `backend/src/config/setup.ts`:

```typescript
app.use(
  cors({
    origin: env.FRONTEND_URL,           // http://localhost:5173
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
```

### Environment Variables Required:
```env
# backend/.env
FRONTEND_URL=http://localhost:5173  # During development
FRONTEND_URL=https://yourdomain.com # In production
```

---

## 🌐 Phase 2: Frontend API Client Setup (COMPLETED)

### File Structure Created:
```
src/
├── api/
│   ├── axiosInstance.ts      # Axios configuration with interceptors
│   ├── errorHandler.ts       # Global error handling
│   ├── config.ts             # API configuration and endpoints
│   └── index.ts              # Exports
├── services/
│   ├── authService.ts        # Authentication service
│   ├── courseService.ts      # Course management service
│   ├── terminalService.ts    # Terminal/AI service
│   └── index.ts              # Exports
├── hooks/
│   ├── useApi.ts             # React hooks for API calls
│   └── index.ts              # Exports
└── utils/
    └── toast.ts              # Toast notification helpers
```

### Axios Instance Features:

✅ **Automatic JWT Injection**
```typescript
// Automatically adds: Authorization: Bearer <token>
// from localStorage.authToken
```

✅ **Response Interceptor**
```typescript
// Handles 401 Unauthorized automatically
// Redirects to login and clears localStorage
```

✅ **Error Handling**
```typescript
// Provides user-friendly error messages
// Logs errors for debugging
```

---

## 📂 Phase 3: Environment Variables (COMPLETED)

### Frontend `.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Cyber LMS
VITE_APP_VERSION=0.1.0
VITE_LOG_LEVEL=debug
```

### Backend `.env`:
```env
NODE_ENV=development
PORT=5000
API_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173

DATABASE_URL=postgresql://user:password@localhost:5432/cyber_lms
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_here
OPENAI_API_KEY=your_openai_api_key
```

---

## 🧪 Phase 4: Service Usage Examples

### 1️⃣ Auth Service

#### Login:
```typescript
import { authService, showErrorToast, showSuccessToast } from '@services';

async function handleLogin(email: string, password: string) {
  try {
    const auth = await authService.login({ email, password });
    showSuccessToast('Logged in successfully!');
    navigate('/dashboard');
  } catch (error) {
    showErrorToast(error.message);
  }
}
```

#### Register:
```typescript
async function handleRegister(userData: RegisterData) {
  try {
    const auth = await authService.register(userData);
    showSuccessToast('Account created! You are now logged in.');
    navigate('/dashboard');
  } catch (error) {
    showErrorToast(error.message);
  }
}
```

#### Check Authentication:
```typescript
// In your App.tsx or Layout component
const isAuthenticated = authService.isAuthenticated();
const user = authService.getStoredUser();

if (isAuthenticated && user) {
  // Show authenticated UI
} else {
  // Show login/signup UI
}
```

#### Logout:
```typescript
async function handleLogout() {
  await authService.logout();
  showSuccessToast('Logged out successfully');
  navigate('/login');
}
```

---

### 2️⃣ Course Service

#### Get All Courses:
```typescript
import { courseService } from '@services';

async function loadCourses() {
  try {
    const result = await courseService.getAllCourses({
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      order: 'desc'
    });

    console.log(`Total courses: ${result.pagination.total}`);
    console.log(`Courses:`, result.data);
  } catch (error) {
    showErrorToast(error.message);
  }
}
```

#### Get Course Details:
```typescript
async function loadCourseDetails(courseId: string) {
  try {
    const course = await courseService.getCourseById(courseId);
    console.log('Course:', course);
  } catch (error) {
    showErrorToast(error.message);
  }
}
```

#### Get Course with Lessons:
```typescript
async function loadCourseContent(courseId: string) {
  try {
    const course = await courseService.getCourseWithLessons(courseId);
    console.log('Lessons:', course.lessons);
  } catch (error) {
    showErrorToast(error.message);
  }
}
```

#### Enroll in Course:
```typescript
async function handleEnroll(courseId: string) {
  try {
    const enrollment = await courseService.enrollCourse(courseId);
    showSuccessToast('Successfully enrolled in course!');
    // Refresh UI
  } catch (error) {
    showErrorToast(error.message);
  }
}
```

#### Get My Courses:
```typescript
async function loadMyEnrolledCourses() {
  try {
    const result = await courseService.getMyEnrolledCourses({
      page: 1,
      limit: 20
    });

    console.log('Your courses:', result.data);
  } catch (error) {
    showErrorToast(error.message);
  }
}
```

#### Mark Lesson as Complete:
```typescript
async function completeLesson(courseId: string, lessonId: string) {
  try {
    await courseService.completeLession(courseId, lessonId);
    showSuccessToast('Lesson completed!');
  } catch (error) {
    showErrorToast(error.message);
  }
}
```

---

### 3️⃣ Terminal Service

#### Execute Command:
```typescript
import { terminalService } from '@services';

async function executeCommand(command: string) {
  try {
    const result = await terminalService.sendTerminalCommand({
      command: command,
      context: { userId: currentUser.id }
    });

    console.log('Output:', result.output);
    console.log('Exit code:', result.exitCode);
    if (result.feedback) {
      showInfoToast(result.feedback);
    }
  } catch (error) {
    showErrorToast(error.message);
  }
}
```

#### Start Terminal Session:
```typescript
async function startTerminal() {
  try {
    const session = await terminalService.startSession();
    sessionStorage.setItem('terminalSessionId', session.id);
    console.log('Session started:', session.id);
  } catch (error) {
    showErrorToast(error.message);
  }
}
```

#### Get Command Suggestions:
```typescript
async function getCommandSuggestions(partial: string) {
  try {
    const suggestions = await terminalService.getCommandSuggestions(partial);
    console.log('Suggestions:', suggestions);
  } catch (error) {
    // Silently fail - don't show error for suggestions
    console.error(error);
  }
}
```

---

## 🔐 Authentication Flow

### 1. Login/Register
```
User submits credentials
↓
authService.login()
↓
Backend validates & returns token + user
↓
Tokens stored in localStorage
↓
User redirected to dashboard
```

### 2. Subsequent Requests
```
Any API call
↓
Request Interceptor adds Authorization header
↓
Backend validates JWT
↓
Response returned
```

### 3. Token Expiration
```
API returns 401 Unauthorized
↓
Response Interceptor clears tokens
↓
User redirected to login
↓
localStorage cleared
```

---

## 🧩 Using React Hooks with Services

### Custom Hooks (in `src/hooks/useApi.ts`):

#### useAsync - Generic async state hook:
```typescript
import { useAsync } from '@hooks';
import { courseService } from '@services';

function CoursesPage() {
  const { status, value: courses, error, execute } = useAsync(
    () => courseService.getAllCourses({ page: 1, limit: 10 })
  );

  if (status === 'pending') return <div>Loading...</div>;
  if (status === 'error') return <div>Error: {error}</div>;
  
  return (
    <div>
      {value?.data.map(course => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
```

#### useApi - Specialized API hook:
```typescript
import { useApi } from '@hooks';
import { courseService } from '@services';

function MyCoursesPage() {
  const { data: enrolledCourses, loading, error, refetch } = useApi(
    () => courseService.getMyEnrolledCourses({ page: 1 })
  );

  return (
    <div>
      {loading && <Spinner />}
      {error && <ErrorAlert message={error} />}
      {enrolledCourses?.data.map(course => (
        <CourseCard key={course.id} course={course} />
      ))}
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
```

---

## 📝 Best Practices

### ✅ DO:

1. **Always use services for API calls**
   ```typescript
   ✓ await authService.login(credentials)
   ```

2. **Handle errors with try-catch**
   ```typescript
   try {
     const data = await courseService.getAllCourses();
   } catch (error) {
     showErrorToast(error.message);
   }
   ```

3. **Use environment variables**
   ```typescript
   ✓ import.meta.env.VITE_API_BASE_URL
   ```

4. **Store auth tokens securely**
   ```typescript
   localStorage.setItem('authToken', token);
   ```

5. **Show user feedback**
   ```typescript
   showSuccessToast('Operation completed!');
   showErrorToast(error.message);
   ```

### ❌ DON'T:

1. **Don't make direct axios calls**
   ```typescript
   ✗ axios.get('/api/courses')
   ```

2. **Don't ignore error handling**
   ```typescript
   ✗ await someApiCall() // without try-catch
   ```

3. **Don't hardcode API URLs**
   ```typescript
   ✗ const url = 'http://localhost:5000/api'
   ```

4. **Don't store passwords**
   ```typescript
   ✗ localStorage.setItem('password', password)
   ```

---

## 🚀 Deployment Checklist

### Frontend:
- [ ] Update `VITE_API_BASE_URL` in `.env.production`
- [ ] Ensure CORS backend URL matches frontend deployment
- [ ] Build: `npm run build`
- [ ] Test production build locally: `npm run preview`

### Backend:
- [ ] Set `NODE_ENV=production`
- [ ] Update `FRONTEND_URL` to your frontend domain
- [ ] Update `API_URL` to your backend domain
- [ ] Generate new JWT secrets
- [ ] Set secure database URL
- [ ] Enable HTTPS

---

## 🐛 Troubleshooting

### CORS Errors:
```
Error: Access to XMLHttpRequest blocked by CORS policy
```
**Solution:** Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL

### 401 Unauthorized:
```
Error: Unauthorized
```
**Solution:** Check if token is being sent. Verify in DevTools > Network > Headers

### Token Not Persisting:
```
User logged in but redirected to login after refresh
```
**Solution:** Check `localStorage` in DevTools. Verify authService stores token correctly.

### API Base URL Issues:
```
Error: Cannot POST http://undefined/api/auth/login
```
**Solution:** Verify `VITE_API_BASE_URL` is set in `.env`

---

## 📚 File References

- **Axios Instance:** [src/api/axiosInstance.ts](src/api/axiosInstance.ts)
- **Error Handler:** [src/api/errorHandler.ts](src/api/errorHandler.ts)
- **Auth Service:** [src/services/authService.ts](src/services/authService.ts)
- **Course Service:** [src/services/courseService.ts](src/services/courseService.ts)
- **Terminal Service:** [src/services/terminalService.ts](src/services/terminalService.ts)
- **API Hooks:** [src/hooks/useApi.ts](src/hooks/useApi.ts)

---

## 🆘 Next Steps

1. **Install Toast Library:**
   ```bash
   npm install react-hot-toast
   # or
   npm install sonner
   ```

2. **Update Toast Imports:** Modify `src/utils/toast.ts` with your chosen library

3. **Setup AuthContext:** Use `src/contexts/AuthContext.tsx` to manage global auth state

4. **Test Integration:**
   ```bash
   # Terminal 1: Start backend
   cd backend && npm run dev

   # Terminal 2: Start frontend
   npm run dev

   # Backend: http://localhost:5000
   # Frontend: http://localhost:5173
   ```

5. **Create Login Page:** Use `authService` to implement login functionality

---

**You're all set! Your professional backend-frontend integration is ready to use.** 🎉
