import { Router } from "express";
import mongoose from "mongoose";
import HelpRequest from "../models/HelpRequest.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { search = "", category = "", status = "" } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } }
      ];
    }
    res.json(await HelpRequest.find(filter).sort({ createdAt: -1 }));
  } catch {
    res.status(500).json({ message: "Could not load help requests." });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, description, category, location, requesterName } = req.body;
    if (![title, description, category, location, requesterName].every(v => typeof v === "string" && v.trim())) {
      return res.status(400).json({ message: "Please fill in every required field." });
    }
    const item = await HelpRequest.create({ title, description, category, location, requesterName });
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message || "Could not create request." });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid request ID." });
    const allowed = ["status", "helperName", "title", "description", "category", "location"];
    const updates = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
    const item = await HelpRequest.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ message: "Request not found." });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message || "Could not update request." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid request ID." });
    const item = await HelpRequest.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Request not found." });
    res.json({ message: "Request deleted." });
  } catch {
    res.status(500).json({ message: "Could not delete request." });
  }
});

export default router;
