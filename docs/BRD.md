# VELTRIX — Business Requirements Document

**Vitality + Elevation + Tracking + IX (Intelligent Experience)**

> **Document purpose:** Define the business requirements, scope, users, core functionality, and high-level expectations for VELTRIX before implementation.

## 1. Project Overview

- VELTRIX is a web-based rehabilitation management platform that connects patients and therapists in one system.
- The platform allows therapists to manage rehabilitation exercises and monitor patient activity, while patients can access assigned exercises, complete structured rehabilitation sessions, record pain and difficulty, and view their rehabilitation history.
- VELTRIX has two exercise modes: Guided Mode, which is the required/core mode, and Camera Mode Beta, which is an optional advanced mode for selected exercises.

## 2. Problem Statement

- Patients may have difficulty consistently following rehabilitation exercises independently because exercise instructions, repetition targets, set counts, hold times, and rest periods can be difficult to remember.
- Rehabilitation information such as exercise assignments, completed sessions, pain levels, progress, and therapist notes may be scattered across manual or separate records.
- Therapists may have limited visibility into day-to-day exercise completion and patient progress.
- Patients may also need more structure and motivation during exercise sessions, while normal guided instructions do not provide immediate information about whether a movement is being performed correctly.

## 3. Proposed Solution

- VELTRIX provides a centralized digital platform where therapists manage exercises and monitor patients, while patients receive assigned exercises and complete structured rehabilitation sessions.
- Guided Mode provides exercise demonstrations, step-by-step instructions, set and repetition tracking, exercise and rest timers, pain recording before and after exercise, difficulty ratings, and session summaries.
- Camera Mode Beta is an optional advanced feature that uses computer-vision pose estimation for selected exercises to provide basic real-time movement feedback. It is not a dependency for the core application.

## 4. Target Users

### 4.1 Patient

The patient can:

- Register and log in.
- View assigned rehabilitation exercises.
- Complete rehabilitation sessions.
- Record pain and difficulty.
- View session summaries.
- View personal rehabilitation progress and history.

### 4.2 Therapist

The therapist can:

- Log in.
- View patients and patient details.
- Create, view, update, and delete exercises.
- Assign exercises to patients.
- View completed exercise sessions.
- Monitor exercise completion and patient activity.
- View patient progress and pain history.
- Add therapist notes.

## 5. Core User Journeys

### 5.1 Patient Journey

```text
Login/Register
      ↓
Patient Dashboard
      ↓
Exercise Details
      ↓
Choose Guided Mode or Camera Mode Beta
      ↓
Exercise Session
      ↓
Pain/Difficulty
      ↓
Session Summary
      ↓
My Progress
````

### 5.2 Therapist Journey

```text
Login
  ↓
Therapist Dashboard
  ↓
View Patients
  ↓
Select Patient
  ↓
View Assigned Exercises
  ↓
View Completed Sessions
  ↓
View Progress
  ↓
View Pain History
  ↓
