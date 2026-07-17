import React from 'react';
import { Search, Bell } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import './TopBar.css';

const TopBar = () => {
  const location = useLocation();
  
  const getPageTitle = () => {
    if (location.pathname === '/') return 'Dashboard';
    if (location.pathname.startsWith('/employees/new')) return 'Add Employee';
    if (location.pathname.startsWith('/employees/edit')) return 'Edit Employee';
    if (location.pathname.startsWith('/employees')) return 'Employee Directory';
    if (location.pathname.startsWith('/settings')) return 'Settings';
    return '';
  };

  return (
    <header className="topbar">
      <div className="topbar-title">
        <h2>{getPageTitle()}</h2>
        <span className="subtitle">Welcome back, Admin</span>
      </div>

      <div className="topbar-actions">
        <div className="search-bar glass-panel">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Search..." className="search-input" />
        </div>
        
        <button className="btn-icon notification-btn">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>
        
        <div className="user-profile">
          <img src="https://i.pravatar.cc/150?u=admin" alt="Admin" className="avatar" />
        </div>
      </div>
    </header>
  );
};

export default TopBar;
