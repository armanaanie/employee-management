import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEmployees } from '../context/EmployeeContext';
import { departments, statuses } from '../data/mockEmployees';
import { Save, X } from 'lucide-react';

const EmployeeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addEmployee, updateEmployee, getEmployee } = useEmployees();
  
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    department: departments[0],
    status: statuses[0],
    joinDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (isEditMode) {
      const employee = getEmployee(id);
      if (employee) {
        setFormData(employee);
      } else {
        navigate('/employees');
      }
    }
  }, [id, isEditMode, getEmployee, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditMode) {
      updateEmployee(id, formData);
    } else {
      addEmployee(formData);
    }
    navigate('/employees');
  };

  return (
    <div className="employee-form-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1>{isEditMode ? 'Edit Employee' : 'Add New Employee'}</h1>
          <p className="subtitle">Fill in the details below.</p>
        </div>
      </div>

      <div className="glass-panel" style={{ maxWidth: '800px', padding: '2.5rem' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input 
                type="text" 
                name="name"
                className="form-input" 
                placeholder="e.g. Jane Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input 
                type="email" 
                name="email"
                className="form-input" 
                placeholder="e.g. jane@company.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Job Role</label>
              <input 
                type="text" 
                name="role"
                className="form-input" 
                placeholder="e.g. Senior Developer"
                value={formData.role}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Department</label>
              <select 
                name="department"
                className="form-select"
                value={formData.department}
                onChange={handleChange}
              >
                {departments.map(dep => (
                  <option key={dep} value={dep}>{dep}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Status</label>
              <select 
                name="status"
                className="form-select"
                value={formData.status}
                onChange={handleChange}
              >
                {statuses.map(stat => (
                  <option key={stat} value={stat}>{stat}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Join Date</label>
              <input 
                type="date" 
                name="joinDate"
                className="form-input" 
                value={formData.joinDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--color-border)' }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/employees')}>
              <X size={18} /> Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={18} /> {isEditMode ? 'Save Changes' : 'Create Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;
