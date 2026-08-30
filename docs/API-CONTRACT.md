# VELTRIX — REST API Contract & Specification

## 1. Purpose

This document defines the official REST API contract between the VELTRIX frontend and backend. It specifies the base structure, endpoints, authentication requirements, role-based authorization rules, request formats, response payloads, and HTTP status codes.

All team members must develop against this contract to ensure consistent integration between the React frontend, Node.js/Express backend, and MongoDB data layer.

---

## 2. API Architecture & Data Model Consistency

VELTRIX uses a stateless REST API over HTTP/HTTPS.

### 3-Core-Entity Database Alignment
In strict alignment with `DATABASE-CONTRACT.md`, the backend is built on **exactly three core top-level MongoDB collections**:
1. `users`
2. `exercises`
3. `exercise_sessions`

There are **no standalone top-level collections or API resources for assignments or notes**. Instead:
- **Exercise Assignments** are subdocuments (`assignedExercises[]`) embedded inside patient user documents in the `users` collection.
- **Therapist Notes** are subdocuments (`therapistNotes[]`) embedded inside patient user documents in the `users` collection.

---

## 3. Base API Configuration

- **Base Endpoint Path**: `/api`
- **Protocol**: HTTPS (HTTP for local development)
- **Data Format**: `application/json` for all request and response bodies
- **Authentication Strategy**: Bearer Token in HTTP Authorization Header:
  ```http
  Authorization: Bearer <JWT_TOKEN>
  ```

---

## 4. User Roles & Authorization Strategy

VELTRIX defines two primary role identifiers (case-sensitive lowercase strings):
- **`patient`**: Individuals performing assigned rehabilitation exercises and logging completed sessions.
- **`therapist`**: Clinical professionals managing the exercise catalog, assigning exercise programs, viewing patient progress, and recording clinical notes.

Server-side role middleware verifies the authenticated user's `role` claim from their JWT on every protected route.

---

## 5. Summary Endpoint Matrix

| Category | Endpoint URI | Method | Auth | Allowed Roles |
| :--- | :--- | :--- | :--- | :--- |
| **Authentication** | `/api/auth/register` | `POST` | Public | All (Self-registration) |
| | `/api/auth/login` | `POST` | Public | All |
| | `/api/auth/me` | `GET` | Protected | `PATIENT`, `THERAPIST` |
| **Users & Subdocuments** | `/api/users/me` | `GET` | Protected | `PATIENT`, `THERAPIST` |
| | `/api/users/me` | `PUT` | Protected | `PATIENT`, `THERAPIST` |
| | `/api/users/patients` | `GET` | Protected | `THERAPIST` |
| | `/api/users/patients/:id` | `GET` | Protected | `THERAPIST` |
| | `/api/users/patients/:id/assignments` | `POST` | Protected | `THERAPIST` |
| | `/api/users/patients/:id/assignments/:assignmentId` | `PUT` | Protected | `THERAPIST`, `PATIENT` |
| | `/api/users/patients/:id/assignments/:assignmentId` | `DELETE` | Protected | `THERAPIST` |
| | `/api/users/patients/:id/notes` | `POST` | Protected | `THERAPIST` |
| | `/api/users/patients/:id/notes` | `GET` | Protected | `THERAPIST` |
| **Exercises** | `/api/exercises` | `GET` | Protected | `PATIENT`, `THERAPIST` |
| | `/api/exercises/:id` | `GET` | Protected | `PATIENT`, `THERAPIST` |
| | `/api/exercises` | `POST` | Protected | `THERAPIST` |
| | `/api/exercises/:id` | `PUT` | Protected | `THERAPIST` |
| | `/api/exercises/:id` | `DELETE` | Protected | `THERAPIST` |
| **Exercise Sessions** | `/api/sessions` | `POST` | Protected | `PATIENT` |
| | `/api/sessions` | `GET` | Protected | `PATIENT`, `THERAPIST` |
| | `/api/sessions/:id` | `GET` | Protected | `PATIENT`, `THERAPIST` |
| | `/api/sessions/patient/:patientId` | `GET` | Protected | `THERAPIST` |
| **Patient Dashboard** | `/api/dashboard/patient` | `GET` | Protected | `PATIENT` |
| **Therapist Dashboard** | `/api/dashboard/therapist` | `GET` | Protected | `THERAPIST` |

---

## 6. Detailed API Endpoint Specifications

### AREA 1: AUTHENTICATION ENDPOINTS (`/api/auth`)

---

#### 6.1 Register User Account
- **HTTP Method**: `POST`
- **URL**: `/api/auth/register`
- **Purpose**: Register a new user account (`PATIENT` or `THERAPIST`).
- **Authentication**: Public (Unauthenticated)
- **Allowed Roles**: All
- **Request Parameters**: None
- **Request Body**:
  ```json
  {
    "name": "Jane Patient",
    "email": "jane.patient@example.com",
    "password": "SecurePassword123",
    "role": "PATIENT"
  }
  ```
  - `name` (`String`, Required): User's full name.
  - `email` (`String`, Required): Unique, valid email address.
  - `password` (`String`, Required): Plain text password (min 8 characters).
  - `role` (`String`, Required): Must be `"PATIENT"` or `"THERAPIST"`.
- **Successful Response**:
  - **HTTP Status Code**: `201 Created`
  - **Body**:
    ```json
    {
      "success": true,
      "message": "User registered successfully",
      "data": {
        "id": "64d2f1a9b3c4d5e6f7a8b9c0",
        "name": "Jane Patient",
        "email": "jane.patient@example.com",
        "role": "PATIENT",
        "createdAt": "2026-08-30T10:00:00.000Z"
      }
    }
    ```
- **Error Responses**:
  - **`400 Bad Request`**: Missing required fields or invalid password length.
  - **`409 Conflict`**: Email already registered.
  - **`500 Internal Server Error`**: Unexpected database error.

---

#### 6.2 Authenticate / Login User
- **HTTP Method**: `POST`
- **URL**: `/api/auth/login`
- **Purpose**: Verify user credentials and issue a JWT.
- **Authentication**: Public (Unauthenticated)
- **Allowed Roles**: All
- **Request Parameters**: None
- **Request Body**:
  ```json
  {
    "email": "jane.patient@example.com",
    "password": "SecurePassword123"
  }
  ```
  - `email` (`String`, Required): Registered email address.
  - `password` (`String`, Required): Plain text password.
