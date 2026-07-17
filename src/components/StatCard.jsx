import React from 'react';
import './StatCard.css';

const StatCard = ({ title, value, icon: Icon, trend, className }) => {
  return (
    <div className={`stat-card glass-panel ${className}`}>
      <div className="stat-card-header">
        <div className="stat-icon-wrapper">
          <Icon className="stat-icon" size={24} />
        </div>
        {trend && (
          <span className={`stat-trend ${trend >= 0 ? 'positive' : 'negative'}`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div className="stat-card-body">
        <h3 className="stat-value">{value}</h3>
        <p className="stat-title">{title}</p>
      </div>
    </div>
  );
};

export default StatCard;
