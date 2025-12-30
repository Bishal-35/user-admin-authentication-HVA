function role(requiredRole) {
  return (req, res, next) => {
    if (req.user.role !== requiredRole) {
      // If request expects HTML (page routes)
      if (req.accepts("html")) {
        return res.send(`
          <script>
            alert("Access denied");
            window.location = "/${req.user.role}";
          </script>
        `);
      }

      // API / JSON request
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  };
}

module.exports = role;
