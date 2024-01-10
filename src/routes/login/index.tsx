import { useAuthContext } from "../../services/hooks/useAuthContext";
import { LoadingState } from "../../services/state/globalState";
import { useNavigate } from "react-router-dom";
import { useHookstate } from "@hookstate/core";
import { useRender } from "../../services/hooks/useRender";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { ReloadIcon, EyeOpenIcon, EyeClosedIcon } from "@radix-ui/react-icons";
import { useState } from "react";

const Login: React.FC = () => {
  const { login, checkDomain } = useAuthContext();
  const navigate = useNavigate();
  const formState = useHookstate({
    domain: "",
    email: "",
    password: "",
  });
  const loadingState = useHookstate(LoadingState);
  const [togglePassword, setTogglePassword] = useState(false);

  useRender("Login");

  const handleClick = async () => {
    if (
      formState.domain.get().length === 0 ||
      formState.email.get().length === 0 ||
      formState.password.get().length === 0
    ) {
      alert("Please fill in all fields!");
      return;
    }
    loadingState.set(true);
    try {
      const res = await checkDomain(formState.domain.get());
      if (res) {
        await login(formState.get());
        formState.set({
          domain: "",
          email: "",
          password: "",
        });
        loadingState.set(false);
        navigate("/attendance");
      } else {
        alert("Domain does not exist!");
      }
      loadingState.set(false);
    } catch (e: any) {
      console.error(e, "error login");
      alert(`Something went wrong! ${e.message}`);
    } finally {
      loadingState.set(false);
    }
  };

  return (
    <div className={"h-screen flex flex-col justify-center items-center"}>
      <Card className={"sm:w-2/3 lg:w-1/3 bg-slate-900"}>
        <CardHeader>
          <h1 className={"text-center text-white text-5xl underline"}>
            Workspace
          </h1>
        </CardHeader>
        <CardContent>
          <div className={"mt-4"}>
            <label className={"text-white text-2xl"}>Domain:</label>
            <br />
            <Input
              className={"mt-4 h-14 bg-slate-800 text-xl"}
              onChange={(event) => formState.domain.set(event.target.value)}
              type="text"
              placeholder={"example"}
            />
          </div>
          <div className={"mt-4"}>
            <label className={"text-white text-2xl"}>Email:</label>
            <br />
            <Input
              className={"mt-4 h-14 bg-slate-800 text-xl"}
              onChange={(event) => formState.email.set(event.target.value)}
              type="email"
              placeholder={"embrace@technologies.dk"}
            />
          </div>
          <div className={"mt-4"}>
            <label className={"text-white text-2xl"}>Password:</label>
            <br />
            <div className={"relative"}>
              {!togglePassword ? (
                <EyeOpenIcon
                  onClick={() => setTogglePassword(!togglePassword)}
                  className="mr-2 h-6 w-6 absolute right-2 top-3.5"
                />
              ) : (
                <EyeClosedIcon
                  onClick={() => setTogglePassword(!togglePassword)}
                  className="mr-2 h-6 w-6 absolute right-2 top-3.5"
                />
              )}
              <Input
                className={"mt-4 h-14 bg-slate-800 text-xl"}
                onChange={(event) => formState.password.set(event.target.value)}
                type={togglePassword ? "text" : "password"}
                placeholder={"**********"}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            disabled={loadingState.get()}
            variant={"default"}
            className={"w-full h-14 mt-6 text-xl"}
            onClick={handleClick}
            type="button"
          >
            {loadingState.get() && (
              <ReloadIcon className="mr-2 h-6 w-6 animate-spin" />
            )}{" "}
            Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
