````markdown
# VELTRIX — System Architecture

## 1. Purpose

This document defines the technical architecture of the VELTRIX rehabilitation management platform.

It explains how the frontend, backend, API, database, authentication system, and Camera Mode Beta fit together and communicate.

The architecture provides a shared technical reference for all team members and AI-assisted development tools.

---

## 2. Architecture Overview

VELTRIX follows a layered full-stack architecture:

```text
┌─────────────────────────────────────────────┐
│                 VELTRIX                     │
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │          React Frontend               │  │
│  │                                       │  │
│  │ Patient UI | Therapist UI | Camera UI │  │
│  └───────────────────┬───────────────────┘  │
│                      │                       │
│                  REST API                    │
│                      │                       │
│  ┌───────────────────▼───────────────────┐  │
│  │       Node.js + Express Backend       │  │
│  │                                       │  │
│  │ Routes → Controllers → Business Logic │  │
│  │              → Validation             │  │
│  │              → Authentication         │  │
│  └───────────────────┬───────────────────┘  │
│                      │                       │
│                  Database                    │
│                      │                       │
│  ┌───────────────────▼───────────────────┐  │
│  │              MongoDB                  │  │
│  │                                       │  │
│  │ Users | Exercises | Assignments       │  │
│  │ Sessions | Notes | Related Data       │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
````

The main rule is:

```text
React Frontend
      ↓
REST API
      ↓
Node.js + Express Backend
      ↓
MongoDB
```

The frontend must not directly access MongoDB.

---

## 3. Technology Stack

| Layer             | Technology                |
| ----------------- | ------------------------- |
| Frontend          | React                     |
| Backend Runtime   | Node.js                   |
| Backend Framework | Express                   |
| API Style         | REST                      |
| Database          | MongoDB                   |
| Hosted Database   | MongoDB Atlas             |
| Authentication    | JWT                       |
| Password Security | Password Hashing          |
| API Testing       | Postman                   |
| Computer Vision   | MediaPipe Pose Landmarker |
| Version Control   | Git + GitHub              |

---

## 4. Architectural Layers

VELTRIX is organized into the following major layers:

### 4.1 Presentation Layer

The React frontend is responsible for:

* User interface.
* Navigation.
* Forms.
* Dashboards.
* Exercise screens.
* Guided Mode.
* Camera Mode interface.
* Timers.
* Displaying session results.
* Displaying progress and history.
* Sending API requests.
* Handling API responses.

The frontend should not contain database credentials or directly communicate with MongoDB.

---

### 4.2 API Layer

The API provides the communication boundary between the frontend and backend.

Example:

```text
GET /api/exercises
POST /api/exercises
GET /api/sessions
POST /api/sessions
```

The API layer is responsible for receiving requests and returning structured responses.

API details are defined in:

```text
docs/API-CONTRACT.md
```

---

### 4.3 Backend Layer

The Node.js + Express backend is responsible for:

* API routes.
* Request handling.
* Authentication.
* Authorization.
* Validation.
* Business logic.
* Database operations.
* Error handling.
* Security rules.

The backend is the main authority for application rules.

---

### 4.4 Data Layer

MongoDB stores persistent application data.

MongoDB Atlas provides the hosted database environment.

The backend communicates with MongoDB.

The database structure is defined in:

```text
docs/DATABASE-CONTRACT.md
```

---

## 5. Frontend Architecture

The React frontend should be organized into clear responsibilities.

Conceptually:

```text
React Application
│
├── Pages
│   ├── Authentication
│   ├── Patient
│   └── Therapist
│
├── Components
│   ├── Navigation
│   ├── Exercise
│   ├── Session
│   └── Common UI
│
├── Services / API
│   └── Backend communication
│
├── State Management
│
└── Utilities
```

The exact folder structure may evolve during implementation, but responsibilities should remain clearly separated.

The frontend should primarily handle presentation and user interaction.

Business rules that require security or trusted data must be enforced by the backend.

---

## 6. Backend Architecture

The backend should separate responsibilities rather than placing all logic in a single file.

A conceptual structure is:

```text
Backend
│
├── Routes
│       ↓
├── Controllers
│       ↓
├── Business Logic / Services
│       ↓
├── Models / Database Layer
│       ↓
└── MongoDB
```

### Routes

Routes define API endpoints.

Example:

```text
POST /api/auth/login
GET /api/exercises
POST /api/sessions
```

### Controllers

Controllers receive requests and coordinate the appropriate operation.

### Services / Business Logic

Business logic contains application rules and operations.

### Models / Database Layer

Models define how application data is represented and stored in MongoDB.

The exact implementation structure may be refined during backend development.

---

## 7. Database Architecture

The main data areas are:

```text
MongoDB
│
├── Users
├── Exercises
├── Exercise Assignments
├── Exercise Sessions
└── Therapist Notes
```

Relationships include:

```text
Patient
   │
   ├── receives → Exercise Assignment
   │                    │
   │                    └── Exercise
   │
   └── completes → Exercise Session
                        │
                        └── Exercise

