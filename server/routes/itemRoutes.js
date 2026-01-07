const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const db = require("../config/db");

// GET items
router.get("/", authMiddleware, (req, res) => {
  const sql = "SELECT * FROM items";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// ADD item
router.post("/", authMiddleware, (req, res) => {
  const { title, description } = req.body;
  const sql = "INSERT INTO items (title, description) VALUES (?, ?)";
  db.query(sql, [title, description], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Item added successfully" });
  });
});

// DELETE item
router.delete("/:id", authMiddleware, (req, res) => {
  const sql = "DELETE FROM items WHERE id = ?";
  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Item deleted" });
  });
});

module.exports = router;