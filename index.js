// index.js

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js"; // your auth route file
import noteRoutes from "./routes/notes.routes.js"; // your notes route file (if used)

dotenv.config();
const app = express();

// ✅ Middleware
app.use(express.json()); // Parse JSON request bodies

// ✅ CORS Setup (allows frontend to call backend)
app.use(
  cors({
    origin: "*", // you can replace * with your Netlify URL later for security
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Database Connection
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Root Route (for testing)
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "NotesApp backend is running ✅" });
});

// ✅ API Routes
app.use("/api", authRoutes);
app.use("/api/notes", noteRoutes);

// ✅ Error Handling for Invalid JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    console.error("❌ Invalid JSON:", err.message);
    return res.status(400).send({ success: false, message: "Invalid JSON format." });
  }
  next(err);
});

// ✅ Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