Therapist
   │
   ├── manages → Exercise
   ├── creates → Exercise Assignment
   └── creates → Therapist Note
```

The detailed data structure is defined in `DATABASE-CONTRACT.md`.

---

## 8. Authentication Architecture

VELTRIX uses JWT-based authentication.

The authentication flow is:

```text
User
 ↓
Register / Login
 ↓
Backend
 ↓
Verify credentials
 ↓
Generate JWT
 ↓
Frontend receives token
 ↓
Frontend sends token with protected requests
 ↓
Backend validates token
 ↓
Backend identifies user
 ↓
Backend checks permissions
 ↓
Request allowed / rejected
```

Protected requests should use:

```http
Authorization: Bearer <JWT_TOKEN>
```

Passwords must be securely hashed and must never be stored or returned as plaintext.

---

## 9. Authorization Architecture

Authentication answers:

> "Who are you?"

Authorization answers:

> "What are you allowed to do?"

VELTRIX has two main roles following the official shared convention:

```text
PATIENT
THERAPIST
```

The backend must enforce role-based access.

### Patient

Patients can access their own relevant rehabilitation information and perform their own exercise sessions.

Patients must not:

* Manage exercises.
* Access another patient's private information.
* Modify another patient's sessions.
* Use therapist-only functionality.

### Therapist

Therapists can:

* Manage exercises.
* Assign exercises.
* View authorized patient information.
* Monitor relevant patient sessions.
* View progress and pain history.
* Create therapist notes.

The backend must never rely only on role information supplied by the frontend.

---

## 10. Patient Architecture Flow

The main patient workflow is:

```text
Patient Login
     ↓
Patient Dashboard
     ↓
View Assigned Exercises
     ↓
Select Exercise
     ↓
Guided Mode
     ↓
Perform Exercise
     ↓
Record Session Information
     ↓
Pain / Difficulty
     ↓
Complete Session
     ↓
Session Saved
     ↓
View History / Progress
```

The frontend provides the interface.

The backend validates and stores the relevant information.

---

## 11. Therapist Architecture Flow

The main therapist workflow is:

```text
Therapist Login
       ↓
Therapist Dashboard
       ↓
Manage Exercises
       ↓
Select Patient
       ↓
Assign Exercise
       ↓
Monitor Patient Activity
       ↓
View Sessions
       ↓
View Progress / Pain History
       ↓
Add Therapist Notes
```

Access to patient information must be controlled by backend authorization.

---

## 12. Exercise Architecture

Exercises are managed through the backend API and stored in MongoDB.

The general flow is:

```text
Therapist
    ↓
React Frontend
    ↓
POST /api/exercises
    ↓
Express Backend
    ↓
Validation + Authorization
    ↓
MongoDB
    ↓
Exercise Created
    ↓
Response
    ↓
React Frontend
```

Exercises may contain:

* Name.
* Description.
* Target body part.
* Difficulty.
* Sets.
* Repetitions.
* Duration.
* Instructions.
* Demonstration media.
* Safety instructions.

---

## 13. Exercise Assignment Architecture

Exercise assignments connect patients and exercises.

The flow is:

```text
Therapist
    ↓
Select Patient
    ↓
Select Exercise
    ↓
Set Targets / Due Date
    ↓
Backend API
    ↓
MongoDB
    ↓
Assignment Stored
    ↓
