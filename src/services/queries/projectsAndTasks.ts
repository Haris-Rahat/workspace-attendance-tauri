import { gql } from "@apollo/client";

export const GET_PROJECTS_AND_TASKS_QUERY = gql`
  query projectsByUser($userId: ID) {
    projectsByUser(userId: $userId) {
      id
      name
      tasks {
        id
        task
      }
    }
  }
`;
