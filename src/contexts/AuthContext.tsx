import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/router";
import { setCookie, destroyCookie, parseCookies } from "nookies";
import { api } from "../services/axios/api";

type User = {
  name: string;
  email: string;
};

interface AuthContextProps {
  user: User | undefined;
  signIn: (name: string, password: string) => Promise<void>;
  signOut: () => void;
}

interface AuthContextProviderProps {
  children: ReactNode;
}

const AuthContext = createContext({} as AuthContextProps);

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<User>();
  const router = useRouter();

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const response = await api.post("/sessions", {
        email,
        password,
      });

      const { user, token, refresh_token: refreshToken } = response.data;

      setCookie(undefined, "PomoTask.token", token);
      setCookie(undefined, "PomoTask.refreshToken", refreshToken);

      setUser({
        name: user.name,
        email: user.email,
      });

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      router.push("/");
    } catch {
      throw new Error();
    }
  }, []);

  const signOut = useCallback(() => {
    destroyCookie(undefined, "PomoTask.token");
    destroyCookie(undefined, "PomoTask.refreshToken");
    setUser(undefined);
  }, []);

  useEffect(() => {
    const { "PomoTask.token": token } = parseCookies();

    if (token) {
      api
        .get("/users/info")
        .then((response) => {
          const { name, email } = response.data;

          setUser({
            name,
            email,
          });
        })
        .catch(signOut);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
