import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogIn } from "lucide-react";
import "../index.css";

const LoginPage = () => {
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, loginError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await login(credential, password);
    setIsSubmitting(false);

    if (success) {
      navigate("/");
    }
  };

  return (
    <div
      className="app-container"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        className="glass-panel"
        style={{ width: "100%", maxWidth: "400px", padding: "2rem" }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              display: "inline-flex",
              padding: "1rem",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.1)",
              marginBottom: "1rem",
            }}
          >
            <LogIn size={32} color="var(--primary)" />
          </div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "600" }}>Admin Login</h2>
          <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem" }}>
            Sign in to manage employees
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {loginError && (
            <div
              style={{
                padding: "0.75rem",
                borderRadius: "8px",
                background: "rgba(239, 68, 68, 0.1)",
                color: "#ef4444",
                fontSize: "0.875rem",
                textAlign: "center",
              }}
            >
              {loginError}
            </div>
          )}

          <div className="form-group">
            <label>Email or Username</label>
            <input
              type="text"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              className="form-control"
              placeholder="Enter email or username"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              placeholder="Enter password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
            style={{
              width: "100%",
              justifyContent: "center",
              marginTop: "1rem",
            }}
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <p
          style={{
            color: "var(--text-secondary)",
            textAlign: "center",
            marginTop: "1.5rem",
          }}
        >
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
