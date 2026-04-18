import { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import api from '../../lib/api';

export function StatusBar() {
  const [backendOnline, setBackendOnline] = useState(null);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        await api.get('/health', { timeout: 3000 });
        setBackendOnline(true);
      } catch {
        setBackendOnline(false);
      }
    };

    checkBackend();
    const interval = setInterval(checkBackend, 30000);
    return () => clearInterval(interval);
  }, []);

  if (backendOnline === null) return null;

  if (!backendOnline) {
    return (
      <div className="flex items-center gap-2 bg-red-50 border border-red-200 
                      text-red-700 text-sm px-3 py-2 rounded-md mx-4 mt-2">
        <WifiOff size={14} />
        <span>
          Backend offline. Ejecutá{' '}
          <code className="font-mono bg-red-100 px-1 rounded">
            docker compose up -d
          </code>
        </span>
      </div>
    );
  }

  return null;
}
