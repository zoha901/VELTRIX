const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    targetBodyPart: {
      type: String,
      required: true,
      trim: true
    },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true
    },
    defaultSets: {
      type: Number,
      default: null
    },
    defaultReps: {
      type: Number,
      default: null
    },
    defaultDurationSeconds: {
      type: Number,
      default: null
    },
    instructions: {
      type: [String],
      required: true,
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: "At least one instruction step is required."
      }
    },
    demonstrationMedia: {
      type: String,
      default: null
    },
    safetyInstructions: {
      type: String,
      default: null
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Exercise", exerciseSchema);
