import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getToken } from "./auth/storage";
import { API_BASE_URL } from '@/utils/constants'; // Import mới

const WP_BASE_URL = API_BASE_URL; // Sử dụng API_BASE_URL từ constants

const httpLink = new HttpLink({
  uri: `${WP_BASE_URL}/graphql`,
});

const authLink = setContext((_, { headers }) => {
  const token = getToken();
  return {
    headers: {
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});