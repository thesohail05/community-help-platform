import mongoose from "mongoose";

const helpRequestSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, required: true, trim: true, maxlength: 1000 },
  category: { type: String, required: true, enum: ["Education", "Food", "Healthcare", "Transport", "Volunteering", "Other"] },
  location: { type: String, required: true, trim: true, maxlength: 100 },
  requesterName: { type: String, required: true, trim: true, maxlength: 80 },
  status: { type: String, enum: ["Open", "Help offered", "Completed"], default: "Open" },
  helperName: { type: String, trim: true, maxlength: 80, default: "" }
}, { timestamps: true });

export default mongoose.model("HelpRequest", helpRequestSchema);
