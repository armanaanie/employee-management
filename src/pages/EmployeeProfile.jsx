import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import PasswordInput from "../components/PasswordInput";
import { Save } from "lucide-react";

const EmployeeProfile = () => {
  const { user, token, updateAuthSession } = useAuth();
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [image, setImage] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setUsername(user?.username || "");
    setEmail(user?.email || "");
  }, [user?.username, user?.email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (password && password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    const hasChanges =
      (username && username !== user?.username) ||
      (email && email !== user?.email) ||
      password ||
      image;

    if (!hasChanges) {
      setMessage("Please update at least one field.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {};
      if (username && username !== user?.username) payload.username = username;
      if (email && email !== user?.email) payload.email = email;
      if (password) payload.password = password;
      if (image) payload.avatar = image;

      const response = await fetch(`/api/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        updateAuthSession({
          token: data.token,
          user: {
            username: data.username || user?.username || "",
            email: data.email || user?.email || "",
            role: data.role || user?.role,
            avatar: data.avatar || user?.avatar || "",
          },
        });
        setMessage("Profile updated successfully.");
        setPassword("");
        setConfirmPassword("");
        setImage("");
      } else {
        setMessage(data.error || "Failed to update profile.");
      }
    } catch (error) {
      console.error(error);
      setMessage("An error occurred while updating your profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="employee-form-page animate-fade-in">
      <div
        className="glass-panel"
        style={{ maxWidth: "700px", padding: "2rem" }}
      >
        <h2 style={{ marginBottom: "1rem" }}>My Profile</h2>
        <p className="subtitle" style={{ marginBottom: "1.5rem" }}>
          Update your name, email, password, and profile photo.
        </p>

        {message && (
          <div
            className="auth-alert auth-alert--success"
            style={{ marginBottom: "1rem" }}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">New Password</label>
            <PasswordInput
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep current password"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <PasswordInput
              className="form-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Profile Photo</label>
            <input
              type="file"
              accept="image/*"
              className="form-input"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) {
                  setImage("");
                  return;
                }

                const reader = new FileReader();
                reader.onload = () => setImage(reader.result || "");
                reader.readAsDataURL(file);
              }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            <Save size={18} />
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmployeeProfile;
