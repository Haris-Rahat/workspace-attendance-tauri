import {gql} from '@apollo/client';

export const GET_USER_LIST = gql`
  query activeUsers($date: String!) {
    activeUsers {
      id
      firstName
      lastName
      avatar
      lastCheckInId(date: $date)
      isCheckedIn(date: $date)
      isWorkingFromHome(date: $date)
    }
  }
`;