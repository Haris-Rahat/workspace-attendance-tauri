import { useLoaderData, useNavigate, useNavigation } from "react-router-dom";
import { useAuthContext } from "../../services/hooks/useAuthContext";
import { IEmployee, IEmployeeList } from "../../@types/types";
import EmployeeCard from "./components/employeeCard";
import { useHookstate } from "@hookstate/core";
import { EmployeeListState } from "../../services/state/globalState";
import { useEffect } from "react";

const Attendance: React.FC = () => {
  const loaderData = useLoaderData() as IEmployeeList;
  const navigation = useNavigation();
  const employeeListState = useHookstate(EmployeeListState);
  const { logout } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    employeeListState.set(loaderData);
  }, [loaderData]);

  const handleLogout = () => {
    const res = logout();
    if (res) {
      navigate("/");
    }
  };
  console.log(employeeListState.get({ noproxy: true }));

  if (navigation.state === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className={"h-screen overflow-y-scroll"}>
      <div className={"flex flex-1 justify-end p-4"}>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <div className={"flex flex-row flex-wrap justify-center"}>
        {Object.values(employeeListState.get({ noproxy: true })).map(
          (employeeData: IEmployee, index: number) => (
            <EmployeeCard employeeData={employeeData} key={index} />
          )
        )}
      </div>
    </div>
  );
};

export default Attendance;
