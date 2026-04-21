import express from "express";
import Slot from "../models/Slot.js";

const router = express.Router();

router.get("/slots", async (req, res) => {
  const { date } = req.query;
  const data = await Slot.findOne({ date });
  res.json(data ? data.slots : []);
});

router.patch("/block", async (req, res) => {
  const { date, time } = req.body;

  await Slot.updateOne(
    { date, "slots.time": time },
    { $set: { "slots.$.isBlocked": true } }
  );

  res.json({ message: "Slot blocked" });
});

router.patch("/unblock", async (req, res) => {
  const { date, time } = req.body;

  await Slot.updateOne(
    { date, "slots.time": time },
    { $set: { "slots.$.isBlocked": false } }
  );

  res.json({ message: "Slot unblocked" });
});

export default router;