import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Home, 
  LayoutDashboard, 
  Wallet, 
  TrendingUp, 
  Layers, 
  Truck, 
  DollarSign, 
  MapPin, 
  PlusCircle, 
  User, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  Mail, 
  Clock, 
  Search, 
  Check, 
  Sparkles, 
  Image as ImageIcon,
  KeyRound,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Banknote,
  Receipt,
  FileText,
  Sliders,
  Percent,
  Lock,
  ExternalLink,
  ChevronRight,
  Package,
  Boxes,
  Plus,
  Minus,
  RefreshCw,
  Tag,
  CheckCircle,
  XCircle,
  Filter,
  Scale,
  Users,
  Activity,
  Calendar,
  Zap,
  Navigation,
  Award,
  Camera,
  Upload
} from 'lucide-react';
import { 
  Product, 
  LuandaZone, 
  AppUser, 
  Order, 
  CategoryId, 
  OrderStatus, 
  AdminTab,
  PayoutRequest
} from '../types';
import { CATEGORIES, formatKwanzas } from '../data/mockData';

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAddProduct: (prod: Product) => void;
  onUpdateProduct: (prod: Product) => void;
  onDeleteProduct: (productId: string) => void;
  luandaZones: LuandaZone[];
  onAddZone: (zone: LuandaZone) => void;
  onUpdateZone: (zone: LuandaZone) => void;
  onDeleteZone: (zoneId: string) => void;
  users: AppUser[];
  onApproveCourier: (userId: string) => void;
  onRejectCourier: (userId: string) => void;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onAssignCourierToOrder: (orderId: string, courierId: string) => void;
  payoutRequests?: PayoutRequest[];
  onApprovePayoutRequest?: (requestId: string, transactionRef?: string) => void;
  onRejectPayoutRequest?: (requestId: string, reason?: string) => void;
  currentUser?: AppUser | null;
  onUpdateAdminProfile?: (updatedUser: AppUser) => void;
  initialTab?: AdminTab;
}

