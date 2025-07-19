# HealthAI API Documentation

## Overview

The HealthAI API provides endpoints for breast cancer detection using AI/ML models. The API is built with FastAPI and provides comprehensive functionality for user management, image analysis, and analytics.

## Base URL

```
http://localhost:8000/api/v1
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Authentication

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "password123",
  "full_name": "John Doe" // optional
}
```

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "username",
  "full_name": "John Doe",
  "is_active": true,
  "created_at": "2024-01-01T00:00:00Z"
}
```

#### POST /auth/login
Login with email and password.

**Request Body (Form Data):**
```
username: user@example.com
password: password123
```

**Response:**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "username",
    "full_name": "John Doe",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### Users

#### GET /users/me
Get current user information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "username",
  "full_name": "John Doe",
  "is_active": true,
  "created_at": "2024-01-01T00:00:00Z"
}
```

#### PUT /users/me
Update current user information.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "full_name": "John Smith"
}
```

### Predictions

#### POST /predictions/upload
Upload an image and get AI prediction.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
```
file: <image-file>
```

**Response:**
```json
{
  "id": 1,
  "prediction": "Benign",
  "confidence": 0.95,
  "processing_time": 1.23,
  "probabilities": {
    "Benign": 0.95,
    "Malignant": 0.05
  },
  "image_filename": "mammogram.jpg",
  "created_at": "2024-01-01T00:00:00Z"
}
```

#### GET /predictions/history
Get prediction history for the current user.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `skip` (optional): Number of records to skip (default: 0)
- `limit` (optional): Maximum number of records to return (default: 100)

**Response:**
```json
[
  {
    "id": 1,
    "prediction": "Benign",
    "confidence": 0.95,
    "processing_time": 1.23,
    "probabilities": {
      "Benign": 0.95,
      "Malignant": 0.05
    },
    "image_filename": "mammogram.jpg",
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

#### GET /predictions/{prediction_id}
Get a specific prediction by ID.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": 1,
  "prediction": "Benign",
  "confidence": 0.95,
  "processing_time": 1.23,
  "probabilities": {
    "Benign": 0.95,
    "Malignant": 0.05
  },
  "image_filename": "mammogram.jpg",
  "created_at": "2024-01-01T00:00:00Z"
}
```

### Analytics

#### GET /analytics/dashboard
Get dashboard analytics data.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "total_predictions": 1000,
  "total_users": 50,
  "benign_predictions": 800,
  "malignant_predictions": 200,
  "average_processing_time": 1.5,
  "recent_predictions": 25
}
```

#### GET /analytics/user-stats
Get current user's statistics.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "total_predictions": 10,
  "benign_predictions": 8,
  "malignant_predictions": 2,
  "average_confidence": 0.92
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "detail": "Invalid request data"
}
```

### 401 Unauthorized
```json
{
  "detail": "Could not validate credentials"
}
```

### 404 Not Found
```json
{
  "detail": "Resource not found"
}
```

### 422 Validation Error
```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error"
}
```

## File Upload Requirements

### Supported Formats
- JPEG (.jpg, .jpeg)
- PNG (.png)
- BMP (.bmp)
- TIFF (.tiff)

### File Size Limits
- Maximum file size: 10MB

### Image Requirements
- Images are automatically resized to 64x64 pixels for model processing
- Color images are supported (RGB)
- Images should be medical imaging data for best results

## Rate Limiting

The API implements rate limiting to ensure fair usage:
- 100 requests per minute per user for general endpoints
- 10 requests per minute per user for prediction endpoints

## Health Check

#### GET /health
Check API health status.

**Response:**
```json
{
  "status": "healthy",
  "service": "HealthAI API"
}
```