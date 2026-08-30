# VELTRIX — Database Contract & Schema Specification

## 1. Purpose & Architectural Principles

This document defines the official database contract for **VELTRIX**, a rehabilitation management web application. It establishes schema standards, document structures, relationship patterns, and role-based access rules for storing application data in MongoDB.

### Core Entity & CRUD Constraint
In accordance with strict project requirements:
- The database is structured around **exactly three core entities** (top-level MongoDB collections) corresponding to **three core CRUD areas**:
  1. **Users** (`users` collection)
  2. **Exercises** (`exercises` collection)
  3. **Exercise Sessions** (`exercise_sessions` collection)
- **No 4th top-level collection for assignments is created.**
- Therapist-to-patient exercise assignments are modeled as **embedded subdocuments (`assignedExercises[]`) inside the `Users` core entity** (specifically within patient user documents).

---

## 2. Database Technology

- **Database Management System**: MongoDB (Document Database)
- **Hosting / Service**: MongoDB Atlas
- **Format**: JSON / BSON documents with strict schema structure

---

## 3. CORE ENTITIES (Top-Level Collections)

### 3.1 Core Entity 1: User (`users`)

#### Purpose
Represents individual human accounts in VELTRIX. Users have designated roles (`patient` or `therapist`) that govern their access privileges, data ownership, and subdocument capabilities.

#### Fields Specification

| Field Name | Type | Status | Description & Constraints |
| :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Required | Unique identifier for the user document (Primary Key). |
| `name` | `String` | Required | Full name of the user (e.g., `"John Doe"`). |
| `email` | `String` | Required | Unique email address. Used for authentication. Case-insensitive unique index. |
| `password` | `String` | Required | Securely hashed password (hashed using bcrypt with min 10 rounds). Never stored in plain text. |
| `role` | `String` (Enum) | Required | Role identifier. Canonical allowed values: `"PATIENT"`, `"THERAPIST"`. |
| `assignedExercises` | `Array<AssignedExercise>` | Optional | Subdocument array of exercise programs assigned to this user. Relevant for `role: "PATIENT"`. Defaults to `[]`. |
| `therapistNotes` | `Array<TherapistNote>` | Optional | Subdocument array of clinical notes recorded for this patient. Relevant for `role: "PATIENT"`. Defaults to `[]`. |
| `createdAt` | `Date` | Required | ISO 8601 timestamp of user account creation. |
| `updatedAt` | `Date` | Required | ISO 8601 timestamp of last profile update. |

#### Relationships
- **Self-Identity**: `_id` is referenced by `exercises.createdBy`, `assignedExercises.assignedBy`, `therapistNotes.therapistId`, and `exercise_sessions.patientId`.
- **Embedded Subdocuments**: Contains `assignedExercises` and `therapistNotes` arrays for patients.

#### CRUD Permissions by User Role

| Role | Create | Read | Update | Delete |
| :--- | :--- | :--- | :--- | :--- |
| **`PATIENT`** | ❌ Cannot register arbitrary users directly (managed via registration route). | Read own user document & embedded assignments. | Update own non-sensitive profile info (e.g., name). Cannot modify `role`, `assignedExercises`, or `therapistNotes`. | ❌ Forbidden. |
| **`THERAPIST`** | ❌ Cannot directly create user docs (managed via auth endpoints). | Read patient profiles and own therapist profile. | Update managed patient subdocuments (`assignedExercises`, `therapistNotes`). | ❌ Forbidden (Admin function if implemented). |

#### Example Document (`PATIENT`)
```json
{
  "_id": "64d2f1a9b3c4d5e6f7a8b9c0",
  "name": "Jane Patient",
  "email": "jane.patient@example.com",
  "password": "$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
  "role": "PATIENT",
  "assignedExercises": [
    {
      "_id": "64d2f2b1b3c4d5e6f7a8b9c1",
      "exerciseId": "64d2f001b3c4d5e6f7a8b9e0",
      "assignedBy": "64d2f000b3c4d5e6f7a8b9d0",
      "assignedAt": "2026-08-30T10:00:00.000Z",
      "dueDate": "2026-09-15T23:59:59.000Z",
      "targetSets": 3,
      "targetReps": 10,
      "targetDurationSeconds": null,
      "frequency": "2x daily",
      "status": "active",
      "therapistNotes": "Perform slowly, focusing on extension."
    }
  ],
  "therapistNotes": [
    {
      "_id": "64d2f3c2b3c4d5e6f7a8b9c2",
      "therapistId": "64d2f000b3c4d5e6f7a8b9d0",
      "note": "Patient showed 10-degree flexion improvement in left knee.",
      "createdAt": "2026-08-28T14:30:00.000Z",
      "updatedAt": "2026-08-28T14:30:00.000Z"
    }
  ],
  "createdAt": "2026-08-01T09:00:00.000Z",
  "updatedAt": "2026-08-30T10:00:00.000Z"
}
```

