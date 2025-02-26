import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const ProfileHeader = ({ data, onLogout }) => {
  return (
    <header className="d-flex justify-content-between align-items-center px-4 py-3"
      style={{ backgroundColor: "#2C3930", color: "white", width: "100%" }}>
      
      {/* Left Section */}
      <h2 className="fw-bold m-0">
        Reboot Profile - {data?.user?.[0]?.login || "User"}
      </h2>

      {/* Right Section - Logout Button */}
      <button className="btn btn-danger" onClick={onLogout}>Logout</button>
    </header>
  );
};

export default ProfileHeader;
