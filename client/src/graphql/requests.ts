import { gql } from "@apollo/client";

export const TOKEN_REQUEST = gql`
  query {
    refreshToken {
      accessToken
    }
  }
`;

export const MY_INFO = gql`
  query {
    userProfile {
      outeruserid
      email
      username
    }
  }
`;

export const SIGN_UP = gql`
  mutation ($username: String, $email: String!, $password: String!) {
    signUp(user: { username: $username, email: $email, password: $password }) {
      accessToken
    }
  }
`;
