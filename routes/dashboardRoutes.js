const express = require("express");
const Task = require("../models/Task");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

const router = express.Router();

// USER DASHBOARD
router.get("/user", auth, role("user"), async (req, res) => {
  // console.log("Logged in userId:", req.user.id);
  const tasks = await Task.find({ userId: req.user.id });
  // console.log("Tasks returned:", tasks);
  res.json({ tasks });
});

// ADMIN DASHBOARD
router.get("/admin", auth, role("admin"), async (req, res) => {
  const tasks = await Task.find().populate("userId", "email");
  res.json({ tasks });
});

module.exports = router;
