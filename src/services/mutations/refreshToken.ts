import { gql } from "@apollo/client";

export const REFRESH_TOKEN = gql`
  mutation refreshToken($token: String!) {
    refreshToken(token: $token)
  }
`;
