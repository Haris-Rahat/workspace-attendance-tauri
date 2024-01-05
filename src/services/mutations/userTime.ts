import { gql } from "@apollo/client";

export const CREATE_USER_TIME = gql`
  mutation CreateUserTime($input: UserTimeCreate) {
    userTimeCreate(input: $input) {
      id
    }
  }
`;
