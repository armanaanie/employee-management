import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { EmployeeProvider } from './context/EmployeeContext';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './pages/Dashboard';
import EmployeeDirectory from './pages/EmployeeDirectory';
import EmployeeForm from './pages/EmployeeForm';

function App() {
  return (
    <EmployeeProvider>
      <Router>
        <div className="app-container">
          <Sidebar />
          <main className="main-content">
            <TopBar />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/employees" element={<EmployeeDirectory />} />
              <Route path="/employees/new" element={<EmployeeForm />} />
              <Route path="/employees/edit/:id" element={<EmployeeForm />} />
              <Route path="/settings" element={<div className="glass-panel" style={{padding: '3rem', textAlign: 'center'}}><h2>Settings Page (Coming Soon)</h2></div>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </EmployeeProvider>
  );
}

export default App;
