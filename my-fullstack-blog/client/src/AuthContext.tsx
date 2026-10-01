import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigator = useNavigate();

  useEffect(() => {
      setLoading(true);
      fetch("http://localhost:5500/api/auth/me", {
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
        .catch((err) => {
          setUser(null);
          setLoading(false);
        });
  }, []);

  async function register(email: string, username: string, password: string) {
    const response = await fetch("http://localhost:5500/api/auth/register", {
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
    const response = await fetch("http://localhost:5500/api/auth/login", {
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
