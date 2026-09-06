const ExerciseSession = require("../models/ExerciseSession");
const Exercise = require("../models/Exercise");
const User = require("../models/User");
const { isValidObjectId, validateSessionInput } = require("../utils/validators");

const forbiddenResponse = (res) => {
  return res.status(403).json({
    success: false,
    message: "Access denied. You do not have permission to access this resource.",
    error: "FORBIDDEN"
  });
};

const therapistManagesPatient = async (therapistId, patientId) => {
  const managed = await User.findOne({
    _id: patientId,
    "assignedExercises.assignedBy": therapistId
  }).select("_id");
  return Boolean(managed);
};

// POST /api/sessions - Log Completed Exercise Session (Patient Only)
const logSession = async (req, res) => {
  try {
    const validation = validateSessionInput(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.errors.join(" "),
        error: "BAD_REQUEST"
      });
    }

    const {
      exerciseId,
      assignmentId,
      completedAt,
      setsCompleted,
      repsCompleted,
      durationSeconds,
      painBefore,
      painAfter,
      perceivedDifficulty,
      sessionResults
    } = req.body;

    const exerciseExists = await Exercise.findById(exerciseId);
    if (!exerciseExists) {
      return res.status(404).json({
        success: false,
        message: "Referenced exercise not found.",
        error: "NOT_FOUND"
      });
    }

    // Patient identity strictly derived from authenticated token
    const patientId = req.user.id;

    const newSession = await ExerciseSession.create({
      patientId,
      exerciseId,
      assignmentId: assignmentId && isValidObjectId(assignmentId) ? assignmentId : null,
      completedAt: completedAt ? new Date(completedAt) : new Date(),
      setsCompleted,
      repsCompleted: repsCompleted || null,
      durationSeconds: durationSeconds || null,
      painBefore,
      painAfter,
      perceivedDifficulty,
      sessionResults: sessionResults || {}
    });

    return res.status(201).json({
      success: true,
      message: "Exercise session logged successfully",
      data: {
        id: newSession._id,
        patientId: newSession.patientId,
        exerciseId: newSession.exerciseId,
        assignmentId: newSession.assignmentId,
        completedAt: newSession.completedAt,
        setsCompleted: newSession.setsCompleted,
        repsCompleted: newSession.repsCompleted,
        durationSeconds: newSession.durationSeconds,
        painBefore: newSession.painBefore,
        painAfter: newSession.painAfter,
        perceivedDifficulty: newSession.perceivedDifficulty,
        sessionResults: newSession.sessionResults,
        createdAt: newSession.createdAt,
        updatedAt: newSession.updatedAt
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to log exercise session.",
      error: "SERVER_ERROR"
    });
  }
};

// GET /api/sessions - Get Exercise Sessions History
const getSessions = async (req, res) => {
  try {
    const filter = {};
    const { limit, startDate } = req.query;

    if (req.user.role.toUpperCase() === "PATIENT") {
      filter.patientId = req.user.id;
    } else {
      const managedPatients = await User.find({
        "assignedExercises.assignedBy": req.user.id
      }).select("_id");
      filter.patientId = { $in: managedPatients.map((patient) => patient._id) };
    }

    if (startDate) {
      filter.completedAt = { $gte: new Date(startDate) };
    }

    const queryLimit = limit ? parseInt(limit, 10) : 0;
    const query = ExerciseSession.find(filter).sort({ completedAt: -1 });

    if (queryLimit > 0) {
      query.limit(queryLimit);
    }

    const sessions = await query.exec();

    const formattedData = sessions.map((s) => ({
      id: s._id,
      patientId: s.patientId,
      exerciseId: s.exerciseId,
      assignmentId: s.assignmentId,
      completedAt: s.completedAt,
      setsCompleted: s.setsCompleted,
      repsCompleted: s.repsCompleted,
      durationSeconds: s.durationSeconds,
      painBefore: s.painBefore,
      painAfter: s.painAfter,
      perceivedDifficulty: s.perceivedDifficulty,
      sessionResults: s.sessionResults,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt
    }));

    return res.status(200).json({
      success: true,
      data: formattedData
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve session history.",
      error: "SERVER_ERROR"
    });
  }
};

// GET /api/sessions/:id - Get Session Details by ID
const getSessionById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(404).json({
        success: false,
        message: "Session record not found.",
        error: "NOT_FOUND"
      });
    }

    const session = await ExerciseSession.findById(id);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session record not found.",
        error: "NOT_FOUND"
      });
    }

    if (req.user.role.toUpperCase() === "PATIENT") {
      if (session.patientId.toString() !== req.user.id) {
        return forbiddenResponse(res);
      }
    } else if (req.user.role.toUpperCase() === "THERAPIST") {
      const managesPatient = await therapistManagesPatient(req.user.id, session.patientId);
      if (!managesPatient) {
        return forbiddenResponse(res);
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        id: session._id,
        patientId: session.patientId,
        exerciseId: session.exerciseId,
        assignmentId: session.assignmentId,
        completedAt: session.completedAt,
        setsCompleted: session.setsCompleted,
        repsCompleted: session.repsCompleted,
        durationSeconds: session.durationSeconds,
        painBefore: session.painBefore,
        painAfter: session.painAfter,
        perceivedDifficulty: session.perceivedDifficulty,
        sessionResults: session.sessionResults,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve session details.",
      error: "SERVER_ERROR"
    });
  }
};

// GET /api/sessions/patient/:patientId - Get Specific Patient Session History (Therapist Only)
const getPatientSessions = async (req, res) => {
  try {
    const { patientId } = req.params;

    if (!isValidObjectId(patientId)) {
      return res.status(404).json({
        success: false,
        message: "Patient ID not found.",
        error: "NOT_FOUND"
      });
    }

    const patient = await User.findById(patientId).select("_id");
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient ID not found.",
        error: "NOT_FOUND"
      });
    }

    const managesPatient = await therapistManagesPatient(req.user.id, patientId);
    if (!managesPatient) {
      return forbiddenResponse(res);
    }

    const sessions = await ExerciseSession.find({ patientId }).sort({ completedAt: -1 });

    const formattedData = sessions.map((s) => ({
      id: s._id,
      patientId: s.patientId,
      exerciseId: s.exerciseId,
      assignmentId: s.assignmentId,
      completedAt: s.completedAt,
      setsCompleted: s.setsCompleted,
      repsCompleted: s.repsCompleted,
      durationSeconds: s.durationSeconds,
      painBefore: s.painBefore,
      painAfter: s.painAfter,
      perceivedDifficulty: s.perceivedDifficulty,
      sessionResults: s.sessionResults,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt
    }));

    return res.status(200).json({
      success: true,
      data: formattedData
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve patient session history.",
      error: "SERVER_ERROR"
    });
  }
};

module.exports = {
  logSession,
  getSessions,
  getSessionById,
  getPatientSessions
};
