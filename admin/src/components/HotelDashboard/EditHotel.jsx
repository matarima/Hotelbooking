import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../utils/axiosConfig';
import Sidebar from '../AdminDashboard/Sidebar';
import './EditHotel.css';

const EditHotel = () => {
  const { id } = useParams();
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

  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        const response = await axios.get(`/admin/edit-hotel/${id}`);
        const hotelData = response.data;
        // Convert rooms and photos arrays to comma-separated strings
        const roomsString = hotelData.rooms.join(', ');
        const photosString = hotelData.photos.join(', ');
        setFormData({ ...hotelData, rooms: roomsString, photos: photosString });
      } catch (error) {
        console.error('Error fetching hotel details:', error);
      }
    };

    fetchHotelDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert rooms and photos strings back to arrays
    const roomsArray = formData.rooms.split(',').map(room => room.trim());
    const photosArray = formData.photos.split(',').map(photo => photo.trim());

    const updatedData = {
      ...formData,
      rooms: roomsArray,
      photos: photosArray,
    };

    try {
      await axios.put(`/admin/edit-hotel/${id}`, updatedData);
      alert('Hotel updated successfully');
      navigate('/admin/hotels');
    } catch (error) {
      console.error('Error updating hotel:', error);
    }
  };

  return (
    <div className="admin-dashboard">
      <Sidebar />
      <div className="main-content">
        <h2>Edit Hotel</h2>
        <form onSubmit={handleSubmit} className="edit-hotel-form">
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
          <button type="submit">Save</button>
          <button type="button" onClick={() => navigate('/admin/hotels')}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default EditHotel;