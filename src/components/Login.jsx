import { useState } from "react";
import axios from "axios";

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors
    try {
      const response = await axios.post(
        "https://learn.reboot01.com/api/auth/signin",
        {},
        {
          auth: {
            username: credentials.username,
            password: credentials.password,
          },
        }
      );

      console.log("✅ Full API Response:", response);

      if (response.data) {
        const token = response.data; // JWT token as string
        localStorage.setItem("token", response.data.access_token);
localStorage.setItem("refresh_token", response.data.refresh_token);

        console.log("🔐 Token saved successfully!");

        // Optional: Decode token for debug
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          console.log("🔍 Decoded token payload:", payload);
        } catch (decodeErr) {
          console.warn("⚠️ Could not decode token:", decodeErr);
        }

        onLogin(); // Navigate to profile
      } else {
        console.error("❌ No token received in response.");
        setError("Login failed. No token received.");
      }
    } catch (err) {
      console.error("Login error:", err.response ? err.response.data : err.message);
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div style={{ backgroundColor: "#DCD7C9", minHeight: "100vh", paddingBottom: "20px" }}>
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className="card p-4 shadow-lg" style={{ width: "350px" }}>
          <h2 className="text-center mb-4">Login</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Username or Email</label>
              <input
                type="text"
                name="username"
                className="form-control"
                placeholder="Enter username or email"
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Enter password"
                onChange={handleChange}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100"
              style={{ backgroundColor: "#2C3930" }}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
