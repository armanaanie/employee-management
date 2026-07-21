import React, { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";

const EmployeeContext = createContext();

export const useEmployees = () => {
  return useContext(EmployeeContext);
};

export const EmployeeProvider = ({ children }) => {
  const [employees, setEmployees] = useState([]);
  const { token, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      setEmployees([]);
      return;
    }

    const fetchEmployees = async () => {
      try {
        const response = await fetch("/api/employees", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setEmployees(data);
        }
      } catch (error) {
        console.error("Failed to fetch employees", error);
      }
    };
    fetchEmployees();
  }, [isAuthenticated, token]);

  const addEmployee = async (employee) => {
    if (!token) return;

    const newEmployee = {
      ...employee,
      id: Date.now().toString(),
      avatar: `https://i.pravatar.cc/150?u=${employee.name.replace(/\s/g, "")}`,
    };
    try {
      const response = await fetch("/api/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newEmployee),
      });
      if (response.ok) {
        const data = await response.json();
        setEmployees([...employees, data]);
      }
    } catch (error) {
      console.error("Failed to add employee", error);
    }
  };

  const updateEmployee = async (id, updatedData) => {
    const employeeToUpdate = employees.find((emp) => emp.id === id);
    if (!employeeToUpdate) return;

    const newEmployeeData = { ...employeeToUpdate, ...updatedData };
    try {
      const response = await fetch(`/api/employees/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newEmployeeData),
      });
      if (response.ok) {
        const data = await response.json();
        setEmployees(employees.map((emp) => (emp.id === id ? data : emp)));
      }
    } catch (error) {
      console.error("Failed to update employee", error);
    }
  };

  const deleteEmployee = async (id) => {
    if (!token) return;

    try {
      const response = await fetch(`/api/employees/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setEmployees(employees.filter((emp) => emp.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete employee", error);
    }
  };

  const getEmployee = (id) => {
    return employees.find((emp) => emp.id === id);
  };

  const getStats = () => {
    const total = employees.length;
    const active = employees.filter((emp) => emp.status === "Active").length;
    const departments = new Set(employees.map((emp) => emp.department)).size;
    return { total, active, departments };
  };

  return (
    <EmployeeContext.Provider
      value={{
        employees,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        getEmployee,
        getStats,
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};
