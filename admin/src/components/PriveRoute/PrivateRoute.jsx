// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { getIsAdminLoggedIn } from '../../utils/auth';

const PrivateRoute = ({ children }) => {
  if (getIsAdminLoggedIn()) {
    return children; // Hiển thị component nếu đã đăng nhập
  } else {
    return <Navigate to="/admin/login" />; // Chuyển hướng đến trang login nếu chưa
  }
};

export default PrivateRoute;