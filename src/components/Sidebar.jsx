import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Users,
  LogOut,
  Briefcase,
  UserCircle,
  Calendar,
  Clock,
} from "lucide-react";
import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const isAdmin = user?.role === "admin";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Briefcase className="logo-icon" size={32} />
        <span className="logo-text text-gradient">NexusHR</span>
      </div>

      <nav className="nav-menu">
        <NavLink
          to="/"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          end
        >
          <LayoutDashboard className="nav-icon" size={20} />
          <span>Dashboard</span>
        </NavLink>
        {isAdmin && (
          <NavLink
            to="/employees"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <Users className="nav-icon" size={20} />
            <span>Employees</span>
          </NavLink>
        )}
        <NavLink
          to="/leaves"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <Calendar className="nav-icon" size={20} />
          <span>Leave Management</span>
        </NavLink>
        <NavLink
          to="/attendance"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <Clock className="nav-icon" size={20} />
          <span>Attendance</span>
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <UserCircle className="nav-icon" size={20} />
          <span>My Profile</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button
          className="nav-item"
          style={{
            background: "transparent",
            border: "none",
            width: "100%",
            cursor: "pointer",
          }}
          onClick={handleLogout}
        >
          <LogOut className="nav-icon" size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