#### Example Document (`THERAPIST`)
```json
{
  "_id": "64d2f000b3c4d5e6f7a8b9d0",
  "name": "Dr. Sarah Therapist",
  "email": "sarah.therapist@example.com",
  "password": "$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
  "role": "THERAPIST",
  "assignedExercises": [],
  "therapistNotes": [],
  "createdAt": "2026-07-15T08:00:00.000Z",
  "updatedAt": "2026-08-01T09:00:00.000Z"
}
```

---

### 3.2 Core Entity 2: Exercise (`exercises`)

#### Purpose
Represents the master catalog of physical rehabilitation exercises defined and maintained by therapists in the system.

#### Fields Specification

| Field Name | Type | Status | Description & Constraints |
| :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Required | Unique identifier for the exercise document (Primary Key). |
| `name` | `String` | Required | Name of the exercise (e.g., `"Seated Knee Extension"`). Unique indexed string. |
| `description` | `String` | Required | Detailed explanation of the exercise movement and goal. |
| `targetBodyPart` | `String` | Required | Focus anatomical area (e.g., `"Knee"`, `"Shoulder"`, `"Lower Back"`). |
| `difficulty` | `String` (Enum) | Required | Exercise difficulty level. Allowed values: `"beginner"`, `"intermediate"`, `"advanced"`. |
| `defaultSets` | `Number` | Optional | Recommended default number of sets (e.g., `3`). |
| `defaultReps` | `Number` | Optional | Recommended default repetitions per set (e.g., `12`). Null if duration-based. |
| `defaultDurationSeconds` | `Number` | Optional | Recommended default duration in seconds per set (e.g., `30`). Null if repetition-based. |
| `instructions` | `Array<String>` | Required | Ordered step-by-step guidance strings. |
| `demonstrationMedia` | `String` | Optional | URL or media resource link demonstrating correct execution. |
| `safetyInstructions` | `String` | Optional | Precautions, contraindications, or safety disclaimers. |
| `createdBy` | `ObjectId` | Required | Reference to `users._id` of the therapist who created the exercise. |
| `createdAt` | `Date` | Required | ISO 8601 timestamp of creation. |
| `updatedAt` | `Date` | Required | ISO 8601 timestamp of last modification. |

#### Relationships
- **Referenced by `users.assignedExercises.exerciseId`**: Links patient exercise programs to the exercise catalog.
- **Referenced by `exercise_sessions.exerciseId`**: Connects patient performance logs to the specific exercise performed.
- **References `users._id`**: `createdBy` links to the therapist author.

#### CRUD Permissions by User Role

| Role | Create | Read | Update | Delete |
| :--- | :--- | :--- | :--- | :--- |
| **`PATIENT`** | ❌ Forbidden. | Read assigned or catalog exercises. | ❌ Forbidden. | ❌ Forbidden. |
| **`THERAPIST`** | Create new exercise entries. | Read all exercises in catalog. | Update exercise specifications. | Delete exercise entry (soft/hard delete). |

#### Example Document
```json
{
  "_id": "64d2f001b3c4d5e6f7a8b9e0",
  "name": "Seated Knee Extension",
  "description": "Strengthens the quadriceps muscles to support knee joint stability and range of motion.",
  "targetBodyPart": "Knee",
  "difficulty": "beginner",
  "defaultSets": 3,
  "defaultReps": 10,
  "defaultDurationSeconds": null,
  "instructions": [
    "Sit upright in a chair with back supported and feet flat on the floor.",
    "Slowly extend your affected leg straight out until parallel with the floor.",
    "Pause at the top for 2 seconds, contracting your quadriceps.",
    "Lower the leg back to the starting position in a controlled motion."
  ],
  "demonstrationMedia": "https://assets.veltrix.app/exercises/knee-extension.mp4",
  "safetyInstructions": "Stop immediately if you experience sharp knee joint pain.",
  "createdBy": "64d2f000b3c4d5e6f7a8b9d0",
  "createdAt": "2026-08-01T10:00:00.000Z",
  "updatedAt": "2026-08-01T10:00:00.000Z"
}
```

