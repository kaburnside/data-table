import { createContext } from "react";
import { LoginCredentials, User } from "../types";


export const AuthContext = createContext<{
  user?: User,
  isAuth: boolean,
  error?: string,
  login: (creds: LoginCredentials) => void,
  logout: () => void
}>({
  isAuth: false,
  login: async (_) => { },
  logout: () => { }
});