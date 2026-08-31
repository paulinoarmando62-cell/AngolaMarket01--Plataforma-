import React, { useState, useEffect } from 'react';
import { WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  const [justReconnected, setJustReconnected] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setJustReconnected(true);
      const timer = setTimeout(() => {
        setJustReconnected(false);
      }, 3500);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setJustReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (justReconnected) {
    return (
      <div className="bg-emerald-600 text-white text-xs font-semibold px-3 py-1.5 text-center flex items-center justify-center gap-2 shadow-xs transition-all animate-in fade-in sticky top-0 z-50">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>Ligação à internet restabelecida. Catálogo sincronizado!</span>
      </div>
    );
  }

  if (!isOffline) {
    return null;
  }

  return (
    <div className="bg-amber-600 text-white text-xs font-medium px-3 py-2 text-center flex items-center justify-between gap-2 shadow-xs sticky top-0 z-50">
      <div className="flex items-center gap-2 mx-auto">
        <WifiOff className="w-4 h-4 shrink-0 animate-pulse" />
        <span>
          <strong>Modo Offline:</strong> Sem ligação à internet. A visualizar catálogo local armazenado.
        </span>
      </div>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white text-[11px] font-bold shrink-0 transition-colors flex items-center gap-1 cursor-pointer"
      >
        <RefreshCw className="w-3 h-3" />
        <span>Reconectar</span>
      </button>
    </div>
  );
};
