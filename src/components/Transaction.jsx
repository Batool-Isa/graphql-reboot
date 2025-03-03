import React, { useState } from "react";

const TransactionHistory = ({ data }) => {
  const [showAll, setShowAll] = useState(false); // State to toggle showing all transactions

  if (!data || !data.transaction || data.transaction.length === 0) {
    return <p>No transactions available</p>;
  }

  // Create a mapping of objectId -> project object
  const projectMap = data.object.reduce((acc, obj) => {
    acc[obj.id] = obj; // Store the full object here
    return acc;
  }, {});

  // Filter transactions to include only project-related XP transactions
  const projectTransactions = data.transaction
    .filter(tx => projectMap[tx.objectId]) // Ensure objectId is linked to a project
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by latest date

  // Get the transactions to show based on whether "showAll" is true or false
  const transactionsToShow = showAll ? projectTransactions : projectTransactions.slice(0, 5);

  return (
    <div className="container mt-4">
      <h3 className="text-center fw-bold mb-3">Transaction History</h3>

      <table className="table table-striped table-bordered shadow">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>XP Earned</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {transactionsToShow.map((tx, index) => {
            const project = projectMap[tx.objectId];
            return (
              <tr key={index}>
                <td>{project ? project.name : "Unknown Project"}</td>
                <td>{project ? project.type : "Unknown Type"}</td>
                <td>{(tx.amount / 1000).toFixed(2)} KB</td>
                <td>{new Date(tx.createdAt).toLocaleDateString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Show All Button */}
      {!showAll && projectTransactions.length > 5 && (
        <button
          className="btn btn-primary mt-3"
          onClick={() => setShowAll(true)}
        >
          Show All Transactions
        </button>
      )}
      {showAll && (
        <button
          className="btn btn-secondary mt-3"
          onClick={() => setShowAll(false)}
        >
          Show Less
        </button>
      )}
    </div>
  );
};

export default TransactionHistory;
