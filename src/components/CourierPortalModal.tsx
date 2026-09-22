import React, { useState, useEffect } from 'react';
import { 
  X, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  AlertCircle, 
  KeyRound, 
  DollarSign, 
  ShieldCheck, 
  Check, 
  CheckCircle,
  ExternalLink, 
  Navigation, 
  Home, 
  LayoutDashboard, 
  Wallet, 
  Layers, 
  User, 
  CreditCard, 
  Banknote, 
  Send,
  Camera,
  Upload,
  Building2,
  Smartphone,
  AlertTriangle
} from 'lucide-react';
import { AppUser, Order, OrderStatus, CourierTab, PayoutRequest, CourierSettlement } from '../types';
import { formatKwanzas, COURIER_COMMISSION_PER_DELIVERY_AOA } from '../data/mockData';
import { compressImageFile } from '../utils/imageOptimizer';

interface CourierPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AppUser;
  orders: Order[];
  payoutRequests?: PayoutRequest[];
  onRequestPayout?: (request: Omit<PayoutRequest, 'id' | 'requestedAt' | 'status'>) => void;
  onCompleteDelivery: (orderId: string, enteredPin?: string) => boolean;
  onUpdateCourierProfile?: (updatedUser: AppUser) => void;
  courierSettlements?: CourierSettlement[];
  onNotifySettlement?: (settlement: Omit<CourierSettlement, 'id' | 'submittedAt' | 'status'>) => void;
  initialTab?: CourierTab;
}

