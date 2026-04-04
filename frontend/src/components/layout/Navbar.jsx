import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  CreditCard,
  FileText,
  Home,
  LogOut,
  Menu,
  MoreVertical,
  PiggyBank,
  TrendingUp,
  User,
  Wallet,
  X
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((current) => !current);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 px-4 pt-4 sm:px-6 lg:px-8">
      <nav className="glass-panel mx-auto max-w-7xl px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between gap-3 lg:grid lg:grid-cols-[auto_1fr_auto] lg:items-center lg:gap-4">
          <NavLink to="/dashboard" className="flex min-w-0 items-center gap-3" onClick={closeMobileMenu}>
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--primary)_0%,var(--primary-strong)_100%)] text-[#eef5ff] shadow-lg sm:h-12 sm:w-12">
              <Wallet className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="truncate text-base font-bold text-[var(--text)] sm:text-lg">SGP Finance</p>
                <span className="hidden rounded-full border border-[rgba(16,37,66,0.08)] bg-white/70 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)] sm:inline-flex">
                  MVP
                </span>
              </div>
              <p className="hidden text-xs uppercase tracking-[0.24em] text-[var(--muted)] sm:block">
                Gestion personal
              </p>
            </div>
          </NavLink>

          <div className="hidden lg:flex lg:min-w-0 lg:justify-center">
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
          </div>

          <div className="flex items-center gap-2 lg:justify-end">
            <div className="hidden items-center lg:flex">
              <div className="flex items-center justify-between gap-3 rounded-[24px] border border-[rgba(16,37,66,0.08)] bg-white/75 px-4 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[rgba(22,58,112,0.08)] text-[var(--primary)]">
                    <User className="h-5 w-5" />
                  </div>
                  <p className="truncate text-sm font-semibold text-[var(--text)]">{user?.nombre || 'Usuario'}</p>
                </div>

                <div className="group relative shrink-0">
                  <button
                    type="button"
                    aria-label="Abrir menu de usuario"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[rgba(16,37,66,0.08)] bg-white/80 text-[var(--muted)] transition duration-200 hover:bg-white hover:text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[rgba(22,58,112,0.18)]"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </button>

                  <div className="pointer-events-none absolute right-0 top-full z-20 mt-2 w-40 translate-y-2 rounded-2xl border border-[rgba(16,37,66,0.08)] bg-white/95 p-2 opacity-0 shadow-[0_18px_35px_rgba(13,41,80,0.14)] backdrop-blur-md transition duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-[var(--danger)] transition duration-200 hover:bg-[rgba(196,49,49,0.08)]"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Salir</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="group relative hidden sm:block lg:hidden">
              <button
                type="button"
                aria-label="Abrir menu de usuario"
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[rgba(16,37,66,0.08)] bg-white/80 text-[var(--muted)] transition duration-200 hover:bg-white hover:text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[rgba(22,58,112,0.18)]"
              >
                <MoreVertical className="h-5 w-5" />
              </button>

              <div className="pointer-events-none absolute right-0 top-full z-20 mt-2 w-40 translate-y-2 rounded-2xl border border-[rgba(16,37,66,0.08)] bg-white/95 p-2 opacity-0 shadow-[0_18px_35px_rgba(13,41,80,0.14)] backdrop-blur-md transition duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-[var(--danger)] transition duration-200 hover:bg-[rgba(196,49,49,0.08)]"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Salir</span>
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={toggleMobileMenu}
              aria-label={isMobileMenuOpen ? 'Cerrar menu' : 'Abrir menu'}
              aria-expanded={isMobileMenuOpen}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[rgba(16,37,66,0.08)] bg-white/80 text-[var(--muted)] transition duration-200 hover:bg-white hover:text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[rgba(22,58,112,0.18)] lg:hidden"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className={`${isMobileMenuOpen ? 'mt-4 flex' : 'hidden'} flex-col gap-4 border-t border-[rgba(16,37,66,0.08)] pt-4 lg:hidden`}>
          <div className="grid gap-2 sm:grid-cols-2">
            {navigation.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  [
                    'inline-flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition duration-200',
                    isActive
                      ? 'bg-[var(--primary)] text-[#eef5ff] shadow-lg shadow-[0_12px_24px_rgba(13,41,80,0.18)]'
                      : 'border border-[rgba(16,37,66,0.08)] bg-white/60 text-[var(--muted)] hover:bg-white hover:text-[var(--text)]'
                  ].join(' ')
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center justify-between gap-3 rounded-[24px] border border-[rgba(16,37,66,0.08)] bg-white/75 px-4 py-3 sm:hidden">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[rgba(22,58,112,0.08)] text-[var(--primary)]">
                <User className="h-5 w-5" />
              </div>
              <p className="truncate text-sm font-semibold text-[var(--text)]">{user?.nombre || 'Usuario'}</p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-2xl border border-[rgba(196,49,49,0.16)] bg-[rgba(196,49,49,0.06)] px-3 py-2 text-sm font-semibold text-[var(--danger)] transition duration-200 hover:bg-[rgba(196,49,49,0.12)]"
            >
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
