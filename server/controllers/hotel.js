const Hotel = require("../models/Hotel");
const Room = require("../models/Room");

exports.getHomepageData = async (req, res) => {
  try {
    const hotels = await Hotel.find();

    // Lấy số lượng khách sạn theo khu vực
    const numOfHotelsByArea = hotels.reduce((acc, hotel) => {
      if (!acc[hotel.city]) {
        acc[hotel.city] = 0;
      }
      acc[hotel.city]++;
      return acc;
    }, {});

    // Lấy số lượng khách sạn theo loại
    const numOfHotelsByType = hotels.reduce((acc, hotel) => {
      if (!acc[hotel.type]) {
        acc[hotel.type] = 0;
      }
      acc[hotel.type]++;
      return acc;
    }, {});

    // Lấy top 3 khách sạn có rating cao nhất
    const topHotels = hotels.sort((a, b) => b.rating - a.rating).slice(0, 3);

    res.json({
      numOfHotelsByArea,
      numOfHotelsByType,
      topHotels: topHotels.map((hotel) => ({
        id: hotel._id,
        name: hotel.name,
        city: hotel.city,
        cheapestPrice: hotel.cheapestPrice,
        rating: hotel.rating,
        image: hotel.photos[0], // Assume the first photo is the main photo
        address: hotel.address,
        distance: hotel.distance,
        desc: hotel.desc,
        featured: hotel.featured,
        rooms: hotel.rooms,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// exports.searchHotels = (req, res) => {
//   const { city, startDate, endDate, numPeople, numRooms } = req.query;

//   // Chuyển đổi dạng ngày tháng
//   const start = new Date(startDate);
//   const end = new Date(endDate);

//   // Tìm phòng phù hợp
//   Room.find({
//     "roomNumbers.unavailableDates": { $not: { $elemMatch: { $gte: start, $lt: end } } },
//     maxPeople: { $gte: numPeople }
//   }).exec().then(rooms => {
//     const roomIds = rooms.map(room => room._id);

//     // Tìm khách sạn ở thành phố mong muốn có phòng phù hợp
//     return Hotel.find({ city, rooms: { $in: roomIds } })
//       .populate("rooms")
//       .exec()
//   }).then(hotels => {
//     // Lọc khách sạn có đủ số phòng mong muốn
//     const filteredHotels = hotels.filter(hotel => {
//       let availableRoomsCount = 0;

//       hotel.rooms.forEach(room => {
//         const availableRoomNumbersCount = room.roomNumbers.filter(roomNumber => {
//           return !room.unavailableDates.some(date => date >= start && date < endDate);
//         }).length;

//         if (availableRoomNumbersCount > 0) {
//           availableRoomsCount++;
//         }
//       });

//       return availableRoomsCount >= numRooms;
//     });

//     res.status(200).json(filteredHotels);
//   }).catch(error => {
//     res.status(500).json({ error: "Internal server error" });
//   });
// };
exports.searchHotels = async (req, res) => {
  const { city, checkIn, checkOut, guests, rooms: numRooms } = req.query;

  if (!city || !checkIn || !checkOut || !guests || !numRooms) {
    return res.status(400).json({ error: "Tất cả các trường tìm kiếm đều là bắt buộc." });
  }

  try {
    // Tìm các khách sạn trong khu vực mong muốn
    const hotels = await Hotel.find({ city }).populate('rooms').exec();

    const availableHotels = [];

    for (const hotel of hotels) {
      // Kiểm tra các phòng phù hợp với yêu cầu đặt phòng
      const availableRooms = [];
      for (const roomId of hotel.rooms) {
        const room = await Room.findById(roomId);
        
        if (!room) continue;

        // Kiểm tra phòng có trống trong khoảng thời gian đó không
        const isRoomAvailable = room.roomNumbers.some(rn => {
          return !rn.unavailableDates.some(date => {
            // Kiểm tra xem date có nằm trong khoảng thời gian checkIn-checkOut không
            return new Date(checkIn) <= date && date <= new Date(checkOut); 
          });
        });

        if (isRoomAvailable) {
          availableRooms.push(room);
        }
      }
      // Kiểm tra đủ số lượng phòng yêu cầu
      if (availableRooms.length >= numRooms) {
        availableHotels.push({
          hotel,
          availableRooms: availableRooms.slice(0, numRooms)
        });
      }
    }

    if (availableHotels.length === 0) {
      return res.status(404).json({ error: `Không tìm thấy khách sạn nào tại ${city} thỏa mãn yêu cầu.` });
    }

    res.status(200).json(availableHotels);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi máy chủ nội bộ." });
  }
};

exports.getHotelById = async (req, res) => {
  const { id } = req.params;

  try {
    const hotel = await Hotel.findById(id).populate('rooms').exec();

    if (!hotel) {
      return res.status(404).json({ error: "Không tìm thấy khách sạn với ID này." });
    }

    res.status(200).json(hotel);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi máy chủ nội bộ." });
  }
};