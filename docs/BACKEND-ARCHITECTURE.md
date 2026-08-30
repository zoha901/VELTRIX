# VELTRIX — Backend Architecture

## 1. Purpose

This document defines the backend architecture for the VELTRIX rehabilitation management platform. It outlines the responsibilities of the backend service, data flows, security mechanisms (authentication & authorization), role definitions, error handling protocols, API standards, HTTP status code usage, and planned backend folder structure.

---

## 2. Backend Responsibilities

The Node.js + Express backend serves as the core application engine and sole security boundary of VELTRIX. Its principal responsibilities include:

1. **REST API Endpoint Hosting**: Exposing structured HTTP endpoints for consumption by the React frontend.
2. **Authentication & Identity Management**: Securely processing user registration and login, password hashing via `bcrypt`, issuing JSON Web Tokens (JWT), and verifying active sessions.
3. **Role-Based Access Control (RBAC)**: Enforcing strict authorization boundaries for `PATIENT` and `THERAPIST` roles.
4. **Input Validation & Sanitization**: Validating incoming payloads for missing fields, correct data types, range bounds, and preventing injection attacks before hitting business logic or database layers.
5. **Business Logic Execution**: Orchestrating application operations (e.g., exercise program assignment validation, calculating exercise session completion metrics, managing therapist clinical notes).
6. **Database Abstraction & Persistence**: Managing persistent data operations with MongoDB via Mongoose ORM, maintaining schema constraints, relationships, and queries.
7. **Centralized Error Handling**: Catching runtime exceptions and returning standardized, secure, and user-friendly error responses without exposing sensitive internal stack traces or database configurations.
8. **Security Boundary Maintenance**: Ensuring frontend clients never interact directly with MongoDB or environment credentials.

---

## 3. Data Flow (Frontend → API → Backend → Database)

VELTRIX follows a strict unidirectional, layered architectural data flow. The React frontend is isolated from the data layer and must communicate exclusively via RESTful HTTP APIs.

```text
┌────────────────────────┐
│     React Frontend     │
└───────────┬────────────┘
            │ 1. HTTP Request (REST + JWT Header)
            ▼
┌────────────────────────┐
│     REST API Layer     │
└───────────┬────────────┘
            │ 2. Route Dispatch
            ▼
┌────────────────────────┐
│ Express Middleware     │ (Auth, RBAC, Validation)
└───────────┬────────────┘
            │ 3. Verified Request
            ▼
┌────────────────────────┐
│      Controllers       │ (HTTP Request / Response Handling)
└───────────┬────────────┘
            │ 4. Execute Operations
            ▼
┌────────────────────────┐
│   Services / Logic     │ (Business Rules & Workflow Execution)
└───────────┬────────────┘
            │ 5. Database Query / Command
            ▼
┌────────────────────────┐
│    Mongoose Models     │ (Schema & ODM Layer)
└───────────┬────────────┘
            │ 6. Query Driver
            ▼
┌────────────────────────┐
│     MongoDB Atlas      │ (Persistent Database)
└────────────────────────┘
```

### Detailed Flow Explanation:
1. **Frontend Request**: The React application sends an asynchronous HTTP request (using `fetch` or `axios`) containing optional JSON payloads and the `Authorization: Bearer <JWT_TOKEN>` header.
2. **Route Entry**: `server.js` forwards traffic to `src/app.js`, which routes the request to the matching router module in `src/routes/`.
3. **Middleware Pipeline**:
   - `authMiddleware`: Decodes and verifies the JWT.
   - `roleMiddleware`: Verifies if the authenticated user's role has permission to access the endpoint.
   - `validationMiddleware`: Validates request parameters, body fields, and data types.
