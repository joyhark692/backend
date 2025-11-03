// ✅ Import required packages
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js"; // make sure this path is correct

// ✅ Load environment variables from .env
dotenv.config();

// ✅ Initialize express app
const app = express();

// ✅ Middleware setup
app.use(express.json());

// ✅ Enable CORS (allow your frontend to talk to backend)
app.use(
  cors({
    origin: "*", // you can later replace * with your Netlify URL for security
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// ✅ Default route for checking server status
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "NotesApp backend is running ✅" });
});

// ✅ Main API routes
app.use("/api/auth", authRoutes);

// ✅ Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
