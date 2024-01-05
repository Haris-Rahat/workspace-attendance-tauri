import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "../routes/login";
import { loader as loginLoader } from "../routes/login/loader";
import { ErrorBoundary as LoginErrorBoundary } from "../routes/login/errorBoundary";
import Attendance from "../routes/attendance";
import { loader as attendanceLoader } from "../routes/attendance/loader";
import { ErrorBoundary as AttendanceErrorBoundary } from "../routes/login/errorBoundary";

const AppRouter: React.FC = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login />,
      loader: loginLoader,
      errorElement: <LoginErrorBoundary />,
    },
    {
      path: "/attendance",
      element: <Attendance />,
      loader: attendanceLoader,
      errorElement: <AttendanceErrorBoundary />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default AppRouter;
