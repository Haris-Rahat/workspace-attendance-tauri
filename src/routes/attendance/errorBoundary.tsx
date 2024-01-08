import { useRouteError } from "react-router-dom";

export const ErrorBoundary = () => {
  let error = useRouteError();
  console.error(error, "AttendanceScreen");
  return <div>Dang!</div>;
};