4. **Controller Execution**: The controller receives validated input, calls the appropriate service method, and formats the HTTP response.
5. **Service Layer (Business Logic)**: Executes core business logic (e.g., verifying assignment validity, computing session metrics) and calls Mongoose models.
6. **Data Persistence**: Mongoose executes queries against MongoDB Atlas and returns document instances or plain objects.
7. **Response Flow**: The result travels back up through the service and controller, sending a structured JSON response back to the React frontend.

---

## 4. Authentication Flow

VELTRIX implements stateless, token-based authentication using **JSON Web Tokens (JWT)** and **bcrypt** password hashing.

### 4.1 Registration & Login Sequence

```text
User / Client               Express Backend                 MongoDB
   │                              │                            │
   │─── POST /api/auth/register ─►│                            │
   │    { email, pass, role }     │─── Check Email Exists ────►│
   │                              │◄── Returns Result ─────────│
   │                              │─── Hash Password (bcrypt)  │
   │                              │─── Save New User Doc ─────►│
   │◄── 201 Created (User Data) ──│                            │
   │                              │                            │
   │─── POST /api/auth/login ────►│                            │
   │    { email, password }       │─── Find User by Email ────►│
   │                              │◄── Returns User Doc ───────│
   │                              │─── Compare bcrypt Hash     │
   │                              │─── Generate JWT Token      │
   │◄── 200 OK (JWT + User Info) ─│                            │
```

### 4.2 Protected Request Verification
1. **Token Transmission**: For subsequent requests to protected endpoints, the frontend attaches the token in the `Authorization` header: `Authorization: Bearer <token>`.
2. **Token Extraction & Verification**: The `authMiddleware` extracts the token from the header and verifies its signature using `jwt.verify(token, JWT_SECRET)`.
3. **User Attachment**: Upon successful verification, the decoded payload (`userId`, `role`) is attached to the request object as `req.user`.
4. **Invalid Token Handling**: If the token is missing, expired, or tampered with, the backend immediately terminates the request with a `401 Unauthorized` response.

---

## 5. Authorization Flow

Authorization determines what an authenticated user (`req.user`) is allowed to perform. VELTRIX enforces **Role-Based Access Control (RBAC)** at the API layer.

### 5.1 RBAC Mechanism
- Authorization is executed via dedicated middleware (e.g., `authorize('THERAPIST')` or `authorize('PATIENT')`).
- Permissions are strictly evaluated on the server side using the verified JWT payload (`req.user.role`).
- Roles supplied directly in the HTTP request body or query parameters are ignored for permission checks.

### 5.2 Resource Ownership & Boundaries
Beyond role-level authorization, the backend enforces resource-level ownership:
- **Patients** can only query or submit data tied to their own `patientId` (e.g., `req.user.id == assignment.patientId`).
- **Therapists** can manage exercises and access data for patients under their care.

```text
Incoming Request ──► [ Auth Middleware ] ──► Valid Token? 
                                                │ Yes
                                                ▼
                                    [ RBAC Middleware ] ──► Role Permitted?
                                                               │ Yes
                                                               ▼
                                                    [ Resource Ownership Check ] ──► Access Granted
```

---

## 6. Patient Role

The `PATIENT` role represents users undergoing physical rehabilitation.

### Key Capabilities & Access:
- **Dashboard & Assignments**: View active exercise programs assigned specifically to them via `GET /api/dashboard/patient`.
- **Guided Mode Session Execution**: Access step-by-step instructions, exercise timers, set/repetition counters, and media guidance.
- **Camera Mode Beta Execution**: Access real-time movement feedback and repetition tracking via computer vision.
- **Session Data Submission**: Log completed exercise sessions, including self-reported pain levels (before & after exercise), difficulty ratings, and completed sets/reps.
- **Progress Tracking**: View personal exercise history, completion statistics, and pain logs over time.

### Explicit Restrictions:
- Cannot create, edit, or delete exercises in the library.
- Cannot assign exercises to themselves or other patients.
- Cannot access or view other patients' profiles, assignments, or session histories.
- Cannot write or view internal therapist notes.

---

