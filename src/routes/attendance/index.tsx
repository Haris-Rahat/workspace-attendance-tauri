import { useLoaderData, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../services/hooks/useAuthContext";
import UserCard from "./components/userCard";
import { IUser } from "../../@types/types";
import { useQuery } from "@apollo/client";
import { GET_USER_LIST } from "../../services/queries/people";

const Attendance: React.FC = () => {
  const loaderData = useLoaderData() as Record<
    "id" | "email" | "name" | "token" | "domain",
    IUser
  >;
  const { logout } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    const res = logout();
    if (res) {
      navigate("/");
    }
  };

  const { data, error, loading } = useQuery(GET_USER_LIST, {
    fetchPolicy: "network-only",
    variables: {
      status: "Active",
    },
    context: {
      headers: {
        database: loaderData.domain,
      },
    },
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className={"h-screen overflow-y-scroll"}>
      <div className={"flex flex-1 justify-end p-4"}>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <div className={"flex flex-row flex-wrap justify-center"}>
        {Object.values(loaderData).map(
          (userData: Record<string, any>, index: number) => (
            <UserCard userData={userData} key={index} />
          )
        )}
      </div>
    </div>
  );
};

export default Attendance;
