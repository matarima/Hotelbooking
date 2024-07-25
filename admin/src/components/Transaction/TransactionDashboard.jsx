import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosConfig";
import Sidebar from "../AdminDashboard/Sidebar";
import "./TransactionList.css";

const TransactionDashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(6);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get("/admin/transactions");
        setTransactions(response.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  // Get current transactions
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = transactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="admin-dashboard">
      <Sidebar />
      <div className="main-content">
        <h2>Transactions List</h2>
        <table className="transactions-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Hotel</th>
              <th>Room</th>
              <th>Date</th>
              <th>Price</th>
              <th>Payment Method</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {currentTransactions.map((transaction) => (
              <tr key={transaction._id}>
                <td>{transaction._id}</td>
                <td>{transaction.user}</td>
                <td>{transaction.hotel}</td>
                <td>{transaction.room.map((room) => room.number).join(", ")}</td>
                <td>
                  {new Date(transaction.dateStart).toLocaleDateString()} -{" "}
                  {new Date(transaction.dateEnd).toLocaleDateString()}
                </td>
                <td>${transaction.price}</td>
                <td>{transaction.payment}</td>
                <td>
                  <span className={`status ${transaction.status.toLowerCase()}`}>
                    {transaction.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &laquo;
          </button>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={
              currentPage ===
              Math.ceil(transactions.length / transactionsPerPage)
            }
          >
            &raquo;
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionDashboard;