Patient Dashboard
    ↓
Assigned Exercise Available
```

The backend must ensure that the assignment references valid resources and that the therapist is authorized to create it.

---

## 14. Exercise Session Architecture

An exercise session represents a patient's rehabilitation activity.

The main flow is:

```text
Patient
    ↓
Select Assigned Exercise
    ↓
Start Session
    ↓
Guided Mode
    ↓
Perform Exercise
    ↓
Record Relevant Results
    ↓
Pain Before / After
    ↓
Difficulty
    ↓
Complete Session
    ↓
POST /api/sessions
    ↓
Backend Validation
    ↓
MongoDB
    ↓
Session Saved
    ↓
Progress / History Updated
```

Session information can support:

* Completion information.
* Pain before exercise.
* Pain after exercise.
* Difficulty.
* Sets/repetitions completed.
* Other relevant session results.

---

## 15. Guided Mode Architecture

Guided Mode is the required core exercise mode.

It should work without camera access.

The architecture is:

```text
Exercise Data
     ↓
React Guided Mode
     ↓
Instructions
     ↓
Timer / Sets / Repetitions
     ↓
Patient completes exercise
     ↓
Pain + Difficulty
     ↓
Session API
     ↓
Backend
     ↓
MongoDB
```

Guided Mode should remain usable even if Camera Mode Beta is unavailable.

---

## 16. Camera Mode Beta Architecture

Camera Mode Beta is an optional enhancement.

The conceptual flow is:

```text
Patient
   ↓
Camera Access
   ↓
MediaPipe Pose Landmarker
   ↓
Pose / Movement Information
   ↓
Basic Movement Analysis
   ↓
Feedback / Repetition Support
   ↓
Exercise Session
```

Camera Mode may support:

* Pose estimation.
* Basic movement feedback.
* Repetition counting where supported.
* Basic movement/range guidance.

Raw camera video does not need to be stored in the database.

Camera Mode must not become a mandatory dependency for the core VELTRIX application.

If camera access or camera processing is unavailable, the patient should still be able to use Guided Mode.

---

## 17. Frontend ↔ Backend Communication

The frontend communicates with the backend through REST APIs.

Example:

```text
React
  │
  │ GET /api/exercises
  ↓
Express
  │
  │ Query database
  ↓
MongoDB
  │
  │ Exercise data
  ↓
Express
  │
  │ JSON response
  ↓
React
```

The frontend must follow the request and response structures defined in:

```text
docs/API-CONTRACT.md
```

---

## 18. Backend ↔ Database Communication

The backend is responsible for database communication.

The general flow is:

```text
Frontend
   ↓
API Request
   ↓
Backend
   ↓
Authentication
   ↓
Authorization
   ↓
Validation
   ↓
Business Logic
   ↓
Database Operation
   ↓
MongoDB
   ↓
Backend Response
   ↓
Frontend
```

The frontend must never bypass these controls to access MongoDB directly.

---

## 19. Error Handling Architecture

Errors should be handled consistently across the application.

Typical API errors include:

```text
400 → Bad Request
401 → Unauthorized
403 → Forbidden
404 → Not Found
409 → Conflict
500 → Server Error
```

The backend should return structured error responses.

Sensitive internal implementation details, database credentials, stack traces, and secrets must not be exposed to users.

---

## 20. Security Boundaries

The following boundaries must be maintained:

```text
Frontend
   │
   │ Public client application
   ↓
Backend
   │
   │ Authentication + Authorization
   │ Validation + Business Rules
   ↓
Database
   │
   │ Persistent application data
   ↓
MongoDB Atlas
```

Important security principles:

* MongoDB credentials must never be placed in frontend code.
* Passwords must be hashed.
* JWTs must be validated by the backend.
* Protected endpoints require authentication.
* Role permissions must be enforced by the backend.
* Patient information must only be accessible to authorized users.
* Secrets must be stored through appropriate environment configuration.
* Backend validation must not depend solely on frontend validation.

---

## 21. Project Responsibility Boundaries

The four-person team should work on separate responsibilities while following the shared architecture and contracts.

The exact division of implementation responsibilities is defined by the project phase plans.

Regardless of individual responsibility:

* All members must follow the shared contracts.
* Frontend code must follow the API contract.
* Backend code must follow the database and API contracts.
* Changes affecting shared contracts must be communicated to the team.
* Git branches should be used to isolate individual work.
* Changes should be reviewed and merged into the shared project carefully.

---

## 22. Documentation Dependencies

The technical documents are connected:

```text
BRD.md
   ↓
