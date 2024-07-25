const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  maxPeople: { type: Number, required: true },
  desc: { type: String, required: true },
  roomNumbers: [
    {
      number: Number,
      unavailableDates: { type: [Date] }, // Update để bao gồm các ngày không khả dụng
    },
  ],
});

module.exports = mongoose.model("Room", RoomSchema);