---

### 3.3 Core Entity 3: Exercise Session (`exercise_sessions`)

#### Purpose
Represents an instance of a patient completing an exercise session. Serves as the primary source for progress monitoring, pain tracking, and session analytics.

#### Fields Specification

| Field Name | Type | Status | Description & Constraints |
| :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Required | Unique identifier for the exercise session document (Primary Key). |
| `patientId` | `ObjectId` | Required | Reference to `users._id` (must have `role: "PATIENT"`). Indexed. |
| `exerciseId` | `ObjectId` | Required | Reference to `exercises._id`. |
| `assignmentId` | `ObjectId` | Optional | Reference to `users.assignedExercises._id` subdocument ID if logged from an assignment. |
| `completedAt` | `Date` | Required | Timestamp of when the session was performed. Indexed. |
| `setsCompleted` | `Number` | Required | Number of completed sets (e.g., `3`). |
| `repsCompleted` | `Number` | Optional | Number of repetitions per set completed (e.g., `10`). |
| `durationSeconds` | `Number` | Optional | Total elapsed time in seconds from session start to session completion, including rest intervals (e.g., `180`). |
| `painBefore` | `Number` | Required | Patient-reported pain rating prior to session (numeric scale `0` to `10`). |
| `painAfter` | `Number` | Required | Patient-reported pain rating immediately after session (numeric scale `0` to `10`). |
| `perceivedDifficulty` | `String` (Enum) | Required | Patient rating of effort. Allowed values: `"easy"`, `"moderate"`, `"hard"`. |
| `sessionResults` | `SessionResults` | Optional | Subdocument holding supplementary movement tracking or feedback details. |
| `createdAt` | `Date` | Required | ISO 8601 timestamp of database insertion. |
| `updatedAt` | `Date` | Required | ISO 8601 timestamp of last record update. |

#### Relationships
- **References `users._id`**: `patientId` points to the patient user.
- **References `exercises._id`**: `exerciseId` points to the exercise executed.
- **References `users.assignedExercises._id`**: `assignmentId` links back to the subdocument assignment.

#### CRUD Permissions by User Role

| Role | Create | Read | Update | Delete |
| :--- | :--- | :--- | :--- | :--- |
| **`PATIENT`** | Create new session entry upon completion. | Read own past exercise sessions. | ❌ Forbidden (session logs are immutable). | ❌ Forbidden. |
| **`THERAPIST`** | ❌ Forbidden (therapists do not complete sessions). | Read session history of managed patients. | ❌ Forbidden (preserves clinical audit trail). | ❌ Forbidden. |

#### Example Document
```json
{
  "_id": "64d2f5e3b3c4d5e6f7a8b9f0",
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
    "feedback": "Felt comfortable during the third set."
  },
  "createdAt": "2026-08-30T11:16:00.000Z",
  "updatedAt": "2026-08-30T11:16:00.000Z"
}
```

---

## 4. EMBEDDED & SUBDOCUMENT INFORMATION

To satisfy the **three-core-entities requirement** without losing application functionality, subdocuments are used to capture complex sub-structures directly inside parent entities.

### 4.1 `AssignedExercise` Subdocument

#### Parent Entity
Embedded inside `users` (`role: "patient"`) within the `assignedExercises[]` array.

#### Purpose & Architectural Rationale
Represents therapist-to-patient exercise prescriptions. Embedding assignments within the patient `users` document eliminates the need for a 4th top-level MongoDB collection, while ensuring zero-join retrieval when fetching a patient's treatment plan.

#### Fields Specification

| Field Name | Type | Status | Description & Constraints |
| :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Required | Unique identifier for this assignment subdocument. |
| `exerciseId` | `ObjectId` | Required | Reference to target `exercises._id`. |
| `assignedBy` | `ObjectId` | Required | Reference to assigning therapist's `users._id`. |
| `assignedAt` | `Date` | Required | ISO timestamp when assigned (default `Date.now`). |
| `dueDate` | `Date` | Optional | Target completion deadline. |
| `targetSets` | `Number` | Required | Target set count specified by therapist. |
| `targetReps` | `Number` | Optional | Target repetitions per set. |
| `targetDurationSeconds` | `Number` | Optional | Target duration per set in seconds. |
| `frequency` | `String` | Optional | Recurrence schedule (e.g., `"2x daily"`, `"Mon/Wed/Fri"`). |
| `status` | `String` (Enum) | Required | Current status. Allowed values: `"active"`, `"completed"`, `"paused"`, `"cancelled"`. Default `"active"`. |
| `therapistNotes` | `String` | Optional | Specific instructions or clinical notes for this assignment. |

