const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  user: { type: String, required: true, ref: 'User' },
  hotel: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel", required: true },
  room: [{ 
    number: { type: Number, required: true },
    unavailableDates: { type: [Date], default: [] }
  }],
  dateStart: { type: Date, required: true },
  dateEnd: { type: Date, required: true },
  price: { type: Number, required: true },
  payment: { type: String, required: true, enum: ["Credit Card", "Cash"] },
  status: {
    type: String,
    required: true,
    enum: ["Booked", "Checkin", "Checkout"],
  },
});

module.exports = mongoose.model("Transaction", TransactionSchema);
