import { useLoaderData, useNavigate, useNavigation } from "react-router-dom";
import { useAuthContext } from "../../services/hooks/useAuthContext";
import { IEmployee, IEmployeeList } from "../../@types/types";
import EmployeeCard from "./components/employeeCard";
import { useHookstate } from "@hookstate/core";
import {
  EmployeeListState,
  GeneralSettingsState,
  ProjectAndTaskIdState,
  UserState,
} from "../../services/state/globalState";
import { useEffect } from "react";
import { client } from "../../context/apolloContext";
import { CREATE_USER_TIME } from "../../services/mutations/userTime";
import { formatInTimeZone } from "date-fns-tz";
import { CLOCK_IN_OUT } from "../../services/mutations/clockInOut";
import { useSubscription } from "@apollo/client/react/hooks/useSubscription";
import { TIME_ENTRY_SUB } from "../../services/subscriptions/timeEntry";
import { Button } from "../../components/ui/button";

const Attendance: React.FC = () => {
  const loaderData = useLoaderData() as IEmployeeList;
  const navigation = useNavigation();
  const employeeListState = useHookstate(EmployeeListState);
  const userState = useHookstate(UserState);
  const { get: getGeneralSettings } = useHookstate(GeneralSettingsState);
  const { get: projectAndTaskId } = useHookstate(ProjectAndTaskIdState);
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

  useSubscription(TIME_ENTRY_SUB, {
    onData({ data: { data, error } }) {
      if (error) console.error(error);
      const {
        timeEntrySubscription: { timeEntry },
      } = data;
      console.log(timeEntry, "timeEntry");
      if (!timeEntry?.endTime) {
        employeeListState.merge((prev) => ({
          [timeEntry?.userTime?.userId]: {
            ...prev[timeEntry?.userTime?.userId],
            timeEntryId: timeEntry?.id,
          },
        }));
      } else {
        employeeListState.merge((prev) => ({
          [timeEntry?.userTime?.userId]: {
            ...prev[timeEntry?.userTime?.userId],
            timeEntryId: undefined,
          },
        }));
      }
    },
  });

  const clockInUser = async (id: string, timeEntryId?: string) => {
    const date = formatInTimeZone(
      new Date(),
      getGeneralSettings().timezone.name,
      "yyyy-MM-dd"
    );
    try {
      const { data } = await client.mutate({
        mutation: CREATE_USER_TIME,
        fetchPolicy: "network-only",
        variables: {
          input: {
            date,
            userId: id,
          },
        },
        context: {
          headers: {
            database: userState.get().domain,
          },
        },
      });
      if (!!data) {
        const { data: clockInOutData } = await client.mutate({
          mutation: CLOCK_IN_OUT,
          fetchPolicy: "network-only",
          variables: {
            input: timeEntryId
              ? {
                  id: timeEntryId,
                  comments: "attendanceApp",
                }
              : {
                  userTimeId: data?.userTimeCreate?.id,
                  isFromHome: false,
                  comments: "attendanceApp",
                  projectId: projectAndTaskId().projectId,
                  taskId: projectAndTaskId().taskId,
                },
          },
          context: {
            headers: {
              database: userState.get().domain,
            },
          },
        });

        employeeListState.merge((prev) => ({
          [id]: {
            ...prev[id],
            timeEntryId: timeEntryId
              ? undefined
              : clockInOutData?.clockInOut?.id,
          },
        }));
      }
    } catch (e) {
      alert("Could not clockIn user!");
      console.error(e);
    }
  };

  if (navigation.state === "loading") {
    console.log("loading");
    return <div className={"text-primary text-xl"}>Loading...</div>;
  }

  return (
    <div className={"h-screen overflow-y-scroll"}>
      <div className={"flex flex-1 justify-end p-4"}>
        <Button size={"lg"} onClick={handleLogout}>Logout</Button>
      </div>
      <div className={"flex flex-row flex-wrap justify-center"}>
        {Object.values(employeeListState.get({ noproxy: true })).map(
          (employeeData: IEmployee, index: number) => (
            <EmployeeCard
              employeeData={employeeData}
              key={index}
              clockInUser={clockInUser}
            />
          )
        )}
      </div>
    </div>
  );
};

export default Attendance;
