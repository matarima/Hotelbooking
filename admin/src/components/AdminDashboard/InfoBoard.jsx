import React from 'react';

const InfoBoard = ({ usersCount, transactionsCount, earnings, averageMonthlyEarnings }) => {
  return (
    <div className="info-board">
      <div className="info-card">
        <h3>Users</h3>
        <p>{usersCount}</p>
      </div>
      <div className="info-card">
        <h3>Transactions</h3>
        <p>{transactionsCount}</p>
      </div>
      <div className="info-card">
        <h3>Earnings</h3>
        <p>${earnings}</p>
      </div>
      <div className="info-card">
        <h3>Average Monthly Earnings</h3>
        <p>${averageMonthlyEarnings.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default InfoBoard;