## 7. Therapist Role

The `THERAPIST` role represents clinical professionals managing rehabilitation programs.

### Key Capabilities & Access:
- **Exercise Library Management**: Create, update, archive, and view master rehabilitation exercises (with instructions, video demonstrations, target body parts, and parameters).
- **Patient Assignment Creation**: Assign specific exercises to patients with targeted goals (`targetSets`, `targetReps`, `targetDurationSeconds`), frequency, and due dates via `POST /api/users/patients/:id/assignments`.
- **Patient Progress Monitoring**: Review patient session logs, completion rates, self-reported pain levels (before & after), and difficulty feedback.
- **Therapist Clinical Notes**: Create, edit, and view confidential notes regarding patient performance and treatment plans.

### Explicit Restrictions:
- Cannot tamper with or alter raw historical session data submitted by patients.
- Cannot access administrative backend configuration or bypass role-based security filters.

---

## 8. Error Handling Strategy

The backend uses a centralized error handling strategy in Express to guarantee consistent response structures and prevent information leakage.

### 8.1 Standardized Error Response Format
All error responses adhere to a consistent JSON structure:
```json
{
  "success": false,
  "message": "Human-readable summary of the error",
  "error": "ERROR_CODE_OR_CATEGORY",
  "errors": [
    {
      "field": "email",
      "message": "Must be a valid email address"
    }
  ]
}
```

### 8.2 Error Categories & Handling Rules
1. **Validation Errors**: Triggered by invalid input or Mongoose validation failures. Processed into readable field-level messages (`errors` array) with a `400 Bad Request` status.
2. **Authentication Errors**: Invalid credentials, missing headers, or expired tokens return `401 Unauthorized`.
3. **Authorization Errors**: Accessing resources outside role scope returns `403 Forbidden`.
4. **Resource Not Found**: Requests for non-existent routes or missing DB records return `404 Not Found`.
5. **Conflict Errors**: Attempting duplicate entries (e.g. registered email) returns `409 Conflict`.
6. **Unhandled Server Errors**: Caught by the global Express error handler. Returns `500 Internal Server Error` with a generic message in production to obscure stack traces, DB connection details, and internal secrets.

---

## 9. API Naming Conventions

VELTRIX REST APIs adhere to standardized URI naming and HTTP method conventions:

### 9.1 General Rules
- Base Path: `/api/<resource>`
- Nouns are pluralized (e.g., `/api/exercises`, `/api/sessions`).
- Lowercase kebab-case URI paths for multi-word paths (e.g., `/api/exercise-assignments`).
- JSON keys in request and response bodies use standard `camelCase`.

### 9.2 HTTP Method Mapping
| HTTP Method | Operation | Example Endpoint | Purpose |
| :--- | :--- | :--- | :--- |
| `GET` | Read | `/api/exercises` | Retrieve list of exercises |
| `GET` | Read Single | `/api/exercises/:id` | Retrieve specific exercise details |
| `POST` | Create | `/api/users/patients/:id/assignments` | Assign an exercise to a patient |
| `PUT` | Replace / Update | `/api/exercises/:id` | Update an existing exercise |
| `PATCH` | Partial Update | `/api/sessions/:id` | Update specific session fields |
| `DELETE` | Remove | `/api/exercises/:id` | Delete/archive an exercise |

---

## 10. HTTP Status Code Conventions

The backend explicitly uses standard HTTP status codes to signal request outcomes:

| Status Code | Category | Meaning & Context in VELTRIX |
| :--- | :--- | :--- |
| **`200 OK`** | Success | Request succeeded (GET, PUT, PATCH, DELETE operations). |
| **`201 Created`** | Success | New resource successfully created (e.g., registration, assignment subdocument, session submission). |
| **`400 Bad Request`** | Client Error | Invalid input payload, missing required fields, or validation failure. |
| **`401 Unauthorized`** | Client Error | Authentication required; token missing, invalid, or expired. |
| **`403 Forbidden`** | Client Error | User is authenticated but lacks required role or ownership permissions. |
| **`404 Not Found`** | Client Error | Requested resource (user, exercise, session) does not exist. |
| **`409 Conflict`** | Client Error | Resource creation conflict (e.g., duplicate email address during registration). |
| **`500 Internal Server Error`** | Server Error | Unhandled server exception or database failure. |

