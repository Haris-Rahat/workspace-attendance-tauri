import { Button } from "../../components/ui/button";
import { useRouteError } from "react-router-dom";

export const ErrorBoundary = () => {
  let error = useRouteError();
  console.error(error, "AttendanceScreen");
  return (
    <div
      className={"h-screen w-screen flex flex-col justify-center items-center"}
    >
      <p className={"text-center text-3xl mb-6"}>
        Dang! Error occurred at Attendance
      </p>
      <Button
        variant={"default"}
        size={"lg"}
        onClick={() => window.location.reload()}
      >
        Reload
      </Button>
    </div>
  );
};
