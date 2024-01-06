import React, { useState } from "react";
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
  CountdownTimerIcon,
} from "@radix-ui/react-icons";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";

const EmployeeCard: React.FC<{
  employeeData: IEmployee;
  clockInUser: (id: string, timeEntryId?: string) => Promise<void>;
}> = ({ employeeData, clockInUser }) => {
  const [fileUrl, setFileUrl] = useState("");

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
    <Card className={"w-1/5 m-4 bg-slate-900"}>
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
        <p className={"text-center text-2xl mt-6"}>{`${_trim(
          employeeData?.firstName
        )} ${_trim(employeeData?.lastName)}`}</p>
        <p className={"text-center text-lg"}>{`${
          employeeData?.jobTitle?.jobTitle ?? "Not Assigned"
        }`}</p>
      </CardContent>
      <CardFooter>
        <div
          className={"flex flex-row justify-center items-center mt-8 w-full"}
        >
          <Button
            className={"flex-grow h-12 rounded-l-lg rounded-r-none text-center"}
            onClick={() =>
              clockInUser(employeeData.id, employeeData?.timeEntryId)
            }
          >
            {!employeeData?.timeEntryId ? (
              <p className="flex">
                {" "}
                <p className={"animate-spin"}>
                  <CounterClockwiseClockIcon
                    className={"h-6 w-6 [transform:rotateX(180deg)]"}
                  />
                </p>
                ClockOut
              </p>
            ) : (
              <p>ClockIn</p>
            )}
          </Button>
          {!employeeData?.timeEntryId && (
            <Button className={"h-12 rounded-r-lg rounded-l-none"}>
              <ChevronDownIcon className={"h-6 w-6"} />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default EmployeeCard;
