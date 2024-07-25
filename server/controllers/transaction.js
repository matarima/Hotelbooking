const mongoose = require("mongoose");
const Transaction = require("../models/Transaction");
const Hotel = require("../models/Hotel");
const Room = require("../models/Room");
const User = require("../models/User");

// Kiểm tra và chuyển đổi chuỗi ngày thành đối tượng Date
const parseDate = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date)) {
    throw new Error(`Invalid date format: ${dateString}`);
  }
  return date;
};

exports.createTransaction = async (req, res, next) => {
  const { hotels, status, username, dateStart, dateEnd, price, payment, roomNumbers } = req.body;

  try {

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const hotelId = new mongoose.Types.ObjectId(hotels);
    const hotel = await Hotel.findById(hotelId);

    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    // Kiểm tra và định dạng danh sách phòng
    const formattedRooms = [];
    for (let room of roomNumbers) {
      const foundRoom = await Room.findOne({ "roomNumbers.number": room.number });
      if (!foundRoom) {
        return res.status(404).json({ message: `Room number ${room.number} not found in the specified hotel` });
      }

      const unavailableDates = room.unavailableDates.map(parseDate);

      formattedRooms.push({
        number: room.number,
        unavailableDates: unavailableDates
      });
    }

    const transaction = new Transaction({
      hotel: hotelId,
      status,
      user: username,
      dateStart: parseDate(dateStart),
      dateEnd: parseDate(dateEnd),
      price,
      payment,
      room: formattedRooms
    });

    const savedTransaction = await transaction.save();

    // Cập nhật trạng thái phòng
    for (let room of formattedRooms) {
      await Room.updateOne(
        { "roomNumbers.number": room.number },
        { $push: { "roomNumbers.$.unavailableDates": { $each: [parseDate(dateStart), parseDate(dateEnd)] } } }
      );
    }

    res.status(200).json(savedTransaction);
  } catch (err) {
    next(err);
  }
};

exports.getTransactionsByUserId = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    const transactions = await Transaction.find({ user: userId })
      .populate("hotel room")
      .exec();
    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getTransactionsByUsername = async (req, res, next) => {
  const username = req.params.username;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const transactions = await Transaction.find({ user: user._id })
      .populate('hotel room')
      .exec();
    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json(err);
  }
};
