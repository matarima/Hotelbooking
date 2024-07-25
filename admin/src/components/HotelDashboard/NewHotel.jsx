import React, { useState } from 'react';
import axios from '../../utils/axiosConfig';
import '../AdminDashboard/AdminDashboard.css';  // Assuming the CSS file for styling
import Sidebar from '../AdminDashboard/Sidebar';
import { useNavigate } from 'react-router-dom';



const NewHotel = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    city: '',
    address: '',
    distance: '',
    title: '',
    desc: '',
    rating: '',
    cheapestPrice: '',
    featured: false,
    rooms: '',
    photos: '',
  });



  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    for (let key in formData) {
      if (formData[key] === '') {
        alert('Please fill all fields');
        return;
      }
    }

    // Add hotel

    try {
      const response = await axios.post('/admin/add-hotel', {
        ...formData,
        rooms: formData.rooms.split(',').map(room => room.trim()),
        photos: formData.photos.split(',').map(photo => photo.trim()) 

      });

      if (response.status === 201) {
        setFormData({
          name: '',
          type: '',
          city: '',
          address: '',
          distance: '',
          title: '',
          desc: '',
          rating: '',
          cheapestPrice: '',
          featured: false,
          rooms: '',
          photos: ''
        });
      }
      alert('Hotel added successfully');
      navigate('/admin/hotels');

    } catch (error) {
      console.error('Error adding hotel:', error);
    }
  };

  return (
    <div className="admin-dashboard">
      <Sidebar />
      <div className="main-content">
        <h2>Add New Hotel</h2>
        <form onSubmit={handleSubmit} className="new-hotel-form">
          <label>
            Name
            <input type="text" name="name" value={formData.name} onChange={handleChange} />
          </label>
          <label>
            Type
            <input type="text" name="type" value={formData.type} onChange={handleChange} />
          </label>
          <label>
            City
            <input type="text" name="city" value={formData.city} onChange={handleChange} />
          </label>
          <label>
            Address
            <input type="text" name="address" value={formData.address} onChange={handleChange} />
          </label>
          <label>
            Distance from City Center
            <input type="text" name="distance" value={formData.distance} onChange={handleChange} />
          </label>
          <label>
            Title
            <input type="text" name="title" value={formData.title} onChange={handleChange} />
          </label>
          <label>
            Description
            <textarea name="desc" value={formData.desc} onChange={handleChange} />
          </label>
          <label>
            Rating
            <input type="number" name="rating" value={formData.rating} onChange={handleChange} />
          </label>
          <label>
            Price
            <input type="text" name="cheapestPrice" value={formData.cheapestPrice} onChange={handleChange} />
          </label>
          <label>
            Featured
            <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} />
          </label>
          <label>
            Rooms
            <textarea name="rooms" value={formData.rooms} onChange={handleChange}></textarea>
          </label>
          <label>
            Photos
            <textarea name="photos" value={formData.photos} onChange={handleChange}></textarea>
          </label>
          <button type="submit" className="send-button" >Send</button>
        </form>
      </div>
    </div>
  );
};

export default NewHotel;