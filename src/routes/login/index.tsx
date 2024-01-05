import { useAuthContext } from "../../services/hooks/useAuthContext";
import {
  FormState,
  GeneralSettingsState,
  LoadingState,
  UserState,
} from "../../services/state/globalState";
import { useNavigate } from "react-router-dom";
import { useHookstate } from "@hookstate/core";
import { useRender } from "../../services/hooks/useRender";

const Login: React.FC = () => {
  const { login, checkDomain } = useAuthContext();
  const navigate = useNavigate();
  const formState = useHookstate(FormState);
  const userState = useHookstate(UserState);
  const generalSettingsState = useHookstate(GeneralSettingsState);
  const loadingState = useHookstate(LoadingState);

  useRender("Login");

  const handleClick = async () => {
    loadingState.set(true);
    try {
      const res = await checkDomain(formState.get().domain);
      if (res) {
        const res: {
          login: Record<string, any> | undefined;
          generalSettings: Record<"timezone", { name: string }> | undefined;
        } = await login(formState.get());
        if (!!res.login && !!res.generalSettings) {
          userState.set({
            id: res.login?.id,
            email: res.login?.email,
            name: `${res.login?.user.firstName} ${res.login?.user.lastName}`,
            token: res.login?.token,
            domain: formState.get().domain,
          });
          generalSettingsState.set({ ...res.generalSettings });
          localStorage.setItem(
            "user",
            JSON.stringify(userState.get({ noproxy: true }))
          );
          localStorage.setItem(
            "generalSettings",
            JSON.stringify(generalSettingsState.get({ noproxy: true }))
          );
          loadingState.set(false);
          navigate("/attendance");
          return;
        }
      } else {
        alert("Domain does not exist!");
      }
      loadingState.set(false);
    } catch (e) {
      console.error(e, "error login");
      alert(`Something went wrong! ${e.message}`);
    } finally {
      loadingState.set(false);
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
              onChange={(event) => formState.domain.set(event.target.value)}
              type="text"
              placeholder={"example"}
            />
          </div>
          <div className={"flex justify-between items-center mt-4"}>
            <label className={"text-gray-500"}>Email:</label>
            <input
              onChange={(event) => formState.email.set(event.target.value)}
              type="email"
              placeholder={"embrace@technologies.dk"}
            />
          </div>
          <div className={"flex justify-between items-center mt-4"}>
            <label className={"text-gray-500"}>Password:</label>
            <input
              onChange={(event) => formState.password.set(event.target.value)}
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
