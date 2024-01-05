import { gql } from "@apollo/client";

export const CLOCK_IN_OUT = gql`
  mutation clockInOut($input: ClockInOut) {
    clockInOut(input: $input) {
      id
      startTime
      endTime
      userTimeId
    }
  }
`;
