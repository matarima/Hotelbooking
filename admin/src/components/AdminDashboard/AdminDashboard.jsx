import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosConfig';
import Sidebar from './Sidebar';
import InfoBoard from './InfoBoard';
import TransactionList from '../Transaction/TransactionList';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [usersCount, setUsersCount] = useState(0);
  const [transactionsCount, setTransactionsCount] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [averageMonthlyEarnings, setAverageMonthlyEarnings] = useState(0);
  const [latestTransactions, setLatestTransactions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboardResponse = await axios.get('/admin/dashboard');
        const transactionsResponse = await axios.get('/admin/latest-transactions');

        setUsersCount(dashboardResponse.data.usersCount);
        setTransactionsCount(dashboardResponse.data.transactionsCount);
        setEarnings(dashboardResponse.data.earnings);
        setAverageMonthlyEarnings(dashboardResponse.data.averageMonthlyEarnings);
        setLatestTransactions(transactionsResponse.data);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('/auth/logoutAdmin');
      navigate("/admin/login");
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="admin-dashboard">
      <Sidebar onLogout={handleLogout} />
      <div className="main-content">
        <InfoBoard
          usersCount={usersCount}
          transactionsCount={transactionsCount}
          earnings={earnings}
          averageMonthlyEarnings={averageMonthlyEarnings}
        />
        <TransactionList transactions={latestTransactions} />
      </div>
    </div>
  );
};

export default AdminDashboard;