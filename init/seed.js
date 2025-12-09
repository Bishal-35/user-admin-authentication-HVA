require("dotenv").config();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/User");
const Task = require("../models/Task");

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected. Starting seed...");

    // Clear old data
    await User.deleteMany({});
    await Task.deleteMany({});

    // ----------------------
    // Create Admin User
    // ----------------------
    const adminPassword = await bcrypt.hash("admin123", 10);
    const admin = await User.create({
      name: "Admin",
      email: "admin@hyperverge.co",
      password: adminPassword,
      role: "admin",
    });

    console.log("Admin user created:", admin.email);

    // ----------------------
    // Create Normal User
    // ----------------------
    const userPassword = await bcrypt.hash("123456", 10);
    const testUser = await User.create({
      name: "Test User",
      email: "user@test.com",
      password: userPassword,
      role: "user",
    });

    console.log("Normal user created:", testUser.email);

    // ----------------------
    // Admin Tasks
    // ----------------------
    await Task.create([
      {
        title: "Admin Task 1",
        description: "Review project submissions",
        userId: admin._id,
      },
      {
        title: "Admin Task 2",
        description: "Analyze team performance",
        userId: admin._id,
      },
    ]);

    console.log("Admin tasks created.");

    // ----------------------
    // User Tasks
    // ----------------------
    await Task.create([
      {
        title: "User Task 1",
        description: "Complete assignment",
        userId: testUser._id,
      },
      {
        title: "User Task 2",
        description: "Prepare for meeting",
        userId: testUser._id,
      },
      {
        title: "User Task 3",
        description: "Read documentation",
        userId: testUser._id,
      },
    ]);

    console.log("Test user tasks created.");

    console.log("\n🎉 Seeding completed successfully!");
    process.exit();
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seed();