Add Notes
```

## 6. Functional Requirements — Patient

The system shall allow patients to:

* Register and log in.
* View the patient dashboard and assigned rehabilitation exercises.
* Open exercise details.
* Choose Guided Mode or Camera Mode Beta where available.
* Complete exercises in Guided Mode.
* Track repetitions and sets where applicable.
* Record pain before the exercise.
* Record pain after the exercise.
* Rate exercise difficulty.
* View a session summary after completing an exercise.
* View personal rehabilitation progress and history.

## 7. Functional Requirements — Therapist

The system shall allow therapists to:

* Log in.
* View the therapist dashboard.
* View patients and patient details.
* Create exercises.
* View/read exercises.
* Update exercises.
* Delete exercises.
* Assign exercises to patients.
* View completed exercise sessions.
* Monitor exercise completion and patient activity.
* View patient progress and pain history.
* Add therapist notes.

## 8. Exercise Management Requirements

Therapists can create rehabilitation exercises containing information such as:

* Exercise name.
* Description.
* Target body part.
* Difficulty.
* Sets.
* Repetitions.
* Duration.
* Instructions.
* Demonstration media where applicable.
* Safety instructions.

Therapists can assign an exercise to a patient with assignment information such as:

* Patient.
* Exercise.
* Targets.
* Due date.

## 9. Guided Mode Requirements

* Guided Mode is the main/default exercise mode and does not require a camera.
* The patient should be guided through the exercise using demonstrations/instructions, set and repetition targets, exercise timing, and rest periods.
* The patient records pain before the exercise, completes the exercise, records pain after the exercise, rates difficulty, and receives a session summary.
* The resulting session information is saved for progress tracking and therapist monitoring.

## 10. Camera Mode Beta Requirements

* Camera Mode Beta is optional and initially supports selected exercises.
* It uses pose-estimation/computer-vision technology to detect configured body landmarks and provide basic movement feedback.
* The intended concept includes movement analysis, repetition counting where supported, and simple feedback such as indicating that a movement needs a greater range.
* Camera Mode Beta must remain separate from the core dependency path so the main VELTRIX application remains functional if the computer-vision feature is unavailable or incomplete.
* No raw camera video is required to be stored as part of the planned session architecture.

## 11. Core Data Areas

The project is organized around three major core CRUD areas:

1. User Management.
2. Exercise Management.
3. Exercise Session Management.

Other capabilities such as:

* Exercise assignment.
* Timers.
* Pain recording.
* Guided Mode.
* Progress views.
* Camera Mode Beta.

operate as features around these core areas.

The application stores relevant rehabilitation information in MongoDB, including users, exercises, sessions, and progress-related data.

## 12. System and Technology Requirements

| Area            | Technology / Direction                     |
| --------------- | ------------------------------------------ |
| Frontend        | React                                      |
| Backend         | Node.js with Express                       |
| Database        | MongoDB                                    |
| Hosted Database | MongoDB Atlas                              |
| Authentication  | JWT + password hashing + role-based access |
| API Style       | REST APIs                                  |
| API Testing     | Postman                                    |
| Computer Vision | MediaPipe Pose Landmarker                  |
| Version Control | Git + GitHub                               |

## 13. High-Level Architecture

VELTRIX consists of separate patient and therapist interfaces connected through REST APIs to the backend.

The backend handles:

* Authentication.
* Business logic.
* API operations.
* Communication with MongoDB.

Patient and therapist experiences ultimately use the same centralized rehabilitation data so that:

* Completed sessions.
* Pain information.
* Progress.
* Assignments.
* Related activity.

can be monitored appropriately.

Conceptually:

```text
                    VELTRIX
                       │
          ┌────────────┴────────────┐
          │                         │
       PATIENT                  THERAPIST
          │                         │
          ↓                         ↓
 Patient Dashboard          Therapist Dashboard
          │                         │
 Assigned Exercises         Exercise Management
          │                         │
          ↓                         ↓
   Choose Exercise          Assign Exercises
       Mode                       │
      ↙    ↘                      │
 Guided   Camera Beta             │
   │          │                   │
   └──────────┴──────────┐        │
                         ↓        │
                  Exercise Session
                         │
                         ↓
                  MongoDB Database
                         │
                         ↓
                  Progress Tracking
                         │
                 ┌───────┴───────┐
                 ↓               ↓
              Patient         Therapist
```

## 14. MVP / Core Project Scope

The core MVP includes:

* Login and authentication.
* Patient dashboard.
* Therapist dashboard.
* Exercise management.
* Exercise assignment.
* Guided Mode.
* Exercise sessions.
* Pain before and after exercise.
* Difficulty rating.
* Session summary.
* Progress history.
* REST APIs.
* MongoDB.
* Postman testing.
* Frontend-backend integration.
* Deployment.

## 15. Scope Boundary

* The core project is intended to be fully functional without Camera Mode Beta.
* Camera Mode Beta is an optional advanced module to be developed only after the core application has been tested and deployed.
* Camera Mode Beta should initially focus on selected exercises rather than attempting to support all rehabilitation movements.

## 16. Future Scope

Potential future extensions include:

* More exercises supported by computer vision.
* Improved posture analysis.
* More sophisticated movement scoring.
* Personalized exercise recommendations.
* Wearable-device integration.
* Mobile application.
* Tele-rehabilitation or video consultation.
* Advanced analytics.
* AI-assisted rehabilitation planning.

## 17. Success Criteria

The project is successful when:

* Patients can access assigned rehabilitation exercises.
* Patients can complete structured Guided Mode sessions.
* Patients can track pain and difficulty.
* Patients can view their rehabilitation progress.
* Therapists can manage exercises.
* Therapists can assign exercises.
* Therapists can monitor patient sessions and progress.
* The core system functions as an integrated full-stack application using React, Node.js/Express, REST APIs, MongoDB, authentication, testing, frontend-backend integration, and deployment.
* Camera Mode Beta remains an enhancement and is not required for the core application to function.

## 18. One-Line Project Definition

> VELTRIX is a web-based rehabilitation management platform that allows therapists to manage exercises and patients to perform guided rehabilitation sessions, track pain and progress, and optionally receive basic real-time movement feedback through a camera-based computer-vision mode.

````

