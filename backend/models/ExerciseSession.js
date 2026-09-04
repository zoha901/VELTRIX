const mongoose = require("mongoose");

const sessionResultsSchema = new mongoose.Schema(
  {
    accuracyPercentage: {
      type: Number,
      default: null
    },
    feedback: {
      type: String,
      default: null
    }
  },
  { _id: false }
);

const exerciseSessionSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    exerciseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exercise",
      required: true
    },
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null
    },
    completedAt: {
      type: Date,
      required: true,
      default: Date.now,
      index: true
    },
    setsCompleted: {
      type: Number,
      required: true
    },
    repsCompleted: {
      type: Number,
      default: null
    },
    durationSeconds: {
      type: Number,
      default: null
    },
    painBefore: {
      type: Number,
      required: true,
      min: 0,
      max: 10
    },
    painAfter: {
      type: Number,
      required: true,
      min: 0,
      max: 10
    },
    perceivedDifficulty: {
      type: String,
      enum: ["easy", "moderate", "hard"],
      required: true
    },
    sessionResults: {
      type: sessionResultsSchema,
      default: () => ({})
    }
  },
  {
    timestamps: true,
    collection: "exercise_sessions"
  }
);

module.exports = mongoose.model("ExerciseSession", exerciseSessionSchema);
