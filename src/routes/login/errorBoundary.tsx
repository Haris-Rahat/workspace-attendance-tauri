import { useRouteError } from "react-router-dom";

export const ErrorBoundary = () => {
  let error = useRouteError();
  console.error(error, "loginScreen");
  return <div>Dang!</div>;
};
