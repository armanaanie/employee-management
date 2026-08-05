import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";

const AttendanceContext = createContext();

export const useAttendance = () => useContext(AttendanceContext);

export const AttendanceProvider = ({ children }) => {
  const { token, user } = useAuth();
  const [todayRecord, setTodayRecord] = useState(null);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [stats, setStats] = useState({ present: 0, late: 0, absent: 0 });
  const [loading, setLoading] = useState(false);

  const fetchTodayRecord = useCallback(async () => {
    if (!token || user?.role !== "employee") return;
    try {
      const res = await fetch("/api/attendance/today", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setTodayRecord(data);
      }
    } catch (err) {
      console.error("Failed to fetch today's attendance record", err);
    }
  }, [token, user]);

  const fetchHistory = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch("/api/attendance/history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAttendanceHistory(data);
      }
    } catch (err) {
      console.error("Failed to fetch attendance history", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchStats = useCallback(async () => {
    if (!token || user?.role !== "admin") return;
    try {
      const res = await fetch("/api/attendance/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Failed to fetch attendance stats", err);
    }
  }, [token, user]);

  const clockIn = async () => {
    try {
      const res = await fetch("/api/attendance/clock-in", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setTodayRecord(data);
        return { success: true };
      } else {
        const err = await res.json();
        return { success: false, error: err.error };
      }
    } catch (error) {
      console.error("Error clocking in:", error);
      return { success: false, error: "Network error" };
    }
  };

  const clockOut = async () => {
    try {
      const res = await fetch("/api/attendance/clock-out", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setTodayRecord(data);
        return { success: true };
      } else {
        const err = await res.json();
        return { success: false, error: err.error };
      }
    } catch (error) {
      console.error("Error clocking out:", error);
      return { success: false, error: "Network error" };
    }
  };

  // Setup interval to keep "today's record" somewhat fresh if needed,
  // but mostly relying on manual fetch on load.
  useEffect(() => {
    if (token) {
      fetchTodayRecord();
      fetchHistory();
      if (user?.role === "admin") {
        fetchStats();
      }
    }
  }, [token, user, fetchTodayRecord, fetchHistory, fetchStats]);

  const value = {
    todayRecord,
    attendanceHistory,
    stats,
    loading,
    clockIn,
    clockOut,
    fetchHistory,
    fetchStats,
    fetchTodayRecord,
  };

  return <AttendanceContext.Provider value={value}>{children}</AttendanceContext.Provider>;
};
