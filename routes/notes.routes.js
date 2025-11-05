// routes/notes.routes.js
import express from "express";
import Note from "../models/notes.model.js";
import { authenticateToken } from "../utilities.js";

const router = express.Router();

// Get all notes
router.get("/", authenticateToken, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id }).sort({ updatedAt: -1 });
    res.json({ success: true, notes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Create note
router.post("/add", authenticateToken, async (req, res) => {
  try {
    const { title, content, isPinned } = req.body;
    if (!title && !content)
      return res.status(400).json({ success: false, message: "Title or content required" });

    const newNote = new Note({
      userId: req.user.id,
      title,
      content,
      isPinned: isPinned || false,
    });

    await newNote.save();
    res.status(201).json({ success: true, note: newNote });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete note
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!note) return res.status(404).json({ success: false, message: "Note not found" });
    res.json({ success: true, message: "Note deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
