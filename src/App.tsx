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
  DEFAULT_BLANK_ZONE,
  INITIAL_USERS,
  INITIAL_PAYOUT_REQUESTS,
  formatKwanzas 
} from './data/mockData';
import { safePersist, idbGet, idbSet } from './utils/storage';
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
  Plus,
  Cloud
} from 'lucide-react';
import { 
  subscribeToProducts, 
  cloudSaveProduct, 
  cloudDeleteProduct,
  subscribeToUsers, 
  cloudSaveUser,
  subscribeToOrders, 
  cloudSaveOrder,
  subscribeToZones, 
  cloudSaveZone, 
  cloudDeleteZone,
  subscribeToPayouts, 
  cloudSavePayout,
  seedLocalDataToCloud 
} from './services/firestoreSync';

const LOCAL_STORAGE_CART_KEY = 'angolamarket01_cart';
const LOCAL_STORAGE_ORDERS_KEY = 'angolamarket01_orders';
const LOCAL_STORAGE_PRODUCTS_KEY = 'angolamarket01_products';
const LOCAL_STORAGE_ZONE_KEY = 'angolamarket01_zone';
const LOCAL_STORAGE_ZONES_LIST_KEY = 'angolamarket01_zones_list';
const LOCAL_STORAGE_USERS_KEY = 'angolamarket01_users';
const LOCAL_STORAGE_CURRENT_USER_KEY = 'angolamarket01_current_user';
const LOCAL_STORAGE_PAYOUT_REQUESTS_KEY = 'angolamarket01_payout_requests';
const LOCAL_STORAGE_AFFILIATE_REF_KEY = 'angolamarket01_affiliate_ref';

// Clean storage versioning to immediately purge any old test data from user browsers
const CURRENT_APP_CLEAN_VERSION = 'v7_clean_zero_all_zones_and_data_final';

