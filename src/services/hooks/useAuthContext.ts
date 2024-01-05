import { useContext } from "react";
import { AuthContext } from "../../context/authContext";

export const useAuthContext = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("Auth context is not defined");
  }

  return authContext;
};
