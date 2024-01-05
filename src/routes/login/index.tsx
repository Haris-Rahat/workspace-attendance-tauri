import { useAuthContext } from "../../services/hooks/useAuthContext";
import {
  formState,
  generalSettings,
  loading,
  user,
} from "../../services/signals/signals";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const { login, checkDomain } = useAuthContext();
  const navigate = useNavigate();

  const handleClick = async () => {
    loading.value = true;
    try {
      const res = await checkDomain(formState.value.domain);
      if (res) {
        const res: {
          login: Record<string, any> | undefined;
          generalSettings: Record<"timezone", {name: string}> | undefined;
        } = await login(formState.value);
        if (!!res.login && !!res.generalSettings) {
          user.value = {
            id: res.login?.id,
            email: res.login?.email,
            name: `${res.login?.user.firstName} ${res.login?.user.lastName}`,
            token: res.login?.token,
            domain: formState.value.domain,
          };
          generalSettings.value = { ...res.generalSettings };
          localStorage.setItem("user", JSON.stringify(user.value));
          localStorage.setItem(
            "generalSettings",
            JSON.stringify(generalSettings.value)
          );
          loading.value = false;
          navigate("/attendance");
          return;
        }
      } else {
        alert("Domain does not exist!");
      }
      loading.value = false;
    } catch (e) {
      console.error(e, "error login");
      alert(`Something went wrong! ${e.message}`);
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
