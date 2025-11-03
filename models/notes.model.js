const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, default: "" },
    content: { type: String, default: "" },
    isPinned: { type: Boolean, default: false },
  },
  { timestamps: true }
);
NoteSchema.index({ userId: 1 });

module.exports = mongoose.model("Note", NoteSchema);
