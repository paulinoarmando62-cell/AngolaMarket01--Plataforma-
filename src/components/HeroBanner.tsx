import React from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  ArrowRight,
  Check,
  Truck,
  CreditCard,
  Sparkles
} from 'lucide-react';
import { LuandaZone } from '../types';

interface HeroBannerProps {
  selectedZone?: LuandaZone;
  onOpenDeliveryModal: () => void;
  onScrollToCatalog: () => void;
  onOpenSellerModal?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onOpenDeliveryModal,
  onScrollToCatalog,
}) => {
  return (
    <div className="bg-stone-50 py-2 sm:py-3.5 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        
        {/* Bento Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-2.5 sm:gap-4">
          
          {/* Main Large Hero Card (Red Bento) */}
          <div className="col-span-1 md:col-span-2 lg:col-span-7 bg-red-600 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 md:p-6 text-white relative overflow-hidden flex flex-col justify-between shadow-xs">
            <div className="relative z-10 space-y-1.5 sm:space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/15 text-white text-[10px] sm:text-xs font-bold">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>Cash on Delivery em Toda Luanda</span>
              </div>

              <h1 className="text-lg sm:text-2xl md:text-3xl font-black tracking-tight leading-tight">
                Pagamento no Ato da Entrega. <span className="text-amber-300">Sem Riscos.</span>
              </h1>

              <p className="text-xs sm:text-sm text-red-50 leading-normal font-normal">
                Compre com tranquilidade. O estafeta leva a encomenda até à sua morada e você só paga após abrir e verificar o produto.
              </p>
            </div>

            <div className="relative z-10 pt-3 sm:pt-4 flex flex-wrap items-center gap-2 sm:gap-2.5">
              <button
                id="hero-explore-btn"
                onClick={onScrollToCatalog}
                className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl sm:rounded-2xl bg-white text-red-600 font-bold text-xs sm:text-sm shadow-xs hover:bg-stone-100 flex items-center gap-1.5 transition-all transform active:scale-95 cursor-pointer"
              >
                <span>Ver Catálogo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                id="hero-delivery-calc-btn"
                onClick={onOpenDeliveryModal}
                className="px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl bg-black/20 hover:bg-black/30 border border-white/20 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-300" />
                <span>Fretes & Zonas</span>
              </button>
            </div>
          </div>

          {/* How Cash on Delivery Works Card (Dark Stone Bento) */}
          <div className="col-span-1 md:col-span-2 lg:col-span-5 bg-stone-900 text-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border border-stone-800 shadow-xs flex flex-col justify-between space-y-2.5">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-amber-400 uppercase tracking-wider mb-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Como Funciona o Cash on Delivery</span>
              </div>
              <h3 className="text-sm sm:text-base font-black text-white">3 Passos Simples e Seguros</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-1.5 sm:gap-2 text-xs">
              <div className="flex items-center gap-2 bg-stone-800/80 p-2 sm:p-2.5 rounded-xl border border-stone-700/60">
                <span className="w-5 h-5 rounded-full bg-amber-400 text-stone-950 font-black text-[10px] flex items-center justify-center shrink-0">
                  1
                </span>
                <div className="min-w-0">
                  <span className="font-bold text-stone-100 block text-[11px] truncate">1. Faça a Encomenda</span>
                  <span className="text-stone-400 text-[10px] block truncate">Sem pagamento antecipado</span>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-stone-800/80 p-2 sm:p-2.5 rounded-xl border border-stone-700/60">
                <span className="w-5 h-5 rounded-full bg-amber-400 text-stone-950 font-black text-[10px] flex items-center justify-center shrink-0">
                  2
                </span>
                <div className="min-w-0">
                  <span className="font-bold text-stone-100 block text-[11px] truncate">2. Receba em Luanda</span>
                  <span className="text-stone-400 text-[10px] block truncate">Estafeta leva até si</span>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-stone-800/80 p-2 sm:p-2.5 rounded-xl border border-stone-700/60">
                <span className="w-5 h-5 rounded-full bg-emerald-400 text-stone-950 font-black text-[10px] flex items-center justify-center shrink-0">
                  3
                </span>
                <div className="min-w-0">
                  <span className="font-bold text-stone-100 block text-[11px] truncate">3. Verifique & Pague</span>
                  <span className="text-stone-400 text-[10px] block truncate">Dinheiro ou Express</span>
                </div>
              </div>
            </div>

            <div className="text-[10px] text-stone-400 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Garantia de segurança para compradores e parceiros</span>
            </div>
          </div>

        </div>

        {/* Quick Trust Highlights Banner (Mobile & Desktop) */}
        <div className="mt-2.5 grid grid-cols-2 md:grid-cols-4 gap-1.5 sm:gap-2 text-stone-800 text-[10px] sm:text-xs">
          <div className="flex items-center gap-2 bg-white px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl border border-stone-200 shadow-2xs">
            <Truck className="w-3.5 h-3.5 text-red-600 shrink-0" />
            <span className="font-semibold truncate">Entregas em Luanda</span>
          </div>
          <div className="flex items-center gap-2 bg-white px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl border border-stone-200 shadow-2xs">
            <CreditCard className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="font-semibold truncate">Pague na Entrega</span>
          </div>
          <div className="flex items-center gap-2 bg-white px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl border border-stone-200 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="font-semibold truncate">Verifique Primeiro</span>
          </div>
          <div className="flex items-center gap-2 bg-white px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl border border-stone-200 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="font-semibold truncate">Multicaixa Express & Cash</span>
          </div>
        </div>

      </div>
    </div>
  );
};
