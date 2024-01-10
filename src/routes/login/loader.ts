import { redirect } from "react-router-dom";
import { IUser } from "@/types";

export const loader = () => {
  const user: IUser = JSON.parse(localStorage.getItem("user") as string);
  if (!!user) {
    return redirect("/attendance");
  }
  return null;
};
