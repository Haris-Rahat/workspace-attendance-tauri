import { redirect } from "react-router-dom";
import { IUser } from "../../@types/types";
import _keyBy from "lodash/keyBy";

export const loader = async () => {
  const user: IUser = JSON.parse(localStorage.getItem("user") as string);
  if (!!user) {
    return user;
  }
  return redirect("/");
};
