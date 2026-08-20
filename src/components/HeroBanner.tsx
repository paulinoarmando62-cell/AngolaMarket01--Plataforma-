import React from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  ArrowRight,
  Check
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
    <div className="bg-stone-50 py-6 md:py-8 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Bento Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6">
          
          {/* Main Large Hero Card (Red Bento) */}
          <div className="col-span-1 md:col-span-2 lg:col-span-7 bg-red-600 rounded-3xl p-6 sm:p-8 md:p-10 text-white relative overflow-hidden flex flex-col justify-between shadow-sm min-h-[280px]">
            {/* Background glowing rings */}
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-3 max-w-xl">
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
                Pagamento no Ato da Entrega.<br />
                <span className="text-amber-300">Sem Riscos.</span>
              </h1>

              <p className="text-xs sm:text-sm md:text-base text-red-50 leading-relaxed font-normal">
                Compre com tranquilidade. O estafeta leva a encomenda até à sua residência e você só paga após abrir e verificar o produto.
              </p>
            </div>

            <div className="relative z-10 pt-6 flex flex-wrap items-center gap-3">
              <button
                id="hero-explore-btn"
                onClick={onScrollToCatalog}
                className="px-6 py-3 rounded-2xl bg-white text-red-600 font-bold text-xs sm:text-sm shadow-sm hover:bg-stone-100 flex items-center gap-2 transition-all transform active:scale-95 cursor-pointer"
              >
                <span>Ver Catálogo</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-delivery-calc-btn"
                onClick={onOpenDeliveryModal}
                className="px-4 py-3 rounded-2xl bg-black/20 hover:bg-black/30 border border-white/20 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-amber-300" />
                <span>Fretes & Zonas</span>
              </button>
            </div>
          </div>

          {/* How Cash on Delivery Works Card (Dark Stone Bento) */}
          <div className="col-span-1 md:col-span-2 lg:col-span-5 bg-stone-900 text-white rounded-3xl p-6 sm:p-7 border border-stone-800 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Como Funciona o Cash on Delivery</span>
              </div>
              <h3 className="text-lg font-black text-white">3 Passos Simples e Seguros</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3 bg-stone-800/80 p-3 rounded-2xl border border-stone-700/60">
                <span className="w-6 h-6 rounded-full bg-amber-400 text-stone-950 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <span className="font-bold text-stone-100 block">Faça a sua Encomenda</span>
                  <span className="text-stone-400 text-[11px] leading-tight">Escolha os produtos sem adiantar nenhum valor no site.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-stone-800/80 p-3 rounded-2xl border border-stone-700/60">
                <span className="w-6 h-6 rounded-full bg-amber-400 text-stone-950 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <span className="font-bold text-stone-100 block">Receba na sua Morada</span>
                  <span className="text-stone-400 text-[11px] leading-tight">O estafeta desloca-se até ao seu bairro em Luanda.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-stone-800/80 p-3 rounded-2xl border border-stone-700/60">
                <span className="w-6 h-6 rounded-full bg-emerald-400 text-stone-950 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <span className="font-bold text-stone-100 block">Verifique & Pague</span>
                  <span className="text-stone-400 text-[11px] leading-tight">Abra o pacote, confirme e pague em Dinheiro ou Multicaixa Express.</span>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-stone-400 flex items-center gap-1.5 pt-1">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Garantia de segurança para compradores e vendedores</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
