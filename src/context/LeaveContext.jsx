import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const LeaveContext = createContext();

export const useLeaves = () => useContext(LeaveContext);

export const LeaveProvider = ({ children }) => {
  const [leaves, setLeaves] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const { token, isAuthenticated, user } = useAuth();
  const isAdmin = user?.role === "admin";

  const fetchLeaves = async () => {
    if (!token) return;
    try {
      const response = await fetch("/api/leaves", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLeaves(data);
      }
    } catch (error) {
      console.error("Failed to fetch leaves", error);
    }
  };

  const fetchStats = async () => {
    if (!token || !isAdmin) return;
    try {
      const response = await fetch("/api/leaves/stats", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch leave stats", error);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setLeaves([]);
      setStats({ total: 0, pending: 0, approved: 0, rejected: 0 });
      return;
    }

    fetchLeaves();
    if (isAdmin) {
      fetchStats();
    }

    const intervalId = setInterval(() => {
      fetchLeaves();
      if (isAdmin) fetchStats();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [isAuthenticated, token, isAdmin]);

  const applyLeave = async (leaveData) => {
    if (!token) return { success: false, error: "Not authenticated" };

    try {
      const response = await fetch("/api/leaves", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(leaveData),
      });

      const data = await response.json();
      if (response.ok) {
        setLeaves((prev) => [data, ...prev]);
        return { success: true };
      }
      return { success: false, error: data.error || "Failed to apply for leave" };
    } catch (error) {
      console.error("Failed to apply for leave", error);
      return { success: false, error: "Network error" };
    }
  };

  const updateLeaveStatus = async (id, status) => {
    if (!token) return false;

    try {
      const response = await fetch(`/api/leaves/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        const data = await response.json();
        setLeaves((prev) => prev.map((leave) => (leave.id === id ? data : leave)));
        fetchStats();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to update leave status", error);
      return false;
    }
  };

  return (
    <LeaveContext.Provider
      value={{
        leaves,
        stats,
        applyLeave,
        updateLeaveStatus,
        fetchLeaves,
      }}
    >
      {children}
    </LeaveContext.Provider>
  );
};
