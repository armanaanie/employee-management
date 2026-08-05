import React, { useState } from "react";
import { useLeaves } from "../context/LeaveContext";
import { useAuth } from "../context/AuthContext";
import ApplyLeaveModal from "../components/ApplyLeaveModal";
import StatCard from "../components/StatCard";
import { Check, X, Calendar, Clock, CheckCircle, XCircle } from "lucide-react";
import "./LeaveManagement.css";

const LeaveManagement = () => {
  const { leaves, stats, updateLeaveStatus } = useLeaves();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [showApplyModal, setShowApplyModal] = useState(false);

  const handleApprove = (id) => updateLeaveStatus(id, "Approved");
  const handleReject = (id) => updateLeaveStatus(id, "Rejected");

  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved": return <span className="badge badge-success">Approved</span>;
      case "Rejected": return <span className="badge badge-danger" style={{backgroundColor: "var(--color-danger-bg)", color: "var(--color-danger)"}}>Rejected</span>;
      default: return <span className="badge badge-warning">Pending</span>;
    }
  };

  const getLeaveDuration = (start, end) => {
    const s = new Date(start);
    const e = new Date(end);
    const diffTime = Math.abs(e - s);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 
    return diffDays;
  };

  return (
    <div className="leave-management animate-fade-in">
      <div className="page-header">
        <div>
          <h2>Leave Management</h2>
          <p className="subtitle">
            {isAdmin ? "Manage employee leave requests" : "View and apply for leaves"}
          </p>
        </div>
        {!isAdmin && (
          <button className="btn btn-primary" onClick={() => setShowApplyModal(true)}>
            <Calendar size={18} /> Apply for Leave
          </button>
        )}
      </div>

      {isAdmin && stats && (
        <div className="stats-grid" style={{ marginBottom: "2.5rem" }}>
          <StatCard title="Total Requests" value={stats.total} icon={Calendar} className="delay-100" />
          <StatCard title="Pending" value={stats.pending} icon={Clock} className="delay-200" />
          <StatCard title="Approved" value={stats.approved} icon={CheckCircle} className="delay-300" />
          <StatCard title="Rejected" value={stats.rejected} icon={XCircle} className="delay-400" />
        </div>
      )}

      <div className="table-container glass-panel">
        {leaves.length === 0 ? (
          <div className="empty-state">
            <p>No leave requests found.</p>
          </div>
        ) : (
          <table className="employee-table">
            <thead>
              <tr>
                {isAdmin && <th>Employee</th>}
                <th>Leave Type</th>
                <th>Duration</th>
                <th>Reason</th>
                <th>Applied On</th>
                <th>Status</th>
                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {leaves.map((leave) => (
                <tr key={leave.id} className="table-row">
                  {isAdmin && (
                    <td>
                      <div className="employee-info">
                        {leave.employeeId?.avatar ? (
                          <img src={leave.employeeId.avatar} alt={leave.employeeId.name} className="employee-avatar" />
                        ) : (
                          <div className="employee-avatar" style={{background: '#555'}} />
                        )}
                        <div>
                          <p className="employee-name">{leave.employeeId?.name || "Unknown"}</p>
                          <p className="employee-email">{leave.employeeId?.department || "N/A"}</p>
                        </div>
                      </div>
                    </td>
                  )}
                  <td>{leave.type}</td>
                  <td>
                    {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                    <br />
                    <small className="subtitle">{getLeaveDuration(leave.startDate, leave.endDate)} Day(s)</small>
                  </td>
                  <td style={{ maxWidth: "250px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {leave.reason}
                  </td>
                  <td>{new Date(leave.appliedOn).toLocaleDateString()}</td>
                  <td>{getStatusBadge(leave.status)}</td>
                  {isAdmin && (
                    <td className="actions-cell">
                      {leave.status === "Pending" ? (
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button className="btn-icon" style={{color: "var(--color-success)"}} onClick={() => handleApprove(leave.id)} title="Approve">
                            <Check size={18} />
                          </button>
                          <button className="btn-icon" style={{color: "var(--color-danger)"}} onClick={() => handleReject(leave.id)} title="Reject">
                            <X size={18} />
                          </button>
                        </div>
                      ) : (
                        <span className="subtitle">Resolved</span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showApplyModal && <ApplyLeaveModal onClose={() => setShowApplyModal(false)} />}
    </div>
  );
};

export default LeaveManagement;
