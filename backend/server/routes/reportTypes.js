import express from "express";
import ReportType from "../models/ReportType.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

// get all types (public)
router.get("/", async (req, res) => {
  const types = await ReportType.find().sort({ name: 1 });
  res.json({ types });
});

// admin create type
router.post("/", auth, async (req, res) => {
  const { name, slug, icon, color, schema } = req.body;
  const t = await ReportType.create({ name, slug, icon, color, schema });
  res.json({ type: t });
});

export default router;
