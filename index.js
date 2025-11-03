process.on('uncaughtException', (err) => {
    console.error('💥 Uncaught Exception:', err.message, err.stack);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('⚠️ Unhandled Rejection:', reason.stack || reason);
});

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { authenticateToken } = require("./utilities");

const noteRoutes = require("./routes/notes.routes");
const authRoutes = require("./routes/auth.routes");

const app = express();
const PORT = process.env.PORT || 8000; // Define port here

// 1. ✅ BODY PARSER (Must come before routes to populate req.body)
app.use(express.json());

// 2. ✅ ALLOW CORS
const allowedOrigin = process.env.ALLOWED_ORIGIN || "http://localhost:5173";
app.use(
    cors({
        origin: allowedOrigin,
        credentials: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: 'Content-Type, Authorization',
    })
);

// 3. ✅ CONNECT TO MONGODB
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

// 4. ✅ ROOT ROUTE & API ROUTES

// Base Health Check Route
app.get("/", (req, res) => {
    res.json({ status: "ok", service: "Notes Backend" });
});

// 🚀 FIX: Revert to standard /api prefix to match client requests (Solves 404 Error)
app.use("/api", authRoutes);      // Handles /api/login, /api/create-account
app.use("/api/notes", authenticateToken, noteRoutes); // Handles /api/notes/...

app.get("/api/protected", authenticateToken, (req, res) => {
    res.json({ success: true, message: "You have access!", user: req.user });
});


// 5. 🛑 CRITICAL FIX: JSON ERROR HANDLER (Must come after body parser and routes)
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error('💥 Bad JSON received. Sending 400:', err.message);
        return res.status(400).send({ success: false, message: 'Invalid JSON format in request body.' });
    }
    next(err); // Pass other errors down the line
});


// 6. 🚀 START THE SERVER
// Use 0.0.0.0 for Docker compatibility
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server listening on port ${PORT}`);
});