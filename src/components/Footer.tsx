import React from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  CreditCard, 
  Banknote,
  Truck, 
  Heart,
  MessageCircle,
  DollarSign,
  UserCheck
} from 'lucide-react';
import { LuandaZone } from '../types';

interface FooterProps {
  onOpenDeliveryInfo: () => void;
  onOpenAuth: () => void;
  onOpenAdminPortal: () => void;
  onOpenCourierPortal: () => void;
  onOpenAffiliatePortal: () => void;
  luandaZones: LuandaZone[];
}

export const Footer: React.FC<FooterProps> = ({
  onOpenDeliveryInfo,
  onOpenAuth,
  onOpenAdminPortal,
  onOpenCourierPortal,
  onOpenAffiliatePortal,
  luandaZones,
}) => {
  return (
    <footer className="bg-stone-900 text-stone-400 border-t border-stone-800 text-xs mt-16">
      {/* Top Feature Bar */}
      <div className="border-b border-stone-800 bg-stone-950/40">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 shrink-0">
              <Banknote className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-white text-xs">100% Pagamento na Entrega</h4>
              <p className="text-[11px] text-stone-400 leading-relaxed">
                Pague em Kwanzas por Dinheiro físico com troco ou transferência Multicaixa Express.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/20 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-white text-xs">Entregas Rápidas por Bairro</h4>
              <p className="text-[11px] text-stone-400 leading-relaxed">
                Cobertura direta em todos os municípios e bairros da Província de Luanda.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-white text-xs">Inspecione Antes de Pagar</h4>
              <p className="text-[11px] text-stone-400 leading-relaxed">
                Abra a encomenda, teste os artigos com o estafeta e só depois valide a entrega.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-2xl bg-red-500/20 text-red-400 border border-red-500/20 shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-white text-xs">Suporte Local no WhatsApp</h4>
              <p className="text-[11px] text-stone-400 leading-relaxed">
                Equipa de apoio em Luanda pronta a ajudar com pedidos, taxas e entregas.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-red-600 text-white flex items-center justify-center font-black text-sm shadow-md">
                AO01
              </div>
              <span className="text-lg font-black tracking-tight text-white">
                AngolaMarket <span className="text-red-500 font-mono">01</span>
              </span>
            </div>

            <p className="text-xs text-stone-400 max-w-sm leading-relaxed">
              O marketplace oficial de Luanda. Plataforma exclusiva com catálogo gerido pelo proprietário, rede de estafetas autorizados e pagamento contra entrega em todos os bairros.
            </p>

            <div className="pt-2 text-xs space-y-1.5 text-stone-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-red-500" />
                <span>Sede Operacional: Luanda, Angola</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-red-500" />
                <span>Linhas de Apoio Luanda: +244 938 243 909 / +244 950 461 466</span>
              </div>
            </div>
          </div>

          {/* Luanda Zones quick list */}
          <div className="space-y-3">
            <h5 className="font-bold text-white text-xs uppercase tracking-wider">
              Bairros de Luanda ({luandaZones.length})
            </h5>
            <ul className="space-y-2 text-xs">
              {luandaZones.slice(0, 5).map((z) => (
                <li key={z.id}>
                  <button 
                    onClick={onOpenDeliveryInfo}
                    className="hover:text-red-400 transition-colors text-left cursor-pointer"
                  >
                    {z.neighborhood || z.name.split('(')[0]}
                  </button>
                </li>
              ))}
              <li>
                <button 
                  onClick={onOpenDeliveryInfo}
                  className="text-red-400 underline font-bold text-xs cursor-pointer"
                >
                  Ver todas as taxas por bairro →
                </button>
              </li>
            </ul>
          </div>

          {/* Portals & Accounts */}
          <div className="space-y-3">
            <h5 className="font-bold text-white text-xs uppercase tracking-wider">
              Portais & Acessos
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={onOpenAdminPortal} className="hover:text-red-400 transition-colors flex items-center gap-1.5 cursor-pointer">
                  <ShieldCheck className="w-3.5 h-3.5 text-red-500" /> Painel de ADM (Dono)
                </button>
              </li>
              <li>
                <button onClick={onOpenCourierPortal} className="hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer">
                  <Truck className="w-3.5 h-3.5 text-amber-500" /> Portal do Entregador
                </button>
              </li>
              <li>
                <button onClick={onOpenAffiliatePortal} className="hover:text-blue-400 transition-colors flex items-center gap-1.5 cursor-pointer">
                  <DollarSign className="w-3.5 h-3.5 text-blue-500" /> Programa de Afiliados (7%)
                </button>
              </li>
              <li>
                <button onClick={onOpenAuth} className="hover:text-stone-200 transition-colors flex items-center gap-1.5 cursor-pointer">
                  <UserCheck className="w-3.5 h-3.5 text-stone-400" /> Iniciar Sessão / Criar Conta
                </button>
              </li>
            </ul>
          </div>

          {/* Payment & Security */}
          <div className="space-y-3">
            <h5 className="font-bold text-white text-xs uppercase tracking-wider">
              Pagamentos Aceites no Local
            </h5>
            <div className="space-y-2">
              <div className="p-3 rounded-2xl bg-stone-950 border border-stone-800 space-y-1">
                <span className="font-bold text-stone-200 block text-xs">💳 TPA Móvel Multicaixa</span>
                <span className="text-[11px] text-stone-400 block">Rede EMIS Multicaixa (BAI, BFA, BIC, Atlântico...)</span>
              </div>
              <div className="p-3 rounded-2xl bg-stone-950 border border-stone-800 space-y-1">
                <span className="font-bold text-stone-200 block text-xs">💵 Dinheiro Físico (Kwanzas)</span>
                <span className="text-[11px] text-stone-400 block">Com opção de troco solicitada no checkout</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-stone-800 flex flex-wrap items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} AngolaMarket 01. Todos os direitos reservados. Província de Luanda, Angola.</p>
          <div className="flex items-center gap-1">
            <span>Orgulhosamente desenvolvido para Angola</span>
            <span className="text-red-500">🇦🇴</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
