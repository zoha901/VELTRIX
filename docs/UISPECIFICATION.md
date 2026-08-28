Here is the **copy-ready `UI-SPECIFICATION.md`** for VELTRIX.

````markdown
# VELTRIX — UI Specification

## 1. Purpose

This document defines the user interface structure and expected user interactions for VELTRIX.

It provides a shared reference for designing and implementing the frontend.

The UI should remain consistent with the VELTRIX requirements, architecture, database contract, and API contract.

This document describes what users should see and how they should interact with the application. It does not define the actual React implementation.

---

## 2. UI Goals

The VELTRIX interface should be:

- Simple and beginner-friendly.
- Clear and easy to navigate.
- Accessible to users with different levels of technical ability.
- Focused on rehabilitation tasks.
- Responsive across supported screen sizes.
- Consistent across patient and therapist interfaces.
- Designed to minimize unnecessary steps.
- Clear about actions, progress, errors, and completion.

---

## 3. User Roles

VELTRIX has two primary user roles:

```text
Patient
Therapist
````

Each role receives an appropriate interface.

### Patient

The patient interface focuses on:

* Assigned exercises.
* Exercise instructions.
* Guided Mode.
* Camera Mode Beta where available.
* Exercise completion.
* Pain and difficulty recording.
* Session history.
* Progress.

### Therapist

The therapist interface focuses on:

* Exercise management.
* Patient management.
* Exercise assignment.
* Patient activity.
* Progress monitoring.
* Pain/history information.
* Therapist notes.

---

# 4. Global UI Structure

The application should use a consistent layout.

Conceptually:

```text
┌──────────────────────────────────────────┐
│                 VELTRIX                  │
│     Logo / Navigation / User Menu        │
├──────────────────────────────────────────┤
│                                          │
│                                          │
│              Page Content                │
│                                          │
│                                          │
├──────────────────────────────────────────┤
│             Footer / Support             │
└──────────────────────────────────────────┘
```

The exact layout may vary between desktop and smaller screens.

---

# 5. Authentication Screens

## 5.1 Login Screen

### Purpose

Allow an existing user to log into VELTRIX.

### Main elements

* VELTRIX logo.
* Email field.
* Password field.
* Login button.
* Link/button to registration.
* Error message area.

### User flow

```text
Enter email
     ↓
Enter password
     ↓
Click Login
     ↓
Backend authentication
     ↓
Successful → Appropriate dashboard
Failed → Display error
```

### Validation

The interface should provide clear feedback when:

* Email is missing.
* Password is missing.
* Email format is invalid.
* Login credentials are incorrect.
* The server is unavailable.

---

## 5.2 Registration Screen

### Purpose

Allow a new user to create an account.

### Main elements

* Name field.
* Email field.
* Password field.
* Role selection where applicable.
* Register button.
* Link/button to Login.

### User flow

```text
Enter information
      ↓
Submit registration
      ↓
Backend validation
      ↓
Account created
      ↓
Login / Dashboard
```

Sensitive information such as passwords must not be displayed unnecessarily.

---

# 6. Patient UI

## 6.1 Patient Dashboard

The dashboard is the main landing page for a patient.

### Main information

The dashboard may show:

* Welcome message.
* Assigned exercises.
* Today's exercise tasks.
* Completion status.
* Recent activity.
* Progress summary.
* Quick access to exercise sessions.

Conceptual layout:

```text
┌───────────────────────────────┐
│ Welcome, Patient              │
├───────────────────────────────┤
│ Today's Exercises             │
│                               │
│ Exercise 1        [Start]     │
│ Exercise 2        [Start]     │
│ Exercise 3        [Completed] │
├───────────────────────────────┤
│ Progress Summary              │
│                               │
│ Recent Activity               │
└───────────────────────────────┘
```

---

## 6.2 Assigned Exercises

### Purpose

Allow patients to see exercises assigned by their therapist.

Each exercise card may display:

* Exercise name.
* Target body part.
* Difficulty.
* Sets.
* Repetitions.
* Duration where applicable.
* Due date where applicable.
* Completion status.
* Start button.

Example:

```text
┌─────────────────────────────┐
│ Knee Extension              │
│ Knee                        │
│ Beginner                    │
│ 3 sets × 10 repetitions     │
│                             │
│             [Start Exercise]│
└─────────────────────────────┘
```

---

# 7. Exercise Details Screen

### Purpose

Provide detailed information before starting an exercise.

### Main elements

* Exercise name.
* Description.
* Target body part.
* Difficulty.
* Instructions.
* Demonstration media where available.
* Safety instructions.
* Sets/repetitions.
* Duration where applicable.
* Start button.

The patient should be able to understand the exercise before beginning.

---

# 8. Guided Mode

Guided Mode is the required core exercise mode.

### Purpose

Guide the patient through an exercise step-by-step.

### Main UI elements

* Exercise name.
* Current set.
* Current repetition.
* Timer where applicable.
* Instructions.
* Exercise demonstration.
* Progress indicator.
* Pause/resume controls where appropriate.
* Complete/end session control.

Conceptual flow:

```text
Exercise Details
       ↓
