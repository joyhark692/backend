const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const router = express.Router();

// 🟢 LOGIN
router.post("/login", async (req, res) => {
  try {
    // 🛑 CRITICAL FIX: Check if req.body exists to prevent 502 crash
    if (!req.body) {
      return res.status(400).json({ success: false, message: "Request body required." });
    }

    const { email, password } = req.body;

    // Check for missing fields
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    // find user
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // check password (plain-text)
    if (user.password !== password)
      return res.status(401).json({ success: false, message: "Invalid password" });

    // generate token
    const token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });

    res.json({ success: true, token, user: { id: user._id, email: user.email } });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// 🟣 SIGNUP
router.post("/create-account", async (req, res) => {
  try {
    // 🛑 CRITICAL FIX: Check if req.body exists... (kept for safety)
    if (!req.body) {
      return res.status(400).json({ success: false, message: "Request body required." });
    }

    // 🔑 FIX 1: Add fullName to the destructured properties
    const { fullName, email, password } = req.body; 
    
    // Check for missing fields
    if (!fullName || !email || !password) { // 🔑 FIX 2: Check for fullName here too
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: "User already exists" });

    // 🔑 FIX 3: Include fullName in the Mongoose constructor
    const newUser = new User({ fullName, email, password }); 
    await newUser.save();

    res.status(201).json({ success: true, message: "Account created successfully" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;