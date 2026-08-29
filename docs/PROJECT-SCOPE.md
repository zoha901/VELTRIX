# VELTRIX — Project Scope

## 1. Purpose

This document defines the scope of the VELTRIX project. It establishes the features, capabilities, and boundaries of the application so that all four team members work toward the same defined product.

## 2. In-Scope Features

### 2.1 Authentication

VELTRIX includes:

- User registration.
- User login.
- JWT-based authentication.
- Password hashing.
- Role-based access for patients and therapists.

### 2.2 Patient Features

Patients can:

- Register and log in.
- Access their patient dashboard.
- View assigned rehabilitation exercises.
- View exercise details.
- Complete rehabilitation sessions.
- Use Guided Mode.
- Use Camera Mode Beta where supported.
- Track sets and repetitions where applicable.
- Use exercise and rest timers.
- Record pain before an exercise.
- Record pain after an exercise.
- Rate exercise difficulty.
- View session summaries.
- View rehabilitation progress and history.

### 2.3 Therapist Features

Therapists can:

- Log in.
- Access the therapist dashboard.
- View patients.
- View patient details.
- Create exercises.
- View exercises.
- Update exercises.
- Delete exercises.
- Assign exercises to patients.
- View completed exercise sessions.
- Monitor patient exercise activity.
- View patient progress.
- View pain history.
- Add therapist notes.

### 2.4 Exercise Management

Exercise records may contain:

- Exercise name.
- Description.
- Target body part.
- Difficulty.
- Sets.
- Repetitions.
- Duration.
- Instructions.
- Demonstration media.
- Safety instructions.

### 2.5 Exercise Assignment

Therapists can assign exercises to patients.

Assignments may contain:

- Patient.
- Exercise.
- Targets.
- Due date.

### 2.6 Guided Mode

Guided Mode is the required core exercise mode.

It includes:

- Exercise demonstrations.
- Exercise instructions.
- Set tracking.
- Repetition tracking where applicable.
- Exercise timers where applicable.
- Rest timers.
- Pain recording before exercise.
- Pain recording after exercise.
- Difficulty rating.
- Session completion.
- Session summary.

The core application must remain fully functional without Camera Mode.

### 2.7 Camera Mode Beta

Camera Mode Beta is an optional advanced feature.

It is intended to:

- Support selected exercises.
- Use computer-vision pose estimation.
- Detect configured body landmarks.
- Provide basic real-time movement feedback.
- Support repetition counting where technically supported.
- Provide basic movement guidance.

Camera Mode Beta is not required for the core rehabilitation workflow.

No raw camera video is required to be stored as part of the planned session architecture.

## 3. Data and Storage Scope

VELTRIX uses MongoDB for application data storage.

The core data areas include:

- Users.
- Exercises.
- Exercise sessions.
- Exercise assignments.
- Progress-related information.
- Pain records.
- Therapist notes.

The exact database structure and relationships are defined separately in the database planning and contract documents.

## 4. Backend Scope

The backend provides REST APIs for:

- Authentication.
- User operations.
- Exercise operations.
- Exercise assignments.
- Exercise sessions.
- Progress-related data.
- Pain-related data.
- Therapist notes.

The backend is responsible for:

- Request handling.
- Authentication and authorization.
- Validation.
- Business logic.
- Database operations.
- Returning appropriate API responses.

## 5. Frontend Scope

The frontend provides separate experiences for:

- Patients.
- Therapists.

The frontend communicates with the backend through REST APIs.

The patient interface includes:

- Authentication pages.
- Patient dashboard.
- Exercise views.
- Exercise session interface.
- Pain and difficulty inputs.
- Session summary.
- Progress/history views.

The therapist interface includes:

- Authentication.
- Therapist dashboard.
- Patient management views.
- Exercise management.
- Exercise assignment.
- Session monitoring.
- Progress and pain history.
- Therapist notes.

## 6. Technology Scope

The planned technology stack includes:

| Area | Technology |
|---|---|
| Frontend | React |
| Backend | Node.js + Express |
| Database | MongoDB |
| Database Hosting | MongoDB Atlas |
| Authentication | JWT + password hashing |
| API | REST |
| API Testing | Postman |
| Computer Vision | MediaPipe Pose Landmarker |
| Version Control | Git + GitHub |

## 7. Testing Scope

The project includes testing of:

- Authentication.
- Backend APIs.
- CRUD operations.
- Exercise assignments.
- Exercise sessions.
- Pain and difficulty recording.
- Frontend-backend integration.
- Core patient workflows.
- Core therapist workflows.
- Camera Mode Beta where implemented.

Postman is used for backend API testing.

## 8. Deployment Scope

The completed application is intended to be deployed as an integrated full-stack web application.

Deployment includes:

- Frontend deployment.
- Backend deployment.
- MongoDB Atlas database.
- Production environment configuration.
- Required environment variables.

## 9. Out of Scope for the Core MVP

The following are not required for the core MVP:

- Mandatory camera-based exercise tracking.
- Computer vision for every exercise.
- Advanced posture analysis.
- Advanced AI-based rehabilitation planning.
- Wearable-device integration.
- Native mobile applications.
- Tele-rehabilitation or video consultation.
- Advanced analytics beyond the defined progress and monitoring features.

These may be considered future extensions.

## 10. Scope Boundary for Camera Mode Beta

Camera Mode Beta must remain separated from the core application workflow.

The core application must be usable when:

- Camera Mode Beta is unavailable.
- A selected exercise does not support Camera Mode.
- Computer-vision processing is incomplete.

Camera Mode Beta is therefore treated as an enhancement rather than a dependency of the main rehabilitation system.

## 11. MVP Completion Boundary

The VELTRIX MVP is considered within scope when:

- Patients can authenticate.
- Therapists can authenticate.
- Therapists can manage exercises.
- Therapists can assign exercises to patients.
- Patients can access assigned exercises.
- Patients can complete Guided Mode sessions.
- Patients can record pain and difficulty.
- Completed sessions are stored.
- Patients can view their progress/history.
- Therapists can monitor relevant patient activity and progress.
- Frontend and backend communicate through REST APIs.
- Application data is stored in MongoDB.
- The integrated application can be tested and deployed.

Camera Mode Beta is not required for MVP completion.

## 12. Scope Principle

The VELTRIX project should prioritize a complete and functional core rehabilitation workflow before treating advanced features such as Camera Mode Beta as part of the completed system.