const mongoose = require("mongoose");

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const validateExerciseInput = (body) => {
  const errors = [];
  const { name, description, targetBodyPart, difficulty, instructions } = body;

  if (!name || typeof name !== "string" || !name.trim()) {
    errors.push("Exercise name is required.");
  }
  if (!description || typeof description !== "string" || !description.trim()) {
    errors.push("Exercise description is required.");
  }
  if (!targetBodyPart || typeof targetBodyPart !== "string" || !targetBodyPart.trim()) {
    errors.push("Target body part is required.");
  }
  if (!difficulty || !["beginner", "intermediate", "advanced"].includes(difficulty)) {
    errors.push("Difficulty must be one of: beginner, intermediate, advanced.");
  }
  if (!instructions || !Array.isArray(instructions) || instructions.length === 0) {
    errors.push("Instructions must be a non-empty array of step-by-step strings.");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

const validateSessionInput = (body) => {
  const errors = [];
  const { exerciseId, setsCompleted, painBefore, painAfter, perceivedDifficulty } = body;

  if (!exerciseId || !isValidObjectId(exerciseId)) {
    errors.push("A valid exerciseId is required.");
  }
  if (setsCompleted === undefined || typeof setsCompleted !== "number" || setsCompleted <= 0) {
    errors.push("setsCompleted must be a positive number.");
  }
  if (painBefore === undefined || typeof painBefore !== "number" || painBefore < 0 || painBefore > 10) {
    errors.push("painBefore is required and must be a number between 0 and 10.");
  }
  if (painAfter === undefined || typeof painAfter !== "number" || painAfter < 0 || painAfter > 10) {
    errors.push("painAfter is required and must be a number between 0 and 10.");
  }
  if (!perceivedDifficulty || !["easy", "moderate", "hard"].includes(perceivedDifficulty)) {
    errors.push("perceivedDifficulty must be one of: easy, moderate, hard.");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = {
  isValidObjectId,
  validateExerciseInput,
  validateSessionInput
};
