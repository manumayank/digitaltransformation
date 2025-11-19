# DRLTAS API Documentation

## Base URL

```
Development: http://localhost:3001/api/v1
Production: [TBD]
```

## Authentication

Most endpoints require authentication using JWT tokens.

### Headers

```
Authorization: Bearer <token>
Content-Type: application/json
```

## API Endpoints

### Authentication

#### Register User

```http
POST /auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "USER"
    }
  }
}
```

#### Login

```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

#### Refresh Token

```http
POST /auth/refresh
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Assessments

#### Get All Assessments

```http
GET /assessments
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `status` (optional): Filter by status

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "businessProfileId": "uuid",
      "status": "IN_PROGRESS",
      "digitalScore": 75.5,
      "legacyScore": 68.2,
      "overallScore": 71.8,
      "startedAt": "2024-01-01T00:00:00Z",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3
  }
}
```

#### Create Assessment

```http
POST /assessments
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "businessProfileId": "uuid"
}
```

#### Get Assessment by ID

```http
GET /assessments/:id
Authorization: Bearer <token>
```

#### Update Assessment

```http
PUT /assessments/:id
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "responses": [
    {
      "questionId": "uuid",
      "answer": "Yes"
    }
  ]
}
```

#### Submit Assessment

```http
POST /assessments/:id/submit
Authorization: Bearer <token>
```

### Modules

#### Get All Modules

```http
GET /modules
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Digital Presence & Visibility",
      "category": "DIGITAL_PRESENCE",
      "description": "Evaluates website quality, SEO, and online reviews",
      "weight": 10.0,
      "orderIndex": 1,
      "isActive": true
    }
  ]
}
```

#### Get Module Questions

```http
GET /modules/:id/questions
```

### Reports

#### Get Report

```http
GET /reports/:assessmentId
Authorization: Bearer <token>
```

#### Download PDF Report

```http
GET /reports/:assessmentId/download
Authorization: Bearer <token>
```

Returns PDF file as binary data.

### User Profile

#### Get Profile

```http
GET /users/profile
Authorization: Bearer <token>
```

#### Update Profile

```http
PUT /users/profile
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```

### Admin Endpoints

All admin endpoints require `ADMIN` or `SUPER_ADMIN` role.

#### Get All Users

```http
GET /admin/users
Authorization: Bearer <admin-token>
```

#### Get Assessment Statistics

```http
GET /admin/assessments/stats
Authorization: Bearer <admin-token>
```

## Error Responses

### Standard Error Format

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information (development only)"
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Validation Error
- `500` - Internal Server Error

### Validation Error Format

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

## Rate Limiting

- **Window**: 15 minutes
- **Max Requests**: 100 per IP

When rate limit is exceeded:
```json
{
  "success": false,
  "message": "Too many requests from this IP, please try again later."
}
```

## Pagination

Endpoints that return lists support pagination:

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

**Response Format:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

## Coming Soon

- WebSocket support for real-time updates
- Bulk operations
- Export to CSV/Excel
- Webhook integrations
- API versioning (v2)
