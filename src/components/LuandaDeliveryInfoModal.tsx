import React from 'react';
import { 
  X, 
  MapPin, 
  Clock, 
  Truck, 
  ShieldCheck, 
  CreditCard, 
  Banknote, 
  Smartphone, 
  Phone, 
  CheckCircle2
} from 'lucide-react';
import { LuandaZone } from '../types';
import { formatKwanzas } from '../data/mockData';

interface LuandaDeliveryInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedZone: LuandaZone;
  onSelectZone: (zone: LuandaZone) => void;
  luandaZones: LuandaZone[];
}

export const LuandaDeliveryInfoModal: React.FC<LuandaDeliveryInfoModalProps> = ({
  isOpen,
  onClose,
  selectedZone,
  onSelectZone,
  luandaZones,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto">
      <div 
        id="delivery-info-modal"
        className="relative w-full max-w-3xl bg-white border border-stone-200 rounded-3xl shadow-2xl text-stone-900 overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-red-50 text-red-600 border border-red-100">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-stone-900 flex items-center gap-2">
                <span>Cobertura de Entregas & COD por Bairro em Luanda</span>
              </h2>
              <p className="text-xs text-stone-500">
                Pague apenas no momento da entrega no seu bairro
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-stone-100 text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6 text-xs text-stone-600">
          
          {/* Banner */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
            <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Garantia AngolaMarket 01: Compre sem risco!</span>
            </div>
            <p className="leading-relaxed text-xs text-stone-600">
              O nosso sistema logístico de <strong>Cash on Delivery (Pagamento na Entrega)</strong> opera com cobertura total para todos os bairros e municípios da <strong>Província de Luanda</strong>. Você recebe os produtos no seu endereço ou condomínio, abre o pacote com o estafeta, confere o estado do artigo e só depois realiza o pagamento por Dinheiro Físico ou Multicaixa Express.
            </p>
          </div>

          {/* Zones Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-stone-900 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-amber-600" />
                <span>Tabela Oficial de Taxas e Prazos por Bairro de Luanda</span>
              </h3>
              <span className="text-xs text-stone-500">Clique para selecionar seu bairro</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {luandaZones.map((zone) => {
                const isSelected = selectedZone.id === zone.id;
                return (
                  <div
                    key={zone.id}
                    onClick={() => onSelectZone(zone)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-red-50/70 border-red-500 shadow-sm text-stone-900'
                        : 'bg-stone-50 border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-stone-900 text-xs">{zone.neighborhood || zone.name}</span>
                      <span className="font-mono font-bold text-red-600 text-xs">
                        {formatKwanzas(zone.deliveryFee)}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-stone-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-emerald-600" /> {zone.estimatedHours}
                      </span>
                      <span className="text-[10px] text-stone-400">({zone.municipality})</span>
                      {isSelected && (
                        <span className="text-red-600 font-bold flex items-center gap-0.5 ml-auto">
                          <CheckCircle2 className="w-3 h-3" /> Bairro Selecionado
                        </span>
                      )}
                    </div>

                    {zone.popularAreas && zone.popularAreas.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {zone.popularAreas.slice(0, 4).map((area, idx) => (
                          <span key={idx} className="text-[10px] bg-stone-200 text-stone-700 font-medium px-2 py-0.5 rounded-md">
                            {area}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment Methods Explained */}
          <div className="space-y-3 pt-2 border-t border-stone-200">
            <h3 className="font-bold text-sm text-stone-900">
              Formas de Pagamento Aceites pelo Estafeta em Luanda:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                <div className="flex items-center gap-1.5 text-stone-900 font-bold">
                  <Banknote className="w-4 h-4 text-emerald-600" />
                  <span>Dinheiro Físico (Kwanzas)</span>
                </div>
                <p className="text-xs text-stone-600">
                  Aceite em notas de Kwanzas. Caso necessite de troco, basta especificar o valor no checkout para que o estafeta leve o troco contado.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                <div className="flex items-center gap-1.5 text-stone-900 font-bold">
                  <Smartphone className="w-4 h-4 text-blue-600" />
                  <span>Multicaixa Express</span>
                </div>
                <p className="text-xs text-stone-600">
                  Transferência em tempo real pelo telemóvel ao conferir o produto na presença do estafeta.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
              ℹ️ <strong>Nota:</strong> O estafeta não anda com terminal TPA. O pagamento deve ser feito em notas físicas de Kwanzas ou transferência Multicaixa Express.
            </div>
          </div>

          {/* Contact and Support */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-bold text-stone-900 text-xs">Precisa de assistência para uma entrega em Luanda?</p>
              <p className="text-xs text-stone-500">Linha de Apoio AngolaMarket 01 • 08:00 às 20:00</p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="tel:+244923000001"
                className="px-3.5 py-2 rounded-2xl bg-stone-200 hover:bg-stone-300 text-stone-900 font-bold text-xs flex items-center gap-1.5 border border-stone-300"
              >
                <Phone className="w-3.5 h-3.5 text-red-600" />
                <span>+244 923 000 001</span>
              </a>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-2xl bg-stone-900 hover:bg-black text-white font-bold text-xs cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