Start Guided Mode
       ↓
Instructions
       ↓
Perform Exercise
       ↓
Sets / Repetitions / Timer
       ↓
Exercise Complete
       ↓
Session Information
```

The interface should clearly show the patient's current position within the exercise.

---

# 9. Camera Mode Beta

Camera Mode Beta is an optional advanced feature.

### Purpose

Use the device camera and movement analysis to provide additional exercise guidance where supported.

### Main UI elements may include:

* Camera permission request.
* Camera preview.
* Exercise instructions.
* Movement feedback.
* Repetition information where supported.
* Exercise progress.
* Stop/end session control.

Conceptual flow:

```text
Exercise
   ↓
Select Camera Mode
   ↓
Request Camera Permission
   ↓
Camera Available?
   ├── Yes → Camera Mode
   │            ↓
   │       Movement Analysis
   │            ↓
   │       Feedback
   │
   └── No → Guided Mode
```

Camera Mode must not prevent the patient from completing the exercise through Guided Mode.

---

# 10. Session Completion Screen

After an exercise session, the patient should be able to record relevant information.

### Main elements

* Exercise name.
* Completion status.
* Sets/repetitions completed.
* Pain before exercise.
* Pain after exercise.
* Difficulty rating.
* Optional additional session information where required.
* Submit/save button.

Conceptual flow:

```text
Exercise Complete
       ↓
Record Session Information
       ↓
Submit
       ↓
Session Saved
       ↓
Progress / History
```

The UI should clearly confirm when the session has been successfully saved.

---

# 11. Patient Progress Screen

### Purpose

Allow patients to view their rehabilitation progress.

The screen may display:

* Exercise completion.
* Session history.
* Pain history.
* Difficulty history.
* Relevant progress summaries.

Information should be presented in a simple and understandable way.

Where charts are used, they should include clear labels and readable values.

---

# 12. Patient Session History

### Purpose

Allow patients to review previous exercise sessions.

Each session may display:

* Exercise name.
* Date/time.
* Completion status.
* Pain before.
* Pain after.
* Difficulty.
* Session results.

Example:

```text
┌─────────────────────────────────┐
│ Knee Extension                  │
│ August 28                       │
│ Completed                       │
│ Pain: 4 → 3                     │
│ Difficulty: Moderate            │
└─────────────────────────────────┘
```

---

# 13. Therapist UI

## 13.1 Therapist Dashboard

The therapist dashboard is the main landing page for therapists.

It may provide:

* Patient overview.
* Recent patient activity.
* Exercise management.
* Assign exercise action.
* Progress monitoring.
* Quick access to patient information.

Conceptual layout:

```text
┌──────────────────────────────────┐
│ Therapist Dashboard              │
├──────────────────────────────────┤
│ Patients                         │
│                                  │
│ Patient 1       [View]           │
│ Patient 2       [View]           │
│ Patient 3       [View]           │
├──────────────────────────────────┤
│ Exercises                        │
│ [Manage Exercises]               │
│                                  │
│ Assignments                      │
│ [Manage Assignments]             │
└──────────────────────────────────┘
```

---

# 14. Patient Management

### Purpose

Allow therapists to view patients they are authorized to manage.

The patient list may show:

* Patient name.
* Relevant activity information.
* Exercise completion information.
* Progress indicator.
* View details action.

Therapists must only see patients they are authorized to access.

---

# 15. Therapist Patient Details

### Purpose

Provide a therapist with relevant information about a selected patient.

The screen may include:

* Patient information.
* Assigned exercises.
* Recent sessions.
* Progress.
* Pain history.
* Therapist notes.

Conceptual layout:

```text
Patient Details
│
├── Overview
├── Assigned Exercises
├── Sessions
├── Progress
├── Pain History
└── Therapist Notes
```

---

# 16. Exercise Management

Therapists should be able to manage exercises.

### Exercise Management Screen

The screen may provide:

* Exercise list.
* Search/filter where useful.
* Create exercise.
* Edit exercise.
* Delete exercise.
* View exercise details.

Example:

```text
Exercises

