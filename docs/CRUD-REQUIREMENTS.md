# VELTRIX — Therapist CRUD Requirements Specification (Phase 0)

## 1. Document Overview & Scope

### 1.1 Purpose
This document defines the functional **CRUD (Create, Read, Update, Delete/Archive)** requirements from the perspective of the **Therapist (Person 2)** for the **VELTRIX AI-Assisted Rehabilitation and Care Management Platform**. 

It outlines the permissions, inputs, visual displays, state transitions, and expected frontend-backend data exchanges across the three core clinical domains:
1. **User Management** (Therapist self-profile and assigned patient caseload management)
2. **Exercise Management** (Clinical exercise catalog authoring, viewing, updating, and archiving)
3. **Exercise Session Management** (Patient session telemetry inspection, review state updating, and session annotations)

---

> [!IMPORTANT]
> **Database Architecture Notice:**
> “The exact database representation of assignments and the interpretation of the three-entity requirement will be finalized during the database contract review.”

---

### 1.2 Core Architectural Principles

1. **Separation of Exercise Management and Exercise Assignment:**
   Exercise management (creating, editing, viewing, and archiving library items) is an independent catalog curation activity. Creating or editing an exercise does **not** automatically require assigning it to a patient. Exercise assignment is a separate clinical workflow that consumes existing library items.
2. **Clinical Audit Trail & Telemetry Immutability:**
   Raw sensor telemetry, AI pose tracking angles, and patient-reported pain scores recorded during rehabilitation sessions are immutable clinical records. Therapists can annotate, review, and flag sessions, but cannot alter objective telemetry.
3. **Role & Permission Scoping:**
   Therapists operate strictly within their clinical caseload. Operations outside the therapist scope (such as hard-deleting user records or system provisioning) are outside therapist permissions and will be finalized later.

---

## 2. CRUD Area 1 — User Management (Therapist Perspective)

This area defines user-related entities from the therapist's operational perspective.

---

### 2.1 Read / View Operations (R)

#### What Records the Therapist Can View
1. **Assigned Patient Records:** All patients assigned to the logged-in therapist.
2. **Therapist Self-Profile:** The therapist’s own account details and assigned clinic affiliation.
3. **Clinic Care Team Members:** Basic read-only directory lookup of collaborating clinicians within the clinic (if applicable).

#### What Information is Displayed
- **Patient Profile View:**
  - *Demographics / Identification:* Full Name, Age / Date of Birth, Gender, Contact Email, Phone Number, Emergency Contact.
  - *Clinical Context:* Primary Diagnosis (e.g., "Post-Op ACL Reconstruction"), Target Joint / Side ("Right Knee"), Surgery Date, Current Rehabilitation Phase (e.g., "Phase 2: Early Strengthening"), Care Start Date, Assigned Primary Clinician.
  - *Caseload Status:* `ACTIVE`, `ATTENTION_NEEDED` (high pain / non-compliant), `ON_HOLD`, `DISCHARGED`.
  - *Adherence & Progress Indicators:* Exercise compliance percentage, last active session timestamp, latest reported pain score (0–10).
- **Therapist Self-Profile View:**
  - Name, Title/Credentials, Email, Office Phone, Clinic Name, Department, Active Caseload Count.

---

### 2.2 Create Operations (C)

