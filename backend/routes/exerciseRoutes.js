const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  getExercises,
  getExerciseById,
  createExercise,
  updateExercise,
  deleteExercise
} = require("../controllers/exerciseController");

// All exercise routes require authentication
router.use(authMiddleware);

// GET /api/exercises - Allowed: PATIENT, THERAPIST
router.get(
  "/",
  roleMiddleware("PATIENT", "THERAPIST"),
  getExercises
);

// GET /api/exercises/:id - Allowed: PATIENT, THERAPIST
router.get(
  "/:id",
  roleMiddleware("PATIENT", "THERAPIST"),
  getExerciseById
);

// POST /api/exercises - Allowed: THERAPIST
router.post(
  "/",
  roleMiddleware("THERAPIST"),
  createExercise
);

// PUT /api/exercises/:id - Allowed: THERAPIST
router.put(
  "/:id",
  roleMiddleware("THERAPIST"),
  updateExercise
);

// DELETE /api/exercises/:id - Allowed: THERAPIST
router.delete(
  "/:id",
  roleMiddleware("THERAPIST"),
  deleteExercise
);

module.exports = router;