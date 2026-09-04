const Exercise = require("../models/Exercise");
const { isValidObjectId, validateExerciseInput } = require("../utils/validators");

// GET /api/exercises - List Exercise Catalog
const getExercises = async (req, res) => {
  try {
    const { targetBodyPart, difficulty } = req.query;
    const filter = {};

    if (targetBodyPart) {
      filter.targetBodyPart = new RegExp(`^${targetBodyPart.trim()}$`, "i");
    }
    if (difficulty) {
      filter.difficulty = difficulty.trim().toLowerCase();
    }

    const exercises = await Exercise.find(filter).sort({ createdAt: -1 });

    const formattedData = exercises.map((ex) => ({
      id: ex._id,
      name: ex.name,
      description: ex.description,
      targetBodyPart: ex.targetBodyPart,
      difficulty: ex.difficulty,
      defaultSets: ex.defaultSets,
      defaultReps: ex.defaultReps,
      defaultDurationSeconds: ex.defaultDurationSeconds,
      instructions: ex.instructions,
      demonstrationMedia: ex.demonstrationMedia,
      safetyInstructions: ex.safetyInstructions,
      createdBy: ex.createdBy,
      createdAt: ex.createdAt,
      updatedAt: ex.updatedAt
    }));

    return res.status(200).json({
      success: true,
      data: formattedData
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve exercise catalog.",
      error: "SERVER_ERROR"
    });
  }
};

// GET /api/exercises/:id - Get Exercise Details by ID
const getExerciseById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(404).json({
        success: false,
        message: "Exercise not found.",
        error: "NOT_FOUND"
      });
    }

    const exercise = await Exercise.findById(id);
    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: "Exercise not found.",
        error: "NOT_FOUND"
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        id: exercise._id,
        name: exercise.name,
        description: exercise.description,
        targetBodyPart: exercise.targetBodyPart,
        difficulty: exercise.difficulty,
        defaultSets: exercise.defaultSets,
        defaultReps: exercise.defaultReps,
        defaultDurationSeconds: exercise.defaultDurationSeconds,
        instructions: exercise.instructions,
        demonstrationMedia: exercise.demonstrationMedia,
        safetyInstructions: exercise.safetyInstructions,
        createdBy: exercise.createdBy,
        createdAt: exercise.createdAt,
        updatedAt: exercise.updatedAt
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve exercise details.",
      error: "SERVER_ERROR"
    });
  }
};

// POST /api/exercises - Create Exercise Entry (Therapist Only)
const createExercise = async (req, res) => {
  try {
    const validation = validateExerciseInput(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.errors.join(" "),
        error: "BAD_REQUEST"
      });
    }

    const {
      name,
      description,
      targetBodyPart,
      difficulty,
      defaultSets,
      defaultReps,
      defaultDurationSeconds,
      instructions,
      demonstrationMedia,
      safetyInstructions
    } = req.body;

    const existing = await Exercise.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "An exercise with this name already exists.",
        error: "BAD_REQUEST"
      });
    }

    const newExercise = await Exercise.create({
      name: name.trim(),
      description: description.trim(),
      targetBodyPart: targetBodyPart.trim(),
      difficulty,
      defaultSets: defaultSets || null,
      defaultReps: defaultReps || null,
      defaultDurationSeconds: defaultDurationSeconds || null,
      instructions,
      demonstrationMedia: demonstrationMedia || null,
      safetyInstructions: safetyInstructions || null,
      createdBy: req.user.id
    });

    return res.status(201).json({
      success: true,
      message: "Exercise created successfully",
      data: {
        id: newExercise._id,
        name: newExercise.name,
        description: newExercise.description,
        targetBodyPart: newExercise.targetBodyPart,
        difficulty: newExercise.difficulty,
        defaultSets: newExercise.defaultSets,
        defaultReps: newExercise.defaultReps,
        defaultDurationSeconds: newExercise.defaultDurationSeconds,
        instructions: newExercise.instructions,
        demonstrationMedia: newExercise.demonstrationMedia,
        safetyInstructions: newExercise.safetyInstructions,
        createdBy: newExercise.createdBy,
        createdAt: newExercise.createdAt,
        updatedAt: newExercise.updatedAt
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "An exercise with this name already exists.",
        error: "BAD_REQUEST"
      });
    }
    return res.status(500).json({
      success: false,
      message: "Failed to create exercise entry.",
      error: "SERVER_ERROR"
    });
  }
};

// PUT /api/exercises/:id - Update Exercise Entry (Therapist Only)
const updateExercise = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(404).json({
        success: false,
        message: "Exercise not found.",
        error: "NOT_FOUND"
      });
    }

    const validation = validateExerciseInput(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.errors.join(" "),
        error: "BAD_REQUEST"
      });
    }

    const exercise = await Exercise.findById(id);
    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: "Exercise not found.",
        error: "NOT_FOUND"
      });
    }

    const {
      name,
      description,
      targetBodyPart,
      difficulty,
      defaultSets,
      defaultReps,
      defaultDurationSeconds,
      instructions,
      demonstrationMedia,
      safetyInstructions
    } = req.body;

    exercise.name = name.trim();
    exercise.description = description.trim();
    exercise.targetBodyPart = targetBodyPart.trim();
    exercise.difficulty = difficulty;
    exercise.defaultSets = defaultSets !== undefined ? defaultSets : exercise.defaultSets;
    exercise.defaultReps = defaultReps !== undefined ? defaultReps : exercise.defaultReps;
    exercise.defaultDurationSeconds =
      defaultDurationSeconds !== undefined ? defaultDurationSeconds : exercise.defaultDurationSeconds;
    exercise.instructions = instructions;
    exercise.demonstrationMedia = demonstrationMedia !== undefined ? demonstrationMedia : exercise.demonstrationMedia;
    exercise.safetyInstructions = safetyInstructions !== undefined ? safetyInstructions : exercise.safetyInstructions;

    await exercise.save();

    return res.status(200).json({
      success: true,
      message: "Exercise updated successfully",
      data: {
        id: exercise._id,
        name: exercise.name,
        description: exercise.description,
        targetBodyPart: exercise.targetBodyPart,
        difficulty: exercise.difficulty,
        defaultSets: exercise.defaultSets,
        defaultReps: exercise.defaultReps,
        defaultDurationSeconds: exercise.defaultDurationSeconds,
        instructions: exercise.instructions,
        demonstrationMedia: exercise.demonstrationMedia,
        safetyInstructions: exercise.safetyInstructions,
        createdBy: exercise.createdBy,
        createdAt: exercise.createdAt,
        updatedAt: exercise.updatedAt
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update exercise.",
      error: "SERVER_ERROR"
    });
  }
};

// DELETE /api/exercises/:id - Delete Exercise Entry (Therapist Only)
const deleteExercise = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(404).json({
        success: false,
        message: "Exercise not found.",
        error: "NOT_FOUND"
      });
    }

    const exercise = await Exercise.findByIdAndDelete(id);
    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: "Exercise not found.",
        error: "NOT_FOUND"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Exercise deleted successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete exercise.",
      error: "SERVER_ERROR"
    });
  }
};

module.exports = {
  getExercises,
  getExerciseById,
  createExercise,
  updateExercise,
  deleteExercise
};