- **Successful Response**:
  - **HTTP Status Code**: `200 OK`
  - **Body**:
    ```json
    {
      "success": true,
      "message": "Login successful",
      "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "user": {
          "id": "64d2f1a9b3c4d5e6f7a8b9c0",
          "name": "Jane Patient",
          "email": "jane.patient@example.com",
          "role": "PATIENT"
        }
      }
    }
    ```
- **Error Responses**:
  - **`400 Bad Request`**: Missing email or password.
  - **`401 Unauthorized`**: Invalid email or password (generic message to prevent email enumeration).
  - **`500 Internal Server Error`**: Unexpected server failure.

---

#### 6.3 Get Current Authenticated User Context
- **HTTP Method**: `GET`
- **URL**: `/api/auth/me`
- **Purpose**: Validate JWT and return authenticated identity claim context.
- **Authentication**: Protected (Requires `Authorization: Bearer <JWT_TOKEN>`)
- **Allowed Roles**: `PATIENT`, `THERAPIST`
- **Request Parameters**: None
- **Request Body**: None
- **Successful Response**:
  - **HTTP Status Code**: `200 OK`
  - **Body**:
    ```json
    {
      "success": true,
      "data": {
        "id": "64d2f1a9b3c4d5e6f7a8b9c0",
        "name": "Jane Patient",
        "email": "jane.patient@example.com",
        "role": "PATIENT"
      }
    }
    ```
- **Error Responses**:
  - **`401 Unauthorized`**: Missing, invalid, or expired JWT.
  - **`404 Not Found`**: Authenticated user no longer exists in database.

---

### AREA 2: USERS & EMBEDDED SUBDOCUMENT ENDPOINTS (`/api/users`)

---

#### 6.4 Get Current User Profile & Assigned Exercises
- **HTTP Method**: `GET`
- **URL**: `/api/users/me`
- **Purpose**: Fetch full user document. For patients, includes their `assignedExercises[]` array.
- **Authentication**: Protected
- **Allowed Roles**: `PATIENT`, `THERAPIST`
- **Request Parameters**: None
- **Request Body**: None
- **Successful Response**:
  - **HTTP Status Code**: `200 OK`
  - **Body** (Patient view):
    ```json
    {
      "success": true,
      "data": {
        "id": "64d2f1a9b3c4d5e6f7a8b9c0",
        "name": "Jane Patient",
        "email": "jane.patient@example.com",
        "role": "PATIENT",
        "assignedExercises": [
          {
            "id": "64d2f2b1b3c4d5e6f7a8b9c1",
            "exerciseId": "64d2f001b3c4d5e6f7a8b9e0",
            "assignedBy": "64d2f000b3c4d5e6f7a8b9d0",
            "assignedAt": "2026-08-30T10:00:00.000Z",
            "dueDate": "2026-09-15T23:59:59.000Z",
            "targetSets": 3,
            "targetReps": 10,
            "targetDurationSeconds": null,
            "frequency": "2x daily",
            "status": "active",
            "therapistNotes": "Perform slowly, focusing on extension."
          }
        ],
        "createdAt": "2026-08-01T09:00:00.000Z"
      }
    }
    ```
- **Error Responses**:
  - **`401 Unauthorized`**: Authentication missing or invalid.
  - **`500 Internal Server Error`**: Database error.

---

#### 6.5 Update User Profile
- **HTTP Method**: `PUT`
- **URL**: `/api/users/me`
- **Purpose**: Update user's non-sensitive profile information.
- **Authentication**: Protected
- **Allowed Roles**: `PATIENT`, `THERAPIST`
- **Permissions**: Users can only update their own `name`. Patients **cannot** modify `role`, `assignedExercises`, or `therapistNotes`.
- **Request Body**:
  ```json
  {
    "name": "Jane Doe Patient"
  }
  ```
- **Successful Response**:
  - **HTTP Status Code**: `200 OK`
  - **Body**:
    ```json
    {
      "success": true,
      "message": "Profile updated successfully",
      "data": {
        "id": "64d2f1a9b3c4d5e6f7a8b9c0",
        "name": "Jane Doe Patient",
        "email": "jane.patient@example.com",
        "role": "PATIENT"
      }
    }
    ```
- **Error Responses**:
  - **`400 Bad Request`**: Invalid profile data.
  - **`401 Unauthorized`**: Authentication missing.

---

#### 6.6 List Managed Patients (Therapist Only)
- **HTTP Method**: `GET`
- **URL**: `/api/users/patients`
- **Purpose**: Retrieve list of all patient user accounts managed by therapists.
- **Authentication**: Protected
- **Allowed Roles**: `THERAPIST`
- **Request Parameters**:
  - Query parameters: `?search=Jane` (optional name filter)
- **Request Body**: None
- **Successful Response**:
  - **HTTP Status Code**: `200 OK`
  - **Body**:
    ```json
    {
      "success": true,
      "data": [
        {
          "id": "64d2f1a9b3c4d5e6f7a8b9c0",
          "name": "Jane Patient",
          "email": "jane.patient@example.com",
          "activeAssignmentsCount": 2,
          "createdAt": "2026-08-01T09:00:00.000Z"
        }
      ]
    }
    ```
- **Error Responses**:
  - **`401 Unauthorized`**: Authentication missing.
  - **`403 Forbidden`**: User is a `PATIENT`.

---

#### 6.7 Get Detailed Patient Record (Therapist Only)
- **HTTP Method**: `GET`
- **URL**: `/api/users/patients/:id`
- **Purpose**: Get comprehensive patient profile, including their embedded `assignedExercises[]` and `therapistNotes[]`.
- **Authentication**: Protected
- **Allowed Roles**: `THERAPIST`
- **Request Parameters**:
  - Path parameter: `:id` (`ObjectId`, Required) - Patient User ID.
- **Request Body**: None
- **Successful Response**:
  - **HTTP Status Code**: `200 OK`
  - **Body**:
    ```json
    {
      "success": true,
      "data": {
        "id": "64d2f1a9b3c4d5e6f7a8b9c0",
        "name": "Jane Patient",
        "email": "jane.patient@example.com",
        "role": "PATIENT",
        "assignedExercises": [
          {
            "id": "64d2f2b1b3c4d5e6f7a8b9c1",
            "exerciseId": "64d2f001b3c4d5e6f7a8b9e0",
            "assignedBy": "64d2f000b3c4d5e6f7a8b9d0",
            "assignedAt": "2026-08-30T10:00:00.000Z",
            "dueDate": "2026-09-15T23:59:59.000Z",
            "targetSets": 3,
            "targetReps": 10,
            "status": "active"
          }
        ],
        "therapistNotes": [
          {
            "id": "64d2f3c2b3c4d5e6f7a8b9c2",
            "therapistId": "64d2f000b3c4d5e6f7a8b9d0",
            "note": "Flexion improving in left knee.",
            "createdAt": "2026-08-28T14:30:00.000Z"
          }
        ]
      }
    }
    ```
