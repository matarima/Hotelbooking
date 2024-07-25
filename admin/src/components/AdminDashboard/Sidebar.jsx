import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ onLogout }) => {
  return (
    <div className="sidebar">
      <h2>Admin Page</h2>
      <ul>
        <li><Link to="/">Dashboard</Link></li>
        {/* <li><Link to="/admin/users">Users</Link></li> */}
        <li><Link to="/admin/hotels">Hotels</Link></li>
        <li><Link to="/admin/rooms">Rooms</Link></li>
        <li><Link to="/admin/transactions">Transactions</Link></li>
        <li><Link to="/admin/new-hotel">New Hotel</Link></li>
        <li><Link to="/admin/new-room">New Room</Link></li>
      </ul>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
};

export default Sidebar;