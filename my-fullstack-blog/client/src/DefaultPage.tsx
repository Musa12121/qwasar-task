import { Link } from "react-router-dom";
import "./Default.css";

export default function DefaultPage() {
  return (
    <main className="default-page">
      <div className="default-links">
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </div>
    </main>
  );
}