- **Error Responses**:
  - **`401 Unauthorized`**: Authentication missing.
  - **`403 Forbidden`**: User is a `patient`.
  - **`404 Not Found`**: Patient ID not found.

---

#### 6.8 Assign Exercise to Patient Subdocument (Therapist Only)
- **HTTP Method**: `POST`
- **URL**: `/api/users/patients/:id/assignments`
- **Purpose**: Push a new exercise assignment subdocument into the patient's `assignedExercises[]` array.
- **Authentication**: Protected
- **Allowed Roles**: `therapist`
- **Request Parameters**:
  - Path parameter: `:id` (`ObjectId`, Required) - Target Patient User ID.
- **Request Body**:
  ```json
  {
    "exerciseId": "64d2f001b3c4d5e6f7a8b9e0",
    "targetSets": 3,
    "targetReps": 10,
    "targetDurationSeconds": null,
    "frequency": "2x daily",
    "dueDate": "2026-09-15T23:59:59.000Z",
    "therapistNotes": "Perform slowly, focusing on extension."
  }
  ```
  - `exerciseId` (`ObjectId`, Required): Valid exercise from `exercises` collection.
  - `targetSets` (`Number`, Required): Target set count.
  - `targetReps` (`Number`, Optional): Target reps per set.
  - `targetDurationSeconds` (`Number`, Optional): Target duration per set in seconds.
  - `frequency` (`String`, Optional): Schedule string.
  - `dueDate` (`Date`, Optional): Completion deadline.
  - `therapistNotes` (`String`, Optional): Clinical instructions for assignment.
- **Successful Response**:
  - **HTTP Status Code**: `201 Created`
  - **Body**:
    ```json
    {
      "success": true,
      "message": "Exercise assigned successfully",
      "data": {
        "id": "64d2f2b1b3c4d5e6f7a8b9c1",
        "exerciseId": "64d2f001b3c4d5e6f7a8b9e0",
        "assignedBy": "64d2f000b3c4d5e6f7a8b9d0",
        "assignedAt": "2026-08-30T10:00:00.000Z",
        "targetSets": 3,
        "targetReps": 10,
        "status": "active"
      }
    }
    ```
- **Error Responses**:
  - **`400 Bad Request`**: Missing required fields or invalid exercise ID.
  - **`401 Unauthorized`**: Authentication missing.
  - **`403 Forbidden`**: Patients cannot assign exercises.
  - **`404 Not Found`**: Patient or exercise not found.

---

#### 6.9 Update Assignment Subdocument
- **HTTP Method**: `PUT`
- **URL**: `/api/users/patients/:id/assignments/:assignmentId`
- **Purpose**: Modify an existing assignment subdocument in the patient's record.
- **Authentication**: Protected
- **Allowed Roles**: `therapist`, `patient`
- **Permissions by Role**:
  - **`patient`**: Can ONLY update `status` (e.g. from `"active"` to `"completed"`). Cannot change target sets, reps, or due date.
  - **`therapist`**: Full permission to update targets (`targetSets`, `targetReps`), `dueDate`, `frequency`, and `status`.
- **Request Parameters**:
  - Path parameters: `:id` (Patient User ID), `:assignmentId` (Assignment Subdocument ID).
- **Request Body** (Patient view):
  ```json
  {
    "status": "completed"
  }
  ```
- **Request Body** (Therapist view):
  ```json
  {
    "targetSets": 4,
    "targetReps": 12,
    "dueDate": "2026-09-20T23:59:59.000Z",
    "status": "active"
  }
  ```
- **Successful Response**:
  - **HTTP Status Code**: `200 OK`
  - **Body**:
    ```json
    {
      "success": true,
      "message": "Assignment updated successfully",
      "data": {
        "id": "64d2f2b1b3c4d5e6f7a8b9c1",
        "status": "completed",
        "updatedAt": "2026-08-30T12:00:00.000Z"
      }
    }
    ```
- **Error Responses**:
  - **`400 Bad Request`**: Invalid status string or invalid target values.
  - **`401 Unauthorized`**: Authentication missing.
  - **`403 Forbidden`**: Patient attempting to modify therapist-only fields.
  - **`404 Not Found`**: Assignment subdocument not found.

---

#### 6.10 Remove/Cancel Assignment Subdocument (Therapist Only)
- **HTTP Method**: `DELETE`
- **URL**: `/api/users/patients/:id/assignments/:assignmentId`
- **Purpose**: Remove or mark assignment subdocument as cancelled.
- **Authentication**: Protected
- **Allowed Roles**: `therapist`
- **Request Parameters**:
  - Path parameters: `:id` (Patient ID), `:assignmentId` (Assignment ID).
- **Request Body**: None
- **Successful Response**:
  - **HTTP Status Code**: `200 OK`
  - **Body**:
    ```json
    {
      "success": true,
      "message": "Assignment removed successfully"
    }
    ```
- **Error Responses**:
  - **`401 Unauthorized`**: Authentication missing.
  - **`403 Forbidden`**: Patients cannot delete assignments.
  - **`404 Not Found`**: Assignment not found.

---

#### 6.11 Add Therapist Clinical Note Subdocument (Therapist Only)
- **HTTP Method**: `POST`
- **URL**: `/api/users/patients/:id/notes`
- **Purpose**: Push a clinical observation note into the patient's `therapistNotes[]` array.
- **Authentication**: Protected
- **Allowed Roles**: `therapist`
- **Request Parameters**:
  - Path parameter: `:id` (Patient User ID).
- **Request Body**:
  ```json
  {
    "note": "Patient completed knee extensions with zero pain reported."
  }
  ```
  - `note` (`String`, Required): Clinical progress observation text.
