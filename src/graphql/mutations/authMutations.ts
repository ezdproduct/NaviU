import { gql } from '@apollo/client';

export const REGISTER_USER_MUTATION = gql`
  mutation RegisterUser($username: String!, $email: String!, $password: String!) {
    registerUser(input: { username: $username, email: $email, password: $password }) {
      user {
        id
        username
        email
      }
    }
  }
`;