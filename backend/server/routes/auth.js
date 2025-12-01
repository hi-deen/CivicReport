import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const router = express.Router();

// NOTE: In production you'll use a proper users collection. For scaffolding: use ADMIN_USER + ADMIN_PASS env for login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (username !== process.env.ADMIN_USER) return res.status(401).json({ error: "Invalid" });
  const valid = password === process.env.ADMIN_PASS;
  if (!valid) return res.status(401).json({ error: "Invalid" });

  const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.json({ token });
});

export default router;
