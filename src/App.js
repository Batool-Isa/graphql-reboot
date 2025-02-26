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
    setIsAuthenticated(true);
  };

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token); // Update state when token changes
    };

    window.addEventListener("storage", checkToken); // Listen for token changes
    return () => window.removeEventListener("storage", checkToken);
  }, []);

  return (
    <ApolloProvider client={client}>
      <Router>
        <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/profile" /> : <Login onLogin={handleLogin} />} />

          <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/" />} />
        </Routes>
      </Router>
    </ApolloProvider>
  );
}

export default App;
