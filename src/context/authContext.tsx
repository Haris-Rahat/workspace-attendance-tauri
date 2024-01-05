import React, { PropsWithChildren, createContext, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { Signal } from "@preact/signals-react";
import {
  CHECK_SUBDOMAIN_EXISTANCE,
  LOGIN_USER,
} from "../services/queries/login";
import { generalSettings, user } from "../services/signals/signals";
import { GET_GENERAL_SETTINGS } from "../services/queries/generalSettings";
import { IUser } from "../@types/types";

export interface AuthContextType {
  user: Signal<IUser> | null;
  login: (data: {
    email: string;
    password: string;
    domain: string;
  }) => Promise<{
    login: Record<string, any> | undefined;
    generalSettings: Record<string, any> | undefined;
  }>;
  logout: () => boolean;
  checkDomain: (domain: string) => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async function (data: {
    email: string;
    password: string;
    domain: string;
  }): Promise<{
    login: Record<string, any> | undefined;
    generalSettings: Record<string, any> | undefined;
  }> {
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
  const [loginQuery] = useLazyQuery(LOGIN_USER);

  const [checkDomainQuery] = useLazyQuery(CHECK_SUBDOMAIN_EXISTANCE);

  const [getGeneralSettings] = useLazyQuery(GET_GENERAL_SETTINGS);

  const login = async (data: {
    email: string;
    password: string;
    domain: string;
  }) => {
    try {
      const res = await loginQuery({
        variables: {
          email: data?.email,
          password: data?.password,
        },
        context: {
          headers: {
            database: data?.domain,
          },
        },
      });
      const _res = await getGeneralSettings({
        fetchPolicy: "cache-first",
        context: {
          headers: {
            database: data?.domain,
            authorization: `Bearer ${res.data?.login?.token}`,
          },
        },
      });
      return {
        login: res.data?.login ?? undefined,
        generalSettings: _res.data?.generalSettings ?? undefined,
      };
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
      console.log(res);
      if (res.data) return res.data?.exists;
    } catch (e: any) {
      console.log(e);

      throw new Error(e?.message);
    }
  };

  const isLoggedIn = () => {
    const _user: IUser = JSON.parse(localStorage.getItem("user") as string);
    const _generalSettings = JSON.parse(
      localStorage.getItem("generalSettings") as string
    );
    if (!!_user && !!_generalSettings) {
      user.value = _user;
      generalSettings.value = _generalSettings;
      return true;
    }
    return false;
  };

  const logout = () => {
    user.value = {
      id: "",
      email: "",
      name: "",
      token: "",
      domain: "",
    };
    // localStorage.removeItem("domain");
    localStorage.removeItem("user");
    localStorage.removeItem("generalSettings");
    return true;
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, checkDomain }}>
      {children}
    </AuthContext.Provider>
  );
};
