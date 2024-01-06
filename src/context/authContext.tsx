import React, { PropsWithChildren, createContext, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import {
  CHECK_SUBDOMAIN_EXISTANCE,
  LOGIN_USER,
} from "../services/queries/login";
import { State, useHookstate } from "@hookstate/core";
import { GeneralSettingsState, UserState } from "../services/state/globalState";
import { GET_GENERAL_SETTINGS } from "../services/queries/generalSettings";
import { IUser } from "../@types/types";

export interface AuthContextType {
  userState: State<IUser> | null;
  login: (data: {
    email: string;
    password: string;
    domain: string;
  }) => Promise<boolean>;
  logout: () => boolean;
  checkDomain: (domain: string) => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextType>({
  userState: null,
  login: async function (data: {
    email: string;
    password: string;
    domain: string;
  }): Promise<boolean> {
    throw new Error("Function not implemented.");
  },
  logout: function (): boolean {
    throw new Error("Function not implemented.");
  },
  checkDomain: function async(domain: string): Promise<boolean> {
    throw new Error("Function not implemented.");
  },
});

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const userState = useHookstate(UserState);
  const generalSettingsState = useHookstate(GeneralSettingsState);
  const [loginQuery] = useLazyQuery(LOGIN_USER);

  const [checkDomainQuery] = useLazyQuery(CHECK_SUBDOMAIN_EXISTANCE);

  const [getGeneralSettings] = useLazyQuery(GET_GENERAL_SETTINGS);

  const login = async (formData: {
    email: string;
    password: string;
    domain: string;
  }) => {
    try {
      const { data } = await loginQuery({
        variables: {
          email: formData?.email,
          password: formData?.password,
        },
        context: {
          headers: {
            database: formData?.domain,
          },
        },
      });
      const { data: _data } = await getGeneralSettings({
        fetchPolicy: "cache-first",
        context: {
          headers: {
            database: formData.domain,
            authorization: `Bearer ${data?.login?.token}`,
          },
        },
      });
      if (!!data.login && !!_data.generalSettings) {
        userState.set({
          id: data.login?.id,
          email: data.login?.email,
          name: `${data.login?.user.firstName} ${data.login?.user.lastName}`,
          token: data.login?.token,
          domain: formData.domain,
        });
        generalSettingsState.set({ ..._data.generalSettings });
        localStorage.setItem(
          "user",
          JSON.stringify(userState.get({ noproxy: true }))
        );
        localStorage.setItem(
          "generalSettings",
          JSON.stringify(generalSettingsState.get({ noproxy: true }))
        );
        return true;
      }
      return false;
    } catch (e: any) {
      throw new Error(e?.message);
    }
  };

  const checkDomain = async (domain: string) => {
    try {
      const res = await checkDomainQuery({
        variables: {
          domain,
        },
        onError: (error) => {
          console.error(error);
        },
        onCompleted: (data) => {
          console.warn(data, "data");
        },
      });
      if (res.data) return res.data?.exists;
    } catch (e: any) {
      console.log(e);

      throw new Error(e?.message);
    }
  };

  const isLoggedIn = () => {

    const user: IUser = JSON.parse(localStorage.getItem("user") as string);
    const generalSettings = JSON.parse(
      localStorage.getItem("generalSettings") as string
    );
    if (!!user && !!generalSettings) {
      userState.set(user);
      generalSettingsState.set(generalSettings);
      return true;
    }
    return false;
  };

  const logout = () => {
    userState.set({
      id: "",
      email: "",
      name: "",
      token: "",
      domain: "",
    });
    // localStorage.removeItem("domain");
    localStorage.removeItem("user");
    localStorage.removeItem("generalSettings");
    return true;
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider value={{ userState, login, logout, checkDomain }}>
      {children}
    </AuthContext.Provider>
  );
};
