import {gql} from '@apollo/client';

export const GET_USER_LIST = gql`
  query userList($status: userStatus) {
    userList(status: $status) {
      id
      employeeNum
      firstName
      lastName
      middleName
      preferredName
      avatar
      jobTitle {
        jobTitle
      }
      location {
        city
        location
        country {
          name
        }
        postalCode
        province {
          name
        }
      }
      status
      hireDate
      couldBeExplored
    }
  }
`;
