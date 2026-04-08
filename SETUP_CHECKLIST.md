# 🚀 Backend-Frontend Integration Checklist

## ✅ Completed Setup

### Phase 1: Backend CORS & Security
- ✅ CORS configured in `backend/src/config/setup.ts`
- ✅ Supports credentials, preflight requests, and custom headers
- ✅ Frontend URL environment variable `FRONTEND_URL` ready

### Phase 2: Frontend API Client
- ✅ Axios instance created with `src/api/axiosInstance.ts`
- ✅ JWT interceptor automatically attaches tokens
- ✅ Response interceptor handles 401/403/errors
- ✅ Error handler utility with user-friendly messages
- ✅ API configuration file with endpoints

### Phase 3: Environment Variables
- ✅ `.env` (development) configured with `VITE_API_BASE_URL`
- ✅ `.env.production` ready for production setup
- ✅ Backend `.env.example` with all required variables
- ✅ TypeScript path aliases updated (@api, @services)

### Phase 4: Services & Hooks
- ✅ Auth Service: `src/services/authService.ts`
  - login(), register(), logout(), refreshToken()
  - getCurrentUser(), updateProfile()
  - isAuthenticated(), getStoredUser()

- ✅ Course Service: `src/services/courseService.ts`
  - getAllCourses(), getCourseById(), getCourseWithLessons()
  - createCourse(), updateCourse(), deleteCourse()
  - enrollCourse(), getMyEnrolledCourses()
  - completeLession(), getCourseProgress()

- ✅ Terminal Service: `src/services/terminalService.ts`
  - sendTerminalCommand(), startSession(), endSession()
  - getAvailableCommands(), getCommandSuggestions()
  - executeChallenge(), addCommandToHistory()

### Utilities & Hooks
- ✅ React hooks in `src/hooks/useApi.ts`
  - useAsync(), useAuth(), useApi()
  
- ✅ Toast notification utilities in `src/utils/toast.ts`
  - showSuccessToast(), showErrorToast()
  - showInfoToast(), showWarningToast()

### Examples Components
- ✅ `LoginPageExample.tsx` - Complete login flow
- ✅ `CoursesPageExample.tsx` - Courses list with pagination
- ✅ `TerminalPageExample.tsx` - Terminal with command history

---

## 📋 Next Steps (Required)

### 1️⃣ **Install Toast Library** (Choose One)
```bash
# Option A: React Hot Toast (recommended for beginners)
npm install react-hot-toast

# Option B: Sonner (modern alternative)
npm install sonner
```

### 2️⃣ **Configure Toast in `src/utils/toast.ts`**
<details>
<summary>If using react-hot-toast:</summary>

```typescript
import toast from 'react-hot-toast';

export const showSuccessToast = (message: string) => {
  toast.success(message);
};

export const showErrorToast = (message: string) => {
  toast.error(message);
};

// ... rest of functions
```
</details>

<details>
<summary>If using Sonner:</summary>

```typescript
import { toast } from 'sonner';

export const showSuccessToast = (message: string) => {
  toast.success(message);
};

export const showErrorToast = (message: string) => {
  toast.error(message);
};

// ... rest of functions
```
</details>

### 3️⃣ **Add Toast Provider to App Root**
```typescript
// src/main.tsx or src/App.tsx
import { Toaster } from 'react-hot-toast'; // or from 'sonner'

function App() {
  return (
    <>
      <Toaster /> {/* Add this */}
      {/* Your app routes */}
    </>
  );
}
```

### 4️⃣ **Verify Environment Variables**
```bash
# Frontend
VITE_API_BASE_URL=http://localhost:5000/api

# Backend
FRONTEND_URL=http://localhost:5173
JWT_SECRET=<generate-new>
DATABASE_URL=<your-db-url>
```

### 5️⃣ **Start Development Servers**
```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend
npm install
npm run dev
```

### 6️⃣ **Test Integration**
Visit `http://localhost:5173` and:
- [ ] Open DevTools (F12)
- [ ] Go to Network tab
- [ ] Try login with test credentials
- [ ] Verify Authorization header is sent
- [ ] Check localStorage for tokens

---

## 🔧 Common Setup Issues

