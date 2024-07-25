import React, { useEffect, useState } from 'react';
import axios from '../../utils/axiosConfig';
import './Transactions.css';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const username = localStorage.getItem('username');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(`/transaction/${username}`);
        setTransactions(response.data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchTransactions();
  }, [username]);

  return (
    <div className="transactions-container">
      <h2>Your Transactions</h2>
      <table className="transactions-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Hotel</th>
            <th>Rooms</th>
            <th>Date</th>
            <th>Price</th>
            <th>Payment Method</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr key={transaction._id}>
              <td>{index + 1}</td>
              <td>{transaction.hotel.name}</td>
              <td>{transaction.room.map(room => room.number).join(', ')}</td>
              <td>{new Date(transaction.dateStart).toLocaleDateString()} - {new Date(transaction.dateEnd).toLocaleDateString()}</td>
              <td>${transaction.price}</td>
              <td>{transaction.payment}</td>
              <td className={`status-${transaction.status.toLowerCase()}`}>{transaction.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Transactions;
