import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigator = useNavigate();

  useEffect(() => {
    const tokenInStorage = localStorage.getItem("token");
    if (tokenInStorage) {
      setLoading(true);
      setToken(tokenInStorage);
      fetch("http://localhost:5500/api/auth/me", {
        headers: {
          Authorization: `Bearer ${tokenInStorage}`,
        },
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
          console.log(err.message);
          setLoading(false);
          localStorage.removeItem("token");
          setUser(null);
          setToken(null);
        });
    } else {
      setUser(null);
      setToken(null);
    }
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
    });

    const data = await response.json();

    if (!response.ok) {
      console.log(data.message);
      return false;
    }

    localStorage.setItem("token", data.token);
    setToken(data.token);
    setUser(data.user);
    return true;
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
    });

    const data = await response.json();

    if (!response.ok) {
      console.log(data.message);
      return false;
    }

    localStorage.setItem("token", data.token);
    setToken(data.token);
    setUser(data.user);
    return true;
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    navigator("/");
  }

  return (
    <AuthContext.Provider
      value={{ register, login, logout, user, token, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}
