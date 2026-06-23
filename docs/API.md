# PrismGrid API Reference

**Base URL:** `https://api.yourdomain.com/api` (Production) | `http://localhost:5000/api` (Development)

**Authentication:** HTTP-Only Cookies + JWT Bearer Tokens

---

## Authentication Endpoints

### 1. Send OTP Verification Code

Initiates the registration flow by sending a 6-digit OTP to the user's email.

```
POST /api/auth/send-otp
```

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | User's full name |
| `email` | string | Yes | User's email address |
| `password` | string | Yes | Password (8+ chars, uppercase, lowercase, number, special char) |

**Request Example:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "message": "Verification code sent to your email."
}
```

**Error Responses:**
| Code | Message | Cause |
|------|---------|-------|
| 400 | "All fields are required." | Missing name, email, or password |
| 400 | "An account with this email already exists." | Email registered |
| 400 | "Password is too weak..." | Password doesn't meet requirements |
| 500 | "Internal Server Error" | Server error |

---

### 2. Verify OTP and Register

Verifies the OTP code and completes user registration.

```
POST /api/auth/verify-otp
```

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | Yes | User's email address |
| `otp` | string | Yes | 6-digit OTP received via email |

**Request Example:**
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Registration successful. Please login.",
  "user": {
    "_id": "60d5ec49c1234567890abcde",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "member"
  }
}
```

**Error Responses:**
| Code | Message | Cause |
|------|---------|-------|
| 400 | "Email and verification code are required." | Missing email or OTP |
| 400 | "Verification code has expired." | OTP not found or expired |
| 400 | "Invalid verification code." | Wrong OTP |
| 500 | "Internal Server Error" | Server error |

**Headers (Set-Cookie):**
```
Set-Cookie: token=eyJhbGciOiJIUzI1NiIs...; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=2592000
```

---

### 3. Login

Authenticates user with email and password, returns JWT token via HTTP-Only cookie.

```
POST /api/auth/login
```

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | Yes | Registered email address |
| `password` | string | Yes | Account password |

**Request Example:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "_id": "60d5ec49c1234567890abcde",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "member"
  }
}
```

**Error Responses:**
| Code | Message | Cause |
|------|---------|-------|
| 400 | "Email and password are required." | Missing email or password |
| 401 | "Invalid email or password." | Wrong credentials |
| 500 | "Internal Server Error" | Server error |

**Headers (Set-Cookie):**
```
Set-Cookie: token=eyJhbGciOiJIUzI1NiIs...; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=2592000
```

---

### 4. Get Current User Session

Validates JWT token from HTTP-Only cookie and returns current user data.

```
GET /api/auth/me
```

**Headers:**
```
Cookie: token=eyJhbGciOiJIUzI1NiIs...
```

**Response (200 OK):**
```json
{
  "user": {
    "_id": "60d5ec49c1234567890abcde",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "manager",
    "teams": [],
    "createdAt": "2026-06-23T10:30:00Z"
  }
}
```

**Error Responses:**
| Code | Message | Cause |
|------|---------|-------|
| 401 | "Unauthorized" | No valid token in cookie |
| 500 | "Internal Server Error" | Server error |

---

### 5. Logout

Clears JWT token from HTTP-Only cookie.

```
POST /api/auth/logout
```

**Headers:**
```
Cookie: token=eyJhbGciOiJIUzI1NiIs...
```

**Response (200 OK):**
```json
{
  "message": "User Logged Out."
}
```

**Headers (Clear-Cookie):**
```
Set-Cookie: token=; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=0
```

---

## Project Endpoints

### 1. Get All Projects

Retrieves all projects for the authenticated user (as creator or team member).

```
GET /api/projects
```

**Headers:**
```
Cookie: token=eyJhbGciOiJIUzI1NiIs...
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Pagination page number |
| `limit` | number | 10 | Results per page |
| `status` | string | — | Filter by status (active, completed, archived) |

**Response (200 OK):**
```json
{
  "success": true,
  "projects": [
    {
      "_id": "60d5ec49c1234567890abcde",
      "name": "Website Redesign",
      "description": "Complete redesign of company website",
      "createdBy": "60d5ec49c1234567890abcdf",
      "teamMembers": ["60d5ec49c1234567890abe01", "60d5ec49c1234567890abe02"],
      "status": "active",
      "createdAt": "2026-06-23T10:30:00Z",
      "updatedAt": "2026-06-23T10:30:00Z"
    }
  ],
  "totalProjects": 5,
  "currentPage": 1
}
```

**Error Responses:**
| Code | Message | Cause |
|------|---------|-------|
| 401 | "Unauthorized" | No valid token |
| 500 | "Internal Server Error" | Server error |

---

### 2. Create Project

Creates a new project for the authenticated user.

```
POST /api/projects
```

**Headers:**
```
Cookie: token=eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json
```

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Project name (max 100 chars) |
| `description` | string | No | Project description |
| `teamMembers` | array | No | Array of user IDs to invite |

