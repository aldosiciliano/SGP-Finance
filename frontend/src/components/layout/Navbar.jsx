import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Home, 
  CreditCard, 
  PiggyBank,
  TrendingUp, 
  FileText, 
  LogOut, 
  User,
  Wallet,
  ChevronRight
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navigation = [
    { to: '/dashboard', label: 'Panel', icon: Home },
    { to: '/gastos', label: 'Gastos', icon: CreditCard },
    { to: '/presupuesto', label: 'Presupuesto', icon: PiggyBank },
    { to: '/inversiones', label: 'Inversiones', icon: TrendingUp },
    { to: '/reportes', label: 'Reportes', icon: FileText }
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 px-4 pt-4 sm:px-6 lg:px-8">
      <nav className="glass-panel mx-auto grid max-w-7xl gap-4 px-4 py-4 sm:px-6 lg:grid-cols-[auto_1fr_auto] lg:items-center">
        <div className="flex items-center justify-between gap-4">
          <NavLink to="/dashboard" className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--primary)_0%,var(--primary-strong)_100%)] text-[#eef5ff] shadow-lg">
              <Wallet className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="truncate text-lg font-bold text-[var(--text)]">SGP Finance</p>
                <span className="hidden rounded-full border border-[rgba(16,37,66,0.08)] bg-white/70 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)] sm:inline-flex">
                  MVP
                </span>
              </div>
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
                Gestion personal
              </p>
            </div>
          </NavLink>
        </div>

        <div className="flex flex-wrap items-center gap-2 rounded-[24px] border border-[rgba(16,37,66,0.08)] bg-white/45 p-2">
          {navigation.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                [
                  'inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition duration-200',
                  isActive
                    ? 'bg-[var(--primary)] text-[#eef5ff] shadow-lg shadow-[0_12px_24px_rgba(13,41,80,0.18)]'
                    : 'text-[var(--muted)] hover:bg-white/80 hover:text-[var(--text)]'
                ].join(' ')
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center">
          <div className="flex w-full items-center justify-between gap-3 rounded-[24px] border border-[rgba(16,37,66,0.08)] bg-white/75 px-4 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[rgba(22,58,112,0.08)] text-[var(--primary)]">
                <User className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[var(--text)]">{user?.nombre || 'Usuario'}</p>
                <p className="truncate text-xs text-[var(--muted)]">{user?.email}</p>
              </div>
            </div>

            <button onClick={handleLogout} className="secondary-button shrink-0 px-3 py-2">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Salir</span>
              <ChevronRight className="hidden h-4 w-4 sm:inline" />
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
