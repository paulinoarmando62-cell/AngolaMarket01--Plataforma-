import React, { useState, useEffect, useMemo } from 'react';
import { 
  Navbar 
} from './components/Navbar';
import { 
  HeroBanner 
} from './components/HeroBanner';
import { 
  CategoryFilter 
} from './components/CategoryFilter';
import { 
  ProductCard 
} from './components/ProductCard';
import { 
  ProductDetailModal 
} from './components/ProductDetailModal';
import { 
  CartDrawer 
} from './components/CartDrawer';
import { 
  CheckoutModal 
} from './components/CheckoutModal';
import { 
  OrderSuccessModal 
} from './components/OrderSuccessModal';
import { 
  OrderTrackingView 
} from './components/OrderTrackingView';
import { 
  LuandaDeliveryInfoModal 
} from './components/LuandaDeliveryInfoModal';
import { 
  AuthModal 
} from './components/AuthModal';
import { 
  AdminPortalModal 
} from './components/AdminPortalModal';
import { 
  CourierPortalModal 
} from './components/CourierPortalModal';
import { 
  AffiliatePortalModal 
} from './components/AffiliatePortalModal';
import { 
  UserProfileModal 
} from './components/UserProfileModal';
import { 
  MobileBottomNav 
} from './components/MobileBottomNav';
import { 
  Footer 
} from './components/Footer';
import { 
  PWAInstallBanner 
} from './components/PWAInstallBanner';
import { 
  OfflineIndicator 
} from './components/OfflineIndicator';
import { 
  PWAUpdateToast 
} from './components/PWAUpdateToast';
import { 
  Product, 
  CategoryId, 
  CartItem, 
  Order, 
  OrderCustomerInfo, 
  LuandaZone, 
  OrderStatus,
  AppUser,
  PayoutRequest 
} from './types';
import { 
  INITIAL_PRODUCTS, 
  CATEGORIES, 
  LUANDA_ZONES, 
  INITIAL_USERS,
  INITIAL_PAYOUT_REQUESTS,
  formatKwanzas 
} from './data/mockData';
import { 
  ShoppingBag, 
  Sparkles, 
  Truck, 
  ShieldCheck, 
  CreditCard,
  DollarSign,
  UserCheck,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Banknote,
  Package,
  Plus
} from 'lucide-react';

const LOCAL_STORAGE_CART_KEY = 'angolamarket01_cart';
const LOCAL_STORAGE_ORDERS_KEY = 'angolamarket01_orders';
const LOCAL_STORAGE_PRODUCTS_KEY = 'angolamarket01_products';
const LOCAL_STORAGE_ZONE_KEY = 'angolamarket01_zone';
const LOCAL_STORAGE_ZONES_LIST_KEY = 'angolamarket01_zones_list';
const LOCAL_STORAGE_USERS_KEY = 'angolamarket01_users';
const LOCAL_STORAGE_CURRENT_USER_KEY = 'angolamarket01_current_user';
const LOCAL_STORAGE_PAYOUT_REQUESTS_KEY = 'angolamarket01_payout_requests';

const DEFAULT_BLANK_ZONE: LuandaZone = {
  id: 'luanda_geral',
  name: 'Luanda (A configurar)',
  municipality: 'Luanda',
  neighborhood: 'Luanda',
  estimatedHours: 'A combinar',
  deliveryFee: 0,
  deliveryFeeDoor: 0,
  deliveryFeeBusStop: 0,
  popularBusStops: [],
  popularAreas: [],
  active: true
};

