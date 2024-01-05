import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { invoke } from "@tauri-apps/api/tauri";
import { CREATE_USER_TIME } from "../../../services/mutations/userTime";
import { CLOCK_IN_OUT } from "../../../services/mutations/clockInOut";
import {
  generalSettings,
  projectAndTaskId,
  user,
} from "../../../services/signals/signals";
import { formatInTimeZone } from "date-fns-tz";

const UserCard: React.FC<{ userData: Record<string, any> }> = ({
  userData,
}) => {
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

  const [createUserTime] = useMutation(CREATE_USER_TIME);
  const [clockInOut] = useMutation(CLOCK_IN_OUT);

  const clockInUser = async () => {
    const date = formatInTimeZone(
      new Date(),
      generalSettings.value?.timezone?.name,
      "yyyy-MM-dd"
    );
    try {
      const { data } = await createUserTime({
        fetchPolicy: "network-only",
        variables: {
          input: {
            date,
            userId: userData?.id,
          },
        },
        context: {
          headers: {
            database: user.peek().domain,
          },
        },
      });
      if (!!data) {
        console.log(data, "data userTime");
        const { data: clockInOutData } = await clockInOut({
          fetchPolicy: "network-only",
          variables: {
            input: {
              userId: data?.userTimeCreate?.id,
              isFromHome: false,
              comments: "attendanceApp",
              projectId: projectAndTaskId.peek().projectId,
              taskId: projectAndTaskId.peek().taskId,
            },
          },
        });

      }
    } catch (e) {
      alert("Could not clockIn user!");
      console.error(e);
    }
  };

  return (
    <div
      className={
        "w-1/5 bg-gray-800 m-4 rounded-lg p-4 flex flex-col justify-between"
      }
    >
      <div>
        <img
          src={
            "./tauri.svg"
            // `${fileUrl}${user.avatar}`
          }
          alt="avatar"
          className={"w-40 h-40 rounded-full mx-auto object-center"}
        />
        <p
          className={"text-center text-lg mt-6"}
        >{`${userData?.firstName} ${userData?.lastName}`}</p>
        <p className={"text-center"}>{`${
          userData?.jobTitle?.jobTitle ?? "Not Assigned"
        }`}</p>
      </div>
      <div className={"flex-row mx-auto items-stretch w-full mt-8"}>
        <button className={"text-white rounded w-[80%]"} onClick={clockInUser}>
          ClockIn
        </button>
        <button className={""}> V </button>
      </div>
    </div>
  );
};

export default UserCard;
