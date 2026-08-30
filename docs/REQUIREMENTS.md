# VELTRIX — System Requirements

## 1. Purpose

This document defines the main functional and technical requirements of the VELTRIX rehabilitation management platform.

## 2. User Roles

VELTRIX has two primary roles:

- PATIENT
- THERAPIST

Each role must have appropriate access and permissions.

## 3. Authentication

The system shall provide:

- User registration and login.
- JWT-based authentication.
- Password hashing (bcrypt with min 10 salt rounds) and minimum 8-character password length.
- Role-based access control.

## 4. Patient Requirements

Patients shall be able to:

- Access their dashboard.
- View assigned exercises.
- View exercise details.
- Complete rehabilitation sessions.
- Use Guided Mode.
- Use Camera Mode Beta where supported.
- Track sets and repetitions where applicable.
- Use exercise and rest timers.
- Record pain before and after exercise.
- Rate exercise difficulty.
- View session summaries.
- View progress and exercise history.

## 5. Therapist Requirements

Therapists shall be able to:

- Access their dashboard.
- View patients and patient details.
- Create, view, update, and delete exercises.
- Assign exercises to patients.
- View completed sessions.
- Monitor patient activity and progress.
- View pain history.
- Add therapist notes.

## 6. Exercise Requirements

Exercises may contain:

- Name and description.
- Target body part.
- Difficulty.
- Sets and repetitions.
- Duration.
- Instructions.
- Demonstration media.
- Safety instructions.

## 7. Exercise Assignment

Therapists shall be able to assign exercises to patients.

An assignment may include:

- Patient.
- Exercise.
- Targets.
- Due date.

## 8. Guided Mode

Guided Mode is the required core exercise mode.

It shall provide:

- Exercise demonstrations and instructions.
- Set and repetition tracking.
- Exercise and rest timers where applicable.
- Pain recording before and after exercise.
- Difficulty rating.
- Session completion and summary.

Guided Mode must work without camera access.

## 9. Camera Mode Beta

Camera Mode Beta is an optional feature for selected exercises.

It may provide:

- Pose estimation using MediaPipe Pose Landmarker.
- Basic movement feedback.
- Repetition counting where supported.
- Basic movement/range guidance.

Camera Mode Beta must not be required for the core application.

Raw camera video is not required to be stored.

## 10. Exercise Sessions & Progress

The system shall store completed exercise sessions, including relevant information such as:

- Patient and exercise.
- Completion information.
- Total elapsed time (`durationSeconds`, representing total time from session start to completion including rest intervals).
- Pain before and after exercise.
- Difficulty rating.
- Session timing/results.

Patients shall be able to view their history and progress, while therapists shall be able to monitor relevant patient information.

## 11. CRUD Requirements

The main CRUD areas are:

- User Management.
- Exercise Management.
- Exercise Session Management.

Exercise Management must support Create, Read, Update, and Delete operations.

## 12. API Requirements

The backend shall provide REST APIs for:

- Authentication.
- Users.
- Exercises.
- Exercise assignments.
- Exercise sessions.
- Progress and pain information.
- Therapist notes.

APIs shall handle validation, authentication, authorization, business logic, and database operations.

Postman shall be used for API testing.

## 13. Database Requirements

VELTRIX shall use:

- MongoDB for application data.
- MongoDB Atlas for the hosted database.

The database shall store users, exercises, assignments, sessions, progress-related information, pain records, and therapist notes.

## 14. Technology Requirements

| Area | Technology |
|---|---|
| Frontend | React |
| Backend | Node.js + Express |
| Database | MongoDB |
| Authentication | JWT + password hashing |
| API | REST |
| API Testing | Postman |
| Computer Vision | MediaPipe Pose Landmarker |
| Version Control | Git + GitHub |

## 15. Security Requirements

The system shall:

- Protect authenticated routes.
- Use password hashing.
- Use JWT authentication.
- Enforce role-based permissions.
- Protect patient-specific information.
- Store sensitive configuration through environment variables where appropriate.

## 16. Non-Functional Requirements

The application should provide:

- Clear and simple user workflows.
- Reliable core functionality.
- Clear separation of frontend, backend, database, and documentation.
- Maintainable project structure.
- Ability to support additional users, exercises, and features.

## 17. Testing & Deployment

The project shall include testing of:

- Authentication and authorization.
- CRUD operations.
- Exercise assignments and sessions.
- Patient and therapist workflows.
- Frontend-backend integration.
- Camera Mode Beta where implemented.

The completed application shall be deployable with:

- React frontend.
- Node.js/Express backend.
- MongoDB Atlas database.
- Required production environment configuration.

## 18. MVP Boundary

The core MVP includes:

- Authentication.
- Patient and therapist functionality.
- Exercise management and assignment.
- Guided Mode.
- Exercise sessions.
- Pain and difficulty tracking.
- Session summaries.
- Progress/history.
- REST APIs.
- MongoDB.
- Testing.
- Frontend-backend integration.
- Deployment.

Camera Mode Beta is an optional enhancement and is not required for MVP completion.