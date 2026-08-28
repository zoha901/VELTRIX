````markdown
# VELTRIX — Database Contract

## 1. Purpose

This document defines the agreed structure of the main data used by VELTRIX.

It provides a common reference for the frontend and backend so that all team members use the same data names and relationships.

## 2. Database

VELTRIX uses:

- MongoDB as the database.
- MongoDB Atlas as the hosted database.

The application will use MongoDB collections containing JSON-like documents.

## 3. User

A user represents a person using VELTRIX.

### Main fields

```text
User
├── name
├── email
├── password
└── role
````

### Role

The `role` identifies the type of user:

* `patient`
* `therapist`

Passwords must be stored securely using password hashing.

## 4. Exercise

An exercise represents a rehabilitation exercise managed by the system.

### Main fields

```text
Exercise
├── name
├── description
├── targetBodyPart
├── difficulty
├── sets
├── repetitions
├── duration
├── instructions
├── demonstrationMedia
└── safetyInstructions
```

Not every exercise must use every field. For example, some exercises may use repetitions while others may use duration.

## 5. Exercise Assignment

An exercise assignment connects an exercise to a patient.

### Main fields

```text
ExerciseAssignment
├── patient
├── exercise
├── targets
└── dueDate
```

The assignment identifies which patient should perform which exercise and any relevant target or due-date information.

## 6. Exercise Session

An exercise session represents a patient's completed rehabilitation exercise session.

### Main fields

```text
ExerciseSession
├── patient
├── exercise
├── completionInformation
├── painBefore
├── painAfter
├── difficulty
└── sessionResults
```

Session information is used for patient history, progress tracking, and therapist monitoring.

## 7. Therapist Notes

A therapist note represents information recorded by a therapist about a patient.

### Main fields

```text
TherapistNote
├── patient
└── note
```

The exact implementation details will be defined when the backend is developed.

## 8. Main Relationships

The main data relationships are:

```text
User
│
├── Patient
│   │
│   ├── receives → ExerciseAssignment
│   │                  │
│   │                  └── references → Exercise
│   │
│   └── completes → ExerciseSession
│                      │
│                      └── references → Exercise
│
└── Therapist
    │
    ├── manages → Exercise
    ├── creates → ExerciseAssignment
    └── creates → TherapistNote
```

A simplified view:

```text
Patient ────── Exercise Assignment ────── Exercise
   │                                      │
   │                                      │
   └──────────── Exercise Session ────────┘
   │
   └──────────── Therapist Note
```

## 9. Data Used for Progress

Patient progress can be derived from stored rehabilitation information such as:

* Completed exercise sessions.
* Exercise completion activity.
* Pain before and after exercise.
* Difficulty ratings.
* Other relevant session results.

The progress views should use the stored session and rehabilitation data rather than requiring a separate manually maintained progress record unless later requirements specify otherwise.

## 10. Camera Mode Data

Camera Mode Beta may generate temporary movement-related information during an exercise session.

The core database does not require raw camera video storage.

Any persistent camera-related data must only be added when required by the implemented Camera Mode functionality.

## 11. Data Ownership and Access

* Patients should only access their own relevant rehabilitation information.
* Therapists should access information for patients they are authorized to manage.
* Protected data must be accessed through authenticated and authorized backend APIs.

## 12. Contract Principles

The database implementation should follow these principles:

* Use consistent field names.
* Keep relationships between users, exercises, assignments, and sessions clear.
* Store only data required by the agreed project requirements.
* Keep sensitive information protected.
* Keep the database structure compatible with the REST API contract.
* Update this contract if an approved project requirement changes the data structure.

```
```
