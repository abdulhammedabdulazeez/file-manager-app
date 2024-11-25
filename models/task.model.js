const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
      required: true,
    },
    taskType: { type: String, enum: ["upload", "delete"], required: true },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed", "failed"],
      default: "pending",
    },
    progress: { type: Number, default: 0 }, // 0-100%
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
