````markdown
# VELTRIX — API Contract

## 1. Purpose

This document defines the contract between the VELTRIX frontend and backend.

It specifies the API structure, endpoints, authentication requirements, request formats, response formats, permissions, validation rules, and common error handling that frontend and backend developers must follow.

The purpose of this contract is to ensure that all four team members build against the same API expectations and that frontend, backend, database, and AI-assisted development remain consistent.

---

## 2. API Architecture

VELTRIX uses a REST API.

The general communication flow is:

```text
Patient / Therapist
        ↓
React Frontend
        ↓
REST API
        ↓
Node.js + Express Backend
        ↓
MongoDB
````

The frontend must communicate with the database through the backend API.

The frontend must not directly access MongoDB.

---

## 3. Base API Structure

All API endpoints should follow the general structure:

```text
/api/<resource>
```

Examples:

```text
/api/auth
/api/users
/api/exercises
/api/assignments
/api/sessions
/api/progress
/api/notes
```

The exact production base URL will be defined during deployment.

For local development, the API will use the locally configured backend server URL.

---

## 4. HTTP Methods

VELTRIX follows standard REST conventions.

| Method | Purpose                                              |
| ------ | ---------------------------------------------------- |
| GET    | Retrieve data                                        |
| POST   | Create data or perform an action                     |
| PUT    | Replace/update an existing resource                  |
| PATCH  | Partially update an existing resource where required |
| DELETE | Delete a resource                                    |

CRUD mapping:

```text
Create → POST
Read   → GET
Update → PUT / PATCH
Delete → DELETE
```

---

## 5. Authentication

VELTRIX uses JWT-based authentication.

### Authentication flow

```text
User
 ↓
Login
 ↓
POST /api/auth/login
 ↓
Backend verifies credentials
 ↓
JWT returned
 ↓
Frontend uses JWT for protected requests
 ↓
Backend verifies JWT
 ↓
Backend checks user role/permissions
 ↓
Request allowed or rejected
```

Protected API requests should include the JWT in the authorization header:

```http
Authorization: Bearer <JWT_TOKEN>
```

---

## 6. User Roles

VELTRIX has two primary roles:

```text
patient
therapist
```

Role-based authorization must be enforced by the backend.

A user's role must never be trusted solely because it was supplied by the frontend.

The backend must determine the authenticated user's identity and permissions from the validated authentication information.

---

# 7. Authentication Endpoints

## 7.1 Register

```http
POST /api/auth/register
```

### Purpose

Create a new VELTRIX user account.

### Request body

```json
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password",
  "role": "patient"
}
```

### Required fields

* `name`
* `email`
* `password`
* `role`

### Allowed roles

```text
patient
therapist
```

### Success

```text
201 Created
```

Example:

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "USER_ID",
    "name": "User Name",
    "email": "user@example.com",
    "role": "patient"
  }
}
```

Passwords must never be returned in the response.

### Possible errors

```text
400 Bad Request
409 Conflict
500 Internal Server Error
```

---

## 7.2 Login

```http
POST /api/auth/login
```

### Purpose

Authenticate a user and return a JWT.

### Request body

```json
{
  "email": "user@example.com",
  "password": "password"
}
```

### Success

```text
200 OK
```

