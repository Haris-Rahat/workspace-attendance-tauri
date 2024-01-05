import {gql} from '@apollo/client';

export const GET_USER_LIST = gql`
  query userList($status: userStatus) {
    userList(status: $status) {
      id
      firstName
      lastName
      avatar
      jobTitle {
        jobTitle
      }
    }
  }
`;
