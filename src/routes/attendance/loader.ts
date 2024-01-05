import { redirect } from "react-router-dom";
import { IUser } from "../../@types/types";
import _keyBy from "lodash/keyBy";
import { client } from "../../context/apolloContext";
import { GET_USER_LIST } from "../../services/queries/people";

export const loader = async () => {
  const user: IUser = JSON.parse(localStorage.getItem("user") as string);
  if (!!user) {
    const { data, error } = await client.query({
      query: GET_USER_LIST,
      fetchPolicy: "network-only",
      variables: {
        status: "Active",
      },
      context: {
        headers: {
          database: user?.domain,
        },
      },
    });
    return _keyBy(data?.userList ?? [], "id");
  }
  return redirect("/");
};
