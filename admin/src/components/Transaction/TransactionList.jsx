import React from "react";

const TransactionList = ({ transactions }) => {
  return (
    <div className="transaction-list">
      <h2>Latest Transactions</h2>
      <table>
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
          {transactions.map((transaction) => (
            <tr key={transaction._id}>
              <td>{transaction._id}</td>
              <td>{transaction.user}</td>
              <td>{transaction.hotel}</td>
              <td> {transaction.room.map((room) => room.number).join(", ")}</td>
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
    </div>
  );
};

export default TransactionList;
