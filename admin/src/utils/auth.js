// src/utils/auth.js
let isAdminLoggedIn = false; // Sử dụng let để có thể cập nhật giá trị

export const setIsAdminLoggedIn = (value) => {
  isAdminLoggedIn = value;
};

export const getIsAdminLoggedIn = () => {
  return isAdminLoggedIn;
};