import { gql } from "@apollo/client";

export const TIME_ENTRY_SUB = gql`
  subscription TimeEntrySub {
    timeEntrySubscription {
      action
      timeEntry {
        id
        endTime
        isFromHome
        userTime {
          userId
        }
      }
    }
  }
`;
