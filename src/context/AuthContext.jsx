import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

const loadUser = () => {
  try {
    return JSON.parse(localStorage.getItem("adminUser"));
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(
    localStorage.getItem("adminToken") || null,
  );
  const [user, setUser] = useState(loadUser());
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const [loginError, setLoginError] = useState(null);
  const [registerError, setRegisterError] = useState(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem("adminToken", token);
      localStorage.setItem("adminUser", JSON.stringify(user || {}));
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      setIsAuthenticated(false);
      setUser(null);
    }
  }, [token, user]);

  const login = async (credential, password) => {
    setLoginError(null);
    try {
      const isEmail = credential.includes("@");
      const body = isEmail
        ? { email: credential, password }
        : { username: credential, password };

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        setToken(data.token);
        setUser({ username: data.username, email: data.email });
        return true;
      } else {
        setLoginError(data.error || "Login failed");
        return false;
      }
    } catch (error) {
      setLoginError("An error occurred during login.");
      console.error(error);
      return false;
    }
  };

  const register = async (username, email, password) => {
    setRegisterError(null);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setToken(data.token);
        setUser({ username: data.username, email: data.email });
        return true;
      } else {
        setRegisterError(data.error || "Registration failed");
        return false;
      }
    } catch (error) {
      setRegisterError("An error occurred during registration.");
      console.error(error);
      return false;
    }
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        token,
        user,
        login,
        logout,
        loginError,
        register,
        registerError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
