import React from 'react';
import { useEmployees } from '../context/EmployeeContext';
import StatCard from '../components/StatCard';
import EmployeeTable from '../components/EmployeeTable';
import { Users, Briefcase, Activity, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { employees, getStats } = useEmployees();
  const stats = getStats();
  
  // Get latest 3 employees
  const recentEmployees = [...employees]
    .sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate))
    .slice(0, 3);

  return (
    <div className="dashboard animate-fade-in">
      <div className="page-header">
        <div>
          <h1>Dashboard Overview</h1>
          <p className="subtitle">Here's what's happening today.</p>
        </div>
        <Link to="/employees/new" className="btn btn-primary">
          <UserPlus size={18} />
          Add Employee
        </Link>
      </div>

      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <StatCard 
          title="Total Employees" 
          value={stats.total} 
          icon={Users} 
          trend={12} 
          className="delay-100" 
        />
        <StatCard 
          title="Active Employees" 
          value={stats.active} 
          icon={Activity} 
          trend={5} 
          className="delay-200" 
        />
        <StatCard 
          title="Departments" 
          value={stats.departments} 
          icon={Briefcase} 
          className="delay-300" 
        />
      </div>

      <div className="recent-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3>Recently Added</h3>
          <Link to="/employees" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>View All</Link>
        </div>
        <EmployeeTable employees={recentEmployees} />
      </div>
    </div>
  );
};

export default Dashboard;
