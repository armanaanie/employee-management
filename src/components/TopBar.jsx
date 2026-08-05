import React from "react";
import { Search, Bell } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./TopBar.css";

const TopBar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const getPageTitle = () => {
    if (location.pathname === "/") return "Dashboard";
    if (location.pathname.startsWith("/employees/new")) return "Add Employee";
    if (location.pathname.startsWith("/employees/edit")) return "Edit Employee";
    if (location.pathname.startsWith("/employees")) return "Employee Directory";
    if (location.pathname.startsWith("/profile")) return "My Profile";
    return "";
  };

  return (
    <header className="topbar">
      <div className="topbar-title">
        <h2>{getPageTitle()}</h2>
        <span className="subtitle">
          Welcome back, {user?.username || "Admin"}
        </span>
      </div>
      <div className="topbar-actions"></div>
    </header>
  );
};

export default TopBar;
