import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { EmployeeProvider } from "./context/EmployeeContext";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import Dashboard from "./pages/Dashboard";
import EmployeeDirectory from "./pages/EmployeeDirectory";
import EmployeeForm from "./pages/EmployeeForm";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AuthLayout = ({ children }) => {
  const location = useLocation();
  const authPaths = ["/login", "/register"];

  if (authPaths.includes(location.pathname)) {
    return <>{children}</>;
  }

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <TopBar />
        {children}
      </main>
    </div>
  );
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <AuthLayout>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <RegisterPage />
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employees"
          element={
            <ProtectedRoute>
              <EmployeeDirectory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employees/new"
          element={
            <ProtectedRoute>
              <EmployeeForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employees/edit/:id"
          element={
            <ProtectedRoute>
              <EmployeeForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <div
                className="glass-panel"
                style={{ padding: "3rem", textAlign: "center" }}
              >
                <h2>Settings Page (Coming Soon)</h2>
              </div>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthLayout>
  );
};

function App() {
  return (
    <AuthProvider>
      <EmployeeProvider>
        <Router>
          <AppRoutes />
        </Router>
      </EmployeeProvider>
    </AuthProvider>
  );
}

export default App;
