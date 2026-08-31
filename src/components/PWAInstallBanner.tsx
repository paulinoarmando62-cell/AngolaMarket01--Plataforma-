import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, CheckCircle } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PWAInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const [isInstalling, setIsInstalling] = useState<boolean>(false);

  useEffect(() => {
    // 1. Check if already running in standalone (installed) mode
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches ||
      // @ts-expect-error - iOS specific standalone check
      window.navigator.standalone === true ||
      document.referrer.includes('android-app://');

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // 2. Check if user already dismissed in this session
    const dismissedSession = sessionStorage.getItem('angolamarket_pwa_dismissed');
    if (dismissedSession === 'true') {
      setIsDismissed(true);
    }

    // 3. Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    // 4. Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      console.log('[PWA] AngolaMarket foi instalado com sucesso!');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      setIsInstalling(true);
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } catch (err) {
      console.error('[PWA] Erro ao abrir prompt de instalação:', err);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('angolamarket_pwa_dismissed', 'true');
  };

  // Do not render if installed, dismissed, or no prompt event available
  if (isInstalled || isDismissed || !deferredPrompt) {
    return null;
  }

  return (
    <div className="bg-stone-900 text-white border-b border-stone-800 px-3 py-2 sm:px-4 sm:py-2.5 transition-all duration-300 relative z-30">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2.5 sm:gap-4">
        {/* Left: Branding & Text */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center font-black text-white text-xs shrink-0 shadow-xs">
            AO<span className="text-yellow-300">01</span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs sm:text-sm text-white truncate">Instalar AngolaMarket</span>
              <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded uppercase hidden xs:inline-block">App</span>
            </div>
            <p className="text-[11px] text-stone-400 truncate">
              Acesso rápido direto do ecrã inicial com menor consumo de dados.
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={handleInstallClick}
            disabled={isInstalling}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-xs shadow-xs transition-all cursor-pointer whitespace-nowrap min-h-[36px]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isInstalling ? 'A instalar...' : 'Instalar'}</span>
          </button>
          
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dispensar aviso de instalação"
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
