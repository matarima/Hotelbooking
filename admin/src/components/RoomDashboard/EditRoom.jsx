import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../utils/axiosConfig";
import Sidebar from "../AdminDashboard/Sidebar";
import './EditRoom.css'
const EditRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    price: "",
    maxPeople: "",
    roomNumbers: "",
  });

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await axios.get(`/admin/edit-room/${id}`);
        const roomData = response.data;
        const roomNumbersString = roomData.roomNumbers.map(room => room.number).join(', ');
        setFormData({ ...roomData, roomNumbers: roomNumbersString });
      } catch (error) {
        console.error("Error fetching room details:", error);
      }
    };

    fetchRoomDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Convert roomNumbers string to an array of objects with number fields
    const roomNumbersArray = formData.roomNumbers.split(/[,\s]+/).map(number => ({ number: parseInt(number) })).filter(room => !isNaN(room.number));

    // Validate form data
    for (let key in formData) {
      if (key !== 'roomNumbers' && formData[key] === '') {
        alert('Please fill all fields');
        return;
      }
    }

    if (roomNumbersArray.length === 0) {
      alert('Please enter at least one room number');
      return;
    }
    try {
      await axios.put(`/admin/edit-room/${id}`, { ...formData, roomNumbers: roomNumbersArray });
      alert("Room updated successfully");
      navigate("/admin/rooms");
    } catch (error) {
      console.error("Error updating room:", error);
    }
  };

  return (
    <div className="admin-dashboard">
      <Sidebar />
      <div className="main-content">
        <h2>Edit Room</h2>
        <form onSubmit={handleSubmit} className="edit-room-form">
        <label>
            Title
            <input type="text" name="title" value={formData.title} onChange={handleChange} />
          </label>
          <label>
            Description
            <textarea name="desc" value={formData.desc} onChange={handleChange} />
          </label>
          <label>
            Price
            <input type="text" name="price" value={formData.price} onChange={handleChange} />
          </label>
          <label>
            Max People
            <input type="text" name="maxPeople" value={formData.maxPeople} onChange={handleChange} />
          </label>
          <label>
            Room Numbers (separated by commas or spaces)
            <textarea
              name="roomNumbers"
              value={formData.roomNumbers}
              onChange={handleChange}
            />
          </label>
          <button type="submit" className="edit-button">Save</button>
          <button type="button" className="send-button" onClick={() => navigate('/admin/rooms')}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default EditRoom;
