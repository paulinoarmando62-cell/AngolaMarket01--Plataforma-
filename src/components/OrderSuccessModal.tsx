import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle, 
  MapPin, 
  Phone, 
  CreditCard, 
  Banknote,
  Truck, 
  ShieldCheck, 
  MessageCircle, 
  Eye, 
  X,
  KeyRound,
  Calendar
} from 'lucide-react';
import { Order } from '../types';
import { formatKwanzas } from '../data/mockData';

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
  onTrackOrder: (orderId: string) => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  onClose,
  onTrackOrder,
}) => {
  useEffect(() => {
    if (order) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // ignore if canvas unavailable
      }
    }
  }, [order]);

  if (!order) return null;

  const handleShareWhatsApp = () => {
    const message = encodeURIComponent(
      `*ANGOLAMARKET 01 — CONFIRMAÇÃO DE PEDIDO*\n` +
      `*Nº do Pedido:* ${order.orderNumber}\n` +
      `*Cliente:* ${order.customer.fullName}\n` +
      `*Telefone:* ${order.customer.phone}\n` +
      `*Destino em Luanda:* ${order.customer.neighborhood}, ${order.customer.municipalityName}\n` +
      `*Ponto de Ref.:* ${order.customer.referencePoint}\n` +
      `*Total a Pagar na Entrega:* ${formatKwanzas(order.total)}\n` +
      `*Método:* ${order.customer.paymentMethod === 'dinheiro_entrega' ? 'Dinheiro Físico' : 'Multicaixa Express'}\n` +
      `*Código de Entrega:* ${order.deliveryCode}\n\n` +
      `Obrigado por comprar no AngolaMarket 01!`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto">
      <div 
        id="order-success-modal"
        className="relative w-full max-w-2xl bg-white border border-stone-200 rounded-3xl shadow-2xl text-stone-900 overflow-hidden my-auto max-h-[94vh] flex flex-col"
      >
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-6 text-center relative text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-2xl bg-black/20 text-white hover:bg-black/40 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center mx-auto mb-3 border-2 border-white/40 shadow-inner">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-emerald-100 bg-black/20 px-3 py-1 rounded-full">
            Pedido Registado com Sucesso!
          </span>

          <h2 className="text-2xl sm:text-3xl font-black text-white mt-2">
            Pagamento no Ato da Entrega
          </h2>

          <p className="text-xs text-emerald-100 mt-1">
            Nº {order.orderNumber} • Luanda, Angola
          </p>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-5">
          
          {/* Delivery Instructions Box */}
          <div className="p-5 rounded-3xl bg-stone-50 border border-stone-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Entrega com Pagamento no Local:
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
                100% Protegido
              </span>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              O estafeta levará a sua encomenda até à sua residência em Luanda. Você pode <strong>abrir o pacote, verificar os artigos</strong> e pagar tranquilamente em <strong>dinheiro físico com troco</strong> ou por <strong>Multicaixa Express</strong>.
            </p>
          </div>

          {/* Courier Assignment */}
          {order.courier && (
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-800 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-amber-600" />
                  Estafeta Designado para a sua Rota:
                </span>
                <span className="text-[10px] text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full font-bold">
                  A Caminho do Armazém
                </span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div>
                  <h4 className="font-bold text-sm text-stone-900">{order.courier.name}</h4>
                  <p className="text-xs text-stone-500">{order.courier.vehicle}</p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${order.courier.phone.replace(/[^0-9]/g, '')}`}
                    className="px-3.5 py-1.5 rounded-2xl bg-stone-200 hover:bg-stone-300 text-stone-900 text-xs font-bold flex items-center gap-1 border border-stone-300"
                  >
                    <Phone className="w-3.5 h-3.5 text-red-600" />
                    <span>{order.courier.phone}</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Delivery & Payment Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
              <span className="text-stone-500 font-medium flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-red-600" /> Local de Entrega:
              </span>
              <p className="font-bold text-stone-900">
                {order.customer.neighborhood}, {order.customer.municipalityName.split('(')[0]}
              </p>
              <p className="text-xs text-red-600 font-medium">
                Ref: {order.customer.referencePoint}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
              <span className="text-stone-500 font-medium flex items-center gap-1">
                <Banknote className="w-3.5 h-3.5 text-emerald-600" /> Total a Pagar na Entrega:
              </span>
              <p className="text-base font-black text-stone-900 font-mono">
                {formatKwanzas(order.total)}
              </p>
              <p className="text-xs text-stone-500">
                Forma: <strong className="text-stone-800">{order.customer.paymentMethod === 'dinheiro_entrega' ? '💵 Dinheiro Físico' : '📱 Multicaixa Express'}</strong>
                {order.customer.needChangeFor ? ` (Troco p/ ${formatKwanzas(order.customer.needChangeFor)})` : ''}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <button
              onClick={() => onTrackOrder(order.id)}
              className="w-full py-3.5 px-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition-all transform active:scale-95 cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>Acompanhar Estado do Pedido em Tempo Real</span>
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="w-full py-2.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Guardar Comprovativo no WhatsApp</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
