const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db"); // ✅ FIXED (IMPORTANT)

const router = express.Router();
// ✅ REGISTER
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  // Basic validation
  if (!email?.trim() || !password?.trim()) {
  return res.status(400).json({ error: "Email and password required" });
}

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [email, hashedPassword],
      function (err) {
        if (err) {
          return res.status(400).json({ error: "User already exists" });
        }

        res.json({ message: "User registered successfully" });
      }
    );
  } catch (err) {
    res.status(500).json({ error: "Registration failed" });
  }
});
// ✅ LOGIN
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  // Basic validation
  if (!email?.trim() || !password?.trim()) {
  return res.status(400).json({ error: "Email and password required" });
}

  db.get(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, user) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }

      if (!user) {
        return res.status(400).json({ error: "User not found" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ error: "Invalid password" });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({ token });
    }
  );
});

module.exports = router;