const SAMPLE_PRESET_IMAGES = [
  { label: 'Smartphone / Gadget', url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80' },
  { label: 'Moda / Samakaka', url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80' },
  { label: 'Eletrodoméstico / Casa', url: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&auto=format&fit=crop&q=80' },
  { label: 'Cabelos & Peruca', url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop&q=80' },
  { label: 'Alimentação & Fardos', url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80' },
  { label: 'Auto & Equipamento', url: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&auto=format&fit=crop&q=80' },
];

export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({
  isOpen,
  onClose,
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  luandaZones,
  onAddZone,
  onUpdateZone,
  onDeleteZone,
  users,
  onApproveCourier,
  onRejectCourier,
  orders,
  onUpdateOrderStatus,
  onAssignCourierToOrder,
  payoutRequests = [],
  onApprovePayoutRequest,
  onRejectPayoutRequest,
  currentUser,
  onUpdateAdminProfile,
  initialTab = 'dashboard'
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>(initialTab);

  // Paying request state
  const [payingRequestId, setPayingRequestId] = useState<string | null>(null);
  const [paymentRefInput, setPaymentRefInput] = useState('');
  const [payoutSuccessMessage, setPayoutSuccessMessage] = useState<string | null>(null);

  // Product Create/Edit form state (3 image slots with upload support)
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [prodTitle, setProdTitle] = useState('');
  const [prodCategory, setProdCategory] = useState<CategoryId>('telemoveis_eletronicos');
  const [prodPrice, setProdPrice] = useState('');
  const [prodOrigPrice, setProdOrigPrice] = useState('');
  const [prodStock, setProdStock] = useState('10');
  
  // 3 distinct images as requested by the user
  const [prodImage1, setProdImage1] = useState(SAMPLE_PRESET_IMAGES[0].url);
  const [prodImage2, setProdImage2] = useState('');
  const [prodImage3, setProdImage3] = useState('');

  const [prodDesc, setProdDesc] = useState('');
  const [prodFeatures, setProdFeatures] = useState('Entrega rápida em Luanda\nPagamento TPA ou Dinheiro no ato\nGarantia incluída');
  const [prodCondition, setProdCondition] = useState<'Novo' | 'Usado - Como Novo' | 'Recondicionado'>('Novo');
  // Affiliate commission configured by ADM from 0% to 100%
  const [prodAffiliateCommission, setProdAffiliateCommission] = useState<number>(10);

  const handleImageFileUpload = (slot: 1 | 2 | 3, file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const res = reader.result as string;
      if (slot === 1) setProdImage1(res);
      else if (slot === 2) setProdImage2(res);
      else if (slot === 3) setProdImage3(res);
    };
    reader.readAsDataURL(file);
  };

  // Neighborhood / Delivery fee form state
  const [isZoneFormOpen, setIsZoneFormOpen] = useState(false);
  const [editingZoneId, setEditingZoneId] = useState<string | null>(null);
  const [zoneName, setZoneName] = useState('');
  const [zoneMunicipality, setZoneMunicipality] = useState('Luanda');
  const [zoneNeighborhood, setZoneNeighborhood] = useState('');
  const [zoneFee, setZoneFee] = useState('');
  const [zoneFeeDoor, setZoneFeeDoor] = useState('');
  const [zoneFeeBusStop, setZoneFeeBusStop] = useState('');
  const [zoneBusStops, setZoneBusStops] = useState('');
  const [zoneHours, setZoneHours] = useState('24 a 48 horas');
  const [zoneDeliverySectionTab, setZoneDeliverySectionTab] = useState<'todas' | 'porta' | 'paragem'>('todas');

  // Search and inventory filter in "Meus Produtos"
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('todos');
  const [productStockFilter, setProductStockFilter] = useState<'todos' | 'em_stock' | 'esgotado'>('todos');
  const [stockFeedback, setStockFeedback] = useState<{ id: string; msg: string; type?: 'success' | 'warning' } | null>(null);

  // Quick inline stock updater handlers
  const handleQuickStockChange = (product: Product, newStock: number) => {
    const stockVal = Math.max(0, newStock);
    const updated: Product = {
      ...product,
      stockCount: stockVal,
      inStock: stockVal > 0
    };
    onUpdateProduct(updated);
    setStockFeedback({ 
      id: product.id, 
      msg: stockVal > 0 ? `Stock atualizado para ${stockVal} unidades` : 'Stock esgotado (0 unidades)',
      type: stockVal > 0 ? 'success' : 'warning'
    });
    setTimeout(() => setStockFeedback(null), 3000);
  };

  const handleToggleInStock = (product: Product) => {
    const nextInStock = !product.inStock;
    const nextCount = nextInStock ? (product.stockCount === 0 ? 10 : product.stockCount) : 0;
    const updated: Product = {
      ...product,
      inStock: nextInStock,
      stockCount: nextCount
    };
    onUpdateProduct(updated);
    setStockFeedback({ 
      id: product.id, 
      msg: nextInStock ? `Artigo reativado com ${nextCount} unidades em stock!` : 'Artigo marcado como Esgotado / Sem Stock',
      type: nextInStock ? 'success' : 'warning'
    });
    setTimeout(() => setStockFeedback(null), 3000);
  };

  const handleQuickReplenish = (product: Product, addQty: number) => {
    const currentQty = product.stockCount || 0;
    const newQty = currentQty + addQty;
    const updated: Product = {
      ...product,
      stockCount: newQty,
      inStock: true
    };
    onUpdateProduct(updated);
    setStockFeedback({ 
      id: product.id, 
      msg: `Adicionadas +${addQty} unidades ao stock! Total: ${newQty} un`,
      type: 'success'
    });
    setTimeout(() => setStockFeedback(null), 3000);
  };

  // Search in other tabs
  const [searchTerm, setSearchTerm] = useState('');

  // Home Tab Courier Daily Delivery & Equal Distribution State
  const [homeCourierSearch, setHomeCourierSearch] = useState('');
  const [homeAssignModalCourier, setHomeAssignModalCourier] = useState<AppUser | null>(null);
  const [homeAssignFeedback, setHomeAssignFeedback] = useState<{ msg: string; type: 'success' | 'warning' } | null>(null);
  const [selectedUnassignedOrderId, setSelectedUnassignedOrderId] = useState<string>('');

  // Profile edit form state
  const [adminName, setAdminName] = useState(currentUser?.name || 'Paulino Armando (Administrador Geral)');
  const [adminEmail, setAdminEmail] = useState(currentUser?.email || 'paulinoarmando62@gmail.com');
  const [adminPhone, setAdminPhone] = useState(currentUser?.phone || '+244 938 243 909');
  const [adminAvatar, setAdminAvatar] = useState(currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80');
  const [adminIban, setAdminIban] = useState(currentUser?.iban || '');
  const [adminMulticaixaExpress, setAdminMulticaixaExpress] = useState(currentUser?.multicaixaExpressPhone || '+244 938 243 909');
  const [adminBankName, setAdminBankName] = useState(currentUser?.bankName || '');
  const [adminPassword, setAdminPassword] = useState(currentUser?.password || 'Armando@123');
  const [profileSaved, setProfileSaved] = useState(false);

  const handleAdminAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAdminAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Wallet Payout Form
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [withdrawalSuccess, setWithdrawalSuccess] = useState(false);

  if (!isOpen) return null;

  const couriers = users.filter(u => u.role === 'courier');
  const pendingCouriers = couriers.filter(u => u.courierStatus === 'pendente');
  const approvedCouriers = couriers.filter(u => u.courierStatus === 'aprovado');
  const affiliates = users.filter(u => u.role === 'affiliate');

  // Financial calculations
  const totalGrossSales = orders.reduce((acc, o) => acc + (o.status !== 'cancelado' ? o.total : 0), 0);
  const totalDeliveredRevenue = orders.reduce((acc, o) => acc + (o.status === 'entregue' ? o.total : 0), 0);
  const totalDeliveryFeesCollected = orders.reduce((acc, o) => acc + (o.status !== 'cancelado' ? o.deliveryFee : 0), 0);
  
  // Total affiliate commissions across orders
  const totalCommissionsOwed = orders.reduce((acc, o) => {
    if (o.status === 'cancelado') return acc;
    if (o.affiliateCode) {
      return acc + (o.affiliateCommissionAmount || Math.round(o.subtotal * 0.08));
    }
    return acc;
  }, 0);

  const platformNetProfit = Math.max(0, totalDeliveredRevenue - totalDeliveryFeesCollected - totalCommissionsOwed);
  const cashInTransitWithCouriers = orders
    .filter(o => o.status === 'em_transito' && o.customer.paymentMethod === 'dinheiro_entrega')
    .reduce((acc, o) => acc + o.total, 0);

  // Handle Product Save
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = Number(prodPrice.toString().replace(/[^0-9]/g, '')) || 0;
    const origNum = prodOrigPrice ? Number(prodOrigPrice.toString().replace(/[^0-9]/g, '')) : undefined;
    const discount = origNum && origNum > priceNum ? Math.round(((origNum - priceNum) / origNum) * 100) : undefined;
    const featuresArr = prodFeatures.split('\n').map(f => f.trim()).filter(Boolean);
    const commPercent = Math.min(100, Math.max(0, Number(prodAffiliateCommission) || 0));

    const galleryImgs = [prodImage1, prodImage2, prodImage3].filter(Boolean);
    const mainImg = galleryImgs[0] || SAMPLE_PRESET_IMAGES[0].url;

    if (editingProductId) {
      const existing = products.find(p => p.id === editingProductId);
      if (existing) {
        const stockNum = Math.max(0, Number(prodStock) !== undefined && !isNaN(Number(prodStock)) ? Number(prodStock) : existing.stockCount);
        const updated: Product = {
          ...existing,
          title: prodTitle || existing.title,
          category: prodCategory,
          price: priceNum,
          originalPrice: origNum,
          discountPercent: discount,
          stockCount: stockNum,
          inStock: stockNum > 0,
          image: mainImg,
          gallery: galleryImgs.length > 0 ? galleryImgs : [mainImg],
          description: prodDesc || existing.description,
          features: featuresArr.length > 0 ? featuresArr : existing.features,
          condition: prodCondition,
          affiliateCommissionPercent: commPercent
        };
        onUpdateProduct(updated);
        setStockFeedback({ id: updated.id, msg: `Artigo "${updated.title}" e stock atualizados com sucesso!`, type: 'success' });
        setTimeout(() => setStockFeedback(null), 3500);
      }
    } else {
      const stockNum = Math.max(0, Number(prodStock) || 0);
      const newProd: Product = {
        id: `adm-prod-${Date.now()}`,
        title: prodTitle || 'Novo Artigo AngolaMarket 01',
        category: prodCategory,
        price: priceNum,
        originalPrice: origNum,
        discountPercent: discount,
        rating: 5.0,
        reviewCount: 0,
        image: mainImg,
        gallery: galleryImgs.length > 0 ? galleryImgs : [mainImg],
        inStock: stockNum > 0,
        stockCount: stockNum,
        cashOnDelivery: true,
        expressDeliveryLuanda: true,
        affiliateCommissionPercent: commPercent,
        seller: {
          id: currentUser?.id || 'admin-master',
          name: 'AngolaMarket 01 (Loja Oficial)',
          location: 'Luanda, Angola',
          rating: 5.0,
          salesCount: 0,
          verified: true,
          phone: currentUser?.phone || '+244 938 243 909'
        },
        condition: prodCondition,
        description: prodDesc || `${prodTitle} disponível com pronta entrega em Luanda e pagamento no ato.`,
        features: featuresArr.length > 0 ? featuresArr : ['Entrega rápida em Luanda', 'Pagamento TPA ou Dinheiro'],
        tags: [prodCategory, 'Luanda', 'AngolaMarket 01', 'Oficial']
      };
      onAddProduct(newProd);
      setStockFeedback({ id: newProd.id, msg: `Novo artigo "${newProd.title}" publicado com sucesso!`, type: 'success' });
      setTimeout(() => setStockFeedback(null), 3500);
    }

    setIsProductFormOpen(false);
    setEditingProductId(null);
    setProdTitle('');
    setProdPrice('');
    setProdOrigPrice('');
    setProdDesc('');
    setProdImage1(SAMPLE_PRESET_IMAGES[0].url);
    setProdImage2('');
    setProdImage3('');
    setProdAffiliateCommission(10);
    setActiveTab('meus_produtos');
  };

  const handleEditProductClick = (p: Product) => {
    setEditingProductId(p.id);
    setProdTitle(p.title);
    setProdCategory(p.category);
    setProdPrice(p.price.toString());
    setProdOrigPrice(p.originalPrice ? p.originalPrice.toString() : '');
    setProdStock(p.stockCount.toString());
    
    // Populate the 3 image slots
    const g = p.gallery || [p.image];
    setProdImage1(g[0] || p.image || '');
    setProdImage2(g[1] || '');
    setProdImage3(g[2] || '');

    setProdDesc(p.description);
    setProdFeatures(p.features.join('\n'));
    setProdCondition(p.condition);
    setProdAffiliateCommission(p.affiliateCommissionPercent ?? 10);
    setIsProductFormOpen(true);
    setActiveTab('cadastrar_produtos');
  };

  // Handle Zone Save (Door vs Bus Stop Configuration)
  const handleSaveZone = (e: React.FormEvent) => {
    e.preventDefault();
    const feeDoorNum = Number(zoneFeeDoor.toString().replace(/[^0-9]/g, '')) || 0;
    const feeStopNum = Number(zoneFeeBusStop.toString().replace(/[^0-9]/g, '')) || 0;
    const stopsList = zoneBusStops.split(',').map(s => s.trim()).filter(Boolean);

    if (editingZoneId) {
      const existing = luandaZones.find(z => z.id === editingZoneId);
      if (existing) {
        onUpdateZone({
          ...existing,
          name: zoneName || existing.name,
          municipality: zoneMunicipality,
          neighborhood: zoneNeighborhood || zoneName,
          deliveryFee: feeDoorNum,
          deliveryFeeDoor: feeDoorNum,
          deliveryFeeBusStop: feeStopNum,
          popularBusStops: stopsList.length > 0 ? stopsList : (existing.popularBusStops || [`Paragem de ${zoneNeighborhood || zoneName}`]),
          estimatedHours: zoneHours
        });
      }
    } else {
      const newZone: LuandaZone = {
        id: `zone-${Date.now()}`,
        name: `${zoneNeighborhood || zoneName} (${zoneMunicipality})`,
        municipality: zoneMunicipality,
        neighborhood: zoneNeighborhood || zoneName,
        deliveryFee: feeDoorNum,
        deliveryFeeDoor: feeDoorNum,
        deliveryFeeBusStop: feeStopNum,
        popularBusStops: stopsList.length > 0 ? stopsList : [`Paragem de ${zoneNeighborhood || zoneName}`],
        estimatedHours: zoneHours,
        popularAreas: [zoneNeighborhood || zoneName, zoneMunicipality],
        active: true
      };
      onAddZone(newZone);
    }

    setIsZoneFormOpen(false);
    setEditingZoneId(null);
    setZoneName('');
    setZoneNeighborhood('');
    setZoneFee('');
    setZoneFeeDoor('');
    setZoneFeeBusStop('');
    setZoneBusStops('');
  };

  const handleEditZoneClick = (z: LuandaZone) => {
    setEditingZoneId(z.id);
    setZoneName(z.name);
    setZoneMunicipality(z.municipality || 'Luanda');
    setZoneNeighborhood(z.neighborhood || z.name);
    setZoneFee((z.deliveryFeeDoor || z.deliveryFee).toString());
    setZoneFeeDoor((z.deliveryFeeDoor || z.deliveryFee).toString());
    setZoneFeeBusStop((z.deliveryFeeBusStop || Math.round(z.deliveryFee * 0.6)).toString());
    setZoneBusStops(z.popularBusStops && z.popularBusStops.length > 0 ? z.popularBusStops.join(', ') : `Paragem do ${z.neighborhood || z.name}`);
    setZoneHours(z.estimatedHours);
    setIsZoneFormOpen(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser && onUpdateAdminProfile) {
      onUpdateAdminProfile({
        ...currentUser,
        name: adminName,
        email: adminEmail,
        phone: adminPhone,
        avatar: adminAvatar,
        iban: adminIban,
        multicaixaExpressPhone: adminMulticaixaExpress,
        bankName: adminBankName,
        password: adminPassword
      });
    }
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const handleWithdrawalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawalSuccess(true);
    setTimeout(() => {
      setWithdrawalSuccess(false);
      setWithdrawalAmount('');
    }, 3500);
  };

  const navItems: { tab: AdminTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { tab: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { tab: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { tab: 'meus_produtos', label: 'Meus Produtos', icon: <Package className="w-4 h-4" />, badge: products.length },
    { tab: 'cadastrar_produtos', label: 'Cadastrar Produtos', icon: <PlusCircle className="w-4 h-4" /> },
    { tab: 'carteira', label: 'Carteira', icon: <Wallet className="w-4 h-4" /> },
    { tab: 'gestao_financeira', label: 'Gestão Financeira', icon: <TrendingUp className="w-4 h-4" /> },
    { tab: 'gestao_pedidos', label: 'Gestão de Pedidos', icon: <Layers className="w-4 h-4" />, badge: orders.filter(o => o.status !== 'entregue' && o.status !== 'cancelado').length },
    { tab: 'gestao_entregadores', label: 'Gestão de Entregadores', icon: <Truck className="w-4 h-4" />, badge: pendingCouriers.length },
    { tab: 'gestao_afiliados', label: 'Gestão de Afiliados', icon: <DollarSign className="w-4 h-4" /> },
    { tab: 'taxa_entrega', label: 'Taxa de Entrega', icon: <MapPin className="w-4 h-4" /> },
    { tab: 'perfil', label: 'Perfil', icon: <User className="w-4 h-4" /> },
  ];

  return (
    <div 
      id="admin-portal-modal"
      className="fixed inset-0 z-50 bg-stone-100 flex flex-col w-screen h-screen overflow-hidden text-stone-900 animate-in fade-in"
    >
      <div className="flex flex-col w-full h-full bg-white overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-white sticky top-0 z-20 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-red-600 text-white shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-lg text-stone-900">Conta de Administrador (ADM)</h2>
                <span className="text-[10px] bg-red-100 text-red-700 font-bold px-2.5 py-0.5 rounded-lg border border-red-200 uppercase">
                  Dono da Plataforma
                </span>
              </div>
              <p className="text-xs text-stone-500">
                AngolaMarket 01 • Luanda COD & Gestão de Marketplace
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-stone-100 text-stone-700 hover:bg-red-50 hover:text-red-600 transition-colors font-bold text-xs cursor-pointer border border-stone-200"
          >
            <span>Voltar à Loja</span>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 10 Required Tabs Horizontal Bar */}
        <div className="px-4 sm:px-6 py-2.5 border-b border-stone-200 bg-stone-50 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {navItems.map((item) => {
            const isActive = activeTab === item.tab;
            return (
              <button
                key={item.tab}
                onClick={() => {
                  setActiveTab(item.tab);
                  if (item.tab === 'cadastrar_produtos' && !editingProductId) {
                    setIsProductFormOpen(true);
                  }
                }}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  isActive 
                    ? 'bg-red-600 text-white shadow-sm' 
                    : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-200'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`w-4 h-4 rounded-full text-[10px] font-black flex items-center justify-center ${
                    isActive ? 'bg-white text-red-600' : 'bg-red-600 text-white animate-pulse'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-stone-50/50">
          
          {/* TAB 1: HOME */}
          {activeTab === 'home' && (
            <div className="space-y-6">
              {/* Welcome Bento Card */}
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-red-600 to-red-700 text-white shadow-md relative overflow-hidden">
                <div className="relative z-10 space-y-3">
                  <span className="text-[10px] uppercase font-bold tracking-widest bg-black/20 px-3 py-1 rounded-full text-white inline-block">
                    Painel Principal do Proprietário
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black">
                    Bem-vindo, {currentUser?.name || 'Administrador'}!
                  </h3>
                  <p className="text-xs sm:text-sm text-red-50 max-w-xl leading-relaxed">
                    Você tem o controlo total do <strong>AngolaMarket 01</strong>. Apenas você cadastra os produtos, define a comissão dos afiliados (0% a 100%), edita as taxas de frete por bairro de Luanda e aprova os estafetas.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2.5">
                    <button
                      onClick={() => setActiveTab('meus_produtos')}
                      className="px-4 py-2 rounded-2xl bg-white text-red-600 font-bold text-xs shadow-sm hover:bg-stone-100 cursor-pointer flex items-center gap-1.5"
                    >
                      <Package className="w-4 h-4" />
                      <span>Meus Produtos ({products.length})</span>
                    </button>
                    <button
                      onClick={() => { setActiveTab('cadastrar_produtos'); setIsProductFormOpen(true); }}
                      className="px-4 py-2 rounded-2xl bg-red-800 hover:bg-red-900 text-white font-bold text-xs shadow-sm cursor-pointer flex items-center gap-1.5"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>+ Cadastrar Produto</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('taxa_entrega')}
                      className="px-4 py-2 rounded-2xl bg-black/20 text-white font-bold text-xs hover:bg-black/30 border border-white/20 cursor-pointer flex items-center gap-1.5"
                    >
                      <MapPin className="w-4 h-4" />
                      <span>Ajustar Taxas por Bairro</span>
                    </button>
                    <button
                      onClick={onClose}
                      className="px-4 py-2 rounded-2xl bg-black/20 text-white font-bold text-xs hover:bg-black/30 border border-white/20 cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Ver Loja como Comprador</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Summary Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div 
                  onClick={() => setActiveTab('meus_produtos')}
                  className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm hover:border-red-300 transition-all cursor-pointer space-y-2"
                >
                  <div className="flex items-center justify-between text-stone-500">
                    <span className="text-[11px] font-bold uppercase">Meus Produtos</span>
                    <Package className="w-4 h-4 text-red-600" />
                  </div>
                  <span className="text-2xl font-black font-mono text-stone-900">{products.length}</span>
                  <p className="text-[11px] text-stone-500">Gerenciar catálogo e stock</p>
                </div>

                <div 
                  onClick={() => setActiveTab('gestao_pedidos')}
                  className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm hover:border-red-300 transition-all cursor-pointer space-y-2"
                >
                  <div className="flex items-center justify-between text-stone-500">
                    <span className="text-[11px] font-bold uppercase">Pedidos Luanda</span>
                    <Layers className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-2xl font-black font-mono text-stone-900">{orders.length}</span>
                  <p className="text-[11px] text-stone-500">{orders.filter(o => o.status === 'em_transito').length} pedidos em rota hoje</p>
                </div>

                <div 
                  onClick={() => setActiveTab('gestao_entregadores')}
                  className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm hover:border-red-300 transition-all cursor-pointer space-y-2"
                >
                  <div className="flex items-center justify-between text-stone-500">
                    <span className="text-[11px] font-bold uppercase">Estafetas Luanda</span>
                    <Truck className="w-4 h-4 text-amber-600" />
                  </div>
                  <span className="text-2xl font-black font-mono text-stone-900">{approvedCouriers.length}</span>
                  <p className="text-[11px] text-amber-700 font-bold">
                    {pendingCouriers.length > 0 ? `${pendingCouriers.length} aguardando aprovação` : 'Frota 100% verificada'}
                  </p>
                </div>

                <div 
                  onClick={() => setActiveTab('taxa_entrega')}
                  className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm hover:border-red-300 transition-all cursor-pointer space-y-2"
                >
                  <div className="flex items-center justify-between text-stone-500">
                    <span className="text-[11px] font-bold uppercase">Bairros Ativos</span>
                    <MapPin className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="text-2xl font-black font-mono text-stone-900">{luandaZones.length}</span>
                  <p className="text-[11px] text-stone-500">Taxas configuradas em Kwanzas</p>
                </div>
              </div>

              {/* SEÇÃO: CONTROLO DE ENTREGAS POR ENTREGADOR NO DIA CORRENTE (DISTRIBUIÇÃO COM IGUALDADE) */}
              {(() => {
                const isTodayOrder = (ord: Order) => {
                  if (!ord) return false;
                  if (ord.date && (ord.date.toLowerCase().includes('hoje') || ord.date.includes('Hoje'))) return true;
                  if (ord.timestamp) {
                    const orderDate = new Date(ord.timestamp);
                    const today = new Date();
                    return orderDate.getFullYear() === today.getFullYear() &&
                      orderDate.getMonth() === today.getMonth() &&
                      orderDate.getDate() === today.getDate();
                  }
                  return true;
                };

                const unassignedOrders = orders.filter(o => !o.assignedCourierId || o.assignedCourierId === '');

                // Calculate today metrics per courier
                const courierMetrics = approvedCouriers.map(c => {
                  const ordersToday = orders.filter(o => o.assignedCourierId === c.id && isTodayOrder(o));
                  const inTransit = ordersToday.filter(o => o.status === 'em_transito' || o.status === 'preparando').length;
                  const delivered = ordersToday.filter(o => o.status === 'entregue').length;
                  // Base or order count
                  const baseCount = c.todayDeliveriesCount ?? 0;
                  const totalToday = Math.max(ordersToday.length, baseCount);
                  const feesToday = ordersToday.reduce((sum, o) => sum + (o.deliveryFee || 0), 0);

                  return {
                    courier: c,
                    ordersToday,
                    inTransit,
                    delivered,
                    totalToday,
                    feesToday
                  };
                });

                const totalTodayAll = courierMetrics.reduce((sum, cm) => sum + cm.totalToday, 0);
                const minDeliveriesToday = courierMetrics.length > 0 ? Math.min(...courierMetrics.map(cm => cm.totalToday)) : 0;
                const maxDeliveriesToday = courierMetrics.length > 0 ? Math.max(...courierMetrics.map(cm => cm.totalToday)) : 0;
                const avgDeliveriesToday = courierMetrics.length > 0 ? (totalTodayAll / courierMetrics.length).toFixed(1) : '0';

                // Filter couriers by search
                const filteredCourierMetrics = courierMetrics.filter(cm => {
                  const q = homeCourierSearch.toLowerCase().trim();
                  if (!q) return true;
                  return (
                    cm.courier.name.toLowerCase().includes(q) ||
                    (cm.courier.vehicle || '').toLowerCase().includes(q) ||
                    (cm.courier.licensePlate || '').toLowerCase().includes(q) ||
                    (cm.courier.operatingZones || []).some(z => z.toLowerCase().includes(q))
                  );
                });

                // Sort: prioritize couriers with FEWEST deliveries today (for equal distribution!)
                const sortedCourierMetrics = [...filteredCourierMetrics].sort((a, b) => a.totalToday - b.totalToday);

                return (
                  <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-6">
                    {/* Header with Title and Equality Badge */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-2xl bg-red-100 text-red-700">
                            <Scale className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="font-black text-base text-stone-900">
                                Entregas por Entregador • Dia Corrente (Hoje)
                              </h4>
                              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                                Comissão: 1.000 Kz / Entrega
                              </span>
                            </div>
                            <p className="text-xs text-stone-500">
                              Monitore o volume diário de cada estafeta e distribua os pedidos com igualdade para equilibrar os ganhos de 1.000 Kz por entrega.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Date & Equality Status Indicator */}
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 text-stone-700 text-xs font-bold font-mono">
                          <Calendar className="w-3.5 h-3.5 text-stone-500" />
                          Hoje • Luanda
                        </span>
                        
                        {maxDeliveriesToday - minDeliveriesToday <= 1 ? (
                          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Distribuição Equilibrada
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                            Desnível ({maxDeliveriesToday - minDeliveriesToday} un de diferença)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Feedback Toast if assigned */}
                    {homeAssignFeedback && (
                      <div className={`p-4 rounded-2xl flex items-center justify-between border text-xs font-bold animate-in fade-in ${
                        homeAssignFeedback.type === 'warning' 
                          ? 'bg-amber-50 text-amber-900 border-amber-300' 
                          : 'bg-emerald-50 text-emerald-900 border-emerald-300'
                      }`}>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{homeAssignFeedback.msg}</span>
                        </div>
                        <button onClick={() => setHomeAssignFeedback(null)} className="text-stone-400 hover:text-stone-700 cursor-pointer">✕</button>
                      </div>
                    )}

                    {/* Key Daily Workload Metrics */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                        <span className="text-[10px] font-bold text-stone-500 uppercase">Total Entregas Hoje</span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-2xl font-black font-mono text-stone-900">{totalTodayAll}</span>
                          <span className="text-[11px] text-stone-500 font-medium">encomendas</span>
                        </div>
                        <span className="text-[10px] text-stone-400">Em toda a frota de Luanda</span>
                      </div>

                      <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                        <span className="text-[10px] font-bold text-stone-500 uppercase">Média / Entregador</span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-2xl font-black font-mono text-blue-600">{avgDeliveriesToday}</span>
                          <span className="text-[11px] text-blue-700 font-medium">entregas/dia</span>
                        </div>
                        <span className="text-[10px] text-stone-400">Meta de distribuição justa</span>
                      </div>

                      <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                        <span className="text-[10px] font-bold text-stone-500 uppercase">Estafetas Aprovados</span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-2xl font-black font-mono text-emerald-600">{approvedCouriers.length}</span>
                          <span className="text-[11px] text-emerald-700 font-medium">ativos</span>
                        </div>
                        <span className="text-[10px] text-stone-400">Disponíveis para rota</span>
                      </div>

                      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1">
                        <span className="text-[10px] font-bold text-amber-800 uppercase">Aguardando Atribuição</span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-2xl font-black font-mono text-amber-700">{unassignedOrders.length}</span>
                          <span className="text-[11px] text-amber-800 font-medium">pedidos</span>
                        </div>
                        <span className="text-[10px] text-amber-700 font-semibold">
                          {unassignedOrders.length > 0 ? 'Distribua abaixo para igualar' : 'Todos atribuídos'}
                        </span>
                      </div>
                    </div>

                    {/* Quick Unassigned Orders Dispatch Helper */}
                    {unassignedOrders.length > 0 && (
                      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-amber-600 shrink-0" />
                            <h5 className="font-bold text-xs text-amber-950">
                              Despacho Rápido com Recomendação de Igualdade ({unassignedOrders.length} pedidos pendentes)
                            </h5>
                          </div>
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-200/60 px-2.5 py-0.5 rounded-full">
                            💡 Sugestão automática para o estafeta com menos entregas hoje
                          </span>
                        </div>

                        <div className="space-y-2">
                          {unassignedOrders.map(unOrd => {
                            // Find best courier recommendation: approved courier with min deliveries today
                            const recommendedCourierMetric = [...courierMetrics].sort((a, b) => a.totalToday - b.totalToday)[0];
                            return (
                              <div 
                                key={unOrd.id}
                                className="p-3 bg-white rounded-2xl border border-amber-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-2xs"
                              >
                                <div className="space-y-0.5 min-w-0 flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono font-bold text-xs text-stone-900">{unOrd.orderNumber}</span>
                                    <span className="text-[10px] text-stone-400">•</span>
                                    <span className="text-xs text-stone-700 font-semibold truncate">{unOrd.customer.fullName}</span>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
                                      {unOrd.customer.neighborhood}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-stone-500 truncate">
                                    {unOrd.items.map(i => `${i.quantity}x ${i.product.title}`).join(', ')} • <strong>{formatKwanzas(unOrd.total)}</strong>
                                  </p>
                                </div>

                                <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
                                  {recommendedCourierMetric && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        onAssignCourierToOrder(unOrd.id, recommendedCourierMetric.courier.id);
                                        setHomeAssignFeedback({
                                          msg: `Pedido ${unOrd.orderNumber} atribuído com sucesso a ${recommendedCourierMetric.courier.name} (que tinha ${recommendedCourierMetric.totalToday} entregas hoje)!`,
                                          type: 'success'
                                        });
                                        setTimeout(() => setHomeAssignFeedback(null), 3500);
                                      }}
                                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer transition-all"
                                      title={`Atribuir a ${recommendedCourierMetric.courier.name} para equilibrar o número de entregas`}
                                    >
                                      <Scale className="w-3.5 h-3.5" />
                                      <span>Atribuir a {recommendedCourierMetric.courier.name.split(' ')[0]} ({recommendedCourierMetric.totalToday} hoje)</span>
                                    </button>
                                  )}

                                  <select
                                    onChange={(e) => {
                                      if (e.target.value) {
                                        onAssignCourierToOrder(unOrd.id, e.target.value);
                                        const cObj = approvedCouriers.find(c => c.id === e.target.value);
                                        setHomeAssignFeedback({
                                          msg: `Pedido ${unOrd.orderNumber} atribuído a ${cObj?.name || 'Estafeta'}!`,
                                          type: 'success'
                                        });
                                        setTimeout(() => setHomeAssignFeedback(null), 3500);
                                      }
                                    }}
                                    defaultValue=""
                                    className="px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-700 focus:outline-none focus:border-red-500 cursor-pointer"
                                  >
                                    <option value="" disabled>Outro estafeta...</option>
                                    {courierMetrics.map(cm => (
                                      <option key={cm.courier.id} value={cm.courier.id}>
                                        {cm.courier.name} ({cm.totalToday} entregas hoje)
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Search & Filter Bar for Couriers */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                      <div className="relative flex-1">
                        <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={homeCourierSearch}
                          onChange={(e) => setHomeCourierSearch(e.target.value)}
                          placeholder="Buscar estafeta por nome, veículo, matrícula ou zona de Luanda..."
                          className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-2xl text-xs text-stone-900 focus:outline-none focus:border-red-500 focus:bg-white transition-all"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setActiveTab('gestao_entregadores')}
                          className="px-3.5 py-2 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <Users className="w-3.5 h-3.5 text-stone-600" />
                          <span>Ver Frota Completa ({couriers.length})</span>
                        </button>
                      </div>
                    </div>

                    {/* Couriers Daily Workload Cards Grid */}
                    <div className="space-y-3">
                      {sortedCourierMetrics.length === 0 ? (
                        <div className="p-8 text-center bg-stone-50 border border-stone-200 rounded-2xl space-y-2">
                          <Truck className="w-7 h-7 text-stone-400 mx-auto" />
                          <p className="text-xs text-stone-600 font-bold">Nenhum entregador encontrado com este filtro.</p>
                        </div>
                      ) : (
                        sortedCourierMetrics.map((cm) => {
                          const isLeastLoaded = cm.totalToday === minDeliveriesToday;
                          const isMostLoaded = cm.totalToday === maxDeliveriesToday && cm.totalToday > 1 && maxDeliveriesToday > minDeliveriesToday;

                          return (
                            <div 
                              key={cm.courier.id}
                              className={`p-4 sm:p-5 rounded-3xl border transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 ${
                                isLeastLoaded && unassignedOrders.length > 0
                                  ? 'bg-emerald-50/20 border-emerald-200 ring-1 ring-emerald-500/20 shadow-xs'
                                  : 'bg-white border-stone-200 shadow-2xs hover:border-stone-300'
                              }`}
                            >
                              {/* Courier Profile Info */}
                              <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                                <div className="relative shrink-0">
                                  <img 
                                    src={cm.courier.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'} 
                                    alt={cm.courier.name}
                                    className="w-13 h-13 rounded-2xl object-cover border border-stone-200"
                                    referrerPolicy="no-referrer"
                                  />
                                  <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" title="Online / Aprovado" />
                                </div>

                                <div className="space-y-1 min-w-0 flex-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <h5 className="font-bold text-sm text-stone-900 truncate">
                                      {cm.courier.name}
                                    </h5>
                                    
                                    {/* Equal Distribution Recommendation Badge */}
                                    {isLeastLoaded ? (
                                      <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                                        <Award className="w-3 h-3 text-emerald-600" />
                                        <span>Prioridade de Atribuição (Menor Carga Hoje)</span>
                                      </span>
                                    ) : isMostLoaded ? (
                                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                                        Carga Mais Elevada Hoje
                                      </span>
                                    ) : (
                                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
                                        Carga Equilibrada
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-500">
                                    <span className="font-mono text-stone-700 font-semibold flex items-center gap-1">
                                      <Phone className="w-3 h-3 text-stone-400" />
                                      {cm.courier.phone}
                                    </span>
                                    <span>•</span>
                                    <span className="truncate">
                                      🛵 {cm.courier.vehicle || 'Moto'} ({cm.courier.licensePlate || 'S/ Matrícula'})
                                    </span>
                                    {cm.courier.operatingZones && cm.courier.operatingZones.length > 0 && (
                                      <>
                                        <span>•</span>
                                        <span className="text-stone-600 font-medium truncate">
                                          📍 {cm.courier.operatingZones.join(', ')}
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Number of Deliveries Today (Metrics) */}
                              <div className="w-full lg:w-auto flex flex-wrap sm:flex-nowrap items-center justify-between lg:justify-end gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-stone-100 shrink-0">
                                <div className="flex items-center gap-2">
                                  {/* Total Deliveries Today Badge */}
                                  <div className="px-3.5 py-2 rounded-2xl bg-stone-100 border border-stone-200 text-center min-w-[95px]">
                                    <span className="text-[9px] uppercase font-bold text-stone-500 block tracking-wider">
                                      Entregas Hoje
                                    </span>
                                    <span className={`text-lg font-black font-mono block ${
                                      cm.totalToday === 0 ? 'text-stone-400' : isLeastLoaded ? 'text-emerald-700' : 'text-stone-900'
                                    }`}>
                                      {cm.totalToday} {cm.totalToday === 1 ? 'entrega' : 'entregas'}
                                    </span>
                                  </div>

                                  {/* In Transit vs Delivered Breakdown */}
                                  <div className="px-3 py-2 rounded-2xl bg-stone-50 border border-stone-200 text-left text-[11px] space-y-0.5 min-w-[110px]">
                                    <div className="flex items-center justify-between gap-2">
                                      <span className="text-stone-500">Em rota agora:</span>
                                      <span className="font-mono font-bold text-amber-600">{cm.inTransit}</span>
                                    </div>
                                    <div className="flex items-center justify-between gap-2">
                                      <span className="text-stone-500">Concluídas hoje:</span>
                                      <span className="font-mono font-bold text-emerald-600">{cm.delivered}</span>
                                    </div>
                                  </div>

                                  {/* Earnings Today Box (1000 Kz / delivery) */}
                                  <div className="px-3.5 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-center min-w-[105px]">
                                    <span className="text-[9px] uppercase font-bold text-emerald-800 block tracking-wider">
                                      Ganhos Hoje
                                    </span>
                                    <span className="text-sm font-black font-mono text-emerald-700 block">
                                      {formatKwanzas(cm.delivered * 1000)}
                                    </span>
                                    <span className="text-[9px] text-emerald-600 font-semibold block">
                                      1.000 Kz/entrega
                                    </span>
                                  </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-1.5">
                                  {unassignedOrders.length > 0 && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const firstUnassigned = unassignedOrders[0];
                                        if (firstUnassigned) {
                                          onAssignCourierToOrder(firstUnassigned.id, cm.courier.id);
                                          setHomeAssignFeedback({
                                            msg: `Pedido ${firstUnassigned.orderNumber} atribuído a ${cm.courier.name}!`,
                                            type: 'success'
                                          });
                                          setTimeout(() => setHomeAssignFeedback(null), 3500);
                                        }
                                      }}
                                      className="px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                                      title="Atribuir próximo pedido pendente a este estafeta"
                                    >
                                      <Plus className="w-3.5 h-3.5" />
                                      <span>+ Atribuir Pedido</span>
                                    </button>
                                  )}

                                  <a
                                    href={`tel:${cm.courier.phone.replace(/[^0-9+]/g, '')}`}
                                    className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                                    title="Ligar para o Estafeta"
                                  >
                                    <Phone className="w-4 h-4" />
                                  </a>

                                  <button
                                    type="button"
                                    onClick={() => setActiveTab('gestao_pedidos')}
                                    className="px-2.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
                                    title="Ver todos os pedidos na aba Gestão de Pedidos"
                                  >
                                    Ver Pedidos
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* TAB 2: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-black text-base text-stone-900">Dashboard de Performance Geral</h3>
                  <p className="text-xs text-stone-500">Métricas financeiras, encomendas e conversões na província de Luanda</p>
                </div>
                <span className="text-xs font-mono text-stone-400 bg-white px-3 py-1 rounded-xl border border-stone-200">
                  Tempo Real • Luanda
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-1">
                  <span className="text-[10px] uppercase font-bold text-stone-400">Receita Bruta Total</span>
                  <span className="text-2xl font-black font-mono text-stone-900 block">
                    {formatKwanzas(totalGrossSales)}
                  </span>
                  <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <ArrowUpRight className="w-3.5 h-3.5" /> 100% Cash on Delivery
                  </span>
                </div>

                <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-1">
                  <span className="text-[10px] uppercase font-bold text-stone-400">Lucro Líquido Estimado</span>
                  <span className="text-2xl font-black font-mono text-emerald-600 block">
                    {formatKwanzas(platformNetProfit)}
                  </span>
                  <span className="text-[11px] text-stone-500">Após dedução de fretes e comissões</span>
                </div>

                <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-1">
                  <span className="text-[10px] uppercase font-bold text-stone-400">Comissões de Afiliados</span>
                  <span className="text-2xl font-black font-mono text-blue-600 block">
                    {formatKwanzas(totalCommissionsOwed)}
                  </span>
                  <span className="text-[11px] text-stone-500">Geradas pela equipa de divulgação</span>
                </div>
              </div>

              {/* Orders by status table */}
              <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-3">
                <h4 className="font-bold text-sm text-stone-900">Estado Atual dos Pedidos em Luanda</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-center">
                    <span className="text-[10px] uppercase font-bold text-amber-800 block">Recebidos</span>
                    <span className="text-xl font-mono font-black text-amber-900">
                      {orders.filter(o => o.status === 'recebido').length}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 text-center">
                    <span className="text-[10px] uppercase font-bold text-blue-800 block">A Preparar</span>
                    <span className="text-xl font-mono font-black text-blue-900">
                      {orders.filter(o => o.status === 'preparando').length}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-purple-50 border border-purple-200 text-center">
                    <span className="text-[10px] uppercase font-bold text-purple-800 block">Em Trânsito</span>
                    <span className="text-xl font-mono font-black text-purple-900">
                      {orders.filter(o => o.status === 'em_transito').length}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                    <span className="text-[10px] uppercase font-bold text-emerald-800 block">Entregues</span>
                    <span className="text-xl font-mono font-black text-emerald-900">
                      {orders.filter(o => o.status === 'entregue').length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CARTEIRA */}
          {activeTab === 'carteira' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-black text-base text-stone-900">Carteira da Plataforma</h3>
                <p className="text-xs text-stone-500">Saldos em Kwanzas, valores cobrados por estafetas e levantamento de receitas</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-6 rounded-3xl bg-stone-900 text-white shadow-md space-y-2 col-span-1 sm:col-span-2">
                  <div className="flex items-center justify-between text-stone-400">
                    <span className="text-xs font-bold uppercase">Saldo Disponível na Carteira</span>
                    <Wallet className="w-5 h-5 text-red-500" />
                  </div>
                  <span className="text-3xl sm:text-4xl font-black font-mono text-white block">
                    {formatKwanzas(platformNetProfit)}
                  </span>
                  <div className="pt-2 flex items-center gap-2 text-xs text-stone-300">
                    <CreditCard className="w-4 h-4 text-emerald-400" />
                    <span>Conta de Liquidação: <strong>{adminIban}</strong></span>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-2">
                  <span className="text-xs font-bold uppercase text-stone-400">Dinheiro Físico em Trânsito</span>
                  <span className="text-2xl font-black font-mono text-amber-600 block">
                    {formatKwanzas(cashInTransitWithCouriers)}
                  </span>
                  <p className="text-[11px] text-stone-500">
                    Valor a ser entregue em mãos pelos estafetas ao final do turno.
                  </p>
                </div>
              </div>

              {/* Request Payout Box */}
              <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
                <h4 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                  <Banknote className="w-4 h-4 text-red-600" />
                  <span>Transferir Saldo para Conta Bancária (BAI / BFA / BIC / Atlântico)</span>
                </h4>

                {withdrawalSuccess ? (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Transferência de {formatKwanzas(Number(withdrawalAmount) || 0)} enviada com sucesso para o IBAN {adminIban || 'configurado'}!</span>
                  </div>
                ) : (
                  <form onSubmit={handleWithdrawalSubmit} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-stone-700">Montante a Transferir (Kz) *</label>
                        <input
                          type="number"
                          required
                          value={withdrawalAmount}
                          onChange={(e) => setWithdrawalAmount(e.target.value)}
                          placeholder="Ex: 100000"
                          className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-3.5 py-2.5 text-xs font-mono font-bold text-stone-900"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-stone-700">IBAN de Destino</label>
                        <input
                          type="text"
                          readOnly
                          value={adminIban}
                          className="w-full bg-stone-100 border border-stone-200 rounded-2xl px-3.5 py-2.5 text-xs font-mono text-stone-600 cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm cursor-pointer"
                    >
                      Efetuar Levantamento para Banco
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: GESTÃO FINANCEIRA */}
          {activeTab === 'gestao_financeira' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-black text-base text-stone-900">Gestão Financeira & Balanços</h3>
                <p className="text-xs text-stone-500">Relatório detalhado de entradas, despesas operacionais e taxas por estafeta</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-1">
                  <span className="text-[10px] uppercase font-bold text-stone-400">Total de Fretes Cobrados</span>
                  <span className="font-mono font-bold text-lg text-stone-900 block">{formatKwanzas(totalDeliveryFeesCollected)}</span>
                  <span className="text-[10px] text-stone-500">Taxas cobradas aos clientes</span>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-1">
                  <span className="text-[10px] uppercase font-bold text-emerald-700">Comissões dos Estafetas</span>
                  <span className="font-mono font-bold text-lg text-emerald-600 block">
                    {formatKwanzas(orders.filter(o => o.status === 'entregue').length * 1000)}
                  </span>
                  <span className="text-[10px] text-emerald-700">1.000 Kz por entrega concluída</span>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-1">
                  <span className="text-[10px] uppercase font-bold text-teal-700">Lucro Frete da Loja</span>
                  <span className="font-mono font-bold text-lg text-teal-600 block">
                    {formatKwanzas(
                      Math.max(
                        0,
                        orders.filter(o => o.status === 'entregue').reduce((s, o) => s + o.deliveryFee, 0) -
                          (orders.filter(o => o.status === 'entregue').length * 1000)
                      )
                    )}
                  </span>
                  <span className="text-[10px] text-teal-700">Margem retida do frete</span>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-1">
                  <span className="text-[10px] uppercase font-bold text-stone-400">Comissões Afiliados</span>
                  <span className="font-mono font-bold text-lg text-blue-600 block">{formatKwanzas(totalCommissionsOwed)}</span>
                  <span className="text-[10px] text-stone-500">Vendas por link de divulgação</span>
                </div>
              </div>

              {/* PAYOUT REQUESTS SECTION (Afiliados e Entregadores) */}
              <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
                  <div>
                    <h4 className="font-black text-sm text-stone-900 flex items-center gap-2">
                      <Banknote className="w-5 h-5 text-red-600" />
                      <span>Solicitações de Pagamento & Saques (Afiliados e Entregadores)</span>
                    </h4>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Pague as comissões solicitadas pelos Afiliados e os saques de fretes solicitados pelos Entregadores.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-3 py-1 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 font-mono">
                      {payoutRequests.filter(p => p.status === 'pendente').length} Pendentes
                    </span>
                    <span className="text-xs font-bold px-3 py-1 rounded-xl bg-stone-100 text-stone-700 font-mono">
                      {payoutRequests.length} Total
                    </span>
                  </div>
                </div>

                {payoutRequests.length === 0 ? (
                  <div className="py-8 text-center bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                    <p className="text-xs font-bold text-stone-700">Nenhuma solicitação de saque no momento.</p>
                    <p className="text-[11px] text-stone-500">Quando os afiliados ou entregadores pedirem pagamento na carteira, aparecerá aqui para você pagar com um clique.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {payoutRequests.map((payout) => {
                      const isAffiliate = payout.type === 'afiliado';
                      const isPending = payout.status === 'pendente';
                      const isPaid = payout.status === 'pago';
                      const isBeingPaid = payingRequestId === payout.id;

                      return (
                        <div
                          key={payout.id}
                          className={`p-4 rounded-2xl border transition-all ${
                            isPending
                              ? 'bg-amber-50/40 border-amber-200 shadow-2xs'
                              : isPaid
                              ? 'bg-emerald-50/30 border-emerald-200'
                              : 'bg-stone-50 border-stone-200 opacity-75'
                          }`}
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            {/* Requester Info */}
                            <div className="space-y-1 min-w-[240px]">
                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-lg border uppercase ${
                                  isAffiliate 
                                    ? 'bg-blue-100 text-blue-800 border-blue-200' 
                                    : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                }`}>
                                  {isAffiliate ? '👤 Afiliado' : '🛵 Entregador'}
                                </span>
                                <span className="font-bold text-xs text-stone-900">{payout.requesterName}</span>
                              </div>
                              <p className="text-[11px] text-stone-500">{payout.requesterRole}</p>
                              <div className="text-[11px] text-stone-600 flex items-center gap-2 pt-0.5">
                                <Clock className="w-3.5 h-3.5 text-stone-400" />
                                <span>Solicitado: <strong>{typeof payout.requestedAt === 'number' ? new Date(payout.requestedAt).toLocaleDateString('pt-AO') + ' ' + new Date(payout.requestedAt).toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' }) : payout.requestedAt}</strong></span>
                              </div>
                            </div>

                            {/* Bank / Express Details */}
                            <div className="p-3 rounded-xl bg-white border border-stone-200 text-xs space-y-1 flex-1">
                              <span className="text-[10px] uppercase font-bold text-stone-400 block">Dados para Pagamento</span>
                              {payout.paymentMethod === 'multicaixa_express' || (!payout.iban && payout.multicaixaExpressPhone) ? (
                                <div className="space-y-0.5">
                                  <div className="font-bold text-stone-900 flex items-center gap-1.5">
                                    <span>📱 Multicaixa Express:</span>
                                    <span className="font-mono text-blue-700">{payout.multicaixaExpressPhone || payout.requesterPhone || 'Contacto do utilizador'}</span>
                                  </div>
                                  <span className="text-[10px] text-stone-500">Titular: {payout.accountHolder || payout.requesterName}</span>
                                </div>
                              ) : (
                                <div className="space-y-0.5">
                                  <div className="font-bold text-stone-900">
                                    <span>🏦 IBAN: </span>
                                    <span className="font-mono text-stone-800 text-[11px]">{payout.iban || 'AO06.0040.0000.0000.0000.0000.0'}</span>
                                  </div>
                                  <span className="text-[10px] text-stone-500">{payout.bankName || 'Banco em Angola'} • {payout.accountHolder || payout.requesterName}</span>
                                </div>
                              )}
                            </div>

                            {/* Amount & Status / Actions */}
                            <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3 min-w-[200px]">
                              <div className="text-left md:text-right">
                                <span className="text-[10px] uppercase font-bold text-stone-400 block">Valor a Pagar</span>
                                <span className="text-xl font-black font-mono text-stone-900 block">
                                  {formatKwanzas(payout.amountAOA || payout.amount || 0)}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                {isPaid ? (
                                  <div className="text-right">
                                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-xl">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                      <span>Pago com Sucesso</span>
                                    </span>
                                    {(payout.transactionRef || payout.paymentProofReference) && (
                                      <span className="block text-[10px] font-mono text-emerald-700 mt-0.5">
                                        Ref: {payout.transactionRef || payout.paymentProofReference}
                                      </span>
                                    )}
                                  </div>
                                ) : isPending ? (
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <button
                                      type="button"
                                      onClick={() => setPayingRequestId(isBeingPaid ? null : payout.id)}
                                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm cursor-pointer flex items-center gap-1.5 transition-all"
                                    >
                                      <CreditCard className="w-3.5 h-3.5" />
                                      <span>Pagar Agora</span>
                                    </button>

                                    {onRejectPayoutRequest && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (confirm(`Tem a certeza que deseja rejeitar o pedido de ${formatKwanzas(payout.amountAOA || payout.amount || 0)} de ${payout.requesterName}?`)) {
                                            onRejectPayoutRequest(payout.id, 'Dados bancários divergentes');
                                          }
                                        }}
                                        className="px-3 py-2 rounded-xl bg-stone-200 hover:bg-red-100 hover:text-red-700 text-stone-700 font-bold text-xs transition-colors cursor-pointer"
                                        title="Rejeitar solicitação"
                                      >
                                        Rejeitar
                                      </button>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-xs font-bold text-red-700 bg-red-100 border border-red-200 px-3 py-1 rounded-xl">
                                    Rejeitado
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Payment Confirmation Drawer / Inline Box */}
                          {isBeingPaid && (
                            <div className="mt-3 pt-3 border-t border-amber-200 bg-white p-4 rounded-xl space-y-3 animate-in fade-in">
                              <div className="flex items-center justify-between">
                                <h5 className="font-bold text-xs text-stone-900 flex items-center gap-1.5">
                                  <CreditCard className="w-4 h-4 text-emerald-600" />
                                  <span>Confirmar Pagamento de {formatKwanzas(payout.amountAOA || payout.amount || 0)} para {payout.requesterName}</span>
                                </h5>
                                <button
                                  type="button"
                                  onClick={() => setPayingRequestId(null)}
                                  className="text-stone-400 hover:text-stone-700 text-xs font-bold"
                                >
                                  Cancelar
                                </button>
                              </div>

                              <p className="text-xs text-stone-600">
                                Efetue a transferência no seu aplicativo Multicaixa Express / Internet Banking para {payout.paymentMethod === 'multicaixa_express' || (!payout.iban && payout.multicaixaExpressPhone) ? (payout.multicaixaExpressPhone || payout.requesterPhone) : payout.iban} e insira o código de referência abaixo:
                              </p>

                              <div className="flex flex-col sm:flex-row items-center gap-2">
                                <input
                                  type="text"
                                  placeholder="Ex: MCX-884920 ou BAI-TX-99321 (Opcional)"
                                  value={paymentRefInput}
                                  onChange={(e) => setPaymentRefInput(e.target.value)}
                                  className="w-full sm:flex-1 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-stone-900 focus:outline-none focus:border-emerald-500"
                                />

                                <button
                                  type="button"
                                  onClick={() => {
                                    const ref = paymentRefInput.trim() || `MCX-${Math.floor(100000 + Math.random() * 900000)}`;
                                    if (onApprovePayoutRequest) {
                                      onApprovePayoutRequest(payout.id, ref);
                                    }
                                    setPayingRequestId(null);
                                    setPaymentRefInput('');
                                    setPayoutSuccessMessage(`Pagamento de ${formatKwanzas(payout.amountAOA || payout.amount || 0)} a ${payout.requesterName} confirmado com sucesso! (Ref: ${ref})`);
                                    setTimeout(() => setPayoutSuccessMessage(null), 5000);
                                  }}
                                  className="w-full sm:w-auto px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm cursor-pointer whitespace-nowrap"
                                >
                                  Confirmar e Marcar como Pago
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Transactions Ledger */}
              <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-3">
                <h4 className="font-bold text-sm text-stone-900">Extrato Recente de Entregas, Fretes & Comissões em Luanda</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-50 text-stone-500 uppercase text-[10px] border-b border-stone-200">
                      <tr>
                        <th className="py-2.5 px-3">Pedido</th>
                        <th className="py-2.5 px-3">Cliente / Bairro</th>
                        <th className="py-2.5 px-3">Método Pagamento</th>
                        <th className="py-2.5 px-3">Frete Cliente</th>
                        <th className="py-2.5 px-3">Comissão Estafeta</th>
                        <th className="py-2.5 px-3">Lucro Frete Loja</th>
                        <th className="py-2.5 px-3">Comissão Afiliado</th>
                        <th className="py-2.5 px-3 text-right">Total Pedido</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200 text-stone-800">
                      {orders.map((ord) => {
                        const isDelivered = ord.status === 'entregue';
                        const courierCommission = isDelivered ? 1000 : 0;
                        const storeDeliveryProfit = isDelivered ? Math.max(0, ord.deliveryFee - 1000) : 0;

                        return (
                          <tr key={ord.id} className="hover:bg-stone-50">
                            <td className="py-2.5 px-3 font-mono font-bold text-stone-900">{ord.orderNumber}</td>
                            <td className="py-2.5 px-3">
                              <span className="font-medium block">{ord.customer.fullName}</span>
                              <span className="text-[10px] text-stone-500">{ord.customer.neighborhood}</span>
                            </td>
                            <td className="py-2.5 px-3">
                              <span className="px-2 py-0.5 rounded-lg bg-stone-100 font-medium">
                                {ord.customer.paymentMethod === 'dinheiro_entrega' ? '💵 Dinheiro' : '📱 Express'}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 font-mono text-stone-700 font-semibold">{formatKwanzas(ord.deliveryFee)}</td>
                            <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">
                              {isDelivered ? '1.000 Kz' : <span className="text-stone-400 font-normal">Pendente</span>}
                            </td>
                            <td className="py-2.5 px-3 font-mono font-semibold text-teal-700">
                              {isDelivered ? formatKwanzas(storeDeliveryProfit) : <span className="text-stone-400 font-normal">-</span>}
                            </td>
                            <td className="py-2.5 px-3 font-mono text-blue-600">
                              {ord.affiliateCode ? `${formatKwanzas(ord.affiliateCommissionAmount || Math.round(ord.subtotal * 0.08))}` : '0 Kz'}
                            </td>
                            <td className="py-2.5 px-3 font-mono font-black text-red-600 text-right">
                              {formatKwanzas(ord.total)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: GESTÃO DE PEDIDOS */}
          {activeTab === 'gestao_pedidos' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-black text-base text-stone-900">Gestão de Pedidos & Despacho</h3>
                  <p className="text-xs text-stone-500">
                    Acompanhe as encomendas em Luanda, atribua estafetas aprovados e altere o status de entrega.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {orders.length === 0 ? (
                  <div className="p-12 text-center bg-stone-50 border border-stone-200 rounded-3xl space-y-2">
                    <Layers className="w-8 h-8 text-stone-400 mx-auto" />
                    <p className="text-xs text-stone-600 font-bold">Nenhum pedido efetuado ainda.</p>
                  </div>
                ) : (
                  orders.map((ord) => (
                    <div key={ord.id} className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-sm text-stone-900">{ord.orderNumber}</span>
                          <span className="text-xs text-stone-400">•</span>
                          <span className="text-xs text-stone-500">{ord.date}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-stone-700">Estado:</span>
                          <select
                            value={ord.status}
                            onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as OrderStatus)}
                            className="bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1 text-xs font-bold text-stone-900 focus:outline-none focus:border-red-500 cursor-pointer"
                          >
                            <option value="recebido">Recebido</option>
                            <option value="preparando">A Preparar Embalagem</option>
                            <option value="em_transito">Em Trânsito (Estafeta na rota)</option>
                            <option value="entregue">Entregue (Finalizado)</option>
                            <option value="cancelado">Cancelado</option>
                          </select>
                        </div>
                      </div>

                      {/* Customer & Address */}
                      <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-stone-400 block">Cliente & Contacto</span>
                          <span className="font-bold text-stone-900 block">{ord.customer.fullName}</span>
                          <span className="font-mono text-stone-600 block">{ord.customer.phone}</span>
                        </div>
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="text-[10px] uppercase font-bold text-stone-400 block">Destino em Luanda</span>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${
                              ord.customer.deliveryType === 'paragem'
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                : 'bg-red-100 text-red-800 border-red-200'
                            }`}>
                              {ord.customer.deliveryType === 'paragem' ? '🚏 Na Paragem' : '🏠 À Porta'}
                            </span>
                          </div>
                          <span className="font-semibold text-stone-800 block">
                            {ord.customer.neighborhood}, {ord.customer.municipalityName.split('(')[0]}
                          </span>
                          {ord.customer.deliveryType === 'paragem' && ord.customer.busStopName && (
                            <span className="text-emerald-700 font-bold block text-[11px]">
                              🚏 Ponto de Encontro: {ord.customer.busStopName}
                            </span>
                          )}
                          <span className="text-stone-500 block truncate">{ord.customer.streetAddress} (Ref: {ord.customer.referencePoint})</span>
                        </div>
                      </div>

                      {/* Assign Courier and totals */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <Truck className="w-4 h-4 text-stone-400 shrink-0" />
                          <span className="text-xs text-stone-600 font-medium">Estafeta Responsável:</span>
                          <select
                            value={ord.assignedCourierId || ''}
                            onChange={(e) => onAssignCourierToOrder(ord.id, e.target.value)}
                            className="bg-white border border-stone-300 rounded-xl px-2 py-1 text-xs text-stone-800 font-semibold cursor-pointer"
                          >
                            <option value="">-- Atribuir Estafeta --</option>
                            {approvedCouriers.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name} ({c.vehicle})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs text-stone-500">
                            Total a Cobrar: <strong className="font-mono text-red-600 text-sm font-black">{formatKwanzas(ord.total)}</strong>
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 6: GESTÃO DE ENTREGADORES */}
          {activeTab === 'gestao_entregadores' && (
            <div className="space-y-5">
              <div>
                <h3 className="font-black text-base text-stone-900">Gestão de Entregadores & Frota de Luanda</h3>
                <p className="text-xs text-stone-500">
                  Aprovação de novos estafetas com veículos, matrículas e rotas para pagamentos Cash on Delivery.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {couriers.length === 0 ? (
                  <div className="p-12 text-center bg-stone-50 border border-stone-200 rounded-3xl space-y-2">
                    <Truck className="w-8 h-8 text-stone-400 mx-auto" />
                    <p className="text-xs text-stone-600 font-bold">Nenhum entregador registado no momento.</p>
                  </div>
                ) : (
                  couriers.map((c) => {
                    const isPending = c.courierStatus === 'pendente';
                    return (
                      <div 
                        key={c.id}
                        className={`p-5 rounded-3xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                          isPending 
                            ? 'bg-amber-50/60 border-amber-300 shadow-sm' 
                            : 'bg-white border-stone-200 shadow-sm'
                        }`}
                      >
                        <div className="flex items-start gap-3.5">
                          <img 
                            src={c.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'} 
                            alt="" 
                            className="w-12 h-12 rounded-2xl object-cover shrink-0 border border-stone-200" 
                            referrerPolicy="no-referrer"
                          />
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-stone-900">{c.name}</span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${
                                isPending ? 'bg-amber-500 text-stone-950 animate-pulse' : 'bg-emerald-100 text-emerald-800'
                              }`}>
                                {isPending ? '⏳ Pendente de Aprovação' : '✓ Entregador Aprovado'}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 text-xs text-stone-600">
                              <span className="flex items-center gap-1 font-mono">
                                <Phone className="w-3.5 h-3.5 text-stone-400" />
                                {c.phone}
                              </span>
                              <span>•</span>
                              <span>Veículo: <strong>{c.vehicle || 'Moto'}</strong></span>
                              <span>•</span>
                              <span>Matrícula: <strong className="font-mono">{c.licensePlate || 'N/A'}</strong></span>
                            </div>

                            {c.operatingZones && c.operatingZones.length > 0 && (
                              <p className="text-[11px] text-stone-500">
                                Zonas de entrega: {c.operatingZones.join(', ')}
                              </p>
                            )}

                            {/* Delivery & Commission Stats */}
                            <div className="flex flex-wrap items-center gap-2 pt-1">
                              <span className="text-[11px] font-mono font-bold bg-stone-100 text-stone-700 px-2.5 py-1 rounded-lg border border-stone-200">
                                📦 {c.totalDeliveriesCompleted || 0} entregas feitas
                              </span>
                              <span className="text-[11px] font-mono font-bold bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-200">
                                💰 Ganhos: {formatKwanzas((c.totalDeliveriesCompleted || 0) * 1000)} (1.000 Kz/un)
                              </span>
                              {(c.cashCollectedToDeposit || 0) > 0 && (
                                <span className="text-[11px] font-mono font-bold bg-amber-50 text-amber-900 px-2.5 py-1 rounded-lg border border-amber-200">
                                  💵 Em mãos: {formatKwanzas(c.cashCollectedToDeposit || 0)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-stone-200">
                          {isPending ? (
                            <>
                              <button
                                onClick={() => onApproveCourier(c.id)}
                                className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                              >
                                <Check className="w-4 h-4" />
                                <span>Aprovar Entregador</span>
                              </button>
                              <button
                                onClick={() => onRejectCourier(c.id)}
                                className="px-3 py-2 rounded-2xl bg-red-100 hover:bg-red-200 text-red-700 font-bold text-xs cursor-pointer"
                              >
                                Recusar
                              </button>
                            </>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1">
                                <ShieldCheck className="w-4 h-4" /> Apto para Entregas
                              </span>
                              <button
                                onClick={() => onRejectCourier(c.id)}
                                className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-red-50 text-stone-600 hover:text-red-700 text-xs font-semibold cursor-pointer"
                              >
                                Suspender
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 7: GESTÃO DE AFILIADOS */}
          {activeTab === 'gestao_afiliados' && (
            <div className="space-y-5">
              <div>
                <h3 className="font-black text-base text-stone-900">Gestão de Afiliados & Comissões</h3>
                <p className="text-xs text-stone-500">
                  Acompanhe os divulgadores da plataforma e os ganhos gerados por cada código de afiliado.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {affiliates.length === 0 ? (
                  <div className="p-12 text-center bg-stone-50 border border-stone-200 rounded-3xl space-y-2">
                    <DollarSign className="w-8 h-8 text-stone-400 mx-auto" />
                    <p className="text-xs text-stone-600 font-bold">Nenhum afiliado registado ainda.</p>
                  </div>
                ) : (
                  affiliates.map((af) => (
                    <div key={af.id} className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <img src={af.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'} alt="" className="w-12 h-12 rounded-2xl object-cover border border-stone-200" referrerPolicy="no-referrer" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-stone-900">{af.name}</span>
                            <span className="font-mono text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200">
                              {af.affiliateCode || 'AF-01'}
                            </span>
                          </div>
                          <span className="text-xs text-stone-500 block">{af.email} • {af.phone}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-5 text-xs">
                        <div>
                          <span className="text-[10px] uppercase text-stone-400 block font-bold">Vendas Concluídas</span>
                          <span className="font-bold text-stone-900 text-sm">{af.totalSalesCount || 0}</span>
                        </div>

                        <div>
                          <span className="text-[10px] uppercase text-stone-400 block font-bold">Comissão Acumulada</span>
                          <span className="font-mono font-bold text-emerald-600 text-sm">{formatKwanzas(af.totalCommissionEarned || 0)}</span>
                        </div>

                        <div>
                          <span className="text-[10px] uppercase text-stone-400 block font-bold">Saldo Disponível</span>
                          <span className="font-mono font-bold text-blue-600 text-sm">{formatKwanzas(af.balanceAOA || 0)}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 8: TAXA DE ENTREGA */}
          {activeTab === 'taxa_entrega' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-black text-base text-stone-900 flex items-center gap-2">
                    <span>Taxas de Entrega por Bairro em Luanda</span>
                    <span className="text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded-full uppercase">
                      Porta vs Paragem
                    </span>
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Configure os dois valores de frete cobrados por bairro: entrega direta à porta da residência e entrega no ponto de paragem de autocarros/táxi.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingZoneId(null);
                    setZoneName('');
                    setZoneNeighborhood('');
                    setZoneFee('2000');
                    setZoneFeeDoor('2000');
                    setZoneFeeBusStop('1200');
                    setZoneBusStops('');
                    setIsZoneFormOpen(!isZoneFormOpen);
                  }}
                  className="px-4 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{isZoneFormOpen ? 'Fechar Formulário' : '+ Novo Bairro / Taxa'}</span>
                </button>
              </div>

              {/* Courier Commission & Delivery Fee Dual Policy Callout Banner */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Rule Card 1: Door Delivery */}
                <div className="p-4 rounded-3xl bg-red-50/60 border border-red-200 flex items-start gap-3">
                  <div className="p-2.5 rounded-2xl bg-red-600 text-white shrink-0">
                    <Home className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-black text-xs text-red-950">
                      1. Modalidade: Entrega à Porta de Casa
                    </h5>
                    <p className="text-[11px] text-red-900 mt-0.5 leading-relaxed">
                      O estafeta desloca-se até à morada/casa/condomínio do cliente. Remuneração: <strong>1.000 Kz fixos</strong> para o estafeta + remanescente de frete como lucro da loja.
                    </p>
                  </div>
                </div>

                {/* Rule Card 2: Bus Stop Delivery */}
                <div className="p-4 rounded-3xl bg-emerald-50/60 border border-emerald-200 flex items-start gap-3">
                  <div className="p-2.5 rounded-2xl bg-emerald-600 text-white shrink-0">
                    <Navigation className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-black text-xs text-emerald-950">
                      2. Modalidade: Entrega na Paragem do Bairro
                    </h5>
                    <p className="text-[11px] text-emerald-900 mt-0.5 leading-relaxed">
                      Encontro com o cliente na paragem ou ponto de táxi indicado. Frete mais acessível. Remuneração: <strong>1.000 Kz fixos</strong> para o estafeta.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section Filter Switcher */}
              <div className="flex items-center gap-2 border-b border-stone-200 pb-2 overflow-x-auto">
                <button
                  onClick={() => setZoneDeliverySectionTab('todas')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    zoneDeliverySectionTab === 'todas'
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  📋 Visão Geral (Ambas as Taxas)
                </button>
                <button
                  onClick={() => setZoneDeliverySectionTab('porta')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    zoneDeliverySectionTab === 'porta'
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-red-50 text-red-700 hover:bg-red-100'
                  }`}
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Secção 1: Taxas com Entrega à Porta</span>
                </button>
                <button
                  onClick={() => setZoneDeliverySectionTab('paragem')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    zoneDeliverySectionTab === 'paragem'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                  }`}
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Secção 2: Taxas com Entrega na Paragem</span>
                </button>
              </div>

              {/* Add/Edit Neighborhood Delivery Fee Form */}
              {isZoneFormOpen && (
                <form onSubmit={handleSaveZone} className="p-5 rounded-3xl bg-stone-50 border border-stone-200 space-y-5 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                    <h4 className="font-bold text-sm text-stone-900">
                      {editingZoneId ? 'Editar Taxas do Bairro (Porta & Paragem)' : 'Configurar Novo Bairro com Duas Taxas de Entrega'}
                    </h4>
                    <span className="text-[11px] text-stone-500">Província de Luanda</span>
                  </div>

                  {/* General Zone Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-700">Município de Luanda *</label>
                      <select
                        value={zoneMunicipality}
                        onChange={(e) => setZoneMunicipality(e.target.value)}
                        className="w-full bg-white border border-stone-200 rounded-2xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-red-500 cursor-pointer"
                      >
                        <option value="Luanda">Luanda (Maianga, Ingombota, Sambizanga, Rangel)</option>
                        <option value="Talatona">Talatona (Benfica, Morro Bento, Patriota)</option>
                        <option value="Belas">Belas (Centralidade do Kilamba, KK5000)</option>
                        <option value="Kilamba Kiaxi">Kilamba Kiaxi (Palanca, Golf 1 e 2)</option>
                        <option value="Cazenga">Cazenga (Hoji-ya-Henda, Tala Hadi)</option>
                        <option value="Viana">Viana (Viana Centro, Zango 0 ao 5)</option>
                        <option value="Cacuaco">Cacuaco (Centralidade do Sequele, Vila)</option>
                        <option value="Icolo e Bengo">Icolo e Bengo (Catete, Bom Jesus)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-700">Nome do Bairro / Zona *</label>
                      <input
                        type="text"
                        required
                        value={zoneNeighborhood}
                        onChange={(e) => setZoneNeighborhood(e.target.value)}
                        placeholder="Ex: Alvalade, Maianga, Morro Bento, Zango 3..."
                        className="w-full bg-white border border-stone-200 rounded-2xl px-3.5 py-2 text-xs text-stone-900 focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-700">Tempo Estimado de Entrega</label>
                      <input
                        type="text"
                        value={zoneHours}
                        onChange={(e) => setZoneHours(e.target.value)}
                        placeholder="Ex: 1 a 2 horas"
                        className="w-full bg-white border border-stone-200 rounded-2xl px-3.5 py-2 text-xs text-stone-900 focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>

                  {/* DUAL CONFIGURATION SECTIONS */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                    {/* SECTION 1: SECÇÃO TAXA À PORTA */}
                    <div className="p-4 rounded-2xl bg-white border-2 border-red-200 space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-red-100 text-red-600">
                          <Home className="w-4 h-4" />
                        </div>
                        <div>
                          <h5 className="font-bold text-xs text-stone-900">Secção 1: Taxa com Entrega à Porta</h5>
                          <span className="text-[10px] text-stone-500">Direto na residência do cliente</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-red-600">Valor Cobrado ao Cliente (Kz) *</label>
                        <div className="relative">
                          <input
                            type="number"
                            required
                            value={zoneFeeDoor}
                            onChange={(e) => setZoneFeeDoor(e.target.value)}
                            placeholder="Ex: 2000"
                            className="w-full bg-stone-50 border border-red-200 rounded-2xl px-3.5 py-2 text-xs text-red-600 font-mono font-bold focus:outline-none focus:border-red-500"
                          />
                          <span className="absolute right-3 top-2 text-xs text-stone-400 font-bold">Kz</span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-red-50/50 text-[11px] text-red-900 flex justify-between items-center">
                        <span>Repartição:</span>
                        <span className="font-mono font-bold">
                          1.000 Kz Estafeta + {Math.max(0, Number(zoneFeeDoor) - 1000)} Kz Loja
                        </span>
                      </div>
                    </div>

                    {/* SECTION 2: SECÇÃO TAXA NA PARAGEM */}
                    <div className="p-4 rounded-2xl bg-white border-2 border-emerald-200 space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
                          <Navigation className="w-4 h-4" />
                        </div>
                        <div>
                          <h5 className="font-bold text-xs text-stone-900">Secção 2: Taxa com Entrega na Paragem</h5>
                          <span className="text-[10px] text-stone-500">Ponto de paragem de autocarros / táxi</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-emerald-700">Valor Cobrado ao Cliente (Kz) *</label>
                        <div className="relative">
                          <input
                            type="number"
                            required
                            value={zoneFeeBusStop}
                            onChange={(e) => setZoneFeeBusStop(e.target.value)}
                            placeholder="Ex: 1200"
                            className="w-full bg-stone-50 border border-emerald-200 rounded-2xl px-3.5 py-2 text-xs text-emerald-700 font-mono font-bold focus:outline-none focus:border-emerald-500"
                          />
                          <span className="absolute right-3 top-2 text-xs text-stone-400 font-bold">Kz</span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-emerald-50/50 text-[11px] text-emerald-900 flex justify-between items-center">
                        <span>Repartição:</span>
                        <span className="font-mono font-bold">
                          1.000 Kz Estafeta + {Math.max(0, Number(zoneFeeBusStop) - 1000)} Kz Loja
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bus Stops list input */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700 flex items-center gap-1">
                      <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Paragens Principais do Bairro (Separadas por vírgula)</span>
                    </label>
                    <input
                      type="text"
                      value={zoneBusStops}
                      onChange={(e) => setZoneBusStops(e.target.value)}
                      placeholder="Ex: Paragem da Sagrada Família, Paragem do Kinaxixi, Paragem do Cassenda"
                      className="w-full bg-white border border-stone-200 rounded-2xl px-3.5 py-2 text-xs text-stone-900 focus:outline-none focus:border-red-500"
                    />
                    <span className="text-[10px] text-stone-400 block">
                      Estas paragens aparecerão como sugestões rápidas para o cliente escolher no Checkout.
                    </span>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-stone-200">
                    <button
                      type="button"
                      onClick={() => setIsZoneFormOpen(false)}
                      className="px-4 py-2 rounded-2xl bg-stone-200 text-stone-700 text-xs font-bold cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer shadow-sm"
                    >
                      {editingZoneId ? 'Atualizar Taxas do Bairro' : 'Guardar Bairro e Taxas'}
                    </button>
                  </div>
                </form>
              )}

              {/* Neighborhoods Dual-Section List */}
              {luandaZones.length === 0 ? (
                <div className="p-8 text-center bg-white border border-stone-200 rounded-3xl space-y-3">
                  <Navigation className="w-8 h-8 text-stone-400 mx-auto" />
                  <h4 className="font-bold text-sm text-stone-900">Nenhum Bairro ou Taxa Cadastrada</h4>
                  <p className="text-xs text-stone-500 max-w-md mx-auto">
                    Configure os municípios de Luanda (Talatona, Maianga, Kilamba, Viana, etc.) com as taxas de entrega reais à porta e na paragem clicando no botão acima.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {luandaZones.map((z) => {
                    const doorFee = z.deliveryFeeDoor || z.deliveryFee;
                    const busStopFee = z.deliveryFeeBusStop || Math.round(z.deliveryFee * 0.6);

                    return (
                      <div 
                        key={z.id}
                        className="p-4 rounded-3xl bg-white border border-stone-200 shadow-sm flex flex-col justify-between space-y-3 hover:border-red-300 transition-all"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-[10px] uppercase tracking-wider font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-lg border border-red-100">
                              {z.municipality || 'Luanda'}
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleEditZoneClick(z)}
                                className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
                                title="Editar Taxas deste Bairro"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => onDeleteZone(z.id)}
                                className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                                title="Eliminar Bairro"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <h4 className="font-bold text-xs text-stone-900 mt-2 line-clamp-2">
                            {z.neighborhood || z.name}
                          </h4>
                          <div className="flex items-center gap-1 text-[11px] text-stone-500 mt-0.5">
                            <Clock className="w-3.5 h-3.5 text-stone-400" />
                            <span>{z.estimatedHours}</span>
                          </div>
                        </div>

                        {/* DUAL CONFIGURATION CARDS PER NEIGHBORHOOD */}
                        <div className="space-y-2 pt-2 border-t border-stone-100">
                          {/* Secção 1: À Porta (Shown if filter is 'todas' or 'porta') */}
                          {(zoneDeliverySectionTab === 'todas' || zoneDeliverySectionTab === 'porta') && (
                            <div className="p-2.5 rounded-2xl bg-red-50/60 border border-red-100 flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <Home className="w-3.5 h-3.5 text-red-600" />
                                <div>
                                  <span className="text-[11px] font-bold text-stone-900 block leading-none">Taxa à Porta</span>
                                  <span className="text-[9px] text-stone-500 leading-none">1.000 Kz estafeta</span>
                                </div>
                              </div>
                              <span className="font-mono font-black text-xs text-red-600 bg-white px-2 py-1 rounded-xl border border-red-200">
                                {formatKwanzas(doorFee)}
                              </span>
                            </div>
                          )}

                          {/* Secção 2: Na Paragem (Shown if filter is 'todas' or 'paragem') */}
                          {(zoneDeliverySectionTab === 'todas' || zoneDeliverySectionTab === 'paragem') && (
                            <div className="p-2.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                                <div>
                                  <span className="text-[11px] font-bold text-stone-900 block leading-none">Taxa na Paragem</span>
                                  <span className="text-[9px] text-stone-500 leading-none">1.000 Kz estafeta</span>
                                </div>
                              </div>
                              <span className="font-mono font-black text-xs text-emerald-700 bg-white px-2 py-1 rounded-xl border border-emerald-200">
                                {formatKwanzas(busStopFee)}
                              </span>
                            </div>
                          )}

                          {/* Registered Bus Stops Preview */}
                          {z.popularBusStops && z.popularBusStops.length > 0 && (
                            <div className="pt-1">
                              <span className="text-[9px] uppercase font-bold text-stone-400 block mb-1">
                                Paragens Cadastradas ({z.popularBusStops.length}):
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {z.popularBusStops.slice(0, 3).map((st, i) => (
                                  <span key={i} className="text-[9px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded-md font-medium">
                                    🚏 {st.replace('Paragem d', 'D').replace('Paragem do ', '')}
                                  </span>
                                ))}
                                {z.popularBusStops.length > 3 && (
                                  <span className="text-[9px] bg-stone-100 text-stone-400 px-1.5 py-0.5 rounded-md">
                                    +{z.popularBusStops.length - 3}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB: MEUS PRODUTOS (GESTÃO DE ESTOQUE & EDIÇÃO RÁPIDA) */}
          {activeTab === 'meus_produtos' && (() => {
            const inStockProducts = products.filter(p => p.stockCount > 0 && p.inStock);
            const outOfStockProducts = products.filter(p => p.stockCount === 0 || !p.inStock);
            const totalInventoryValue = products.reduce((acc, p) => acc + (p.price * (p.stockCount || 0)), 0);

            const filteredProducts = products.filter(p => {
              const query = productSearch.toLowerCase().trim();
              const matchesSearch = !query || 
                p.title.toLowerCase().includes(query) || 
                p.description.toLowerCase().includes(query) ||
                p.seller.location.toLowerCase().includes(query);
              const matchesCategory = productCategoryFilter === 'todos' || p.category === productCategoryFilter;
              const isOut = p.stockCount === 0 || !p.inStock;
              const matchesStock = productStockFilter === 'todos' ? true :
                productStockFilter === 'em_stock' ? !isOut : isOut;
              return matchesSearch && matchesCategory && matchesStock;
            });

            return (
              <div className="space-y-6">
                {/* Stock Feedback Toast */}
                {stockFeedback && (
                  <div className={`p-4 rounded-2xl flex items-center justify-between border text-xs font-bold animate-in fade-in ${
                    stockFeedback.type === 'warning' 
                      ? 'bg-amber-50 text-amber-900 border-amber-300' 
                      : 'bg-emerald-50 text-emerald-900 border-emerald-300'
                  }`}>
                    <div className="flex items-center gap-2">
                      {stockFeedback.type === 'warning' ? (
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                      <span>{stockFeedback.msg}</span>
                    </div>
                    <button 
                      onClick={() => setStockFeedback(null)} 
                      className="text-stone-400 hover:text-stone-700 text-xs px-2 py-0.5 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                )}

                {/* Header with Title & Action */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Package className="w-5 h-5 text-red-600" />
                      <h3 className="font-black text-lg text-stone-900">Meus Produtos & Controlo de Stock</h3>
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Gerencie todo o catálogo da plataforma. Ajuste o stock na hora ou edite preços, imagens e comissões.
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <button
                      onClick={() => {
                        setEditingProductId(null);
                        setProdTitle('');
                        setProdPrice('');
                        setProdOrigPrice('');
                        setProdDesc('');
                        setProdStock('10');
                        setProdAffiliateCommission(10);
                        setIsProductFormOpen(true);
                        setActiveTab('cadastrar_produtos');
                      }}
                      className="px-4 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm cursor-pointer transition-all"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>+ Cadastrar Novo Produto</span>
                    </button>
                  </div>
                </div>

                {/* KPI Metrics Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div 
                    onClick={() => setProductStockFilter('todos')}
                    className={`p-4 rounded-3xl bg-white border shadow-sm cursor-pointer transition-all ${
                      productStockFilter === 'todos' ? 'border-red-500 ring-2 ring-red-500/20' : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-stone-500 text-[11px] font-bold">
                      <span>Total de Artigos</span>
                      <Boxes className="w-4 h-4 text-stone-600" />
                    </div>
                    <p className="text-xl sm:text-2xl font-black font-mono text-stone-900 mt-1">{products.length}</p>
                    <span className="text-[10px] text-stone-400">Exclusivos na loja</span>
                  </div>

                  <div 
                    onClick={() => setProductStockFilter('em_stock')}
                    className={`p-4 rounded-3xl bg-white border shadow-sm cursor-pointer transition-all ${
                      productStockFilter === 'em_stock' ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-emerald-700 text-[11px] font-bold">
                      <span>Em Stock (Ativos)</span>
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    </div>
                    <p className="text-xl sm:text-2xl font-black font-mono text-emerald-600 mt-1">{inStockProducts.length}</p>
                    <span className="text-[10px] text-emerald-700 font-medium">Prontos para entrega</span>
                  </div>

                  <div 
                    onClick={() => setProductStockFilter('esgotado')}
                    className={`p-4 rounded-3xl bg-white border shadow-sm cursor-pointer transition-all ${
                      productStockFilter === 'esgotado' ? 'border-red-500 ring-2 ring-red-500/20' : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-red-700 text-[11px] font-bold">
                      <span>Sem Stock (Esgotados)</span>
                      <XCircle className="w-4 h-4 text-red-600" />
                    </div>
                    <p className="text-xl sm:text-2xl font-black font-mono text-red-600 mt-1">{outOfStockProducts.length}</p>
                    <span className="text-[10px] text-red-600 font-medium">Requer reposição</span>
                  </div>

                  <div className="p-4 rounded-3xl bg-white border border-stone-200 shadow-sm">
                    <div className="flex items-center justify-between text-stone-500 text-[11px] font-bold">
                      <span>Valor em Stock (Kz)</span>
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                    </div>
                    <p className="text-sm sm:text-base font-black font-mono text-stone-900 mt-1 truncate">
                      {formatKwanzas(totalInventoryValue)}
                    </p>
                    <span className="text-[10px] text-stone-400">Preço de venda total</span>
                  </div>
                </div>

                {/* Filters and Search Bar */}
                <div className="p-4 rounded-3xl bg-white border border-stone-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                  <div className="flex-1 relative">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      placeholder="Pesquisar produto pelo nome, código ou descrição..."
                      className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-2xl text-xs text-stone-900 focus:outline-none focus:border-red-500 focus:bg-white transition-all"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={productCategoryFilter}
                      onChange={(e) => setProductCategoryFilter(e.target.value)}
                      className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-2xl text-xs font-bold text-stone-700 focus:outline-none focus:border-red-500 cursor-pointer"
                    >
                      <option value="todos">Todas as Categorias</option>
                      {CATEGORIES.filter(c => c.id !== 'todos').map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>

                    <div className="flex p-1 bg-stone-100 rounded-2xl gap-1">
                      <button
                        onClick={() => setProductStockFilter('todos')}
                        className={`px-3 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                          productStockFilter === 'todos' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-900'
                        }`}
                      >
                        Todos ({products.length})
                      </button>
                      <button
                        onClick={() => setProductStockFilter('em_stock')}
                        className={`px-3 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                          productStockFilter === 'em_stock' ? 'bg-emerald-600 text-white shadow-xs' : 'text-stone-500 hover:text-stone-900'
                        }`}
                      >
                        Em Stock ({inStockProducts.length})
                      </button>
                      <button
                        onClick={() => setProductStockFilter('esgotado')}
                        className={`px-3 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                          productStockFilter === 'esgotado' ? 'bg-red-600 text-white shadow-xs' : 'text-stone-500 hover:text-stone-900'
                        }`}
                      >
                        Esgotados ({outOfStockProducts.length})
                      </button>
                    </div>
                  </div>
                </div>

                {/* Product Inventory Cards / List */}
                {filteredProducts.length === 0 ? (
                  <div className="p-12 text-center bg-white border border-stone-200 rounded-3xl space-y-3">
                    <Package className="w-10 h-10 text-stone-300 mx-auto" />
                    <h4 className="font-bold text-sm text-stone-800">Nenhum produto encontrado</h4>
                    <p className="text-xs text-stone-500 max-w-sm mx-auto">
                      Tente alterar os termos de pesquisa ou o filtro de categoria e stock.
                    </p>
                    <button
                      onClick={() => { setProductSearch(''); setProductCategoryFilter('todos'); setProductStockFilter('todos'); }}
                      className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-2xl text-xs font-bold transition-all cursor-pointer"
                    >
                      Limpar Filtros
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredProducts.map((p) => {
                      const isOutOfStock = p.stockCount === 0 || !p.inStock;
                      const catObj = CATEGORIES.find(c => c.id === p.category);
                      const affiliateAmt = Math.round(p.price * ((p.affiliateCommissionPercent ?? 10) / 100));

                      return (
                        <div 
                          key={p.id}
                          className={`p-4 sm:p-5 rounded-3xl bg-white border shadow-sm transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 ${
                            isOutOfStock ? 'border-red-200 bg-red-50/15' : 'border-stone-200 hover:border-stone-300'
                          }`}
                        >
                          {/* Product Info & Thumbnail */}
                          <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                              <img 
                                src={p.image} 
                                alt={p.title} 
                                className="w-full h-full object-cover" 
                                referrerPolicy="no-referrer" 
                              />
                              {isOutOfStock && (
                                <div className="absolute inset-0 bg-red-950/70 backdrop-blur-xs flex items-center justify-center text-center p-1">
                                  <span className="text-[9px] font-black text-white uppercase tracking-wider">Esgotado</span>
                                </div>
                              )}
                              {p.gallery && p.gallery.length > 1 && (
                                <span className="absolute bottom-1 right-1 bg-stone-900/80 text-[9px] text-white font-bold px-1.5 py-0.5 rounded-md">
                                  {p.gallery.length} fotos
                                </span>
                              )}
                            </div>

                            <div className="space-y-1 min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="text-[10px] uppercase font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-100">
                                  {catObj?.name.split('&')[0] || p.category}
                                </span>
                                <span className="text-[10px] text-stone-500 font-medium bg-stone-100 px-2 py-0.5 rounded-md">
                                  {p.condition}
                                </span>
                                {isOutOfStock ? (
                                  <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-md border border-red-200">
                                    🔴 Sem Stock
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200">
                                    🟢 Em Stock ({p.stockCount} un)
                                  </span>
                                )}
                              </div>

                              <h4 className="font-bold text-sm text-stone-900 truncate">
                                {p.title}
                              </h4>

                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                                <span className="font-mono font-black text-red-600">
                                  {formatKwanzas(p.price)}
                                </span>
                                {p.originalPrice && (
                                  <span className="text-stone-400 line-through text-[11px] font-mono">
                                    {formatKwanzas(p.originalPrice)}
                                  </span>
                                )}
                                <span className="text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200 text-[10px]">
                                  Afiliado: {p.affiliateCommissionPercent ?? 10}% ({formatKwanzas(affiliateAmt)})
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Quick Stock Replenish / Adjustment Controls */}
                          <div className="w-full lg:w-auto flex flex-wrap sm:flex-nowrap items-center justify-between lg:justify-end gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-stone-100 shrink-0">
                            {/* Stock Stepper */}
                            <div className="flex flex-col items-start sm:items-center space-y-1">
                              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                                Stock Disponível
                              </span>
                              <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-2xl border border-stone-200">
                                <button
                                  type="button"
                                  onClick={() => handleQuickStockChange(p, p.stockCount - 1)}
                                  className="w-7 h-7 rounded-xl bg-white hover:bg-stone-200 text-stone-700 flex items-center justify-center font-bold text-xs shadow-2xs transition-colors cursor-pointer"
                                  title="Diminuir 1 un"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                
                                <span className={`px-2.5 font-mono font-black text-xs min-w-[50px] text-center ${
                                  isOutOfStock ? 'text-red-600' : 'text-stone-900'
                                }`}>
                                  {p.stockCount} un
                                </span>

                                <button
                                  type="button"
                                  onClick={() => handleQuickStockChange(p, p.stockCount + 1)}
                                  className="w-7 h-7 rounded-xl bg-white hover:bg-stone-200 text-stone-700 flex items-center justify-center font-bold text-xs shadow-2xs transition-colors cursor-pointer"
                                  title="Adicionar 1 un"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Quick Replenish Buttons */}
                            <div className="flex flex-col items-start space-y-1">
                              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                                Repor Stock
                              </span>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleQuickReplenish(p, 5)}
                                  className="px-2 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11px] font-bold transition-colors cursor-pointer"
                                  title="Adicionar 5 unidades ao stock"
                                >
                                  +5
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleQuickReplenish(p, 10)}
                                  className="px-2 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11px] font-bold transition-colors cursor-pointer"
                                  title="Adicionar 10 unidades ao stock"
                                >
                                  +10
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleQuickReplenish(p, 25)}
                                  className="px-2 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11px] font-bold transition-colors cursor-pointer"
                                  title="Adicionar 25 unidades ao stock"
                                >
                                  +25
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleToggleInStock(p)}
                                  className={`px-2 py-1.5 rounded-xl text-[10px] font-bold transition-colors cursor-pointer ${
                                    isOutOfStock 
                                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs' 
                                      : 'bg-stone-200 hover:bg-red-100 text-stone-700 hover:text-red-700'
                                  }`}
                                  title={isOutOfStock ? 'Reativar produto em stock' : 'Marcar stock como esgotado'}
                                >
                                  {isOutOfStock ? 'Ativar' : 'Esgotar'}
                                </button>
                              </div>
                            </div>

                            {/* Main Action: Edit Product Button */}
                            <div className="flex items-center gap-1.5 shrink-0 pl-1">
                              <button
                                type="button"
                                onClick={() => handleEditProductClick(p)}
                                className="px-4 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                                title="Editar Título, Preço, Stock, Imagens e Comissão"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Editar Produto</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => onDeleteProduct(p.id)}
                                className="p-2.5 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                                title="Eliminar Artigo do Catálogo"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })()}

          {/* TAB 9: CADASTRAR PRODUTOS */}
          {activeTab === 'cadastrar_produtos' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-black text-base text-stone-900">Cadastrar Produtos & Catálogo Exclusivo</h3>
                  <p className="text-xs text-stone-500">
                    Apenas a sua conta de Administrador pode cadastrar e editar produtos, incluindo a <strong>comissão do afiliado (0% a 100%)</strong>.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingProductId(null);
                    setProdTitle('');
                    setProdPrice('');
                    setProdOrigPrice('');
                    setProdDesc('');
                    setProdAffiliateCommission(10);
                    setIsProductFormOpen(!isProductFormOpen);
                  }}
                  className="px-4 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{isProductFormOpen ? 'Ocultar Formulário' : '+ Cadastrar Novo Produto'}</span>
                </button>
              </div>

              {/* Product Form */}
              {isProductFormOpen && (
                <form onSubmit={handleSaveProduct} className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <h4 className="font-bold text-sm text-stone-900">
                      {editingProductId ? 'Editar Dados do Artigo' : 'Formulário de Cadastro de Produto'}
                    </h4>
                    <span className="text-xs text-red-600 font-bold bg-red-50 px-2.5 py-1 rounded-xl">
                      Plataforma Oficial
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-700">Título do Artigo *</label>
                      <input
                        type="text"
                        required
                        value={prodTitle}
                        onChange={(e) => setProdTitle(e.target.value)}
                        placeholder="Ex: iPhone 15 Pro, Samakaka Chic, Gerador Lutian 6.5kVA..."
                        className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-red-500 focus:bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-700">Categoria *</label>
                      <select
                        value={prodCategory}
                        onChange={(e) => setProdCategory(e.target.value as CategoryId)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-3 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-red-500 focus:bg-white cursor-pointer"
                      >
                        {CATEGORIES.filter(c => c.id !== 'todos').map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-red-600">Preço de Venda em Kwanzas (Kz) *</label>
                      <input
                        type="number"
                        required
                        value={prodPrice}
                        onChange={(e) => setProdPrice(e.target.value)}
                        placeholder="Ex: 85000"
                        className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-3.5 py-2.5 text-xs text-red-600 font-mono font-bold focus:outline-none focus:border-red-500 focus:bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-500">Preço Original / Riscado (Kz)</label>
                      <input
                        type="number"
                        value={prodOrigPrice}
                        onChange={(e) => setProdOrigPrice(e.target.value)}
                        placeholder="Ex: 95000 (opcional)"
                        className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-3.5 py-2.5 text-xs text-stone-400 font-mono focus:outline-none focus:border-red-500 focus:bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-700">Stock Disponível</label>
                      <input
                        type="number"
                        value={prodStock}
                        onChange={(e) => setProdStock(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-3.5 py-2.5 text-xs text-stone-900 font-mono focus:outline-none focus:border-red-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* CRITICAL REQUIRED FEATURE: Affiliate Commission Slider / Input from 0% to 100% */}
                  <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center gap-2">
                        <Percent className="w-4 h-4 text-blue-600" />
                        <label className="text-xs font-black text-blue-950">
                          Comissão do Afiliado para este Produto (0% a 100%):
                        </label>
                      </div>
                      <span className="text-xs font-mono font-black text-blue-700 bg-white px-2.5 py-0.5 rounded-lg border border-blue-200">
                        {prodAffiliateCommission}% ({formatKwanzas(Math.round((Number(prodPrice) || 0) * (prodAffiliateCommission / 100)))} por venda)
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min={0}
                        max={100}
                        step={1}
                        value={prodAffiliateCommission}
                        onChange={(e) => setProdAffiliateCommission(Number(e.target.value))}
                        className="w-full accent-blue-600 h-2 bg-blue-200 rounded-lg cursor-pointer"
                      />
                      <div className="flex items-center gap-1 shrink-0">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={prodAffiliateCommission}
                          onChange={(e) => setProdAffiliateCommission(Math.min(100, Math.max(0, Number(e.target.value))))}
                          className="w-16 bg-white border border-blue-300 rounded-xl px-2 py-1 text-center text-xs font-bold text-blue-900 font-mono"
                        />
                        <span className="text-xs font-bold text-blue-800">%</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-blue-700">
                      💡 Quando um afiliado divulgar o link deste produto, receberá automaticamente <strong>{prodAffiliateCommission}%</strong> do valor de cada venda confirmada em Luanda.
                    </p>
                  </div>

                  {/* CRITICAL REQUIRED FEATURE: 3 Product Images with Upload & Previews */}
                  <div className="space-y-3 p-4 rounded-2xl bg-stone-50 border border-stone-200">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-black text-stone-900 flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4 text-red-600" />
                        <span>Fotografias do Artigo (3 Imagens):</span>
                      </label>
                      <span className="text-[11px] text-stone-500 font-medium">
                        Upload direto do dispositivo ou link
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Slot 1: Principal */}
                      <div className="p-3 rounded-2xl bg-white border border-stone-200 space-y-2 flex flex-col justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-red-600">Imagem 1 (Principal / Capa) *</span>
                            {prodImage1 && (
                              <button
                                type="button"
                                onClick={() => setProdImage1('')}
                                className="text-[10px] text-red-500 hover:text-red-700 font-bold"
                              >
                                Limpar
                              </button>
                            )}
                          </div>

                          <div className="relative aspect-video rounded-xl overflow-hidden bg-stone-100 border border-stone-200 flex items-center justify-center">
                            {prodImage1 ? (
                              <img src={prodImage1} alt="Slot 1" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              <div className="flex flex-col items-center gap-1 text-stone-400 p-2 text-center">
                                <ImageIcon className="w-6 h-6" />
                                <span className="text-[10px]">Sem imagem</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-1.5 pt-1">
                          <label className="block w-full text-center py-1.5 px-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-[11px] font-bold cursor-pointer transition-colors border border-stone-200">
                            <span>📁 Escolher Arquivo 1</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files?.[0]) handleImageFileUpload(1, e.target.files[0]);
                              }}
                            />
                          </label>
                          <input
                            type="url"
                            value={prodImage1}
                            onChange={(e) => setProdImage1(e.target.value)}
                            placeholder="Ou URL da imagem 1..."
                            className="w-full bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1 text-[11px] text-stone-800"
                          />
                        </div>
                      </div>

                      {/* Slot 2 */}
                      <div className="p-3 rounded-2xl bg-white border border-stone-200 space-y-2 flex flex-col justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-stone-700">Imagem 2 (Segundo Ângulo / Detalhe)</span>
                            {prodImage2 && (
                              <button
                                type="button"
                                onClick={() => setProdImage2('')}
                                className="text-[10px] text-red-500 hover:text-red-700 font-bold"
                              >
                                Limpar
                              </button>
                            )}
                          </div>

                          <div className="relative aspect-video rounded-xl overflow-hidden bg-stone-100 border border-stone-200 flex items-center justify-center">
                            {prodImage2 ? (
                              <img src={prodImage2} alt="Slot 2" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              <div className="flex flex-col items-center gap-1 text-stone-400 p-2 text-center">
                                <ImageIcon className="w-6 h-6" />
                                <span className="text-[10px]">Opcional</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-1.5 pt-1">
                          <label className="block w-full text-center py-1.5 px-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-[11px] font-bold cursor-pointer transition-colors border border-stone-200">
                            <span>📁 Escolher Arquivo 2</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files?.[0]) handleImageFileUpload(2, e.target.files[0]);
                              }}
                            />
                          </label>
                          <input
                            type="url"
                            value={prodImage2}
                            onChange={(e) => setProdImage2(e.target.value)}
                            placeholder="Ou URL da imagem 2..."
                            className="w-full bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1 text-[11px] text-stone-800"
                          />
                        </div>
                      </div>

                      {/* Slot 3 */}
                      <div className="p-3 rounded-2xl bg-white border border-stone-200 space-y-2 flex flex-col justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-stone-700">Imagem 3 (Embalagem / Uso)</span>
                            {prodImage3 && (
                              <button
                                type="button"
                                onClick={() => setProdImage3('')}
                                className="text-[10px] text-red-500 hover:text-red-700 font-bold"
                              >
                                Limpar
                              </button>
                            )}
                          </div>

                          <div className="relative aspect-video rounded-xl overflow-hidden bg-stone-100 border border-stone-200 flex items-center justify-center">
                            {prodImage3 ? (
                              <img src={prodImage3} alt="Slot 3" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              <div className="flex flex-col items-center gap-1 text-stone-400 p-2 text-center">
                                <ImageIcon className="w-6 h-6" />
                                <span className="text-[10px]">Opcional</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-1.5 pt-1">
                          <label className="block w-full text-center py-1.5 px-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-[11px] font-bold cursor-pointer transition-colors border border-stone-200">
                            <span>📁 Escolher Arquivo 3</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files?.[0]) handleImageFileUpload(3, e.target.files[0]);
                              }}
                            />
                          </label>
                          <input
                            type="url"
                            value={prodImage3}
                            onChange={(e) => setProdImage3(e.target.value)}
                            placeholder="Ou URL da imagem 3..."
                            className="w-full bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1 text-[11px] text-stone-800"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Quick Presets for Slot 1 */}
                    <div className="pt-2 border-t border-stone-200">
                      <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1.5">
                        Ou clique num exemplo rápido para a Imagem 1:
                      </span>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                        {SAMPLE_PRESET_IMAGES.map((preset, idx) => (
                          <div
                            key={idx}
                            onClick={() => setProdImage1(preset.url)}
                            className={`relative aspect-video rounded-xl overflow-hidden border cursor-pointer transition-all ${
                              prodImage1 === preset.url ? 'border-red-600 ring-2 ring-red-500 scale-95' : 'border-stone-200 opacity-60 hover:opacity-100'
                            }`}
                          >
                            <img src={preset.url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            <span className="absolute inset-x-0 bottom-0 bg-stone-900/80 text-[7px] text-white px-1 py-0.5 text-center truncate">
                              {preset.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">Descrição Detalhada do Produto</label>
                    <textarea
                      rows={2}
                      value={prodDesc}
                      onChange={(e) => setProdDesc(e.target.value)}
                      placeholder="Descreva as características, modo de uso e garantias..."
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-2.5 text-xs text-stone-900 focus:bg-white"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsProductFormOpen(false)}
                      className="px-4 py-2.5 rounded-2xl bg-stone-200 text-stone-700 text-xs font-bold cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer shadow-sm"
                    >
                      {editingProductId ? 'Guardar Alterações' : 'Publicar Produto no Catálogo'}
                    </button>
                  </div>
                </form>
              )}

              {/* Products List Table */}
              <div className="border border-stone-200 rounded-3xl overflow-hidden shadow-sm bg-white">
                <div className="p-4 border-b border-stone-200 bg-stone-50/70 flex items-center justify-between">
                  <span className="font-bold text-xs text-stone-800">
                    Artigos Publicados no AngolaMarket 01 ({products.length})
                  </span>
                  <span className="text-xs text-stone-500">Exclusivos da sua conta</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-50 text-stone-500 uppercase text-[10px] tracking-wider border-b border-stone-200">
                      <tr>
                        <th className="py-3 px-4">Artigo</th>
                        <th className="py-3 px-4">Categoria</th>
                        <th className="py-3 px-4">Preço (Kz)</th>
                        <th className="py-3 px-4">Comissão Afiliado</th>
                        <th className="py-3 px-4">Stock</th>
                        <th className="py-3 px-4 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200 text-stone-900">
                      {products.map((p) => (
                        <tr key={p.id} className="hover:bg-stone-50/80 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img src={p.image} alt="" className="w-10 h-10 rounded-xl object-cover shrink-0 border border-stone-200" referrerPolicy="no-referrer" />
                              <div className="max-w-xs truncate">
                                <span className="font-bold block truncate">{p.title}</span>
                                <span className="text-[10px] text-stone-500">{p.condition}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-stone-600">
                            {CATEGORIES.find(c => c.id === p.category)?.name.split('&')[0] || p.category}
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-red-600">
                            {formatKwanzas(p.price)}
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 font-bold border border-blue-200 text-[11px]">
                              {p.affiliateCommissionPercent ?? 8}% ({formatKwanzas(Math.round(p.price * ((p.affiliateCommissionPercent ?? 8) / 100)))})
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono">
                            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                              p.stockCount > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {p.stockCount} un
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleEditProductClick(p)}
                                className="p-1.5 rounded-xl bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors cursor-pointer"
                                title="Editar Artigo & Comissão"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => onDeleteProduct(p.id)}
                                className="p-1.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
                                title="Eliminar Artigo"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: PERFIL */}
          {activeTab === 'perfil' && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div>
                <h3 className="font-black text-base text-stone-900">Perfil do Administrador Geral</h3>
                <p className="text-xs text-stone-500">Dados da conta de gestão, fotografia oficial, contactos e liquidação financeira</p>
              </div>

              {profileSaved && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Perfil de Administrador e dados financeiros atualizados com sucesso!</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-5">
                {/* Profile Photo Uploader */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative">
                    <img 
                      src={adminAvatar} 
                      alt="Foto ADM" 
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-red-600 shadow-xs"
                      referrerPolicy="no-referrer"
                    />
                    <label className="absolute -bottom-1.5 -right-1.5 p-2 rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-md cursor-pointer transition-transform hover:scale-105">
                      <Camera className="w-3.5 h-3.5" />
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleAdminAvatarUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div className="space-y-1 text-center sm:text-left flex-1">
                    <span className="font-bold text-xs text-stone-900 block">Fotografia de Perfil do Administrador</span>
                    <p className="text-[11px] text-stone-500">Carregue uma imagem a partir do seu telemóvel ou computador.</p>
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-200 hover:bg-stone-100 text-stone-800 text-[11px] font-bold cursor-pointer mt-1">
                      <Upload className="w-3 h-3 text-red-600" />
                      <span>Escolher Nova Foto</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleAdminAvatarUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Nome do Titular / ADM</label>
                  <input
                    type="text"
                    required
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-3.5 py-2.5 text-xs text-stone-900 focus:bg-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">E-mail Principal</label>
                    <input
                      type="email"
                      required
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-3.5 py-2.5 text-xs text-stone-900 focus:bg-white focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">Telefone / WhatsApp</label>
                    <input
                      type="text"
                      required
                      value={adminPhone}
                      onChange={(e) => setAdminPhone(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-3.5 py-2.5 text-xs text-stone-900 font-mono focus:bg-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                {/* Métodos de Pagamento & Dados Bancários */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-black uppercase tracking-wider text-stone-800">Métodos de Pagamento & Recebimento Oficial</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-stone-700">Banco de Recebimento</label>
                      <select
                        value={adminBankName}
                        onChange={(e) => setAdminBankName(e.target.value)}
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
                      <label className="text-[11px] font-bold text-stone-700">Multicaixa Express de Apoio</label>
                      <input
                        type="tel"
                        value={adminMulticaixaExpress}
                        onChange={(e) => setAdminMulticaixaExpress(e.target.value)}
                        placeholder="+244 9..."
                        className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-700">IBAN Oficial da Plataforma (AO06...)</label>
                    <input
                      type="text"
                      required
                      value={adminIban}
                      onChange={(e) => setAdminIban(e.target.value)}
                      placeholder="AO06.0040.0000.1234.5678.9012.3"
                      className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 font-mono uppercase"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Palavra-passe de Acesso</label>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-3.5 py-2.5 text-xs text-stone-900 focus:bg-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs sm:text-sm shadow-md cursor-pointer transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Guardar Dados do Perfil e Pagamentos</span>
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
