// models/notes.model.js
import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
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

// Optional index (good for faster lookups)
noteSchema.index({ userId: 1 });

// ✅ Correct ES module export
const Note = mongoose.model("Note", noteSchema);
export default Note;
