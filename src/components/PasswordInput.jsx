import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const PasswordInput = ({
  value,
  onChange,
  placeholder,
  name,
  autoComplete,
  required,
  className = "form-control",
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        name={name}
        autoComplete={autoComplete}
        required={required}
        className={className}
        style={{ paddingRight: "2.75rem" }}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        aria-label={showPassword ? "Hide password" : "Show password"}
        style={{
          position: "absolute",
          right: "0.75rem",
          top: "50%",
          transform: "translateY(-50%)",
          background: "transparent",
          border: "none",
          color: "var(--text-secondary)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
        }}
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
};

export default PasswordInput;
