import { useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StatusBar } from '../ui/StatusBar';
import { PanelNav } from './PanelNav';

const ExtensionShell = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <StatusBar />
      
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              $
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-900">SGP Finance</h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Gestión Personal</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-xs text-gray-700">
              <User size={14} />
              <span className="max-w-[80px] truncate">{user?.nombre || 'Usuario'}</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Cerrar sesión"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      <PanelNav />

      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default ExtensionShell;