**Request Example:**
```json
{
  "name": "Mobile App Development",
  "description": "Build iOS and Android apps for the platform",
  "teamMembers": ["60d5ec49c1234567890abe01"]
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "project": {
    "_id": "60d5ec49c1234567890abcde",
    "name": "Mobile App Development",
    "description": "Build iOS and Android apps for the platform",
    "createdBy": "60d5ec49c1234567890abcdf",
    "teamMembers": ["60d5ec49c1234567890abe01"],
    "status": "active",
    "createdAt": "2026-06-23T10:30:00Z"
  }
}
```

**Error Responses:**
| Code | Message | Cause |
|------|---------|-------|
| 400 | "Project name is required." | Missing name |
| 401 | "Unauthorized" | No valid token |
| 500 | "Internal Server Error" | Server error |

---

### 3. Get Project by ID

Retrieves a single project by ID.

```
GET /api/projects/:projectID
```

**Headers:**
```
Cookie: token=eyJhbGciOiJIUzI1NiIs...
```

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `projectID` | string | MongoDB project ID |

**Response (200 OK):**
```json
{
  "success": true,
  "project": {
    "_id": "60d5ec49c1234567890abcde",
    "name": "Website Redesign",
    "description": "Complete redesign of company website",
    "createdBy": "60d5ec49c1234567890abcdf",
    "teamMembers": ["60d5ec49c1234567890abe01"],
    "tasks": ["60d5ec49c1234567890abe10", "60d5ec49c1234567890abe11"],
    "status": "active",
    "createdAt": "2026-06-23T10:30:00Z"
  }
}
```

**Error Responses:**
| Code | Message | Cause |
|------|---------|-------|
| 401 | "Unauthorized" | No valid token |
| 404 | "Project not found" | Invalid project ID |
| 500 | "Internal Server Error" | Server error |

---

### 4. Update Project

Updates project details (name, description, team members).

```
PUT /api/projects/:projectID
```

**Headers:**
```
Cookie: token=eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json
```

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | No | Updated project name |
| `description` | string | No | Updated description |
| `teamMembers` | array | No | Updated team member IDs |

**Request Example:**
```json
{
  "name": "Website Redesign - Phase 2",
  "description": "Second phase of redesign focusing on mobile",
  "teamMembers": ["60d5ec49c1234567890abe01", "60d5ec49c1234567890abe02"]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Project updated successfully",
  "project": {
    "_id": "60d5ec49c1234567890abcde",
    "name": "Website Redesign - Phase 2",
    "description": "Second phase of redesign focusing on mobile",
    "teamMembers": ["60d5ec49c1234567890abe01", "60d5ec49c1234567890abe02"],
    "updatedAt": "2026-06-23T11:45:00Z"
  }
}
```

**Error Responses:**
| Code | Message | Cause |
|------|---------|-------|
| 401 | "Unauthorized" | No valid token |
| 404 | "Project not found" | Invalid project ID |
| 500 | "Internal Server Error" | Server error |

---

### 5. Delete Project

Deletes a project and all associated tasks.

```
DELETE /api/projects/:projectID
```

**Headers:**
```
Cookie: token=eyJhbGciOiJIUzI1NiIs...
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Project deleted successfully"
}
```

**Error Responses:**
| Code | Message | Cause |
|------|---------|-------|
| 401 | "Unauthorized" | No valid token |
| 404 | "Project not found" | Invalid project ID |
| 500 | "Internal Server Error" | Server error |

---

## Task Endpoints

### 1. Create Task

Creates a new task within a project.

```
POST /api/tasks
```

**Headers:**
```
Cookie: token=eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json
```

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Task title (max 150 chars) |
| `description` | string | No | Task description |
| `projectID` | string | Yes | Parent project ID |
| `assignedTo` | string | No | User ID to assign task to |
| `priority` | string | No | Priority level (low, medium, high) |
| `dueDate` | string (ISO 8601) | No | Task due date |

**Request Example:**
```json
{
  "title": "Design landing page mockups",
  "description": "Create 3 mockup variations for A/B testing",
  "projectID": "60d5ec49c1234567890abcde",
  "assignedTo": "60d5ec49c1234567890abe01",
  "priority": "high",
  "dueDate": "2026-07-15T23:59:59Z"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "task": {
    "_id": "60d5ec49c1234567890abe20",
    "title": "Design landing page mockups",
    "description": "Create 3 mockup variations for A/B testing",
    "projectID": "60d5ec49c1234567890abcde",
    "assignedTo": "60d5ec49c1234567890abe01",
    "status": "not-started",
    "priority": "high",
    "dueDate": "2026-07-15T23:59:59Z",
    "createdAt": "2026-06-23T10:30:00Z"
  }
}
```

**Error Responses:**
| Code | Message | Cause |
|------|---------|-------|
| 400 | "Title is required." | Missing title |
| 401 | "Unauthorized" | No valid token |
| 404 | "Project not found" | Invalid project ID |
| 500 | "Internal Server Error" | Server error |

---

### 2. Get Tasks by Project

