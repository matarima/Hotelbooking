import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosConfig';
import '../AdminDashboard/AdminDashboard.css';  // Assuming the CSS file for styling
import Sidebar from '../AdminDashboard/Sidebar';

const RoomDashboard = () => {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get('/admin/rooms');
        setRooms(response.data);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    fetchRooms();
  }, []);

  const handleDelete = async (roomId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this room?');
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`/admin/delete-room/${roomId}`);
      if (response.status === 200) {
        setRooms(rooms.filter(room => room._id !== roomId));
      } else if (response.data.message) {
        window.alert(response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        window.alert(error.response.data.message);
      } else {
        console.error('Error deleting room:', error);
      }
    }
  };

  const handleAddNewClick = () => {
    navigate('/admin/new-room');
  };

  const handleEdit = (roomId) => {
    navigate(`/admin/edit-room/${roomId}`);
  };

  return (
    <div className="admin-dashboard">
      <Sidebar />
      <div className="main-content">
        <div className="rooms-list-header">
          <h2>Rooms List</h2>
          <button className="add-new-button" onClick={handleAddNewClick}>Add New</button>
        </div>
        <table className="rooms-list-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Price</th>
              <th>Max People</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map(room => (
              <tr key={room._id}>
                <td>{room._id}</td>
                <td>{room.title}</td>
                <td>{room.desc}</td>
                <td>{room.price}</td>
                <td>{room.maxPeople}</td>
                <td>                  
                  <button className="edit-button" onClick={() => handleEdit(room._id)}>Edit</button>
                  <button className="delete-button" onClick={() => handleDelete(room._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoomDashboard;