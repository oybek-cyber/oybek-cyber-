## 🚀 Quick Reference Card

### Import Services
```typescript
import { authService } from '@services';
import { courseService } from '@services';
import { terminalService } from '@services';
```

### Import Utilities
```typescript
import { axiosInstance } from '@api';
import { handleApiError, showErrorToast, showSuccessToast } from '@api';
```

### Import Hooks
```typescript
import { useAsync, useAuth, useApi } from '@hooks';
```

---

## 🔐 Auth Examples

### Login
```typescript
try {
  const auth = await authService.login({
    email: 'user@example.com',
    password: 'password123'
  });
  showSuccessToast('Logged in!');
} catch (error) {
  showErrorToast(error.message);
}
```

### Register
```typescript
const auth = await authService.register({
  email: 'new@example.com',
  password: 'password123',
  confirmPassword: 'password123',
  firstName: 'John',
  lastName: 'Doe'
});
```

### Logout
```typescript
await authService.logout();
showSuccessToast('Logged out');
```

### Check Auth
```typescript
if (authService.isAuthenticated()) {
  const user = authService.getStoredUser();
  console.log(user.email);
}
```

---

## 📚 Course Examples

### Get All Courses
```typescript
const result = await courseService.getAllCourses({
  page: 1,
  limit: 10,
  sortBy: 'createdAt',
  order: 'desc'
});
console.log(result.data);        // Course[]
console.log(result.pagination);  // Pagination info
```

### Get One Course
```typescript
const course = await courseService.getCourseById('course-id');
```

### Enroll
```typescript
await courseService.enrollCourse('course-id');
```

### Get My Courses
```typescript
const result = await courseService.getMyEnrolledCourses({
  page: 1,
  limit: 10
});
```

### Mark Lesson Done
```typescript
await courseService.completeLession('course-id', 'lesson-id');
```

---

## 💻 Terminal Examples

### Execute Command
```typescript
const result = await terminalService.sendTerminalCommand({
  command: 'ls -la',
  sessionId: 'optional-session-id'
});

console.log(result.output);    // Command output
console.log(result.exitCode);  // 0 = success
console.log(result.feedback);  // AI feedback
```

### Start Session
```typescript
const session = await terminalService.startSession();
sessionStorage.setItem('terminalSessionId', session.id);
```

### Get Suggestions
```typescript
const suggestions = await terminalService.getCommandSuggestions('ls');
```

---

## ⚛️ React Hook Examples

### useApi (Recommended)
```typescript
const { data, loading, error, refetch } = useApi(
  () => courseService.getAllCourses()
);

if (loading) return <div>Loading...</div>;
if (error) return <div>Error: {error}</div>;
return <div>{data?.data.length} courses</div>;
```

### useAsync
```typescript
const { status, value, error, execute } = useAsync(
  () => courseService.getAllCourses()
);

// Manual execution
<button onClick={execute}>Load Courses</button>
```

---

## 🎨 Toast Examples

### Success
```typescript
showSuccessToast('Course enrolled successfully!');
```

### Error
```typescript
showErrorToast('Failed to load courses');
```

### Info
```typescript
showInfoToast('Processing your request...');
```

### Warning
```typescript
showWarningToast('This action is irreversible');
```

---

## 🔍 Error Handling

### With try-catch
```typescript
try {
  const data = await courseService.getAllCourses();
} catch (error) {
  const message = error.message;
  showErrorToast(message);
}
```

### Format Validation Errors
```typescript
try {
  await authService.register(data);
} catch (error) {
  const errors = formatValidationErrors(error.response?.data);
  // { email: 'Email already exists', password: '...' }
}
```

---

## 🌍 Environment Variables

### Frontend `.env`
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### Access in Code
```typescript
import.meta.env.VITE_API_BASE_URL  // http://localhost:5000/api
import.meta.env.DEV                 // true in development
import.meta.env.PROD                // true in production
```

---

## 📝 Type Definitions

### Auth Types
```typescript
interface LoginCredentials {
  email: string;
  password: string;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}
```

### Course Types
```typescript
interface Course {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  lessons?: Lesson[];
  isEnrolled?: boolean;
  progress?: number;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  content?: string;
  videoUrl?: string;
}
```

### Terminal Types
```typescript
interface CommandExecutionResponse {
  success: boolean;
  output: string;
  exitCode: number;
  suggestions?: string[];
  feedback?: string;
}
```

---

## 🛠️ Path Aliases

```typescript
@api        → src/api
@services   → src/services
@components → src/components
@pages      → src/pages
@hooks      → src/hooks
@contexts   → src/contexts
@utils      → src/utils
@types      → src/types
@i18n       → src/i18n
```

---

## ⚡ Common Patterns

### API Call in Component
```typescript
export function MyComponent() {
  const { data, loading, error } = useApi(
    () => courseService.getAllCourses()
  );

  return (
    <div>
      {loading && <Spinner />}
      {error && <ErrorAlert message={error} />}
      {data && <CourseList courses={data.data} />}
    </div>
  );
}
```

### Form Submission
```typescript
async function handleSubmit(formData: RegisterData) {
  try {
    await authService.register(formData);
    showSuccessToast('Account created!');
    navigate('/dashboard');
  } catch (error) {
    showErrorToast(error.message);
  }
}
```

### Authenticated Guard
```typescript
export function ProtectedRoute({ children }) {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  return children;
}
```

---

## 📍 Files Location
- Services: `src/services/`
- API Client: `src/api/`
- Hooks: `src/hooks/`
- Utilities: `src/utils/`
- Examples: `src/components/examples/`

---

## 🔗 Full Documentation
- See [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)
- See [SETUP_CHECKLIST.md](SETUP_CHECKLIST.md)
- See [INTEGRATION_SUMMARY.md](INTEGRATION_SUMMARY.md)

---

**Print this card and keep it handy!** 📌
