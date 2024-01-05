import { gql } from "@apollo/client";

export const GET_GENERAL_SETTINGS = gql`
  query generalSettings {
    generalSettings {
      timezone {
        name
      }
    }
  }
`;
