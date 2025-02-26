//This file is to connect to thte GraphQl API
/* Import nesseray libraries,
apolloClinet -> to communicate with graphql endpoint,
inmemorycahc -> to stored fetched data in memory,
createHttpLink -> connect client to graphql api, 
set context -> allow us to attach auth token to each request */
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
const httpLink = createHttpLink({
  uri: "https://learn.reboot01.com/api/graphql-engine/v1/graphql",
});

//modify each request to send the token with it
const authLink  = setContext((_, {  headers = {}  }) => {
    //get the token from the browser local storage
    const token = localStorage.getItem("token");
    console.log("Token being sent in request:", token); // Debugging: Check if token is sent

  return {
    headers: {
      ...headers, //send the token in the header
      authorization: token ? `Bearer ${token}` : "",

    },
  };
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});

export default client;