Example:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "JWT_TOKEN",
    "user": {
      "id": "USER_ID",
      "name": "User Name",
      "email": "user@example.com",
      "role": "patient"
    }
  }
}
```

### Possible errors

```text
400 Bad Request
401 Unauthorized
500 Internal Server Error
```

---

# 8. User Endpoints

User endpoints must require authentication where they expose protected user information.

## 8.1 Get Current User

```http
GET /api/users/me
```

### Authentication

Required.

### Purpose

Return the currently authenticated user's information.

### Success

```text
200 OK
```

Example:

```json
{
  "success": true,
  "data": {
    "id": "USER_ID",
    "name": "User Name",
    "email": "user@example.com",
    "role": "patient"
  }
}
```

### Errors

```text
401 Unauthorized
404 Not Found
500 Internal Server Error
```

---

# 9. Exercise Endpoints

Exercise management is primarily a therapist-controlled feature.

## 9.1 Get Exercises

```http
GET /api/exercises
```

### Authentication

Required.

### Purpose

Retrieve exercises available to the authenticated user according to their permissions.

### Success

```text
200 OK
```

Example:

```json
{
  "success": true,
  "data": [
    {
      "id": "EXERCISE_ID",
      "name": "Knee Extension",
      "description": "Exercise description",
      "targetBodyPart": "Knee",
      "difficulty": "Beginner",
      "sets": 3,
      "repetitions": 10,
      "duration": null,
      "instructions": [
        "Instruction 1",
        "Instruction 2"
      ],
      "demonstrationMedia": null,
      "safetyInstructions": [
        "Safety instruction"
      ]
    }
  ]
}
```

### Errors

```text
401 Unauthorized
500 Internal Server Error
```

---

## 9.2 Get Exercise by ID

```http
GET /api/exercises/:id
```

### Authentication

Required.

### Purpose

Retrieve one exercise by its ID.

### Success

```text
200 OK
```

### Errors

```text
400 Bad Request
401 Unauthorized
404 Not Found
500 Internal Server Error
```

---

## 9.3 Create Exercise

```http
POST /api/exercises
```

### Authentication

Required.

### Allowed role

```text
therapist
```

### Purpose

Create a rehabilitation exercise.

### Request body

```json
{
  "name": "Knee Extension",
  "description": "Exercise description",
  "targetBodyPart": "Knee",
  "difficulty": "Beginner",
  "sets": 3,
  "repetitions": 10,
  "duration": null,
  "instructions": [
    "Instruction 1",
    "Instruction 2"
  ],
  "demonstrationMedia": null,
  "safetyInstructions": [
    "Safety instruction"
  ]
}
```

### Success

```text
201 Created
```

### Errors

```text
400 Bad Request
401 Unauthorized
403 Forbidden
500 Internal Server Error
```

---

## 9.4 Update Exercise

```http
PUT /api/exercises/:id
```

### Authentication

Required.

### Allowed role

```text
therapist
```

### Purpose

Update an existing exercise.

### Request body

Uses the exercise data structure defined above.

### Success

```text
200 OK
```

### Errors

```text
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
500 Internal Server Error
```

---

## 9.5 Delete Exercise

```http
DELETE /api/exercises/:id
```

### Authentication

Required.

### Allowed role

```text
therapist
```

### Purpose

Delete an exercise.

### Success

```text
200 OK
```

Example:

```json
{
  "success": true,
  "message": "Exercise deleted successfully"
}
```

### Errors

```text
401 Unauthorized
403 Forbidden
404 Not Found
500 Internal Server Error
```

---

# 10. Exercise Assignment Endpoints

Exercise assignments connect patients with exercises.

## 10.1 Create Assignment

```http
POST /api/assignments
```

### Authentication

Required.

### Allowed role

```text
therapist
```

### Request body

```json
{
  "patient": "PATIENT_ID",
  "exercise": "EXERCISE_ID",
  "targets": {
    "sets": 3,
    "repetitions": 10
  },
  "dueDate": "2026-09-10"
}
```

### Success

```text
201 Created
```

### Errors

```text
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
500 Internal Server Error
```

---

## 10.2 Get Patient Assignments

```http
GET /api/assignments
```

### Authentication

Required.

### Purpose

Return assignments relevant to the authenticated user.

For a patient, this should return their assigned exercises.

For a therapist, this may return assignments they are authorized to view.

### Success

```text
200 OK
```

### Errors

```text
401 Unauthorized
500 Internal Server Error
```

---

## 10.3 Get Assignment by ID

```http
GET /api/assignments/:id
```

### Authentication

Required.

### Purpose

Retrieve a specific exercise assignment.

### Errors

```text
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
500 Internal Server Error
```

---

## 10.4 Update Assignment

```http
PUT /api/assignments/:id
```

### Authentication

Required.

### Allowed role

```text
therapist
```

### Purpose

Update an existing exercise assignment.

### Errors

```text
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
500 Internal Server Error
```

---

## 10.5 Delete Assignment

```http
DELETE /api/assignments/:id
```

### Authentication

Required.

### Allowed role

```text
therapist
```

### Purpose

Remove an exercise assignment.

### Errors

```text
401 Unauthorized
403 Forbidden
404 Not Found
500 Internal Server Error
```

---

# 11. Exercise Session Endpoints

Exercise sessions represent a patient's rehabilitation activity.

## 11.1 Create Exercise Session

```http
POST /api/sessions
```

### Authentication

Required.

### Allowed role

```text
patient
```

### Purpose

Create/store a completed exercise session.

### Request body

```json
{
  "exercise": "EXERCISE_ID",
  "completionInformation": {
    "completed": true
  },
  "painBefore": 4,
  "painAfter": 3,
  "difficulty": 2,
  "sessionResults": {
    "setsCompleted": 3,
    "repetitionsCompleted": 10
  }
}
```

### Success

```text
201 Created
```

### Errors

```text
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
500 Internal Server Error
```

---

## 11.2 Get Patient Sessions

```http
GET /api/sessions
```

### Authentication

Required.

### Purpose

Retrieve sessions relevant to the authenticated user.

A patient should receive their own sessions.

A therapist should only receive sessions for patients they are authorized to monitor.

### Success

```text
200 OK
```

### Errors

```text
401 Unauthorized
403 Forbidden
500 Internal Server Error
```

---

## 11.3 Get Session by ID

```http
GET /api/sessions/:id
```

### Authentication

Required.

### Purpose

Retrieve a specific exercise session.

### Errors

```text
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
500 Internal Server Error
```

---

# 12. Progress Endpoints

Progress information is derived primarily from stored exercise session and rehabilitation data.

## 12.1 Get Patient Progress

```http
GET /api/progress
```

### Authentication

Required.

### Purpose

Return relevant rehabilitation progress for the authenticated patient.

Progress may include information derived from:

* Completed sessions.
* Exercise completion.
* Pain records.
* Difficulty ratings.
* Session results.

### Success

```text
200 OK
```

### Errors

```text
401 Unauthorized
500 Internal Server Error
```

---

## 12.2 Get Patient Progress as Therapist

```http
GET /api/progress/patient/:patientId
```

### Authentication

Required.

### Allowed role

```text
therapist
```

### Purpose

Allow an authorized therapist to view relevant progress for a patient.

### Errors

```text
401 Unauthorized
403 Forbidden
404 Not Found
500 Internal Server Error
```

---

# 13. Therapist Notes Endpoints

## 13.1 Create Therapist Note

```http
POST /api/notes
```

### Authentication

Required.

### Allowed role

```text
therapist
```

### Request body

```json
{
  "patient": "PATIENT_ID",
  "note": "Patient is progressing well."
}
```

### Success

```text
201 Created
```

### Errors

```text
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
500 Internal Server Error
```

---

## 13.2 Get Patient Notes

```http
GET /api/notes/patient/:patientId
```

### Authentication

Required.

### Allowed role

```text
therapist
```

### Purpose

Retrieve therapist notes associated with a patient.

### Errors

```text
401 Unauthorized
403 Forbidden
404 Not Found
500 Internal Server Error
```

---

# 14. Pain Data

Pain information is recorded as part of exercise sessions.

The core API does not require a separate independent pain resource if pain is stored within the exercise session.

The session should support:

```text
painBefore
painAfter
```

The values can be used to generate patient history and progress information.

Validation must ensure that pain values follow the agreed application scale.

The exact scale and UI representation must remain consistent across frontend and backend.

---

# 15. Guided Mode API Behaviour

Guided Mode is the required core exercise mode.

The frontend may use existing exercise and session APIs to support the Guided Mode workflow.

Conceptually:

```text
GET exercise
      ↓