#### What Records the Therapist Can Create
- **Patient Account Creation / Onboarding:** **To be finalized.** (System-level patient registration and account provisioning mechanisms are outside the core therapist scope and will be finalized during Phase 0 system architecture alignment. The therapist's primary workflow begins with assigned patients).
- **Therapist Accounts:** Cannot be created by therapists (outside therapist scope; to be finalized later).

---

### 2.3 Update Operations (U)

#### What Records the Therapist Can Update
1. **Patient Clinical Status & Care Progression (Assigned Patients Only):**
   - Rehabilitation Phase (e.g., advancing from Phase 1 to Phase 2).
   - Caseload Status (`ACTIVE`, `ON_HOLD`, `DISCHARGED`).
   - Clinical notes on diagnosis and treatment milestones.
2. **Therapist Self-Profile:**
   - Display Name, Contact Phone, Professional Bio, Notification Preferences.

#### What is Strictly Read-Only (Cannot be Updated by Therapist)
- Patient Medical Record Number / Primary Identifier.
- Patient authentication credentials (passwords, login methods).
- System-level role assignments.

#### Buttons & Expected Actions
- **Buttons:** `Edit Clinical Profile`, `Update Care Status`, `Save Profile Changes`.
- **Post-Action State:** Dispatches update payload, updates patient clinical view in real time, and logs the clinical status change.

#### Inbound & Outbound Data Exchange
- **Sent to Backend (`PUT /api/therapist/patients/:patientId/clinical-profile`):**
  ```json
  {
    "currentPhase": "Phase 2: Active-Assisted ROM & Strengthening",
    "clinicalStatus": "ACTIVE",
    "clinicalNotes": "Advancing patient to Phase 2 following 4-week post-op clearance."
  }
  ```
- **Received from Backend:**
  ```json
  {
    "success": true,
    "patientId": "pt_404",
    "updatedAt": "2026-08-28T20:50:00Z"
  }
  ```

---

### 2.4 Delete / Deactivate Operations (D)

#### What Records the Therapist Can Deactivate
- **Patient Care Deactivation / Discharge:** Therapists can transition an assigned patient’s status to `DISCHARGED` or `INACTIVE` when clinical care concludes.
- **Hard Deletions:** Permanent deletion of user accounts is outside the therapist scope and will be finalized later.

#### Buttons & Expected Actions
- **Button:** `Discharge Patient` (or `Deactivate Caseload Status`).
- **Confirmation Dialog:** Requires selecting a clinical reason (e.g., *"Treatment Goals Met"*, *"Transferred Care"*, *"Discontinued"*).
- **Post-Action State:** Moves patient from active caseload list to discharged/inactive status filter while preserving historical records.

#### Inbound & Outbound Data Exchange
- **Sent to Backend (`PUT /api/therapist/patients/:patientId/discharge`):**
  ```json
  {
    "dischargeReason": "TREATMENT_GOALS_MET",
    "dischargeSummary": "Full functional ROM achieved. Discharged to home maintenance program.",
    "effectiveDate": "2026-08-28"
  }
  ```
- **Received from Backend:**
  ```json
  {
    "success": true,
    "patientId": "pt_404",
    "clinicalStatus": "DISCHARGED",
    "dischargedAt": "2026-08-28T20:52:00Z"
  }
  ```

---

### 2.5 User Management Permissions Boundary Summary

| Entity / Record | Therapist Can View? | Therapist Can Create? | Therapist Can Update? | Therapist Can Deactivate / Delete? |
|---|:---:|:---:|:---:|:---:|
| **Therapist Self-Profile** | Yes | Outside Scope | Yes (Bio, Contact) | Outside Scope |
| **Assigned Patient Records** | Yes | To be finalized | Yes (Clinical Status, Phase) | Yes (Care Discharge / Status) |
| **Other Clinicians / Staff** | Yes (Directory lookup) | Outside Scope | Outside Scope | Outside Scope |
| **System-Level User Accounts** | Outside Scope | Outside Scope | Outside Scope | Outside Scope |

---

## 3. CRUD Area 2 — Exercise Management (Library & Catalog)

Exercise Management governs the repository of rehabilitation exercises available for clinical prescription.

---

### 3.1 Create Exercise (C)

#### What the Therapist Sees
- A **"Create New Exercise"** modal form with fields for exercise metadata, execution instructions, reference media, and default parameters.

#### Required & Expected Fields
- **Exercise Name:** Text input (e.g., "Terminal Knee Extension with Band").
- **Target Joint / Body Region:** Dropdown selection (`Knee`, `Shoulder`, `Lumbar Spine`, `Cervical`, `Hip`, `Ankle`, `Wrist/Elbow`).
- **Movement Category:** Dropdown selection (`Range of Motion`, `Strength`, `Stretching`, `Balance / Neuromuscular`).
- **Difficulty Level:** Dropdown (`BEGINNER`, `INTERMEDIATE`, `ADVANCED`).
- **Step-by-Step Instructions:** Structured text steps for patient execution.
- **Demonstration Media:** Demonstration video URL / upload or thumbnail image.
- **Default Parameters:** Default Sets, Default Reps, Default Hold Duration (seconds), Target ROM angle (degrees).
- **Clinical Guidelines / Notes:** Anatomical focus and contraindications.

#### Buttons & Actions
- `Save Exercise` (Primary Button).
- `Cancel` (Secondary Button).

#### Expected Result
- Submits new exercise payload to the backend.
- On success: Closes modal, displays confirmation toast (*"Exercise created successfully"*), and returns the therapist to the **Exercise Management Library** where the new exercise appears.
- *(Note: Does not force patient assignment; assignment remains a separate workflow).*

#### Inbound & Outbound Data Exchange
- **Sent to Backend (`POST /api/therapist/exercises`):**
  ```json
  {
    "name": "Prone Quad Stretch with Strap",
    "targetJoint": "Knee",
    "category": "Stretching",
    "movementType": "Flexion Stretch",
    "difficulty": "BEGINNER",
    "description": "Passive stretch targeting rectus femoris.",
    "instructions": [
      "Lie face down on a mat.",
      "Loop a strap around your foot and hold the end.",
      "Gently pull strap to bend knee toward buttocks until mild stretch is felt.",
      "Hold without arching lower back."
    ],
    "contraindications": [
      "Acute patellar tendonitis"
    ],
    "videoUrl": "https://cdn.veltrix.io/videos/prone-quad-stretch.mp4",
    "thumbnailUrl": "https://cdn.veltrix.io/thumbs/prone-quad-stretch.jpg",
    "defaultSets": 3,
    "defaultReps": 1,
    "defaultHoldSeconds": 30,
    "targetRomAngle": 110
  }
  ```
- **Received from Backend:**
  ```json
  {
    "success": true,
    "exerciseId": "ex_7712",
    "message": "Exercise created successfully",
    "createdAt": "2026-08-28T20:53:00Z"
  }
  ```

---

### 3.2 Read / View Exercise (R)

#### What the Therapist Sees
- **Library Catalog Grid:**
  - Search bar and category filters (Target Joint, Movement Category, Difficulty).
  - Exercise Cards: Poster preview, Title, Target Joint badge, Difficulty tag, Default dosing summary, and action controls (`View Details`, `Edit`, `Assign to Patient`, `Delete`).
- **Exercise Details Modal / Drawer:**
  - Video demonstration player.
  - Step-by-step patient execution guidance.
  - AI pose tracking checkpoints and key joint angle landmarks.
  - Contraindications and recommended form cues.

#### Inbound & Outbound Data Exchange
- **Sent to Backend (`GET /api/therapist/exercises?targetJoint=Knee&category=Strength`):** Filter parameters.
- **Received from Backend:**
  ```json
  {
    "totalCount": 1,
    "exercises": [
      {
        "exerciseId": "ex_201",
        "name": "Seated Knee Extension with Quad Hold",
        "category": "Strength",
        "targetJoint": "Knee",
        "difficulty": "BEGINNER",
        "thumbnailUrl": "https://cdn.veltrix.io/thumbs/ex_201.jpg",
        "videoUrl": "https://cdn.veltrix.io/videos/ex_201.mp4",
        "instructions": [
          "Sit upright in a chair with feet flat.",
          "Slowly straighten knee until leg is fully extended.",
          "Hold quad contraction at top.",
          "Lower with control."
        ],
        "defaultSets": 3,
        "defaultReps": 10,
        "defaultHoldSeconds": 5,
        "targetRomAngle": 90,
        "isCustom": false
      }
    ]
  }
  ```

---

### 3.3 Update Exercise (U)

#### What the Therapist Sees
- Pre-populated **"Edit Exercise"** modal form containing current values of the selected exercise.

#### Modifiable Information
- Exercise Name, Difficulty, Step-by-Step Instructions, Video URL / media, Default Sets, Default Reps, Default Hold Duration, Target ROM Angle threshold.

#### Buttons & Actions
- `Save Changes` (Primary Button).
- `Cancel` (Discards unsaved edits).

#### Expected Result
- Dispatches update payload to the backend.
- On success: Modal closes, toast confirms update (*"Exercise updated successfully"*), and changes appear in the library catalog.

#### Inbound & Outbound Data Exchange
- **Sent to Backend (`PUT /api/therapist/exercises/:exerciseId`):**
  ```json
  {
    "name": "Prone Quad Stretch with Strap (Modified)",
    "defaultSets": 3,
    "defaultReps": 2,
    "defaultHoldSeconds": 45,
    "targetRomAngle": 120,
    "instructions": [
      "Lie face down on a mat.",
      "Loop a strap around your foot and hold the end.",
      "Gently pull strap to bend knee toward buttocks until mild stretch is felt.",
      "Hold without arching lower back. Breathe steadily."
    ]
  }
  ```
- **Received from Backend:**
  ```json
  {
    "success": true,
    "exerciseId": "ex_7712",
    "updatedAt": "2026-08-28T20:54:10Z"
  }
  ```

---

### 3.4 Delete / Archive Exercise (D)

#### What the Therapist Sees
- Clicking the **Delete / Trash** icon opens a **Delete Confirmation Dialog**.
- Displays warning: *"Are you sure you want to delete '[Exercise Name]'? Historical patient logs will retain reference to this exercise, but it will be hidden from future assignments."*

#### Buttons & Actions
- `Confirm Delete / Archive` (Danger Button).
- `Cancel` (Dismisses dialog).

#### Expected Result
- Sends archive/delete request to the backend.
- Exercise is soft-archived so past prescription records remain intact.
- Closes dialog, shows confirmation toast (*"Exercise archived successfully"*), and removes the item from the active library view.

#### Inbound & Outbound Data Exchange
- **Sent to Backend (`DELETE /api/therapist/exercises/:exerciseId`):** Path parameter `exerciseId`.
- **Received from Backend:**
  ```json
  {
    "success": true,
    "exerciseId": "ex_7712",
    "isArchived": true,
    "message": "Exercise archived successfully"
  }
  ```

---

## 4. CRUD Area 3 — Exercise Session Management

Exercise Session Management defines how therapists view, annotate, and manage patient-completed exercise workouts.

---

### 4.1 Read / View Operations (R)

#### What Records the Therapist Can View
1. **Completed Exercise Sessions Feed:** Chronological list of completed rehabilitation sessions across assigned patients.
2. **Session Telemetry & Details Inspector:** In-depth breakdown of a selected session.

#### What Session Information the Therapist Can See
- **Session Summary:**
  - Patient Name, Exercise Name, Completion Timestamp, Duration, Prescribed vs. Completed Sets and Reps.
  - Overall AI Movement Quality / Accuracy Score (percentage).
  - Maximum Range of Motion (ROM) achieved (degrees).
  - Patient-Reported Pain Score (VAS 0–10) and optional patient comments.
- **Biomechanical & Pose Telemetry Details:**
  - Rep-by-rep performance metrics (Rep #, Duration, Angle reached).
  - AI Compensation & Form Deviation flags (e.g., trunk lean, valgus drift).
  - Automated AI summary feedback provided to the patient.

#### Inbound & Outbound Data Exchange
- **Sent to Backend (`GET /api/therapist/patients/:patientId/sessions/:sessionId`):** Path parameters.
- **Received from Backend:**
  ```json
  {
    "sessionId": "sess_9044",
    "patientId": "pt_404",
    "patientName": "John Doe",
    "exerciseId": "ex_201",
    "exerciseName": "Seated Knee Extension with Quad Hold",
    "completedAt": "2026-08-28T09:15:00Z",
    "durationSeconds": 415,
    "prescribedSets": 3,
    "completedSets": 3,
    "prescribedReps": 10,
    "completedReps": 10,
    "overallAccuracyScore": 92.0,
    "maxRomReached": 88.5,
    "reportedPainScore": 3,
    "patientComment": "Felt slight tightness behind the knee on the last set.",
    "therapistReviewStatus": "UNREVIEWED",
    "isFlagged": false,
    "repTelemetry": [
      {
        "repNumber": 1,
        "romAngle": 90.0,
        "holdDuration": 5.0,
        "compensationFlags": []
      },
      {
        "repNumber": 10,
        "romAngle": 83.5,
        "holdDuration": 4.2,
        "compensationFlags": ["TRUNK_LEAN_BACKWARD"]
      }
    ],
    "aiSummaryFeedback": "Solid control and peak angle. Fatigue noted on final rep with minor trunk compensation."
  }
  ```

---

### 4.2 Update Operations (U)

#### What Session Information Can Be Updated by the Therapist
- **Clinical Review Status:** Marking session as `REVIEWED` to acknowledge clinician oversight.
- **Session Flagging:** Toggling `isFlagged: true` (e.g., flagging for in-person evaluation or routine modification).
- **Therapist Clinical Notes / Feedback:** Attaching clinician observations to the session record.

#### What Information CANNOT Be Updated (Immutability Rule)
- Biomechanical sensor/pose telemetry (angles, durations, rep counts).
- Patient-reported pain ratings (VAS 0–10).
- Timestamps and device execution logs.

#### Buttons & Actions
- `Mark as Reviewed` (Checkmark button).
- `Flag Session for Follow-Up` (Toggle flag icon).
- `Save Session Note` (Primary button).

#### Expected Result
- Dispatches update payload to the backend.
- Updates session status badge in the feed (`REVIEWED` badge appears).
- Persists clinical note attached to the session.

#### Inbound & Outbound Data Exchange
- **Sent to Backend (`PUT /api/therapist/sessions/:sessionId/review`):**
  ```json
  {
    "reviewStatus": "REVIEWED",
    "isFlagged": true,
    "flagReason": "Fatigue compensation on final set; evaluate quad endurance",
    "therapistSessionNote": "Good progress on extension ROM. Advised patient to maintain upright posture on final reps."
  }
  ```
- **Received from Backend:**
  ```json
  {
    "success": true,
    "sessionId": "sess_9044",
    "reviewedAt": "2026-08-28T20:55:00Z",
    "reviewedBy": "th_987654"
  }
  ```

---

### 4.3 Delete / Archive Operations (D)

#### Are Exercise Sessions Allowed to be Deleted?
- **Immutability of Clinical Sessions:** Completed exercise sessions **cannot be hard-deleted** by therapists, as they constitute historical patient care records.
- **Archiving / Invalidation of Test Runs:** If a session was recorded erroneously (such as an equipment or calibration test), the therapist can flag or mark the session as an invalidated test run to exclude it from analytics while preserving the historical record.

#### Buttons & Actions
- `Invalidate Session (Mark as Test Run)` (Action menu option).
- Requires a clinical justification reason.

#### Inbound & Outbound Data Exchange
- **Sent to Backend (`PUT /api/therapist/sessions/:sessionId/invalidate`):**
  ```json
  {
    "invalidationReason": "DEVICE_CALIBRATION_TEST",
    "therapistJustification": "Patient was testing camera positioning prior to beginning protocol."
  }
  ```
- **Received from Backend:**
  ```json
  {
    "success": true,
    "sessionId": "sess_9044",
    "status": "INVALIDATED_TEST_RUN",
    "excludedFromAnalytics": true
  }
  ```

---

## 5. Master Therapist CRUD Matrix

| CRUD Area | Entity | Create (C) | Read (R) | Update (U) | Delete / Archive (D) |
|---|---|---|---|---|---|
| **Area 1: User Management** | Therapist Profile | Outside Scope | Yes (Full profile) | Yes (Bio, Contact) | Outside Scope |
| | Patient Record | To be finalized | Yes (Assigned patients) | Yes (Clinical status, Phase) | Yes (Care Discharge / Status) |
| **Area 2: Exercise Management** | Custom Exercise | Yes (Author exercise) | Yes (Browse/Inspect) | Yes (Modify parameters) | Yes (Soft archive) |
| | System Exercise | Outside Scope | Yes (Browse/Inspect) | No (Read-only) | Outside Scope |
| **Area 3: Session Management** | Session Telemetry | No (Patient executed) | Yes (AI metrics, ROM, Pain)| No (Immutable telemetry) | No (Historical record) |
| | Session Review State | Yes (Generate review) | Yes (Review history) | Yes (Flag, Annotate) | Yes (Invalidate test run) |

---

## 6. Document Validation & Sign-Off

- **Document Version:** 1.1.0 (Phase 0 Planning Baseline — Scope Cleaned)
- **Author Role:** Person 2 (Therapist-Side Domain Owner)
- **Target Platform:** VELTRIX AI-Assisted Rehabilitation Web Application
- **Constraint Compliance:** Strictly specifies requirements, permissions, and data payloads without database models, MongoDB schemas, React components, or implementation APIs.
