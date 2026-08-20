import React, { useState } from 'react';
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
  ExternalLink,
  Navigation,
  Home,
  LayoutDashboard,
  Wallet,
  Layers,
  User,
  CreditCard,
  Banknote,
  Send
} from 'lucide-react';
import { AppUser, Order, OrderStatus, CourierTab } from '../types';
import { formatKwanzas, COURIER_COMMISSION_PER_DELIVERY_AOA } from '../data/mockData';

interface CourierPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AppUser;
  orders: Order[];
  onCompleteDelivery: (orderId: string, enteredPin?: string) => boolean;
  onUpdateCourierProfile?: (updatedUser: AppUser) => void;
  initialTab?: CourierTab;
}

export const CourierPortalModal: React.FC<CourierPortalModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  orders,
  onCompleteDelivery,
  onUpdateCourierProfile,
  initialTab = 'pedidos'
}) => {
  const [activeTab, setActiveTab] = useState<CourierTab>(initialTab);
  const [deliverySuccess, setDeliverySuccess] = useState<{ [orderId: string]: string }>({});

  // Profile states
  const [courierName, setCourierName] = useState(currentUser.name || '');
  const [courierPhone, setCourierPhone] = useState(currentUser.phone || '');
  const [courierVehicle, setCourierVehicle] = useState(currentUser.vehicle || 'Moto Haojue 150cc');
  const [courierPlate, setCourierPlate] = useState(currentUser.licensePlate || 'LD-00-00-AA');
  const [courierIban, setCourierIban] = useState(currentUser.iban || 'AO06.0040.0000.9876.5432.1098.7');
  const [courierExpress, setCourierExpress] = useState(currentUser.multicaixaExpressPhone || currentUser.phone || '');
  const [profileSaved, setProfileSaved] = useState(false);

  // Settlement with Admin
  const [depositSettled, setDepositSettled] = useState(false);

  if (!isOpen) return null;

  const isPending = currentUser.courierStatus === 'pendente';
  const isApproved = currentUser.courierStatus === 'aprovado';

  // Orders assigned to this courier or active for Luanda
  const assignedOrders = orders.filter(
    (o) => o.assignedCourierId === currentUser.id || (!o.assignedCourierId && o.status !== 'entregue' && isApproved)
  );

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
        vehicle: courierVehicle,
        licensePlate: courierPlate,
        iban: courierIban,
        multicaixaExpressPhone: courierExpress
      });
    }
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const handleSettleDeposit = () => {
    setDepositSettled(true);
    setTimeout(() => setDepositSettled(false), 3500);
  };

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
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-white sticky top-0 z-20 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500 text-stone-950 shadow-md">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-lg text-stone-900">Portal do Entregador / Estafeta</h2>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-lg border ${
                  isApproved 
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                    : 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse'
                }`}>
                  {isApproved ? '✓ Entregador Aprovado' : '⏳ Aguardando Aprovação do ADM'}
                </span>
              </div>
              <p className="text-xs text-stone-500">
                {currentUser.name} • {currentUser.vehicle || 'Moto'} ({currentUser.licensePlate || 'Luanda'})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-stone-100 text-stone-700 hover:bg-amber-50 hover:text-amber-800 transition-colors font-bold text-xs cursor-pointer border border-stone-200"
          >
            <span>Voltar à Loja</span>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 5 Tabs Bar */}
        <div className="px-4 sm:px-6 py-2.5 border-b border-stone-200 bg-stone-50 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {navTabs.map((t) => {
            const isActive = activeTab === t.tab;
            return (
              <button
                key={t.tab}
                onClick={() => setActiveTab(t.tab)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  isActive 
                    ? 'bg-amber-500 text-stone-950 shadow-sm font-black' 
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
          <div className="mx-6 mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Conta de Entregador em Análise</p>
              <p className="text-amber-800 text-[11px] mt-0.5">
                A sua conta foi registada e aguarda a aprovação do Administrador. Pode entrar na conta de ADM para aprovar a sua conta se estiver a testar a plataforma.
              </p>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-stone-50/50">

          {/* TAB 1: HOME */}
          {activeTab === 'home' && (
            <div className="space-y-6">
              {/* Operational Banner */}
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-500 via-amber-600 to-stone-900 text-stone-950 shadow-md relative overflow-hidden">
                <div className="relative z-10 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] uppercase font-black tracking-widest bg-stone-950 text-white px-3 py-1 rounded-full inline-block">
                      Operações Luanda Express
                    </span>
                    <span className="text-[10px] uppercase font-black tracking-widest bg-emerald-500 text-stone-950 px-3 py-1 rounded-full inline-block">
                      Comissão: 1.000 Kz / Entrega
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-stone-950">
                    Pronto para a Rota, {currentUser.name.split(' ')[0]}?
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-900 max-w-xl leading-relaxed font-medium">
                    Ganha <strong>1.000 Kz por cada entrega realizada com sucesso</strong> (retirado do lucro da taxa de frete). Cobrança por TPA Multicaixa ou Dinheiro em mãos ao cliente.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2.5">
                    <button
                      onClick={() => setActiveTab('pedidos')}
                      className="px-5 py-2.5 rounded-2xl bg-stone-950 text-white font-bold text-xs shadow-sm hover:bg-stone-900 cursor-pointer flex items-center gap-1.5"
                    >
                      <Layers className="w-4 h-4 text-amber-400" />
                      <span>Ver Entregas Pendentes ({assignedOrders.filter(o => o.status !== 'entregue').length})</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('carteira')}
                      className="px-4 py-2.5 rounded-2xl bg-white text-stone-900 font-bold text-xs hover:bg-stone-100 cursor-pointer flex items-center gap-1.5"
                    >
                      <Wallet className="w-4 h-4 text-emerald-600" />
                      <span>Ver Meus Ganhos ({formatKwanzas(totalEarnedDeliveryFees)})</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Status Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div 
                  onClick={() => setActiveTab('pedidos')}
                  className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm hover:border-amber-400 transition-all cursor-pointer space-y-1"
                >
                  <span className="text-[10px] uppercase font-bold text-stone-400">Pacotes a Entregar</span>
                  <span className="text-2xl font-black font-mono text-stone-900 block">
                    {assignedOrders.filter(o => o.status !== 'entregue').length}
                  </span>
                  <span className="text-[11px] text-amber-700 font-semibold">Em trânsito em Luanda</span>
                </div>

                <div 
                  onClick={() => setActiveTab('carteira')}
                  className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm hover:border-amber-400 transition-all cursor-pointer space-y-1"
                >
                  <span className="text-[10px] uppercase font-bold text-stone-400">Meus Ganhos Acumulados</span>
                  <span className="text-2xl font-black font-mono text-emerald-600 block">
                    {formatKwanzas(totalEarnedDeliveryFees)}
                  </span>
                  <span className="text-[11px] text-stone-500 font-medium">1.000 Kz × {currentUser.totalDeliveriesCompleted ?? 0} entregas</span>
                </div>

                <div 
                  onClick={() => setActiveTab('dashboard')}
                  className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm hover:border-amber-400 transition-all cursor-pointer space-y-1"
                >
                  <span className="text-[10px] uppercase font-bold text-stone-400">Total Concluído</span>
                  <span className="text-2xl font-black font-mono text-stone-900 block">
                    {currentUser.totalDeliveriesCompleted ?? 0}
                  </span>
                  <span className="text-[11px] text-emerald-700 font-bold">100% com sucesso</span>
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

              {/* Settle cash form */}
              <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
                <h4 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                  <Send className="w-4 h-4 text-amber-600" />
                  <span>Notificar Depósito / Prestação de Contas ao ADM</span>
                </h4>

                {depositSettled ? (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Notificação de prestação de contas enviada ao Administrador!</span>
                  </div>
                ) : (
                  <div className="space-y-3 text-xs">
                    <p className="text-stone-600">
                      Após depositar o montante recolhido no IBAN do AngolaMarket 01 ou entregar em mãos no escritório central em Luanda, confirme abaixo:
                    </p>
                    <button
                      type="button"
                      onClick={handleSettleDeposit}
                      className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs shadow-sm cursor-pointer"
                    >
                      Notificar ADM sobre Depósito ({formatKwanzas(cashCollectedFromCustomers)})
                    </button>
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

                          <span className="font-mono font-black text-sm text-red-600">
                            {formatKwanzas(ord.total)} (a cobrar)
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
                              Forma de Pagamento: <strong>{ord.customer.paymentMethod === 'dinheiro_entrega' ? '💵 Dinheiro Físico no ato' : '📱 Multicaixa Express'}</strong>
                              {ord.customer.needChangeFor ? ` (Troco para ${formatKwanzas(ord.customer.needChangeFor)})` : ''}
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
                <h3 className="font-black text-base text-stone-900">Perfil do Entregador</h3>
                <p className="text-xs text-stone-500">Dados do veículo, matrícula, telefone e dados para recebimento de fretes</p>
              </div>

              {profileSaved && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Perfil do Entregador atualizado com sucesso!</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Nome Completo</label>
                  <input
                    type="text"
                    required
                    value={courierName}
                    onChange={(e) => setCourierName(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-3.5 py-2.5 text-xs text-stone-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">Telefone de Contacto</label>
                    <input
                      type="text"
                      required
                      value={courierPhone}
                      onChange={(e) => setCourierPhone(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-3.5 py-2.5 text-xs text-stone-900 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">Telemóvel Multicaixa Express</label>
                    <input
                      type="text"
                      value={courierExpress}
                      onChange={(e) => setCourierExpress(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-3.5 py-2.5 text-xs text-stone-900 font-mono"
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
                      placeholder="Ex: Moto Haojue 150cc, Carrinha..."
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-3.5 py-2.5 text-xs text-stone-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">Matrícula</label>
                    <input
                      type="text"
                      value={courierPlate}
                      onChange={(e) => setCourierPlate(e.target.value)}
                      placeholder="LD-00-00-AA"
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-3.5 py-2.5 text-xs text-stone-900 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">IBAN para Recebimento de Fretes</label>
                  <input
                    type="text"
                    value={courierIban}
                    onChange={(e) => setCourierIban(e.target.value)}
                    placeholder="AO06.0040..."
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-3.5 py-2.5 text-xs text-stone-900 font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-xs shadow-sm cursor-pointer transition-all"
                >
                  Guardar Perfil do Entregador
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