- **Successful Response**:
  - **HTTP Status Code**: `201 Created`
  - **Body**:
    ```json
    {
      "success": true,
      "message": "Therapist note recorded",
      "data": {
        "id": "64d2f3c2b3c4d5e6f7a8b9c2",
        "therapistId": "64d2f000b3c4d5e6f7a8b9d0",
        "note": "Patient completed knee extensions with zero pain reported.",
        "createdAt": "2026-08-30T14:00:00.000Z"
      }
    }
    ```
- **Error Responses**:
  - **`400 Bad Request`**: Note text missing.
  - **`401 Unauthorized`**: Authentication missing.
  - **`403 Forbidden`**: Patients cannot write notes.
  - **`404 Not Found`**: Patient not found.

---

#### 6.12 Read Patient Therapist Notes (Therapist Only)
- **HTTP Method**: `GET`
- **URL**: `/api/users/patients/:id/notes`
- **Purpose**: Retrieve clinical notes recorded for a patient.
- **Authentication**: Protected
- **Allowed Roles**: `therapist`
- **Request Parameters**:
  - Path parameter: `:id` (Patient User ID).
- **Request Body**: None
- **Successful Response**:
  - **HTTP Status Code**: `200 OK`
  - **Body**:
    ```json
    {
      "success": true,
      "data": [
        {
          "id": "64d2f3c2b3c4d5e6f7a8b9c2",
          "therapistId": "64d2f000b3c4d5e6f7a8b9d0",
          "note": "Patient completed knee extensions with zero pain reported.",
          "createdAt": "2026-08-30T14:00:00.000Z"
        }
      ]
    }
    ```
- **Error Responses**:
  - **`401 Unauthorized`**: Authentication missing.
  - **`403 Forbidden`**: Patients cannot read notes.
  - **`404 Not Found`**: Patient not found.

---

### AREA 3: EXERCISES ENDPOINTS (`/api/exercises`)

---

#### 6.13 Get Exercise Catalog
- **HTTP Method**: `GET`
- **URL**: `/api/exercises`
- **Purpose**: List available rehabilitation exercises in the master catalog.
- **Authentication**: Protected
- **Allowed Roles**: `patient`, `therapist`
- **Request Parameters**:
  - Query parameters (optional): `?targetBodyPart=Knee&difficulty=beginner`
- **Request Body**: None
- **Successful Response**:
  - **HTTP Status Code**: `200 OK`
  - **Body**:
    ```json
    {
      "success": true,
      "data": [
        {
          "id": "64d2f001b3c4d5e6f7a8b9e0",
          "name": "Seated Knee Extension",
          "description": "Strengthens the quadriceps muscles to support knee joint stability.",
          "targetBodyPart": "Knee",
          "difficulty": "beginner",
          "defaultSets": 3,
          "defaultReps": 10,
          "instructions": [
            "Sit upright with back supported.",
            "Slowly extend leg straight out.",
            "Pause for 2 seconds and lower."
          ],
          "demonstrationMedia": "https://assets.veltrix.app/exercises/knee-extension.mp4"
        }
      ]
    }
    ```
- **Error Responses**:
  - **`401 Unauthorized`**: Authentication missing.
  - **`500 Internal Server Error`**: Database query error.

---

#### 6.14 Get Exercise Details by ID
- **HTTP Method**: `GET`
- **URL**: `/api/exercises/:id`
- **Purpose**: Retrieve complete details of a single exercise.
- **Authentication**: Protected
- **Allowed Roles**: `patient`, `therapist`
- **Request Parameters**:
  - Path parameter: `:id` (`ObjectId`, Required).
- **Request Body**: None
- **Successful Response**:
  - **HTTP Status Code**: `200 OK`
  - **Body**:
    ```json
    {
      "success": true,
      "data": {
        "id": "64d2f001b3c4d5e6f7a8b9e0",
        "name": "Seated Knee Extension",
        "description": "Strengthens quadriceps muscles.",
        "targetBodyPart": "Knee",
        "difficulty": "beginner",
        "defaultSets": 3,
        "defaultReps": 10,
        "defaultDurationSeconds": null,
        "instructions": ["Step 1", "Step 2"],
        "demonstrationMedia": "https://assets.veltrix.app/exercises/knee-extension.mp4",
        "safetyInstructions": "Stop if sharp pain occurs.",
        "createdBy": "64d2f000b3c4d5e6f7a8b9d0"
      }
    }
    ```
- **Error Responses**:
  - **`401 Unauthorized`**: Authentication missing.
  - **`404 Not Found`**: Exercise ID does not exist.

---

#### 6.15 Create Exercise Entry (Therapist Only)
- **HTTP Method**: `POST`
- **URL**: `/api/exercises`
- **Purpose**: Add a new exercise to the master catalog.
- **Authentication**: Protected
- **Allowed Roles**: `therapist`
- **Request Body**:
  ```json
  {
    "name": "Shoulder Abduction",
    "description": "Lateral arm lift to build deltoid strength.",
    "targetBodyPart": "Shoulder",
    "difficulty": "intermediate",
    "defaultSets": 3,
    "defaultReps": 12,
    "defaultDurationSeconds": null,
    "instructions": ["Stand upright with feet shoulder-width apart.", "Lift arm out to side to 90 degrees."],
    "demonstrationMedia": "https://assets.veltrix.app/exercises/shoulder-abduction.mp4",
    "safetyInstructions": "Do not lift past 90 degrees if impingement pain occurs."
  }
  ```
  - `name` (`String`, Required): Unique exercise name.
  - `description` (`String`, Required): Guidance text.
  - `targetBodyPart` (`String`, Required): Body area.
  - `difficulty` (`String`, Required): `"beginner"`, `"intermediate"`, or `"advanced"`.
  - `instructions` (`Array<String>`, Required): Step list.
- **Successful Response**:
  - **HTTP Status Code**: `201 Created`
  - **Body**:
    ```json
    {
      "success": true,
      "message": "Exercise created successfully",
      "data": {
        "id": "64d2f002b3c4d5e6f7a8b9e1",
        "name": "Shoulder Abduction",
        "targetBodyPart": "Shoulder",
        "difficulty": "intermediate",
        "createdBy": "64d2f000b3c4d5e6f7a8b9d0"
      }
    }
    ```
- **Error Responses**:
  - **`400 Bad Request`**: Missing required fields or duplicate exercise name.
  - **`401 Unauthorized`**: Authentication missing.
  - **`403 Forbidden`**: Patients cannot create exercises.

---

