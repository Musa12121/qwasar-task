import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { NavLink } from "react-router-dom";

export default function Navbar({ user }) {
  const { logout } = useContext(AuthContext);

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "right",
        gap: "29px",
        margin: "10px 0 35px 0",
      }}
    >
      {user && user.role === "admin" && (
        <NavLink to="/admin" className="admin-button">
          Admin Panel
        </NavLink>
      )}
      <span className="welcome-message">Welcome, {user && user.username}</span>{" "}
      <button onClick={logout} className="logout-button">
        Logout
      </button>
    </nav>
  );
}