[Knee Extension]       [Edit] [Delete]
[Shoulder Raise]       [Edit] [Delete]
[Leg Raise]            [Edit] [Delete]

[+ Create Exercise]
```

---

# 17. Create Exercise Screen

### Main fields

* Exercise name.
* Description.
* Target body part.
* Difficulty.
* Sets.
* Repetitions.
* Duration where applicable.
* Instructions.
* Demonstration media where applicable.
* Safety instructions.

### Actions

```text
[Save Exercise]
[Cancel]
```

Validation errors should be shown clearly next to or near the relevant fields.

---

# 18. Edit Exercise Screen

The edit screen should use the same core fields as the create exercise screen.

The existing exercise information should be loaded into the form.

Actions:

```text
[Save Changes]
[Cancel]
```

A confirmation should be shown after successful saving.

---

# 19. Exercise Assignment UI

### Purpose

Allow therapists to assign an exercise to a patient.

### Main elements

* Patient selector.
* Exercise selector.
* Target sets/repetitions where applicable.
* Due date where applicable.
* Assignment button.

Conceptual flow:

```text
Select Patient
      ↓
Select Exercise
      ↓
Set Targets
      ↓
Set Due Date
      ↓
[Assign Exercise]
```

The UI should confirm successful assignment.

---

# 20. Therapist Progress UI

The therapist should be able to review relevant patient progress.

Possible information:

* Exercise completion.
* Session history.
* Pain before/after.
* Difficulty.
* Exercise activity.
* Progress trends.

The information should be organized so that therapists can quickly understand patient activity.

---

# 21. Therapist Notes UI

### Purpose

Allow therapists to create and view notes associated with authorized patients.

### Main elements

* Patient information.
* Existing notes.
* Note text field.
* Save note button.

Example:

```text
Therapist Notes

[Existing note]
Patient is progressing well.

[Write a new note...]
                    [Save Note]
```

Notes must only be visible to authorized users.

---

# 22. Navigation

Navigation should remain consistent.

### Patient navigation

Possible navigation:

```text
Dashboard
Exercises
Progress
History
Profile
Logout
```

### Therapist navigation

Possible navigation:

```text
Dashboard
Patients
Exercises
Assignments
Progress
Notes
Profile
Logout
```

The exact navigation may be refined during implementation based on the final UI design.

---

# 23. Buttons and Actions

Buttons should clearly communicate their action.

Examples:

```text
Start Exercise
Complete Session
Save
Save Changes
Create Exercise
Edit
Delete
Assign Exercise
View Progress
View Details
Cancel
Logout
```

Destructive actions such as deleting an exercise should provide an appropriate confirmation before completion.

---

# 24. Loading States

When the application is waiting for data from the backend, the UI should communicate that something is happening.

Examples:

```text
Loading exercises...
Loading patient data...
Saving...
Submitting session...
```

Users should not be left wondering whether their action worked.

---

# 25. Empty States

If there is no data to display, the UI should provide a useful message.

Examples:

```text
No exercises assigned yet.

No previous sessions found.

No therapist notes available.

No patients available.
```

Where appropriate, provide an action that helps the user move forward.

---

# 26. Error States

Errors should be understandable and actionable.

Avoid displaying technical messages such as:

```text
MongoError: ...
```

Instead, display user-friendly messages such as:

```text
Unable to load exercises.
Please try again.
```

The frontend should handle relevant API error responses according to the API contract.

---

# 27. Success Feedback

After important actions, the UI should provide confirmation.

Examples:

```text
Exercise created successfully.

Exercise assigned successfully.

Session saved successfully.