---

## 11. Planned Folder Structure

The planned backend codebase will strictly follow a modular, layered structure corresponding to the **three core top-level database entities** (`users`, `exercises`, `exercise_sessions`), separating route definitions, request handlers, business logic, data models, and utilities.

```text
backend/
├── src/
│   ├── config/
│   │   ├── db.js             # MongoDB connection configuration and lifecycle management
│   │   └── env.js            # Centralized environment variable validation and loading
│   ├── controllers/
│   │   ├── authController.js       # Authentication handlers (register, login, me)
│   │   ├── userController.js       # User profile, patient list, embedded assignment & note handlers
│   │   ├── exerciseController.js   # Exercise catalog CRUD handlers
│   │   ├── sessionController.js    # Rehabilitation session logging & retrieval handlers
│   │   └── dashboardController.js  # Patient and therapist aggregated dashboard metrics handlers
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT validation & user context attachment
│   │   ├── roleMiddleware.js       # Role-based access control checks (patient / therapist)
│   │   ├── validationMiddleware.js # Input sanitization and payload schema validation
│   │   └── errorMiddleware.js      # Global error handler and 404 handler
│   ├── models/
│   │   ├── User.js                 # User schema (Credentials, Profile, assignedExercises[], therapistNotes[])
│   │   ├── Exercise.js             # Master exercise library schema
│   │   └── Session.js              # Rehabilitation session schema (pain, difficulty, sessionResults)
│   ├── routes/
│   │   ├── authRoutes.js           # Endpoint definitions for /api/auth
│   │   ├── userRoutes.js           # Endpoint definitions for /api/users (profiles, patient subdocuments)
│   │   ├── exerciseRoutes.js       # Endpoint definitions for /api/exercises
│   │   ├── sessionRoutes.js        # Endpoint definitions for /api/sessions
│   │   └── dashboardRoutes.js      # Endpoint definitions for /api/dashboard
│   ├── services/
│   │   ├── authService.js          # Authentication business logic & password hashing
│   │   ├── exerciseService.js      # Exercise library operations logic
│   │   ├── assignmentService.js    # Assignment processing & validation logic
│   │   ├── sessionService.js       # Session completion & pain tracking logic
│   │   └── analyticsService.js     # Patient progress aggregation & statistics logic
│   ├── utils/
│   │   ├── generateToken.js        # JWT signing utility
│   │   └── responseFormatter.js    # Standardized API response formatters
│   └── app.js                      # Express application setup, middleware mounting, and route mounting
├── server.js                       # HTTP server entry point (starts server and connects to database)
└── package.json                    # Project dependencies and script declarations
```

### Responsibility of Sub-Directories:
- **`config/`**: Holds database connection scripts and environment configuration management.
- **`controllers/`**: Handles HTTP request parsing, status code selection, and sending formatted responses.
- **`middleware/`**: Intercepts requests for authentication, authorization, input validation, and global error catch blocks.
- **`models/`**: Defines Mongoose schemas, data types, indexes, and document methods for MongoDB.
- **`routes/`**: Maps REST endpoint URIs and HTTP methods to their respective middleware and controller methods.
- **`services/`**: Encapsulates pure business logic and database interactions, keeping controllers lightweight.
- **`utils/`**: Reusable helper functions (token generation, hashing, response builders).
- **`app.js`**: Configures the Express instance, CORS, body parsers, routes, and global error handling.
- **`server.js`**: Bootstraps the application by initiating database connections and listening on the designated PORT.
