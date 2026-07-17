import React, { useState, useMemo } from 'react';
import { useEmployees } from '../context/EmployeeContext';
import EmployeeTable from '../components/EmployeeTable';
import { departments, statuses } from '../data/mockEmployees';
import { UserPlus, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmployeeDirectory = () => {
  const { employees } = useEmployees();
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            emp.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = departmentFilter ? emp.department === departmentFilter : true;
      const matchesStatus = statusFilter ? emp.status === statusFilter : true;
      
      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [employees, searchTerm, departmentFilter, statusFilter]);

  return (
    <div className="employee-directory animate-fade-in">
      <div className="page-header">
        <div>
          <h1>Employee Directory</h1>
          <p className="subtitle">Manage your team members and their information.</p>
        </div>
        <Link to="/employees/new" className="btn btn-primary">
          <UserPlus size={18} />
          Add Employee
        </Link>
      </div>

      <div className="filters-section glass-panel" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
          <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search employees..." 
            className="form-input" 
            style={{ paddingLeft: '2.5rem' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <Filter size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <select 
              className="form-select" 
              style={{ paddingLeft: '2.5rem', width: '200px' }}
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <option value="">All Departments</option>
              {departments.map(dep => (
                <option key={dep} value={dep}>{dep}</option>
              ))}
            </select>
          </div>
          
          <div style={{ position: 'relative' }}>
            <Filter size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <select 
              className="form-select" 
              style={{ paddingLeft: '2.5rem', width: '160px' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              {statuses.map(stat => (
                <option key={stat} value={stat}>{stat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <EmployeeTable employees={filteredEmployees} />
    </div>
  );
};

export default EmployeeDirectory;
