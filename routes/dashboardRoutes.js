const express = require("express");
const Task = require("../models/Task");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

const router = express.Router();

// USER DASHBOARD API
router.get("/user", auth, role("user"), async (req, res) => {
  const tasks = await Task.find({ userId: req.user.id });
  res.json({ tasks });
});

// ADMIN DASHBOARD API
router.get("/admin", auth, role("admin"), async (req, res) => {
  const tasks = await Task.find().populate("userId", "email");
  res.json({ tasks });
});

module.exports = router;
