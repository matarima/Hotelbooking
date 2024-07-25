import React, { useState } from 'react';
import axios from '../../utils/axiosConfig';
import '../AdminDashboard/AdminDashboard.css';  // Assuming the CSS file for styling
import Sidebar from '../AdminDashboard/Sidebar';
import { useNavigate } from 'react-router-dom';

const NewRoom = () => {
  const [formData, setFormData] = useState({
    title: '',
    desc: '',
    price: '',
    maxPeople: '',
    roomNumbers: '' // Lưu trữ roomNumbers dưới dạng chuỗi
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
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
      const response = await axios.post('/admin/add-room', { ...formData, roomNumbers: roomNumbersArray });
      if (response.status === 201) {
        setFormData({
          title: '',
          desc: '',
          price: '',
          maxPeople: '',
          roomNumbers: ''
        });
        
      }
      alert('Room added successfully');
      navigate('/admin/rooms');
    } catch (error) {
      console.error('Error adding room:', error);
    }
  };

  return (
    <div className="admin-dashboard">
      <Sidebar />
      <div className="main-content">
        <h2>Add New Room</h2>
        <form onSubmit={handleSubmit} className="new-room-form">
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
          <button type="submit" className="send-button">Send</button>
        </form>
      </div>
    </div>
  );
};

export default NewRoom;