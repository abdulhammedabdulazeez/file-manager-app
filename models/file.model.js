const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    path: { type: String, required: true },
    data: { type: String, required: true},
    type: { type: String, enum: ["file", "directory"], required: true },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("File", fileSchema);
