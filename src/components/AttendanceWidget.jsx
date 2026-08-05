import React from "react";
import { useAttendance } from "../context/AttendanceContext";
import { Clock, CheckCircle, LogOut } from "lucide-react";

const AttendanceWidget = () => {
  const { todayRecord, clockIn, clockOut, loading } = useAttendance();

  const handleClockIn = async () => {
    await clockIn();
  };

  const handleClockOut = async () => {
    await clockOut();
  };

  const formatTime = (dateString) => {
    if (!dateString) return "--:--";
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="glass-panel" style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
        <Clock size={24} style={{ color: "var(--primary)" }} />
        <h3 style={{ margin: 0 }}>Attendance</h3>
      </div>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p className="subtitle" style={{ margin: "0 0 0.25rem 0", fontSize: "0.85rem" }}>Status</p>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: todayRecord ? (todayRecord.clockOutTime ? "var(--text-secondary)" : "var(--success)") : "var(--warning)",
              display: "inline-block"
            }}></span>
            <span style={{ fontWeight: 500 }}>
              {!todayRecord ? "Not Clocked In" : (todayRecord.clockOutTime ? "Clocked Out" : "Clocked In")}
            </span>
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          <p className="subtitle" style={{ margin: "0 0 0.25rem 0", fontSize: "0.85rem" }}>Clock In</p>
          <span style={{ fontWeight: 500 }}>{formatTime(todayRecord?.clockInTime)}</span>
        </div>
        
        <div style={{ textAlign: "right" }}>
          <p className="subtitle" style={{ margin: "0 0 0.25rem 0", fontSize: "0.85rem" }}>Clock Out</p>
          <span style={{ fontWeight: 500 }}>{formatTime(todayRecord?.clockOutTime)}</span>
        </div>
      </div>

      <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem" }}>
        {!todayRecord ? (
          <button 
            className="btn btn-primary" 
            style={{ flex: 1, justifyContent: "center" }}
            onClick={handleClockIn}
            disabled={loading}
          >
            <CheckCircle size={18} />
            Clock In
          </button>
        ) : (
          <button 
            className="btn btn-secondary" 
            style={{ flex: 1, justifyContent: "center" }}
            onClick={handleClockOut}
            disabled={loading || todayRecord.clockOutTime}
          >
            <LogOut size={18} />
            {todayRecord.clockOutTime ? "Shift Ended" : "Clock Out"}
          </button>
        )}
      </div>
    </div>
  );
};

export default AttendanceWidget;
