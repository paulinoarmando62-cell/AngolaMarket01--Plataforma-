import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Camera, 
  CreditCard, 
  Building2, 
  CheckCircle2, 
  ShieldCheck, 
  Truck, 
  DollarSign, 
  MapPin, 
  Lock, 
  Eye, 
  EyeOff, 
  Upload, 
  Image as ImageIcon,
  Wallet,
  Smartphone,
  Banknote,
  Sparkles,
  Package,
  Clock,
  AlertCircle,
  ShoppingBag,
  ShoppingCart,
  ArrowRight,
  ExternalLink,
  RefreshCw,
  MessageSquare,
  ChevronRight,
  Filter,
  Navigation,
  Check,
  Calendar
} from 'lucide-react';
import { AppUser, PaymentMethodType, Order, Product, OrderStatus } from '../types';
import { compressImageFile } from '../utils/imageOptimizer';
import { formatKwanzas } from '../data/mockData';

export type UserProfileTab = 'pedidos' | 'produtos' | 'dados' | 'endereco' | 'pagamentos' | 'seguranca';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AppUser;
  onUpdateUser: (updatedUser: AppUser) => void;
  orders?: Order[];
  onAddToCart?: (product: Product, quantity?: number) => void;
  onOpenProductDetail?: (product: Product) => void;
  initialTab?: UserProfileTab;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
  orders = [],
  onAddToCart,
  onOpenProductDetail,
  initialTab
}) => {
  const [activeSection, setActiveSection] = useState<UserProfileTab>(() => {
    if (initialTab) return initialTab;
    if (currentUser.role === 'buyer') return 'pedidos';
    return 'dados';
  });

  // Keep active tab in sync when opened from outside
  useEffect(() => {
    if (isOpen) {
      if (initialTab) {
        setActiveSection(initialTab);
      } else if (currentUser.role === 'buyer') {
        setActiveSection('pedidos');
      }
    }
  }, [isOpen, initialTab, currentUser.role]);

  // Filter for customer's orders
  const [orderFilter, setOrderFilter] = useState<'todos' | 'em_curso' | 'entregues'>('todos');
  const [addedItemToast, setAddedItemToast] = useState<string | null>(null);
  
  // Profile fields
  const [name, setName] = useState(currentUser.name || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [avatar, setAvatar] = useState(currentUser.avatar || '');
  const [avatarUrlInput, setAvatarUrlInput] = useState('');
  const [showAvatarUrlForm, setShowAvatarUrlForm] = useState(false);

  // Payment methods fields
  const [preferredPaymentMethod, setPreferredPaymentMethod] = useState<string>(
    currentUser.preferredPaymentMethod || 'dinheiro_entrega'
  );
  const [multicaixaPhone, setMulticaixaPhone] = useState(currentUser.multicaixaExpressPhone || currentUser.phone || '');
  const [iban, setIban] = useState(currentUser.iban || '');
  const [bankName, setBankName] = useState(currentUser.bankName || '');

  // Address fields
  const [municipality, setMunicipality] = useState(currentUser.defaultMunicipality || '');
  const [neighborhood, setNeighborhood] = useState(currentUser.defaultNeighborhood || '');
  const [streetAddress, setStreetAddress] = useState(currentUser.defaultStreetAddress || '');
  const [referencePoint, setReferencePoint] = useState(currentUser.defaultReferencePoint || '');

  // Password fields
  const [password, setPassword] = useState(currentUser.password || '');
  const [showPassword, setShowPassword] = useState(false);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Synchronize fields whenever currentUser, modal or initialTab changes
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
      setPhone(currentUser.phone || '');
      setAvatar(currentUser.avatar || '');
      setPreferredPaymentMethod(currentUser.preferredPaymentMethod || 'dinheiro_entrega');
      setMulticaixaPhone(currentUser.multicaixaExpressPhone || currentUser.phone || '');
      setIban(currentUser.iban || '');
      setBankName(currentUser.bankName || '');
      setMunicipality(currentUser.defaultMunicipality || '');
      setNeighborhood(currentUser.defaultNeighborhood || '');
      setStreetAddress(currentUser.defaultStreetAddress || '');
      setReferencePoint(currentUser.defaultReferencePoint || '');
      setPassword(currentUser.password || '');
    }
  }, [currentUser, isOpen]);

  useEffect(() => {
    if (initialTab) {
      setActiveSection(initialTab);
    }
  }, [initialTab]);

  // Robustly filter customer's orders
  const myOrders = useMemo(() => {
    if (!currentUser) return [];
    const userPhoneClean = (currentUser.phone || '').replace(/[^0-9]/g, '');
    const userEmailClean = (currentUser.email || '').toLowerCase().trim();
    const userNameClean = (currentUser.name || '').toLowerCase().trim();

    let localSavedOrderIds: string[] = [];
    try {
      const stored = localStorage.getItem('angolamarket_user_order_ids');
      if (stored) localSavedOrderIds = JSON.parse(stored);
    } catch {}

    return orders.filter(o => {
      // 1. Direct ID match
      if (o.customerId && o.customerId === currentUser.id) return true;

      // 2. Saved order IDs in client session
      if (localSavedOrderIds.includes(o.id)) return true;

      // 3. Phone match (ignoring spaces, dashes, +244)
      const orderPhoneClean = (o.customer?.phone || '').replace(/[^0-9]/g, '');
      if (userPhoneClean && orderPhoneClean) {
        if (orderPhoneClean.length >= 7 && (userPhoneClean.endsWith(orderPhoneClean) || orderPhoneClean.endsWith(userPhoneClean))) {
          return true;
        }
      }

      // 4. Email match
      const orderEmailClean = (o.customer?.email || (o as any).customerEmail || '').toLowerCase().trim();
      if (userEmailClean && orderEmailClean && userEmailClean === orderEmailClean) {
        return true;
      }

      // 5. Customer full name match
      const orderNameClean = (o.customer?.fullName || '').toLowerCase().trim();
      if (userNameClean && orderNameClean && userNameClean === orderNameClean) {
        return true;
      }

      return false;
    });
  }, [orders, currentUser]);

  // Filtered orders list by status tab
  const displayedOrders = useMemo(() => {
    if (orderFilter === 'em_curso') {
      return myOrders.filter(o => o.status === 'recebido' || o.status === 'preparando' || o.status === 'em_transito');
    }
    if (orderFilter === 'entregues') {
      return myOrders.filter(o => o.status === 'entregue');
    }
    return myOrders;
  }, [myOrders, orderFilter]);

  // Aggregated list of all distinct products purchased by this customer with total quantities
  const purchasedProductsList = useMemo(() => {
    const map = new Map<string, {
      product: Product;
      totalQuantity: number;
      totalSpent: number;
      lastPurchasedDate: string;
      lastOrderStatus: OrderStatus;
      lastOrderNumber: string;
    }>();

    myOrders.forEach(order => {
      order.items.forEach(item => {
        const prod = item.product;
        if (!prod || !prod.id) return;
        const existing = map.get(prod.id);
        if (existing) {
          existing.totalQuantity += item.quantity;
          existing.totalSpent += prod.price * item.quantity;
          // Keep newest order date
          existing.lastPurchasedDate = order.date;
          existing.lastOrderStatus = order.status;
          existing.lastOrderNumber = order.orderNumber;
        } else {
          map.set(prod.id, {
            product: prod,
            totalQuantity: item.quantity,
            totalSpent: prod.price * item.quantity,
            lastPurchasedDate: order.date,
            lastOrderStatus: order.status,
            lastOrderNumber: order.orderNumber
          });
        }
      });
    });

    return Array.from(map.values());
  }, [myOrders]);

  const totalUnitsBought = purchasedProductsList.reduce((acc, p) => acc + p.totalQuantity, 0);
  const totalMoneyInvested = myOrders.reduce((acc, o) => acc + (o.status !== 'cancelado' ? o.total : 0), 0);
  const activeOrdersCount = myOrders.filter(o => o.status !== 'entregue' && o.status !== 'cancelado').length;

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const res = await compressImageFile(file, 400, 400, 0.85);
      setAvatar(res);
    } catch {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const updated: AppUser = {
      ...currentUser,
      name: name.trim() || currentUser.name,
      email: email.trim() || currentUser.email,
      phone: phone.trim() || currentUser.phone,
      avatar: avatar || currentUser.avatar,
      password: password || currentUser.password,
      preferredPaymentMethod: preferredPaymentMethod as any,
      multicaixaExpressPhone: multicaixaPhone.trim(),
      iban: iban.trim(),
      bankName: bankName.trim(),
      defaultMunicipality: municipality.trim(),
      defaultNeighborhood: neighborhood.trim(),
      defaultStreetAddress: streetAddress.trim(),
      defaultReferencePoint: referencePoint.trim()
    };

    onUpdateUser(updated);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 3000);
  };

  const handleBuyAgain = (product: Product) => {
    if (onAddToCart) {
      onAddToCart(product, 1);
      setAddedItemToast(`"${product.title.substring(0, 30)}..." adicionado ao carrinho!`);
      setTimeout(() => setAddedItemToast(null), 3000);
    }
  };

  return (
    <div 
      id="user-profile-fullscreen-page"
      className="fixed inset-0 z-50 bg-stone-100 text-stone-900 overflow-y-auto flex flex-col animate-in fade-in"
    >
      {/* Top Header */}
      <header className="sticky top-0 z-20 bg-white border-b border-stone-200 shadow-xs px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center font-black text-sm shadow-sm">
            AO01
          </div>
          <div>
            <h1 className="font-black text-sm sm:text-base text-stone-900 flex items-center gap-2">
              <span>Conta de Cliente • {currentUser.name || 'Minha Conta'}</span>
              {currentUser.role === 'admin' && (
                <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-black uppercase">
                  Administrador
                </span>
              )}
              {currentUser.role === 'courier' && (
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black uppercase">
                  Estafeta
                </span>
              )}
              {currentUser.role === 'affiliate' && (
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-black uppercase">
                  Afiliado
                </span>
              )}
            </h1>
            <p className="text-xs text-stone-500 font-medium">{currentUser.phone} • {currentUser.email || 'Cliente AngolaMarket 01'}</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-all cursor-pointer border border-stone-200"
        >
          <X className="w-4 h-4" />
          <span className="hidden sm:inline">Voltar à Loja</span>
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-8 space-y-6">
        {/* Toast Feedback */}
        {savedSuccess && (
          <div className="p-4 rounded-3xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-bold flex items-center gap-3 shadow-xs animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Perfil e preferências atualizados com sucesso no sistema!</span>
          </div>
        )}

        {addedItemToast && (
          <div className="p-4 rounded-3xl bg-red-50 border border-red-300 text-red-900 text-xs sm:text-sm font-bold flex items-center gap-3 shadow-xs animate-in fade-in">
            <ShoppingCart className="w-5 h-5 text-red-600 shrink-0" />
            <span>{addedItemToast}</span>
          </div>
        )}

        {/* Section Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 bg-stone-200/80 p-1.5 rounded-3xl">
          {/* Tab 1: Meus Pedidos */}
          <button
            type="button"
            onClick={() => setActiveSection('pedidos')}
            className={`py-2.5 px-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeSection === 'pedidos'
                ? 'bg-white text-stone-900 shadow-sm ring-1 ring-stone-300'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Package className="w-4 h-4 text-red-600" />
            <span>Pedidos</span>
            {activeOrdersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center">
                {activeOrdersCount}
              </span>
            )}
          </button>

          {/* Tab 2: Produtos Comprados */}
          <button
            type="button"
            onClick={() => setActiveSection('produtos')}
            className={`py-2.5 px-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeSection === 'produtos'
                ? 'bg-white text-stone-900 shadow-sm ring-1 ring-stone-300'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-amber-600" />
            <span>Produtos</span>
            {totalUnitsBought > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-stone-950 text-[10px] font-black flex items-center justify-center">
                {totalUnitsBought}
              </span>
            )}
          </button>

          {/* Tab 3: Dados & Foto */}
          <button
            type="button"
            onClick={() => setActiveSection('dados')}
            className={`py-2.5 px-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeSection === 'dados'
                ? 'bg-white text-stone-900 shadow-sm ring-1 ring-stone-300'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <User className="w-4 h-4 text-stone-700" />
            <span>Dados</span>
          </button>

          {/* Tab 4: Endereço Luanda */}
          <button
            type="button"
            onClick={() => setActiveSection('endereco')}
            className={`py-2.5 px-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeSection === 'endereco'
                ? 'bg-white text-stone-900 shadow-sm ring-1 ring-stone-300'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <MapPin className="w-4 h-4 text-blue-600" />
            <span>Endereço</span>
          </button>

          {/* Tab 5: Pagamentos */}
          <button
            type="button"
            onClick={() => setActiveSection('pagamentos')}
            className={`py-2.5 px-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeSection === 'pagamentos'
                ? 'bg-white text-stone-900 shadow-sm ring-1 ring-stone-300'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <CreditCard className="w-4 h-4 text-emerald-600" />
            <span>Pagamentos</span>
          </button>

          {/* Tab 6: Segurança */}
          <button
            type="button"
            onClick={() => setActiveSection('seguranca')}
            className={`py-2.5 px-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeSection === 'seguranca'
                ? 'bg-white text-stone-900 shadow-sm ring-1 ring-stone-300'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Lock className="w-4 h-4 text-stone-700" />
            <span>Segurança</span>
          </button>
        </div>

        {/* TAB 1: MEUS PEDIDOS (Acompanhamento em Tempo Real) */}
        {activeSection === 'pedidos' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-stone-200 shadow-xs">
              <div>
                <h2 className="text-base font-black text-stone-900 flex items-center gap-2">
                  <Package className="w-5 h-5 text-red-600" />
                  <span>Acompanhamento dos Meus Pedidos em Tempo Real</span>
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Veja o percurso e o estado exato da sua entrega na província de Luanda
                </p>
              </div>

              {/* Status Filter Buttons */}
              <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setOrderFilter('todos')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    orderFilter === 'todos' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Todos ({myOrders.length})
                </button>
                <button
                  type="button"
                  onClick={() => setOrderFilter('em_curso')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    orderFilter === 'em_curso' ? 'bg-white text-amber-700 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Em Curso ({myOrders.filter(o => o.status !== 'entregue' && o.status !== 'cancelado').length})
                </button>
                <button
                  type="button"
                  onClick={() => setOrderFilter('entregues')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    orderFilter === 'entregues' ? 'bg-white text-emerald-700 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Entregues ({myOrders.filter(o => o.status === 'entregue').length})
                </button>
              </div>
            </div>

            {displayedOrders.length === 0 ? (
              <div className="bg-white rounded-3xl border border-stone-200 p-10 text-center space-y-4 shadow-sm">
                <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                  <Package className="w-8 h-8" />
                </div>
                <div className="space-y-1 max-w-md mx-auto">
                  <h3 className="font-bold text-stone-900 text-sm">
                    {orderFilter === 'em_curso' 
                      ? 'Nenhum pedido em curso no momento'
                      : orderFilter === 'entregues'
                      ? 'Nenhum pedido entregue ainda'
                      : 'Ainda não realizou nenhum pedido no AngolaMarket 01'}
                  </h3>
                  <p className="text-xs text-stone-500">
                    Quando agendar a sua compra no catálogo com entrega em Luanda, o estado da entrega e os dados do estafeta aparecerão aqui em tempo real.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs inline-flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Explorar Produtos da Loja</span>
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                {displayedOrders.map((ord) => {
                  const statusColors: Record<OrderStatus, { badge: string; text: string; label: string; desc: string }> = {
                    recebido: {
                      badge: 'bg-amber-100 border-amber-300 text-amber-900',
                      text: 'text-amber-700',
                      label: 'Agendamento Recebido',
                      desc: 'O seu pedido foi recebido pelo armazém de Luanda e está a ser registado.'
                    },
                    preparando: {
                      badge: 'bg-blue-100 border-blue-300 text-blue-900',
                      text: 'text-blue-700',
                      label: 'Em Preparação',
                      desc: 'A nossa equipa está a separar e embalar os seus artigos para expedição.'
                    },
                    em_transito: {
                      badge: 'bg-purple-100 border-purple-300 text-purple-900 animate-pulse',
                      text: 'text-purple-700',
                      label: 'Em Trânsito • Estafeta a Caminho',
                      desc: 'O estafeta já recolheu a mercadoria e está a deslocar-se ao seu endereço em Luanda.'
                    },
                    entregue: {
                      badge: 'bg-emerald-100 border-emerald-300 text-emerald-900',
                      text: 'text-emerald-700',
                      label: 'Entregue com Sucesso',
                      desc: 'Mercadoria entregue e pagamento recebido no destino.'
                    },
                    cancelado: {
                      badge: 'bg-stone-100 border-stone-300 text-stone-700',
                      text: 'text-stone-700',
                      label: 'Pedido Cancelado',
                      desc: 'Este pedido foi cancelado.'
                    }
                  };

                  const currentMeta = statusColors[ord.status] || statusColors.recebido;

                  // 4-Step Visual Progress Bar
                  const steps: { key: OrderStatus; label: string }[] = [
                    { key: 'recebido', label: 'Recebido' },
                    { key: 'preparando', label: 'Preparação' },
                    { key: 'em_transito', label: 'Em Trânsito' },
                    { key: 'entregue', label: 'Entregue' },
                  ];

                  const getStepIndex = (st: OrderStatus) => {
                    if (st === 'recebido') return 0;
                    if (st === 'preparando') return 1;
                    if (st === 'em_transito') return 2;
                    if (st === 'entregue') return 3;
                    return -1;
                  };

                  const currentStepIdx = getStepIndex(ord.status);

                  return (
                    <div 
                      key={ord.id}
                      className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs space-y-5 p-5 sm:p-6 transition-all hover:border-stone-300"
                    >
                      {/* Order Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-sm text-stone-900">{ord.orderNumber}</span>
                            <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${currentMeta.badge}`}>
                              {currentMeta.label}
                            </span>
                          </div>
                          <p className="text-xs text-stone-500 flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{ord.date}</span>
                            <span>•</span>
                            <span>Previsão: {ord.estimatedDeliveryDate}</span>
                          </p>
                        </div>

                        {/* PIN de 4 Dígitos */}
                        <div className="p-2.5 px-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-3">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-amber-800 block">
                              Código PIN de Entrega
                            </span>
                            <span className="font-mono font-black text-base text-stone-950 tracking-wider">
                              {ord.deliveryCode || '----'}
                            </span>
                          </div>
                          <span className="text-[10px] text-amber-900/80 max-w-[140px] leading-tight hidden sm:inline-block">
                            Diga este PIN ao estafeta no ato de receber a encomenda
                          </span>
                        </div>
                      </div>

                      {/* Real-time Visual Progress Tracker */}
                      <div className="py-2">
                        <div className="relative flex items-center justify-between">
                          {/* Background connecting bar */}
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 w-full bg-stone-100 rounded-full" />
                          <div 
                            className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 bg-red-600 rounded-full transition-all duration-500" 
                            style={{ 
                              width: currentStepIdx >= 0 ? `${(currentStepIdx / (steps.length - 1)) * 100}%` : '0%' 
                            }} 
                          />

                          {/* Step Nodes */}
                          {steps.map((step, idx) => {
                            const isCompleted = currentStepIdx >= idx;
                            const isCurrent = currentStepIdx === idx;

                            return (
                              <div key={step.key} className="relative z-10 flex flex-col items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                                  isCurrent
                                    ? 'bg-red-600 text-white shadow-md ring-4 ring-red-100 scale-110'
                                    : isCompleted
                                    ? 'bg-emerald-600 text-white shadow-xs'
                                    : 'bg-white border-2 border-stone-200 text-stone-400'
                                }`}>
                                  {isCompleted && !isCurrent ? (
                                    <Check className="w-4 h-4" />
                                  ) : (
                                    <span>{idx + 1}</span>
                                  )}
                                </div>
                                <span className={`text-[11px] font-bold mt-2 whitespace-nowrap ${
                                  isCurrent ? 'text-red-600' : isCompleted ? 'text-stone-800' : 'text-stone-400'
                                }`}>
                                  {step.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                        <p className="text-xs text-stone-600 mt-4 bg-stone-50 p-3 rounded-2xl border border-stone-200/70">
                          <strong>Estado Atual:</strong> {currentMeta.desc}
                        </p>
                      </div>

                      {/* Courier Details Card */}
                      <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold shadow-xs">
                            <Truck className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                              Estafeta Responsável
                            </span>
                            <span className="font-bold text-xs text-stone-900 block">
                              {ord.courier?.name || 'Equipa de Entregas Luanda (Aguardando Atribuição)'}
                            </span>
                            <span className="text-[11px] text-stone-500 font-mono">
                              Veículo: {ord.courier?.vehicle || 'Moto de Entregas'} • {ord.courier?.phone || '+244 938 243 909'}
                            </span>
                          </div>
                        </div>

                        {ord.courier?.phone && (
                          <div className="flex items-center gap-2">
                            <a
                              href={`tel:${ord.courier.phone.replace(/[^0-9+]/g, '')}`}
                              className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-stone-800 hover:bg-stone-100 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <Phone className="w-3.5 h-3.5 text-stone-600" />
                              <span>Ligar</span>
                            </a>
                            <a
                              href={`https://wa.me/${ord.courier.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Olá, sou o cliente do pedido ${ord.orderNumber} no AngolaMarket 01.`)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Delivery Address & Luanda Destination */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-stone-50/50 p-4 rounded-2xl border border-stone-200/60">
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-bold text-stone-500 block flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-red-600" />
                            <span>Destino em Luanda</span>
                          </span>
                          <p className="font-bold text-stone-900">
                            {ord.customer?.neighborhood}, {ord.customer?.municipalityName}
                          </p>
                          <p className="text-stone-600">{ord.customer?.streetAddress}</p>
                          {ord.customer?.deliveryType === 'paragem' && ord.customer?.busStopName && (
                            <p className="text-emerald-700 font-semibold">
                              🚏 Ponto de Encontro na Paragem: {ord.customer.busStopName}
                            </p>
                          )}
                          <p className="text-stone-500">
                            <strong>Ref:</strong> {ord.customer?.referencePoint || 'Sem ponto de referência'}
                          </p>
                        </div>

                        <div className="space-y-1 sm:text-right">
                          <span className="text-[10px] uppercase font-bold text-stone-500 block">
                            Modalidade de Pagamento
                          </span>
                          <p className="font-bold text-stone-900">
                            {ord.customer?.paymentMethod === 'express_transferencia'
                              ? 'Multicaixa Express no Ato'
                              : 'Dinheiro Físico no Ato (COD)'}
                          </p>
                          {ord.customer?.needChangeFor ? (
                            <p className="text-stone-500">
                              Troco solicitado para: {formatKwanzas(ord.customer.needChangeFor)}
                            </p>
                          ) : null}
                          <p className="text-red-600 font-mono font-black text-sm pt-1">
                            Total a Pagar: {formatKwanzas(ord.total)}
                          </p>
                          <span className="text-[10px] text-stone-400 block">
                            (Artigos: {formatKwanzas(ord.subtotal)} + Frete: {formatKwanzas(ord.deliveryFee)})
                          </span>
                        </div>
                      </div>

                      {/* Items in this Order */}
                      <div className="space-y-2 pt-1 border-t border-stone-100">
                        <span className="text-xs font-bold text-stone-800 block">
                          Artigos Incluídos ({ord.items.length} {ord.items.length === 1 ? 'artigo' : 'artigos'}):
                        </span>
                        <div className="space-y-2">
                          {ord.items.map((item, i) => (
                            <div 
                              key={i}
                              className="flex items-center justify-between gap-3 p-2.5 rounded-2xl bg-white border border-stone-200 text-xs"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <img
                                  src={item.product?.image || 'https://placehold.co/100x100?text=Produto'}
                                  alt=""
                                  className="w-12 h-12 rounded-xl object-cover border border-stone-200 bg-stone-100 shrink-0"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="min-w-0">
                                  <h4 className="font-bold text-stone-900 truncate">{item.product?.title}</h4>
                                  <span className="text-[11px] text-stone-500">
                                    Qtd: {item.quantity} un × {formatKwanzas(item.product?.price || 0)}
                                  </span>
                                </div>
                              </div>

                              <div className="text-right shrink-0">
                                <span className="font-mono font-bold text-stone-900 block">
                                  {formatKwanzas((item.product?.price || 0) * item.quantity)}
                                </span>
                                {item.product && (
                                  <button
                                    type="button"
                                    onClick={() => handleBuyAgain(item.product)}
                                    className="text-[10px] font-bold text-red-600 hover:text-red-700 hover:underline cursor-pointer"
                                  >
                                    Comprar Novamente
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PRODUTOS COMPRADOS (Histórico Visual com Foto e Quantidades) */}
        {activeSection === 'produtos' && (
          <div className="space-y-6">
            {/* Top Indicator Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-5 rounded-3xl bg-stone-900 text-white space-y-1 shadow-sm">
                <span className="text-[10px] uppercase font-bold text-stone-400">Total de Artigos Comprados</span>
                <span className="text-2xl font-black font-mono text-white block">
                  {totalUnitsBought} {totalUnitsBought === 1 ? 'unidade' : 'unidades'}
                </span>
                <span className="text-[11px] text-stone-300">
                  {purchasedProductsList.length} produtos diferentes adquiridos
                </span>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-stone-200 space-y-1 shadow-sm">
                <span className="text-[10px] uppercase font-bold text-stone-500">Total de Encomendas</span>
                <span className="text-2xl font-black font-mono text-stone-900 block">
                  {myOrders.length} {myOrders.length === 1 ? 'agendamento' : 'agendamentos'}
                </span>
                <span className="text-[11px] text-emerald-700 font-semibold">
                  {myOrders.filter(o => o.status === 'entregue').length} entregues com sucesso
                </span>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-stone-200 space-y-1 shadow-sm">
                <span className="text-[10px] uppercase font-bold text-stone-500">Total Investido na Loja</span>
                <span className="text-2xl font-black font-mono text-red-600 block">
                  {formatKwanzas(totalMoneyInvested)}
                </span>
                <span className="text-[11px] text-stone-500">
                  Valor total em Kwanzas (produtos + fretes)
                </span>
              </div>
            </div>

            {/* List Header */}
            <div className="flex items-center justify-between bg-white p-5 rounded-3xl border border-stone-200 shadow-xs">
              <div>
                <h2 className="text-base font-black text-stone-900 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-amber-600" />
                  <span>Histórico de Produtos Comprados na Plataforma</span>
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Lista completa de todos os artigos que já adquiriu no AngolaMarket 01 com fotografia, quantidade e preço
                </p>
              </div>
            </div>

            {purchasedProductsList.length === 0 ? (
              <div className="bg-white rounded-3xl border border-stone-200 p-10 text-center space-y-4 shadow-sm">
                <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1 max-w-md mx-auto">
                  <h3 className="font-bold text-stone-900 text-sm">
                    Ainda não comprou nenhum produto
                  </h3>
                  <p className="text-xs text-stone-500">
                    Assim que concluir a sua primeira compra ou agendamento na plataforma, todos os artigos comprados com fotografia e especificações ficarão organizados nesta lista.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs inline-flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Começar a Comprar Agora</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {purchasedProductsList.map((item) => (
                  <div
                    key={item.product.id}
                    className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:border-stone-300 transition-all flex flex-col group"
                  >
                    {/* Product Image */}
                    <div className="relative aspect-4/3 bg-stone-100 overflow-hidden border-b border-stone-100">
                      <img
                        src={item.product.image || 'https://placehold.co/400x300?text=Sem+Foto'}
                        alt={item.product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-2.5 left-2.5">
                        <span className="px-2.5 py-1 rounded-xl bg-stone-900/80 backdrop-blur-xs text-white font-bold text-[10px] uppercase">
                          {item.totalQuantity} {item.totalQuantity === 1 ? 'comprado' : 'comprados'}
                        </span>
                      </div>
                      <div className="absolute top-2.5 right-2.5">
                        <span className="px-2.5 py-1 rounded-xl bg-red-600 text-white font-mono font-bold text-[10px]">
                          {formatKwanzas(item.product.price)}
                        </span>
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-1">
                        <h4 className="font-bold text-xs text-stone-900 line-clamp-2 leading-snug">
                          {item.product.title}
                        </h4>
                        <p className="text-[11px] text-stone-500">
                          Última compra: <strong>{item.lastPurchasedDate}</strong> • Pedido {item.lastOrderNumber}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-stone-400 block">Total Gasto Neste Artigo</span>
                          <span className="font-mono font-black text-xs text-stone-900">
                            {formatKwanzas(item.totalSpent)}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {onOpenProductDetail && (
                            <button
                              type="button"
                              onClick={() => onOpenProductDetail(item.product)}
                              className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
                              title="Ver Detalhes do Produto"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleBuyAgain(item.product)}
                            className="px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>Comprar de Novo</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SETTINGS TABS (Dados, Endereço, Pagamentos, Segurança) */}
        {(activeSection === 'dados' || activeSection === 'endereco' || activeSection === 'pagamentos' || activeSection === 'seguranca') && (
          <form onSubmit={handleSave} className="space-y-6">
            {/* SECTION 3: DADOS PESSOAIS & FOTO DE PERFIL */}
            {activeSection === 'dados' && (
              <div className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-8 space-y-6 shadow-sm">
                <div className="border-b border-stone-100 pb-4">
                  <h2 className="text-base font-black text-stone-900">Foto de Perfil & Dados Principais</h2>
                  <p className="text-xs text-stone-500">Altere a sua fotografia, nome visível e contactos oficiais</p>
                </div>

                {/* Profile Photo Uploader */}
                <div className="flex flex-col sm:flex-row items-center gap-6 p-5 rounded-3xl bg-stone-50 border border-stone-200">
                  <div className="relative group">
                    {avatar ? (
                      <img
                        src={avatar}
                        alt="Foto de Perfil"
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-white shadow-md bg-stone-100"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl border-4 border-white shadow-md bg-stone-200 flex items-center justify-center text-stone-500 font-bold text-2xl">
                        {name ? name.substring(0, 2).toUpperCase() : <User className="w-10 h-10 text-stone-400" />}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-2 -right-2 p-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white shadow-lg cursor-pointer transition-transform hover:scale-105"
                      title="Adicionar ou alterar foto"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex-1 text-center sm:text-left space-y-2">
                    <h3 className="font-bold text-sm text-stone-900">Fotografia de Perfil</h3>
                    <p className="text-xs text-stone-500 max-w-md">
                      Carregue uma fotografia pessoal do seu dispositivo para identificação na plataforma.
                    </p>

                    {/* Hidden File Input */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Carregar do Dispositivo</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowAvatarUrlForm(!showAvatarUrlForm)}
                        className="px-3.5 py-2 rounded-2xl bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Inserir URL</span>
                      </button>

                      {avatar && (
                        <button
                          type="button"
                          onClick={() => setAvatar('')}
                          className="px-3.5 py-2 rounded-2xl bg-stone-100 hover:bg-red-50 text-red-600 border border-stone-200 font-bold text-xs cursor-pointer"
                        >
                          Remover Foto
                        </button>
                      )}
                    </div>

                    {showAvatarUrlForm && (
                      <div className="pt-2 flex gap-2">
                        <input
                          type="url"
                          placeholder="https://..."
                          value={avatarUrlInput}
                          onChange={(e) => setAvatarUrlInput(e.target.value)}
                          className="flex-1 bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-900"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (avatarUrlInput.trim()) {
                              setAvatar(avatarUrlInput.trim());
                              setAvatarUrlInput('');
                              setShowAvatarUrlForm(false);
                            }
                          }}
                          className="px-3 py-1.5 bg-stone-900 text-white font-bold text-xs rounded-xl cursor-pointer"
                        >
                          Aplicar
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-red-600" />
                      <span>Nome Completo *</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: João Baptista Silva"
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-red-500 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-red-600" />
                      <span>Telefone / WhatsApp Principal *</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+244 923 000 000"
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-stone-900 font-mono focus:outline-none focus:border-red-500 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-red-600" />
                      <span>Endereço de E-mail Oficial</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="exemplo@gmail.com"
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-red-500 focus:bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 4: ENDEREÇO DE ENTREGA EM LUANDA */}
            {activeSection === 'endereco' && (
              <div className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-8 space-y-6 shadow-sm">
                <div className="border-b border-stone-100 pb-4">
                  <h2 className="text-base font-black text-stone-900">Endereço de Entrega Predefinido (Luanda)</h2>
                  <p className="text-xs text-stone-500">
                    Estes dados são preenchidos automaticamente no agendamento de compras com entrega rápida ao domicílio
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700">Município de Luanda</label>
                    <input
                      type="text"
                      value={municipality}
                      onChange={(e) => setMunicipality(e.target.value)}
                      placeholder="Ex: Talatona, Belas, Viana, Luanda, etc."
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700">Bairro / Condomínio</label>
                    <input
                      type="text"
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      placeholder="Ex: Morro Bento, Vila Alice, Kilamba, etc."
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-stone-700">Rua / Entrada / Nº da Casa</label>
                    <input
                      type="text"
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      placeholder="Ex: Rua 12, Casa nº 45, Edifício K12, 2º Andar"
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-stone-700">Ponto de Referência Conhecido</label>
                    <input
                      type="text"
                      value={referencePoint}
                      onChange={(e) => setReferencePoint(e.target.value)}
                      placeholder="Ex: Próximo à padaria Pão Quente / Em frente à bomba Sonangol"
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 5: MÉTODOS DE PAGAMENTO */}
            {activeSection === 'pagamentos' && (
              <div className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-8 space-y-6 shadow-sm">
                <div className="border-b border-stone-100 pb-4">
                  <h2 className="text-base font-black text-stone-900">Métodos de Pagamento & Dados Bancários</h2>
                  <p className="text-xs text-stone-500">Configure como prefere pagar as suas compras ou receber saques</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700">Método Preferencial nas Entregas</label>
                    <select
                      value={preferredPaymentMethod}
                      onChange={(e) => setPreferredPaymentMethod(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-stone-900 font-semibold focus:outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="dinheiro_entrega">💵 Dinheiro Físico no Ato da Entrega (Cash on Delivery)</option>
                      <option value="express_transferencia">📱 Multicaixa Express no Telemóvel no Ato da Entrega</option>
                      <option value="transferencia_iban">🏦 Transferência Bancária por IBAN</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                        <Smartphone className="w-3.5 h-3.5 text-blue-600" />
                        <span>Número Multicaixa Express</span>
                      </label>
                      <input
                        type="tel"
                        value={multicaixaPhone}
                        onChange={(e) => setMulticaixaPhone(e.target.value)}
                        placeholder="Ex: 923 000 000"
                        className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-stone-900 font-mono focus:outline-none focus:border-emerald-500 focus:bg-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-stone-500" />
                        <span>Nome do Banco Angolano</span>
                      </label>
                      <input
                        type="text"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        placeholder="Ex: BAI, BFA, BIC, Atlântico, Sol"
                        className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                      />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                        <span>IBAN Angolano (21 Dígitos - AO06...)</span>
                      </label>
                      <input
                        type="text"
                        value={iban}
                        onChange={(e) => setIban(e.target.value.toUpperCase())}
                        placeholder="AO06 0000 0000 0000 0000 0000 0"
                        className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-stone-900 font-mono focus:outline-none focus:border-emerald-500 focus:bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 6: SEGURANÇA */}
            {activeSection === 'seguranca' && (
              <div className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-8 space-y-6 shadow-sm">
                <div className="border-b border-stone-100 pb-4">
                  <h2 className="text-base font-black text-stone-900">Segurança da Conta & Palavra-passe</h2>
                  <p className="text-xs text-stone-500">Altere a sua senha de acesso para manter a sua conta protegida</p>
                </div>

                <div className="space-y-4 max-w-md">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700">Nova Palavra-passe</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Digite uma nova palavra-passe"
                        className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2.5 pl-10 pr-10 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-red-500 focus:bg-white"
                      />
                      <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3 text-stone-400 hover:text-stone-700 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                    <strong>Dica de Segurança:</strong> Utilize uma palavra-passe forte com letras e números para proteger as suas compras e transações.
                  </div>
                </div>
              </div>
            )}

            {/* Save Button Bar for Settings */}
            <div className="sticky bottom-4 z-10 bg-white/90 backdrop-blur-md p-4 rounded-3xl border border-stone-200 shadow-xl flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs cursor-pointer transition-colors"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs sm:text-sm shadow-md flex items-center gap-2 cursor-pointer transition-all transform active:scale-98"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Guardar Alterações</span>
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
};
