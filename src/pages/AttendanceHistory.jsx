import React from "react";
import { useAttendance } from "../context/AttendanceContext";
import { useAuth } from "../context/AuthContext";

const AttendanceHistory = () => {
  const { attendanceHistory, loading } = useAttendance();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (dateString) => {
    if (!dateString) return "--:--";
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Present": return "badge-success";
      case "Late": return "badge-warning";
      case "Absent": return "badge-danger";
      default: return "";
    }
  };

  return (
    <div className="attendance-history-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1>Attendance History</h1>
          <p className="subtitle">View and track attendance records.</p>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: "1.5rem" }}>
        {loading ? (
          <p>Loading records...</p>
        ) : attendanceHistory.length === 0 ? (
          <p>No attendance records found.</p>
        ) : (
          <div className="table-container">
            <table className="employee-table">
              <thead>
                <tr>
                  {isAdmin && <th>Employee</th>}
                  <th>Date</th>
                  <th>Clock In</th>
                  <th>Clock Out</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceHistory.map((record) => (
                  <tr key={record.id}>
                    {isAdmin && (
                      <td>
                        <div className="employee-info ">
                          {record.employeeId?.avatar ? (
                            <img src={record.employeeId.avatar} alt={record.employeeId.name} width={50} height={50} />
                          ) : (
                            <div className="avatar-placeholder">
                              {record.employeeId?.name?.charAt(0) || "?"}
                            </div>
                          )}
                          <div>
                            <div className="name">{record.employeeId?.name || "Unknown"}</div>
                            <div className="email">{record.employeeId?.email || "N/A"}</div>
                          </div>
                        </div>
                      </td>
                    )}
                    <td>{formatDate(record.date)}</td>
                    <td>{formatTime(record.clockInTime)}</td>
                    <td>{formatTime(record.clockOutTime)}</td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(record.status)}`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceHistory;
