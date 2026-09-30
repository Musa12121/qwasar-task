import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import Spinner from "./Spinner";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <Spinner />;
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return children;
}