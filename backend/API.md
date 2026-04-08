# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <access_token>
```

## Endpoints

### Authentication Endpoints

#### 1. Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response (201):**
```json
{
  "success": true,
  "status": 201,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "username": "johndoe",
      "role": "STUDENT"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 900
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

#### 2. Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "status": 200,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "username": "johndoe",
      "role": "STUDENT"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 900
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

#### 3. Refresh Token
```http
POST /auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (200):**
```json
{
  "success": true,
  "status": 200,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 900
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

#### 4. Get Current User
```http
GET /auth/me
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "success": true,
  "status": 200,
  "message": "User retrieved successfully",
  "data": {
    "id": "user_id",
    "email": "user@example.com",
    "username": "johndoe",
    "role": "STUDENT"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

#### 5. Logout
```http
POST /auth/logout
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

### Terminal/AI Endpoints

#### 1. Chat with Cyber Mentor
```http
POST /terminal/chat
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "message": "How do I scan for open ports using Nmap?",
  "sessionId": "optional_session_id",
  "context": {
    "course": "Ethical Hacking 101",
    "lesson": "Network Reconnaissance",
    "topic": "Port Scanning",
    "level": "INTERMEDIATE"
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "status": 200,
  "message": "Message processed successfully",
  "data": {
    "sessionId": "session_id",
    "message": "Port scanning is a fundamental technique in network reconnaissance...",
    "tokensUsed": 245,
    "messageId": "msg_id"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

#### 2. Get Terminal Session
```http
GET /terminal/sessions/:sessionId
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "success": true,
  "status": 200,
  "message": "Session retrieved successfully",
  "data": {
    "id": "session_id",
    "title": "Network Security Discussion",
    "context": {
      "course": "Ethical Hacking 101",
      "lesson": "Network Reconnaissance"
    },
    "messages": [
      {
        "id": "msg_1",
        "role": "user",
        "content": "How do I scan for open ports using Nmap?",
        "createdAt": "2024-01-15T10:30:00Z"
      },
      {
        "id": "msg_2",
        "role": "assistant",
        "content": "Port scanning is a fundamental technique...",
        "createdAt": "2024-01-15T10:30:05Z"
      }
    ],
    "startedAt": "2024-01-15T10:30:00Z"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

#### 3. List Terminal Sessions
```http
GET /terminal/sessions?page=1&limit=20
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "success": true,
  "status": 200,
  "message": "Sessions retrieved successfully",
  "data": {
    "sessions": [
      {
        "id": "session_id",
        "title": "Network Security Discussion",
        "startedAt": "2024-01-15T10:30:00Z",
        "lastMessage": "Port scanning is a fundamental technique..."
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 5,
      "pages": 1
    }
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

#### 4. Delete Terminal Session
```http
DELETE /terminal/sessions/:sessionId
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "success": true,
  "status": 200,
  "message": "Session deleted successfully",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

### Health Check Endpoints

#### 1. Health Check
```http
GET /health
```

**Response (200):**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00Z",
  "uptime": 3600.5
}
```

#### 2. API Status
```http
GET /status
```

**Response (200):**
```json
{
  "status": "operational",
  "version": "1.0.0",
  "environment": "development",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## Error Responses

### Validation Error (422)
```json
{
  "success": false,
  "status": 422,
  "message": "Password must be at least 8 characters, Must contain uppercase letter",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Unauthorized (401)
```json
{
  "success": false,
  "status": 401,
  "message": "Invalid or expired token",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Forbidden (403)
```json
{
  "success": false,
  "status": 403,
  "message": "Insufficient permissions",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Not Found (404)
```json
{
  "success": false,
  "status": 404,
  "message": "User not found",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Conflict (409)
```json
{
  "success": false,
  "status": 409,
  "message": "Email already registered",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Too Many Requests (429)
```json
{
  "success": false,
  "status": 429,
  "message": "Too many requests, please try again later",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Internal Server Error (500)
```json
{
  "success": false,
  "status": 500,
  "message": "Internal Server Error",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## Rate Limiting

- **Global API Rate Limit**: 100 requests per 15 minutes
- **Auth Endpoints Rate Limit**: 5 login attempts per 15 minutes
- **Terminal Chat Rate Limit**: 10 requests per minute

Rate limit headers in response:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1705402335
```

---

## Authentication Flow

### 1. User Registration/Login
```
User → Register/Login → Generate Access + Refresh Token
```

### 2. API Request with Token
```
User → Request with Bearer Token → Validate JWT → Return Data
```

### 3. Token Refresh
```
Expired Token → Send Refresh Token → Get New Access Token → Retry Request
```

### 4. Logout
```
User → Revoke Refresh Token → Remove from Database → Logout
```

---

## AI Terminal Safety Guidelines

The Cyber-Assistant endpoint includes automatic safety checks:

✓ Educational security topics
✓ Defensive techniques and tools
✓ Vulnerability explanation and remediation
✗ Malware or exploit code generation
✗ Illegal hacking instructions
✗ System bypassing techniques

If unsafe content is detected:
```json
{
  "success": false,
  "status": 400,
  "message": "Your message contains potentially harmful content. Please rephrase your question.",
  "timestamp": "2024-01-15T10:30:00Z"
}
```
