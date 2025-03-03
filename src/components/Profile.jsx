import { useQuery, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import ProfileHeader from "./ProfileHeader";
import XPChart from "./XPChart";
import XPEarnedByProject from "./XPEarnedByProject";
import XPGrades from "./XPGrades";
import AuditChart from "./AuditChart";
import TransactionHistory from "./Transaction";

const GET_USER_DATA = gql`
  query {
    user {
      id
      login
      attrs
      campus
    }
    transaction(where: { type: { _eq: "xp" } }) {
      objectId
      amount
      createdAt
    }
    object {
      id
      name
      type
    }
    audit {
      auditorId
      groupId
      grade
      createdAt
    }
    result {
      userId
      groupId
    }
    progress {
      objectId
      grade
      object {
        name
      }
    }
  }
`;

const Profile = () => {
  const { loading, error, data } = useQuery(GET_USER_DATA);
  const navigate = useNavigate();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data: {error.message}</p>;

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("storage"));
    navigate("/");
  };

  // Extract User Data
  const user = data?.user?.[0] || {};
  const userId = user.id || "N/A";
  const firstName = user.attrs?.firstName || "User";
  const lastName = user.attrs?.lastName || "User";
  const email = user.attrs?.email || "N/A";
  const campus = user.campus || "N/A";
  const username = user.login || "user";

  // Calculate Total XP
// Create a mapping of projectId -> project name for projects only
const projectMap = data.object 
  .filter(obj => obj.type === "project" || obj.type === "piscine" || obj.type === "quest") // Ensure only objects of type 'project'
  .reduce((acc, obj) => {
    acc[obj.id] = obj.name;
    return acc;
  }, {});

// Calculate Total XP only for project transactions
const totalXP = data.transaction
  .filter(tx => projectMap[tx.objectId]) // Ensure XP comes from a project
  .reduce((sum, tx) => sum + tx.amount, 0);

const totalXPFormatted = `${(totalXP / 1000).toFixed(2)} KB`;

  // Calculate Audit Statistics
 // Filter transactions for "up" and "down"
const auditsDone = data.transaction.filter(tx => tx.type === "up").length;
const auditsReceived = data.transaction.filter(tx => tx.type === "down").length;

// Prevent division by zero
const auditRatio = auditsReceived > 0 ? (auditsDone / auditsReceived).toFixed(2) : "N/A";

  // Process XP by Project
  const resultArr = data.progress.map(progress => ({
    projectName: progress.object.name,
    xp: data.transaction
      .filter(tx => tx.objectId === progress.objectId)
      .reduce((sum, tx) => sum + tx.amount, 0),
    grade: progress.grade,
  }));

  return (
    <div style={{ backgroundColor: "#DCD7C9", minHeight: "100vh", paddingBottom: "20px" }}>
      {/* Full-Width Header */}
      <ProfileHeader data={data} onLogout={handleLogout} />

      {/* Welcome Message */}
      <div className="container text-center mt-5">
        <h1 className="fw-bold" style={{ fontSize: "3rem", color: "#2C3930" }}>
          Welcome,
          <span style={{ color: "#A27B5C" }}>
            {" "} {firstName} {lastName}!
          </span>
        </h1>
      </div>

      {/* Profile Information */}
      <div className="container mt-4">
        <div className="card shadow-lg p-4 text-white" style={{ backgroundColor: "#2C3930", borderRadius: "15px" }}>
          <div className="row">
            {/* Row 1 - Three Columns */}
            <div className="col-md-4 mb-3">
              <p><strong>ID:</strong> {userId}</p>
            </div>
            <div className="col-md-4 mb-3">
              <p><strong>First Name:</strong> {firstName}</p>
            </div>
            <div className="col-md-4 mb-3">
              <p><strong>Last Name:</strong> {lastName}</p>
            </div>
          </div>

          <div className="row">
            {/* Row 2 - Three Columns */}
            <div className="col-md-4 mb-3">
              <p><strong>Email:</strong> {email}</p>
            </div>
            <div className="col-md-4 mb-3">
              <p><strong>Campus:</strong> {campus}</p>
            </div>
            <div className="col-md-4 mb-3">
              <p><strong>Username:</strong> {username}</p>
            </div>
          </div>
        </div>
      </div>

      {/* XP & Audit Statistics */}
      <div className="container mt-5">
        <div className="row">
          {/* XP Statistics */}
          <div className="col-md-6">
            <div className="card p-4 shadow-sm" style={{ backgroundColor: "#A27B5C", borderRadius: "10px" }}>
              <h4 className="text-white text-center">Total XP</h4>
              <p className="text-center fw-bold" style={{ fontSize: "1.5rem" }}>{totalXPFormatted}</p>
            </div>
          </div>

          <h3 className="text-center fw-bold mt-4">All Transactions</h3>
<div className="container mt-3">
  <table className="table table-striped table-bordered shadow">
    <thead className="table-dark">
      <tr>
        <th>Project/Exercise</th>
        <th>Type</th>
        <th>XP (KB)</th>
        <th>Date</th>
      </tr>
    </thead>
    <tbody>
      {data?.transaction
        ?.filter(tx => data.object.some(obj => obj.id === tx.objectId ))
        .map((tx, index) => {
          const relatedObject = data.object.find(obj => obj.id === tx.objectId);
          return (
            <tr key={index}>
              <td>{relatedObject?.name || "Unknown"}</td>
              <td>{relatedObject?.type}</td>
              <td>{(tx.amount / 1000).toFixed(2)} KB</td>
              <td>{new Date(tx.createdAt).toLocaleDateString()}</td>
            </tr>
          );
        }) || (
        <tr>
          <td colSpan="4" className="text-center">No Transactions Available</td>
        </tr>
      )}
    </tbody>
  </table>
</div>

          {/* Audit Statistics */}
          <div className="col-md-6">
            <div className="card p-4 shadow-sm" style={{ backgroundColor: "#3F4F44", borderRadius: "10px" }}>
              <h4 className="text-white text-center">Audit Statistics</h4>
              <p className="text-white"><strong>Done:</strong> {auditsDone}</p>
              <p className="text-white"><strong>Received:</strong> {auditsReceived}</p>
              <p className="text-white"><strong>Ratio:</strong> {auditRatio}</p>
            </div>
          </div>
        </div>
      </div>

  {/* XP Grades Breakdown */}
      <div className="container mt-4">
        <XPGrades resultArr={resultArr} allProjectNames={data.progress.map(p => p.object.name)} />
      </div>

      {/* XP & Project Analysis */}
      <div className="container mt-4">
        <h3 className="text-center fw-bold mt-3">XP Progress Over Time</h3>
        <XPChart data={data.transaction} />

        <h3 className="text-center fw-bold mt-3">XP Earned by Project</h3>
        <XPEarnedByProject data={data} />

        
      </div>

      <h3>All XP Transactions</h3>
<ul>
  {data?.transaction?.map((tx, index) => (
    <li key={index}>
      <strong>Amount:</strong> {tx.amount} XP | 
      <strong> Date:</strong> {new Date(tx.createdAt).toLocaleDateString()} |
      <strong> Object ID:</strong> {tx.objectId || "N/A"}
    </li>
  )) || <p>No Transactions Available</p>}
</ul>

   
<div className="container">
  <TransactionHistory data={data} />
</div>;
    </div>
  );
};

export default Profile;
