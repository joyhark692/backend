// index.js
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import notesRoutes from "./routes/notes.routes.js";

dotenv.config();

const app = express();

// Allow requests from anywhere (adjust for production to restrict origin)
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json()); // parse JSON bodies

// MongoDB connection
const mongoUri = process.env.MONGO_URL;
if (!mongoUri) {
  console.error("MONGO_URL missing in environment");
  process.exit(1);
}
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => {
    console.error("❌ MongoDB connect error:", err.message || err);
  });

// Health check
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "NotesApp backend is running ✅" });
});

// Routes
app.use("/auth", authRoutes);

// JSON error handler (invalid JSON)
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    console.error("Bad JSON:", err.message);
    return res.status(400).json({ success: false, message: "Invalid JSON." });
  }
  next(err);
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
