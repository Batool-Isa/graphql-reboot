//This file is to connect to thte GraphQl API
/* Import nesseray libraries,
apolloClinet -> to communicate with graphql endpoint,
inmemorycahc -> to stored fetched data in memory,
createHttpLink -> connect client to graphql api, 
set context -> allow us to attach auth token to each request */
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import axios from "axios"; // Import axios for token refresh

const httpLink = createHttpLink({
  uri: "https://learn.reboot01.com/api/graphql-engine/v1/graphql",
});


// Function to check if token is expired
const tokenExpired = (token) => {
  if (!token) return true; // No token, assume expired
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now(); // Check expiration
  } catch (e) {
    return true; // Consider token expired if parsing fails
  }
};

// Function to refresh token
const refreshToken = async () => {
  try {
    const refresh_token = localStorage.getItem("refresh_token"); // Get refresh token
    if (!refresh_token) throw new Error("No refresh token available");

    const response = await axios.post("https://learn.reboot01.com/api/auth/refresh", {}, {
      headers: { Authorization: `Bearer ${refresh_token}` },
    });

    const newToken = response.data.access_token;
    localStorage.setItem("token", newToken);
    console.log("🔄 Token refreshed successfully");
    return newToken;
  } catch (error) {
    console.error("🚨 Error refreshing token:", error);
    localStorage.removeItem("token"); // Remove invalid token
    localStorage.removeItem("refresh_token"); // Remove refresh token (if failed)
    return null;
  }
};

// Middleware to attach token to requests
const authLink = setContext(async (_, { headers }) => {
  let token = localStorage.getItem("token");

  // If token is expired, refresh it
  if (tokenExpired(token)) {
    console.warn("⚠️ Token expired, refreshing...");
    token = await refreshToken();
  }

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "", // Attach new or existing token
    },
  };
});

// Create Apollo Client
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;