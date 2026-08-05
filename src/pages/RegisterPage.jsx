import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UserPlus } from "lucide-react";
import PasswordInput from "../components/PasswordInput";
import "../index.css";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("employee");
  const [adminAccessCode, setAdminAccessCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState("error");
  const { register, registerError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedbackMessage("");
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    if (!gmailRegex.test(email)) {
      setFeedbackMessage("Please enter a valid Gmail address.");
      setFeedbackType("error");
      return;
    }

    if (password !== confirmPassword) {
      setFeedbackMessage("Passwords do not match.");
      setFeedbackType("error");
      return;
    }

    setIsSubmitting(true);
    const success = await register(
      username,
      email,
      password,
      role,
      adminAccessCode,
    );
    setIsSubmitting(false);

    if (success) {
      setFeedbackMessage("Account created successfully.");
      setFeedbackType("success");
      navigate("/");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass-panel">
        <div className="auth-card__header">
          <div className="auth-icon">
            <UserPlus size={30} />
          </div>
          <h2>Create your account</h2>
          <p>Anyone can sign up. Admin access requires a valid access code.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {(registerError || feedbackMessage) && (
            <div
              className={`auth-alert ${feedbackType === "error" ? "auth-alert--error" : "auth-alert--success"}`}
            >
              {registerError || feedbackMessage}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-control"
              placeholder="Enter username"
              autoComplete="username"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              placeholder="Enter Gmail address"
              pattern="^[a-zA-Z0-9._%+-]+@gmail\.com$"
              title="Please enter a valid Gmail address"
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="form-control"
              required
            >
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="form-control"
              required
            >
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>
            <small
              style={{ color: "var(--text-secondary)", marginTop: "0.35rem" }}
            >
              Enter the admin access code below if you want to create an admin
              account.
            </small>
          </div>

          <div className="form-group">
            <label className="form-label">Admin Access Code</label>
            <PasswordInput
              value={adminAccessCode}
              onChange={(e) => setAdminAccessCode(e.target.value)}
              className="form-control"
              placeholder="Optional for admin signup"
              autoComplete="off"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              placeholder="Enter password"
              autoComplete="new-password"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <PasswordInput
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-control"
              placeholder="Confirm password"
              autoComplete="new-password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary auth-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="auth-link-row">
          Already have access? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
