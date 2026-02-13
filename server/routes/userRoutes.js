// routes/users.routes.js

const express = require("express");
const router = express.Router();
const db = require("../models/mockUsersDb");

// GET all users (for testing / admin / discovery)
router.get("/", async (req, res) => {
  const [users] = await db.query("SELECT * FROM users");
  res.json(users);
});

// GET channel by ID
router.get("/:id", async (req, res) => {
  const [[user]] = await db.query(
    "SELECT * FROM users WHERE id = ?",
    [req.params.id]
  );

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
});

// REGISTER user
router.post("/register", async (req, res) => {
  const { username, email } = req.body;

  const [[exists]] = await db.query(
    "SELECT * FROM users WHERE username = ?",
    [username]
  );

  if (exists) {
    return res.status(409).json({ message: "Username already exists" });
  }

  const result = await db.query("INSERT INTO users VALUES ?", [
    {
      username,
      email,
      avatar: `https://i.pravatar.cc/100?u=${username}`,
      subscribers: 0,
      subscriptions: 0,
      joined: "just now",
      bio: "",
    },
  ]);

  res.status(201).json({
    id: result.insertId,
    username,
    email,
  });
});

// UPDATE profile
router.put("/:id", async (req, res) => {
  await db.query(
    "UPDATE users SET ? WHERE id = ?",
    [req.body, Number(req.params.id)]
  );

  res.json({ message: "Profile updated" });
});

module.exports = router;
