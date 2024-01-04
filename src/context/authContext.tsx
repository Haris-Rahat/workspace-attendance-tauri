import { useLazyQuery } from "@apollo/client";
import { Signal, signal } from "@preact/signals";
import { ComponentChildren, FunctionComponent, createContext } from "preact";
import {
  CHECK_SUBDOMAIN_EXISTANCE,
  LOGIN_USER,
} from "../services/queries/login";
import { user } from "../services/signals/signals";
import { useEffect } from "preact/hooks";

export interface User {
  id: string;
  email: string;
  name: string;
  token: string;
  domain: string;
}

export interface AuthContextType {
  user: Signal<User> | null;
  login: (data: {
    email: string;
    password: string;
    domain: string;
  }) => Promise<Record<string, any>>;
  logout: () => boolean;
  checkDomain: (domain: string) => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async function (data: {
    email: string;
    password: string;
    domain: string;
  }): Promise<Record<string, any>> {
    throw new Error("Function not implemented.");
  },
  logout: function (): boolean {
    throw new Error("Function not implemented.");
  },
  checkDomain: function async(domain: string): Promise<boolean> {
    throw new Error("Function not implemented.");
  },
});

type Props = {
  children: ComponentChildren;
};

export const AuthProvider: FunctionComponent<Props> = ({ children }) => {
  const [loginQuery] = useLazyQuery(LOGIN_USER);

  const [checkDomainQuery] = useLazyQuery(CHECK_SUBDOMAIN_EXISTANCE);

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
      if (res.data) return res.data?.login;
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
    const _user: User = JSON.parse(localStorage.getItem("user") as string);
    if (_user?.id) {
      user.value = _user;
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