export default function App() {
  // Users state (Admin, Couriers, Affiliates, Buyers)
  const [users, setUsers] = useState<AppUser[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Filter out any mock/demo test users
          const realOnly = parsed.filter((u: AppUser) => 
            !u.id.includes('demo') && 
            !u.id.includes('test') && 
            !u.id.includes('courier-') &&
            !u.id.includes('affiliate-') &&
            !(u.email || '').includes('exemplo.com') && 
            !(u.email || '').includes('teste.ao')
          );
          // Ensure master admin has real credentials
          const hasMaster = realOnly.some((u: AppUser) => u.email === 'paulinoarmando62@gmail.com');
          if (hasMaster) {
            return realOnly.map((u: AppUser) => u.email === 'paulinoarmando62@gmail.com' ? {
              ...u,
              password: 'Armando@123',
              role: 'admin',
              phone: '+244 938 243 909',
              name: 'Paulino Armando (Administrador Geral)'
            } : u);
          } else {
            return [INITIAL_USERS[0], ...realOnly];
          }
        }
      }
    } catch (e) {
      // fallback
    }
    return INITIAL_USERS;
  });

  // Current logged in user (null by default for real public visitors, credentials required for ADM/Couriers/Affiliates)
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_CURRENT_USER_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id) return parsed;
      }
    } catch (e) {
      // fallback
    }
    return null;
  });

  // Dynamic Luanda Zones & Neighborhoods managed by the ADM
  const [luandaZones, setLuandaZones] = useState<LuandaZone[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_ZONES_LIST_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Filter out old mock zones
          const realZones = parsed.filter((z: LuandaZone) => 
            z.id && 
            !z.id.startsWith('luanda_') && 
            !z.id.startsWith('talatona_') && 
            !z.id.startsWith('belas_') && 
            !z.id.startsWith('cazenga_') && 
            !z.id.startsWith('viana_') && 
            !z.id.startsWith('cacuaco_') && 
            !z.id.startsWith('kilamba_')
          );
          return realZones;
        }
      }
    } catch (e) {
      // fallback
    }
    return [];
  });

  // Selected Luanda Delivery Zone for checkout / browsing
  const [selectedZone, setSelectedZone] = useState<LuandaZone>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_ZONE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id && parsed.id.startsWith('zone-')) return parsed;
      }
    } catch (e) {
      // fallback
    }
    return DEFAULT_BLANK_ZONE;
  });

  // Products state (Solely owned & published by the ADM)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_PRODUCTS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Only keep real products added by the Admin
          const realProducts = parsed.filter((p: Product) => 
            p.id && (p.id.startsWith('adm-prod-') || p.id.startsWith('real-prod-'))
          );
          return realProducts;
        }
      }
    } catch (e) {
      // fallback
    }
    return [];
  });

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(it => it.product?.id && (it.product.id.startsWith('adm-prod-') || it.product.id.startsWith('real-prod-')));
        }
      }
    } catch (e) {
      // fallback
    }
    return [];
  });

  // Orders state (Pristine clean state for real production orders)
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const realOrders = parsed.filter((o: Order) => 
            o.id && 
            !o.id.startsWith('ord-1') && 
            !o.id.startsWith('ord-2') && 
            !o.id.startsWith('ord-3') && 
            !o.id.startsWith('ord-demo')
          );
          return realOrders;
        }
      }
    } catch (e) {
      // fallback
    }
    return [];
  });

  // Payout Requests state (Commission & Delivery earnings withdrawals)
  const [payoutRequests, setPayoutRequests] = useState<PayoutRequest[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_PAYOUT_REQUESTS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const realPayouts = parsed.filter((p: PayoutRequest) => 
            p.id && 
            !p.id.startsWith('payout-1') && 
            !p.id.startsWith('payout-2') && 
            !p.id.startsWith('payout-3')
          );
          return realPayouts;
        }
      }
    } catch (e) {
      // fallback
    }
    return [];
  });

  // Navigation & Filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('todos');
  const [priceSort, setPriceSort] = useState<'featured' | 'price_asc' | 'price_desc' | 'rating'>('featured');
  const [onlyExpressLuanda, setOnlyExpressLuanda] = useState(false);
  const [currentView, setCurrentView] = useState<'marketplace' | 'orders'>('marketplace');

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [newOrderSuccess, setNewOrderSuccess] = useState<Order | null>(null);
  const [isDeliveryInfoModalOpen, setIsDeliveryInfoModalOpen] = useState(false);
  
  // Role-Based Portals Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState(false);
  const [isCourierPortalOpen, setIsCourierPortalOpen] = useState(false);
  const [isAffiliatePortalOpen, setIsAffiliatePortalOpen] = useState(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Update User Profiles
  const handleUpdateUserProfile = (updatedUser: AppUser) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    setCurrentUser(updatedUser);
    showToast('Perfil atualizado com sucesso!');
  };

  const handleToggleAffiliateProduct = (productId: string) => {
    if (!currentUser) return;
    const currentList = currentUser.affiliatedProductIds || [];
    const exists = currentList.includes(productId);
    const newList = exists 
      ? currentList.filter(id => id !== productId)
      : [...currentList, productId];

    const updatedUser: AppUser = {
      ...currentUser,
      affiliatedProductIds: newList
    };

    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    setCurrentUser(updatedUser);
    showToast(exists ? 'Produto removido das suas afiliações.' : 'Produto adicionado às suas afiliações com sucesso!');
  };

  const handleBatchAffiliateProducts = (productIds: string[]) => {
    if (!currentUser) return;
    const currentList = currentUser.affiliatedProductIds || [];
    const set = new Set([...currentList, ...productIds]);
    const newList = Array.from(set);

    const updatedUser: AppUser = {
      ...currentUser,
      affiliatedProductIds: newList
    };

    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    setCurrentUser(updatedUser);
    showToast(`Afiliado com sucesso a ${productIds.length} produtos de uma vez!`);
  };

  // Derived state
  const adminExists = useMemo(() => users.some(u => u.role === 'admin'), [users]);
  const pendingCouriersCount = useMemo(() => users.filter(u => u.role === 'courier' && u.courierStatus === 'pendente').length, [users]);

  // Synchronize localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(users));
    } catch (e) { /* ignore */ }
  }, [users]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_CURRENT_USER_KEY, JSON.stringify(currentUser));
    } catch (e) { /* ignore */ }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_ZONES_LIST_KEY, JSON.stringify(luandaZones));
    } catch (e) { /* ignore */ }
  }, [luandaZones]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(cart));
    } catch (e) { /* ignore */ }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(orders));
    } catch (e) { /* ignore */ }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(products));
    } catch (e) { /* ignore */ }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_ZONE_KEY, JSON.stringify(selectedZone));
    } catch (e) { /* ignore */ }
  }, [selectedZone]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_PAYOUT_REQUESTS_KEY, JSON.stringify(payoutRequests));
    } catch (e) { /* ignore */ }
  }, [payoutRequests]);

  // Payout Handlers (Afiliados & Entregadores)
  const handleRequestPayout = (newRequestData: Omit<PayoutRequest, 'id' | 'requestedAt' | 'status'>) => {
    const newReq: PayoutRequest = {
      ...newRequestData,
      id: `payout-${Date.now()}`,
      amount: newRequestData.amount || newRequestData.amountAOA || 0,
      amountAOA: newRequestData.amountAOA || newRequestData.amount || 0,
      status: 'pendente',
      requestedAt: new Date().toLocaleDateString('pt-AO') + ' ' + new Date().toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' })
    };

    setPayoutRequests(prev => [newReq, ...prev]);
    showToast(`Solicitação de saque de ${formatKwanzas(newReq.amount)} enviada ao Administrador!`);
  };

  const handleApprovePayout = (requestId: string, transactionRef?: string) => {
    setPayoutRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          status: 'pago',
          paidAt: new Date().toLocaleDateString('pt-AO') + ' ' + new Date().toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' }),
          transactionRef: transactionRef || `MCX-${Math.floor(100000 + Math.random() * 900000)}`,
          paymentProofReference: transactionRef || `MCX-${Math.floor(100000 + Math.random() * 900000)}`,
          paidByAdminName: currentUser?.name || 'Administrador Geral'
        };
      }
      return req;
    }));

    showToast('Pagamento confirmado e marcado como pago com sucesso!');
  };

  const handleRejectPayout = (requestId: string, reason?: string) => {
    setPayoutRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          status: 'rejeitado',
          notes: reason || 'Rejeitado pelo Administrador'
        };
      }
      return req;
    }));

    showToast('Solicitação de saque rejeitada.');
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Auth Operations
  const handleLogin = (user: AppUser) => {
    setCurrentUser(user);
    showToast(`Sessão iniciada como ${user.name} (${user.role === 'admin' ? 'Administrador Geral' : user.role})`);
    
    // Auto open corresponding portal for convenience
    if (user.role === 'admin') {
      setIsAdminPortalOpen(true);
    } else if (user.role === 'courier') {
      setIsCourierPortalOpen(true);
    } else if (user.role === 'affiliate') {
      setIsAffiliatePortalOpen(true);
    }
  };

  const handleRegister = (newUser: AppUser) => {
    setUsers(prev => [newUser, ...prev]);
    showToast(`Conta registada com sucesso para ${newUser.name}!`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    showToast('Sessão terminada.');
  };

  // Cart operations
  const handleAddToCart = (product: Product, quantity = 1, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`"${product.title.slice(0, 25)}..." adicionado ao carrinho!`);
  };

  const handleBuyNow = (product: Product, quantity = 1, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    handleAddToCart(product, quantity);
    setIsCheckoutOpen(true);
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Artigo removido do carrinho.');
  };

  const handleClearCart = () => {
    setCart([]);
    showToast('Carrinho limpo com sucesso.');
  };

  // Order Submission (Cash on Delivery Luanda)
  const handleSubmitOrder = (customerInfo: OrderCustomerInfo) => {
    const subtotal = cart.reduce((acc, it) => acc + it.product.price * it.quantity, 0);
    const deliveryFee = customerInfo.deliveryType === 'paragem'
      ? (selectedZone.deliveryFeeBusStop ?? Math.round(selectedZone.deliveryFee * 0.6))
      : (selectedZone.deliveryFeeDoor ?? selectedZone.deliveryFee);
    const total = subtotal + deliveryFee;

    // Generate random 4-digit PIN for delivery validation
    const deliveryCode = Math.floor(1000 + Math.random() * 9000).toString();
    const orderNum = `#AO01-${Math.floor(10000 + Math.random() * 90000)}`;

    // Select default active courier
    const defaultCourier = users.find(u => u.role === 'courier' && u.courierStatus === 'aprovado');

    const newOrder: Order = {
      id: `order-${Date.now()}`,
      orderNumber: orderNum,
      date: 'Hoje, às ' + new Date().toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now(),
      items: [...cart],
      subtotal,
      deliveryFee,
      total,
      customer: customerInfo,
      status: 'recebido',
      estimatedDeliveryDate: `Hoje (${selectedZone.estimatedHours})`,
      deliveryCode,
      assignedCourierId: defaultCourier?.id || undefined,
      courier: defaultCourier ? {
        name: defaultCourier.name,
        phone: defaultCourier.phone,
        vehicle: defaultCourier.vehicle || 'Moto Haojue 150cc',
        avatar: defaultCourier.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      } : {
        name: 'Equipa de Entregas Luanda',
        phone: '+244 938 243 909',
        vehicle: 'Estafeta Autorizado',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      }
    };

    // If affiliate code was used, credit the affiliate
    if (customerInfo.affiliateCodeUsed) {
      const code = customerInfo.affiliateCodeUsed.toUpperCase();
      const affiliateUser = users.find(u => u.affiliateCode === code);
      if (affiliateUser) {
        const commissionAmount = Math.round(subtotal * ((affiliateUser.commissionRate || 7) / 100));
        setUsers(prev => prev.map(u => {
          if (u.id === affiliateUser.id) {
            return {
              ...u,
              totalSalesCount: (u.totalSalesCount || 0) + 1,
              totalCommissionEarned: (u.totalCommissionEarned || 0) + commissionAmount,
              balanceAOA: (u.balanceAOA || 0) + commissionAmount,
            };
          }
          return u;
        }));
      }
    }

    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    setIsCheckoutOpen(false);
    setNewOrderSuccess(newOrder);
  };

  // Courier Delivery Completion (Direct without PIN verification)
  const handleCourierCompleteDelivery = (orderId: string): boolean => {
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) {
      return false;
    }

    const courierIdToCredit = targetOrder.assignedCourierId || currentUser?.id;

    // Update order status to delivered
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return { ...o, status: 'entregue' };
      }
      return o;
    }));

    // Credit courier 1.000 Kz commission (from delivery fee profit) & update cash collected
    if (courierIdToCredit) {
      setUsers(prev => prev.map(u => {
        if (u.id === courierIdToCredit) {
          const isCash = targetOrder.customer.paymentMethod === 'dinheiro_entrega';
          const updatedUser: AppUser = {
            ...u,
            totalDeliveriesCompleted: (u.totalDeliveriesCompleted || 0) + 1,
            todayDeliveriesCount: (u.todayDeliveriesCount || 0) + 1,
            courierBalanceAOA: (u.courierBalanceAOA || 0) + 1000, // 1.000 Kz fixos por entrega
            cashCollectedToDeposit: isCash ? (u.cashCollectedToDeposit || 0) + targetOrder.total : u.cashCollectedToDeposit
          };
          if (currentUser && currentUser.id === u.id) {
            setCurrentUser(updatedUser);
          }
          return updatedUser;
        }
        return u;
      }));
    }

    showToast(`Entrega ${targetOrder.orderNumber} confirmada! +1.000 Kz creditados na sua carteira.`);
    return true;
  };

  // Order Status Updates
  const handleUpdateOrderStatus = (orderId: string, nextStatus: OrderStatus) => {
    const targetOrder = orders.find(o => o.id === orderId);
    const wasNotDelivered = targetOrder && targetOrder.status !== 'entregue';
    const isNowDelivered = nextStatus === 'entregue';

    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        return { ...order, status: nextStatus };
      })
    );

    // If marked as delivered from admin or courier, credit 1000 Kz to assigned courier if not already credited
    if (wasNotDelivered && isNowDelivered && targetOrder?.assignedCourierId) {
      const courierId = targetOrder.assignedCourierId;
      setUsers(prev => prev.map(u => {
        if (u.id === courierId) {
          const isCash = targetOrder.customer.paymentMethod === 'dinheiro_entrega';
          const updatedUser: AppUser = {
            ...u,
            totalDeliveriesCompleted: (u.totalDeliveriesCompleted || 0) + 1,
            todayDeliveriesCount: (u.todayDeliveriesCount || 0) + 1,
            courierBalanceAOA: (u.courierBalanceAOA || 0) + 1000,
            cashCollectedToDeposit: isCash ? (u.cashCollectedToDeposit || 0) + targetOrder.total : u.cashCollectedToDeposit
          };
          if (currentUser && currentUser.id === u.id) {
            setCurrentUser(updatedUser);
          }
          return updatedUser;
        }
        return u;
      }));
    }

    showToast(`Estado do pedido atualizado para ${nextStatus.toUpperCase()}!`);
  };

  const handleAssignCourierToOrder = (orderId: string, courierId: string) => {
    const courierObj = users.find(u => u.id === courierId);
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          assignedCourierId: courierId,
          courier: courierObj ? {
            name: courierObj.name,
            phone: courierObj.phone,
            vehicle: courierObj.vehicle || 'Moto',
            avatar: courierObj.avatar
          } : o.courier
        };
      }
      return o;
    }));
    showToast('Estafeta atribuído à encomenda com sucesso.');
  };

  const handleCancelOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: 'cancelado' } : order
      )
    );
    showToast('Pedido cancelado.');
  };

  // ADM Product Handlers (Only ADM can add/edit/delete)
  const handleAdminAddProduct = (newProd: Product) => {
    setProducts((prev) => [newProd, ...prev]);
    showToast('Artigo publicado no catálogo do AngolaMarket 01!');
  };

  const handleAdminUpdateProduct = (updatedProd: Product) => {
    setProducts((prev) => prev.map(p => p.id === updatedProd.id ? updatedProd : p));
    showToast('Artigo atualizado com sucesso!');
  };

  const handleAdminDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter(p => p.id !== productId));
    showToast('Artigo removido do catálogo.');
  };

  // ADM Delivery Neighborhood & Rate Handlers
  const handleAdminAddZone = (newZone: LuandaZone) => {
    setLuandaZones(prev => [newZone, ...prev]);
    if (!selectedZone || selectedZone.id === 'luanda_geral') {
      setSelectedZone(newZone);
    }
    showToast(`Bairro ${newZone.neighborhood || newZone.name} adicionado com sucesso!`);
  };

  const handleAdminUpdateZone = (updatedZone: LuandaZone) => {
    setLuandaZones(prev => prev.map(z => z.id === updatedZone.id ? updatedZone : z));
    if (selectedZone.id === updatedZone.id) {
      setSelectedZone(updatedZone);
    }
    showToast(`Taxa do bairro ${updatedZone.neighborhood || updatedZone.name} atualizada para ${formatKwanzas(updatedZone.deliveryFee)}!`);
  };

  const handleAdminDeleteZone = (zoneId: string) => {
    setLuandaZones(prev => {
      const remaining = prev.filter(z => z.id !== zoneId);
      if (selectedZone.id === zoneId) {
        setSelectedZone(remaining[0] || DEFAULT_BLANK_ZONE);
      }
      return remaining;
    });
    showToast('Bairro removido das taxas de entrega.');
  };

  // ADM Courier Approval Handlers
  const handleAdminApproveCourier = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, courierStatus: 'aprovado' };
      }
      return u;
    }));
    // If current logged user is this courier, update them too
    if (currentUser?.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, courierStatus: 'aprovado' } : null);
    }
    showToast('Entregador aprovado com sucesso! Agora pode receber e validar entregas em Luanda.');
  };

  const handleAdminRejectCourier = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, courierStatus: 'pendente' };
      }
      return u;
    }));
    showToast('Estado do entregador alterado para pendente.');
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (selectedCategory !== 'todos' && p.category !== selectedCategory) {
          return false;
        }
        if (onlyExpressLuanda && !p.expressDeliveryLuanda) {
          return false;
        }
        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase();
          const matchesTitle = p.title.toLowerCase().includes(term);
          const matchesDesc = p.description.toLowerCase().includes(term);
          const matchesTags = p.tags.some((t) => t.toLowerCase().includes(term));
          const matchesSeller = p.seller.name.toLowerCase().includes(term) || p.seller.location.toLowerCase().includes(term);
          if (!matchesTitle && !matchesDesc && !matchesTags && !matchesSeller) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (priceSort === 'price_asc') return a.price - b.price;
        if (priceSort === 'price_desc') return b.price - a.price;
        if (priceSort === 'rating') return b.rating - a.rating;
        return 0;
      });
  }, [products, selectedCategory, onlyExpressLuanda, searchTerm, priceSort]);

  // Dynamic Category Counts
  const categoriesWithCounts = useMemo(() => {
    return CATEGORIES.map((cat) => ({
      ...cat,
      itemCount: cat.id === 'todos' 
        ? products.length 
        : products.filter(p => p.category === cat.id).length
    }));
  }, [products]);

  // Cart stats
  const cartCount = cart.reduce((acc, it) => acc + it.quantity, 0);
  const cartTotal = cart.reduce((acc, it) => acc + it.product.price * it.quantity, 0);

  const scrollToCatalog = () => {
    const el = document.getElementById('catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenAdminPortal = () => {
    if (currentUser?.role === 'admin') {
      setIsAdminPortalOpen(true);
    } else {
      showToast('Acesso restrito. Inicie sessão como Administrador Geral.');
      setIsAuthModalOpen(true);
    }
  };

  const handleOpenCourierPortal = () => {
    if (currentUser?.role === 'courier') {
      setIsCourierPortalOpen(true);
    } else {
      showToast('Inicie sessão com a sua conta de Entregador / Estafeta.');
      setIsAuthModalOpen(true);
    }
  };

  const handleOpenAffiliatePortal = () => {
    if (currentUser?.role === 'affiliate') {
      setIsAffiliatePortalOpen(true);
    } else {
      showToast('Inicie sessão com a sua conta de Afiliado.');
      setIsAuthModalOpen(true);
    }
  };

  const handleFocusSearch = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      const mobileInput = document.getElementById('mobile-search-input');
      const desktopInput = document.getElementById('search-input');
      if (mobileInput && window.innerWidth < 768) {
        mobileInput.focus();
      } else if (desktopInput) {
        desktopInput.focus();
      }
    }, 150);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans selection:bg-red-500 selection:text-white pb-20 lg:pb-0">
      
      {/* Offline Status Bar */}
      <OfflineIndicator />

      {/* Discreet PWA Install Banner */}
      <PWAInstallBanner />

      {/* PWA Update Notification Toast */}
      <PWAUpdateToast />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 lg:bottom-6 right-6 z-50 bg-stone-900 border border-stone-800 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-bottom-5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedZone={selectedZone}
        onSelectZone={setSelectedZone}
        luandaZones={luandaZones}
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenOrders={() => setCurrentView('orders')}
        ordersCount={orders.filter(o => o.status !== 'entregue' && o.status !== 'cancelado').length}
        onOpenDeliveryInfo={() => setIsDeliveryInfoModalOpen(true)}
        onResetFilters={() => {
          setSelectedCategory('todos');
          setSearchTerm('');
          setCurrentView('marketplace');
        }}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onOpenUserProfile={() => setIsUserProfileOpen(true)}
        onOpenAdminPortal={handleOpenAdminPortal}
        onOpenCourierPortal={handleOpenCourierPortal}
        onOpenAffiliatePortal={handleOpenAffiliatePortal}
        pendingCouriersCount={pendingCouriersCount}
      />

      {/* Main Content Router */}
      {currentView === 'orders' ? (
        <main className="flex-1">
          <OrderTrackingView
            orders={orders}
            onBack={() => setCurrentView('marketplace')}
            onAdvanceStatus={(orderId) => {
              const ord = orders.find(o => o.id === orderId);
              if (ord) {
                let next: OrderStatus = ord.status;
                if (ord.status === 'recebido') next = 'preparando';
                else if (ord.status === 'preparando') next = 'em_transito';
                else if (ord.status === 'em_transito') next = 'entregue';
                handleUpdateOrderStatus(orderId, next);
              }
            }}
            onCancelOrder={handleCancelOrder}
          />
        </main>
      ) : (
        <main className="flex-1">
          {/* Hero Banner */}
          <HeroBanner
            selectedZone={selectedZone}
            onOpenDeliveryModal={() => setIsDeliveryInfoModalOpen(true)}
            onScrollToCatalog={scrollToCatalog}
            onOpenSellerModal={handleOpenAdminPortal}
          />

          {/* Category Filter Subnav */}
          <div id="catalog-section">
            <CategoryFilter
              categories={categoriesWithCounts}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              priceSort={priceSort}
              onPriceSortChange={setPriceSort}
              onlyExpressLuanda={onlyExpressLuanda}
              onToggleExpressLuanda={() => setOnlyExpressLuanda(!onlyExpressLuanda)}
              totalProductsCount={filteredProducts.length}
            />
          </div>

          {/* Products Grid */}
          <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
            {products.length === 0 ? (
              <div className="p-8 sm:p-14 text-center bg-white border border-stone-200 rounded-3xl space-y-4 max-w-xl mx-auto my-8 shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center mx-auto shadow-xs">
                  <Package className="w-8 h-8" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-black text-stone-900 tracking-tight">Catálogo Pronto para Produtos Reais</h3>
                  <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
                    Todos os itens fictícios e de exemplo foram limpos da plataforma. O Administrador Geral pode agora cadastrar os produtos reais com imagens, preços em Kwanzas e stock diretamente no Painel Administrativo.
                  </p>
                </div>
                <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5">
                  <button
                    onClick={handleOpenAdminPortal}
                    className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition-all transform active:scale-95 cursor-pointer flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Aceder ao Painel & Cadastrar Produtos</span>
                  </button>
                </div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="p-10 sm:p-16 text-center bg-white border border-stone-200 rounded-3xl space-y-4 max-w-lg mx-auto my-8 shadow-sm">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-stone-900">Nenhum artigo encontrado</h3>
                <p className="text-xs text-stone-500">
                  Não encontramos artigos correspondentes aos filtros de pesquisa selecionados.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('todos');
                    setOnlyExpressLuanda(false);
                  }}
                  className="px-5 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs cursor-pointer shadow-sm"
                >
                  Limpar Filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6">
                {filteredProducts.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    selectedZone={selectedZone}
                    onOpenDetails={(p) => setSelectedProduct(p)}
                    onAddToCart={(p, e) => handleAddToCart(p, 1, e)}
                    onBuyNow={(p, e) => handleBuyNow(p, 1, e)}
                    isAddedToCart={cart.some((it) => it.product.id === prod.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          selectedZone={selectedZone}
          luandaZones={luandaZones}
          onSelectZone={setSelectedZone}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
        />
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        selectedZone={selectedZone}
        onOpenCheckout={() => setIsCheckoutOpen(true)}
        onOpenDeliveryInfo={() => setIsDeliveryInfoModalOpen(true)}
      />

      {/* Checkout Modal with Luanda COD & dynamic Zones */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        selectedZone={selectedZone}
        onSelectZone={setSelectedZone}
        luandaZones={luandaZones}
        onSubmitOrder={handleSubmitOrder}
      />

      {/* Order Success Modal */}
      {newOrderSuccess && (
        <OrderSuccessModal
          order={newOrderSuccess}
          onClose={() => setNewOrderSuccess(null)}
          onTrackOrder={(orderId) => {
            setNewOrderSuccess(null);
            setCurrentView('orders');
          }}
        />
      )}

      {/* Luanda Delivery Info Modal with dynamic Zones */}
      <LuandaDeliveryInfoModal
        isOpen={isDeliveryInfoModalOpen}
        onClose={() => setIsDeliveryInfoModalOpen(false)}
        selectedZone={selectedZone}
        onSelectZone={(z) => {
          setSelectedZone(z);
          setIsDeliveryInfoModalOpen(false);
          showToast(`Zona alterada para ${z.neighborhood || z.name.split('(')[0]}`);
        }}
        luandaZones={luandaZones}
      />

      {/* Auth Modal (Login / Register / Hidden ADM after creation) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        users={users}
        onLogin={handleLogin}
        onRegister={handleRegister}
        adminExists={adminExists}
      />

      {/* Admin Portal Modal (Manage Products, Luanda Neighborhood Fees, Couriers, Orders, Affiliates, Financial Payouts) */}
      <AdminPortalModal
        isOpen={isAdminPortalOpen}
        onClose={() => setIsAdminPortalOpen(false)}
        products={products}
        onAddProduct={handleAdminAddProduct}
        onUpdateProduct={handleAdminUpdateProduct}
        onDeleteProduct={handleAdminDeleteProduct}
        luandaZones={luandaZones}
        onAddZone={handleAdminAddZone}
        onUpdateZone={handleAdminUpdateZone}
        onDeleteZone={handleAdminDeleteZone}
        users={users}
        onApproveCourier={handleAdminApproveCourier}
        onRejectCourier={handleAdminRejectCourier}
        orders={orders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onAssignCourierToOrder={handleAssignCourierToOrder}
        payoutRequests={payoutRequests}
        onApprovePayoutRequest={handleApprovePayout}
        onRejectPayoutRequest={handleRejectPayout}
        currentUser={currentUser || undefined}
        onUpdateAdminProfile={handleUpdateUserProfile}
      />

      {/* Courier Portal Modal (Active Deliveries, PIN Verification & Payout / Saque Requests) */}
      {currentUser && (
        <CourierPortalModal
          isOpen={isCourierPortalOpen}
          onClose={() => setIsCourierPortalOpen(false)}
          currentUser={currentUser}
          orders={orders}
          payoutRequests={payoutRequests}
          onRequestPayout={handleRequestPayout}
          onCompleteDelivery={handleCourierCompleteDelivery}
          onUpdateCourierProfile={handleUpdateUserProfile}
        />
      )}

      {/* Affiliate Portal Modal (Referral Link, Commissions & Payout / Saque Requests) */}
      {currentUser && (
        <AffiliatePortalModal
          isOpen={isAffiliatePortalOpen}
          onClose={() => setIsAffiliatePortalOpen(false)}
          currentUser={currentUser}
          products={products}
          orders={orders}
          payoutRequests={payoutRequests}
          onRequestPayout={handleRequestPayout}
          onToggleAffiliateProduct={handleToggleAffiliateProduct}
          onBatchAffiliateProducts={handleBatchAffiliateProducts}
          onUpdateAffiliateProfile={handleUpdateUserProfile}
        />
      )}

      {/* User Profile & Payment Methods Modal (Photo upload, IBAN, Multicaixa, Address) */}
      {currentUser && (
        <UserProfileModal
          isOpen={isUserProfileOpen}
          onClose={() => setIsUserProfileOpen(false)}
          currentUser={currentUser}
          onUpdateUser={handleUpdateUserProfile}
        />
      )}

      {/* Footer */}
      <Footer
        onOpenDeliveryInfo={() => setIsDeliveryInfoModalOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenAdminPortal={handleOpenAdminPortal}
        onOpenCourierPortal={handleOpenCourierPortal}
        onOpenAffiliatePortal={handleOpenAffiliatePortal}
        luandaZones={luandaZones}
      />

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        currentView={currentView}
        onNavigateHome={() => {
          setCurrentView('marketplace');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenCategories={() => {
          if (currentView !== 'marketplace') {
            setCurrentView('marketplace');
          }
          setTimeout(scrollToCatalog, 100);
        }}
        onFocusSearch={handleFocusSearch}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={cartCount}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenUserProfile={() => setIsUserProfileOpen(true)}
        onOpenAdminPortal={handleOpenAdminPortal}
        onOpenCourierPortal={handleOpenCourierPortal}
        onOpenAffiliatePortal={handleOpenAffiliatePortal}
        onOpenOrders={() => setCurrentView('orders')}
        onLogout={handleLogout}
      />

    </div>
  );
}
