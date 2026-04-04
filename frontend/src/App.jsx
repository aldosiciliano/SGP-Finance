import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AppShell from './components/layout/AppShell';
import Dashboard from './pages/Dashboard';
import Gastos from './pages/Gastos';
import Presupuesto from './pages/Presupuesto';
import Inversiones from './pages/Inversiones';
import Reportes from './pages/Reportes';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const withShell = (Component) => (
    <ProtectedRoute>
      <AppShell>
        <Component />
      </AppShell>
    </ProtectedRoute>
  );

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={withShell(Dashboard)} />
            <Route path="/dashboard" element={withShell(Dashboard)} />
            <Route path="/gastos" element={withShell(Gastos)} />
            <Route path="/presupuesto" element={withShell(Presupuesto)} />
            <Route path="/inversiones" element={withShell(Inversiones)} />
            <Route path="/reportes" element={withShell(Reportes)} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
