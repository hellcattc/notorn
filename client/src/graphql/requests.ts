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
      userid
      email
      username
    }
  }
`;
