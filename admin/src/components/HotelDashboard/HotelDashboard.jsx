import React, { useState, useEffect } from 'react';
import axios from '../../utils/axiosConfig';
import '../AdminDashboard/AdminDashboard.css';  // Assuming the CSS file for styling
import Sidebar from '../AdminDashboard/Sidebar';
import { useNavigate } from 'react-router-dom';

const HotelDashboard = () => {
  const [hotels, setHotels] = useState([]);

  const navigate = useNavigate();


  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await axios.get('/admin/hotels');
        setHotels(response.data);
      } catch (error) {
        console.error('Error fetching hotels:', error);
      }
    };

    fetchHotels();
  }, []);

  const handleDelete = async (hotelId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this hotel?');
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`/admin/delete-hotel/${hotelId}`);
      if (response.status === 200) {
        setHotels(hotels.filter(hotel => hotel._id !== hotelId));
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        window.alert(error.response.data.message);
      } else {
        console.error('Error deleting hotel:', error);
      }
    }
  };

  const handleEdit = (hotelId) => {
    navigate(`/admin/edit-hotel/${hotelId}`);
  };

  const handleAddNewClick = () => {
    navigate('/admin/new-hotel');
  };

  return (
    <div className="admin-dashboard">
      <Sidebar />
      <div className="main-content">
        <div className="hotels-list-header">
          <h2>Hotels List</h2>
          <button className="add-new-button" onClick={handleAddNewClick}>Add New</button>
        </div>
        <table className="hotels-list-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Type</th>
              <th>Title</th>
              <th>City</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {hotels.map(hotel => (
              <tr key={hotel._id}>
                <td>{hotel._id}</td>
                <td>{hotel.name}</td>
                <td>{hotel.type}</td>
                <td>{hotel.title}</td>
                <td>{hotel.city}</td>
                <td>
                  <button className='edit-button' onClick={() => handleEdit(hotel._id)}>Edit</button>
                  <button className="delete-button" onClick={() => handleDelete(hotel._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HotelDashboard;