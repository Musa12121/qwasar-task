import { useState } from "react";
import type { FormEvent } from "react";
import "../../styles/Register.css";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigator = useNavigate();

  const { register } = useAuth();

  async function submitHandler(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const result= await register(email, username, password);
    if (!(result.success)) {
      setError(result.message);
      return;
    }
    navigator("/posts");
  }

  return (
    <div className="auth-page">
      <form className="register-form" onSubmit={submitHandler}>
        <h1>Create Account</h1>
        <p className="auth-subtitle">Register to get started</p>
        {error && <p className="error-message">{error}</p>}
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            placeholder="Choose a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit">Register</button>

        <p className="auth-link">
          Already have an account? <Link to={"/login"}>Login</Link>
        </p>
      </form>
    </div>
  );
}