#### 6.16 Update Exercise Entry (Therapist Only)
- **HTTP Method**: `PUT`
- **URL**: `/api/exercises/:id`
- **Purpose**: Modify an existing exercise in the catalog.
- **Authentication**: Protected
- **Allowed Roles**: `therapist`
- **Request Parameters**:
  - Path parameter: `:id` (Exercise ID).
- **Request Body**: Same structure as `POST /api/exercises`.
- **Successful Response**:
  - **HTTP Status Code**: `200 OK`
  - **Body**:
    ```json
    {
      "success": true,
      "message": "Exercise updated successfully"
    }
    ```
- **Error Responses**:
  - **`400 Bad Request`**: Invalid update data.
  - **`401 Unauthorized`**: Authentication missing.
  - **`403 Forbidden`**: Patients cannot update exercises.
  - **`404 Not Found`**: Exercise not found.

---

#### 6.17 Delete Exercise Entry (Therapist Only)
- **HTTP Method**: `DELETE`
- **URL**: `/api/exercises/:id`
- **Purpose**: Delete or archive an exercise entry.
- **Authentication**: Protected
- **Allowed Roles**: `therapist`
- **Request Parameters**:
  - Path parameter: `:id` (Exercise ID).
- **Request Body**: None
- **Successful Response**:
  - **HTTP Status Code**: `200 OK`
  - **Body**:
    ```json
    {
      "success": true,
      "message": "Exercise deleted successfully"
    }
    ```
- **Error Responses**:
  - **`401 Unauthorized`**: Authentication missing.
  - **`403 Forbidden`**: Patients cannot delete exercises.
  - **`404 Not Found`**: Exercise not found.

---

### AREA 4: EXERCISE SESSIONS ENDPOINTS (`/api/sessions`)

---

#### 6.18 Log Completed Exercise Session (Patient Only)
- **HTTP Method**: `POST`
- **URL**: `/api/sessions`
- **Purpose**: Submit a completed exercise session, pain ratings, effort, and performance metrics.
- **Authentication**: Protected
- **Allowed Roles**: `patient`
- **Request Parameters**: None
- **Request Body**:
  ```json
  {
    "exerciseId": "64d2f001b3c4d5e6f7a8b9e0",
    "assignmentId": "64d2f2b1b3c4d5e6f7a8b9c1",
    "completedAt": "2026-08-30T11:15:00.000Z",
    "setsCompleted": 3,
    "repsCompleted": 10,
    "durationSeconds": 180,
    "painBefore": 4,
    "painAfter": 2,
    "perceivedDifficulty": "moderate",
    "sessionResults": {
      "accuracyPercentage": 92.5,
      "feedback": "Felt comfortable during set 3."
    }
  }
  ```
  - `exerciseId` (`ObjectId`, Required): Reference to `exercises._id`.
  - `assignmentId` (`ObjectId`, Optional): Reference to `assignedExercises._id` subdocument.
  - `setsCompleted` (`Number`, Required): Number of sets.
  - `durationSeconds` (`Number`, Optional): Total elapsed time in seconds from session start to session completion, including rest intervals.
  - `painBefore` (`Number`, Required): Pain level 0–10 before exercise.
  - `painAfter` (`Number`, Required): Pain level 0–10 after exercise.
  - `perceivedDifficulty` (`String`, Required): `"easy"`, `"moderate"`, or `"hard"`.
- **Successful Response**:
  - **HTTP Status Code**: `201 Created`
  - **Body**:
    ```json
    {
      "success": true,
      "message": "Exercise session logged successfully",
      "data": {
        "id": "64d2f5e3b3c4d5e6f7a8b9f0",
        "patientId": "64d2f1a9b3c4d5e6f7a8b9c0",
        "exerciseId": "64d2f001b3c4d5e6f7a8b9e0",
        "completedAt": "2026-08-30T11:15:00.000Z",
        "setsCompleted": 3,
        "painBefore": 4,
        "painAfter": 2,
        "perceivedDifficulty": "moderate"
      }
    }
    ```
- **Error Responses**:
  - **`400 Bad Request`**: Invalid pain score range (must be 0-10) or missing required fields.
  - **`401 Unauthorized`**: Authentication missing.
  - **`403 Forbidden`**: Therapists cannot log patient sessions.

---

#### 6.19 Get Exercise Sessions History
- **HTTP Method**: `GET`
- **URL**: `/api/sessions`
- **Purpose**: Fetch session history. For a patient, returns their own sessions. For a therapist, returns sessions for their managed patients.
- **Authentication**: Protected
- **Allowed Roles**: `patient`, `therapist`
- **Request Parameters**:
  - Query parameters (optional): `?limit=10&startDate=2026-08-01`
- **Request Body**: None
- **Successful Response**:
  - **HTTP Status Code**: `200 OK`
  - **Body**:
    ```json
    {
      "success": true,
      "data": [
        {
          "id": "64d2f5e3b3c4d5e6f7a8b9f0",
          "patientId": "64d2f1a9b3c4d5e6f7a8b9c0",
          "exerciseId": "64d2f001b3c4d5e6f7a8b9e0",
          "completedAt": "2026-08-30T11:15:00.000Z",
          "setsCompleted": 3,
          "repsCompleted": 10,
          "painBefore": 4,
          "painAfter": 2,
          "perceivedDifficulty": "moderate"
        }
      ]
    }
    ```
- **Error Responses**:
  - **`401 Unauthorized`**: Authentication missing.
  - **`500 Internal Server Error`**: Database error.

---

#### 6.20 Get Session Details by ID
- **HTTP Method**: `GET`
- **URL**: `/api/sessions/:id`
- **Purpose**: Retrieve complete details for a single logged session.
- **Authentication**: Protected
- **Allowed Roles**: `patient`, `therapist`
- **Request Parameters**:
  - Path parameter: `:id` (Session ID).
- **Request Body**: None
- **Successful Response**:
  - **HTTP Status Code**: `200 OK`
  - **Body**:
    ```json
    {
      "success": true,
      "data": {
        "id": "64d2f5e3b3c4d5e6f7a8b9f0",
        "patientId": "64d2f1a9b3c4d5e6f7a8b9c0",
        "exerciseId": "64d2f001b3c4d5e6f7a8b9e0",
        "completedAt": "2026-08-30T11:15:00.000Z",
        "setsCompleted": 3,
        "repsCompleted": 10,
        "durationSeconds": 180,
        "painBefore": 4,
        "painAfter": 2,
        "perceivedDifficulty": "moderate",
        "sessionResults": {
          "accuracyPercentage": 92.5,
          "feedback": "Felt comfortable during set 3."
        }
      }
    }
    ```
