import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/Navbar.css";
import navBarData from "../../data/navBar.json";
import { AuthContext } from "../../App";

const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [options, setOptions] = useState([]);

  useEffect(() => {
    setOptions(navBarData);
  }, []);

  const handleLogout = () => {
    logoutUser();
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleTransactions = () => {
    navigate("/transactions");
  };

  return (
    <nav className="navbar">
      <div className="navbar-top">
        <div className="navbar-logo">
          <Link to="/">Booking</Link>
        </div>
        <div className="navbar-links">
          {user ? (
            <>
              <span>{user.email}</span>
              <button onClick={handleTransactions}>Transactions</button>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
      <div className="navbar-options">
        {options.map((option, index) => (
          <div
            key={index}
            className={`navbar-option ${option.active ? "active" : ""}`}
          >
            <i className={`fas ${option.icon}`}></i>
            <span>{option.type}</span>
          </div>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
