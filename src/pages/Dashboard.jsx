import React from "react";
import { useEmployees } from "../context/EmployeeContext";
import { useAuth } from "../context/AuthContext";
import { useAttendance } from "../context/AttendanceContext";
import StatCard from "../components/StatCard";
import EmployeeTable from "../components/EmployeeTable";
import AttendanceWidget from "../components/AttendanceWidget";
import { Users, Briefcase, Activity, UserPlus, UserCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { employees, getStats } = useEmployees();
  const { user } = useAuth();
  const { stats: attendanceStats } = useAttendance();
  const stats = getStats();
  const isAdmin = user?.role === "admin";

  // Get latest 3 employees
  const recentEmployees = [...employees]
    .sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate))
    .slice(0, 3);

  return (
    <div className="dashboard animate-fade-in">
      <div className="page-header">
        {/* <div>
          <h1>Dashboard Overview</h1>
          <p className="subtitle">Here's what's happening today.</p>
        </div> */}
        {isAdmin ? (
          <Link to="/employees/new" className="btn btn-primary">
            <UserPlus size={18} />
            Add Employee
          </Link>
        ) : (
          <Link to="/profile" className="btn btn-primary">
            <UserCircle size={18} />
            My Profile
          </Link>
        )}
      </div>

      {!isAdmin && (
        <div
          className="glass-panel"
          style={{
            padding: "1rem 1.25rem",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user?.username || "Profile"}
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid rgba(255,255,255,0.2)",
              }}
            />
          ) : (
            <UserCircle size={56} />
          )}
          <div>
            <h3 style={{ margin: 0 }}>{user?.username || "Employee"}</h3>
            <p className="subtitle" style={{ margin: 0 }}>
              {user?.email || "employee@example.com"}
            </p>
          </div>
        </div>
      )}

      <div
        className="stats-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2.5rem",
        }}
      >
        {isAdmin ? (
          <>
            <StatCard
              title="Total Employees"
              value={stats.total}
              icon={Users}
              trend={12}
              className="delay-100"
            />
            <StatCard
              title="Active Employees"
              value={stats.active}
              icon={Activity}
              trend={5}
              className="delay-200"
            />
            <StatCard
              title="Departments"
              value={stats.departments}
              icon={Briefcase}
              className="delay-300"
            />
            <StatCard
              title="Present Today"
              value={attendanceStats?.present || 0}
              icon={Clock}
              className="delay-400"
            />
          </>
        ) : (
          <>
            <StatCard
              title="Welcome"
              value={user?.username || "Employee"}
              icon={UserCircle}
              className="delay-100"
            />
            <StatCard
              title="Your Role"
              value="Employee"
              icon={Activity}
              className="delay-200"
            />
            <StatCard
              title="Profile"
              value="Update Info"
              icon={Briefcase}
              className="delay-300"
            />
          </>
        )}
      </div>

      {!isAdmin && <AttendanceWidget />}

      <div className="recent-section">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <h3>{isAdmin ? "Recently Added" : "Your Team Snapshot"}</h3>
          {isAdmin && (
            <Link
              to="/employees"
              className="btn btn-secondary"
              style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}
            >
              View All
            </Link>
          )}
        </div>
        {isAdmin ? (
          <EmployeeTable employees={recentEmployees} />
        ) : (
          <div className="glass-panel" style={{ padding: "1.5rem" }}>
            <p className="subtitle">
              You can update your password and profile photo from your profile
              page.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