PROJECT-SCOPE.md
   ↓
REQUIREMENTS.md
   ↓
DATABASE-CONTRACT.md
   ↓
API-CONTRACT.md
   ↓
ARCHITECTURE.md
   ↓
Implementation
```

The documents serve different purposes:

### BRD

Defines the business/product understanding of VELTRIX.

### PROJECT-SCOPE

Defines what is inside and outside the project.

### REQUIREMENTS

Defines what the system must do.

### DATABASE-CONTRACT

Defines the agreed data structures and relationships.

### API-CONTRACT

Defines how frontend and backend communicate.

### ARCHITECTURE

Defines how all technical components fit together.

---

## 23. Development Principles

VELTRIX development should follow these principles:

### Separation of Responsibilities

Frontend, backend, database, and computer-vision responsibilities should remain clearly separated.

### Backend as Authority

Security, authorization, validation, and important business rules must be enforced by the backend.

### Contract-First Collaboration

Team members should use the shared technical contracts when implementing features.

### Reusable Components

Common frontend and backend functionality should be reused where appropriate rather than unnecessarily duplicated.

### Secure by Default

Sensitive information must be protected throughout the application.

### MVP First

Core VELTRIX functionality should remain stable before optional advanced functionality is prioritized.

### Camera Mode is Optional

Camera Mode Beta must not prevent the core rehabilitation workflow from functioning.

---

## 24. Architecture Constraints

The following constraints are important:

1. React is used for the frontend.
2. Node.js + Express is used for the backend.
3. MongoDB/MongoDB Atlas is used for persistent data.
4. REST APIs are used for frontend-backend communication.
5. The frontend must not directly access MongoDB.
6. JWT authentication is used for protected API access.
7. Passwords must be securely hashed.
8. Backend authorization must enforce user roles.
9. Patient data must be protected from unauthorized access.
10. Guided Mode is part of the core workflow.
11. Camera Mode Beta is optional.
12. Raw camera video does not need to be stored.
13. API changes must remain consistent with the API contract.
14. Database changes must remain consistent with the database contract.
15. Shared contract changes should be communicated to affected team members.
16. Security-sensitive values must not be committed to GitHub.
17. The architecture may evolve during development, but significant changes should be documented and agreed upon.

---

## 25. High-Level System Diagram

```text
                         VELTRIX
                            │
             ┌──────────────┴──────────────┐
             │                             │
             ↓                             ↓
      PATIENT FRONTEND              THERAPIST FRONTEND
             │                             │
             └──────────────┬──────────────┘
                            ↓
                       REST API
                            ↓
                 NODE.JS + EXPRESS
                            │
              ┌─────────────┼─────────────┐
              │             │             │
              ↓             ↓             ↓
        Authentication   Business      Validation
                         Logic
              │             │             │
              └─────────────┼─────────────┘
                            ↓
                         MongoDB
                            │
              ┌─────────────┼─────────────┐
              ↓             ↓             ↓
            Users       Exercises       Sessions
                            │
                            ↓
                      Assignments
                            │
                            ↓
                    Progress / History


              CAMERA MODE BETA
                     │
                     ↓
             Camera / MediaPipe
                     │
                     ↓
              Movement Analysis
                     │
                     ↓
               Session Workflow
```

---

## 26. Final Architecture Principle

VELTRIX should be understood as one connected system:

```text
                    USER
                     ↓
               React Frontend
                     ↓
                  REST API
                     ↓
             Express Backend
                     ↓
        Authentication / Authorization
                     ↓
              Business Logic
                     ↓
                  MongoDB
                     ↓
             Stored Application Data
```

Camera Mode Beta operates as an optional capability within the exercise workflow and must not replace the core Guided Mode.

The architecture should remain understandable, maintainable, secure, and consistent with the project's requirements and technical contracts.

```
```
