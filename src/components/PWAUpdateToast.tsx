import React, { useState, useEffect } from 'react';
import { RefreshCw, ArrowUpCircle } from 'lucide-react';

export const PWAUpdateToast: React.FC = () => {
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [showUpdate, setShowUpdate] = useState<boolean>(false);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    // Listen to existing registration
    navigator.serviceWorker.getRegistration().then((reg) => {
      if (!reg) return;

      // If already a waiting worker
      if (reg.waiting) {
        setWaitingWorker(reg.waiting);
        setShowUpdate(true);
      }

      // If an update is discovered
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        if (!newWorker) return;

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            setWaitingWorker(newWorker);
            setShowUpdate(true);
          }
        });
      });
    });

    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
  }, []);

  const handleUpdate = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    } else {
      window.location.reload();
    }
  };

  if (!showUpdate) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 z-50 max-w-sm mx-auto bg-stone-900 text-white p-3.5 rounded-2xl shadow-xl border border-stone-700 flex items-center justify-between gap-3 animate-in slide-in-from-bottom">
      <div className="flex items-center gap-2.5 min-w-0">
        <ArrowUpCircle className="w-5 h-5 text-red-500 shrink-0" />
        <div className="min-w-0">
          <p className="font-bold text-xs text-white">Nova versão disponível</p>
          <p className="text-[11px] text-stone-400 truncate">Atualize para carregar as novidades.</p>
        </div>
      </div>
      <button
        type="button"
        onClick={handleUpdate}
        className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 transition-colors shadow-xs cursor-pointer"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        <span>Atualizar</span>
      </button>
    </div>
  );
};