#### Subdocument CRUD Permissions

| Role | Create Subdocument | Read Subdocument | Update Subdocument | Delete Subdocument |
| :--- | :--- | :--- | :--- | :--- |
| **`patient`** | ❌ Forbidden. | Read own assigned exercises. | Update assignment `status` (e.g., mark active/completed). | ❌ Forbidden. |
| **`therapist`** | Push new assignment into patient's `assignedExercises`. | Read patient's assigned exercises. | Update assignment targets, dates, or status. | Remove or mark subdocument status as `"cancelled"`. |

#### Subdocument JSON Example
```json
{
  "_id": "64d2f2b1b3c4d5e6f7a8b9c1",
  "exerciseId": "64d2f001b3c4d5e6f7a8b9e0",
  "assignedBy": "64d2f000b3c4d5e6f7a8b9d0",
  "assignedAt": "2026-08-30T10:00:00.000Z",
  "dueDate": "2026-09-15T23:59:59.000Z",
  "targetSets": 3,
  "targetReps": 10,
  "targetDurationSeconds": null,
  "frequency": "2x daily",
  "status": "active",
  "therapistNotes": "Perform slowly, focusing on extension."
}
```

---

### 4.2 `TherapistNote` Subdocument

#### Parent Entity
Embedded inside `users` (`role: "patient"`) within the `therapistNotes[]` array.

#### Purpose & Architectural Rationale
Allows therapists to keep clinical notes and progress observations regarding a specific patient directly attached to the patient's record.

#### Fields Specification

| Field Name | Type | Status | Description & Constraints |
| :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Required | Unique identifier for the note subdocument. |
| `therapistId` | `ObjectId` | Required | Reference to the authoring therapist's `users._id`. |
| `note` | `String` | Required | Clinical observation text. |
| `createdAt` | `Date` | Required | Timestamp when note was written. |
| `updatedAt` | `Date` | Required | Timestamp of last note edit. |

#### Subdocument CRUD Permissions

| Role | Create | Read | Update | Delete |
| :--- | :--- | :--- | :--- | :--- |
| **`patient`** | ❌ Forbidden. | ❌ Forbidden (or Read-Only based on clinical policy). | ❌ Forbidden. | ❌ Forbidden. |
| **`therapist`** | Push note into patient document. | Read notes on assigned patient. | Update own note entry. | Delete own note entry. |

#### Subdocument JSON Example
```json
{
  "_id": "64d2f3c2b3c4d5e6f7a8b9c2",
  "therapistId": "64d2f000b3c4d5e6f7a8b9d0",
  "note": "Patient showed 10-degree flexion improvement in left knee.",
  "createdAt": "2026-08-28T14:30:00.000Z",
  "updatedAt": "2026-08-28T14:30:00.000Z"
}
```

---

### 4.3 `SessionResults` Subdocument

#### Parent Entity
Embedded inside `exercise_sessions` under the `sessionResults` field.

#### Purpose & Architectural Rationale
Holds flexible supplementary results from completed sessions, such as Camera Mode Beta posture accuracy scores or qualitative patient comments.

#### Fields Specification

| Field Name | Type | Status | Description & Constraints |
| :--- | :--- | :--- | :--- |
| `accuracyPercentage` | `Number` | Optional | Computed pose accuracy score (0.0 to 100.0) from motion analysis. |
| `feedback` | `String` | Optional | Freeform patient notes or comments on session execution. |

#### Subdocument JSON Example
```json
{
  "accuracyPercentage": 92.5,
  "feedback": "Felt comfortable during the third set."
}
```

---

## 5. Summary Access Control Matrix (RBAC)

Below is the consolidated matrix defining access rights across all data types in the database contract.