Patient starts session
      ↓
Guided Mode UI
      ↓
Patient completes exercise
      ↓
Pain before / after
      ↓
Difficulty rating
      ↓
POST /api/sessions
      ↓
Session stored
```

Guided Mode does not require a separate backend architecture merely because it is a different exercise mode.

---

# 16. Camera Mode Beta API Behaviour

Camera Mode Beta is an optional advanced feature.

The computer-vision processing may occur during the exercise session.

The core API must not depend on raw camera-video storage.

Where Camera Mode generates persistent session results, those results should be associated with the relevant exercise session.

Camera Mode Beta must not make the core session workflow unusable when camera functionality is unavailable.

---

# 17. Common Response Structure

Where practical, successful API responses should follow a consistent structure.

Example:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

For collections:

```json
{
  "success": true,
  "data": []
}
```

The exact response data depends on the endpoint.

---

# 18. Common Error Response

API errors should use a consistent structure.

Example:

```json
{
  "success": false,
  "message": "Error description",
  "error": "ERROR_CODE"
}
```

The API should not expose sensitive implementation details, passwords, secrets, database credentials, stack traces, or internal system information to clients.

---

# 19. HTTP Status Code Rules

VELTRIX should use standard HTTP status codes consistently.

| Status | Meaning                             |
| ------ | ----------------------------------- |
| 200    | Request successful                  |
| 201    | Resource created successfully       |
| 400    | Invalid request or validation error |
| 401    | Authentication required or invalid  |
| 403    | Authenticated but not authorized    |
| 404    | Resource not found                  |
| 409    | Resource conflict                   |
| 500    | Unexpected server error             |

---

# 20. Validation Rules

Backend validation is required even if the frontend already validates input.

The backend must validate:

* Required fields.
* Data types.
* Valid identifiers.
* Valid user roles.
* Valid exercise references.
* Valid patient references.
* Valid session information.
* Valid pain values.
* Valid difficulty values.
* Appropriate relationships between resources.

Frontend validation improves user experience but must not replace backend validation.

---

# 21. Authorization Rules

Authorization must be enforced on the backend.

### Patient

Patients can:

* View their own assigned exercises.
* Complete their own exercise sessions.
* View their own progress and history.
* Submit their own rehabilitation information.

Patients must not:

* Manage exercises.
* Delete therapist-created exercises.
* Access another patient's private information.
* Modify another patient's sessions.
* Access therapist-only functionality.

### Therapist

Therapists can:

* Manage exercises.
* Assign exercises.
* View authorized patient information.
* View relevant patient sessions.
* View patient progress.
* View pain history.
* Create therapist notes.

Therapists must not access patients outside their authorized scope.

---

# 22. Resource Relationships

The API must preserve the relationships defined in the database contract.

```text
User
│
├── Patient
│   │
│   ├── Exercise Assignment
│   │       └── Exercise
│   │
│   └── Exercise Session
│           └── Exercise
│
└── Therapist
    │
    ├── Exercise
    ├── Exercise Assignment
    └── Therapist Note
