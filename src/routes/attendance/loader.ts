import { redirect } from "react-router-dom";
import _keyBy from "lodash/keyBy";
import { client } from "../../context/apolloContext";
import { GET_USER_LIST } from "../../services/queries/people";
import { formatInTimeZone } from "date-fns-tz";
import _sortBy from "lodash/sortBy";

export const loader = async () => {
  const user = JSON.parse(localStorage.getItem("user") as string);
  const generalSettings = JSON.parse(
    localStorage.getItem("generalSettings") as string
  );

  if (!!user && !!generalSettings) {
    const date = formatInTimeZone(
      new Date(),
      generalSettings?.timezone?.name,
      "yyyy/MM/dd"
    );

    const { data } = await client.query({
      query: GET_USER_LIST,
      fetchPolicy: "no-cache",
      variables: {
        date,
      },
      context: {
        headers: {
          database: user?.domain,
        },
      },
    });
    const sortedUsers = _sortBy(data?.activeUsers ?? [], "firstName");
    return _keyBy(sortedUsers ?? {}, "id");
  }
  return redirect("/");
};
