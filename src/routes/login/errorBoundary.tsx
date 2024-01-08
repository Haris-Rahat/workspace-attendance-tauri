import { useRouteError } from "react-router-dom";

export const ErrorBoundary = () => {
  let error = useRouteError();
  console.error(error, "LoginScreen");
  return (
    <div className={"h-screen w-screen flex flex-col justify-center"}>
      <p className={"text-center text-3xl"}>Dang! Error occurred at Login</p>
    </div>
  );
};
