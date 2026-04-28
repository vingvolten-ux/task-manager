import express from "express";
import jwt from "jsonwebtoken";
import pool from "../db.js";

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
router.get("/", verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM tasks WHERE user_id = $1 ORDER BY id DESC",
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

// ADD task
router.post("/", verifyToken, async (req, res) => {
  const { text, category, dueDate } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO tasks (user_id, text, category, due_date, completed) VALUES ($1, $2, $3, $4, false) RETURNING *",
      [req.user.id, text, category, dueDate]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Insert failed" });
  }
});

// DELETE
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM tasks WHERE id = $1 AND user_id = $2",
      [req.params.id, req.user.id]
    );
    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Delete failed" });
  }
});

// TOGGLE completed
router.put("/:id", verifyToken, async (req, res) => {
  const { completed } = req.body;

  try {
    await pool.query(
      "UPDATE tasks SET completed = $1 WHERE id = $2 AND user_id = $3",
      [completed, req.params.id, req.user.id]
    );
    res.json({ message: "Task updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Update failed" });
  }
});

// EDIT text/date/category
router.patch("/:id", verifyToken, async (req, res) => {
  const { text, dueDate, category } = req.body;

  try {
    await pool.query(
      "UPDATE tasks SET text = $1, due_date = $2, category = $3 WHERE id = $4 AND user_id = $5",
      [text, dueDate, category, req.params.id, req.user.id]
    );
    res.json({ message: "Task updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Edit failed" });
  }
});

export default router;