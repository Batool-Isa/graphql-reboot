import React from "react";

const TransactionHistory = ({ data }) => {
  if (!data || !data.transaction || data.transaction.length === 0) {
    return <p>No transactions available</p>;
  }

  // Create a mapping of objectId -> project name
  const projectMap = data.object
  .filter(obj => obj.type === "project")
  .reduce((acc, obj) => {
    acc[obj.id] = obj.name;
    return acc;
  }, {});

  // Filter transactions to include only project-related XP transactions
  const projectTransactions = data.transaction
    .filter(tx => projectMap[tx.objectId]) // Ensure objectId is linked to a project
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by latest date
    .slice(0, 5); // Keep only the last 5 transactions
  return (
    <div className="container mt-4">
      <h3 className="fw-bold mb-3">Last 5 Project Transactions</h3>

      <table className="table table-striped table-bordered shadow">
        <thead className="table-dark">
          <tr>
            <th>Project</th>
            <th>XP Earned</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {projectTransactions.map((tx, index) => (
            <tr key={index}>
              <td>{projectMap[tx.objectId] || "Unknown Project"}</td>
              <td>{(tx.amount / 1000).toFixed(2)} KB</td>

              <td>{new Date(tx.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionHistory;