### CORS Error
```
Access to XMLHttpRequest from origin 'http://localhost:5173' 
has been blocked by CORS policy
```
**Fix:** Ensure `FRONTEND_URL` in backend `.env` matches exactly

### 401 Unauthorized
```
Unauthorized: Invalid token
```
**Fix:** Check if token is being sent. Verify in DevTools > Network > Headers

### API Base URL Unknown
```
GET http://undefined/api/courses 404
```
**Fix:** Ensure `VITE_API_BASE_URL` is set in `.env`

### Services Not Found
```
Cannot find module '@services'
```
**Fix:** Verify TypeScript paths in `tsconfig.json` are saved and restart VSCode

---

## 📁 File Structure Reference

```
src/
├── api/                          # API client setup
│   ├── axiosInstance.ts         # Configured axios with interceptors
│   ├── errorHandler.ts          # Error utilities & handlers
│   ├── config.ts                # API endpoints & configuration
│   └── index.ts                 # Exports
│
├── services/                     # Business logic services
│   ├── authService.ts           # Authentication operations
│   ├── courseService.ts         # Course management
│   ├── terminalService.ts       # Terminal/AI operations
│   └── index.ts                 # Exports
│
├── hooks/                        # React hooks
│   ├── useApi.ts                # useAsync, useAuth, useApi hooks
│   └── index.ts                 # Exports
│
├── utils/                        # Utilities
│   └── toast.ts                 # Toast notifications
│
└── components/
    └── examples/                # Example implementations
        ├── LoginPageExample.tsx
        ├── CoursesPageExample.tsx
        └── TerminalPageExample.tsx

.env                             # Development environment
.env.production                  # Production environment
tsconfig.json                    # TypeScript with path aliases
```

---

## 🎯 Quick Start Code Snippets

### Login User (copy-paste ready)
```typescript
import { authService, showErrorToast, showSuccessToast } from '@api';

const handleLogin = async (email: string, password: string) => {
  try {
    await authService.login({ email, password });
    showSuccessToast('Logged in!');
    navigate('/dashboard');
  } catch (error) {
    showErrorToast(error.message);
  }
};
```

### Fetch Courses (copy-paste ready)
```typescript
import { courseService, showErrorToast } from '@services';

const loadCourses = async () => {
  try {
    const result = await courseService.getAllCourses({ page: 1, limit: 10 });
    console.log(result.data); // Array of courses
  } catch (error) {
    showErrorToast(error.message);
  }
};
```

### Execute Terminal Command (copy-paste ready)
```typescript
import { terminalService, showErrorToast } from '@services';

const executeCmd = async (command: string) => {
  try {
    const result = await terminalService.sendTerminalCommand({ command });
    console.log(result.output);
  } catch (error) {
    showErrorToast(error.message);
  }
};
```

---

## 🧪 Testing Checklist

- [ ] Backend CORS allows OPTIONS requests
- [ ] Frontend can reach backward (`localhost:5000`)
- [ ] Tokens stored in localStorage after login
- [ ] Authorization header sent on subsequent requests
- [ ] 401 redirects to login
- [ ] Services return typed data correctly
- [ ] Error messages display to users
- [ ] Toast notifications work
- [ ] React hooks don't cause infinite loops

---

## 📚 Documentation Files

- [INTEGRATION_GUIDE.md](../INTEGRATION_GUIDE.md) - Comprehensive integration guide
- [src/api/axiosInstance.ts](../src/api/axiosInstance.ts) - Axios setup details
- [src/services/authService.ts](../src/services/authService.ts) - Auth API reference
- [src/services/courseService.ts](../src/services/courseService.ts) - Course API reference
- [src/services/terminalService.ts](../src/services/terminalService.ts) - Terminal API reference

---

## 🆘 Getting Help

1. **Check the INTEGRATION_GUIDE.md** for detailed examples
2. **Review the example components** for real-world usage
3. **Check console errors** in DevTools
4. **Verify environment variables** are set correctly
5. **Test with Postman** to isolate frontend vs backend issues

---

## 🎉 You're All Set!

Your backend-frontend integration is now professionally configured. You have:

✅ Secure CORS setup  
✅ Automatic JWT authentication  
✅ Global error handling  
✅ Typed API services  
✅ React hooks for easy integration  
✅ Example components to copy from  
✅ Environment-based configuration  

**Start building your application now!** 🚀
