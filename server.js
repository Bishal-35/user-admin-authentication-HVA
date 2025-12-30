require("dotenv").config();
const express = require("express");
const connectDB = require("./init/db");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");


const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const pageRoutes = require("./routes/pageRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static files
app.use(express.static(path.join(__dirname, "public")));

// DB
connectDB();

// Routes
app.use("/auth", authRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/", pageRoutes);

// Default route
app.get("/", (req, res) => res.render("login"));

app.get("/admin", (req, res) => {
  res.render("admin");
});

app.get("/user", (req, res) => {
  res.render("user");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});
