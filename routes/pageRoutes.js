const express = require("express");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

const router = express.Router();


//LOGIN PAGE
router.get("/", (req, res) => {
    const token = req.cookies.token;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            return res.send(`
        <script>
          alert("A user is already logged in. Please logout first.");
          window.location = "${decoded.role === "admin" ? "/admin" : "/user"}";
        </script>
      `);
        } catch (err) {
        }
    }

    res.render("login");
});


//REGISTER PAGE
router.get("/register", (req, res) => {
    const token = req.cookies.token;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            return res.send(`
        <script>
          alert("Please logout before registering a new user.");
          window.location = "${decoded.role === "admin" ? "/admin" : "/user"}";
        </script>
      `);
        } catch (err) {
        }
    }

    res.render("register");
});


//ADMIN DASHBOARD
router.get("/admin", auth, role("admin"), (req, res) => {
    res.render("admin");
});


//USER DASHBOARD
router.get("/user", auth, role("user"), (req, res) => {
    res.render("user");
});

module.exports = router;
