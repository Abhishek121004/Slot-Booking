import mongoose from "mongoose";

const slotSchema = new mongoose.Schema({
  time: String,
  subSlots: { type: Number, default: 3 },
  isBlocked: { type: Boolean, default: false }
});

const dateSchema = new mongoose.Schema({
  date: { type: String, unique: true },
  slots: [slotSchema]
});

export default mongoose.model("Slot", dateSchema);