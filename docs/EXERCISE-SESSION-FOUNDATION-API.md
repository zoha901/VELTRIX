# VELTRIX — Exercise & Exercise Session API Foundation Documentation

This document specifies the exact API foundation endpoints created for **Phase 2 (Exercise & Exercise Session Foundation)** and **Phase 3 (Authentication Compatibility)**.

---

## 1. Exercise Catalog API Endpoints (`/api/exercises`)

### 1.1 List Exercise Catalog
- **HTTP Method**: `GET`
- **URL**: `/api/exercises`
- **Authentication**: Protected (`Authorization: Bearer <JWT_TOKEN>`)
- **Allowed Roles**: `PATIENT`, `THERAPIST`
- **Query Parameters**:
  - `targetBodyPart` (optional string, e.g. `Knee`)
  - `difficulty` (optional string: `beginner`, `intermediate`, `advanced`)
- **Request Body**: None
- **Successful Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "64d2f001b3c4d5e6f7a8b9e0",
        "name": "Seated Knee Extension",
        "description": "Strengthens quadriceps muscles.",
        "targetBodyPart": "Knee",
        "difficulty": "beginner",
        "defaultSets": 3,
        "defaultReps": 10,
        "defaultDurationSeconds": null,
        "instructions": [
          "Sit upright in a chair with back supported.",
          "Slowly extend your leg straight out parallel to the floor."
        ],
        "demonstrationMedia": "https://assets.veltrix.app/exercises/knee-extension.mp4",
        "safetyInstructions": "Stop immediately if sharp joint pain occurs.",
        "createdBy": "64d2f000b3c4d5e6f7a8b9d0",
        "createdAt": "2026-08-01T10:00:00.000Z",
        "updatedAt": "2026-08-01T10:00:00.000Z"
      }
    ]
  }
  ```
- **Validation Error Response**: N/A (query filters sanitized automatically)
- **Not-Found Response**: N/A
- **Server Error Response (`500 Internal Server Error`)**:
  ```json
  {
    "success": false,
    "message": "Failed to retrieve exercise catalog.",
    "error": "SERVER_ERROR"
  }
  ```

---

### 1.2 Get Exercise Details by ID
- **HTTP Method**: `GET`
- **URL**: `/api/exercises/:id`
- **Authentication**: Protected
- **Allowed Roles**: `PATIENT`, `THERAPIST`
- **Path Parameters**: `:id` (Exercise ObjectId)
- **Request Body**: None
- **Successful Response (`200 OK`)**:
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
      "instructions": [
        "Sit upright in a chair with back supported.",
        "Slowly extend leg straight out."
      ],
      "demonstrationMedia": "https://assets.veltrix.app/exercises/knee-extension.mp4",
      "safetyInstructions": "Stop if sharp pain occurs.",
      "createdBy": "64d2f000b3c4d5e6f7a8b9d0",
      "createdAt": "2026-08-01T10:00:00.000Z",
      "updatedAt": "2026-08-01T10:00:00.000Z"
    }
  }
  ```
- **Not-Found Response (`404 Not Found`)**:
  ```json
  {
    "success": false,
    "message": "Exercise not found.",
    "error": "NOT_FOUND"
  }
  ```
- **Server Error Response (`500 Internal Server Error`)**:
  ```json
  {
    "success": false,
    "message": "Failed to retrieve exercise details.",
    "error": "SERVER_ERROR"
  }
  ```

---

### 1.3 Create Exercise Entry (Therapist Only)
- **HTTP Method**: `POST`
- **URL**: `/api/exercises`
- **Authentication**: Protected
- **Allowed Roles**: `THERAPIST`
- **Request Body Example**:
  ```json
  {
    "name": "Standing Ankle Plantarflexion",
    "description": "Calf raise exercise to improve ankle stability.",
    "targetBodyPart": "Ankle",
    "difficulty": "beginner",
    "defaultSets": 3,
    "defaultReps": 15,
    "instructions": [
      "Stand upright holding onto a chair for balance.",
      "Slowly raise your heels up off the floor."
    ]
  }
  ```
- **Successful Response (`201 Created`)**:
  ```json
  {
    "success": true,
    "message": "Exercise created successfully",
    "data": {
      "id": "64d2f003b3c4d5e6f7a8b9e2",
      "name": "Standing Ankle Plantarflexion",
      "description": "Calf raise exercise to improve ankle stability.",
      "targetBodyPart": "Ankle",
      "difficulty": "beginner",
      "defaultSets": 3,
      "defaultReps": 15,
      "defaultDurationSeconds": null,
      "instructions": [
        "Stand upright holding onto a chair for balance.",
        "Slowly raise your heels up off the floor."
      ],
      "demonstrationMedia": null,
      "safetyInstructions": null,
      "createdBy": "64d2f000b3c4d5e6f7a8b9d0",
      "createdAt": "2026-08-30T15:30:00.000Z",
      "updatedAt": "2026-08-30T15:30:00.000Z"
    }
  }
  ```
