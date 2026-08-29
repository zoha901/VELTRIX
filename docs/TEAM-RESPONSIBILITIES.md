
## 1. Purpose

This document defines the main responsibilities and collaboration boundaries of the four VELTRIX team members.

The goal is to avoid duplicated work, unclear ownership, and integration problems.

---

## 2. Team Structure

| Person | Primary Responsibility |
|---|---|
| Person 1 | Frontend / UI |
| Person 2 | Authentication / User Backend |
| Person 3 | Exercises Backend |
| Person 4 | Exercises + Sessions Backend |

---

## 3. Person 1 — Frontend / UI

Responsible for the VELTRIX frontend and user interface.

### Main Responsibilities

- React application.
- Patient and therapist interfaces.
- Login/registration UI.
- Dashboards.
- Exercise screens.
- Guided Mode UI.
- Camera Mode Beta UI where applicable.
- Session completion UI.
- Progress/history UI.
- Therapist notes UI.
- Navigation and reusable components.
- Loading, error, and empty states.
- Connecting frontend to backend APIs.
- Responsive and accessible UI.

### Main Documents

```text
BRD.md
PROJECT-SCOPE.md
REQUIREMENTS.md
UI-SPECIFICATION.md
API-CONTRACT.md
ARCHITECTURE.md
````

The frontend should communicate with the backend through the REST API and should not directly access MongoDB.

---

## 4. Person 2 — Authentication / User Backend

Responsible for user and authentication-related backend functionality.

### Main Responsibilities

* User registration.
* User login.
* Password hashing.
* JWT authentication.
* Authentication middleware.
* User roles and authorization.
* Current-user functionality.
* User-related database operations.
* Authentication APIs.
* Authentication testing.

### Main Documents

```text
BRD.md
PROJECT-SCOPE.md
REQUIREMENTS.md
DATABASE-CONTRACT.md
API-CONTRACT.md
ARCHITECTURE.md
```

Backend authorization is the final authority for protected resources.

---

## 5. Person 3 — Exercises Backend

Responsible for exercise-management backend functionality.

### Main Responsibilities

* Exercise creation.
* Exercise retrieval.
* Exercise updating.
* Exercise deletion.
* Exercise validation.
* Exercise APIs.
* Exercise database operations.
* Exercise assignment functionality where included in the assigned phase.
* Exercise API testing.

### Main Documents

```text
BRD.md
PROJECT-SCOPE.md
REQUIREMENTS.md
DATABASE-CONTRACT.md
API-CONTRACT.md
ARCHITECTURE.md
```

Exercise implementation must follow the agreed database and API contracts.

---

## 6. Person 4 — Exercises + Sessions Backend

Responsible for exercise-session functionality and its backend integration.

### Main Responsibilities

* Exercise session creation and storage.
* Session retrieval.
* Session validation.
* Session APIs.
* Session database operations.
* Recording session results.
* Pain and difficulty information.
* Sets/repetitions completed where applicable.
* Progress/history data related to sessions.
* Session API testing.
* Integration with exercises, authentication, and frontend.

### Main Documents

```text
BRD.md
PROJECT-SCOPE.md
REQUIREMENTS.md
DATABASE-CONTRACT.md
API-CONTRACT.md
ARCHITECTURE.md
```

---

## 7. Shared Responsibilities

All team members must:

* Follow the project requirements.
* Follow the database and API contracts.
* Understand the overall architecture.
* Test their work.
* Use Git/GitHub correctly.
* Communicate changes affecting other members.
* Avoid incompatible changes to shared contracts.
* Participate in integration and debugging.
* Understand AI-generated code before committing it.

---

## 8. Team Dependencies

```text
Person 1 → Frontend
    ↓
    REST API
    ↓
Person 2 → Authentication
Person 3 → Exercises
Person 4 → Sessions
    ↓
MongoDB
```

Examples:

```text
Frontend ↔ Authentication
Frontend ↔ Exercises
Frontend ↔ Sessions
Exercises ↔ Sessions
Authentication ↔ All Backend Features
```

---

## 9. Responsibility Boundaries

Each person should primarily work within their assigned area.

Changes affecting another person's area should be discussed before implementation.

Examples:

* API changes → communicate with affected frontend/backend members.
* Database changes → communicate with affected backend members.
* UI changes affecting API behavior → communicate with backend members.
* Authentication changes → communicate with all affected members.

---

## 10. GitHub Workflow

General workflow:

```text
Create/switch to branch
        ↓
Make changes
        ↓
Test
        ↓
Commit
        ↓
Push
        ↓
Review/discuss
        ↓
Merge
```

Meaningful commits should describe the work completed.

---

## 11. Integration

A feature is not complete just because one person's code works.

A complete feature may require:

```text
Frontend
   +
Backend
   +
Database
   +
Authentication
   +
Testing
```

The team should test complete user workflows during integration.

---

## 12. Project Lead

The project lead coordinates:

* Phase progression.
* Shared documentation.
* GitHub organization.
* Integration.
* Team communication.
* Contract changes.
* Responsibility conflicts.

The lead does not automatically own everyone's implementation work.

Each person remains responsible for their assigned area.

---

## 13. Definition of Done

A task is generally complete when:

* Requirements are satisfied.
* Relevant contracts are followed.
* The implementation works.
* Important errors are handled.
* The feature is tested.
* Changes are committed to Git.
* The work can be integrated with the rest of VELTRIX.

---

## 14. Final Principle

The team has four different responsibility areas but is building one application.

```text
4 People
   ↓
4 Responsibility Areas
   ↓
1 Shared Architecture
   ↓
1 Shared Codebase
   ↓
1 VELTRIX Application
```
