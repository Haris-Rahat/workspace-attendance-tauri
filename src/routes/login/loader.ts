import { redirect } from "react-router-dom";
import { User } from "../../context/authContext";

export const loader = () => {
  const user: User = JSON.parse(localStorage.getItem("user") as string);
  if (user?.id) {
    return redirect("/attendance");
  }
  return null;
};