- **Error Responses**:
  - **`401 Unauthorized`**: Authentication missing.
  - **`403 Forbidden`**: Patient trying to access another patient's session.
  - **`404 Not Found`**: Session not found.

---

#### 6.21 Get Specific Patient Session History (Therapist Only)
- **HTTP Method**: `GET`
- **URL**: `/api/sessions/patient/:patientId`
- **Purpose**: Retrieve complete session logs for a specified patient.
- **Authentication**: Protected
- **Allowed Roles**: `therapist`
- **Request Parameters**:
  - Path parameter: `:patientId` (`ObjectId`, Required).
- **Request Body**: None
- **Successful Response**:
  - **HTTP Status Code**: `200 OK`
  - **Body**: Same array format as `GET /api/sessions`.
- **Error Responses**:
  - **`401 Unauthorized`**: Authentication missing.
  - **`403 Forbidden`**: User is a `patient`.
  - **`404 Not Found`**: Patient ID not found.

---

### AREA 5: PATIENT DASHBOARD ENDPOINT (`/api/dashboard/patient`)

---

#### 6.22 Get Patient Dashboard Data (Patient Only)
- **HTTP Method**: `GET`
- **URL**: `/api/dashboard/patient`
- **Purpose**: Fetch aggregated dashboard data for the authenticated patient, including active assigned exercises, recent completed sessions, pain summary, and compliance stats.
- **Authentication**: Protected
- **Allowed Roles**: `patient`
- **Request Parameters**: None
- **Request Body**: None
- **Successful Response**:
  - **HTTP Status Code**: `200 OK`
  - **Body**:
    ```json
    {
      "success": true,
      "data": {
        "activeAssignments": [
          {
            "id": "64d2f2b1b3c4d5e6f7a8b9c1",
            "exerciseId": "64d2f001b3c4d5e6f7a8b9e0",
            "exerciseName": "Seated Knee Extension",
            "targetSets": 3,
            "targetReps": 10,
            "dueDate": "2026-09-15T23:59:59.000Z",
            "status": "active"
          }
        ],
        "recentSessions": [
          {
            "id": "64d2f5e3b3c4d5e6f7a8b9f0",
            "exerciseName": "Seated Knee Extension",
            "completedAt": "2026-08-30T11:15:00.000Z",
            "painBefore": 4,
            "painAfter": 2
          }
        ],
        "summary": {
          "totalCompletedSessions": 12,
          "averagePainReduction": 1.8,
          "adherenceRatePercentage": 90.0
        }
      }
    }
    ```
- **Error Responses**:
  - **`401 Unauthorized`**: Authentication missing.
  - **`403 Forbidden`**: Therapists cannot access patient dashboard route.

---

### AREA 6: THERAPIST DASHBOARD ENDPOINT (`/api/dashboard/therapist`)

---

#### 6.23 Get Therapist Dashboard Data (Therapist Only)
- **HTTP Method**: `GET`
- **URL**: `/api/dashboard/therapist`
- **Purpose**: Fetch aggregated clinical dashboard metrics for the authenticated therapist, including managed patient count, active programs, recent patient completions, and pain alerts.
- **Authentication**: Protected
- **Allowed Roles**: `therapist`
- **Request Parameters**: None
- **Request Body**: None
- **Successful Response**:
  - **HTTP Status Code**: `200 OK`
  - **Body**:
    ```json
    {
      "success": true,
      "data": {
        "metrics": {
          "totalManagedPatients": 15,
          "activeExercisePrograms": 28,
          "sessionsCompletedThisWeek": 42
        },
        "recentPatientActivity": [
          {
            "patientId": "64d2f1a9b3c4d5e6f7a8b9c0",
            "patientName": "Jane Patient",
            "lastSessionAt": "2026-08-30T11:15:00.000Z",
            "exerciseName": "Seated Knee Extension",
            "painDelta": -2
          }
        ],
        "clinicalAlerts": [
          {
            "patientId": "64d2f1a9b3c4d5e6f7a8b9c0",
            "patientName": "Jane Patient",
            "alertType": "High Pain Rating",
            "message": "Reported pain level 8 after session on 2026-08-29."
          }
        ]
      }
    }
    ```
- **Error Responses**:
  - **`401 Unauthorized`**: Authentication missing.
  - **`403 Forbidden`**: Patients cannot access therapist dashboard route.

---

## 7. Common Response & Error Specifications

### Success Format Standard
All successful API responses return `200 OK` or `201 Created` with the JSON structure:
```json
{
  "success": true,
  "message": "Optional user-friendly message",
  "data": {}
}
```

### Error Format Standard
All API errors return standard HTTP error status codes with JSON body:
```json
{
  "success": false,
  "message": "Clear error explanation",
  "error": "ERROR_CODE"
}
```

### Summary of HTTP Status Codes

| Status Code | Meaning | Context & Trigger |
| :--- | :--- | :--- |
| **`200 OK`** | Success | Request succeeded and data returned. |
| **`201 Created`** | Created | Resource (user, exercise, session, subdocument) created successfully. |
| **`400 Bad Request`** | Bad Input | Missing required fields, invalid format, or out-of-bounds parameters. |
| **`401 Unauthorized`** | Auth Missing | Invalid, expired, or missing JWT Bearer token. |
| **`403 Forbidden`** | Unauthorized Role | Authenticated role (`patient` or `therapist`) lacks permission for endpoint/field. |
| **`404 Not Found`** | Not Found | Requested entity or subdocument ID does not exist. |
| **`409 Conflict`** | Conflict | Duplicate entry (e.g. registering already existing email). |
| **`500 Internal Error`** | Server Fault | Unhandled exception or database failure. |

---

## 8. Representative API Request & Response Examples

This section provides concrete, end-to-end HTTP request and response examples for each core API area. All payloads adhere to the canonical schema names, embedded subdocument structures, and authentication requirements specified in this contract.

### 8.1 Authentication API Examples

#### Example 1.1: Register New User (`POST /api/auth/register`)
- **HTTP Request**:
  ```http
  POST /api/auth/register HTTP/1.1
  Host: api.veltrix.app
  Content-Type: application/json

  {
    "name": "Jane Patient",
    "email": "jane.patient@example.com",
    "password": "SecurePassword123",
    "role": "PATIENT"
  }
  ```
