import mongoose from "mongoose";

const ReportTypeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  icon: String,
  color: String,
  schema: { type: Object, default: {} } // JSON schema for dynamic form
}, { timestamps: true });

export default mongoose.model("ReportType", ReportTypeSchema);
