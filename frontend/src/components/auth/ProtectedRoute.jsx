import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

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
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="auth-panel max-w-md p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[rgba(22,58,112,0.08)] text-[var(--primary)]">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <h2 className="mt-5 text-2xl font-bold text-[var(--text)]">Acceso restringido</h2>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Necesitas iniciar sesión para acceder a esta página.
          </p>
          <Link to="/login" className="primary-button mt-6">
            Iniciar Sesión
          </Link>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
