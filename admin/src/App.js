import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminLogin from './components/AdminLogin/AdminLogin.jsx';
import AdminDashboard from './components/AdminDashboard/AdminDashboard.jsx';
import PrivateRoute from './components/PriveRoute/PrivateRoute.jsx';
import HotelDashboard from './components/HotelDashboard/HotelDashboard.jsx';
import RoomDashboard from './components/RoomDashboard/RoomDashboard.jsx';
import NewHotel from './components/HotelDashboard/NewHotel.jsx';
import NewRoom from './components/RoomDashboard/NewRoom.jsx';
import EditHotel from './components/HotelDashboard/EditHotel.jsx';
import EditRoom from './components/RoomDashboard/EditRoom.jsx';
import TransactionDashboard from './components/Transaction/TransactionDashboard.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/" element={<AdminDashboard />} />
        <Route 
          path="/admin/hotels" 
          element={
            <PrivateRoute>
              <HotelDashboard />
            </PrivateRoute>
          } 
        />
        <Route 
          path='/admin/rooms'
          element={
            <PrivateRoute>
              <RoomDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/transactions"
          element={
            <PrivateRoute>
              <TransactionDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/new-hotel"
          element={
            <PrivateRoute>
              <NewHotel />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/new-room"
          element={
            <PrivateRoute>
              <NewRoom />
            </PrivateRoute>
          }
        />
        <Route 
          path='/admin/edit-hotel/:id'
          element={
            <PrivateRoute>
              <EditHotel />
            </PrivateRoute>
          }
        />
        <Route 
          path='/admin/edit-room/:id'
          element={
            <PrivateRoute>
              <EditRoom />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;