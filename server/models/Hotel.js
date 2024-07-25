const mongoose = require("mongoose");

const HotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: ["Hotel", "Apartments", "Resorts", "Villas", "Cabins"],
  },
  city: { type: String, required: true },
  address: { type: String, required: true },
  cheapestPrice: {type: Number, required: true},
  distance: { type: String, required: true },
  photos: { type: [String], required: true },
  desc: { type: String, required: true },
  title: { type: String, required: true },
  rating: { type: Number, required: true, min: 0, max: 5 },
  featured: { type: Boolean, default: false },
  rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: "Room" }],
});

module.exports = mongoose.model("Hotel", HotelSchema);