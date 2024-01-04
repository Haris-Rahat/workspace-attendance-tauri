import { useQuery } from "@apollo/client";
import { useLoaderData, useNavigate } from "react-router-dom";
import { GET_USER_LIST } from "../../services/queries/people";
import { useAuthContext } from "../../services/hooks/useAuthContext";
import UserCard from "./components/userCard";
import { User } from "../../context/authContext";

const Attendance = () => {
  const user = useLoaderData() as User;
  const { logout } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    const res = logout();
    if (res) {
      navigate("/");
    }
  };

  const { data, loading, error } = useQuery(GET_USER_LIST, {
    variables: {
      status: "Active",
    },
    context: {
      headers: {
        database: user?.domain,
      },
    },
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;

  return (
    <div className={"h-screen overflow-y-scroll"}>
      <div className={"flex flex-1 justify-end p-4"}>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <div className={"flex flex-row flex-wrap justify-center"}>
        {data?.userList.map((user: Record<string, any>, index: number) => (
          <UserCard user={user} key={index} />
        ))}
      </div>
    </div>
  );
};

export default Attendance;
