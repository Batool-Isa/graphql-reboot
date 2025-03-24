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
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) throw new Error("No refresh token available");

    const response = await axios.post("https://your-api.com/refresh-token", {
      refresh_token: refreshToken, // 👈 or skip this if backend uses cookies
    });

    const newAccessToken = response.data.access_token;

    if (newAccessToken) {
      localStorage.setItem("token", newAccessToken);
      return newAccessToken;
    } else {
      throw new Error("No new token in response");
    }
  } catch (error) {
    console.error("🚨 Error refreshing token:", error);
    return null;
  }
};


const authLink = setContext(async (_, { headers }) => {
  let token = localStorage.getItem("token");

  if (tokenExpired(token)) {
    console.warn("⚠️ Token expired. Trying to refresh...");
    token = await refreshToken(); // 👈 TRY to get a new token

    if (!token) {
      console.error("❌ Token refresh failed. Logging out...");
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/";
      return { headers }; // Send no token
    }
  }

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});



export default client;