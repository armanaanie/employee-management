import React, { createContext, useState, useContext, useEffect } from 'react';
import { mockEmployees } from '../data/mockEmployees';

const EmployeeContext = createContext();

export const useEmployees = () => {
  return useContext(EmployeeContext);
};

export const EmployeeProvider = ({ children }) => {
  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem('employees');
    if (saved) {
      return JSON.parse(saved);
    }
    return mockEmployees;
  });

  useEffect(() => {
    localStorage.setItem('employees', JSON.stringify(employees));
  }, [employees]);

  const addEmployee = (employee) => {
    const newEmployee = {
      ...employee,
      id: Date.now().toString(),
      avatar: `https://i.pravatar.cc/150?u=${employee.name.replace(/\s/g, '')}`,
    };
    setEmployees([...employees, newEmployee]);
  };

  const updateEmployee = (id, updatedData) => {
    setEmployees(employees.map(emp => emp.id === id ? { ...emp, ...updatedData } : emp));
  };

  const deleteEmployee = (id) => {
    setEmployees(employees.filter(emp => emp.id !== id));
  };

  const getEmployee = (id) => {
    return employees.find(emp => emp.id === id);
  };

  const getStats = () => {
    const total = employees.length;
    const active = employees.filter(emp => emp.status === 'Active').length;
    const departments = new Set(employees.map(emp => emp.department)).size;
    return { total, active, departments };
  };

  return (
    <EmployeeContext.Provider value={{
      employees,
      addEmployee,
      updateEmployee,
      deleteEmployee,
      getEmployee,
      getStats
    }}>
      {children}
    </EmployeeContext.Provider>
  );
};