- **HTTP Response (`201 Created`)**:
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "id": "64d2f1a9b3c4d5e6f7a8b9c0",
      "name": "Jane Patient",
      "email": "jane.patient@example.com",
      "role": "PATIENT",
      "createdAt": "2026-08-30T10:00:00.000Z"
    }
  }
  ```

#### Example 1.2: Login User (`POST /api/auth/login`)
- **HTTP Request**:
  ```http
  POST /api/auth/login HTTP/1.1
  Host: api.veltrix.app
  Content-Type: application/json

  {
    "email": "jane.patient@example.com",
    "password": "SecurePassword123"
  }
  ```
- **HTTP Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NGQyZjFhOWIzYzRkNWU2ZjdhOGI5YzAiLCJlbWFpbCI6ImphbmUucGF0aWVudEBleGFtcGxlLmNvbSIsInJvbGUiOiJwYXRpZW50IiwiaWF0IjoxNzU2NTY3NjAwLCJleHAiOjE3NTY2NTQwMDB9...",
      "user": {
        "id": "64d2f1a9b3c4d5e6f7a8b9c0",
        "name": "Jane Patient",
        "email": "jane.patient@example.com",
        "role": "PATIENT"
      }
    }
  }
  ```

#### Example 1.3: Get Current User Context (`GET /api/auth/me`)
- **HTTP Request**:
  ```http
  GET /api/auth/me HTTP/1.1
  Host: api.veltrix.app
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```
- **HTTP Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "64d2f1a9b3c4d5e6f7a8b9c0",
      "name": "Jane Patient",
      "email": "jane.patient@example.com",
      "role": "PATIENT"
    }
  }
  ```

---

### 8.2 Exercise Catalog API Examples

#### Example 2.1: List Exercise Catalog (`GET /api/exercises`)
- **HTTP Request**:
  ```http
  GET /api/exercises?targetBodyPart=Knee&difficulty=beginner HTTP/1.1
  Host: api.veltrix.app
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```
- **HTTP Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "64d2f001b3c4d5e6f7a8b9e0",
        "name": "Seated Knee Extension",
        "description": "Strengthens quadriceps muscles to improve knee joint mobility.",
        "targetBodyPart": "Knee",
        "difficulty": "beginner",
        "defaultSets": 3,
        "defaultReps": 10,
        "defaultDurationSeconds": null,
        "instructions": [
          "Sit upright in a chair with back supported.",
          "Slowly extend your leg straight out parallel to the ground.",
          "Hold for 2 seconds and return to starting position."
        ],
        "demonstrationMedia": "https://assets.veltrix.app/exercises/knee-extension.mp4",
        "safetyInstructions": "Stop immediately if sharp joint pain occurs.",
        "createdBy": "64d2f000b3c4d5e6f7a8b9d0"
      }
    ]
  }
  ```

