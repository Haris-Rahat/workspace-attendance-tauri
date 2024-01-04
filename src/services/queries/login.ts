import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  query login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      email
      lastLogin
      token
      user {
        id
        firstName
        lastName
      }
    }
  }
`;

export const CHECK_SUBDOMAIN_EXISTANCE = gql`
  query CHECK_SUBDOMAIN_EXISTANCE($domain: String!) {
    exists: checkSubDomain(subDomain: $domain)
  }
`;