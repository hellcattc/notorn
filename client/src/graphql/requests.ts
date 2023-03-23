import { gql } from "@apollo/client";

export const TOKEN_REQUEST = gql`
  query {
    getAccessToken {
      accessToken
    }
  }
`;

export const MY_INFO = gql`
  query {
    userProfileAPI {
      outeruserid
      email
      username
    }
  }
`;

export const SIGN_UP = gql`
  mutation ($username: String, $email: String!, $password: String!) {
    signUpAPI(
      user: { username: $username, email: $email, password: $password }
    ) {
      accessToken
    }
  }
`;