export const CourierPortalModal: React.FC<CourierPortalModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  orders,
  payoutRequests = [],
  onRequestPayout,
  onCompleteDelivery,
  onUpdateCourierProfile,
  courierSettlements = [],
  onNotifySettlement,
  initialTab = 'pedidos'
}) => {
  const [activeTab, setActiveTab] = useState<CourierTab>(initialTab);
  const [deliverySuccess, setDeliverySuccess] = useState<{ [orderId: string]: string }>({});

  // Profile states
  const [courierName, setCourierName] = useState(currentUser.name || '');
  const [courierPhone, setCourierPhone] = useState(currentUser.phone || '');
  const [courierAvatar, setCourierAvatar] = useState(currentUser.avatar || '');
  const [courierVehicle, setCourierVehicle] = useState(currentUser.vehicle || 'Moto');
  const [courierPlate, setCourierPlate] = useState(currentUser.licensePlate || '');
  const [courierIban, setCourierIban] = useState(currentUser.iban || '');
  const [courierBank, setCourierBank] = useState(currentUser.bankName || '');
  const [courierExpress, setCourierExpress] = useState(currentUser.multicaixaExpressPhone || currentUser.phone || '');
  const [profileSaved, setProfileSaved] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setCourierName(currentUser.name || '');
      setCourierPhone(currentUser.phone || '');
      setCourierAvatar(currentUser.avatar || '');
      setCourierVehicle(currentUser.vehicle || 'Moto');
      setCourierPlate(currentUser.licensePlate || '');
      setCourierIban(currentUser.iban || '');
      setCourierBank(currentUser.bankName || '');
      setCourierExpress(currentUser.multicaixaExpressPhone || currentUser.phone || '');
    }
  }, [currentUser, isOpen]);

  const handleCourierAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await compressImageFile(file, 400, 400, 0.85);
      setCourierAvatar(res);
    } catch {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setCourierAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Settlement with Admin
  const [depositSettled, setDepositSettled] = useState(false);
  const [settleAmount, setSettleAmount] = useState('');
  const [settleMethod, setSettleMethod] = useState<'dinheiro_escritorio' | 'transferencia_iban'>('dinheiro_escritorio');
  const [settleNotes, setSettleNotes] = useState('');
  
  // Payout request states
  const [courierPayoutAmount, setCourierPayoutAmount] = useState('');
  const [courierPayoutMethod, setCourierPayoutMethod] = useState<'multicaixa_express' | 'transferencia_iban'>('multicaixa_express');
  const [courierPayoutRequested, setCourierPayoutRequested] = useState(false);
  const [courierPayoutError, setCourierPayoutError] = useState('');

  const MIN_COURIER_PAYOUT = 500;

  if (!isOpen) return null;

  const isPending = currentUser.courierStatus === 'pendente';
  const isApproved = currentUser.courierStatus === 'aprovado';

  // Orders assigned to this courier or active for Luanda
  const assignedOrders = orders.filter((o) => {
    if (o.assignedCourierId === currentUser.id) return true;
    if (o.courier?.phone && currentUser.phone && o.courier.phone.replace(/[^0-9]/g, '') === currentUser.phone.replace(/[^0-9]/g, '')) return true;
    if (!o.assignedCourierId && o.status !== 'entregue' && o.status !== 'cancelado') return true;
    return false;
  });

  const completedDeliveries = orders.filter(
    (o) => (o.assignedCourierId === currentUser.id || o.courier?.phone === currentUser.phone) && o.status === 'entregue'
  );

  const totalCompletedDeliveriesCount = (currentUser.totalDeliveriesCompleted ?? 0);
  const totalEarnedDeliveryFees = currentUser.courierBalanceAOA !== undefined 
    ? currentUser.courierBalanceAOA 
    : (totalCompletedDeliveriesCount * COURIER_COMMISSION_PER_DELIVERY_AOA);

  const cashCollectedFromCustomers = (currentUser.cashCollectedToDeposit ?? 0);

  const handleConfirmDelivery = (orderId: string) => {
    const success = onCompleteDelivery(orderId);
    if (success) {
      setDeliverySuccess({ ...deliverySuccess, [orderId]: 'Entrega confirmada com sucesso! Pagamento registado.' });
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateCourierProfile) {
      onUpdateCourierProfile({
        ...currentUser,
        name: courierName,
        phone: courierPhone,
        avatar: courierAvatar,
        vehicle: courierVehicle,
        licensePlate: courierPlate,
        iban: courierIban,
        bankName: courierBank,
        multicaixaExpressPhone: courierExpress
      });
    }
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const handleSettleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(settleAmount) || cashCollectedFromCustomers;
    if (amt <= 0) return;

    if (onNotifySettlement) {
      onNotifySettlement({
        courierId: currentUser.id,
        courierName: currentUser.name || 'Estafeta Oficial',
        courierPhone: currentUser.phone || '',
        amountAOA: amt,
        paymentMethod: settleMethod,
        notes: settleNotes || undefined
      });
    }

    setDepositSettled(true);
    setSettleAmount('');
    setSettleNotes('');
    setTimeout(() => setDepositSettled(false), 4000);
  };

  const handleCourierRequestPayout = (e: React.FormEvent) => {
    e.preventDefault();
    setCourierPayoutError('');

    if (totalEarnedDeliveryFees < MIN_COURIER_PAYOUT) {
      setCourierPayoutError(`Saque Indisponível: Saldo insuficiente. O valor mínimo para solicitar saque é de ${formatKwanzas(MIN_COURIER_PAYOUT)}. O seu saldo atual é de ${formatKwanzas(totalEarnedDeliveryFees)}.`);
      return;
    }

    const amountNum = Number(courierPayoutAmount) || totalEarnedDeliveryFees;
    if (amountNum < MIN_COURIER_PAYOUT) {
      setCourierPayoutError(`O valor mínimo para solicitação de saque é de ${formatKwanzas(MIN_COURIER_PAYOUT)}.`);
      return;
    }

    if (amountNum > totalEarnedDeliveryFees) {
      setCourierPayoutError(`Saldo insuficiente. Você possui apenas ${formatKwanzas(totalEarnedDeliveryFees)} disponíveis para saque.`);
      return;
    }

    if (onRequestPayout) {
      onRequestPayout({
        type: 'entregador',
        requesterId: currentUser.id,
        requesterName: currentUser.name || 'Estafeta Oficial',
        requesterRole: `Entregador Oficial (${currentUser.vehicle || 'Moto Luanda'})`,
        amountAOA: amountNum,
        feeAmount: 0,
        netAmount: amountNum,
        paymentMethod: courierPayoutMethod,
        multicaixaExpressPhone: courierExpress || currentUser.phone,
        iban: courierIban,
        bankName: 'BAI / BFA / BIC / Atlântico',
        accountHolder: currentUser.name || 'Estafeta Luanda'
      });
    }

    setCourierPayoutRequested(true);
    setCourierPayoutError('');
    setTimeout(() => {
      setCourierPayoutRequested(false);
      setCourierPayoutAmount('');
    }, 3500);
  };

  // Filter payout requests for this courier
  const myCourierPayoutRequests = payoutRequests.filter(
    (p) => p.requesterId === currentUser.id || p.type === 'entregador'
  );

  const navTabs: { tab: CourierTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { tab: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { tab: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { tab: 'carteira', label: 'Carteira', icon: <Wallet className="w-4 h-4" /> },
    { tab: 'pedidos', label: 'Pedidos', icon: <Layers className="w-4 h-4" />, badge: assignedOrders.filter(o => o.status !== 'entregue').length },
    { tab: 'perfil', label: 'Perfil', icon: <User className="w-4 h-4" /> },
  ];

  return (
    <div 
      id="courier-portal-modal"
      className="fixed inset-0 z-50 bg-stone-100 flex flex-col w-screen h-screen overflow-hidden text-stone-900 animate-in fade-in"
    >
      <div className="flex flex-col w-full h-full bg-white overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3 border-b border-stone-200 bg-white sticky top-0 z-20 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500 text-stone-950 shadow-xs">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-base sm:text-lg text-stone-900 leading-none">Portal do Estafeta</h2>
                <span className={`text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                  isApproved 
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                    : 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse'
                }`}>
                  {isApproved ? '✓ Aprovado' : '⏳ Em Análise'}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 mt-0.5">
                {currentUser.name} • {currentUser.vehicle || 'Moto'} ({currentUser.licensePlate || 'Luanda'})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-stone-100 text-stone-700 hover:bg-amber-50 hover:text-amber-800 transition-colors font-bold text-xs cursor-pointer border border-stone-200"
          >
            <span>Voltar à Loja</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 5 Tabs Bar */}
        <div className="px-3 sm:px-6 py-2 border-b border-stone-200 bg-stone-50 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {navTabs.map((t) => {
            const isActive = activeTab === t.tab;
            return (
              <button
                key={t.tab}
                onClick={() => setActiveTab(t.tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  isActive 
                    ? 'bg-amber-500 text-stone-950 shadow-xs font-black' 
                    : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-200'
                }`}
              >
                {t.icon}
                <span>{t.label}</span>
                {t.badge !== undefined && t.badge > 0 && (
                  <span className="w-4 h-4 rounded-full bg-red-600 text-white font-black text-[10px] flex items-center justify-center animate-pulse">
                    {t.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Status Notification if Pending */}
        {isPending && (
          <div className="mx-4 sm:mx-6 mt-3 p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Conta de Entregador em Análise</p>
              <p className="text-amber-800 text-[11px] mt-0.5">
                A sua conta foi registada e aguarda a aprovação do Administrador.
              </p>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 bg-stone-50/50">

          {/* TAB 1: HOME */}
          {activeTab === 'home' && (
            <div className="space-y-4">
              {/* Compact Executive Status Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-stone-900 text-stone-950 shadow-xs relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] uppercase font-black tracking-wider bg-stone-950 text-white px-2 py-0.5 rounded inline-block">
                      Estafeta Luanda
                    </span>
                    <span className="text-[9px] uppercase font-black tracking-wider bg-emerald-500 text-stone-950 px-2 py-0.5 rounded inline-block">
                      1.000 Kz / Entrega
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-stone-950">
                    Pronto para a Rota, {currentUser.name.split(' ')[0]}?
                  </h3>
                  <p className="text-xs text-stone-900 max-w-xl font-medium">
                    Cobrança no ato da entrega (Multicaixa Express ou Dinheiro). Ganho fixo garantido por cada entrega bem-sucedida.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    onClick={() => setActiveTab('pedidos')}
                    className="px-3.5 py-2 rounded-xl bg-stone-950 text-white font-bold text-xs shadow-xs hover:bg-stone-900 cursor-pointer flex items-center gap-1.5"
                  >
                    <Layers className="w-3.5 h-3.5 text-amber-400" />
                    <span>Entregas ({assignedOrders.filter(o => o.status !== 'entregue').length})</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('carteira')}
                    className="px-3.5 py-2 rounded-xl bg-white text-stone-900 font-bold text-xs hover:bg-stone-100 cursor-pointer flex items-center gap-1.5"
                  >
                    <Wallet className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Ganhos ({formatKwanzas(totalEarnedDeliveryFees)})</span>
                  </button>
                </div>
              </div>

              {/* Status Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3.5">
                <div 
                  onClick={() => setActiveTab('pedidos')}
                  className="p-3.5 sm:p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs hover:border-amber-400 transition-all cursor-pointer space-y-1"
                >
                  <div className="flex items-center justify-between text-stone-500">
                    <span className="text-[10px] font-bold uppercase tracking-wide">Pacotes a Entregar</span>
                    <Layers className="w-4 h-4 text-amber-600" />
                  </div>
                  <span className="text-xl sm:text-2xl font-black font-mono text-stone-900 block">
                    {assignedOrders.filter(o => o.status !== 'entregue' && o.status !== 'cancelado').length}
                  </span>
                  <p className="text-[10px] text-stone-500 truncate">Encomendas ativas em Luanda</p>
                </div>

                <div 
                  onClick={() => setActiveTab('carteira')}
                  className="p-3.5 sm:p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs hover:border-amber-400 transition-all cursor-pointer space-y-1"
                >
                  <div className="flex items-center justify-between text-stone-500">
                    <span className="text-[10px] font-bold uppercase tracking-wide">Ganhos em Fretes</span>
                    <Wallet className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="text-xl sm:text-2xl font-black font-mono text-emerald-600 block">
                    {formatKwanzas(totalEarnedDeliveryFees)}
                  </span>
                  <p className="text-[10px] text-stone-500 truncate">Acumulado de entregas realizadas</p>
                </div>

                <div 
                  onClick={() => setActiveTab('historico')}
                  className="p-3.5 sm:p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs hover:border-amber-400 transition-all cursor-pointer space-y-1"
                >
                  <div className="flex items-center justify-between text-stone-500">
                    <span className="text-[10px] font-bold uppercase tracking-wide">Total Entregues</span>
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-xl sm:text-2xl font-black font-mono text-stone-900 block">
                    {completedDeliveries.length}
                  </span>
                  <p className="text-[10px] text-stone-500 truncate">Entregas pagas e verificadas</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-black text-base text-stone-900">Dashboard de Performance do Estafeta</h3>
                <p className="text-xs text-stone-500">Histórico de rotas concluídas, tempo médio de entrega e comissões por pacote</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-1">
                  <span className="text-[10px] uppercase font-bold text-stone-400">Entregas Realizadas</span>
                  <span className="text-2xl font-black font-mono text-stone-900 block">
                    {currentUser.totalDeliveriesCompleted ?? 0}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold">100% com sucesso</span>
                </div>

                <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-1">
                  <span className="text-[10px] uppercase font-bold text-stone-400">Comissão por Entrega</span>
                  <span className="text-2xl font-black font-mono text-emerald-600 block">1.000 Kz</span>
                  <span className="text-[10px] text-stone-500">Fixa por cada pacote</span>
                </div>

                <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-1">
                  <span className="text-[10px] uppercase font-bold text-stone-400">Tempo Médio de Rota</span>
                  <span className="text-2xl font-black font-mono text-stone-900 block">48 min</span>
                  <span className="text-[10px] text-stone-500">Entre despacho e entrega</span>
                </div>

                <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-1">
                  <span className="text-[10px] uppercase font-bold text-stone-400">Total Ganho em Comissões</span>
                  <span className="text-2xl font-black font-mono text-amber-600 block">
                    {formatKwanzas(totalEarnedDeliveryFees)}
                  </span>
                  <span className="text-[10px] text-stone-500 font-medium">({currentUser.totalDeliveriesCompleted ?? 0} × 1.000 Kz)</span>
                </div>
              </div>

              {/* Delivery Guidelines */}
              <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-3 text-xs text-stone-700">
                <h4 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Procedimento de Segurança na Entrega em Luanda</span>
                </h4>
                <ul className="space-y-2 text-stone-600">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-amber-600">•</span>
                    <span><strong>1. Conferência Visual:</strong> Permita que o cliente confira o selo da caixa ou artigo antes de efetuar o pagamento.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-amber-600">•</span>
                    <span><strong>2. Pagamento:</strong> Receba o montante exacto em Dinheiro físico ou confirme a transferência por Multicaixa Express.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-amber-600">•</span>
                    <span><strong>3. Conclusão da Ordem:</strong> Clique no botão "Confirmar Entrega Concluída" na aba de Pedidos após receber o valor e entregar os produtos para creditar automaticamente os seus 1.000 Kz.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: CARTEIRA */}
          {activeTab === 'carteira' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-black text-base text-stone-900">Carteira & Prestação de Contas</h3>
                <p className="text-xs text-stone-500">Controlo de comissões por entrega (1.000 Kz/entrega) e montantes em dinheiro físico</p>
              </div>

              {/* Remuneration Policy Banner */}
              <div className="p-4 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3 text-xs">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-emerald-950">Regra de Remuneração por Entrega</h4>
                  <p className="mt-0.5 text-emerald-800 leading-relaxed">
                    Você ganha <strong>1.000 Kz em cada entrega que fizer</strong>. Este valor sai do lucro da taxa de entrega paga pelo cliente. Quanto mais entregas realizar, maior será o seu rendimento!
                  </p>
                  <div className="mt-2 font-mono font-bold text-xs text-emerald-900 bg-emerald-100/80 px-3 py-1 rounded-xl inline-block border border-emerald-300">
                    Cálculo: {currentUser.totalDeliveriesCompleted ?? 0} entregas × 1.000 Kz = {formatKwanzas(totalEarnedDeliveryFees)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Earned fees */}
                <div className="p-6 rounded-3xl bg-stone-900 text-white shadow-md space-y-2">
                  <div className="flex items-center justify-between text-stone-400">
                    <span className="text-xs font-bold uppercase">Meus Ganhos em Fretes (Saldo)</span>
                    <Wallet className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span className="text-3xl font-black font-mono text-white block">
                    {formatKwanzas(totalEarnedDeliveryFees)}
                  </span>
                  <div className="text-xs text-stone-300 pt-1 space-y-0.5">
                    <p className="font-semibold text-emerald-400">1.000 Kz por entrega concluída</p>
                    <p>Transferido semanalmente para o seu IBAN / Multicaixa Express.</p>
                  </div>
                </div>

                {/* Cash on delivery collected to remit */}
                <div className="p-6 rounded-3xl bg-amber-50 border border-amber-300 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-amber-800">
                    <span className="text-xs font-bold uppercase">Dinheiro Físico Cobrado (A Entregar ao ADM)</span>
                    <Banknote className="w-5 h-5 text-amber-700" />
                  </div>
                  <span className="text-3xl font-black font-mono text-amber-950 block">
                    {formatKwanzas(cashCollectedFromCustomers)}
                  </span>
                  <p className="text-xs text-amber-800 pt-1">
                    Valor total cobrado em mão aos clientes para depósito ou prestação de contas.
                  </p>
                </div>
              </div>

              {/* Payout / Withdrawal Request for Couriers */}
              <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    <span>Solicitar Saque de Ganhos de Entrega ao ADM</span>
                  </h4>
                  <span className="text-[11px] font-bold text-stone-500">
                    Disponível: <strong className="text-emerald-600 font-mono">{formatKwanzas(totalEarnedDeliveryFees)}</strong>
                  </span>
                </div>

                {/* Insufficient balance notice */}
                {totalEarnedDeliveryFees < MIN_COURIER_PAYOUT && (
                  <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2.5">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                    <div>
                      <span className="font-black text-red-600 uppercase tracking-wide mr-1.5">[Indisponível]</span>
                      <span>Saldo insuficiente para efetuar levantamento. É necessário ter no mínimo <strong>{formatKwanzas(MIN_COURIER_PAYOUT)}</strong> acumulados de entregas (Seu saldo atual: <strong>{formatKwanzas(totalEarnedDeliveryFees)}</strong>).</span>
                    </div>
                  </div>
                )}

                {courierPayoutError && (
                  <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{courierPayoutError}</span>
                  </div>
                )}

                {courierPayoutRequested ? (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Solicitação de saque de {formatKwanzas(Number(courierPayoutAmount) || totalEarnedDeliveryFees)} enviada com sucesso! O Administrador irá processar e efetuar o pagamento na aba Gestão Financeira.</span>
                  </div>
                ) : (
                  <form onSubmit={handleCourierRequestPayout} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-stone-700">Valor do Saque (Kz) *</label>
                          <span className="text-[10px] text-stone-500 font-bold">Mínimo: {formatKwanzas(MIN_COURIER_PAYOUT)}</span>
                        </div>
                        <input
                          type="number"
                          required
                          disabled={totalEarnedDeliveryFees < MIN_COURIER_PAYOUT}
                          min={MIN_COURIER_PAYOUT}
                          max={totalEarnedDeliveryFees}
                          value={courierPayoutAmount}
                          onChange={(e) => {
                            setCourierPayoutAmount(e.target.value);
                            setCourierPayoutError('');
                          }}
                          placeholder={totalEarnedDeliveryFees >= MIN_COURIER_PAYOUT ? `${totalEarnedDeliveryFees}` : 'Saldo insuficiente'}
                          className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-3.5 py-2.5 text-xs font-mono font-bold text-stone-900 focus:outline-none focus:border-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-stone-700">Forma de Recebimento</label>
                        <select 
                          disabled={totalEarnedDeliveryFees < MIN_COURIER_PAYOUT}
                          value={courierPayoutMethod}
                          onChange={(e) => setCourierPayoutMethod(e.target.value as any)}
                          className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-3.5 py-2.5 text-xs text-stone-900 font-bold focus:outline-none focus:border-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="multicaixa_express">📱 Multicaixa Express ({courierExpress || currentUser.phone || '9XX XXX XXX'})</option>
                          <option value="transferencia_iban">🏦 Transferência Bancária IBAN ({courierIban ? courierIban.slice(0, 16) + '...' : 'IBAN'})</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                      <button
                        type="submit"
                        disabled={totalEarnedDeliveryFees < MIN_COURIER_PAYOUT}
                        className={`px-5 py-2.5 rounded-2xl font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 ${
                          totalEarnedDeliveryFees < MIN_COURIER_PAYOUT
                            ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                        }`}
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>
                          {totalEarnedDeliveryFees < MIN_COURIER_PAYOUT 
                            ? 'Indisponível (Saldo Insuficiente)' 
                            : 'Enviar Solicitação de Saque'}
                        </span>
                      </button>
                      <span className="text-[11px] text-stone-400">
                        O Administrador processará o pagamento diretamente
                      </span>
                    </div>
                  </form>
                )}
              </div>

              {/* Courier Payout History List */}
              <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-stone-500" />
                    <span>Histórico de Saques do Entregador</span>
                  </h4>
                  <span className="text-xs text-stone-500">{myCourierPayoutRequests.length} solicitações</span>
                </div>

                {myCourierPayoutRequests.length === 0 ? (
                  <p className="text-xs text-stone-400 py-3 text-center">Nenhum pedido de saque submetido ainda.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-stone-50 text-stone-400 uppercase text-[10px] border-b border-stone-200">
                        <tr>
                          <th className="py-2 px-3">Data</th>
                          <th className="py-2 px-3">Montante</th>
                          <th className="py-2 px-3">Método / Conta</th>
                          <th className="py-2 px-3">Comprovativo</th>
                          <th className="py-2 px-3 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {myCourierPayoutRequests.map((req) => (
                          <tr key={req.id}>
                            <td className="py-2.5 px-3 font-mono text-stone-600">{req.requestedAt}</td>
                            <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">{formatKwanzas(req.amountAOA)}</td>
                            <td className="py-2.5 px-3 text-stone-600">
                              {req.paymentMethod === 'multicaixa_express' 
                                ? `📱 Express (${req.multicaixaExpressPhone})`
                                : `🏦 IBAN (${req.iban?.slice(0, 16)}...)`}
                            </td>
                            <td className="py-2.5 px-3 font-mono text-stone-500 text-[11px]">
                              {req.transactionRef ? (
                                <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-lg border border-emerald-200 font-bold">
                                  {req.transactionRef}
                                </span>
                              ) : (
                                <span className="text-stone-400">-</span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                                req.status === 'pago'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : req.status === 'rejeitado'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-amber-100 text-amber-800 animate-pulse'
                              }`}>
                                {req.status === 'pago' && <CheckCircle2 className="w-3 h-3" />}
                                {req.status === 'pago' ? 'Pago' : req.status === 'rejeitado' ? 'Rejeitado' : 'Pendente ADM'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Settle cash form */}
              <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                  <div>
                    <h4 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                      <Send className="w-4 h-4 text-amber-600" />
                      <span>Notificar Prestação de Contas ao ADM</span>
                    </h4>
                    <p className="text-xs text-stone-500">
                      Envie o registo do dinheiro físico recolhido entregue no escritório ou transferido por IBAN.
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200">
                    A prestar: {formatKwanzas(cashCollectedFromCustomers)}
                  </span>
                </div>

                {depositSettled ? (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Notificação de prestação de contas enviada com sucesso! O ADM foi notificado no painel central.</span>
                  </div>
                ) : (
                  <form onSubmit={handleSettleDeposit} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-stone-700">Montante a Prestar Contas (Kz) *</label>
                        <input
                          type="number"
                          required
                          value={settleAmount}
                          onChange={(e) => setSettleAmount(e.target.value)}
                          placeholder={`Padrão: ${cashCollectedFromCustomers}`}
                          className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-3.5 py-2.5 text-xs font-mono font-bold text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500"
                        />
                        <span className="text-[10px] text-stone-500">Deixe em branco para usar o total a prestar ({formatKwanzas(cashCollectedFromCustomers)})</span>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-stone-700">Forma de Prestação *</label>
                        <select
                          value={settleMethod}
                          onChange={(e) => setSettleMethod(e.target.value as any)}
                          className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500"
                        >
                          <option value="dinheiro_escritorio">💵 Dinheiro Físico em Mãos (Escritório Central)</option>
                          <option value="transferencia_iban">🏦 Transferência Bancária / Depósito (IBAN Loja)</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-700">Observação / Comprovativo (Opcional)</label>
                      <input
                        type="text"
                        value={settleNotes}
                        onChange={(e) => setSettleNotes(e.target.value)}
                        placeholder="Ex: Entregue ao ADM Paulino às 17h, ou Ref. bancária..."
                        className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-3.5 py-2.5 text-xs text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={cashCollectedFromCustomers === 0 && (!settleAmount || Number(settleAmount) <= 0)}
                      className="px-6 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-stone-950 font-black text-xs shadow-sm cursor-pointer transition-all flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Notificar Prestação de Contas ao ADM</span>
                    </button>
                  </form>
                )}

                {/* Settlements list for this courier */}
                {courierSettlements.filter(s => s.courierId === currentUser.id).length > 0 && (
                  <div className="pt-3 border-t border-stone-100 space-y-2">
                    <span className="text-xs font-bold text-stone-700 block">Histórico de Prestações Notificadas</span>
                    <div className="border border-stone-200 rounded-2xl overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-stone-50 text-stone-500 text-[10px] uppercase font-bold border-b border-stone-200">
                          <tr>
                            <th className="py-2.5 px-3">Data</th>
                            <th className="py-2.5 px-3">Montante</th>
                            <th className="py-2.5 px-3">Método</th>
                            <th className="py-2.5 px-3">Estado</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                          {courierSettlements
                            .filter(s => s.courierId === currentUser.id)
                            .map((settle) => (
                              <tr key={settle.id} className="hover:bg-stone-50/50">
                                <td className="py-2 px-3 text-[11px] text-stone-600">
                                  {typeof settle.submittedAt === 'number'
                                    ? new Date(settle.submittedAt).toLocaleDateString('pt-AO')
                                    : settle.submittedAt}
                                </td>
                                <td className="py-2 px-3 font-mono font-bold text-stone-900">
                                  {formatKwanzas(settle.amountAOA)}
                                </td>
                                <td className="py-2 px-3 text-[11px] text-stone-600">
                                  {settle.paymentMethod === 'dinheiro_escritorio' ? '💵 Dinheiro Físico' : '🏦 IBAN'}
                                </td>
                                <td className="py-2 px-3">
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                                    settle.status === 'confirmado'
                                      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                      : settle.status === 'rejeitado'
                                      ? 'bg-red-100 text-red-800 border-red-200'
                                      : 'bg-amber-100 text-amber-800 border-amber-200'
                                  }`}>
                                    {settle.status === 'confirmado' ? 'Confirmado ADM' : settle.status === 'rejeitado' ? 'Rejeitado' : 'Pendente ADM'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: PEDIDOS */}
          {activeTab === 'pedidos' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-black text-base text-stone-900">Encomendas Atribuídas em Luanda</h3>
                  <p className="text-xs text-stone-500">Contacte os clientes e valide a entrega com o código PIN</p>
                </div>
                <span className="text-xs font-mono font-bold text-stone-600 bg-white px-3 py-1 rounded-xl border border-stone-200">
                  {assignedOrders.length} encomendas
                </span>
              </div>

              {assignedOrders.length === 0 ? (
                <div className="p-12 text-center bg-stone-50 border border-stone-200 rounded-3xl space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                  <p className="text-xs font-bold text-stone-700">Sem entregas pendentes neste momento.</p>
                  <p className="text-[11px] text-stone-500">Novas encomendas atribuídas pelo ADM aparecerão aqui.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {assignedOrders.map((ord) => {
                    const isDelivered = ord.status === 'entregue';
                    return (
                      <div 
                        key={ord.id}
                        className={`p-5 rounded-3xl border transition-all space-y-4 ${
                          isDelivered 
                            ? 'bg-emerald-50/40 border-emerald-200 opacity-85' 
                            : 'bg-white border-stone-200 shadow-md'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-xs text-stone-900">{ord.orderNumber}</span>
                            <span className="text-[10px] bg-stone-100 text-stone-700 font-bold px-2 py-0.5 rounded-md border border-stone-200">
                              {ord.status.toUpperCase()}
                            </span>
                          </div>

                          <span className={`font-mono font-black text-sm ${
                            ord.customer.paymentMethod === 'dinheiro_entrega' ? 'text-red-600' : 'text-emerald-600'
                          }`}>
                            {formatKwanzas(ord.total)} {ord.customer.paymentMethod === 'dinheiro_entrega' ? '(A Cobrar em Dinheiro)' : '(Já Pago na Plataforma)'}
                          </span>
                        </div>

                        {/* Customer details & address */}
                        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-stone-900">{ord.customer.fullName}</span>
                            <a
                              href={`tel:${ord.customer.phone}`}
                              className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              <span>Ligar: {ord.customer.phone}</span>
                            </a>
                          </div>

                          <div className="flex items-start gap-1.5 text-stone-700">
                            <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                            <div className="space-y-1 w-full">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-stone-900">
                                  {ord.customer.neighborhood}, {ord.customer.municipalityName.split('(')[0]}
                                </span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 ${
                                  ord.customer.deliveryType === 'paragem'
                                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                    : 'bg-red-100 text-red-800 border-red-200'
                                }`}>
                                  {ord.customer.deliveryType === 'paragem' ? (
                                    <>
                                      <Navigation className="w-3 h-3 text-emerald-700" />
                                      <span>🚏 Entrega na Paragem</span>
                                    </>
                                  ) : (
                                    <>
                                      <Home className="w-3 h-3 text-red-700" />
                                      <span>🏠 Entrega à Porta de Casa</span>
                                    </>
                                  )}
                                </span>
                              </div>

                              {ord.customer.deliveryType === 'paragem' && ord.customer.busStopName && (
                                <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-1.5">
                                  <Navigation className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                                  <span>Ponto de Encontro na Paragem: <strong>{ord.customer.busStopName}</strong></span>
                                </div>
                              )}

                              <span className="text-stone-600 block">{ord.customer.streetAddress}</span>
                              <span className="text-stone-500 block text-[11px] mt-0.5">
                                📍 Ponto de Referência: <strong>{ord.customer.referencePoint}</strong>
                              </span>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                            <span className="text-stone-500">
                              Forma de Pagamento:{' '}
                              <strong className="text-stone-900">
                                {ord.customer.paymentMethod === 'dinheiro_entrega' && '💵 Dinheiro Físico na Entrega (sem TPA)'}
                                {(ord.customer.paymentMethod === 'multicaixa_express' || ord.customer.paymentMethod === 'express_transferencia') && '📱 Multicaixa Express (Pela Plataforma - Não cobrar)'}
                                {ord.customer.paymentMethod === 'transferencia_bancaria' && '🏦 Transferência Bancária / IBAN (Pela Plataforma - Não cobrar)'}
                              </strong>
                              {ord.customer.needChangeFor ? ` (Levar troco p/ ${formatKwanzas(ord.customer.needChangeFor)})` : ''}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-stone-400">Taxa Cliente: {formatKwanzas(ord.deliveryFee)}</span>
                              <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                                Sua Comissão: 1.000 Kz
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Items in order */}
                        <div className="space-y-1 text-xs">
                          <span className="text-[10px] uppercase font-bold text-stone-400 block">Artigos a Entregar:</span>
                          {ord.items.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-stone-700">
                              <span className="truncate">• {item.quantity}x {item.product.title}</span>
                              <span className="font-mono text-stone-900 font-semibold">{formatKwanzas(item.product.price * item.quantity)}</span>
                            </div>
                          ))}
                        </div>

                        {/* Direct Delivery Confirmation Section */}
                        {!isDelivered ? (
                          <div className="p-4 rounded-2xl bg-stone-100 border border-stone-200 flex flex-wrap items-center justify-between gap-3">
                            <div className="space-y-0.5">
                              <span className="text-xs font-bold text-stone-900 block">Finalização da Ordem</span>
                              <p className="text-[11px] text-stone-500">
                                Após receber o valor e entregar os produtos ao cliente, confirme abaixo:
                              </p>
                            </div>

                            {deliverySuccess[ord.id] ? (
                              <p className="text-xs text-emerald-600 font-bold">{deliverySuccess[ord.id]}</p>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleConfirmDelivery(ord.id)}
                                className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm cursor-pointer transition-transform active:scale-95"
                              >
                                <Check className="w-4 h-4" />
                                <span>Confirmar Entrega Concluída</span>
                              </button>
                            )}
                          </div>
                        ) : (
                          <div className="p-3 rounded-2xl bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Entrega finalizada com sucesso! Valor registado na sua conta.</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: PERFIL */}
          {activeTab === 'perfil' && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div>
                <h3 className="font-black text-base text-stone-900">Perfil do Estafeta Autorizado</h3>
                <p className="text-xs text-stone-500">Fotografia, dados do veículo, matrícula, telemóvel e métodos para recebimento de fretes</p>
              </div>

              {profileSaved && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Perfil do Estafeta e métodos de pagamento atualizados com sucesso!</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-5">
                {/* Profile Photo Uploader */}
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative">
                    {courierAvatar ? (
                      <img 
                        src={courierAvatar} 
                        alt="Foto Estafeta" 
                        className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-500 shadow-xs"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-2xl bg-amber-100 border-2 border-amber-400 text-amber-900 font-bold flex items-center justify-center text-xl">
                        {courierName ? courierName.substring(0, 2).toUpperCase() : <Truck className="w-8 h-8 text-amber-700" />}
                      </div>
                    )}
                    <label className="absolute -bottom-1.5 -right-1.5 p-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 shadow-md cursor-pointer transition-transform hover:scale-105">
                      <Camera className="w-3.5 h-3.5" />
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleCourierAvatarUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div className="space-y-1 text-center sm:text-left flex-1">
                    <span className="font-bold text-xs text-stone-900 block">Fotografia de Perfil do Entregador</span>
                    <p className="text-[11px] text-stone-500">Adicione uma foto nítida para os clientes e o ADM identificarem a sua entrega.</p>
                    <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-200 hover:bg-stone-100 text-stone-800 text-[11px] font-bold cursor-pointer">
                        <Upload className="w-3 h-3 text-amber-600" />
                        <span>Carregar Foto</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleCourierAvatarUpload}
                          className="hidden"
                        />
                      </label>
                      {courierAvatar && (
                        <button
                          type="button"
                          onClick={() => setCourierAvatar('')}
                          className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-red-50 text-red-600 text-[11px] font-bold cursor-pointer"
                        >
                          Remover
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Nome Completo</label>
                  <input
                    type="text"
                    required
                    value={courierName}
                    onChange={(e) => setCourierName(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-3.5 py-2.5 text-xs text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">Telefone Principal (WhatsApp)</label>
                    <input
                      type="text"
                      required
                      value={courierPhone}
                      onChange={(e) => setCourierPhone(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-3.5 py-2.5 text-xs text-stone-900 font-mono focus:bg-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">Telemóvel Multicaixa Express</label>
                    <input
                      type="text"
                      value={courierExpress}
                      onChange={(e) => setCourierExpress(e.target.value)}
                      placeholder="+244 9..."
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-3.5 py-2.5 text-xs text-stone-900 font-mono focus:bg-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">Veículo de Transporte</label>
                    <input
                      type="text"
                      value={courierVehicle}
                      onChange={(e) => setCourierVehicle(e.target.value)}
                      placeholder="Moto Haojue 150cc, Carrinha ou Carro"
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-3.5 py-2.5 text-xs text-stone-900 focus:bg-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">Matrícula</label>
                    <input
                      type="text"
                      value={courierPlate}
                      onChange={(e) => setCourierPlate(e.target.value)}
                      placeholder="LD-00-00-AA"
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-3.5 py-2.5 text-xs text-stone-900 font-mono uppercase focus:bg-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Métodos de Pagamento e Recebimento de Fretes */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-black uppercase tracking-wider text-stone-800">Métodos de Pagamento & Liquidação de Fretes</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-stone-700">Banco para Depósito de Saldo</label>
                      <select
                        value={courierBank}
                        onChange={(e) => setCourierBank(e.target.value)}
                        className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900"
                      >
                        <option value="BAI">Banco BAI</option>
                        <option value="BFA">Banco BFA</option>
                        <option value="ATLANTICO">Banco Millennium Atlântico</option>
                        <option value="BIC">Banco BIC</option>
                        <option value="SOL">Banco Sol</option>
                        <option value="BPC">Banco BPC</option>
                        <option value="KEVE">Banco Keve</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-stone-700">IBAN Angolano (AO06...)</label>
                      <input
                        type="text"
                        value={courierIban}
                        onChange={(e) => setCourierIban(e.target.value)}
                        placeholder="AO06.0040..."
                        className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 font-mono uppercase"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-xs shadow-md cursor-pointer transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Guardar Perfil do Entregador e Pagamentos</span>
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
