import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UserPlus } from "lucide-react";
import "../index.css";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const { register, registerError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");

    if (password !== confirmPassword) {
      setSuccessMessage("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    const success = await register(username, email, password);
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
        style={{ width: "100%", maxWidth: "420px", padding: "2rem" }}
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
            <UserPlus size={32} color="var(--primary)" />
          </div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "600" }}>
            Create Account
          </h2>
          <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem" }}>
            Register a new admin account
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {registerError && (
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
              {registerError}
            </div>
          )}

          {successMessage && (
            <div
              style={{
                padding: "0.75rem",
                borderRadius: "8px",
                background: "rgba(34, 197, 94, 0.12)",
                color: "#22c55e",
                fontSize: "0.875rem",
                textAlign: "center",
              }}
            >
              {successMessage}
            </div>
          )}

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-control"
              placeholder="Enter username"
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              placeholder="Enter email"
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

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-control"
              placeholder="Confirm password"
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
            {isSubmitting ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p
          style={{
            color: "var(--text-secondary)",
            textAlign: "center",
            marginTop: "1.5rem",
          }}
        >
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
