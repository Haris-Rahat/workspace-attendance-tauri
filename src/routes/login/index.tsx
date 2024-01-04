import { useAuthContext } from "../../services/hooks/useAuthContext";
import { formState, loading, user } from "../../services/signals/signals";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login, checkDomain } = useAuthContext();
  const navigate = useNavigate();

  const handleClick = async () => {
    loading.value = true;
    console.log(formState.value, "formState");
    try {
      const res = await checkDomain(formState.value.domain);
      if (res) {
        const res = await login(formState.value);
        if (res) {
          user.value = {
            id: res.id,
            email: res.email,
            name: `${res?.user?.firstName} ${res?.user?.lastName}`,
            token: res.token,
            domain: formState.value.domain,
          };
          localStorage.setItem("user", JSON.stringify(user.value));
          loading.value = false;
          navigate("/attendance");
          return;
        }
      }
      loading.value = false;
      alert("Domain does not exist!");
    } catch (e) {
      console.error(e);
      alert("Something went wrong!");
    } finally {
      loading.value = false;
    }
  };

  return (
    <div className={"h-screen flex flex-col justify-center items-center"}>
      <div className={"bg-white p-4 rounded-lg shadow-md w-min"}>
        <h1 className={"text-center text-gray-500 text-2xl"}>Login</h1>
        <form>
          <div className={"flex justify-between items-center mt-4"}>
            <label className={"text-gray-500"}>Domain:</label>
            <input
              defaultValue={formState.value.domain}
              onInput={(event) =>
                (formState.value = {
                  ...formState.value,
                  domain: (event.target as HTMLInputElement).value,
                })
              }
              type="text"
              placeholder={"example"}
            />
          </div>
          <div className={"flex justify-between items-center mt-4"}>
            <label className={"text-gray-500"}>Email:</label>
            <input
              defaultValue={formState.value.email}
              onInput={(event) =>
                (formState.value = {
                  ...formState.value,
                  email: (event.target as HTMLInputElement).value,
                })
              }
              type="email"
              placeholder={"embrace@technologies.dk"}
            />
          </div>
          <div className={"flex justify-between items-center mt-4"}>
            <label className={"text-gray-500"}>Password:</label>
            <input
              defaultValue={formState.value.password}
              onInput={(event) =>
                (formState.value = {
                  ...formState.value,
                  password: (event.target as HTMLInputElement).value,
                })
              }
              type="password"
              placeholder={"**********"}
              className={"ml-6"}
            />
          </div>
          <button
            className={"w-full text-gray-500 mt-4"}
            onClick={handleClick}
            type="button"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
