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
    <div className="bg-stone-50 py-3 sm:py-6 md:py-8 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        
        {/* Bento Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-6">
          
          {/* Main Large Hero Card (Red Bento) */}
          <div className="col-span-1 md:col-span-2 lg:col-span-7 bg-red-600 rounded-2xl sm:rounded-3xl p-4 sm:p-7 md:p-10 text-white relative overflow-hidden flex flex-col justify-between shadow-sm">
            <div className="relative z-10 space-y-2 sm:space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 text-white text-[10px] sm:text-xs font-bold">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>Cash on Delivery em Toda Luanda</span>
              </div>

              <h1 className="text-xl sm:text-3xl md:text-5xl font-black tracking-tight leading-snug sm:leading-tight">
                Pagamento no Ato da Entrega.<br />
                <span className="text-amber-300">Sem Riscos.</span>
              </h1>

              <p className="text-xs sm:text-sm md:text-base text-red-50 leading-relaxed font-normal">
                Compre com tranquilidade. O estafeta leva a encomenda até à sua morada e você só paga após abrir e verificar o produto.
              </p>
            </div>

            <div className="relative z-10 pt-3.5 sm:pt-6 flex flex-wrap items-center gap-2 sm:gap-3">
              <button
                id="hero-explore-btn"
                onClick={onScrollToCatalog}
                className="px-4.5 py-2.5 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl bg-white text-red-600 font-bold text-xs sm:text-sm shadow-sm hover:bg-stone-100 flex items-center gap-1.5 sm:gap-2 transition-all transform active:scale-95 cursor-pointer"
              >
                <span>Ver Catálogo</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              <button
                id="hero-delivery-calc-btn"
                onClick={onOpenDeliveryModal}
                className="px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl bg-black/20 hover:bg-black/30 border border-white/20 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
                <span>Fretes & Zonas</span>
              </button>
            </div>
          </div>

          {/* How Cash on Delivery Works Card (Dark Stone Bento) */}
          <div className="col-span-1 md:col-span-2 lg:col-span-5 bg-stone-900 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-7 border border-stone-800 shadow-sm flex flex-col justify-between space-y-3 sm:space-y-4">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                <span>Como Funciona o Cash on Delivery</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white">3 Passos Simples e Seguros</h3>
            </div>

            <div className="space-y-2 sm:space-y-3 text-xs">
              <div className="flex items-start gap-2.5 sm:gap-3 bg-stone-800/80 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-stone-700/60">
                <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-400 text-stone-950 font-black text-[11px] sm:text-xs flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <span className="font-bold text-stone-100 block text-[11px] sm:text-xs">Faça a sua Encomenda</span>
                  <span className="text-stone-400 text-[10px] sm:text-[11px] leading-tight">Escolha os produtos sem adiantar nenhum valor no site.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 sm:gap-3 bg-stone-800/80 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-stone-700/60">
                <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-400 text-stone-950 font-black text-[11px] sm:text-xs flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <span className="font-bold text-stone-100 block text-[11px] sm:text-xs">Receba na sua Morada</span>
                  <span className="text-stone-400 text-[10px] sm:text-[11px] leading-tight">O estafeta desloca-se até ao seu bairro em Luanda.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 sm:gap-3 bg-stone-800/80 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-stone-700/60">
                <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-400 text-stone-950 font-black text-[11px] sm:text-xs flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <span className="font-bold text-stone-100 block text-[11px] sm:text-xs">Verifique & Pague</span>
                  <span className="text-stone-400 text-[10px] sm:text-[11px] leading-tight">Abra o pacote, confirme e pague em Dinheiro ou Express.</span>
                </div>
              </div>
            </div>

            <div className="text-[10px] sm:text-[11px] text-stone-400 flex items-center gap-1.5 pt-0.5">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Garantia de segurança para compradores e vendedores</span>
            </div>
          </div>

        </div>

        {/* Quick Trust Highlights Banner (Mobile & Desktop) */}
        <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2 text-stone-800 text-[11px] sm:text-xs">
          <div className="flex items-center gap-2 bg-white p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-stone-200 shadow-2xs">
            <Truck className="w-4 h-4 text-red-600 shrink-0" />
            <span className="font-semibold truncate">Entregas em Luanda</span>
          </div>
          <div className="flex items-center gap-2 bg-white p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-stone-200 shadow-2xs">
            <CreditCard className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold truncate">Pague na Entrega (COD)</span>
          </div>
          <div className="flex items-center gap-2 bg-white p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-stone-200 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="font-semibold truncate">Abra & Verifique Primeiro</span>
          </div>
          <div className="flex items-center gap-2 bg-white p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-stone-200 shadow-2xs">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="font-semibold truncate">Multicaixa & Dinheiro</span>
          </div>
        </div>

      </div>
    </div>
  );
};
