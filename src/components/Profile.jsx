import { useQuery, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import ProfileHeader from "./ProfileHeader";
import XPChart from "./XPChart";
import XPEarnedByProject from "./XPEarnedByProject";

import AuditChart from "./AuditChart";

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
// Get the current user's ID
const userId = data?.user?.[0]?.id;

// Separate **audits done by the user**
const auditsDone = data?.audit?.filter(audit => audit.auditorId === userId) || [];

// Separate **audits received by the user** (based on group match)
const auditsReceived = data?.audit?.filter(audit =>
  data?.result?.some(result => result.userId === userId && result.groupId === audit.groupId)
) || [];

// Convert audits to MB format
const doneMB = (auditsDone.length );
const receivedMB = (auditsReceived.length );

// Calculate audit ratio
const auditRatio = auditsReceived.length > 0 
  ? (auditsDone.length / auditsReceived.length).toFixed(2)
  : "N/A";

  return (
    <div>
      {/* Full-Width Header */}
      <ProfileHeader data={data} onLogout={handleLogout} />
    <div>

      <h3>User ID: {data?.user?.[0]?.id || "No ID found"}</h3>
      <h3>First Name: {data?.user?.[0]?.attrs?.firstName || "FirstName not found"}</h3>

<h3>Last Name: {data?.user?.[0]?.attrs?.lastName || "LastName not found"}</h3>
      <h3>Email: {data?.user?.[0]?.attrs?.email || "Email not found"}</h3>
      <h3>Campus: {data?.user?.[0]?.campus || "Campus not found"}</h3>



    </div>
    
    <h3>Total XP: {(data?.transaction?.reduce((total, tx) => total + tx.amount, 0) / 1024).toFixed(2)} KB</h3>

    <h3>Total XP: {data?.transaction?.reduce((total, tx) => total + tx.amount, 0) || 0}</h3>

<h3>XP Transactions</h3>
<ul>
  {data?.transaction?.map((tx, index) => (
    <li key={index}>
      {tx.amount} XP earned on {new Date(tx.createdAt).toLocaleDateString()}
    </li>
  )) || <p>No XP Transactions</p>}
</ul>


<div className="container mt-4">
  <h3 className="fw-bold text-dark">Audit Ratio</h3>
  <div className="card shadow-sm p-4" style={{ backgroundColor: "#DCD7C9", borderRadius: "10px" }}>
    <div className="row text-center">
      <div className="col-md-4">
        <h5 className="text-dark">Audits Done</h5>
        <p className="text-muted">{doneMB} MB</p>
      </div>
      <div className="col-md-4">
        <h5 className="text-dark">Audits Received</h5>
        <p className="text-muted">{receivedMB} MB</p>
      </div>
      <div className="col-md-4">
        <h5 className="text-dark">Audit Ratio</h5>
        <p className={`fw-bold ${auditRatio < 1 ? "text-danger" : "text-success"}`}>{auditRatio}</p>
        {auditRatio < 1 ? <p className="text-danger">Make more audits!</p> : <p className="text-success">Good job!</p>}
      </div>
    </div>
  </div>
</div>


      <div className="container mt-4">
        <h3>XP Progress Over Time (SVG Graph)</h3>
        <XPChart data={data.transaction} />

        <h3>XP Earned by Project</h3>
        <XPEarnedByProject data={data} />

        <h3>Audit Pass/Fail Ratio</h3>
        <AuditChart data={data.audit} />
      </div>
    </div>
  );
};

export default Profile;
