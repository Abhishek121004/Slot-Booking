import express from "express";
import Slot from "../models/Slot.js";

const router = express.Router();

router.get("/slots", async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ error: "Date required" });
    }
    const data = await Slot.findOne({ date });
    // res.json(data ? data.slots : []);
    if (!data) {
  return res.status(404).json({ message: "No slots found for this date" });
}
res.json(data.slots);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.patch("/block", async (req, res) => {
  try {
    const { date, time } = req.body;
    if (!date || !time) {
      return res.status(400).json({ error: "Date and time required" });
    }

  const result = await Slot.updateOne(
    { date, "slots.time": time },
    { $set: { "slots.$.isBlocked": true } }
  );

   if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Slot not found" });
    }

   res.json({ message: "Slot blocked" });
}
catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.patch("/unblock", async (req, res) => {
  try {
    const { date, time } = req.body;
    if (!date || !time) {
      return res.status(400).json({ error: "Date and time required" });
    }

    const result = await Slot.updateOne(
      { date, "slots.time": time },
      { $set: { "slots.$.isBlocked": false } }
  );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Slot not found" });
    }

    res.json({ message: "Slot unblocked" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.patch("/reset", async (req, res) => {
  try {
    const { date, time } = req.body;
    if (!date || !time) {
      return res.status(400).json({ error: "Date and time required" });
    }

    const result = await Slot.updateOne(
      { date, "slots.time": time },
      { $set: { "slots.$.subSlots": 3 } }
  );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Slot not found" });
    }

    res.json({ message: "Slot reset" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// const result = await Slot.updateOne(
//   { date, "slots.time": time },
//   { $set: { "slots.$.isBlocked": false } }
// );

// console.log(result);

export default router;