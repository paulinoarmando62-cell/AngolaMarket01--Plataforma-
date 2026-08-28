import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Phone, 
  User, 
  CreditCard, 
  Banknote, 
  Smartphone, 
  ShieldCheck, 
  Truck, 
  AlertCircle, 
  Info,
  CheckCircle2,
  Tag,
  Home,
  Navigation
} from 'lucide-react';
import { CartItem, LuandaZone, OrderCustomerInfo, PaymentMethodType, DeliveryType } from '../types';
import { formatKwanzas } from '../data/mockData';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  selectedZone: LuandaZone;
  onSelectZone: (zone: LuandaZone) => void;
  luandaZones: LuandaZone[];
  onSubmitOrder: (customerInfo: OrderCustomerInfo) => void;
  affiliateRefCode?: string;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  selectedZone,
  onSelectZone,
  luandaZones,
  onSubmitOrder,
  affiliateRefCode = '',
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [alternatePhone, setAlternatePhone] = useState('');
  
  // Delivery Type: 'porta' (à porta de casa) ou 'paragem' (na paragem do endereço)
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('porta');
  const [busStopName, setBusStopName] = useState('');

  const [neighborhood, setNeighborhood] = useState(selectedZone.neighborhood || '');
  const [streetAddress, setStreetAddress] = useState('');
  const [referencePoint, setReferencePoint] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('dinheiro_entrega');
  const [needChangeFor, setNeedChangeFor] = useState<number | undefined>(undefined);
  const [customChangeInput, setCustomChangeInput] = useState('');
  const [affiliateCode, setAffiliateCode] = useState(affiliateRefCode);
  const [hasError, setHasError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Calculate dynamic delivery fee based on selected type
  const effectiveDeliveryFee = deliveryType === 'porta'
    ? (selectedZone.deliveryFeeDoor ?? selectedZone.deliveryFee)
    : (selectedZone.deliveryFeeBusStop ?? Math.round(selectedZone.deliveryFee * 0.6));

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const total = subtotal + effectiveDeliveryFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasError(null);

    if (!fullName.trim()) {
      setHasError('Por favor informe o seu Nome Completo.');
      return;
    }

    if (!phone.trim() || phone.replace(/[^0-9]/g, '').length < 9) {
      setHasError('Por favor informe um número de telefone válido de Angola (ex: 923 000 000).');
      return;
    }

    if (!neighborhood.trim()) {
      setHasError('Por favor informe o Bairro / Zona em Luanda.');
      return;
    }

    if (deliveryType === 'paragem' && !busStopName.trim()) {
      setHasError('Por favor informe o Nome da Paragem do endereço onde pretende receber o pedido.');
      return;
    }

    if (!referencePoint.trim()) {
      setHasError('O Ponto de Referência é obrigatório para que o estafeta encontre a sua localização com rapidez.');
      return;
    }

    const customerInfo: OrderCustomerInfo = {
      fullName,
      phone,
      alternatePhone,
      municipalityId: selectedZone.id,
      municipalityName: selectedZone.name,
      neighborhood: neighborhood || selectedZone.neighborhood || selectedZone.name,
      deliveryType,
      busStopName: deliveryType === 'paragem' ? busStopName.trim() : undefined,
      streetAddress: deliveryType === 'porta' ? streetAddress.trim() : `Paragem: ${busStopName.trim()}`,
      referencePoint,
      deliveryNotes,
      paymentMethod,
      needChangeFor: paymentMethod === 'dinheiro_entrega' 
        ? (customChangeInput ? Number(customChangeInput) : needChangeFor) 
        : undefined,
      affiliateCodeUsed: affiliateCode.trim() || undefined,
    };

    onSubmitOrder(customerInfo);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto">
      <div 
        id="checkout-modal"
        className="relative w-full max-w-3xl bg-white border border-stone-200 rounded-3xl shadow-2xl text-stone-900 overflow-hidden my-auto max-h-[94vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 font-black text-sm">
              AO
            </div>
            <div>
              <h2 className="font-bold text-base text-stone-900 flex items-center gap-2">
                <span>Finalizar Pedido com Pagamento na Entrega</span>
                <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                  Cash on Delivery
                </span>
              </h2>
              <p className="text-xs text-stone-500">
                Província de Luanda • Pague apenas quando receber o produto
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

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {hasError && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{hasError}</span>
            </div>
          )}

          {/* Section 1: Customer Contact */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-1 border-b border-stone-100 text-sm font-bold text-stone-900">
              <User className="w-4 h-4 text-red-600" />
              <span>1. Seus Dados de Contacto (Luanda)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-stone-700 font-bold">Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ex: João Baptista Silva"
                  className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-3.5 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-red-500 focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-stone-700 font-bold">Telefone Principal (Chamadas & WhatsApp) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-stone-400 font-mono font-bold">+244</span>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="923 456 789"
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl pl-14 pr-3.5 py-2.5 text-xs text-stone-900 placeholder-stone-400 font-mono focus:outline-none focus:border-red-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs text-stone-700 font-bold">Contacto Telefónico Alternativo (Opcional)</label>
                <input
                  type="tel"
                  value={alternatePhone}
                  onChange={(e) => setAlternatePhone(e.target.value)}
                  placeholder="Ex: +244 931 222 333 (caso o primeiro esteja ocupado)"
                  className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-3.5 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-red-500 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Luanda Delivery Type & Bairro Address */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-1 border-b border-stone-100 text-sm font-bold text-stone-900">
              <MapPin className="w-4 h-4 text-red-600" />
              <span>2. Localização & Modalidade de Entrega em Luanda</span>
            </div>

            {/* Selection: Doorstep vs Bus Stop (Pergunta Obrigatória) */}
            <div className="space-y-2">
              <label className="text-xs text-stone-800 font-bold block">
                Onde pretende receber a sua encomenda? Escolha a modalidade de entrega: *
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Option 1: À Porta de Casa */}
                <div
                  onClick={() => setDeliveryType('porta')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    deliveryType === 'porta'
                      ? 'bg-red-50/60 border-red-600 shadow-sm ring-1 ring-red-400'
                      : 'bg-stone-50 border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-xl ${deliveryType === 'porta' ? 'bg-red-600 text-white' : 'bg-stone-200 text-stone-600'}`}>
                        <Home className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-xs text-stone-900">Entrega à Porta de Casa</span>
                    </div>
                    <span className="font-mono text-xs font-black text-red-600 bg-red-100/70 px-2 py-0.5 rounded-lg">
                      {formatKwanzas(selectedZone.deliveryFeeDoor ?? selectedZone.deliveryFee)}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 leading-snug mt-1">
                    O estafeta vai diretamente à sua residência, prédio ou condomínio no bairro indicado.
                  </p>
                </div>

                {/* Option 2: Na Paragem do Bairro */}
                <div
                  onClick={() => setDeliveryType('paragem')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    deliveryType === 'paragem'
                      ? 'bg-emerald-50/70 border-emerald-600 shadow-sm ring-1 ring-emerald-400'
                      : 'bg-stone-50 border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-xl ${deliveryType === 'paragem' ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-600'}`}>
                        <Navigation className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-xs text-stone-900">Até a Paragem do Bairro</span>
                    </div>
                    <span className="font-mono text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-lg">
                      {formatKwanzas(selectedZone.deliveryFeeBusStop ?? Math.round(selectedZone.deliveryFee * 0.6))}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 leading-snug mt-1">
                    Encontro na paragem principal ou ponto de autocarro/táxi do endereço selecionado (mais económico).
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Dynamic Luanda Zone / Neighborhood Select */}
              {luandaZones.length > 0 ? (
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs text-stone-700 font-bold">Selecione o Bairro / Zona de Luanda *</label>
                  <select
                    value={selectedZone.id}
                    onChange={(e) => {
                      const zone = luandaZones.find(z => z.id === e.target.value);
                      if (zone) {
                        onSelectZone(zone);
                        setNeighborhood(zone.neighborhood || zone.name);
                      }
                    }}
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-3.5 py-2.5 text-xs text-stone-900 font-semibold focus:outline-none focus:border-red-500 cursor-pointer"
                  >
                    {luandaZones.map((z) => {
                      const feeToDisplay = deliveryType === 'porta' 
                        ? (z.deliveryFeeDoor ?? z.deliveryFee)
                        : (z.deliveryFeeBusStop ?? Math.round(z.deliveryFee * 0.6));
                      return (
                        <option key={z.id} value={z.id}>
                          {z.neighborhood || z.name} ({z.municipality}) — Taxa {deliveryType === 'porta' ? 'à Porta' : 'na Paragem'}: {formatKwanzas(feeToDisplay)} ({z.estimatedHours})
                        </option>
                      );
                    })}
                  </select>
                </div>
              ) : null}

              {/* Bairro Especifico */}
              <div className={`space-y-1 ${luandaZones.length === 0 ? 'sm:col-span-2' : ''}`}>
                <label className="text-xs text-stone-700 font-bold">Bairro / Município / Condomínio em Luanda *</label>
                <input
                  type="text"
                  required
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="Ex: Centralidade do Kilamba, Maianga, Talatona, Zango 3, Alvalade..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-3.5 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-red-500 focus:bg-white transition-all"
                />
              </div>

              {/* Conditional Field: Rua/Casa (if porta) vs Nome da Paragem (if paragem) */}
              {deliveryType === 'porta' ? (
                <div className="space-y-1">
                  <label className="text-xs text-stone-700 font-bold">Rua / Entrada / Nº da Casa ou Edifício</label>
                  <input
                    type="text"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    placeholder="Ex: Rua 12, Casa nº 45, Edifício K12, 2º Andar Dto"
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-3.5 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-red-500 focus:bg-white transition-all"
                  />
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="text-xs text-emerald-800 font-bold flex items-center gap-1">
                    <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Nome da Paragem do Endereço *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={busStopName}
                    onChange={(e) => setBusStopName(e.target.value)}
                    placeholder="Ex: Paragem da Sagrada Família, Paragem do Rocha, etc."
                    className="w-full bg-stone-50 border border-emerald-300 rounded-2xl px-3.5 py-2.5 text-xs text-stone-900 font-semibold placeholder-stone-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                  />
                </div>
              )}

              {/* Popular Bus Stops Suggestions in this neighborhood if Paragem is chosen */}
              {deliveryType === 'paragem' && selectedZone.popularBusStops && selectedZone.popularBusStops.length > 0 && (
                <div className="sm:col-span-2 space-y-1.5 bg-emerald-50/50 p-3 rounded-2xl border border-emerald-200">
                  <span className="text-[11px] font-bold text-emerald-900 block">
                    Paragens principais cadastradas em {selectedZone.neighborhood || selectedZone.name.split('(')[0]}:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedZone.popularBusStops.map((stop, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setBusStopName(stop)}
                        className={`text-[11px] px-2.5 py-1 rounded-xl border transition-all cursor-pointer ${
                          busStopName === stop
                            ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                            : 'bg-white text-stone-700 border-emerald-200 hover:bg-emerald-100/50'
                        }`}
                      >
                        🚏 {stop}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Ponto de Referência - MANDATORY IN LUANDA */}
              <div className="space-y-1 sm:col-span-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-red-600 font-bold flex items-center gap-1">
                    <span>Ponto de Referência Obrigatório *</span>
                    <Info className="w-3.5 h-3.5 text-stone-400" />
                  </label>
                  <span className="text-[10px] text-stone-500">
                    {deliveryType === 'porta' ? 'Ajuda o estafeta a achar a casa' : 'Ponto exato de encontro na paragem'}
                  </span>
                </div>
                <input
                  type="text"
                  required
                  value={referencePoint}
                  onChange={(e) => setReferencePoint(e.target.value)}
                  placeholder={
                    deliveryType === 'porta'
                      ? "Ex: Em frente à Padaria Pão Quente / Ao lado da bomba Sonangol / Próximo ao Colégio"
                      : "Ex: Ao lado do quiosque azul na paragem / Em frente à passagem de peões"
                  }
                  className="w-full bg-stone-50 border border-red-200 rounded-2xl px-3.5 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:bg-white transition-all"
                />
              </div>

              {/* Affiliate Referral Code */}
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs text-stone-600 font-bold flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-blue-600" />
                  <span>Código de Afiliado / Divulgador (Opcional)</span>
                </label>
                <input
                  type="text"
                  value={affiliateCode}
                  onChange={(e) => setAffiliateCode(e.target.value.toUpperCase())}
                  placeholder="Ex: TERESA-01 (se indicado por um divulgador)"
                  className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-3.5 py-2 text-xs text-stone-900 uppercase font-mono placeholder-stone-400 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Cash on Delivery Payment Method in Luanda */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-stone-100">
              <div className="flex items-center gap-2 text-sm font-bold text-stone-900">
                <Banknote className="w-4 h-4 text-emerald-600" />
                <span>3. Modalidade de Pagamento no Ato da Entrega</span>
              </div>
              <span className="text-[11px] font-semibold text-stone-500">
                Sem TPA (Dinheiro ou Express)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option 1: Dinheiro Físico */}
              <div
                onClick={() => setPaymentMethod('dinheiro_entrega')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'dinheiro_entrega'
                    ? 'bg-emerald-50/70 border-emerald-500 text-stone-900 shadow-sm ring-1 ring-emerald-400'
                    : 'bg-stone-50 border-stone-200 text-stone-600 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Banknote className={`w-5 h-5 ${paymentMethod === 'dinheiro_entrega' ? 'text-emerald-600' : 'text-stone-400'}`} />
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    Mais Utilizado
                  </span>
                </div>
                <h4 className="font-bold text-xs text-stone-900">Dinheiro Físico no Ato (Kwanzas)</h4>
                <p className="text-[11px] text-stone-500 mt-1 leading-snug">
                  Pague em notas de Kwanzas após conferir o produto com o estafeta. Indique se necessita de troco abaixo.
                </p>
              </div>

              {/* Option 2: MCX Express */}
              <div
                onClick={() => setPaymentMethod('express_transferencia')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'express_transferencia'
                    ? 'bg-blue-50/70 border-blue-500 text-stone-900 shadow-sm ring-1 ring-blue-400'
                    : 'bg-stone-50 border-stone-200 text-stone-600 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Smartphone className={`w-5 h-5 ${paymentMethod === 'express_transferencia' ? 'text-blue-600' : 'text-stone-400'}`} />
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                    Telemóvel
                  </span>
                </div>
                <h4 className="font-bold text-xs text-stone-900">Multicaixa Express / Transferência</h4>
                <p className="text-[11px] text-stone-500 mt-1 leading-snug">
                  Transfira pelo seu telemóvel instantaneamente na presença do estafeta ao receber a encomenda.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                <strong>Aviso:</strong> O estafeta não anda com terminal TPA. Tenha o valor em <strong>dinheiro físico</strong> ou utilize o <strong>Multicaixa Express</strong> no telemóvel.
              </span>
            </div>

            {/* Change selector if Cash is chosen */}
            {paymentMethod === 'dinheiro_entrega' && (
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5">
                <span className="text-xs font-bold text-stone-800 block">
                  Vai pagar em dinheiro. Precisa que o estafeta leve troco para quanto?
                </span>
                <div className="flex flex-wrap gap-2 text-xs">
                  {[0, 10000, 20000, 50000, 100000].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => {
                        setNeedChangeFor(val);
                        setCustomChangeInput('');
                      }}
                      className={`px-3 py-1.5 rounded-xl border font-mono transition-colors cursor-pointer text-xs ${
                        needChangeFor === val && !customChangeInput
                          ? 'bg-red-600 text-white border-red-600 font-bold'
                          : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {val === 0 ? 'Sem Troco (Valor Exato)' : `Troco p/ ${formatKwanzas(val)}`}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Order Total & Summary Card */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
            <div className="flex items-center justify-between text-xs text-stone-600">
              <span>{items.length} {items.length === 1 ? 'artigo' : 'artigos'} do carrinho:</span>
              <span className="font-mono font-bold text-stone-900">{formatKwanzas(subtotal)}</span>
            </div>
            
            <div className="flex items-center justify-between text-xs text-stone-600">
              <span className="flex items-center gap-1">
                {deliveryType === 'porta' ? <Home className="w-3.5 h-3.5 text-red-600" /> : <Navigation className="w-3.5 h-3.5 text-emerald-600" />}
                Taxa de Entrega ({deliveryType === 'porta' ? 'À Porta' : 'Na Paragem'} em {selectedZone.neighborhood || selectedZone.name.split('(')[0]}):
              </span>
              <span className="font-mono font-bold text-stone-900">{formatKwanzas(effectiveDeliveryFee)}</span>
            </div>

            <div className="flex items-center justify-between text-base font-black text-stone-900 pt-2 border-t border-stone-200">
              <span>Total a Pagar na Entrega:</span>
              <span className="text-red-600 font-mono text-xl">{formatKwanzas(total)}</span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="space-y-2 pt-2">
            <button
              id="confirm-cod-order-btn"
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-base shadow-sm flex items-center justify-center gap-2 transition-all transform active:scale-95 cursor-pointer"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Confirmar Pedido (Pagar na Entrega em Luanda)</span>
            </button>

            <p className="text-center text-xs text-stone-500 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Sem custos adiantados. Você só paga quando receber e aprovar.</span>
            </p>
          </div>

        </form>
      </div>
    </div>
  );
};

