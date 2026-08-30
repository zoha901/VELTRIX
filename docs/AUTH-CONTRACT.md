# VELTRIX — Authentication & Authorization Contract

## 1. Purpose

This document defines the official authentication and authorization contract for the VELTRIX rehabilitation management platform. It specifies identity management requirements, token strategy, role-based permissions, protected endpoints, and failure handling formats for frontend-backend integration.

---

## 2. User Roles Definition

VELTRIX supports two primary user roles using the exact canonical role values:
- **`PATIENT`**: Individuals receiving rehabilitation care and performing assigned exercise programs.
- **`THERAPIST`**: Clinical professionals managing exercises, assigning programs, and monitoring patient rehabilitation progress.

Canonical role values are uppercase string identifiers: `PATIENT` and `THERAPIST`.

---

## 3. Registration Strategy & Requirements

Registration allows new users (Patients or Therapists) to establish an account in VELTRIX.

### Requirements:
- **Input Parameters**: `name` (string, required), `email` (string, required, unique), `password` (string, required, min 8 characters), `role` (string, required: `"PATIENT"` or `"THERAPIST"`).
- **Validation Rules**:
  - `email` must follow standard RFC 5322 formatting.
  - `email` uniqueness is enforced at the database layer (case-insensitive indexing).
  - `password` must meet minimum strength requirements (at least 8 characters). No additional mandatory character-class requirements (uppercase, numbers, special characters) are enforced.
  - `role` must strictly match allowed enum values (`"PATIENT"` or `"THERAPIST"`).
- **Behavior**:
  - The backend verifies email uniqueness. If the email is already registered, a `409 Conflict` response is returned.
  - Upon successful validation, the password is hashed before database storage.
  - Sensitive fields (especially `password`) are excluded from all response payloads.

---

## 4. Login Strategy & Requirements

Login validates user credentials and issues an authentication token upon success.

### Requirements:
- **Input Parameters**: `email` (string, required), `password` (string, required).
- **Validation & Credentials Verification**:
  - The backend searches for the user document by `email`.
  - The provided plain-text password is compared against the stored hash using `bcrypt`.
  - If either the email does not exist or the password comparison fails, a generic `401 Unauthorized` response is returned ("Invalid email or password") to prevent username enumeration.
- **Payload & Response**:
  - Upon successful verification, a signed JSON Web Token (JWT) is generated and returned along with non-sensitive user profile data (`id`, `name`, `email`, `role`).

---

## 5. Password Hashing Strategy

Plain-text passwords must never be stored, logged, transmitted, or returned by the system.

### Specifications:
- **Algorithm**: `bcrypt` (or `bcryptjs`).
- **Salt Factor**: Work factor of at least `10` salt rounds.
- **Scope**: Password hashing occurs during user registration or password reset routines before persisting the document to MongoDB.
- **Security Guarantee**: Neither database administrators nor compromised DB read access will expose clear-text passwords.

---

## 6. JWT & Session Strategy

VELTRIX uses a **stateless JSON Web Token (JWT)** strategy for session management.

### Specifications:
- **Token Type**: Bearer Token.
- **Payload Claims**:
  - `sub` / `userId`: Unique user ID string (`ObjectId`).
  - `email`: User's registered email address.
  - `role`: Role string (`"PATIENT"` or `"THERAPIST"`).
  - `iat`: Token issue timestamp.
  - `exp`: Token expiration timestamp (default: 24 hours / 1 day).
- **Transmission**: The client includes the JWT in the standard HTTP header for protected requests:
  ```http
  Authorization: Bearer <JWT_TOKEN>
  ```
- **Session Lifecycle**:
  - Stateless: The backend verifies the signature on each request using `JWT_SECRET` without hitting the database for session lookups.
  - Expiration: Expired tokens are rejected immediately with a `401 Unauthorized` response.
  - Logout: Handled client-side by purging the stored JWT from local storage/session state.

---

## 7. Role-Based Authorization (RBAC) Strategy

Authorization determines resource access based on the verified `role` claim in the user's JWT.

### Key Rules:
1. **Server-Side Enforcement**: Authorization checks are performed by backend middleware (`roleMiddleware`) after JWT signature verification. Client-side role assertions or request body parameters are strictly ignored.
2. **Access Control Hierarchy**:
   - Endpoints are explicitly mapped to required roles (`PATIENT`, `THERAPIST`, or both).
   - Attempting to access an endpoint outside a user's role scope triggers a `403 Forbidden` error.
3. **Resource Ownership Enforcement**:
   - Beyond role checks, patient data queries enforce ownership (`req.user.userId === assignment.patientId`).
   - Patients cannot query or modify data belonging to other patients.

---

## 8. Protected Routes & Endpoint Access Matrix

Protected routes require a valid JWT header (`Authorization: Bearer <JWT_TOKEN>`). Unprotected routes are accessible publicly.

