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

    const data = await Slot.findOne({ date });

    if (!data) {
      return res.status(404).json({ message: "Date not found" });
    }

    // 🔍 Find index (IMPORTANT)
    const slotIndex = data.slots.findIndex(s => s.time === time);

    if (slotIndex === -1) {
      return res.status(404).json({ message: "Slot not found" });
    }

    const slot = data.slots[slotIndex];

    // 🔴 VALIDATIONS
    if (slot.isBlocked) {
      return res.status(400).json({ message: "Slot is blocked" });
    }

    if (slot.subSlots <= 0) {
      return res.status(400).json({ message: "Slot not available" });
    }

    // ✅ UPDATE safely
    data.slots[slotIndex].subSlots -= 1;

    await data.save();

    res.json({ message: "Booking successful" });

  } catch (err) {
    console.error("BOOK ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;