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
  const projectMap = data.object
    .filter(obj => obj.type === "project" || obj.type === "exercise" || obj.type === "piscine") // Ensure only objects of type 'project' or 'exercise'
    .reduce((acc, obj) => {
      acc[obj.id] = obj.name;
      return acc;
    }, {});

  // Get the first project to determine the submission date
  const firstProject = data.object
    .filter(obj => obj.type === "project")
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))[0]; // Sorting by creation date to get the first project

  // Get the submission date of the first project
  const firstProjectSubmissionDate = firstProject ? new Date(firstProject.createdAt) : null;

  // Calculate Total XP only for project transactions and exercise transactions after the first project submission
  const totalXP = data.transaction
    .filter(tx => {
      const obj = data.object.find(o => o.id === tx.objectId);
      if (obj) {
        if (obj.type === "project" || obj.type === "piscine") {
          return true; // Include project transactions
        }
        if (obj.type === "exercise" && firstProjectSubmissionDate) {
          const txDate = new Date(tx.timestamp);
          return txDate > firstProjectSubmissionDate;
        }

      }
      return false;
    })
    .reduce((sum, tx) => sum + tx.amount, 0);

  // Format the total XP
  const totalXPFormatted = `${(totalXP / 1000)} KB`; // Assuming the total XP is in KB (divide by 1000 if in bytes)

  console.log(totalXPFormatted);


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

          <div className=" container">
            <TransactionHistory data={data} />
          </div>

        
        </div>
      </div>

      {/* XP Grades Breakdown */}
      <div className="container mt-4">
        <XPGrades resultArr={resultArr} allProjectNames={data.progress.map(p => p.object.name)} />
      </div>

      {/* XP & Project Analysis */}
      <div className="container mt-4">
        <XPChart data={data.transaction} />

        <XPEarnedByProject data={data} />


      </div>



    </div>
  );
};

export default Profile;