### Access Matrix Summary:
| Route Category | Public / Protected | PATIENT Access | THERAPIST Access |
| :--- | :--- | :--- | :--- |
| `POST /api/auth/register` | Public | Yes (Register) | Yes (Register) |
| `POST /api/auth/login` | Public | Yes (Login) | Yes (Login) |
| `GET /api/auth/me` | Protected | Yes | Yes |
| `GET /api/exercises` | Protected | Read Assigned | Full Read / Write |
| `POST /api/exercises` | Protected | ❌ Forbidden | Yes (Create) |
| `PUT /api/exercises/:id` | Protected | ❌ Forbidden | Yes (Update) |
| `GET /api/users/patients` | Protected | ❌ Forbidden | Yes (List Patients) |
| `GET /api/users/patients/:id` | Protected | ❌ Forbidden | Yes (Read Patient Detail) |
| `POST /api/users/patients/:id/assignments` | Protected | ❌ Forbidden | Yes (Assign Exercise) |
| `PUT /api/users/patients/:id/assignments/:assignmentId` | Protected | Yes (Update Status) | Yes (Update Target/Date) |
| `DELETE /api/users/patients/:id/assignments/:assignmentId` | Protected | ❌ Forbidden | Yes (Cancel Assignment) |
| `POST /api/users/patients/:id/notes` | Protected | ❌ Forbidden | Yes (Add Note) |
| `GET /api/users/patients/:id/notes` | Protected | ❌ Forbidden | Yes (Read Notes) |
| `GET /api/sessions` | Protected | Read Own Sessions | Read Managed Patients |
| `POST /api/sessions` | Protected | Yes (Log Session) | ❌ Forbidden |
| `GET /api/sessions/patient/:patientId` | Protected | ❌ Forbidden | Yes (Read Patient Sessions) |
| `GET /api/dashboard/patient` | Protected | Read Own Dashboard & Active Assignments | ❌ Forbidden |
| `GET /api/dashboard/therapist` | Protected | ❌ Forbidden | Read Therapist Dashboard |

---

## 9. Patient Access Scope

Users with the `PATIENT` role have access to functionality centered on receiving and completing rehabilitation plans.

### What a Patient CAN Access:
- View own profile information via `/api/auth/me`.
- View active assigned exercise programs via `/api/dashboard/patient`.
- Access exercise instructions, guidance parameters, and demonstration media for assigned exercises.
- Execute sessions in Guided Mode or Camera Mode Beta.
- Log completed exercise session results (including self-reported pain levels before/after, difficulty ratings, and sets/reps completed).
- View their own historical exercise session logs and progress metrics over time.

### What a Patient CANNOT Access:
- Create, update, or delete entries in the master Exercise Library.
- Assign exercises to any user.
- View other patients' personal information, assigned programs, or session logs.
- View or create clinical therapist notes.

---

## 10. Therapist Access Scope

Users with the `THERAPIST` role have access to clinical management and monitoring features.

### What a Therapist CAN Access:
- View own profile information via `/api/auth/me`.
- Create, view, update, and archive exercises in the master Exercise Library.
- Assign exercises to patients, specifying targeted parameters (`targetSets`, `targetReps`, `targetDurationSeconds`, `frequency`, and `dueDate`).
- View assigned patients' session histories, completion rates, self-reported pain scores (before/after), and difficulty feedback.
- Create, view, update, and delete confidential clinical therapist notes regarding patient rehabilitation plans.

### What a Therapist CANNOT Access:
- Log exercise sessions as a patient.
- Modify or alter historical raw session data logged by patients.

---

## 11. Authentication Failure Response Strategy

An authentication failure occurs when a user is not properly identified (e.g. invalid credentials, missing token, expired token, signature tampering).

- **HTTP Status Code**: `401 Unauthorized`
- **Standardized Payload**:
```json
{
  "success": false,
  "message": "Authentication failed. Invalid token or credentials.",
  "error": "UNAUTHORIZED"
}
```

### Common Scenarios & Messages:
- Missing Token: `"Authentication token is missing"`
- Expired Token: `"Token has expired. Please log in again"`
- Invalid Credentials: `"Invalid email or password"`

---

## 12. Authorization Failure Response Strategy

An authorization failure occurs when an authenticated user attempts an action or accesses a resource for which their role or ownership level lacks permission.

- **HTTP Status Code**: `403 Forbidden`
- **Standardized Payload**:
```json
{
  "success": false,
  "message": "Access denied. You do not have permission to access this resource.",
  "error": "FORBIDDEN"
}
```

---

## 13. Expected Authentication API Endpoints (Planning Level)

These endpoint definitions detail the REST contract for authentication without implementing code.

### 13.1 User Registration
- **HTTP Method**: `POST`
- **Endpoint**: `/api/auth/register`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "SecurePassword123",
    "role": "PATIENT"
  }
  ```
- **Success Response (`201 Created`)**:
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "PATIENT"
    }
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: Validation failure (missing required fields, weak password < 8 chars, invalid role).
  - `409 Conflict`: Email address is already registered.

---

## 13.2 User Login
- **HTTP Method**: `POST`
- **Endpoint**: `/api/auth/login`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "email": "jane@example.com",
    "password": "SecurePassword123"
  }
  ```
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": "64f1a2b3c4d5e6f7a8b9c0d1",
        "name": "Jane Doe",
        "email": "jane@example.com",
        "role": "PATIENT"
      }
    }
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: Missing email or password fields.
  - `401 Unauthorized`: Invalid email or password.

---

## 13.3 Current User Context Verification
- **HTTP Method**: `GET`
- **Endpoint**: `/api/auth/me`
- **Access**: Protected (`PATIENT` or `THERAPIST`)
- **Headers Required**: `Authorization: Bearer <JWT_TOKEN>`
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "PATIENT"
    }
  }
  ```
- **Error Responses**:
  - `401 Unauthorized`: Token missing, invalid, or expired.
