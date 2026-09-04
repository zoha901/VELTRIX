const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  logSession,
  getSessions,
  getSessionById,
  getPatientSessions
} = require("../controllers/sessionController");

// All session routes require authentication
router.use(authMiddleware);

// POST /api/sessions - Allowed: PATIENT
router.post(
  "/",
  roleMiddleware("PATIENT"),
  logSession
);

// GET /api/sessions - Allowed: PATIENT, THERAPIST
router.get(
  "/",
  roleMiddleware("PATIENT", "THERAPIST"),
  getSessions
);

// GET /api/sessions/patient/:patientId - Allowed: THERAPIST
// Must be defined before /:id
router.get(
  "/patient/:patientId",
  roleMiddleware("THERAPIST"),
  getPatientSessions
);

// GET /api/sessions/:id - Allowed: PATIENT, THERAPIST
router.get(
  "/:id",
  roleMiddleware("PATIENT", "THERAPIST"),
  getSessionById
);

module.exports = router;