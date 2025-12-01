import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema({
  reportType: { type: mongoose.Schema.Types.ObjectId, ref: "ReportType", required: true },
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], index: "2dsphere" } // [lng, lat]
  },
  data: { type: Object }, // form data JSON
  media: { type: [String], default: [] }, // URLs
  status: { type: String, enum: ["pending", "verified", "rejected"], default: "pending" },
  reporterId: { type: String, default: null },
  anonymous: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("Report", ReportSchema);