Retrieves all tasks for a specific project.

```
GET /api/tasks/project/:projectID
```

**Headers:**
```
Cookie: token=eyJhbGciOiJIUzI1NiIs...
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `status` | string | — | Filter by status (not-started, in-progress, completed) |
| `sortBy` | string | createdAt | Sort field (priority, dueDate, createdAt) |
| `order` | string | desc | Sort order (asc, desc) |

**Response (200 OK):**
```json
{
  "success": true,
  "tasks": [
    {
      "_id": "60d5ec49c1234567890abe20",
      "title": "Design landing page mockups",
      "status": "in-progress",
      "priority": "high",
      "assignedTo": "60d5ec49c1234567890abe01",
      "dueDate": "2026-07-15T23:59:59Z",
      "createdAt": "2026-06-23T10:30:00Z"
    }
  ],
  "totalTasks": 12
}
```

**Error Responses:**
| Code | Message | Cause |
|------|---------|-------|
| 401 | "Unauthorized" | No valid token |
| 404 | "Project not found" | Invalid project ID |
| 500 | "Internal Server Error" | Server error |

---

### 3. Update Task

Updates task details including status, assignee, and due date.

```
PUT /api/tasks/:taskID
```

**Headers:**
```
Cookie: token=eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json
```

**Request Body:**
| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Updated task title |
| `description` | string | Updated description |
| `status` | string | New status (not-started, in-progress, completed) |
| `assignedTo` | string | Reassign to different user |
| `priority` | string | Updated priority level |
| `dueDate` | string (ISO 8601) | Updated due date |

**Request Example:**
```json
{
  "status": "completed",
  "assignedTo": "60d5ec49c1234567890abe02"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Task updated successfully",
  "task": {
    "_id": "60d5ec49c1234567890abe20",
    "title": "Design landing page mockups",
    "status": "completed",
    "assignedTo": "60d5ec49c1234567890abe02",
    "updatedAt": "2026-06-23T11:45:00Z"
  }
}
```

**Error Responses:**
| Code | Message | Cause |
|------|---------|-------|
| 401 | "Unauthorized" | No valid token |
| 404 | "Task not found" | Invalid task ID |
| 500 | "Internal Server Error" | Server error |

---

### 4. Delete Task

Deletes a specific task.

```
DELETE /api/tasks/:taskID
```

**Headers:**
```
Cookie: token=eyJhbGciOiJIUzI1NiIs...
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

**Error Responses:**
| Code | Message | Cause |
|------|---------|-------|
| 401 | "Unauthorized" | No valid token |
| 404 | "Task not found" | Invalid task ID |
| 500 | "Internal Server Error" | Server error |

---

## User Endpoints

### 1. Get User Profile

Retrieves the authenticated user's full profile.

```
GET /api/user/profile
```

**Headers:**
```
Cookie: token=eyJhbGciOiJIUzI1NiIs...
```

**Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "_id": "60d5ec49c1234567890abcdf",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "manager",
    "teams": ["60d5ec49c1234567890abe01"],
    "avatar": "https://...",
    "createdAt": "2026-06-23T10:30:00Z"
  }
}
```

---

### 2. Update User Profile

Updates user details (name, avatar, preferences).

```
PUT /api/user/profile
```

**Headers:**
```
Cookie: token=eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json
```

**Request Body:**
| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Updated name |
| `avatar` | string | Avatar URL |
| `preferences` | object | User preferences |

---

## Statistics Endpoint

### Get Platform Statistics

Returns real-time platform metrics for dashboard display.

```
GET /api/stats
```

**Response (200 OK):**
```json
{
  "success": true,
  "stats": [
    { "number": 127, "suffix": "+", "label": "Projects Managed" },
    { "number": 892, "suffix": "+", "label": "Tasks Completed" },
    { "number": 34, "suffix": "+", "label": "Teams Active" },
    { "number": 99, "suffix": "%", "label": "Uptime Record" }
  ]
}
```

---

## Error Handling

All endpoints follow a consistent error response format:

```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE"
}
```

### Common HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid request format |
| 401 | Unauthorized - Invalid or missing authentication |
| 403 | Forbidden - Authenticated but not authorized |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 500 | Internal Server Error - Server error |

---

## Rate Limiting

API endpoints are rate-limited to prevent abuse:

- **Authentication endpoints**: 5 requests per minute per IP
- **Standard endpoints**: 100 requests per minute per user
- **Admin endpoints**: 1000 requests per hour per admin

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1624000000
```

---

## Authentication Best Practices

1. **Always include `withCredentials: true`** in frontend API calls to include HTTP-Only cookies
2. **Never store JWT tokens in localStorage** — they must be in HTTP-Only cookies
3. **Include `sameSite: 'none'`** and `secure: true`** flags for cross-domain cookie handling
4. **Validate token expiration** — refresh or re-authenticate when token expires
5. **Use HTTPS in production** — never send credentials over HTTP

---

**Last Updated:** June 23, 2026 | **API Version:** 1.0.0