```

IDs should be used to reference related resources rather than duplicating complete objects unnecessarily.

---

# 23. API and Database Consistency

The API contract must remain consistent with `DATABASE-CONTRACT.md`.

For example:

```text
Database Contract
       ↓
Exercise fields
       ↓
API Request/Response
       ↓
Frontend
```

If an approved project change modifies a database field or relationship, the corresponding API contract must also be reviewed and updated.

---

# 24. API Security Principles

The API must:

* Require authentication for protected resources.
* Enforce authorization on the backend.
* Validate all incoming data.
* Never trust role information supplied only by the client.
* Never store plaintext passwords.
* Never expose passwords in API responses.
* Avoid exposing sensitive server information.
* Use environment variables for secrets and sensitive configuration.
* Protect patient-specific data from unauthorized access.

---

# 25. API Testing

The API shall be tested using Postman.

Testing should cover:

* Successful requests.
* Invalid requests.
* Authentication failures.
* Authorization failures.
* Missing resources.
* Invalid identifiers.
* CRUD operations.
* Patient workflows.
* Therapist workflows.
* Exercise assignments.
* Exercise sessions.
* Progress retrieval.
* Therapist notes.

Both successful and error responses should be tested.

---

# 26. Frontend Integration Rules

Frontend developers must use the API contract rather than assuming backend behaviour.

The frontend should:

* Use the documented endpoint.
* Use the documented HTTP method.
* Send the documented request structure.
* Handle documented response structures.
* Handle relevant HTTP status codes.
* Send authentication information for protected endpoints.
* Never directly access MongoDB.

If an API requirement needs to change, the team should agree on the change and update the contract before implementing incompatible frontend/backend changes.

---

# 27. Contract Change Rule

This document is a shared technical contract.

Before changing:

* Endpoint names.
* HTTP methods.
* Request fields.
* Response fields.
* Authentication requirements.
* Roles/permissions.
* Resource relationships.

the affected team members should agree on the change and update this document.

The frontend and backend should then be updated consistently.

---

# 28. Core API Summary

| Area           | Main Endpoints                          |
| -------------- | --------------------------------------- |
| Authentication | `/api/auth/register`, `/api/auth/login` |
| Users          | `/api/users/me`                         |
| Exercises      | `/api/exercises`                        |
| Assignments    | `/api/assignments`                      |
| Sessions       | `/api/sessions`                         |
| Progress       | `/api/progress`                         |
| Notes          | `/api/notes`                            |

The exact endpoint implementation may evolve during development, but any approved change must be reflected in this contract.

---

# 29. Core VELTRIX API Flow

The main application flow is:

```text
                    VELTRIX API
                        │
        ┌───────────────┼────────────────┐
        ↓               ↓                ↓
   Authentication    Exercises       Assignments
        │               │                │
        └───────────────┼────────────────┘
                        ↓
                  Patient Session
                        │
                        ↓
              Pain + Difficulty
                        │
                        ↓
                  POST /sessions
                        │
                        ↓
                 Progress / History
                        │
              ┌─────────┴─────────┐
              ↓                   ↓
           Patient            Therapist
```

The API layer therefore acts as the central communication contract connecting VELTRIX's React frontend with its Node.js/Express backend and MongoDB data layer.

```
```
