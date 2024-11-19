import { useLoaderData, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/services/hooks/useAuthContext";
import { IEmployee, IEmployeeList } from "@/types";
import EmployeeCard from "./components/employeeCard";
import { useHookstate } from "@hookstate/core";
import {
  EmployeeListState,
  GeneralSettingsState,
  ProjectAndTaskIdState,
  UserState,
} from "@/services/state/globalState";
import { useEffect, useMemo, useState } from "react";
import { client } from "@/context/apolloContext";
import { CREATE_USER_TIME } from "@/services/mutations/userTime";
import { formatInTimeZone } from "date-fns-tz";
import { CLOCK_IN_OUT } from "@/services/mutations/clockInOut";
import { useSubscription } from "@apollo/client/react/hooks/useSubscription";
import { TIME_ENTRY_SUB } from "@/services/subscriptions/timeEntry";
import { Button } from "@/components/ui/button";
import _sortBy from "lodash/sortBy";
import _keyBy from "lodash/keyBy";
import { Input } from "@/components/ui/input";

const Attendance: React.FC = () => {
  const loaderData = useLoaderData() as IEmployeeList;
  const employeeListState = useHookstate(EmployeeListState);
  const userState = useHookstate(UserState);
  const { get: getGeneralSettings } = useHookstate(GeneralSettingsState);
  const projectAndTaskIdState = useHookstate(ProjectAndTaskIdState);
  const { logout } = useAuthContext();
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();
  const employees: Array<IEmployee> = useMemo(
    () =>
      Object.values(employeeListState.get()).filter(
        (emp) =>
          emp.firstName.toLowerCase().indexOf(filter) >= 0 ||
          emp.lastName.toLowerCase().indexOf(filter) >= 0
      ),
    [employeeListState, filter]
  );

  useEffect(() => {
    employeeListState.set(loaderData);
  }, [loaderData]);

  const handleLogout = () => {
    const res = logout();
    if (res) {
      navigate("/");
    }
  };

  useSubscription(TIME_ENTRY_SUB, {
    onData({ data: { data, error } }) {
      if (error) console.error(error);
      const {
        timeEntrySubscription: { timeEntry },
      } = data;
      employeeListState.merge((prev) => ({
        [timeEntry?.userTime?.userId]: {
          ...prev[timeEntry?.userTime?.userId],
          lastCheckInId: timeEntry?.id,
          isCheckedIn: timeEntry?.endTime ? false : true,
          isWorkingFromHome: timeEntry.isFromHome,
        },
      }));
    },
  });

  const clockInEmployee = async (employee: IEmployee) => {
    try {
      const date = formatInTimeZone(
        new Date(),
        getGeneralSettings().timezone.name,
        "yyyy-MM-dd"
      );
      const { data } = await client.mutate({
        mutation: CREATE_USER_TIME,
        fetchPolicy: "no-cache",
        variables: {
          input: {
            date,
            userId: employee.id,
          },
        },
        context: {
          headers: {
            database: userState.get().domain,
          },
        },
      });
      if (!!data) {
        const { data: clockInOutData, errors } = await client.mutate({
          mutation: CLOCK_IN_OUT,
          fetchPolicy: "no-cache",
          variables: {
            input: employee.isCheckedIn
              ? {
                  id: employee.lastCheckInId,
                  comments: "attendanceAppClockIn",
                }
              : {
                  userTimeId: data?.userTimeCreate?.id,
                  isFromHome: false,
                  comments: "attendanceAppClockIn",
                  projectId: projectAndTaskIdState.projectId.get(),
                  taskId: projectAndTaskIdState.taskId.get(),
                },
          },
          context: {
            headers: {
              database: userState.get().domain,
            },
          },
        });
        if (errors) return alert("Error ocurred while clocking in!");
        if (!!clockInOutData) {
          employeeListState.merge((prev) => ({
            [employee.id]: {
              ...prev[employee.id],
              lastCheckInId: clockInOutData?.clockInOut?.endTime
                ? null
                : clockInOutData?.clockInOut?.id,
              isCheckedIn: clockInOutData?.clockInOut?.endTime ? false : true,
              isWorkingFromHome: false,
            },
          }));
          projectAndTaskIdState.set({
            projectId: undefined,
            taskId: undefined,
          });
        }
      }
    } catch (e) {
      alert("Error ocurred while clocking in!");
      console.error(e);
    }
  };

  return (
    <div className={"h-screen overflow-y-scroll"}>
      <div className="relative flex justify-center items-center">
      <div>
        <p className={"text-center text-5xl my-20"}>Workspace Attendance App</p>
      </div>
      <div className={"absolute right-10 top-24"}>
        <Button size={"lg"} onClick={handleLogout}>
          Logout
        </Button>
      </div>
      </div>
      <div className={"flex flex-1 justify-between m-10 items-center"}>
        <div className={"flex"}>
          <p className={"text-2xl"}>
            Total Employees: {Object.values(employeeListState.get()).length}
          </p>
          <p className={"text-2xl ml-10"}>
            Employees Clocked In:{" "}
            {
              Object.values(employeeListState.get()).filter(
                (employee: IEmployee) => employee.isCheckedIn
              ).length
            }
          </p>
        </div>
        <div>
          <Input
            className={"mt-4 h-14 bg-slate-800 text-xl"}
            onChange={(event) => setFilter(event.target.value.toLowerCase())}
            type="text"
            placeholder={"Search"}
          />
        </div>
      </div>
      {employees.length ? (
        <div className={"flex flex-row flex-wrap justify-center"}>
          {employees.map((employeeData: IEmployee) => (
            <EmployeeCard
              employeeData={employeeData}
              key={employeeData.id}
              clockInEmployee={clockInEmployee}
            />
          ))}
        </div>
      ) : (
        <p className={"mt-14 text-4xl text-center"}>No Employees to display</p>
      )}
    </div>
  );
};

export default Attendance;
