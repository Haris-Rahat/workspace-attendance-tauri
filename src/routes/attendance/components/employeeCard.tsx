import React, { Fragment, useEffect, useState } from "react";
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
import { cn } from "../../../lib/utils";
import ProjectsAndTasks from "./projectsAndTasks";
import { AlertDialog } from "../../../components/ui/alert-dialog";
import { DebouncedFunc } from "lodash";
import { invoke } from "@tauri-apps/api/tauri";

const EmployeeCard: React.FC<{
  employeeData: IEmployee;
  clockInEmployee: DebouncedFunc<(employee: IEmployee) => Promise<void>>;
}> = ({ employeeData, clockInEmployee }) => {
  const [imgUrl, setImgUrl] = useState("");
  const [toggleProjects, setToggleProjects] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchUrl = async () => {
    const res = await invoke("get_environment_variable", {
      name: "FILE_UPLOAD_DOWNLOAD_URL",
    });

    fetch(`${res}/${employeeData.avatar}/100`, {
      method: "GET",

      headers: {
        "access-control-allow-origin": "*",
        "access-control-allow-headers": "*",
        "content-type": "image/png",
        database: "technologies",
        accept: "*/*",
      },
    })
      .then((res) => res.blob())
      .then((blob) => {
        setImgUrl(URL.createObjectURL(blob));
        return blob;
      })
      .catch((err) => err);
  };

  useEffect(() => {
    fetchUrl();
  }, []);
  console.log(loading, "loading");
  return (
    <Fragment>
      <Card className={"bg-slate-900 relative"}>
        <CardHeader>
          <Avatar className="w-40 h-40 self-center">
            <AvatarImage
              width={40}
              height={40}
              src={`${imgUrl}`}
              alt="avatar"
            />
            <AvatarFallback className="text-5xl">{`${employeeData?.firstName[0]}${employeeData?.lastName[0]}`}</AvatarFallback>
          </Avatar>
        </CardHeader>
        <CardContent>
          <p
            className={
              "text-center text-2xl mt-6 text-ellipsis overflow-hidden"
            }
          >{`${_trim(employeeData?.firstName)} ${_trim(
            employeeData?.lastName
          )}`}</p>
        </CardContent>
        <CardFooter>
          <div
            className={"flex flex-row justify-center items-center mt-8 w-full"}
          >
            <Button
              disabled={loading}
              className={cn(
                "flex-grow h-12",
                !employeeData?.isCheckedIn && "rounded-l-lg rounded-r-none"
              )}
              onClick={() => clockInEmployee(employeeData)}
            >
              {" "}
              <CounterClockwiseClockIcon className={"h-6 w-6 mr-2"} />
              {employeeData.isCheckedIn ? "ClockOut" : "ClockIn"}
            </Button>
            {!employeeData.isCheckedIn && (
              <Button
                disabled={loading}
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
            clockInEmployee={() => clockInEmployee(employeeData)}
          />
        </AlertDialog>
      )}
    </Fragment>
  );
};

export default EmployeeCard;
