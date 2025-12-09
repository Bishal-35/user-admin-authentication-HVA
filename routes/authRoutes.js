const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if email already exists
    const exists = await User.findOne({ email });
    if (exists) return res.json({ message: "Email already exists" });

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create a new user with default role "user"
    await User.create({
      name,
      email,
      password: hashed,
      role: "user", // ✔ important!
    });

    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.json({ error: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.json({ message: "Incorrect password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ message: "Login successful", token, role: user.role });
  } catch (err) {
    res.json({ error: err.message });
  }
});

module.exports = router;
