import React, { useState } from "react";
import { MoreVertical, Edit2, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEmployees } from "../context/EmployeeContext";
import { statuses } from "../data/mockEmployees";
import "./EmployeeTable.css";

const EmployeeTable = ({ employees }) => {
  const navigate = useNavigate();
  const { deleteEmployee, updateEmployee } = useEmployees();
  const [openMenuId, setOpenMenuId] = useState(null);

  const toggleMenu = (id) => {
    if (openMenuId === id) {
      setOpenMenuId(null);
    } else {
      setOpenMenuId(id);
    }
  };

  const handleEdit = (id) => {
    navigate(`/employees/edit/${id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      deleteEmployee(id);
      setOpenMenuId(null);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    updateEmployee(id, { status: newStatus });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Active":
        return <span className="badge badge-success">Active</span>;
      case "On Leave":
        return <span className="badge badge-warning">On Leave</span>;
      case "Terminated":
        return (
          <span
            className="badge badge-danger"
            style={{
              backgroundColor: "var(--color-danger-bg)",
              color: "var(--color-danger)",
            }}
          >
            Terminated
          </span>
        );
      default:
        return <span className="badge badge-primary">{status}</span>;
    }
  };

  if (employees.length === 0) {
    return (
      <div className="empty-state glass-panel">
        <p>No employees found.</p>
      </div>
    );
  }

  return (
    <div className="table-container glass-panel">
      <table className="employee-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Role</th>
            <th>Department</th>
            <th>Status</th>
            <th>Joined</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id} className="table-row">
              <td>
                <div className="employee-info">
                  <img
                    src={emp.avatar}
                    alt={emp.name}
                    className="employee-avatar"
                  />
                  <div>
                    <p className="employee-name">{emp.name}</p>
                    <p className="employee-email">{emp.email}</p>
                  </div>
                </div>
              </td>
              <td>{emp.role}</td>
              <td>{emp.department}</td>
              <td>
                <select
                  className="form-select"
                  value={emp.status || ""}
                  onChange={(e) => handleStatusChange(emp.id, e.target.value)}
                  style={{ minWidth: "140px" }}
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </td>
              <td>{new Date(emp.joinDate).toLocaleDateString()}</td>
              <td className="actions-cell">
                <button className="btn-icon" onClick={() => toggleMenu(emp.id)}>
                  <MoreVertical size={18} />
                </button>
                {openMenuId === emp.id && (
                  <div className="action-menu glass-panel">
                    <button onClick={() => handleEdit(emp.id)}>
                      <Edit2 size={14} /> Edit
                    </button>
                    <button
                      className="delete-action"
                      onClick={() => handleDelete(emp.id)}
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;
