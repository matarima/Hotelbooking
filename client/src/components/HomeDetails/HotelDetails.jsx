import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../utils/axiosConfig"; // Sử dụng axios instance
import { AuthContext } from "../../App"; // Import AuthContext
import "./HotelDetails.css";

const HotelDetails = () => {
  const [hotel, setHotel] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    startDate: "",
    endDate: "",
    fullName: "",
    email: "",
    phoneNumber: "",
    cardNumber: "",
    paymentMethod: "Credit Card",
    status: "Booked", // Mặc định là Booked
  });
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [totalBill, setTotalBill] = useState(0);
  const { id } = useParams(); // Lấy hotelID từ URL
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // Lấy thông tin người dùng từ AuthContext

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const response = await axios.get(`/hotel/${id}`);
        setHotel(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching hotel details:", error);
      }
    };

    fetchHotel();
  }, [id]);

  const handleDateChange = (e, field) => {
    setBookingDetails({
      ...bookingDetails,
      [field]: e.target.value,
    });
  };

  const handleRoomSelect = (roomId, roomNumber, price) => {
    const roomObj = { id: roomId, number: roomNumber, price: price };
    const isSelected = selectedRooms.some((room) => room.id === roomId);

    if (isSelected) {
      setSelectedRooms(selectedRooms.filter((room) => room.id !== roomId));
    } else {
      setSelectedRooms([...selectedRooms, roomObj]);
    }
  };

  useEffect(() => {
    const calculateTotalBill = () => {
      const nights =
        (new Date(bookingDetails.endDate) -
          new Date(bookingDetails.startDate)) /
        (1000 * 60 * 60 * 24);
      const total = selectedRooms.reduce(
        (acc, room) => acc + room.price * nights,
        0
      );
      setTotalBill(total);
    };
    calculateTotalBill();
  }, [selectedRooms, bookingDetails.startDate, bookingDetails.endDate]);

  const handleBooking = async () => {
    try {
      const username = localStorage.getItem("username"); // Lấy username từ localStorage

      if (!username) {
        console.error("Username not found!");
        return;
      }
      const response = await axios.post("/transaction", {
        hotels: id, // Sử dụng 'hotel' thay vì 'hotels'
        roomNumbers: selectedRooms.map((room) => ({
          number: room.number,
          unavailableDates: [bookingDetails.startDate, bookingDetails.endDate],
        })),
        dateStart: bookingDetails.startDate,
        dateEnd: bookingDetails.endDate,
        price: totalBill,
        payment: bookingDetails.paymentMethod,
        username: username,
        status: bookingDetails.status, // Sử dụng giá trị status động
      });

      if (response.status === 200) {
        navigate("/transactions");
      }
    } catch (error) {
      console.error("Error processing booking:", error);
    }
  };

  const handleShowBookingForm = () => {
    if (!user) {
      navigate("/login");
    } else {
      setShowBookingForm(!showBookingForm);
    }
  };

  if (!hotel) {
    return <div>Loading...</div>; // Hiển thị loading trong khi chờ dữ liệu
  }

  return (
    <div className="hotel-details">
      <h1>{hotel.name}</h1>
      <p>{hotel.address}</p>
      <p>Excellent location - {hotel.distance}m from center</p>
      <div className="images-container">
        {hotel.photos.map((photo, index) => (
          <img key={index} src={photo} alt={`Hình ảnh ${index + 1}`} />
        ))}
      </div>
      <p>{hotel.desc}</p>
      <div className="price-container">
        <p>${hotel.cheapestPrice} (1 night)</p>
        <button onClick={handleShowBookingForm}>
          Reserve or Book Now!
        </button>
      </div>
      {showBookingForm && (
        <div className="booking-form">
          <div className="booking-dates">
            <label>Dates</label>
            <div className="date-picker-wrapper">
              <input
                type="date"
                value={bookingDetails.startDate}
                className="date-input"
                onChange={(e) => handleDateChange(e, "startDate")}
              />
              <span> - </span>
              <input
                type="date"
                value={bookingDetails.endDate}
                className="date-input"
                onChange={(e) => handleDateChange(e, "endDate")}
              />
            </div>
          </div>
          <div className="reserve-info">
            <label>Your Full Name:</label>
            <input
              type="text"
              placeholder="Full Name"
              value={bookingDetails.fullName}
              onChange={(e) =>
                setBookingDetails({
                  ...bookingDetails,
                  fullName: e.target.value,
                })
              }
            />
            <label>Your Email:</label>
            <input
              type="email"
              placeholder="Email"
              value={bookingDetails.email}
              onChange={(e) =>
                setBookingDetails({ ...bookingDetails, email: e.target.value })
              }
            />
            <label>Your Phone Number:</label>
            <input
              type="text"
              placeholder="Phone Number"
              value={bookingDetails.phoneNumber}
              onChange={(e) =>
                setBookingDetails({
                  ...bookingDetails,
                  phoneNumber: e.target.value,
                })
              }
            />
            <label>Your Identity Card Number:</label>
            <input
              type="text"
              placeholder="Card Number"
              value={bookingDetails.cardNumber}
              onChange={(e) =>
                setBookingDetails({
                  ...bookingDetails,
                  cardNumber: e.target.value,
                })
              }
            />
          </div>
          <div className="select-rooms">
            <label>Select Rooms</label>
            {hotel.rooms.map((room) => (
              <div key={room._id} className="room-item">
                <span>{room.title}</span> {/* Hiển thị roomTitle */}
                <p style={{ fontSize: "14px", color: "gray" }}>
                  {room.desc}
                </p>{" "}
                {/* Hiển thị mô tả của phòng */}
                <p>Max people: {room.maxPeople}</p>{" "}
                {/* Hiển thị số lượng người tối đa */}
                <p>${room.price}</p> {/* Hiển thị giá */}
                <div>
                  {room.roomNumbers.map((roomNumber) => (
                    <label key={roomNumber._id} style={{ marginRight: "10px" }}>
                      <input
                        type="checkbox"
                        className="room-checkbox"
                        value={roomNumber.number}
                        checked={selectedRooms.some(
                          (room) => room.id === roomNumber._id
                        )}
                        onChange={() =>
                          handleRoomSelect(
                            roomNumber._id,
                            roomNumber.number,
                            room.price
                          )
                        }
                      />
                      {roomNumber.number}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="total-bill">
            <label>Total Bill: ${totalBill.toFixed(2)}</label>
          </div>
          <div className="payment-method">
            <label>Select Payment Method:</label>
            <select
              value={bookingDetails.paymentMethod}
              onChange={(e) =>
                setBookingDetails({
                  ...bookingDetails,
                  paymentMethod: e.target.value,
                })
              }
            >
              <option value="Credit Card">Credit Card</option>
              <option value="Cash">Cash</option>
            </select>
          </div>
          <button onClick={handleBooking} className="reserve-button">
            Reserve Now
          </button>
        </div>
      )}
    </div>
  );
};

export default HotelDetails;
