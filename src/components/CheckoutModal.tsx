import React, { useState, useEffect } from 'react';
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
  Navigation,
  Lock,
  LogIn,
  UserPlus,
  Copy,
  Check,
  Building2,
  HelpCircle
} from 'lucide-react';
import { 
  CartItem, 
  LuandaZone, 
  OrderCustomerInfo, 
  PaymentMethodType, 
  DeliveryType, 
  AppUser,
  StorePaymentConfig,
  DEFAULT_PAYMENT_CONFIG
} from '../types';
import { formatKwanzas } from '../data/mockData';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  selectedZone: LuandaZone;
  onSelectZone: (zone: LuandaZone) => void;
  luandaZones: LuandaZone[];
  onSubmitOrder: (
    customerInfo: OrderCustomerInfo,
    newCustomerAccount?: { name: string; phone: string; password?: string; email?: string }
  ) => void;
  affiliateRefCode?: string;
  currentUser?: AppUser | null;
  users?: AppUser[];
  onLoginUser?: (user: AppUser) => void;
  paymentConfig?: StorePaymentConfig;
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
  currentUser,
  users = [],
  onLoginUser,
  paymentConfig = DEFAULT_PAYMENT_CONFIG,
}) => {
  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [alternatePhone, setAlternatePhone] = useState('');
  
  // Client account creation state for new users
  const [accountMode, setAccountMode] = useState<'create' | 'login'>('create');
  const [clientPassword, setClientPassword] = useState('123456');
  const [clientEmail, setClientEmail] = useState(currentUser?.email || '');
  const [loginPhoneOrEmail, setLoginPhoneOrEmail] = useState('');
  const [loginPasswordInput, setLoginPasswordInput] = useState('');
  const [loginFeedback, setLoginFeedback] = useState<string | null>(null);

  // Delivery Type: 'porta' (à porta de casa) ou 'paragem' (na paragem do endereço)
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('porta');
  const [busStopName, setBusStopName] = useState('');

  const [neighborhood, setNeighborhood] = useState(currentUser?.defaultNeighborhood || selectedZone.neighborhood || '');
  const [streetAddress, setStreetAddress] = useState(currentUser?.defaultStreetAddress || '');
  const [referencePoint, setReferencePoint] = useState(currentUser?.defaultReferencePoint || '');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  
  // Payment methods
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('dinheiro_entrega');
  const [needChangeFor, setNeedChangeFor] = useState<number | undefined>(undefined);
  const [customChangeInput, setCustomChangeInput] = useState('');

  // Platform payment details (Transferência Bancária e Multicaixa Express)
  const activeBankAccounts = (paymentConfig?.bankAccounts && paymentConfig.bankAccounts.length > 0)
    ? paymentConfig.bankAccounts.filter(b => b.isActive)
    : DEFAULT_PAYMENT_CONFIG.bankAccounts;
  const activeExpressAccounts = (paymentConfig?.expressAccounts && paymentConfig.expressAccounts.length > 0)
    ? paymentConfig.expressAccounts.filter(e => e.isActive)
    : DEFAULT_PAYMENT_CONFIG.expressAccounts;
  
  const [selectedIbanId, setSelectedIbanId] = useState<string>(activeBankAccounts[0]?.id || '');
  const [paymentReference, setPaymentReference] = useState('');
  const [paymentPhoneUsed, setPaymentPhoneUsed] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopyToClipboard = (text: string, key: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2500);
    } catch {
      // Fallback
    }
  };

  const [affiliateCode, setAffiliateCode] = useState(affiliateRefCode || '');
  const [hasError, setHasError] = useState<string | null>(null);

  // Sync if affiliateRefCode changes or when modal is opened
  useEffect(() => {
    if (affiliateRefCode && isOpen) {
      setAffiliateCode(affiliateRefCode.trim().toUpperCase());
    }
  }, [affiliateRefCode, isOpen]);

  // Sync if currentUser changes
  useEffect(() => {
    if (currentUser) {
      if (!fullName) setFullName(currentUser.name);
      if (!phone) setPhone(currentUser.phone);
      if (!neighborhood && currentUser.defaultNeighborhood) setNeighborhood(currentUser.defaultNeighborhood);
      if (!streetAddress && currentUser.defaultStreetAddress) setStreetAddress(currentUser.defaultStreetAddress);
      if (!referencePoint && currentUser.defaultReferencePoint) setReferencePoint(currentUser.defaultReferencePoint);
    }
  }, [currentUser]);

  if (!isOpen) return null;

  // Validate affiliate in real-time
  const cleanAffiliateInput = affiliateCode.trim().toUpperCase();
  const matchedAffiliate = cleanAffiliateInput 
    ? users.find(u => u.role === 'affiliate' && u.affiliateCode && u.affiliateCode.trim().toUpperCase() === cleanAffiliateInput)
    : null;

  // Handle in-checkout customer login
  const handleQuickLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginFeedback(null);
    const target = loginPhoneOrEmail.trim().toLowerCase();
    const cleanTargetPhone = target.replace(/[^0-9]/g, '');

    const found = users.find(u => {
      const uEmail = (u.email || '').toLowerCase();
      const uPhone = (u.phone || '').replace(/[^0-9]/g, '');
      return (
        (uEmail && uEmail === target) ||
        (cleanTargetPhone.length >= 6 && uPhone.includes(cleanTargetPhone))
      );
    });

    if (!found) {
      setLoginFeedback('Conta não encontrada com este telefone/e-mail.');
      return;
    }

    if (found.password && loginPasswordInput && found.password !== loginPasswordInput) {
      setLoginFeedback('Palavra-passe incorreta. Tente novamente.');
      return;
    }

    if (onLoginUser) {
      onLoginUser(found);
    }
    setFullName(found.name);
    setPhone(found.phone);
    if (found.defaultNeighborhood) setNeighborhood(found.defaultNeighborhood);
    if (found.defaultStreetAddress) setStreetAddress(found.defaultStreetAddress);
    if (found.defaultReferencePoint) setReferencePoint(found.defaultReferencePoint);
    setLoginFeedback('Sessão iniciada com sucesso!');
  };

  // Calculate dynamic delivery fee based on selected type
  const effectiveDeliveryFee = deliveryType === 'porta'
    ? (selectedZone.deliveryFeeDoor ?? selectedZone.deliveryFee)
    : (selectedZone.deliveryFeeBusStop ?? Math.round(selectedZone.deliveryFee * 0.6));

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const total = subtotal + effectiveDeliveryFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasError(null);

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setHasError('Sem ligação à internet. Por favor conecte os dados móveis ou Wi-Fi para que a encomenda seja registada na base de dados na nuvem do AngolaMarket.');
      return;
    }

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

    if (paymentMethod === 'multicaixa_express' && !paymentPhoneUsed.trim()) {
      setHasError('Por favor informe o seu número de telemóvel ou código de operação com que realizou o pagamento por Multicaixa Express.');
      return;
    }

    if (paymentMethod === 'transferencia_bancaria' && !paymentReference.trim()) {
      setHasError('Por favor informe o número de referência ou identificador do comprovativo da sua transferência bancária.');
      return;
    }

    const selectedBankObj = activeBankAccounts.find(b => b.id === selectedIbanId) || activeBankAccounts[0];
    const selectedExpressObj = activeExpressAccounts[0];

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
      paymentReference: paymentMethod === 'transferencia_bancaria' ? paymentReference.trim() : undefined,
      paymentPhoneUsed: (paymentMethod === 'multicaixa_express' || paymentMethod === 'express_transferencia') ? paymentPhoneUsed.trim() : undefined,
      selectedIbanId: paymentMethod === 'transferencia_bancaria' ? selectedBankObj?.id : undefined,
      selectedIbanDetails: (paymentMethod === 'transferencia_bancaria' && selectedBankObj) ? `${selectedBankObj.bankName}: ${selectedBankObj.iban}` : undefined,
      selectedExpressPhone: (paymentMethod === 'multicaixa_express' || paymentMethod === 'express_transferencia') ? (selectedExpressObj?.phone || '938243909') : undefined,
      affiliateCodeUsed: affiliateCode.trim() || undefined,
    };

    const newCustomerAccount = !currentUser ? {
      name: fullName.trim(),
      phone: phone.trim(),
      password: clientPassword || '123456',
      email: clientEmail.trim() || undefined,
    } : undefined;

    onSubmitOrder(customerInfo, newCustomerAccount);
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

          {/* Section 1: Customer Contact & Client Account */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-stone-100">
              <div className="flex items-center gap-2 text-sm font-bold text-stone-900">
                <User className="w-4 h-4 text-red-600" />
                <span>1. Dados de Contacto & Conta de Cliente</span>
              </div>
              <span className="text-[11px] font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
                Obrigatório p/ Acompanhamento
              </span>
            </div>

            {/* Account Status / Creation Box */}
            {currentUser ? (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <span className="text-xs text-emerald-950 font-bold block">
                      Sessão Iniciada como Cliente: {currentUser.name} ({currentUser.phone})
                    </span>
                    <span className="text-[11px] text-emerald-700">
                      O seu pedido será automaticamente associado à sua conta para acompanhar o percurso da entrega.
                    </span>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full shrink-0">
                  Conta Ativa
                </span>
              </div>
            ) : (
              <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-3xl space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-black text-stone-900 flex items-center gap-1.5">
                      <UserPlus className="w-4 h-4 text-amber-700" />
                      <span>Conta de Cliente Obrigatória para Acompanhar o Pedido</span>
                    </h4>
                    <p className="text-[11px] text-stone-600 mt-0.5">
                      Para acompanhar o estado do seu pedido e o percurso do estafeta em tempo real na plataforma, crie a sua conta gratuita ou inicie sessão.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 p-1 bg-amber-100/70 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => { setAccountMode('create'); setLoginFeedback(null); }}
                    className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      accountMode === 'create' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Criar Nova Conta
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAccountMode('login'); setLoginFeedback(null); }}
                    className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      accountMode === 'login' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Já Tenho Conta (Entrar)
                  </button>
                </div>

                {accountMode === 'create' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="space-y-1">
                      <label className="text-[11px] text-stone-700 font-bold flex items-center gap-1">
                        <Lock className="w-3 h-3 text-stone-500" />
                        <span>Definir Palavra-passe (Senha) *</span>
                      </label>
                      <input
                        type="text"
                        value={clientPassword}
                        onChange={(e) => setClientPassword(e.target.value)}
                        placeholder="Ex: 123456"
                        className="w-full bg-white border border-stone-200 rounded-2xl px-3.5 py-2 text-xs text-stone-900 font-mono focus:outline-none focus:border-red-500"
                      />
                      <span className="text-[10px] text-stone-500">Usará o seu telefone e esta senha para entrar na conta</span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] text-stone-700 font-bold">E-mail do Cliente (Opcional)</label>
                      <input
                        type="email"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        placeholder="seu@email.com"
                        className="w-full bg-white border border-stone-200 rounded-2xl px-3.5 py-2 text-xs text-stone-900 focus:outline-none focus:border-red-500"
                      />
                      <span className="text-[10px] text-stone-500">Para envio do comprovativo da compra</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 pt-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <input
                        type="text"
                        value={loginPhoneOrEmail}
                        onChange={(e) => setLoginPhoneOrEmail(e.target.value)}
                        placeholder="Telefone (ex: 923...) ou e-mail"
                        className="bg-white border border-stone-200 rounded-2xl px-3.5 py-2 text-xs text-stone-900 focus:outline-none focus:border-red-500"
                      />
                      <input
                        type="password"
                        value={loginPasswordInput}
                        onChange={(e) => setLoginPasswordInput(e.target.value)}
                        placeholder="Palavra-passe da conta"
                        className="bg-white border border-stone-200 rounded-2xl px-3.5 py-2 text-xs text-stone-900 font-mono focus:outline-none focus:border-red-500"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={handleQuickLogin}
                        className="px-4 py-2 bg-stone-900 hover:bg-black text-white text-xs font-bold rounded-2xl flex items-center gap-1.5 cursor-pointer"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        <span>Entrar e Preencher Dados</span>
                      </button>
                      {loginFeedback && (
                        <span className="text-xs font-bold text-amber-800">{loginFeedback}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

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
                  placeholder="Digite o seu bairro, condomínio ou município em Luanda..."
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
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs text-stone-700 font-bold flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-blue-600" />
                    <span>Código de Afiliado / Divulgador</span>
                  </div>
                  {matchedAffiliate ? (
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      ✓ Afiliado Reconhecido
                    </span>
                  ) : affiliateRefCode && cleanAffiliateInput === affiliateRefCode.trim().toUpperCase() ? (
                    <span className="text-[10px] text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                      ✓ Vinculado pelo Link
                    </span>
                  ) : null}
                </label>
                <input
                  type="text"
                  value={affiliateCode}
                  onChange={(e) => setAffiliateCode(e.target.value.toUpperCase())}
                  placeholder="Ex: TERESA-01 (se indicado por um divulgador)"
                  className={`w-full bg-stone-50 border rounded-2xl px-3.5 py-2.5 text-xs text-stone-900 uppercase font-mono placeholder-stone-400 focus:outline-none transition-all ${
                    matchedAffiliate || (affiliateRefCode && cleanAffiliateInput === affiliateRefCode.trim().toUpperCase())
                      ? 'border-emerald-500 bg-emerald-50/30'
                      : cleanAffiliateInput
                      ? 'border-amber-400 bg-amber-50/20'
                      : 'border-stone-200 focus:border-blue-500'
                  }`}
                />
                {matchedAffiliate ? (
                  <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      Afiliado Validado: <strong>{matchedAffiliate.name}</strong> ({matchedAffiliate.affiliateCode}) — comissão de venda garantida nesta compra!
                    </span>
                  </div>
                ) : affiliateRefCode && cleanAffiliateInput === affiliateRefCode.trim().toUpperCase() ? (
                  <div className="p-2.5 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>
                      Código <strong>{cleanAffiliateInput}</strong> preenchido automaticamente através do link de divulgação!
                    </span>
                  </div>
                ) : cleanAffiliateInput ? (
                  <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Código "{cleanAffiliateInput}" não encontrado. Se não foi indicado, pode deixar este campo em branco.</span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {/* Section 3: Payment Method Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-stone-100">
              <div className="flex items-center gap-2 text-sm font-bold text-stone-900">
                <Banknote className="w-4 h-4 text-emerald-600" />
                <span>3. Forma de Pagamento</span>
              </div>
              <span className="text-[11px] font-semibold text-stone-500">
                Escolha a sua preferência
              </span>
            </div>

            {/* 3 Payment Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Option 1: Dinheiro Físico na Entrega */}
              <button
                type="button"
                onClick={() => setPaymentMethod('dinheiro_entrega')}
                className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                  paymentMethod === 'dinheiro_entrega'
                    ? 'bg-emerald-50/70 border-emerald-500 text-stone-900 shadow-sm ring-2 ring-emerald-400/40'
                    : 'bg-stone-50 border-stone-200 text-stone-600 hover:border-stone-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Banknote className={`w-5 h-5 ${paymentMethod === 'dinheiro_entrega' ? 'text-emerald-600' : 'text-stone-400'}`} />
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      Na Entrega
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-stone-900">Dinheiro Físico</h4>
                  <p className="text-[11px] text-stone-500 mt-1 leading-snug">
                    Pague em notas físicas de Kwanzas ao estafeta no ato de entrega.
                  </p>
                </div>
                <span className="text-[10px] text-amber-700 font-medium mt-2 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 block">
                  Sem TPA na entrega
                </span>
              </button>

              {/* Option 2: Multicaixa Express (Pela Plataforma) */}
              <button
                type="button"
                onClick={() => setPaymentMethod('multicaixa_express')}
                className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                  paymentMethod === 'multicaixa_express' || paymentMethod === 'express_transferencia'
                    ? 'bg-blue-50/70 border-blue-500 text-stone-900 shadow-sm ring-2 ring-blue-400/40'
                    : 'bg-stone-50 border-stone-200 text-stone-600 hover:border-stone-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Smartphone className={`w-5 h-5 ${paymentMethod === 'multicaixa_express' || paymentMethod === 'express_transferencia' ? 'text-blue-600' : 'text-stone-400'}`} />
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                      Pela Plataforma
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-stone-900">Multicaixa Express</h4>
                  <p className="text-[11px] text-stone-500 mt-1 leading-snug">
                    Pague diretamente pelo app Express antes do envio da encomenda.
                  </p>
                </div>
                <span className="text-[10px] text-blue-700 font-medium mt-2 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 block">
                  Envio Prioritário
                </span>
              </button>

              {/* Option 3: Transferência Bancária / IBAN */}
              <button
                type="button"
                onClick={() => setPaymentMethod('transferencia_bancaria')}
                className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                  paymentMethod === 'transferencia_bancaria'
                    ? 'bg-purple-50/70 border-purple-500 text-stone-900 shadow-sm ring-2 ring-purple-400/40'
                    : 'bg-stone-50 border-stone-200 text-stone-600 hover:border-stone-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Building2 className={`w-5 h-5 ${paymentMethod === 'transferencia_bancaria' ? 'text-purple-600' : 'text-stone-400'}`} />
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                      Pela Plataforma
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-stone-900">Transferência / IBAN</h4>
                  <p className="text-[11px] text-stone-500 mt-1 leading-snug">
                    Transfira para as contas oficiais da loja (BAI, BFA, etc.) antes da entrega.
                  </p>
                </div>
                <span className="text-[10px] text-purple-700 font-medium mt-2 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200 block">
                  Comprovativo Online
                </span>
              </button>
            </div>

            {/* Payment Details Panel 1: Dinheiro Físico */}
            {paymentMethod === 'dinheiro_entrega' && (
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3 animate-in fade-in duration-200">
                <div className="flex items-start gap-2.5 text-xs text-amber-900 bg-amber-50 p-3 rounded-xl border border-amber-200">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-amber-950">Atenção sobre pagamento na entrega:</strong>
                    <span>O estafeta recebe <strong>exclusivamente notas físicas de Kwanzas</strong>. O estafeta <strong>NÃO transporta terminal TPA</strong>. Se preferir pagar digitalmente, selecione Multicaixa Express ou Transferência Bancária acima.</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-stone-800 block">
                    Precisa que o estafeta leve troco para quanto?
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

                  <div className="pt-1">
                    <input
                      type="number"
                      value={customChangeInput}
                      onChange={(e) => {
                        setCustomChangeInput(e.target.value);
                        setNeedChangeFor(e.target.value ? Number(e.target.value) : undefined);
                      }}
                      placeholder="Ou digite outro valor para troco em Kz..."
                      className="w-full sm:w-64 px-3 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none bg-white font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Payment Details Panel 2: Multicaixa Express (Pela Plataforma) */}
            {(paymentMethod === 'multicaixa_express' || paymentMethod === 'express_transferencia') && (
              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200 space-y-3.5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-blue-600" />
                    Pagamento via Multicaixa Express (Antes da Entrega)
                  </span>
                  <span className="text-[11px] font-bold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full">
                    Total: {formatKwanzas(total)}
                  </span>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">
                  Envie o valor de <strong>{formatKwanzas(total)}</strong> para o número de telemóvel Express oficial da loja abaixo:
                </p>

                {/* Express Accounts List */}
                <div className="space-y-2">
                  {activeExpressAccounts.map((acc) => (
                    <div 
                      key={acc.id}
                      className="p-3.5 rounded-xl bg-white border border-blue-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-base font-black font-mono text-blue-900 tracking-wide">
                            {acc.phone.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')}
                          </span>
                          <span className="text-[10px] uppercase font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                            {acc.bankName || 'MCX Express'}
                          </span>
                        </div>
                        <div className="text-xs text-stone-600">
                          Titular: <strong>{acc.accountHolder}</strong>
                        </div>
                        {acc.notes && (
                          <div className="text-[11px] text-stone-400">
                            {acc.notes}
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCopyToClipboard(acc.phone, `exp_${acc.id}`)}
                        className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          copiedKey === `exp_${acc.id}`
                            ? 'bg-emerald-600 text-white'
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                        }`}
                      >
                        {copiedKey === `exp_${acc.id}` ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copiar Número</span>
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>

                {/* Customer Proof / Confirmation Phone Input */}
                <div className="pt-2 border-t border-blue-200/60 space-y-1.5">
                  <label className="text-xs font-bold text-stone-800 flex items-center justify-between">
                    <span>O seu Telemóvel ou Código da Operação Express: <span className="text-red-500">*</span></span>
                    <span className="text-[10px] text-stone-400 font-normal">Para rápida reconciliação</span>
                  </label>
                  <input
                    type="text"
                    value={paymentPhoneUsed}
                    onChange={(e) => setPaymentPhoneUsed(e.target.value)}
                    placeholder="Ex: 923 000 000 ou cód. da operação gerado no app"
                    className="w-full px-3.5 py-2.5 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white font-mono"
                  />
                  <span className="text-[11px] text-stone-500 block">
                    Após submeter o pedido, nossa central confere a transação e despacha a encomenda de imediato com o estafeta.
                  </span>
                </div>
              </div>
            )}

            {/* Payment Details Panel 3: Transferência Bancária / IBAN */}
            {paymentMethod === 'transferencia_bancaria' && (
              <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-200 space-y-3.5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-purple-600" />
                    Contas Bancárias Oficiais (Transferência antes do Envio)
                  </span>
                  <span className="text-[11px] font-bold text-purple-800 bg-purple-100 px-2.5 py-0.5 rounded-full">
                    Total: {formatKwanzas(total)}
                  </span>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">
                  Efetue a transferência de <strong>{formatKwanzas(total)}</strong> para um dos IBANs oficiais abaixo:
                </p>

                {/* Bank Accounts List */}
                <div className="space-y-2.5">
                  {activeBankAccounts.map((acc) => (
                    <div 
                      key={acc.id}
                      onClick={() => setSelectedIbanId(acc.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                        selectedIbanId === acc.id
                          ? 'bg-white border-purple-400 shadow-sm ring-1 ring-purple-300'
                          : 'bg-white/80 border-stone-200 hover:border-purple-200'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black uppercase text-purple-900 bg-purple-100 px-2 py-0.5 rounded">
                              {acc.bankName}
                            </span>
                            <span className="text-xs text-stone-700">
                              Titular: <strong>{acc.accountHolder}</strong>
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-stone-900 select-all">
                              {acc.iban}
                            </span>
                          </div>

                          {acc.notes && (
                            <span className="text-[11px] text-stone-400 block">
                              {acc.notes}
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyToClipboard(acc.iban.replace(/\s+/g, ''), `iban_${acc.id}`);
                          }}
                          className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            copiedKey === `iban_${acc.id}`
                              ? 'bg-emerald-600 text-white'
                              : 'bg-purple-700 hover:bg-purple-800 text-white shadow-xs'
                          }`}
                        >
                          {copiedKey === `iban_${acc.id}` ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>IBAN Copiado!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copiar IBAN</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bank Reference Input */}
                <div className="pt-2 border-t border-purple-200/60 space-y-1.5">
                  <label className="text-xs font-bold text-stone-800 flex items-center justify-between">
                    <span>Nº do Comprovativo ou Referência da Transferência: <span className="text-red-500">*</span></span>
                    <span className="text-[10px] text-stone-400 font-normal">Ex: Ref BAI / BFA Net</span>
                  </label>
                  <input
                    type="text"
                    value={paymentReference}
                    onChange={(e) => setPaymentReference(e.target.value)}
                    placeholder="Insira o número da operação ou referência do comprovativo..."
                    className="w-full px-3.5 py-2.5 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white font-mono"
                  />
                  <span className="text-[11px] text-stone-500 block">
                    Após a submissão, nossa equipa financeira valida o comprovativo e o estafeta segue com a sua encomenda.
                  </span>
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

