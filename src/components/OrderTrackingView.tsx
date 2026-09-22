import React, { useState } from 'react';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  CreditCard, 
  Banknote,
  KeyRound, 
  AlertCircle, 
  ArrowLeft,
  X,
  RotateCcw,
  ShieldCheck,
  ShoppingBag
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { formatKwanzas } from '../data/mockData';

interface OrderTrackingViewProps {
  orders: Order[];
  onBack: () => void;
  onCancelOrder?: (orderId: string) => void;
  onOpenAuth?: () => void;
}

export const OrderTrackingView: React.FC<OrderTrackingViewProps> = ({
  orders,
  onBack,
  onOpenAuth,
}) => {
  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    orders.length > 0 ? orders[0].id : ''
  );

  const currentOrder = orders.find(o => o.id === selectedOrderId) || orders[0];

  const getStatusStep = (status: OrderStatus) => {
    switch (status) {
      case 'recebido':
        return 1;
      case 'preparando':
        return 2;
      case 'em_transito':
        return 3;
      case 'entregue':
        return 4;
      case 'cancelado':
        return 0;
    }
  };

  const currentStep = currentOrder ? getStatusStep(currentOrder.status) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 rounded-2xl bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 transition-colors flex items-center gap-1 text-xs font-bold cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar às Compras</span>
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-stone-900 flex items-center gap-2">
              <span>Acompanhamento de Pedidos Luanda</span>
              <span className="bg-red-50 text-red-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-red-200">
                Cash on Delivery
              </span>
            </h1>
            <p className="text-xs text-stone-500">
              Acompanhe o estafeta em tempo real e pague por Dinheiro ou Multicaixa Express na entrega.
            </p>
          </div>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="p-10 sm:p-12 text-center bg-white border border-stone-200 rounded-3xl space-y-4 max-w-lg mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-stone-900">Nenhum Pedido Nesta Conta</h2>
          <p className="text-xs text-stone-500 leading-relaxed">
            Os agendamentos e pedidos feitos na plataforma ficam associados exclusivamente à conta de quem os solicitou.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
            <button
              onClick={onBack}
              className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              Explorar Catálogo
            </button>
            {onOpenAuth && (
              <button
                onClick={onOpenAuth}
                className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-all cursor-pointer"
              >
                Mudar de Conta
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Orders List */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Seus Pedidos Ativos ({orders.length})
            </h3>

            <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
              {orders.map((order) => {
                const isSelected = order.id === currentOrder.id;
                return (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrderId(order.id)}
                    className={`p-4 rounded-3xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white border-red-500 shadow-md ring-1 ring-red-500'
                        : 'bg-white border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-bold text-stone-900 font-mono">{order.orderNumber}</span>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        order.status === 'entregue'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : order.status === 'em_transito'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200 animate-pulse'
                          : order.status === 'cancelado'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-blue-50 text-blue-800 border border-blue-200'
                      }`}>
                        {order.status === 'recebido' && 'Recebido'}
                        {order.status === 'preparando' && 'A Preparar'}
                        {order.status === 'em_transito' && 'Estafeta a Caminho'}
                        {order.status === 'entregue' && 'Entregue & Pago'}
                        {order.status === 'cancelado' && 'Cancelado'}
                      </span>
                    </div>

                    <div className="text-xs text-stone-500 space-y-0.5">
                      <p className="truncate font-medium text-stone-700">
                        {order.items.map(i => `${i.quantity}x ${i.product.title}`).join(', ')}
                      </p>
                      <div className="flex items-center justify-between pt-1 font-mono text-xs">
                        <span className="text-stone-500">{order.customer.neighborhood}</span>
                        <span className="font-bold text-red-600">{formatKwanzas(order.total)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Order Details & Live Tracker */}
          {currentOrder && (
            <div className="lg:col-span-8 space-y-5">
              
              {/* Order Status Card */}
              <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-6">
                
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-200">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-black text-stone-900 font-mono">{currentOrder.orderNumber}</h2>
                      <span className="text-xs text-stone-400">• {currentOrder.date}</span>
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Destino: <strong className="text-stone-800">{currentOrder.customer.neighborhood}, {currentOrder.customer.municipalityName.split('(')[0]}</strong>
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-stone-400 block uppercase">Total a Pagar na Entrega:</span>
                    <span className="text-xl font-black text-red-600 font-mono">
                      {formatKwanzas(currentOrder.total)}
                    </span>
                  </div>
                </div>

                {/* Progress Steps Timeline */}
                <div className="space-y-4">
                  <span className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
                    Etapas da Entrega em Luanda:
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    {/* Step 1 */}
                    <div className={`p-3.5 rounded-2xl border ${
                      currentStep >= 1 
                        ? 'bg-emerald-50 border-emerald-300 text-stone-900' 
                        : 'bg-stone-50 border-stone-200 text-stone-400'
                    }`}>
                      <div className="flex items-center gap-2 text-xs font-bold mb-1">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          currentStep >= 1 ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-500'
                        }`}>1</span>
                        <span>Pedido Registado</span>
                      </div>
                      <p className="text-[11px] text-stone-500">Confirmado no sistema</p>
                    </div>

                    {/* Step 2 */}
                    <div className={`p-3.5 rounded-2xl border ${
                      currentStep >= 2 
                        ? 'bg-emerald-50 border-emerald-300 text-stone-900' 
                        : 'bg-stone-50 border-stone-200 text-stone-400'
                    }`}>
                      <div className="flex items-center gap-2 text-xs font-bold mb-1">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          currentStep >= 2 ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-500'
                        }`}>2</span>
                        <span>Em Preparação</span>
                      </div>
                      <p className="text-[11px] text-stone-500">Conferência no armazém</p>
                    </div>

                    {/* Step 3 */}
                    <div className={`p-3.5 rounded-2xl border ${
                      currentStep >= 3 
                        ? 'bg-amber-50 border-amber-300 text-stone-900 shadow-sm' 
                        : 'bg-stone-50 border-stone-200 text-stone-400'
                    }`}>
                      <div className="flex items-center gap-2 text-xs font-bold mb-1">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          currentStep >= 3 ? 'bg-amber-500 text-white animate-pulse' : 'bg-stone-200 text-stone-500'
                        }`}>3</span>
                        <span>Estafeta a Caminho</span>
                      </div>
                      <p className="text-[11px] text-stone-500">A caminho do seu endereço</p>
                    </div>

                    {/* Step 4 */}
                    <div className={`p-3.5 rounded-2xl border ${
                      currentStep >= 4 
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-900' 
                        : 'bg-stone-50 border-stone-200 text-stone-400'
                    }`}>
                      <div className="flex items-center gap-2 text-xs font-bold mb-1">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          currentStep >= 4 ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-500'
                        }`}>4</span>
                        <span>Entregue & Pago</span>
                      </div>
                      <p className="text-[11px] text-stone-500">Compra finalizada</p>
                    </div>
                  </div>
                </div>

                {/* Delivery Information Box */}
                <div className="p-5 rounded-3xl bg-stone-50 border border-stone-200 flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1 max-w-lg">
                    <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Garantia de Compra Segura Luanda:
                    </span>
                    <p className="text-xs text-stone-600">
                      {currentOrder.customer.paymentMethod === 'dinheiro_entrega' ? (
                        <>Poderá verificar a encomenda na presença do estafeta e pagar em <strong>dinheiro físico com troco</strong> (sem terminal TPA).</>
                      ) : (
                        <>Pagamento processado pela <strong>plataforma ({currentOrder.customer.paymentMethod === 'transferencia_bancaria' ? 'Transferência Bancária' : 'Multicaixa Express'})</strong>. O estafeta efetua a entrega direta do artigo verificado.</>
                      )}
                    </p>
                  </div>

                  <div className="text-center bg-white px-5 py-2 rounded-2xl border border-stone-200 shadow-sm">
                    <span className="text-xs font-bold text-emerald-700 block">100% Protegido</span>
                    <span className="text-[10px] text-stone-400 uppercase font-bold mt-0.5">Sem risco prévio</span>
                  </div>
                </div>

                {/* Courier details if assigned */}
                {currentOrder.courier && (
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-stone-200 flex items-center justify-center text-stone-800">
                        <Truck className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xs text-stone-900">{currentOrder.courier.name}</h4>
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.2 rounded-full">
                            Estafeta Oficial Luanda
                          </span>
                        </div>
                        <p className="text-xs text-stone-500">{currentOrder.courier.vehicle}</p>
                      </div>
                    </div>

                    <a
                      href={`tel:${currentOrder.courier.phone.replace(/[^0-9]/g, '')}`}
                      className="px-3.5 py-2 rounded-2xl bg-stone-200 hover:bg-stone-300 text-stone-900 text-xs font-bold flex items-center gap-1.5 border border-stone-300 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-red-600" />
                      <span>Ligar ({currentOrder.courier.phone})</span>
                    </a>
                  </div>
                )}

                {/* Delivery Address & Ponto de Referência Box */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-stone-500 font-bold flex items-center gap-1 text-xs">
                        <MapPin className="w-3.5 h-3.5 text-red-600" /> Morada de Destino:
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                        currentOrder.customer.deliveryType === 'paragem'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-red-100 text-red-800 border-red-200'
                      }`}>
                        {currentOrder.customer.deliveryType === 'paragem' ? '🚏 Entrega na Paragem' : '🏠 Entrega à Porta'}
                      </span>
                    </div>

                    {currentOrder.customer.deliveryType === 'paragem' && currentOrder.customer.busStopName && (
                      <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold">
                        🚏 Ponto de Encontro: {currentOrder.customer.busStopName}
                      </div>
                    )}

                    <p className="font-bold text-stone-900">
                      {currentOrder.customer.streetAddress || 'Morada indicada'}, {currentOrder.customer.neighborhood}
                    </p>
                    <p className="text-stone-600">
                      {currentOrder.customer.municipalityName}
                    </p>
                    <p className="text-xs text-red-700 font-medium bg-red-50 p-2.5 rounded-xl border border-red-100">
                      📍 <strong>Ponto de Ref.:</strong> {currentOrder.customer.referencePoint}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5">
                    <span className="text-stone-500 font-bold flex items-center gap-1 text-xs">
                      <Banknote className="w-3.5 h-3.5 text-emerald-600" /> Modalidade de Pagamento:
                    </span>
                    <p className="font-bold text-stone-900">
                      {currentOrder.customer.paymentMethod === 'dinheiro_entrega' && '💵 Dinheiro Físico na Entrega (sem TPA)'}
                      {(currentOrder.customer.paymentMethod === 'multicaixa_express' || currentOrder.customer.paymentMethod === 'express_transferencia') && '📱 Multicaixa Express (Pela Plataforma)'}
                      {currentOrder.customer.paymentMethod === 'transferencia_bancaria' && '🏦 Transferência Bancária / IBAN (Pela Plataforma)'}
                    </p>
                    {currentOrder.customer.needChangeFor ? (
                      <p className="text-xs text-stone-700">
                        O estafeta leva troco para: <strong className="text-stone-900">{formatKwanzas(currentOrder.customer.needChangeFor)}</strong>
                      </p>
                    ) : null}
                    <p className="text-[11px] text-stone-400">
                      Contato: {currentOrder.customer.fullName} ({currentOrder.customer.phone})
                    </p>
                  </div>
                </div>

                {/* Ordered Items List */}
                <div className="space-y-2 pt-2 border-t border-stone-200">
                  <span className="text-xs font-bold text-stone-700 block">Artigos nesta encomenda:</span>
                  <div className="space-y-2">
                    {currentOrder.items.map((it) => (
                      <div key={it.product.id} className="flex items-center justify-between text-xs bg-stone-50 p-3 rounded-2xl border border-stone-200">
                        <div className="flex items-center gap-3">
                          <img src={it.product.image} alt="" className="w-10 h-10 rounded-xl object-cover bg-stone-200" referrerPolicy="no-referrer" />
                          <div>
                            <span className="font-bold text-stone-900 line-clamp-1">{it.product.title}</span>
                            <span className="text-[11px] text-stone-500">Qtd: {it.quantity} un.</span>
                          </div>
                        </div>
                        <span className="font-mono font-bold text-stone-900">
                          {formatKwanzas(it.product.price * it.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Official Protected Status Notice - Clients cannot alter order status */}
                <div className="pt-3 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs bg-stone-50 p-3.5 rounded-2xl">
                  <div className="flex items-center gap-2 text-stone-600">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      <strong>Estado Oficial Protegido:</strong> O progresso é sincronizado em tempo real exclusivamente pelo centro logístico e pelo estafeta em Luanda.
                    </span>
                  </div>
                  <a
                    href={`https://wa.me/244938243909?text=Ol%C3%A1%2C%20gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20o%20pedido%20${encodeURIComponent(currentOrder.orderNumber)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-xs shrink-0 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Suporte WhatsApp</span>
                  </a>
                </div>

              </div>

            </div>
          )}

        </div>
      )}
    </div>
  );
};
