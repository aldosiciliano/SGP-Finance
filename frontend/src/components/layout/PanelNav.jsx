import { NavLink } from 'react-router-dom';
import { Home, CreditCard, PiggyBank, TrendingUp, FileText } from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: Home, label: 'Inicio' },
  { to: '/gastos', icon: CreditCard, label: 'Gastos' },
  { to: '/presupuesto', icon: PiggyBank, label: 'Presupuesto' },
  { to: '/inversiones', icon: TrendingUp, label: 'Inversiones' },
  { to: '/reportes', icon: FileText, label: 'Reportes' }
];

export function PanelNav() {
  return (
    <nav className="flex justify-around items-center py-2 border-b border-gray-100 bg-white">
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 px-2 py-1 rounded-lg text-xs
             transition-colors ${isActive
               ? 'text-blue-600 bg-blue-50'
               : 'text-gray-500 hover:text-gray-700'}`
          }
        >
          <Icon size={18} />
          <span className="text-[10px]">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