if (typeof window !== 'undefined') {
  try {
    const savedVer = localStorage.getItem('angolamarket_app_clean_ver');
    if (!savedVer) {
      localStorage.setItem('angolamarket_app_clean_ver', CURRENT_APP_CLEAN_VERSION);
    }
      
      // Clean users & remove mock addresses
      const rawUsers = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
      if (rawUsers) {
        const uList = JSON.parse(rawUsers);
        if (Array.isArray(uList)) {
          const cleaned = uList
            .filter((u: any) => 
              !u.id.includes('demo') && 
              !u.id.includes('test') && 
              !u.id.startsWith('courier-1') &&
              !u.id.startsWith('courier-2') &&
              !u.id.startsWith('courier-3') &&
              !u.id.startsWith('affiliate-1') &&
              !u.id.startsWith('buyer-1')
            )
            .map((u: any) => ({
              ...u,
              balanceAOA: 0,
              courierBalanceAOA: 0,
              totalDeliveriesCompleted: 0,
              cashCollectedToDeposit: 0,
              totalCommissionEarned: 0,
              defaultMunicipality: '',
              defaultNeighborhood: '',
              defaultStreetAddress: '',
              defaultReferencePoint: '',
              avatar: (u.avatar && !u.avatar.includes('images.unsplash.com')) ? u.avatar : ''
            }));
          localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(cleaned));
        }
      }

      // Clean current user
      const rawCurrent = localStorage.getItem(LOCAL_STORAGE_CURRENT_USER_KEY);
      if (rawCurrent) {
        const u = JSON.parse(rawCurrent);
        if (u && typeof u === 'object') {
          const cleanedCurrent = {
            ...u,
            balanceAOA: 0,
            courierBalanceAOA: 0,
            totalDeliveriesCompleted: 0,
            cashCollectedToDeposit: 0,
            totalCommissionEarned: 0,
            defaultMunicipality: '',
            defaultNeighborhood: '',
            defaultStreetAddress: '',
            defaultReferencePoint: '',
            avatar: (u.avatar && !u.avatar.includes('images.unsplash.com')) ? u.avatar : ''
          };
          localStorage.setItem(LOCAL_STORAGE_CURRENT_USER_KEY, JSON.stringify(cleanedCurrent));
        }
      }

      localStorage.setItem('angolamarket_app_clean_ver', CURRENT_APP_CLEAN_VERSION);
  } catch (e) {
    // ignore
  }
}

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
            !u.id.startsWith('courier-1') &&
            !u.id.startsWith('courier-2') &&
            !u.id.startsWith('courier-3') &&
            !u.id.startsWith('affiliate-1') &&
            !u.id.startsWith('buyer-1') &&
            !(u.email || '').includes('exemplo.com') && 
            !(u.email || '').includes('teste.ao')
          ).map((u: AppUser) => ({
            ...u,
            balanceAOA: 0,
            courierBalanceAOA: 0,
            totalDeliveriesCompleted: 0,
            cashCollectedToDeposit: 0,
            totalCommissionEarned: 0,
            avatar: (u.avatar && !u.avatar.includes('images.unsplash.com')) ? u.avatar : ''
          }));
          
          // Ensure master admin has real credentials without any fake stock avatar or fake IBAN
          const hasMaster = realOnly.some((u: AppUser) => u.email === 'paulinoarmando62@gmail.com');
          if (hasMaster) {
            return realOnly.map((u: AppUser) => u.email === 'paulinoarmando62@gmail.com' ? {
              ...u,
              password: 'Armando@123',
              role: 'admin',
              phone: '+244 938 243 909',
              name: 'Paulino Armando (Administrador Geral)',
              avatar: (u.avatar && !u.avatar.includes('images.unsplash.com')) ? u.avatar : ''
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
        if (parsed && parsed.id) {
          return {
            ...parsed,
            balanceAOA: 0,
            courierBalanceAOA: 0,
            totalDeliveriesCompleted: 0,
            cashCollectedToDeposit: 0,
            totalCommissionEarned: 0,
            avatar: (parsed.avatar && !parsed.avatar.includes('images.unsplash.com')) ? parsed.avatar : ''
          };
        }
      }
    } catch (e) {
      // fallback
    }
    return null;
  });

  // Dynamic Luanda Zones & Neighborhoods managed by the ADM (Starts clean at zero)
  const [luandaZones, setLuandaZones] = useState<LuandaZone[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_ZONES_LIST_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const realZones = parsed.filter((z: LuandaZone) => 
            z.id && 
            !z.id.startsWith('zone-ingombota') && 
            !z.id.startsWith('zone-maianga') && 
            !z.id.startsWith('zone-talatona') && 
            !z.id.startsWith('zone-kilamba') && 
            !z.id.startsWith('zone-viana') && 
            !z.id.startsWith('zone-belas') && 
            !z.id.startsWith('zone-cazenga') && 
            !z.id.startsWith('zone-cacuaco')
          );
          if (realZones.length > 0) return realZones;
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
        if (
          parsed && 
          parsed.id && 
          !parsed.id.startsWith('zone-ingombota') && 
          !parsed.id.startsWith('zone-maianga') && 
          !parsed.id.startsWith('zone-talatona') && 
          !parsed.id.startsWith('zone-kilamba') && 
          !parsed.id.startsWith('zone-viana') && 
          !parsed.id.startsWith('zone-belas') && 
          !parsed.id.startsWith('zone-cazenga') && 
          !parsed.id.startsWith('zone-cacuaco')
        ) {
          return parsed;
        }
      }
    } catch (e) {
      // fallback
    }
    return DEFAULT_BLANK_ZONE;
  });

  // Products state (Pristine clean state - only real products added by Admin / Platform)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_PRODUCTS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Keep all genuine products added by the user/admin
          return parsed.filter((p: Product) => p && p.id && p.title && !p.id.includes('demo-fake'));
        }
      }
    } catch (e) {
      // fallback
    }
    return [];
  });

  // Dual-layer recovery on startup: checks IndexedDB in background to ensure zero data loss
  useEffect(() => {
    idbGet<Product[]>(LOCAL_STORAGE_PRODUCTS_KEY).then((idbProds) => {
      if (Array.isArray(idbProds) && idbProds.length > 0) {
        setProducts((currentProds) => {
          if (currentProds.length === 0) return idbProds;
          const currentIds = new Set(currentProds.map(p => p.id));
          const missing = idbProds.filter(p => !currentIds.has(p.id));
          return missing.length > 0 ? [...currentProds, ...missing] : currentProds;
        });
      }
    }).catch(() => {});

    idbGet<LuandaZone[]>(LOCAL_STORAGE_ZONES_LIST_KEY).then((idbZones) => {
      if (Array.isArray(idbZones) && idbZones.length > 0) {
        setLuandaZones((currentZones) => {
          if (currentZones.length === 0) return idbZones;
          return currentZones;
        });
      }
    }).catch(() => {});

    idbGet<Order[]>(LOCAL_STORAGE_ORDERS_KEY).then((idbOrders) => {
      if (Array.isArray(idbOrders) && idbOrders.length > 0) {
        setOrders((currentOrders) => {
          if (currentOrders.length === 0) return idbOrders;
          const currentIds = new Set(currentOrders.map(o => o.id));
          const missing = idbOrders.filter(o => !currentIds.has(o.id));
          return missing.length > 0 ? [...currentOrders, ...missing] : currentOrders;
        });
      }
    }).catch(() => {});
  }, []);

  // Cart state (Clean zero)
  const [cart, setCart] = useState<CartItem[]>(() => {
    return [];
  });

  // Orders state - persistent real production orders
  const [orders, setOrders] = useState<Order[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            return parsed.filter((o: Order) => o && o.id && o.orderNumber);
          }
        }
      } catch (e) {}
    }
    return [];
  });

  // Automatically synchronize orders with localStorage
  useEffect(() => {
    safePersist(LOCAL_STORAGE_ORDERS_KEY, orders);
  }, [orders]);

  // Payout Requests state (Synchronized with localStorage)
  const [payoutRequests, setPayoutRequests] = useState<PayoutRequest[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_PAYOUT_REQUESTS_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) return parsed;
        }
      } catch (e) {}
    }
    return [];
  });

  useEffect(() => {
    safePersist(LOCAL_STORAGE_PAYOUT_REQUESTS_KEY, payoutRequests);
  }, [payoutRequests]);

  // Real-time Cloud Synchronization (Firebase Firestore) across all devices and phones
  useEffect(() => {
    // 1. Initial push: If this device has local products, users, orders, or zones created earlier,
    // seed them to the cloud database so other phones can access them immediately.
    seedLocalDataToCloud(products, users, orders, luandaZones, payoutRequests);

    // 2. Real-time subscription to Products
    const unsubProducts = subscribeToProducts((cloudProds) => {
      if (cloudProds && cloudProds.length > 0) {
        setProducts(cloudProds);
        safePersist(LOCAL_STORAGE_PRODUCTS_KEY, cloudProds);
      }
    });

    // 3. Real-time subscription to Users (Admins, Couriers, Affiliates, Clients)
    const unsubUsers = subscribeToUsers((cloudUsers) => {
      if (cloudUsers && cloudUsers.length > 0) {
        setUsers((prevUsers) => {
          const map = new Map<string, AppUser>();
          INITIAL_USERS.forEach((u) => map.set(u.id, u));
          cloudUsers.forEach((u) => map.set(u.id, u));
          prevUsers.forEach((u) => {
            if (!map.has(u.id)) map.set(u.id, u);
          });
          const merged = Array.from(map.values());
          safePersist(LOCAL_STORAGE_USERS_KEY, merged);
          return merged;
        });

        // Update currently logged in user if their cloud profile changed
        setCurrentUser((current) => {
          if (!current) return null;
          const updated = cloudUsers.find((u) => u.id === current.id);
          if (updated) {
            safePersist(LOCAL_STORAGE_CURRENT_USER_KEY, updated);
            return updated;
          }
          return current;
        });
      }
    });

    // 4. Real-time subscription to Orders & Delivery Schedules
    const unsubOrders = subscribeToOrders((cloudOrders) => {
      if (cloudOrders && cloudOrders.length > 0) {
        setOrders(cloudOrders);
        safePersist(LOCAL_STORAGE_ORDERS_KEY, cloudOrders);
      }
    });

    // 5. Real-time subscription to Luanda Delivery Zones
    const unsubZones = subscribeToZones((cloudZones) => {
      if (cloudZones && cloudZones.length > 0) {
        setLuandaZones(cloudZones);
        safePersist(LOCAL_STORAGE_ZONES_LIST_KEY, cloudZones);
        setSelectedZone((currentZone) => {
          if (!currentZone || currentZone.id === 'zone-default' || !currentZone.neighborhood) {
            return cloudZones[0] || currentZone;
          }
          const matched = cloudZones.find((z) => z.id === currentZone.id);
          return matched || currentZone;
        });
      }
    });

    // 6. Real-time subscription to Payout Requests
    const unsubPayouts = subscribeToPayouts((cloudPayouts) => {
      if (cloudPayouts && cloudPayouts.length > 0) {
        setPayoutRequests(cloudPayouts);
        safePersist(LOCAL_STORAGE_PAYOUT_REQUESTS_KEY, cloudPayouts);
      }
    });

    return () => {
      unsubProducts();
      unsubUsers();
      unsubOrders();
      unsubZones();
      unsubPayouts();
    };
  }, []);

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
  const [userProfileInitialTab, setUserProfileInitialTab] = useState<'perfil' | 'pedidos' | 'produtos'>('pedidos');
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState(false);
  const [isCourierPortalOpen, setIsCourierPortalOpen] = useState(false);
  const [isAffiliatePortalOpen, setIsAffiliatePortalOpen] = useState(false);

  const handleOpenClientOrders = () => {
    setUserProfileInitialTab('pedidos');
    setIsUserProfileOpen(true);
  };

  const handleOpenClientProducts = () => {
    setUserProfileInitialTab('produtos');
    setIsUserProfileOpen(true);
  };

  // Active Affiliate Referral Code (from URL parameter ?ref= or localStorage)
  const [activeAffiliateRefCode, setActiveAffiliateRefCode] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const refParam = searchParams.get('ref') || searchParams.get('affiliate') || searchParams.get('afiliado');
        if (refParam) {
          const cleanRef = refParam.trim().toUpperCase();
          localStorage.setItem(LOCAL_STORAGE_AFFILIATE_REF_KEY, cleanRef);
          return cleanRef;
        }
        return localStorage.getItem(LOCAL_STORAGE_AFFILIATE_REF_KEY) || '';
      } catch (e) {}
    }
    return '';
  });

  // URL Parameter Detection: ?ref=CODE&prod=PRODUCT_ID
  // Directs affiliate visitors directly to the product sales page without opening portal modals!
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const searchParams = new URLSearchParams(window.location.search);
      let refParam = searchParams.get('ref') || searchParams.get('affiliate') || searchParams.get('afiliado');
      let prodParam = searchParams.get('prod') || searchParams.get('produto') || searchParams.get('productId');

      // Check hash route fallback if applicable (e.g. #/?ref=...&prod=...)
      if (!refParam || !prodParam) {
        const hash = window.location.hash;
        if (hash && hash.includes('?')) {
          const hashQuery = hash.substring(hash.indexOf('?') + 1);
          const hashParams = new URLSearchParams(hashQuery);
          if (!refParam) refParam = hashParams.get('ref') || hashParams.get('affiliate') || hashParams.get('afiliado');
          if (!prodParam) prodParam = hashParams.get('prod') || hashParams.get('produto') || hashParams.get('productId');
        }
      }

      if (refParam) {
        const cleanRef = refParam.trim().toUpperCase();
        setActiveAffiliateRefCode(cleanRef);
        localStorage.setItem(LOCAL_STORAGE_AFFILIATE_REF_KEY, cleanRef);
      }

      if (prodParam) {
        const cleanProdId = prodParam.trim();
        const found = products.find(p => p.id === cleanProdId || p.id.toLowerCase() === cleanProdId.toLowerCase());
        if (found) {
          // CRUCIAL: Close any open portal (affiliate, admin, courier) so user lands directly on product sale page!
          setIsAffiliatePortalOpen(false);
          setIsAdminPortalOpen(false);
          setIsCourierPortalOpen(false);
          setIsAuthModalOpen(false);
          setCurrentView('marketplace');
          setSelectedProduct(found);
        }
      }
    } catch (err) {
      console.error('Error parsing affiliate URL parameters', err);
    }
  }, [products]);

  // Open product sales page directly from the Affiliate Portal with affiliate tracking
  const handleOpenProductSalePageFromAffiliate = (product: Product, affiliateCode: string) => {
    setActiveAffiliateRefCode(affiliateCode);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(LOCAL_STORAGE_AFFILIATE_REF_KEY, affiliateCode);
        const newUrl = `${window.location.pathname}?ref=${encodeURIComponent(affiliateCode)}&prod=${encodeURIComponent(product.id)}`;
        window.history.pushState({}, '', newUrl);
      } catch (e) {}
    }
    setIsAffiliatePortalOpen(false);
    setIsAdminPortalOpen(false);
    setIsCourierPortalOpen(false);
    setIsAuthModalOpen(false);
    setCurrentView('marketplace');
    setSelectedProduct(product);
  };

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Update User Profiles
  const handleUpdateUserProfile = (updatedUser: AppUser) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    setCurrentUser(updatedUser);
    cloudSaveUser(updatedUser);
    showToast('Perfil atualizado com sucesso!');
  };

  const handleClearAllTestData = () => {
    localStorage.removeItem(LOCAL_STORAGE_ORDERS_KEY);
    localStorage.removeItem(LOCAL_STORAGE_PAYOUT_REQUESTS_KEY);
    localStorage.removeItem(LOCAL_STORAGE_CART_KEY);
    localStorage.removeItem(LOCAL_STORAGE_ZONES_LIST_KEY);
    localStorage.removeItem(LOCAL_STORAGE_ZONE_KEY);
    setOrders([]);
    setPayoutRequests([]);
    setCart([]);
    setLuandaZones([]);
    setSelectedZone(DEFAULT_BLANK_ZONE);
    setUsers(prev => prev.map(u => ({
      ...u,
      balanceAOA: 0,
      courierBalanceAOA: 0,
      totalDeliveriesCompleted: 0,
      cashCollectedToDeposit: 0,
      totalCommissionEarned: 0,
      defaultMunicipality: '',
      defaultNeighborhood: '',
      defaultStreetAddress: '',
      defaultReferencePoint: ''
    })));
    setCurrentUser(prev => prev ? {
      ...prev,
      balanceAOA: 0,
      courierBalanceAOA: 0,
      totalDeliveriesCompleted: 0,
      cashCollectedToDeposit: 0,
      totalCommissionEarned: 0,
      defaultMunicipality: '',
      defaultNeighborhood: '',
      defaultStreetAddress: '',
      defaultReferencePoint: ''
    } : null);
    showToast('Todos os bairros, endereços, pedidos e saldos fictícios foram completamente apagados e zerados!');
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
    cloudSaveUser(updatedUser);
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
    cloudSaveUser(updatedUser);
    showToast(`Afiliado com sucesso a ${productIds.length} produtos de uma vez!`);
  };

  // Derived state
  const adminExists = useMemo(() => users.some(u => u.role === 'admin'), [users]);
  const pendingCouriersCount = useMemo(() => users.filter(u => u.role === 'courier' && u.courierStatus === 'pendente').length, [users]);

  // Synchronize state to LocalStorage and IndexedDB
  useEffect(() => {
    safePersist(LOCAL_STORAGE_USERS_KEY, users);
  }, [users]);

  useEffect(() => {
    safePersist(LOCAL_STORAGE_CURRENT_USER_KEY, currentUser);
  }, [currentUser]);

  useEffect(() => {
    safePersist(LOCAL_STORAGE_ZONES_LIST_KEY, luandaZones);
  }, [luandaZones]);

  useEffect(() => {
    safePersist(LOCAL_STORAGE_CART_KEY, cart);
  }, [cart]);

  useEffect(() => {
    safePersist(LOCAL_STORAGE_ORDERS_KEY, orders);
  }, [orders]);

  useEffect(() => {
    safePersist(LOCAL_STORAGE_PRODUCTS_KEY, products);
  }, [products]);

  useEffect(() => {
    safePersist(LOCAL_STORAGE_ZONE_KEY, selectedZone);
  }, [selectedZone]);

  useEffect(() => {
    safePersist(LOCAL_STORAGE_PAYOUT_REQUESTS_KEY, payoutRequests);
  }, [payoutRequests]);

  // Payout Handlers (Afiliados & Entregadores)
  const handleRequestPayout = (newRequestData: Omit<PayoutRequest, 'id' | 'requestedAt' | 'status'>) => {
    const reqAmount = newRequestData.amount || newRequestData.amountAOA || 0;
    const isAffiliate = newRequestData.type === 'afiliado';
    const fee = isAffiliate ? 200 : (newRequestData.feeAmount || 0);
    const net = Math.max(0, reqAmount - fee);

    const newReq: PayoutRequest = {
      ...newRequestData,
      id: `payout-${Date.now()}`,
      amount: reqAmount,
      amountAOA: reqAmount,
      feeAmount: fee,
      netAmount: net,
      status: 'pendente',
      requestedAt: new Date().toLocaleDateString('pt-AO') + ' ' + new Date().toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' })
    };

    // Deduct immediately from requester's balance
    setUsers(prev => prev.map(u => {
      if (u.id === newRequestData.requesterId) {
        if (isAffiliate) {
          const newBal = Math.max(0, (u.balanceAOA || 0) - reqAmount);
          const updated: AppUser = {
            ...u,
            balanceAOA: newBal,
            withdrawnAOA: (u.withdrawnAOA || 0) + reqAmount
          };
          if (currentUser?.id === u.id) setCurrentUser(updated);
          cloudSaveUser(updated);
          return updated;
        } else {
          const newBal = Math.max(0, (u.courierBalanceAOA || 0) - reqAmount);
          const updated: AppUser = {
            ...u,
            courierBalanceAOA: newBal
          };
          if (currentUser?.id === u.id) setCurrentUser(updated);
          cloudSaveUser(updated);
          return updated;
        }
      }
      return u;
    }));

    setPayoutRequests(prev => [newReq, ...prev]);
    cloudSavePayout(newReq);
    showToast(
      isAffiliate
        ? `Solicitação de saque de ${formatKwanzas(reqAmount)} enviada (Taxa de 200 Kz deduzida para a plataforma. Valor líquido a receber: ${formatKwanzas(net)})!`
        : `Solicitação de saque de ${formatKwanzas(reqAmount)} enviada ao Administrador!`
    );
  };

  const handleApprovePayout = (requestId: string, transactionRef?: string) => {
    let approvedReq: PayoutRequest | null = null;
    setPayoutRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        approvedReq = {
          ...req,
          status: 'pago',
          paidAt: new Date().toLocaleDateString('pt-AO') + ' ' + new Date().toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' }),
          transactionRef: transactionRef || `MCX-${Math.floor(100000 + Math.random() * 900000)}`,
          paymentProofReference: transactionRef || `MCX-${Math.floor(100000 + Math.random() * 900000)}`,
          paidByAdminName: currentUser?.name || 'Administrador Geral'
        };
        return approvedReq;
      }
      return req;
    }));

    if (approvedReq) {
      cloudSavePayout(approvedReq);
    }

    showToast('Pagamento confirmado e marcado como pago com sucesso!');
  };

  const handleRejectPayout = (requestId: string, reason?: string) => {
    const targetReq = payoutRequests.find(r => r.id === requestId);
    if (targetReq && targetReq.status === 'pendente') {
      const refundAmt = targetReq.amountAOA || targetReq.amount || 0;
      setUsers(prev => prev.map(u => {
        if (u.id === targetReq.requesterId) {
          if (targetReq.type === 'afiliado') {
            const restoredBal = (u.balanceAOA || 0) + refundAmt;
            const updated: AppUser = {
              ...u,
              balanceAOA: restoredBal,
              withdrawnAOA: Math.max(0, (u.withdrawnAOA || 0) - refundAmt)
            };
            if (currentUser?.id === u.id) setCurrentUser(updated);
            cloudSaveUser(updated);
            return updated;
          } else {
            const restoredBal = (u.courierBalanceAOA || 0) + refundAmt;
            const updated: AppUser = {
              ...u,
              courierBalanceAOA: restoredBal
            };
            if (currentUser?.id === u.id) setCurrentUser(updated);
            cloudSaveUser(updated);
            return updated;
          }
        }
        return u;
      }));
    }

    let rejectedReq: PayoutRequest | null = null;
    setPayoutRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        rejectedReq = {
          ...req,
          status: 'rejeitado',
          notes: reason || 'Rejeitado pelo Administrador'
        };
        return rejectedReq;
      }
      return req;
    }));

    if (rejectedReq) {
      cloudSavePayout(rejectedReq);
    }

    showToast('Solicitação de saque rejeitada e saldo devolvido à conta.');
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
    
    // Check if user is accessing a product sales page (?prod=...)
    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const hasProductInUrl = searchParams && (searchParams.get('prod') || searchParams.get('produto') || searchParams.get('productId'));

    // Auto open corresponding portal for convenience ONLY if not viewing a product sale page
    if (!hasProductInUrl && !selectedProduct) {
      if (user.role === 'admin') {
        setIsAdminPortalOpen(true);
      } else if (user.role === 'courier') {
        setIsCourierPortalOpen(true);
      } else if (user.role === 'affiliate') {
        setIsAffiliatePortalOpen(true);
      }
    }
  };

  const handleRegister = (newUser: AppUser) => {
    setUsers(prev => [newUser, ...prev]);
    cloudSaveUser(newUser);
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
  const handleSubmitOrder = (
    customerInfo: OrderCustomerInfo,
    newCustomerAccount?: { name: string; phone: string; password: string; email?: string }
  ) => {
    const subtotal = cart.reduce((acc, it) => acc + it.product.price * it.quantity, 0);
    const deliveryFee = customerInfo.deliveryType === 'paragem'
      ? (selectedZone.deliveryFeeBusStop ?? Math.round(selectedZone.deliveryFee * 0.6))
      : (selectedZone.deliveryFeeDoor ?? selectedZone.deliveryFee);
    const total = subtotal + deliveryFee;

    // Generate random 4-digit PIN for delivery validation
    const deliveryCode = Math.floor(1000 + Math.random() * 9000).toString();
    const orderNum = `#AO01-${Math.floor(10000 + Math.random() * 90000)}`;

    // Select default active courier if any
    const defaultCourier = users.find(u => u.role === 'courier' && u.courierStatus === 'aprovado') || users.find(u => u.role === 'courier');

    // Robust Affiliate code handling: check customerInfo.affiliateCodeUsed, activeAffiliateRefCode, or localStorage
    const rawRefCode = customerInfo.affiliateCodeUsed || activeAffiliateRefCode || (typeof window !== 'undefined' ? localStorage.getItem(LOCAL_STORAGE_AFFILIATE_REF_KEY) : null);
    const affiliateCodeClean = rawRefCode ? rawRefCode.trim().toUpperCase() : undefined;
    if (affiliateCodeClean && !customerInfo.affiliateCodeUsed) {
      customerInfo.affiliateCodeUsed = affiliateCodeClean;
    }

    const affiliateUser = affiliateCodeClean 
      ? users.find(u => u.affiliateCode && u.affiliateCode.trim().toUpperCase() === affiliateCodeClean) 
      : null;
    const commissionAmount = affiliateUser 
      ? Math.round(subtotal * ((affiliateUser.commissionRate || 8) / 100)) 
      : 0;

    // Create user account if requested in checkout or link to existing currentUser
    let newUserId: string | undefined = currentUser?.id;
    if (newCustomerAccount && !currentUser) {
      newUserId = `user-customer-${Date.now()}`;
      const createdAccount: AppUser = {
        id: newUserId,
        name: newCustomerAccount.name,
        phone: newCustomerAccount.phone,
        email: newCustomerAccount.email || `${newCustomerAccount.phone.replace(/[^0-9]/g, '')}@cliente.ao`,
        password: newCustomerAccount.password,
        role: 'buyer',
        createdAt: Date.now(),
        defaultNeighborhood: customerInfo.neighborhood,
        defaultMunicipality: customerInfo.municipalityName,
        defaultStreetAddress: customerInfo.streetAddress,
        defaultReferencePoint: customerInfo.referencePoint,
      };
      setUsers(prev => {
        const nextUsers = [createdAccount, ...prev];
        safePersist(LOCAL_STORAGE_USERS_KEY, nextUsers);
        return nextUsers;
      });
      setCurrentUser(createdAccount);
      safePersist(LOCAL_STORAGE_CURRENT_USER_KEY, createdAccount);
      cloudSaveUser(createdAccount);
    } else if (currentUser) {
      if (!customerInfo.phone && currentUser.phone) customerInfo.phone = currentUser.phone;
      if (!customerInfo.email && currentUser.email) customerInfo.email = currentUser.email;
      if (!customerInfo.fullName && currentUser.name) customerInfo.fullName = currentUser.name;
    }

    const newOrder: Order = {
      id: `order-${Date.now()}`,
      orderNumber: orderNum,
      date: 'Hoje, às ' + new Date().toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now(),
      items: [...cart],
      subtotal,
      deliveryFee,
      total,
      customer: { ...customerInfo, affiliateCodeUsed: affiliateCodeClean },
      status: 'recebido',
      estimatedDeliveryDate: `Hoje (${selectedZone.estimatedHours})`,
      deliveryCode,
      customerId: newUserId,
      assignedCourierId: defaultCourier?.id || undefined,
      affiliateCode: affiliateCodeClean,
      affiliateCommissionAmount: commissionAmount > 0 ? commissionAmount : undefined,
      courier: defaultCourier ? {
        name: defaultCourier.name,
        phone: defaultCourier.phone,
        vehicle: defaultCourier.vehicle || 'Moto Haojue 150cc',
        avatar: defaultCourier.avatar || ''
      } : {
        name: 'Equipa de Entregas Luanda',
        phone: '+244 938 243 909',
        vehicle: 'Estafeta Autorizado',
        avatar: ''
      }
    };

    // If affiliate code was used, credit the affiliate
    if (affiliateUser && commissionAmount > 0) {
      setUsers(prev => {
        const updated = prev.map(u => {
          if (u.id === affiliateUser.id) {
            const updatedAffiliate: AppUser = {
              ...u,
              totalSalesCount: (u.totalSalesCount || 0) + 1,
              totalCommissionEarned: (u.totalCommissionEarned || 0) + commissionAmount,
              balanceAOA: (u.balanceAOA || 0) + commissionAmount,
            };
            if (currentUser && currentUser.id === u.id) {
              setCurrentUser(updatedAffiliate);
              safePersist(LOCAL_STORAGE_CURRENT_USER_KEY, updatedAffiliate);
            }
            cloudSaveUser(updatedAffiliate);
            return updatedAffiliate;
          }
          return u;
        });
        safePersist(LOCAL_STORAGE_USERS_KEY, updated);
        return updated;
      });
    }

    setOrders((prev) => {
      const nextOrders = [newOrder, ...prev];
      safePersist(LOCAL_STORAGE_ORDERS_KEY, nextOrders);
      return nextOrders;
    });
    cloudSaveOrder(newOrder);
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
    const updatedOrder: Order = { ...targetOrder, status: 'entregue' };
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return updatedOrder;
      }
      return o;
    }));
    cloudSaveOrder(updatedOrder);

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
          cloudSaveUser(updatedUser);
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

    let updatedOrderObj: Order | null = null;
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        updatedOrderObj = { ...order, status: nextStatus };
        return updatedOrderObj;
      })
    );

    if (updatedOrderObj) {
      cloudSaveOrder(updatedOrderObj);
    }

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
          cloudSaveUser(updatedUser);
          return updatedUser;
        }
        return u;
      }));
    }

    showToast(`Estado do pedido atualizado para ${nextStatus.toUpperCase()}!`);
  };

  const handleAssignCourierToOrder = (orderId: string, courierId: string) => {
    const courierObj = users.find(u => u.id === courierId);
    let updatedAssignedOrder: Order | null = null;
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        updatedAssignedOrder = {
          ...o,
          assignedCourierId: courierId,
          courier: courierObj ? {
            name: courierObj.name,
            phone: courierObj.phone,
            vehicle: courierObj.vehicle || 'Moto',
            avatar: courierObj.avatar
          } : o.courier
        };
        return updatedAssignedOrder;
      }
      return o;
    }));
    if (updatedAssignedOrder) {
      cloudSaveOrder(updatedAssignedOrder);
    }
    showToast('Estafeta atribuído à encomenda com sucesso.');
  };

  const handleCancelOrder = (orderId: string) => {
    let cancelledOrder: Order | null = null;
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          cancelledOrder = { ...order, status: 'cancelado' };
          return cancelledOrder;
        }
        return order;
      })
    );
    if (cancelledOrder) {
      cloudSaveOrder(cancelledOrder);
    }
    showToast('Pedido cancelado.');
  };

  // ADM Product Handlers (Only ADM can add/edit/delete)
  const handleAdminAddProduct = (newProd: Product) => {
    setProducts((prev) => {
      const next = [newProd, ...prev];
      safePersist(LOCAL_STORAGE_PRODUCTS_KEY, next);
      return next;
    });
    cloudSaveProduct(newProd);
    showToast('Artigo publicado no catálogo do AngolaMarket 01!');
  };

  const handleAdminUpdateProduct = (updatedProd: Product) => {
    setProducts((prev) => {
      const next = prev.map(p => p.id === updatedProd.id ? updatedProd : p);
      safePersist(LOCAL_STORAGE_PRODUCTS_KEY, next);
      return next;
    });
    cloudSaveProduct(updatedProd);
    showToast('Artigo atualizado com sucesso!');
  };

  const handleAdminDeleteProduct = (productId: string) => {
    setProducts((prev) => {
      const next = prev.filter(p => p.id !== productId);
      safePersist(LOCAL_STORAGE_PRODUCTS_KEY, next);
      return next;
    });
    cloudDeleteProduct(productId);
    showToast('Artigo removido do catálogo.');
  };

  // ADM Delivery Neighborhood & Rate Handlers
  const handleAdminAddZone = (newZone: LuandaZone) => {
    setLuandaZones(prev => [newZone, ...prev]);
    if (!selectedZone || selectedZone.id === 'zone-default' || selectedZone.id === 'luanda_geral' || !selectedZone.neighborhood) {
      setSelectedZone(newZone);
    }
    cloudSaveZone(newZone);
    showToast(`Bairro ${newZone.neighborhood || newZone.name} adicionado com sucesso!`);
  };

  const handleAdminUpdateZone = (updatedZone: LuandaZone) => {
    setLuandaZones(prev => prev.map(z => z.id === updatedZone.id ? updatedZone : z));
    if (selectedZone.id === updatedZone.id) {
      setSelectedZone(updatedZone);
    }
    cloudSaveZone(updatedZone);
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
    cloudDeleteZone(zoneId);
    showToast('Bairro removido das taxas de entrega.');
  };

  // ADM Courier Approval Handlers
  const handleAdminApproveCourier = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const updated: AppUser = { ...u, courierStatus: 'aprovado' };
        cloudSaveUser(updated);
        return updated;
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
        const updated: AppUser = { ...u, courierStatus: 'pendente' };
        cloudSaveUser(updated);
        return updated;
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
                  <h3 className="text-lg font-black text-stone-900 tracking-tight">Catálogo de Produtos em Atualização</h3>
                  <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
                    Nenhum artigo disponível de momento. Novos artigos com entrega rápida em Luanda serão disponibilizados brevemente.
                  </p>
                </div>
                <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5">
                  <button
                    onClick={handleOpenAdminPortal}
                    className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition-all transform active:scale-95 cursor-pointer flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Painel de Gestão & Adicionar Artigos</span>
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
          affiliateRefCode={activeAffiliateRefCode}
          affiliateUser={
            activeAffiliateRefCode
              ? users.find(u => u.affiliateCode && u.affiliateCode.trim().toUpperCase() === activeAffiliateRefCode.trim().toUpperCase()) || null
              : null
          }
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
        affiliateRefCode={activeAffiliateRefCode}
        users={users}
        currentUser={currentUser}
        onLoginUser={handleLogin}
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
        onClearAllTestData={handleClearAllTestData}
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
          onOpenProductPage={handleOpenProductSalePageFromAffiliate}
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
