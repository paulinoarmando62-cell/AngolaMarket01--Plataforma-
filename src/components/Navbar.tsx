import React from 'react';
import { 
  Search, 
  ShoppingCart, 
  MapPin, 
  Package, 
  PlusCircle, 
  ShieldCheck,
  X,
  CreditCard,
  Menu,
  User,
  LogIn,
  LogOut,
  Truck,
  DollarSign,
  ChevronDown
} from 'lucide-react';
import { LuandaZone, AppUser } from '../types';
import { formatKwanzas } from '../data/mockData';

interface NavbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedZone: LuandaZone;
  onSelectZone: (zone: LuandaZone) => void;
  luandaZones: LuandaZone[];
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onOpenOrders: () => void;
  ordersCount: number;
  onOpenDeliveryInfo: () => void;
  onResetFilters: () => void;
  // Auth & Roles
  currentUser: AppUser | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenUserProfile?: () => void;
  onOpenAdminPortal: () => void;
  onOpenCourierPortal: () => void;
  onOpenAffiliatePortal: () => void;
  pendingCouriersCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchTerm,
  onSearchChange,
  selectedZone,
  onSelectZone,
  luandaZones,
  cartCount,
  cartTotal,
  onOpenCart,
  onOpenOrders,
  ordersCount,
  onOpenDeliveryInfo,
  onResetFilters,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenUserProfile,
  onOpenAdminPortal,
  onOpenCourierPortal,
  onOpenAffiliatePortal,
  pendingCouriersCount,
}) => {
  const [showZoneDropdown, setShowZoneDropdown] = React.useState(false);
  const [showUserDropdown, setShowUserDropdown] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white text-stone-900 shadow-sm border-b border-stone-200">
      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3.5">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo */}
          <button 
            id="brand-logo-btn"
            onClick={onResetFilters} 
            className="flex items-center gap-2 text-left group cursor-pointer shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-red-600 flex items-center justify-center font-black text-white text-sm sm:text-base shadow-sm">
              AO<span className="text-amber-300">01</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg md:text-xl font-black tracking-tight text-stone-900 group-hover:text-red-600 transition-colors">
                  AngolaMarket
                </span>
                <span className="bg-stone-900 text-white text-[10px] sm:text-xs font-black px-1.5 py-0.5 rounded-md">
                  01
                </span>
              </div>
              <p className="text-[9px] sm:text-[10px] text-stone-500 tracking-wide uppercase font-semibold">
                Marketplace Luanda
              </p>
            </div>
          </button>

          {/* Desktop Location Picker (Luanda Zone with live fees) */}
          <div className="relative hidden lg:block">
            <button
              id="location-picker-btn"
              onClick={() => setShowZoneDropdown(!showZoneDropdown)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-stone-100 hover:bg-stone-200/80 border border-stone-200 text-left text-xs transition-all cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-red-600 shrink-0" />
              <div>
                <span className="block text-[10px] text-stone-500 leading-none">Bairro de Entrega</span>
                <span className="font-semibold text-stone-800 truncate max-w-[140px] block">
                  {selectedZone.neighborhood || selectedZone.name.split('(')[0]}
                </span>
              </div>
              <span className="text-[11px] text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full font-mono font-bold">
                {formatKwanzas(selectedZone.deliveryFee)}
              </span>
            </button>

            {showZoneDropdown && (
              <div 
                id="zone-dropdown-menu"
                className="absolute left-0 mt-2 w-80 bg-white border border-stone-200 rounded-3xl shadow-xl p-3 z-50 animate-in fade-in"
              >
                <div className="p-2 border-b border-stone-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-900">Selecione seu Bairro em Luanda</span>
                  <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">Cash on Delivery</span>
                </div>
                <div className="max-h-64 overflow-y-auto py-1 space-y-1">
                  {luandaZones.map((zone) => (
                    <button
                      key={zone.id}
                      onClick={() => {
                        onSelectZone(zone);
                        setShowZoneDropdown(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-2xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        selectedZone.id === zone.id 
                          ? 'bg-red-50 text-red-700 border border-red-200 font-bold' 
                          : 'text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      <div>
                        <p className="font-semibold">{zone.neighborhood || zone.name}</p>
                        <p className="text-[10px] text-stone-500 font-normal">{zone.municipality} • {zone.estimatedHours}</p>
                      </div>
                      <span className="font-bold text-stone-900 font-mono">
                        {formatKwanzas(zone.deliveryFee)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Desktop Search Bar (hidden on mobile, rendered below) */}
          <div className="hidden md:flex flex-1 max-w-xl relative">
            <div className="relative w-full">
              <input
                id="search-input"
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Pesquise iPhones, Samakaka, Geradores, Geleiras, Cesta Básica..."
                className="w-full bg-stone-100 text-stone-900 placeholder-stone-400 text-xs md:text-sm pl-10 pr-10 py-2.5 rounded-full border border-stone-200 focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition-all"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              {searchTerm && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-800 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Quick Actions & Role Badges */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            
            {/* Role-Specific Direct Navigation Buttons (Desktop / Tablets) */}
            {currentUser?.role === 'admin' && (
              <button
                id="admin-portal-nav-btn"
                onClick={onOpenAdminPortal}
                className="relative hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Painel ADM</span>
                {pendingCouriersCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-amber-400 text-stone-950 font-black text-[9px] flex items-center justify-center animate-pulse">
                    {pendingCouriersCount}
                  </span>
                )}
              </button>
            )}

            {currentUser?.role === 'courier' && (
              <button
                id="courier-portal-nav-btn"
                onClick={onOpenCourierPortal}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold shadow-sm transition-all cursor-pointer"
              >
                <Truck className="w-4 h-4" />
                <span>Área do Entregador</span>
              </button>
            )}

            {currentUser?.role === 'affiliate' && (
              <button
                id="affiliate-portal-nav-btn"
                onClick={onOpenAffiliatePortal}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
              >
                <DollarSign className="w-4 h-4" />
                <span>Área de Afiliado</span>
              </button>
            )}

            {/* Desktop-Only User Auth Button / Dropdown (Mobile users have dedicated Bottom Bar & Drawer) */}
            <div className="relative hidden md:block">
              {currentUser ? (
                <div>
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-stone-100 hover:bg-stone-200 border border-stone-200 text-xs font-bold transition-all cursor-pointer"
                  >
                    <img 
                      src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'} 
                      alt="" 
                      className="w-6 h-6 rounded-xl object-cover" 
                      referrerPolicy="no-referrer"
                    />
                    <span className="inline max-w-[100px] truncate text-stone-900 font-semibold">
                      {currentUser.name.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
                  </button>

                  {showUserDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-stone-200 rounded-3xl shadow-xl p-2 z-50 animate-in fade-in space-y-1">
                      <div className="p-2.5 border-b border-stone-100">
                        <p className="font-bold text-xs text-stone-900 truncate">{currentUser.name}</p>
                        <p className="text-[10px] text-stone-500 capitalize">{currentUser.role === 'admin' ? 'Administrador Geral' : currentUser.role}</p>
                      </div>

                      {currentUser.role === 'admin' && (
                        <button
                          onClick={() => { onOpenAdminPortal(); setShowUserDropdown(false); }}
                          className="w-full text-left p-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                        >
                          <ShieldCheck className="w-4 h-4" /> Gestão ADM
                        </button>
                      )}

                      {currentUser.role === 'courier' && (
                        <button
                          onClick={() => { onOpenCourierPortal(); setShowUserDropdown(false); }}
                          className="w-full text-left p-2 rounded-xl text-xs font-bold text-amber-700 hover:bg-amber-50 flex items-center gap-2 cursor-pointer"
                        >
                          <Truck className="w-4 h-4" /> Minhas Entregas
                        </button>
                      )}

                      {currentUser.role === 'affiliate' && (
                        <button
                          onClick={() => { onOpenAffiliatePortal(); setShowUserDropdown(false); }}
                          className="w-full text-left p-2 rounded-xl text-xs font-bold text-blue-600 hover:bg-blue-50 flex items-center gap-2 cursor-pointer"
                        >
                          <DollarSign className="w-4 h-4" /> Painel de Afiliado
                        </button>
                      )}

                      <button
                        onClick={() => { if (onOpenUserProfile) onOpenUserProfile(); setShowUserDropdown(false); }}
                        className="w-full text-left p-2 rounded-xl text-xs font-semibold text-stone-800 hover:bg-stone-100 flex items-center gap-2 cursor-pointer"
                      >
                        <User className="w-4 h-4 text-stone-600" /> Meu Perfil & Pagamentos
                      </button>

                      <button
                        onClick={() => { onOpenOrders(); setShowUserDropdown(false); }}
                        className="w-full text-left p-2 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-100 flex items-center gap-2 cursor-pointer"
                      >
                        <Package className="w-4 h-4" /> Minhas Compras ({ordersCount})
                      </button>

                      <button
                        onClick={() => { onLogout(); setShowUserDropdown(false); }}
                        className="w-full text-left p-2 rounded-xl text-xs font-semibold text-stone-500 hover:text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer pt-2 border-t border-stone-100"
                      >
                        <LogOut className="w-4 h-4" /> Terminar Sessão
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  id="auth-login-btn"
                  onClick={onOpenAuth}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-800 text-xs font-bold transition-all cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 text-red-600" />
                  <span>Entrar</span>
                </button>
              )}
            </div>

            {/* Shopping Cart Button */}
            <button
              id="cart-drawer-btn"
              onClick={onOpenCart}
              className="relative flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-2xl bg-stone-900 hover:bg-black text-white text-xs md:text-sm font-bold shadow-sm transition-all transform active:scale-95 cursor-pointer shrink-0"
            >
              <ShoppingCart className="w-4 h-4 text-white" />
              <span className="hidden sm:inline">Carrinho</span>
              {cartCount > 0 ? (
                <span className="bg-red-600 text-white text-[11px] sm:text-xs font-black px-1.5 sm:px-2 py-0.5 rounded-full font-mono">
                  {cartCount}
                </span>
              ) : (
                <span className="text-[11px] text-stone-400 font-mono">0</span>
              )}
              {cartTotal > 0 && (
                <span className="hidden lg:inline text-xs font-mono font-semibold pl-1.5 border-l border-stone-700 text-amber-300">
                  {formatKwanzas(cartTotal)}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-2xl bg-stone-100 text-stone-700 hover:bg-stone-200 cursor-pointer shrink-0"
              aria-label="Abrir Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Full-Width Search Input (Clean, high contrast, native app look) */}
        <div className="md:hidden mt-2.5">
          <div className="relative w-full">
            <input
              id="mobile-search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Pesquise iPhones, Samakaka, Cesta Básica..."
              className="w-full bg-stone-100 text-stone-900 placeholder-stone-400 text-xs pl-10 pr-9 py-2.5 h-10 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition-all shadow-2xs"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3 pointer-events-none" />
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-2 p-1 text-stone-400 hover:text-stone-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-stone-200 space-y-2 pb-2">
            <div className="flex items-center justify-between text-xs text-stone-800 bg-stone-100 p-3 rounded-2xl border border-stone-200">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-600" />
                <span>Bairro: <strong>{selectedZone.neighborhood || selectedZone.name.split('(')[0]}</strong></span>
              </div>
              <button 
                onClick={onOpenDeliveryInfo}
                className="text-red-600 underline font-bold"
              >
                Taxas Luanda
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {currentUser?.role === 'admin' && (
                <button
                  onClick={() => { onOpenAdminPortal(); setMobileMenuOpen(false); }}
                  className="flex-1 py-2.5 rounded-2xl bg-red-600 text-white text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" /> Painel de ADM
                </button>
              )}

              {currentUser?.role === 'courier' && (
                <button
                  onClick={() => { onOpenCourierPortal(); setMobileMenuOpen(false); }}
                  className="flex-1 py-2.5 rounded-2xl bg-amber-500 text-stone-950 text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <Truck className="w-4 h-4" /> Entregas Pendentes
                </button>
              )}

              {currentUser?.role === 'affiliate' && (
                <button
                  onClick={() => { onOpenAffiliatePortal(); setMobileMenuOpen(false); }}
                  className="flex-1 py-2.5 rounded-2xl bg-blue-600 text-white text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <DollarSign className="w-4 h-4" /> Saldo & Link Afiliado
                </button>
              )}

              {currentUser && (
                <button
                  onClick={() => { if (onOpenUserProfile) onOpenUserProfile(); setMobileMenuOpen(false); }}
                  className="w-full py-2.5 rounded-2xl bg-stone-200 hover:bg-stone-300 text-stone-900 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <User className="w-4 h-4 text-stone-700" /> Meu Perfil & Pagamentos
                </button>
              )}

              {!currentUser && (
                <button
                  onClick={() => { onOpenAuth(); setMobileMenuOpen(false); }}
                  className="w-full py-2.5 rounded-2xl bg-stone-900 text-white text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <LogIn className="w-4 h-4" /> Iniciar Sessão / Registar
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
