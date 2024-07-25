const mongoose = require("mongoose");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const Hotel = require("../models/Hotel");
const Room = require("../models/Room");

exports.getDashboard = async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const transactionsCount = await Transaction.countDocuments();
    const totalEarnings = await Transaction.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$price" },
        },
      },
    ]);

    const earnings = totalEarnings[0]?.total ?? 0;
    const averageMonthlyEarnings = earnings / 12;

    res.status(200).json({
      usersCount,
      transactionsCount,
      earnings,
      averageMonthlyEarnings,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getLatestTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .sort({ createdAt: -1 })
      .limit(8);
    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find();
    res.status(200).json(hotels);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.editHotel = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    type,
    city,
    address,
    distance,
    photos,
    title,
    desc,
    rating,
    cheapestPrice,
    featured,
  } = req.body;
  try {
    await Hotel.findById(id).then((hotel) => {
      hotel.name = name;
      hotel.type = type;
      hotel.city = city;
      hotel.address = address;
      hotel.distance = distance;
      hotel.photos = photos;
      hotel.title = title;
      hotel.desc = desc;
      hotel.rating = rating;
      hotel.cheapestPrice = cheapestPrice;
      hotel.featured = featured;
      return hotel.save();
    });
    res.status(200).json({ message: "Hotel updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getEditHotel = async (req, res) => {
  const { id } = req.params;
  try {
    const hotel = await Hotel.findById(id);
    res.status(200).json(hotel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addHotel = async (req, res) => {
  const {
    name,
    type,
    city,
    address,
    distance,
    photos,
    title,
    desc,
    rating,
    cheapestPrice,
    featured,
    rooms,
  } = req.body;
  try {
    const newHotel = new Hotel({
      name,
      type,
      city,
      address,
      distance,
      photos,
      title,
      desc,
      rating,
      cheapestPrice,
      featured,
      rooms,
    });
    await newHotel.save();
    res.status(200).json({ message: "Hotel added successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteHotel = async (req, res) => {
  const hotelId = req.params.id;

  try {
    // Kiểm tra xem khách sạn có trong giao dịch nào không
    const existingTransaction = await Transaction.findOne({ hotel: hotelId });

    if (existingTransaction) {
      return res.status(400).json({ message: 'Không thể xóa khách sạn này vì đã có giao dịch liên quan.' });
    }

    const deletedHotel = await Hotel.findByIdAndDelete(hotelId);

    if (!deletedHotel) {
      return res.status(404).json({ message: 'Không tìm thấy khách sạn.' });
    }

    res.status(200).json({ message: 'Xóa khách sạn thành công.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}


exports.getEditRoom = async (req, res) => {
  const { id } = req.params;
  try {
    const room = await Room.findById(id);
    res.status(200).json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

exports.editRoom = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    price,
    maxPeople,
    desc,
    roomNumbers,
  } = req.body;
  try {
    await Room.findById(id).then((room) => {
      room.title = title;
      room.price = price;
      room.maxPeople = maxPeople;
      room.desc = desc;
      room.roomNumbers = roomNumbers;
      return room.save();
    });
    res.status(200).json({ message: "Room updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

exports.addRoom = async (req, res) => {
  const {
    title,
    price,
    maxPeople,
    desc,
    roomNumbers,
  } = req.body;
  try {
    const newRoom = new Room({
      title,
      price,
      maxPeople,
      desc,
      roomNumbers,
    });
    await newRoom.save();
    res.status(200).json({ message: "Room added successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

exports.deleteRoom = async (req, res) => {
  const roomId = req.params.id;

  try {
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check if the room is booked
    if (room.isBooked) {
      return res.status(400).json({ message: 'Cannot delete room, it is currently booked' });
    }

    await Room.findByIdAndDelete(roomId);
    res.status(200).json({ message: 'Room deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}