| Data Type / Entity | Storage Location | Patient Access | Therapist Access |
| :--- | :--- | :--- | :--- |
| **User Profiles (`users`)** | Core Collection | Read Own / Update Basic Info | Read Patients / Read Self |
| **Exercise Catalog (`exercises`)** | Core Collection | Read (View Assigned / Catalog) | Full Create, Read, Update, Delete |
| **Exercise Sessions (`exercise_sessions`)** | Core Collection | Create (Log Session) / Read Own History | Read Patient Session Histories |
| **Assigned Exercises (`assignedExercises[]`)** | Embedded in `users` | Read Own / Update Status | Create, Read, Update, Delete for Patients |
| **Therapist Notes (`therapistNotes[]`)** | Embedded in `users` | ❌ Forbidden / Policy Restricted | Create, Read, Update, Delete for Patients |
| **Session Results (`sessionResults`)** | Embedded in `exercise_sessions` | Create / Read Own | Read Patient Results |

---

## 6. Entity Relationship Diagram

```text
  +---------------------------------------------------------------------------------+
  | CORE ENTITY 1: users (Collection)                                               |
  |---------------------------------------------------------------------------------|
  | _id: ObjectId                                                                   |
  | name: String                                                                    |
  | email: String                                                                   |
  | password: String (hashed)                                                       |
  | role: "patient" | "therapist"                                                   |
  |                                                                                 |
  | [EMBEDDED SUBDOCUMENTS for Patients]                                            |
  | assignedExercises: [                                                            |
  |   {                                                                             |
  |     _id: ObjectId                                                               |
  |     exerciseId: ObjectId ----(ref)----------------+                             |
  |     assignedBy: ObjectId ----(ref)----------+     |                             |
  |     targetSets: Number                      |     |                             |
  |     targetReps: Number                      |     |                             |
  |     status: String                          |     |                             |
  |   }                                         |     |                             |
  | ]                                           |     |                             |
  | therapistNotes: [                           |     |                             |
  |   { _id, therapistId, note, createdAt }     |     |                             |
  | ]                                           |     |                             |
  +---------------------------------------------|-----|-----------------------------+
        ^                                       |     |
        |                                       |     |
 (patientId ref)                                |     |
        |                                       |     |
  +-----|---------------------------------------|-----|-----------------------------+
  | CORE ENTITY 3: exercise_sessions (Collection)     |                             |
  |---------------------------------------------------|-----------------------------|
  | _id: ObjectId                                     |                             |
  | patientId: ObjectId --------------+               |                             |
  | exerciseId: ObjectId ------------ | --------------|------------------+          |
  | assignmentId: ObjectId (ref assignedExercises._id)|                  |          |
  | completedAt: Date                                 |                  |          |
  | setsCompleted: Number                             |                  |          |
  | painBefore: Number, painAfter: Number             |                  |          |
  | sessionResults: { accuracyPercentage, feedback }  |                  |          |
  +---------------------------------------------------|------------------|----------+
                                                      |                  |
                                                      v                  v
  +---------------------------------------------------------------------------------+
  | CORE ENTITY 2: exercises (Collection)                                           |
  |---------------------------------------------------------------------------------|
  | _id: ObjectId <-----------------------------------------------------------------+
  | name: String                                                                    |
  | description: String                                                             |
  | targetBodyPart: String                                                          |
  | difficulty: String                                                              |
  | defaultSets: Number, defaultReps: Number                                        |
  | instructions: [String]                                                          |
  | createdBy: ObjectId <-----------------------(ref therapistId)-------------------+
  +---------------------------------------------------------------------------------+
```

---

## 7. Contract Principles & Implementation Rules

1. **Strict Core Entity Limit**: Exactly 3 top-level collections (`users`, `exercises`, `exercise_sessions`) are created. No separate collection for assignments.
2. **Schema & Field Naming**: Use `camelCase` for all JSON document key names (e.g., `targetBodyPart`, `painBefore`, `assignedExercises`).
3. **Data Integrity & Referencing**:
   - `patientId`, `exerciseId`, `assignedBy`, and `createdBy` must contain valid `ObjectId` values referencing their respective top-level collections or subdocuments.
   - Cascade considerations: If an exercise is archived/soft-deleted, existing session logs remain intact.
4. **Security & Privacy**:
   - `password` field must be bcrypt-hashed prior to document creation. Plaintext passwords must never be stored or exposed in queries.
   - Patients can only access their own user document, assigned exercises, and exercise sessions.
5. **Compatibility**:
   - This contract strictly aligns with the URI parameters and request/response payloads defined in `docs/API-CONTRACT.md` and authentication rules in `docs/AUTH-CONTRACT.md`.
