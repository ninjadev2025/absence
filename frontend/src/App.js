import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import axios from 'axios';

// Components
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/admin/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import ReporterDashboard from './components/reporter/ReporterDashboard';
import ManagerDashboard from './components/manager/ManagerDashboard';

// Set axios defaults
axios.defaults.baseURL = 'http://localhost:5000';
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function App() {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    // Check for existing user session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />
      <Container className="mt-4">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={
            user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />
          } />
          <Route path="/register" element={
            user ? <Navigate to="/dashboard" /> : <Register onLogin={handleLogin} />
          } />

          {/* Dashboard route - role-based */}
          <Route path="/dashboard" element={
            <ProtectedRoute user={user}>
              {user?.role === 'admin' && <AdminDashboard />}
              {user?.role === 'manager' && <ManagerDashboard />}
              {user?.role === 'reporter' && <ReporterDashboard user={user} />}
              {user?.role === 'user' && <UserDashboard user={user} />}
            </ProtectedRoute>
          } />

          {/* Admin specific routes */}
          <Route path="/admin/*" element={
            <AdminRoute user={user}>
              <AdminDashboard />
            </AdminRoute>
          } />

          {/* Root redirect */}
          <Route path="/" element={
            <Navigate to={user ? "/dashboard" : "/login"} replace />
          } />

          {/* Fallback route */}
          <Route path="*" element={
            <Navigate to={user ? "/dashboard" : "/login"} replace />
          } />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;