import express from "express";
import Slot from "../models/Slot.js";
import { generateSlots } from "../utils/generateSlots.js";

const router = express.Router();

router.get("/slots", async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: "Date is required" });
    }

    let data = await Slot.findOne({ date });

    if (!data) {
      data = await Slot.create({
        date,
        slots: generateSlots()
      });
    }

    const response = data.slots.map((slot) => ({
      time: slot.time,
      status:
        slot.subSlots > 0 && !slot.isBlocked ? "green" : "red"
    }));

    res.json(response);
  } catch (err) {
    console.error("🔥 ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/book", async (req, res) => {
  try {
    const { date, time } = req.body;

    const updated = await Slot.findOneAndUpdate(
      {
        date,
        "slots.time": time,
        "slots.subSlots": { $gt: 0 },
        "slots.isBlocked": false
      },
      {
        $inc: { "slots.$.subSlots": -1 }
      },
      { new: true }
    );

    if (!updated) {
      return res.status(400).json({ message: "Slot not available" });
    }

    res.json({ message: "Booking successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;