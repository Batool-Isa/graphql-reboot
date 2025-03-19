import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import client from "./apolloClient";
import Login from "./components/Login";
import Profile from "./components/Profile";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

  const handleLogin = () => {
    localStorage.setItem("token", "dummy-token"); // Simulate authentication
    setIsAuthenticated(true);
  };

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);
    };

    const interval = setInterval(checkToken, 1000); // Check token updates every second
    return () => clearInterval(interval);
  }, []);

  return (
    <ApolloProvider client={client}>
      <Router>
        <Routes>
          {/* If authenticated, redirect to profile, otherwise show login */}
          <Route path="/" element={isAuthenticated ? <Navigate to="/profile" replace /> : <Login onLogin={handleLogin} />} />
          
          {/* Profile page - if not authenticated, redirect to login */}
          <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ApolloProvider>
  );
}

export default App;
