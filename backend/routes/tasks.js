const express = require("express");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();

// Middleware
const verifyToken = (req, res, next) => {
  const bearer = req.headers.authorization;

  if (!bearer) {
    return res.status(401).json({ error: "No token" });
  }

  const token = bearer.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid token" });

    req.user = decoded;
    next();
  });
};

// GET tasks
router.get("/", verifyToken, (req, res) => {
  db.all(
    "SELECT * FROM tasks WHERE userId = ? ORDER BY id DESC",
    [req.user.id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: "DB error" });

      res.json(rows);
    }
  );
});

// ADD task
router.post("/", verifyToken, (req, res) => {
  const { text, category, dueDate } = req.body;

  db.run(
    "INSERT INTO tasks (userId, text, category, dueDate, completed) VALUES (?, ?, ?, ?, 0)",
    [req.user.id, text, category, dueDate],
    function (err) {
      if (err) return res.status(500).json({ error: "Insert failed" });

      res.json({
        id: this.lastID,
        text,
        category,
        dueDate,
        completed: 0,
      });
    }
  );
});

// DELETE task
router.delete("/:id", verifyToken, (req, res) => {
  db.run(
    "DELETE FROM tasks WHERE id = ? AND userId = ?",
    [req.params.id, req.user.id],
    function (err) {
      if (err) return res.status(500).json({ error: "Delete failed" });

      res.json({ message: "Task deleted" });
    }
  );
});

// TOGGLE task
router.put("/:id", verifyToken, (req, res) => {
  const { completed } = req.body;

  db.run(
    "UPDATE tasks SET completed = ? WHERE id = ? AND userId = ?",
    [completed ? 1 : 0, req.params.id, req.user.id],
    function (err) {
      if (err) return res.status(500).json({ error: "Update failed" });

      res.json({ message: "Task updated" });
    }
  );
});

router.patch("/:id", verifyToken, (req, res) => {
  const { text, dueDate, category } = req.body;

  db.run(
    "UPDATE tasks SET text = ?, dueDate = ?, category = ? WHERE id = ? AND userId = ?",
    [text, dueDate, category, req.params.id, req.user.id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: "Edit failed" });
      }

      res.json({ message: "Task updated" });
    }
  );
});

module.exports = router;