- **Validation Error Response (`400 Bad Request`)**:
  ```json
  {
    "success": false,
    "message": "Difficulty must be one of: beginner, intermediate, advanced.",
    "error": "BAD_REQUEST"
  }
  ```
- **Not-Found Response**: N/A
- **Server Error Response (`500 Internal Server Error`)**:
  ```json
  {
    "success": false,
    "message": "Failed to create exercise entry.",
    "error": "SERVER_ERROR"
  }
  ```

---

### 1.4 Update Exercise Entry (Therapist Only)
- **HTTP Method**: `PUT`
- **URL**: `/api/exercises/:id`
- **Authentication**: Protected
- **Allowed Roles**: `THERAPIST`
- **Path Parameters**: `:id` (Exercise ID)
- **Request Body Example**: Same schema as `POST /api/exercises`.
- **Successful Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Exercise updated successfully",
    "data": {
      "id": "64d2f003b3c4d5e6f7a8b9e2",
      "name": "Standing Ankle Plantarflexion",
      "targetBodyPart": "Ankle",
      "difficulty": "intermediate"
    }
  }
  ```
- **Validation Error Response (`400 Bad Request`)**:
  ```json
  {
    "success": false,
    "message": "Instructions must be a non-empty array of step-by-step strings.",
    "error": "BAD_REQUEST"
  }
  ```
- **Not-Found Response (`404 Not Found`)**:
  ```json
  {
    "success": false,
    "message": "Exercise not found.",
    "error": "NOT_FOUND"
  }
  ```

---

### 1.5 Delete Exercise Entry (Therapist Only)
- **HTTP Method**: `DELETE`
- **URL**: `/api/exercises/:id`
- **Authentication**: Protected
- **Allowed Roles**: `THERAPIST`
- **Path Parameters**: `:id` (Exercise ID)
- **Request Body**: None
- **Successful Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Exercise deleted successfully"
  }
  ```
- **Not-Found Response (`404 Not Found`)**:
  ```json
  {
    "success": false,
    "message": "Exercise not found.",
    "error": "NOT_FOUND"
  }
  ```

---

## 2. Exercise Sessions API Endpoints (`/api/sessions`)

### 2.1 Log Completed Exercise Session (Patient Only)
- **HTTP Method**: `POST`
- **URL**: `/api/sessions`
- **Authentication**: Protected
- **Allowed Roles**: `PATIENT`
- **Request Body Example**:
  ```json
  {
    "exerciseId": "64d2f001b3c4d5e6f7a8b9e0",
    "assignmentId": "64d2f2b1b3c4d5e6f7a8b9c1",
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
- **Successful Response (`201 Created`)**:
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
- **Validation Error Response (`400 Bad Request`)**:
  ```json
  {
    "success": false,
    "message": "painBefore is required and must be a number between 0 and 10.",
    "error": "BAD_REQUEST"
  }
  ```
- **Not-Found Response (`404 Not Found`)**:
  ```json
  {
    "success": false,
    "message": "Referenced exercise not found.",
    "error": "NOT_FOUND"
  }
  ```

---

### 2.2 Get Exercise Sessions History
- **HTTP Method**: `GET`
- **URL**: `/api/sessions`
- **Authentication**: Protected
- **Allowed Roles**: `PATIENT`, `THERAPIST`
- **Query Parameters**:
  - `limit` (optional number)
  - `startDate` (optional ISO Date string)
- **Request Body**: None
- **Successful Response (`200 OK`)**:
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
- **Server Error Response (`500 Internal Server Error`)**:
  ```json
  {
    "success": false,
    "message": "Failed to retrieve session history.",
    "error": "SERVER_ERROR"
  }
  ```

---

### 2.3 Get Session Details by ID
- **HTTP Method**: `GET`
- **URL**: `/api/sessions/:id`
- **Authentication**: Protected
- **Allowed Roles**: `PATIENT`, `THERAPIST`
- **Path Parameters**: `:id` (Session ID)
- **Request Body**: None
- **Successful Response (`200 OK`)**:
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
      "perceivedDifficulty": "moderate"
    }
  }
  ```
- **Not-Found Response (`404 Not Found`)**:
  ```json
  {
    "success": false,
    "message": "Session record not found.",
    "error": "NOT_FOUND"
  }
  ```

---

### 2.4 Get Specific Patient Session History (Therapist Only)
- **HTTP Method**: `GET`
- **URL**: `/api/sessions/patient/:patientId`
- **Authentication**: Protected
- **Allowed Roles**: `THERAPIST`
- **Path Parameters**: `:patientId` (Patient User ID)
- **Request Body**: None
- **Successful Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "64d2f5e3b3c4d5e6f7a8b9f0",
        "patientId": "64d2f1a9b3c4d5e6f7a8b9c0",
        "exerciseId": "64d2f001b3c4d5e6f7a8b9e0",
        "completedAt": "2026-08-30T11:15:00.000Z",
        "setsCompleted": 3
      }
    ]
  }
  ```
- **Not-Found Response (`404 Not Found`)**:
  ```json
  {
    "success": false,
    "message": "Patient ID not found.",
    "error": "NOT_FOUND"
  }
  ```
