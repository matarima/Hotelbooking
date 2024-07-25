import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home/Home.jsx";
import Login from "./pages/Login/Login.jsx";
import Register from "./pages/Register/Register.jsx";
import Search from "./pages/Search/Search.jsx";
import HotelDetails from "./components/HomeDetails/HotelDetails.jsx";
import Transactions from "./components/Transactions/Transactions.jsx";
import MainLayout from "./components/MainLayout/MainLayout.jsx";
import OtherLayout from "./components/OtherLayout/OtherLayout.jsx";
import { SearchProvider } from "./SearchContext";

import "./App.css";
export const AuthContext = React.createContext();

function App() {
  const [user, setUser] = useState(null);

  const loginUser = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  useEffect(() => {
    // Check từ local storage hoặc session để xác định người dùng đã đăng nhập chưa.
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
      <Router>
        <SearchProvider>
          <Routes>
            <Route
              path="/"
              element={
                <MainLayout>
                  <Home />
                </MainLayout>
              }
            />
            <Route
              path="/search"
              element={
                <OtherLayout>
                  <Search />
                </OtherLayout>
              }
            />
            <Route
              path="/login"
              element={
                <PublicRoute user={user}>
                  <OtherLayout>
                    <Login />
                  </OtherLayout>
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute user={user}>
                  <OtherLayout>
                    <Register />
                  </OtherLayout>
                </PublicRoute>
              }
            />
            <Route
              path="/hotel/:id"
              element={
                <OtherLayout>
                  <HotelDetails />
                </OtherLayout>
              }
            />
            <Route
              path="/transactions"
              element={
                <PrivateRoute user={user}>
                  <OtherLayout>
                    <Transactions />
                  </OtherLayout>
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </SearchProvider>
      </Router>
    </AuthContext.Provider>
  );
}

// PublicRoute kiểm tra người dùng đã đăng nhập chưa để chuyển hướng
const PublicRoute = ({ user, children }) => {
  return user ? <Navigate to="/" /> : children;
};

// PrivateRoute kiểm tra người dùng đã đăng nhập, nếu không, chuyển hướng tới trang đăng nhập
const PrivateRoute = ({ user, children }) => {
  return user ? children : <Navigate to="/login" />;
};

export default App;