Changes saved successfully.
```

Success messages should not unnecessarily interrupt the user's workflow.

---

# 28. Confirmation Dialogs

Confirmation should be used for actions that could cause unintended consequences.

Examples:

```text
Delete this exercise?

[Cancel] [Delete]
```

and:

```text
End this session?

Your current progress may not be saved.

[Continue Session] [End Session]
```

The exact wording may be refined during implementation.

---

# 29. Responsive Design

The interface should work across supported device sizes.

The layout should adapt to:

* Desktop.
* Laptop.
* Tablet.
* Mobile where applicable.

Important controls should remain accessible on smaller screens.

Exercise and camera interfaces should prioritize usability and readable content.

---

# 30. Accessibility

The UI should follow basic accessibility principles.

Important considerations include:

* Readable text.
* Sufficient contrast.
* Clear button labels.
* Visible focus states.
* Keyboard accessibility where applicable.
* Form labels.
* Meaningful error messages.
* Avoiding information conveyed only through color.
* Accessible controls for important actions.

---

# 31. UI Consistency Rules

The application should maintain consistent:

* Typography.
* Spacing.
* Buttons.
* Form controls.
* Cards.
* Navigation.
* Error messages.
* Success messages.
* Icons.
* Page layouts.

Reusable UI components should be preferred over creating multiple versions of the same component.

---

# 32. Data and UI Responsibility

The UI displays data received from the backend.

The frontend should not invent or permanently modify database information locally as a replacement for backend persistence.

For example:

```text
Patient completes session
       ↓
Frontend collects information
       ↓
POST /api/sessions
       ↓
Backend validates
       ↓
Database stores session
       ↓
Frontend receives response
       ↓
UI updates
```

The backend remains the source of truth for persistent application data.

---

# 33. UI and API Contract

The frontend must follow the API defined in:

```text
docs/API-CONTRACT.md
```

For example:

```text
UI Action
   ↓
API Request
   ↓
Backend
   ↓
API Response
   ↓
UI Update
```

The UI should not assume fields or endpoints that are not defined or agreed upon.

If an API requirement changes, the affected frontend implementation and API contract must be updated consistently.

---

# 34. UI and Architecture

The UI follows the system architecture defined in:

```text
docs/ARCHITECTURE.md
```

The frontend is responsible for:

```text
Presentation
User Interaction
API Communication
```

The backend remains responsible for:

```text
Authentication
Authorization
Validation
Business Logic
Database Operations
```

---

# 35. MVP UI Principle

VELTRIX should prioritize the core rehabilitation workflow.

The primary patient flow is:

```text
Login
 ↓
Dashboard
 ↓
Assigned Exercise
 ↓
Exercise Details
 ↓
Guided Mode
 ↓
Session Completion
 ↓
Progress / History
```

The primary therapist flow is:

```text
Login
 ↓
Dashboard
 ↓
Patients / Exercises
 ↓
Assign Exercise
 ↓
Monitor Progress
 ↓
Add Notes
```

Camera Mode Beta should be implemented as an additional capability and should not block the core Guided Mode experience.

---

# 36. UI Architecture Summary

```text
                    VELTRIX UI
                        │
             ┌──────────┴──────────┐
             ↓                     ↓
          PATIENT              THERAPIST
             │                     │
       ┌─────┼─────┐         ┌─────┼─────┐
       ↓     ↓     ↓         ↓     ↓     ↓
   Exercises Sessions      Patients Exercises
   Progress  History       Assignments Notes
       │                     │
       └──────────┬──────────┘
                  ↓
               REST API
                  ↓
              Backend
                  ↓
              Database
```

---

# 37. Final UI Principle

VELTRIX should provide a simple, clear, and reliable rehabilitation experience.

The UI should make it easy for:

### Patients to:

```text
Understand → Start → Perform → Complete → Track
```

### Therapists to:

```text
Manage → Assign → Monitor → Review → Support
```

All UI implementation should remain consistent with:

```text
BRD.md
PROJECT-SCOPE.md
REQUIREMENTS.md
DATABASE-CONTRACT.md
API-CONTRACT.md
ARCHITECTURE.md
```

Any significant change to the agreed UI structure should be communicated to the affected team members and reflected in the appropriate documentation.

```
```
