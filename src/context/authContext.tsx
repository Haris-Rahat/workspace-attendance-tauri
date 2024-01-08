import React, { PropsWithChildren, createContext, useEffect } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  CHECK_SUBDOMAIN_EXISTANCE,
  LOGIN_USER,
} from "../services/queries/login";
import { State, useHookstate } from "@hookstate/core";
import { GeneralSettingsState, UserState } from "../services/state/globalState";
import { GET_GENERAL_SETTINGS } from "../services/queries/generalSettings";
import { IUser } from "../@types/types";
import { REFRESH_TOKEN } from "../services/mutations/refreshToken";

export interface AuthContextType {
  userState: State<IUser> | null;
  login: (data: {
    email: string;
    password: string;
    domain: string;
  }) => Promise<void>;
  logout: () => boolean;
  checkDomain: (domain: string) => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextType>({
  userState: null,
  login: () => {
    throw new Error("login function must be implemented");
  },
  logout: () => {
    throw new Error("logout function must be implemented");
  },
  checkDomain: () => {
    throw new Error("checkDomain function must be implemented");
  },
});

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const userState = useHookstate(UserState);
  const generalSettingsState = useHookstate(GeneralSettingsState);
  const [loginQuery] = useLazyQuery(LOGIN_USER);

  const [checkDomainQuery] = useLazyQuery(CHECK_SUBDOMAIN_EXISTANCE);

  const [getGeneralSettings] = useLazyQuery(GET_GENERAL_SETTINGS);

  const [refreshToken] = useMutation(REFRESH_TOKEN);

  useEffect(() => {
    const refetchToken = () => {
      refreshToken({
        fetchPolicy: "no-cache",
        variables: {
          token: UserState.token.get(),
        },
        context: {
          headers: { database: userState.domain.get() || "" },
        },
      })
        .then(({ data }) => {
          userState.token.set(data?.refreshToken);
          localStorage.setItem("user", JSON.stringify(userState.get()));
          return data?.refreshToken;
        })
        .catch((_error) => {
          console.error(_error);
        });
    };

    const ONE_HOUR = 10000 * 60 * 60;
    setInterval(() => {
      if (userState.id.get()) {
        refetchToken();
      }
    }, ONE_HOUR);
  }, [refreshToken]);

  const login = async (formData: {
    email: string;
    password: string;
    domain: string;
  }) => {
    try {
      const { data, error } = await loginQuery({
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
      if (error) throw new Error(error.message);
      const { data: _data, error: _error } = await getGeneralSettings({
        fetchPolicy: "cache-first",
        context: {
          headers: {
            database: formData.domain,
            authorization: `Bearer ${data?.login?.token}`,
          },
        },
      });
      if (_error) throw new Error(_error.message);
      userState.set({
        id: data.login?.id,
        email: data.login?.email,
        name: `${data.login?.user.firstName} ${data.login?.user.lastName}`,
        token: data.login?.token,
        domain: formData.domain,
      });
      const { __typename, ...rest } = _data.generalSettings;
      generalSettingsState.set({ ...rest });
      localStorage.setItem(
        "user",
        JSON.stringify(userState.get({ noproxy: true }))
      );
      localStorage.setItem(
        "generalSettings",
        JSON.stringify(generalSettingsState.get({ noproxy: true }))
      );
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
      console.log("user", user, generalSettings);
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
    generalSettingsState.set({
      timezone: {
        name: "Europe/Copenhagen",
      },
    });
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
