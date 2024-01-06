import { redirect } from "react-router-dom";
import { IEmployee, IUser } from "../../@types/types";
import _keyBy from "lodash/keyBy";
import { client } from "../../context/apolloContext";
import { GET_USER_LIST } from "../../services/queries/people";
import { UserState } from "../../services/state/globalState";

export const loader = async () => {
  const userState = UserState;
  userState.set((prev) => ({
    ...prev,
    ...JSON.parse(localStorage.getItem("user") as string),
  }));
  if (userState.id.get()) {
    const { data, error } = await client.query({
      query: GET_USER_LIST,
      fetchPolicy: "network-only",
      variables: {
        status: "Active",
      },
      context: {
        headers: {
          database: userState.domain.get(),
        },
      },
    });

    const _list = data?.userList?.map((item: IEmployee) => {
      return { ...item, timeEntryId: undefined };
    });
    return _keyBy(_list ?? {}, "id");
  }
  return redirect("/");
};
