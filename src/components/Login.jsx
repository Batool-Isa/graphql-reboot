import { useState } from "react"; // this lib manages user input and errors
import axios from "axios";// used to send login request to server

const Login = ({ onLogin }) => {
    //siore username and pass or erro in case the login failed
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  //handle the changges when user update the input
  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'https://learn.reboot01.com/api/auth/signin',
        {}, // No body is required for Basic Auth
        {
          auth: {
            username: credentials.username,
            password: credentials.password
          }
        }
      );
  
      console.log("Full API Response:", response); // Debugging: Log the full response
  
      if (response.data) {
        console.log("Response Data (Token):", response.data); // Check what is inside response.data
        localStorage.setItem('token', response.data); // Store the token
        console.log("Token saved successfully!");
        onLogin(); // Redirect to profile
      } else {
        console.error("No token received in response.");
        setError('Login failed. No token received.');
      }
    } catch (err) {
      console.error("Login error:", err.response ? err.response.data : err.message);
      setError('Invalid credentials. Please try again.');
    }
  };
  

  return (
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
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
