import React, { Fragment, useState } from "react";
import { IEmployee } from "../../../@types/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../../../components/ui/card";
import _trim from "lodash/trim";
import { Button } from "../../../components/ui/button";
import {
  ChevronDownIcon,
  CounterClockwiseClockIcon,
} from "@radix-ui/react-icons";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import { Separator } from "../../../components/ui/separator";
import { cn } from "../../../lib/utils";
import ProjectsAndTasks from "./projectsAndTasks";
import { AlertDialog } from "../../../components/ui/alert-dialog";
import { DebouncedFunc } from "lodash";

const EmployeeCard: React.FC<{
  employeeData: IEmployee;
  clockInEmployee: DebouncedFunc<
    (id: string, timeEntryId?: string) => Promise<void>
  >;
}> = ({ employeeData, clockInEmployee }) => {
  const [fileUrl, setFileUrl] = useState("");
  const [toggleProjects, setToggleProjects] = useState(false);

  // const fetchUrl = async () => {
  //   const res = await invoke("get_environment_variable", {
  //     name: "FILE_UPLOAD_DOWNLOAD_URL",
  //   });
  //   setFileUrl(res as string);
  // };

  // useEffect(() => {
  //   fetchUrl();
  // }, []);

  return (
    <Fragment>
      <Card className={"bg-slate-900 relative"}>
        <CardHeader>
          <Avatar className="w-40 h-40 self-center">
            <AvatarImage
              width={40}
              height={40}
              src={`${fileUrl}${employeeData.avatar}`}
              alt="avatar"
            />
            <AvatarFallback className="text-5xl">{`${employeeData?.firstName[0]} ${employeeData?.lastName[0]}`}</AvatarFallback>
          </Avatar>
        </CardHeader>
        <CardContent>
          <p
            className={
              "text-center text-2xl mt-6 text-ellipsis overflow-hidden whitespace-nowrap"
            }
          >{`${_trim(employeeData?.firstName)} ${_trim(
            employeeData?.lastName
          )}`}</p>
          <Separator className={"my-4 bg-primary"} />
          <p className={"text-center text-lg"}>{`${
            employeeData?.jobTitle?.jobTitle ?? "Not Assigned"
          }`}</p>
        </CardContent>
        <CardFooter>
          <div
            className={"flex flex-row justify-center items-center mt-8 w-full"}
          >
            <Button
              className={cn(
                "flex-grow h-12",
                !employeeData?.timeEntryId && "rounded-l-lg rounded-r-none"
              )}
              onClick={() =>
                clockInEmployee(employeeData.id, employeeData?.timeEntryId)
              }
            >
              {" "}
              <CounterClockwiseClockIcon className={"h-6 w-6 mr-2"} />
              {employeeData?.timeEntryId ? "ClockOut" : "ClockIn"}
            </Button>
            {!employeeData?.timeEntryId && (
              <Button
                onClick={() => setToggleProjects(true)}
                className={
                  "h-12 rounded-r-lg border-slate-900 border-l rounded-l-none"
                }
              >
                <ChevronDownIcon className={"h-6 w-6"} />
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
      {toggleProjects && (
        <AlertDialog open={toggleProjects}>
          <ProjectsAndTasks
            employeeId={employeeData?.id}
            setToggleProjects={setToggleProjects}
            clockInEmployee={() =>
              clockInEmployee(employeeData.id, employeeData?.timeEntryId)
            }
          />
        </AlertDialog>
      )}
    </Fragment>
  );
};

export default EmployeeCard;
