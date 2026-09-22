import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

interface WhatsAppFloatingButtonProps {
  phoneNumber?: string;
  defaultMessage?: string;
}

export const WhatsAppFloatingButton: React.FC<WhatsAppFloatingButtonProps> = ({
  phoneNumber = '938243909',
  defaultMessage = 'Olá AngolaMarket 01, gostaria de informações sobre os produtos e encomendas.'
}) => {
  const [showTooltip, setShowTooltip] = useState(true);

  // Clean phone number for Angola (country code 244)
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  const fullNumber = cleanNumber.startsWith('244') ? cleanNumber : `244${cleanNumber}`;
  const whatsappUrl = `https://wa.me/${fullNumber}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <div 
      id="whatsapp-floating-container"
      className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end gap-2 print:hidden select-none"
    >
      {/* Speech Bubble / Call to Action */}
      {showTooltip && (
        <div 
          id="whatsapp-tooltip-bubble"
          className="relative bg-white text-stone-800 text-xs font-semibold py-2 px-3.5 rounded-2xl shadow-xl border border-stone-200 flex items-center gap-2 max-w-[240px] animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          <div className="flex flex-col">
            <span className="font-bold text-emerald-700 text-[11px] flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Atendimento Online
            </span>
            <span className="text-stone-700 text-[11px] leading-snug">
              Precisa de ajuda? Fale connosco no WhatsApp!
            </span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="p-1 text-stone-400 hover:text-stone-600 rounded-full hover:bg-stone-100 transition-colors ml-1"
            title="Fechar aviso"
            aria-label="Fechar mensagem"
          >
            <X className="w-3 h-3" />
          </button>

          {/* Speech bubble pointer */}
          <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white border-b border-r border-stone-200 transform rotate-45"></div>
        </div>
      )}

      {/* Floating Button */}
      <a
        id="whatsapp-floating-button"
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Fale connosco no WhatsApp pelo 938 243 909"
        className="group relative flex items-center justify-center w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer ring-4 ring-emerald-400/30"
      >
        {/* Subtle pulsating outer ring */}
        <span className="absolute -inset-1 rounded-full bg-emerald-500 opacity-30 group-hover:opacity-50 animate-ping pointer-events-none"></span>

        {/* WhatsApp Vector Icon */}
        <MessageCircle className="w-7 h-7 fill-white text-white drop-shadow-xs" />

        {/* Badge with phone */}
        <span className="sr-only">WhatsApp: 938 243 909</span>
      </a>
    </div>
  );
};
