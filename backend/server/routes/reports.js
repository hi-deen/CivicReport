import express from "express";
import Report from "../models/Report.js";
import ReportType from "../models/ReportType.js";
import upload from "../utils/cloudinary.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

// create report (public)
router.post("/", upload.array("media", 6), async (req, res) => {
  try {
    const { reportTypeSlug, data, lat, lng, anonymous = true } = req.body;
    const reportType = await ReportType.findOne({ slug: reportTypeSlug });
    if (!reportType) return res.status(400).json({ error: "Invalid report type" });

    // media upload middleware puts URLs in req.files if used
    const mediaUrls = (req.files || []).map(f => f.path || f.secure_url || f.url);

    const report = await Report.create({
      reportType: reportType._id,
      location: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
      data: data ? JSON.parse(data) : {},
      media: mediaUrls,
      anonymous: anonymous === "true" || anonymous === true
    });

    // Emit to sockets: new pending report (admin) and optionally verified reports
    const io = req.app.get("io");
    io.emit("report_created", { report });

    res.json({ report });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// get public verified reports (filter by type optional)
router.get("/", async (req, res) => {
  try {
    const { type } = req.query;
    const q = { status: "verified" };
    if (type) {
      const rt = await ReportType.findOne({ slug: type });
      if (!rt) return res.json({ reports: [] });
      q.reportType = rt._id;
    }
    const reports = await Report.find(q).populate("reportType").sort({ createdAt: -1 }).limit(500);
    res.json({ reports });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// admin-only: get pending
router.get("/pending", auth, async (req, res) => {
  try {
    const pending = await Report.find({ status: "pending" }).populate("reportType").sort({ createdAt: -1 });
    res.json({ pending });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// admin verify
router.patch("/:id/verify", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const report = await Report.findByIdAndUpdate(id, { status: "verified" }, { new: true }).populate("reportType");
    // emit update
    const io = req.app.get("io");
    io.emit("report_verified", { report });
    res.json({ report });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
