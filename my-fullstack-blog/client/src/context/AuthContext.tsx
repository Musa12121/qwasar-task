import { API_BASE_URL } from "../api";
import { useEffect, useState } from "react";
import type { PropsWithChildren } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "../types";
import { AuthContext } from "./auth-context";

export default function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigator = useNavigate();

  useEffect(() => {
      fetch(`${API_BASE_URL}/api/auth/me`, {
        credentials: "include",
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error("Invalid or expired token");
        })
        .then((data) => {
          setUser(data);
          setLoading(false);
        })
        .catch(() => {
          setUser(null);
          setLoading(false);
        });
  }, []);

  async function register(email: string, username: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        username,
        password,
      }),
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message,
      };
    }

    setUser(data.user);
    return {
      success: true,
      message: "",
    };
  }

  async function login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      console.log(data.message);
      return false;
    }

    setUser(data.user);
    return true;
  }

  function logout() {
    setUser(null);
    navigator("/");
  }

  return (
    <AuthContext.Provider
      value={{ register, login, logout, user, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}
