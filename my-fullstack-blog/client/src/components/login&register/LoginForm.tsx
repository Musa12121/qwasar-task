import { useContext, useState } from "react";
import "../../styles/Login.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigator = useNavigate();
  const location = useLocation();

  async function submitHandler(e) {
    e.preventDefault();

    if (await login(email, password)) {
      if (location.state?.from) {
        navigator(location.state.from);
      } else {
        navigator("/posts");
      }
    } else {
      setError("Invalid email or password");
      return;
    }
  }

  return (
    <div className="auth-page">
      <form className="login-form" onSubmit={submitHandler}>
        <h1>Welcome Back</h1>
        <p className="auth-subtitle">Login to your account</p>
        {error && <p className="error-message">{error}</p>}

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
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit">Login</button>

        <p className="auth-link">
          Don't have an account? <Link to={"/register"}>Register</Link>
        </p>
      </form>
    </div>
  );
}
