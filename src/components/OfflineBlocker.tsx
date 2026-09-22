import React, { useState, useEffect } from 'react';
import { WifiOff, RefreshCw, MessageCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

interface OfflineBlockerProps {
  onReconnect?: () => void;
}

export const OfflineBlocker: React.FC<OfflineBlockerProps> = ({ onReconnect }) => {
  const [isOffline, setIsOffline] = useState<boolean>(() => {
    if (typeof navigator !== 'undefined') {
      return !navigator.onLine;
    }
    return false;
  });

  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [checkError, setCheckError] = useState<string | null>(null);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setCheckError(null);
      if (onReconnect) onReconnect();
    };

    const handleOffline = () => {
      setIsOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Periodic heartbeat check
    const interval = setInterval(() => {
      if (typeof navigator !== 'undefined') {
        setIsOffline(!navigator.onLine);
      }
    }, 4000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, [onReconnect]);

  const handleRetry = async () => {
    setIsChecking(true);
    setCheckError(null);

    // Try pinging or checking online status
    try {
      if (!navigator.onLine) {
        throw new Error('Dispositivo ainda sem sinal de rede ou dados móveis.');
      }
      // Quick fetch to verify actual internet connectivity
      await fetch('/favicon.svg', { method: 'HEAD', cache: 'no-store' });
      setIsOffline(false);
      if (onReconnect) onReconnect();
      window.location.reload();
    } catch {
      setCheckError('Ainda não conseguimos detetar internet. Verifique se os dados móveis ou Wi-Fi estão ligados e tente novamente.');
    } finally {
      setIsChecking(false);
    }
  };

  if (!isOffline) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-99999 bg-stone-900/95 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 text-center shadow-2xl border border-stone-200 space-y-6 animate-in zoom-in-95">
        {/* Icon */}
        <div className="w-20 h-20 rounded-3xl bg-red-50 border-2 border-red-200 flex items-center justify-center mx-auto text-red-600 shadow-inner">
          <WifiOff className="w-10 h-10 animate-pulse" />
        </div>

        {/* Text */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Sem Ligação à Internet / Sem Dados</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-stone-900 leading-tight">
            Ligação à Internet Necessária
          </h2>

          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-md mx-auto">
            Para garantir que as unidades de stock, os agendamentos de entrega e a sua conta fiquem <strong>100% gravados na nossa base de dados oficial na nuvem</strong> e não fiquem apenas retidos no seu telefone, o <strong>AngolaMarket 01</strong> requer ligação ativa à internet.
          </p>
        </div>

        {/* Warning / Explanation Box */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-left space-y-2 text-xs text-amber-900">
          <div className="flex items-center gap-2 font-bold text-amber-950">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Sincronização em Tempo Real na Nuvem</span>
          </div>
          <p className="text-[11px] leading-normal text-amber-800">
            • Ative os <strong>Dados Móveis</strong> (Unitel / Africell / Movicel) ou conecte-se a uma rede Wi-Fi.<br />
            • Ao reconectar, a plataforma atualizará instantaneamente com o catálogo, preços e pedidos reais.
          </p>
        </div>

        {checkError && (
          <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium animate-in fade-in">
            {checkError}
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3 pt-1">
          <button
            type="button"
            onClick={handleRetry}
            disabled={isChecking}
            className="w-full py-3.5 px-6 rounded-2xl bg-red-600 hover:bg-red-700 active:scale-98 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
            <span>{isChecking ? 'A verificar ligação...' : 'Reconectar e Atualizar Plataforma'}</span>
          </button>

          <a
            href="https://wa.me/244938243909?text=Ol%C3%A1%2C%20estou%20a%20tentar%20aceder%20ao%20AngolaMarket%2001%20mas%20estou%20com%20problemas%20de%20conex%C3%A3o."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-6 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center gap-2 border border-emerald-200 transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>Suporte no WhatsApp (+244 938 243 909)</span>
          </a>
        </div>
      </div>
    </div>
  );
};
