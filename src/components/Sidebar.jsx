import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Settings, LogOut, Briefcase } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Briefcase className="logo-icon" size={32} />
        <span className="logo-text text-gradient">NexusHR</span>
      </div>

      <nav className="nav-menu">
        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
          <LayoutDashboard className="nav-icon" size={20} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/employees" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Users className="nav-icon" size={20} />
          <span>Employees</span>
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Settings className="nav-icon" size={20} />
          <span>Settings</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item" style={{ background: 'transparent', border: 'none', width: '100%', cursor: 'pointer' }}>
          <LogOut className="nav-icon" size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