#### Example 2.2: Get Exercise Details by ID (`GET /api/exercises/:id`)
- **HTTP Request**:
  ```http
  GET /api/exercises/64d2f001b3c4d5e6f7a8b9e0 HTTP/1.1
  Host: api.veltrix.app
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```
- **HTTP Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "64d2f001b3c4d5e6f7a8b9e0",
      "name": "Seated Knee Extension",
      "description": "Strengthens quadriceps muscles to improve knee joint mobility.",
      "targetBodyPart": "Knee",
      "difficulty": "beginner",
      "defaultSets": 3,
      "defaultReps": 10,
      "defaultDurationSeconds": null,
      "instructions": [
        "Sit upright in a chair with back supported.",
        "Slowly extend your leg straight out parallel to the ground.",
        "Hold for 2 seconds and return to starting position."
      ],
      "demonstrationMedia": "https://assets.veltrix.app/exercises/knee-extension.mp4",
      "safetyInstructions": "Stop immediately if sharp joint pain occurs.",
      "createdBy": "64d2f000b3c4d5e6f7a8b9d0"
    }
  }
  ```

#### Example 2.3: Create Exercise in Catalog (`POST /api/exercises`)
- **HTTP Request**:
  ```http
  POST /api/exercises HTTP/1.1
  Host: api.veltrix.app
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (Therapist Token)
  Content-Type: application/json

  {
    "name": "Standing Ankle Plantarflexion",
    "description": "Calf raise exercise to improve ankle stability and plantar flexion strength.",
    "targetBodyPart": "Ankle",
    "difficulty": "beginner",
    "defaultSets": 3,
    "defaultReps": 15,
    "defaultDurationSeconds": null,
    "instructions": [
      "Stand upright holding onto a chair or wall for balance.",
      "Slowly raise your heels up off the floor until standing on toes.",
      "Pause for 1 second at full extension.",
      "Lower heels slowly back to the starting position."
    ],
    "demonstrationMedia": "https://assets.veltrix.app/exercises/ankle-plantarflexion.mp4",
    "safetyInstructions": "Maintain controlled motion; do not bounce."
  }
  ```
- **HTTP Response (`201 Created`)**:
  ```json
  {
    "success": true,
    "message": "Exercise created successfully",
    "data": {
      "id": "64d2f003b3c4d5e6f7a8b9e2",
      "name": "Standing Ankle Plantarflexion",
      "description": "Calf raise exercise to improve ankle stability and plantar flexion strength.",
      "targetBodyPart": "Ankle",
      "difficulty": "beginner",
      "defaultSets": 3,
      "defaultReps": 15,
      "defaultDurationSeconds": null,
      "instructions": [
        "Stand upright holding onto a chair or wall for balance.",
        "Slowly raise your heels up off the floor until standing on toes.",
        "Pause for 1 second at full extension.",
        "Lower heels slowly back to the starting position."
      ],
      "demonstrationMedia": "https://assets.veltrix.app/exercises/ankle-plantarflexion.mp4",
      "safetyInstructions": "Maintain controlled motion; do not bounce.",
      "createdBy": "64d2f000b3c4d5e6f7a8b9d0",
      "createdAt": "2026-08-30T15:30:00.000Z",
      "updatedAt": "2026-08-30T15:30:00.000Z"
    }
  }
  ```

---

### 8.3 Exercise Assignment API Example (Embedded Subdocument)

#### Example 3.1: Assign Exercise to Patient (`POST /api/users/patients/:id/assignments`)
- **HTTP Request**:
  ```http
  POST /api/users/patients/64d2f1a9b3c4d5e6f7a8b9c0/assignments HTTP/1.1
  Host: api.veltrix.app
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (Therapist Token)
  Content-Type: application/json

  {
    "exerciseId": "64d2f001b3c4d5e6f7a8b9e0",
    "targetSets": 3,
    "targetReps": 10,
    "targetDurationSeconds": null,
    "frequency": "2x daily",
    "dueDate": "2026-09-15T23:59:59.000Z",
    "therapistNotes": "Perform slowly, focusing on extension."
  }
  ```
- **HTTP Response (`201 Created`)**:
  ```json
  {
    "success": true,
    "message": "Exercise assigned successfully",
    "data": {
      "id": "64d2f2b1b3c4d5e6f7a8b9c1",
      "exerciseId": "64d2f001b3c4d5e6f7a8b9e0",
      "assignedBy": "64d2f000b3c4d5e6f7a8b9d0",
      "assignedAt": "2026-08-30T10:00:00.000Z",
      "dueDate": "2026-09-15T23:59:59.000Z",
      "targetSets": 3,
      "targetReps": 10,
      "targetDurationSeconds": null,
      "frequency": "2x daily",
      "status": "active",
      "therapistNotes": "Perform slowly, focusing on extension."
    }
  }
  ```

---

### 8.4 Therapist Clinical Notes API Example (Embedded Subdocument)

#### Example 4.1: Add Therapist Note (`POST /api/users/patients/:id/notes`)
- **HTTP Request**:
  ```http
  POST /api/users/patients/64d2f1a9b3c4d5e6f7a8b9c0/notes HTTP/1.1
  Host: api.veltrix.app
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (Therapist Token)
  Content-Type: application/json

  {
    "note": "Patient completed knee extensions with zero pain reported and improved range of motion."
  }
  ```
- **HTTP Response (`201 Created`)**:
  ```json
  {
    "success": true,
    "message": "Therapist note recorded successfully",
    "data": {
      "id": "64d2f3c2b3c4d5e6f7a8b9c2",
      "therapistId": "64d2f000b3c4d5e6f7a8b9d0",
      "note": "Patient completed knee extensions with zero pain reported and improved range of motion.",
      "createdAt": "2026-08-30T14:00:00.000Z",
      "updatedAt": "2026-08-30T14:00:00.000Z"
    }
  }
  ```

---

### 8.5 Exercise Sessions API Example

#### Example 5.1: Log Completed Exercise Session (`POST /api/sessions`)
- **HTTP Request**:
  ```http
  POST /api/sessions HTTP/1.1
  Host: api.veltrix.app
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (Patient Token)
  Content-Type: application/json

  {
    "exerciseId": "64d2f001b3c4d5e6f7a8b9e0",
    "assignmentId": "64d2f2b1b3c4d5e6f7a8b9c1",
    "completedAt": "2026-08-30T11:15:00.000Z",
    "setsCompleted": 3,
    "repsCompleted": 10,
    "durationSeconds": 180,
    "painBefore": 4,
    "painAfter": 2,
    "perceivedDifficulty": "moderate",
    "sessionResults": {
      "accuracyPercentage": 92.5,
      "feedback": "Felt comfortable during set 3."
    }
  }
  ```
- **HTTP Response (`201 Created`)**:
  ```json
  {
    "success": true,
    "message": "Exercise session logged successfully",
    "data": {
      "id": "64d2f5e3b3c4d5e6f7a8b9f0",
      "patientId": "64d2f1a9b3c4d5e6f7a8b9c0",
      "exerciseId": "64d2f001b3c4d5e6f7a8b9e0",
      "assignmentId": "64d2f2b1b3c4d5e6f7a8b9c1",
      "completedAt": "2026-08-30T11:15:00.000Z",
      "setsCompleted": 3,
      "repsCompleted": 10,
      "durationSeconds": 180,
      "painBefore": 4,
      "painAfter": 2,
      "perceivedDifficulty": "moderate",
      "sessionResults": {
        "accuracyPercentage": 92.5,
        "feedback": "Felt comfortable during set 3."
      },
      "createdAt": "2026-08-30T11:16:00.000Z",
      "updatedAt": "2026-08-30T11:16:00.000Z"
    }
  }
  ```

---

### 8.6 Dashboard APIs Examples

#### Example 6.1: Patient Dashboard (`GET /api/dashboard/patient`)
- **HTTP Request**:
  ```http
  GET /api/dashboard/patient HTTP/1.1
  Host: api.veltrix.app
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (Patient Token)
  ```
- **HTTP Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": {
      "activeAssignments": [
        {
          "id": "64d2f2b1b3c4d5e6f7a8b9c1",
          "exerciseId": "64d2f001b3c4d5e6f7a8b9e0",
          "exerciseName": "Seated Knee Extension",
          "targetSets": 3,
          "targetReps": 10,
          "dueDate": "2026-09-15T23:59:59.000Z",
          "status": "active"
        }
      ],
      "recentSessions": [
        {
          "id": "64d2f5e3b3c4d5e6f7a8b9f0",
          "exerciseName": "Seated Knee Extension",
          "completedAt": "2026-08-30T11:15:00.000Z",
          "painBefore": 4,
          "painAfter": 2
        }
      ],
      "summary": {
        "totalCompletedSessions": 12,
        "averagePainReduction": 1.8,
        "adherenceRatePercentage": 90.0
      }
    }
  }
  ```

#### Example 6.2: Therapist Dashboard (`GET /api/dashboard/therapist`)
- **HTTP Request**:
  ```http
  GET /api/dashboard/therapist HTTP/1.1
  Host: api.veltrix.app
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (Therapist Token)
  ```
- **HTTP Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": {
      "metrics": {
        "totalManagedPatients": 15,
        "activeExercisePrograms": 28,
        "sessionsCompletedThisWeek": 42
      },
      "recentPatientActivity": [
        {
          "patientId": "64d2f1a9b3c4d5e6f7a8b9c0",
          "patientName": "Jane Patient",
          "lastSessionAt": "2026-08-30T11:15:00.000Z",
          "exerciseName": "Seated Knee Extension",
          "painDelta": -2
        }
      ],
      "clinicalAlerts": [
        {
          "patientId": "64d2f1a9b3c4d5e6f7a8b9c0",
          "patientName": "Jane Patient",
          "alertType": "High Pain Rating",
          "message": "Reported pain level 8 after session on 2026-08-29."
        }
      ]
    }
  }
  ```
