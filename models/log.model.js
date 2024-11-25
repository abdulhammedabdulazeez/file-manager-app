const mongoose = require("mongoose");

const logSchema = new mongoose.Schema(
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
    action: {
      type: String,
      enum: ["create", "update", "delete", "read"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Log", logSchema);
