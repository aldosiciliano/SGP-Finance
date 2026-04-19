import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="auth-panel max-w-sm p-8 text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-b-2 border-[var(--primary)]"></div>
          <p className="mt-4 text-sm text-[var(--muted)]">Verificando tu sesión...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
