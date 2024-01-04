import { invoke } from "@tauri-apps/api/tauri";
import { FunctionComponent } from "preact";
import { useEffect, useState } from "preact/hooks";

const UserCard: FunctionComponent<{ user: Record<string, any> }> = ({
  user,
}) => {
  const [fileUrl, setFileUrl] = useState("");

  const fetchUrl = async () => {
    const res = await invoke("get_environment_variable", {
      name: "FILE_UPLOAD_DOWNLOAD_URL",
    });
    setFileUrl(res as string);
  };

  useEffect(() => {
    fetchUrl();
  }, []);

  return (
    <div className={"w-1/5 bg-blue-500 m-4 rounded-lg p-4 flex flex-col justify-between"}>
      <div>
      <img
        src={
          "https://unsplash.com/photos/a-desert-landscape-with-mountains-in-the-distance-SGZ5DkDOoRo"
          // `${fileUrl}${user.avatar}`
        }
        alt=""
        className={"w-40 h-40 rounded-full mx-auto"}
      />
      <p
        className={"text-center text-lg mt-6"}
      >{`${user.firstName} ${user?.lastName}`}</p>
      <p className={"text-center"}>{`${user?.jobTitle?.jobTitle}`}</p>
      </div>
      <div className={"flex-row mx-auto items-stretch w-full mt-8"}>
      <button className={"text-white rounded w-[80%]"}>ClockIn</button>
      <button className={"w-6"}>V</button>
      </div>
    </div>
  );
};

export default UserCard;
