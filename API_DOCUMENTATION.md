# API Documentation

## Authentication (`/api/auth`)

### Login

- **POST** `/api/auth/login`
- **Body**: `{ "email": "string", "password": "string" }`
- **Rate Limit**: 5 requests / 15 mins
- **Returns**: JWT token via HttpOnly cookie (if configured) or response body.

### Register

- **POST** `/api/auth/register`
- **Body**: `{ "name": "string", "email": "string", "password": "string", "confirmPassword": "string" }`
- **Rate Limit**: 5 requests / 15 mins

### Get Current User

- **GET** `/api/auth/me`
- **Headers**: Authorization: Bearer <token>
- **Returns**: User profile and role.

---

## Projects (`/api/projects`)

### List Projects

- **GET** `/api/projects`
- **Query Params**:
  - `page`: number (default 1)
  - `limit`: number (default 10)
  - `search`: string (filter by name)
  - `status`: ACTIVE | COMPLETED | ARCHIVED
- **Returns**: Paginated list of projects.

### Create Project (Admin Only)

- **POST** `/api/projects`
- **Body**: `{ "name": "string", "description": "string", "billingRate": number }`

### Project Details & Updates

- **GET** `/api/projects/[id]`
- **PUT** `/api/projects/[id]`
- **DELETE** `/api/projects/[id]` (Archive/Delete)

### Billing Summary (Admin Only)

- **GET** `/api/projects/[id]/billing-summary`
- **Returns**: `{ "totalHours": number, "totalCost": number, "billingRate": number }`

---

## Time Logs (`/api/time-logs`)

### List Time Logs

- **GET** `/api/time-logs`
- **Query Params**:
  - `projectId`: string
  - `page`: number
  - `limit`: number
- **Access**:
  - **Admin**: Can view all logs.
  - **Employee**: Can view only their own logs.

### Create Time Log

- **POST** `/api/time-logs`
- **Body**:
  ```json
  {
    "projectId": "uuid",
    "hours": 2.5,
    "notes": "Feature implementation",
    "logDate": "2024-03-20",
    "status": "TODO" // optional
  }
  ```
- **Validation**:
  - Max 12 hours/day total per user.
  - Hours must be positive.

### Update Time Log

- **PATCH** `/api/time-logs/[id]`
- **Body**: Partial TimeLog object (e.g. `{ "status": "DONE" }`)

### Delete Time Log

- **DELETE** `/api/time-logs/[id]`

---

## Security Implementation

### Rate Limiting

- **Authentication**: Strict (5 req / 15 min).
- **Write Operations (POST/PUT/DELETE)**: Moderate (30 req / min).
- **Read Operations (GET)**: High capacity (300 req / min).

### Headers

Responses include standard security headers:

- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
