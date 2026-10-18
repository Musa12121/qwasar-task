import { createContext, useContext } from "react";
import type { User } from "../types";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  register: (
    email: string,
    username: string,
    password: string,
  ) => Promise<{ success: boolean; message: string }>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
