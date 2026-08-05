import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const EmployeeContext = createContext();

export const useEmployees = () => useContext(EmployeeContext);

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
    
    // Poll every 5 seconds to keep data fresh across clients
    const intervalId = setInterval(fetchEmployees, 5000);

    return () => clearInterval(intervalId);
  }, [isAuthenticated, token]);

  const addEmployee = async (employee) => {
    if (!token) return false;

    const newEmployee = {
      ...employee,
      id: Date.now().toString(),
      avatar: employee.avatar || "",
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
        setEmployees((prev) => [...prev, data]);
        return true;
      }

      const errData = await response.json();
      alert(`Failed to add employee: ${errData.error || "Unknown error"}`);
      console.error(errData);
      return false;
    } catch (error) {
      alert("Network error: Failed to add employee");
      console.error(error);
      return false;
    }
  };

  const updateEmployee = async (id, updatedData) => {
    if (!token) return false;

    try {
      const response = await fetch(`/api/employees/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        const data = await response.json();
        setEmployees((prev) => prev.map((emp) => (emp.id === id ? data : emp)));
        return true;
      }

      const errData = await response.json();
      alert(`Failed to update employee: ${errData.error || "Unknown error"}`);
      console.error(errData);
      return false;
    } catch (error) {
      console.error("Failed to update employee", error);
      return false;
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
        setEmployees((prev) => prev.filter((emp) => emp.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete employee", error);
    }
  };

  const getEmployee = (id) => employees.find((emp) => emp.id === id);

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
