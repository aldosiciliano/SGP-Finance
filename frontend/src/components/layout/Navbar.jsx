import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Home, 
  CreditCard, 
  TrendingUp, 
  FileText, 
  LogOut, 
  User,
  DollarSign,
  Bell,
  Wallet
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navigation = [
    { to: '/dashboard', label: 'Panel', icon: Home },
    { to: '/gastos', label: 'Gastos', icon: CreditCard },
    { to: '/inversiones', label: 'Inversiones', icon: TrendingUp },
    { to: '/reportes', label: 'Reportes', icon: FileText }
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 px-4 pt-4 sm:px-6 lg:px-8">
      <nav className="glass-panel mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-between gap-4">
          <NavLink to="/dashboard" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary)] text-[#eef5ff] shadow-lg">
              <Wallet className="h-6 w-6" />
            </div>
            <div>
              <p className="text-lg font-bold text-[var(--text)]">SGP Finance</p>
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
                Control de gastos
              </p>
            </div>
          </NavLink>

          <div className="flex items-center gap-2 rounded-full bg-white/70 px-3 py-2 text-sm font-semibold text-[var(--accent)] lg:hidden">
            <DollarSign className="h-4 w-4" />
            USD $1.050
          </div>
        </div>

        <div className="flex flex-1 flex-wrap items-center gap-2">
          {navigation.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                [
                  'inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition duration-200',
                  isActive
                    ? 'bg-[var(--primary)] text-[#eef5ff] shadow-lg'
                    : 'bg-white/60 text-[var(--muted)] hover:bg-white/90 hover:text-[var(--text)]'
                ].join(' ')
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="hidden items-center gap-3 rounded-2xl bg-[rgba(29,138,103,0.1)] px-4 py-3 text-sm text-[var(--accent)] md:flex">
            <Bell className="h-4 w-4" />
            <div>
              <p className="font-semibold">Cotización de referencia</p>
              <p className="text-xs text-[var(--muted)]">USD oficial $1.050 · Blue $1.215</p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 rounded-2xl bg-white/75 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[rgba(22,58,112,0.08)] text-[var(--primary)]">
                <User className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--text)]">{user?.nombre || 'Usuario'}</p>
                <p className="text-xs text-[var(--muted)]">{user?.email}</p>
              </div>
            </div>

            <button onClick={handleLogout} className="secondary-button px-3 py-2">
              <LogOut className="h-4 w-4" />
              Salir
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
