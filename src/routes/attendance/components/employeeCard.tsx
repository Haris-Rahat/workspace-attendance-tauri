import React, { Fragment, useCallback, useEffect, useState } from "react";
import { IEmployee } from "@/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import _trim from "lodash/trim";
import { Button } from "@/components/ui/button";
import {
  ChevronDownIcon,
  CounterClockwiseClockIcon,
} from "@radix-ui/react-icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "./../../../lib/utils";
import ProjectsAndTasks from "./projectsAndTasks";
import { AlertDialog } from "@/components/ui/alert-dialog";
import HomeIcon from "@/assets/home-house-svgrepo-com.svg?react";
import OfficeIcon from "@/assets/office-svgrepo-com.svg?react";

const EmployeeCard: React.FC<{
  employeeData: IEmployee;
  clockInEmployee: (employee: IEmployee) => Promise<void>;
}> = ({ employeeData, clockInEmployee }) => {
  const [imgUrl, setImgUrl] = useState("");
  const [toggleProjects, setToggleProjects] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const fetchUrl = async () => {
    if (employeeData.avatar) {
      fetch(
        `https://5yebux2t4h.execute-api.eu-central-1.amazonaws.com/prod/${employeeData.avatar}/100`,
        {
          method: "GET",
          headers: {
            "access-control-allow-origin": "*",
            "access-control-allow-headers": "*",
            "content-type": "image/png",
            database: "technologies",
            accept: "*/*",
          },
        }
      )
        .then((res) => res.blob())
        .then((blob) => {
          setImgUrl(URL.createObjectURL(blob));
          return blob;
        })
        .catch((err) => err);
    }
  };

  const handleClick = useCallback(async () => {
    setDisabled(true);
    await clockInEmployee(employeeData);
    setDisabled(false);
  }, [clockInEmployee]);

  useEffect(() => {
    fetchUrl();
  }, []);

  useEffect(() => {
    if (disabled) {
      setTimeout(() => {
        setDisabled(false);
      }, 1500);
    }
  }, [disabled]);

  return (
    <Fragment>
      <Card className={"bg-slate-900 relative w-1/5 m-6"}>
        {employeeData.isCheckedIn && (
          <div
            className={
              "rounded-full p-4 bg-white absolute top-[-1.5rem] right-4"
            }
          >
            {employeeData.isWorkingFromHome ? (
              <HomeIcon className={"w-9 h-9"} />
            ) : (
              <OfficeIcon className={"w-9 h-9"} />
            )}
          </div>
        )}
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
              disabled={disabled}
              className={cn(
                "flex-grow h-12 relative",
                !employeeData?.isCheckedIn && "rounded-l-lg rounded-r-none"
              )}
              onClick={handleClick}
            >
              {" "}
              <CounterClockwiseClockIcon
                className={"h-6 w-6 mr-2"}
              />
              {employeeData.isCheckedIn ? "ClockOut" : "ClockIn"}{" "}
            </Button>
            {!employeeData.isCheckedIn && (
              <Button
                disabled={disabled}
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
            clockInEmployee={handleClick}
          />
        </AlertDialog>
      )}
    </Fragment>
  );
};

export default EmployeeCard;
