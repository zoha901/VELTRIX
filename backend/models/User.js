const mongoose = require("mongoose");

// Subdocument Schema: AssignedExercise
const assignedExerciseSchema = new mongoose.Schema({
  exerciseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exercise",
    required: true
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  assignedAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  dueDate: {
    type: Date,
    default: null
  },
  targetSets: {
    type: Number,
    required: true
  },
  targetReps: {
    type: Number,
    default: null
  },
  targetDurationSeconds: {
    type: Number,
    default: null
  },
  frequency: {
    type: String,
    trim: true,
    default: null
  },
  status: {
    type: String,
    required: true,
    enum: ["active", "completed", "paused", "cancelled"],
    default: "active"
  },
  therapistNotes: {
    type: String,
    trim: true,
    default: null
  }
});

// Subdocument Schema: TherapistNote
const therapistNoteSchema = new mongoose.Schema({
  therapistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  note: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  }
});

// Core Entity Schema: User
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true,
      enum: ["PATIENT", "THERAPIST"]
    },
    assignedExercises: {
      type: [assignedExerciseSchema],
      default: []
    },
    therapistNotes: {
      type: [therapistNoteSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

// Case-insensitive unique index on email
userSchema.index(
  { email: 1 },
  { unique: true, collation: { locale: "en", strength: 2 } }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
