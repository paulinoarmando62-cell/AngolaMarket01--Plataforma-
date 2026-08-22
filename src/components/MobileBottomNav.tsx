import React from 'react';
import { 
  Home, 
  Layers, 
  Search, 
  ShoppingCart, 
  User, 
  ShieldCheck, 
  Truck, 
  DollarSign,
  Package
} from 'lucide-react';
import { AppUser } from '../types';

interface MobileBottomNavProps {
  currentView: 'marketplace' | 'orders';
  onNavigateHome: () => void;
  onOpenCategories: () => void;
  onFocusSearch: () => void;
  onOpenCart: () => void;
  cartCount: number;
  currentUser: AppUser | null;
  onOpenAuth: () => void;
  onOpenAdminPortal: () => void;
  onOpenCourierPortal: () => void;
  onOpenAffiliatePortal: () => void;
  onOpenOrders: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  onNavigateHome,
  onOpenCategories,
  onFocusSearch,
  onOpenCart,
  cartCount,
  currentUser,
  onOpenAuth,
  onOpenAdminPortal,
  onOpenCourierPortal,
  onOpenAffiliatePortal,
  onOpenOrders
}) => {
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  const handleAccountClick = () => {
    if (!currentUser) {
      onOpenAuth();
    } else {
      setShowUserMenu(!showUserMenu);
    }
  };

  return (
    <>
      {/* Popover sheet for logged in user options on mobile */}
      {showUserMenu && currentUser && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex flex-col justify-end lg:hidden animate-in fade-in"
          onClick={() => setShowUserMenu(false)}
        >
          <div 
            className="bg-white rounded-t-3xl p-5 space-y-4 shadow-2xl border-t border-stone-200 animate-in slide-in-from-bottom"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1.5 bg-stone-300 rounded-full mx-auto" />
            
            <div className="flex items-center gap-3 pb-3 border-b border-stone-100">
              <img 
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'} 
                alt="" 
                className="w-11 h-11 rounded-2xl object-cover border border-stone-200" 
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-stone-900 truncate">{currentUser.name}</p>
                <p className="text-xs text-stone-500 truncate">{currentUser.email || currentUser.phone}</p>
                <span className="inline-block mt-0.5 text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
                  {currentUser.role === 'admin' ? 'Administrador Geral' : currentUser.role === 'courier' ? 'Estafeta Autorizado' : currentUser.role === 'affiliate' ? 'Afiliado Oficial' : 'Cliente'}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              {currentUser.role === 'admin' && (
                <button
                  type="button"
                  onClick={() => {
                    setShowUserMenu(false);
                    onOpenAdminPortal();
                  }}
                  className="w-full p-3 rounded-2xl bg-red-50 text-red-700 hover:bg-red-100 font-bold text-xs flex items-center justify-between transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-red-600" />
                    <span>Painel Administrativo (Dono)</span>
                  </div>
                  <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-full font-black">ADM</span>
                </button>
              )}

              {currentUser.role === 'courier' && (
                <button
                  type="button"
                  onClick={() => {
                    setShowUserMenu(false);
                    onOpenCourierPortal();
                  }}
                  className="w-full p-3 rounded-2xl bg-amber-50 text-amber-900 hover:bg-amber-100 font-bold text-xs flex items-center justify-between transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Truck className="w-4 h-4 text-amber-600" />
                    <span>Área do Entregador & Saldo</span>
                  </div>
                  <span className="text-[10px] bg-amber-500 text-stone-950 px-2 py-0.5 rounded-full font-black">Estafeta</span>
                </button>
              )}

              {currentUser.role === 'affiliate' && (
                <button
                  type="button"
                  onClick={() => {
                    setShowUserMenu(false);
                    onOpenAffiliatePortal();
                  }}
                  className="w-full p-3 rounded-2xl bg-blue-50 text-blue-900 hover:bg-blue-100 font-bold text-xs flex items-center justify-between transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <DollarSign className="w-4 h-4 text-blue-600" />
                    <span>Painel de Afiliado (Comissões)</span>
                  </div>
                  <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-black">Afiliado</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setShowUserMenu(false);
                  onOpenOrders();
                }}
                className="w-full p-3 rounded-2xl bg-stone-100 text-stone-800 hover:bg-stone-200 font-semibold text-xs flex items-center gap-2.5 transition-colors cursor-pointer"
              >
                <Package className="w-4 h-4 text-stone-600" />
                <span>Minhas Encomendas</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowUserMenu(false);
                  onOpenAuth();
                }}
                className="w-full p-3 rounded-2xl border border-stone-200 text-stone-700 hover:bg-stone-50 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Mudar de Conta / Ver Detalhes</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Persistent Bottom Bar on Mobile */}
      <nav 
        id="mobile-bottom-nav" 
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
      >
        <div className="flex items-center justify-around max-w-md mx-auto">
          {/* Home */}
          <button
            type="button"
            onClick={onNavigateHome}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors ${
              currentView === 'marketplace' ? 'text-red-600 font-bold' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Início</span>
          </button>

          {/* Categories */}
          <button
            type="button"
            onClick={onOpenCategories}
            className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-stone-500 hover:text-stone-800 transition-colors"
          >
            <Layers className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Categorias</span>
          </button>

          {/* Search Focus */}
          <button
            type="button"
            onClick={onFocusSearch}
            className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-stone-500 hover:text-stone-800 transition-colors"
          >
            <Search className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Pesquisar</span>
          </button>

          {/* Cart with Badge */}
          <button
            type="button"
            onClick={onOpenCart}
            className="relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-stone-700 hover:text-stone-900 transition-colors"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2.5 bg-red-600 text-white font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-mono animate-bounce">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5 font-medium">Carrinho</span>
          </button>

          {/* User Account / Login */}
          <button
            type="button"
            onClick={handleAccountClick}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors ${
              currentUser ? 'text-stone-900 font-bold' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            {currentUser ? (
              <div className="relative">
                <img 
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'} 
                  alt="" 
                  className="w-5 h-5 rounded-full object-cover border border-stone-300"
                  referrerPolicy="no-referrer"
                />
                {currentUser.role === 'admin' && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-600 rounded-full border border-white" />
                )}
              </div>
            ) : (
              <User className="w-5 h-5" />
            )}
            <span className="text-[10px] mt-0.5">
              {currentUser ? (currentUser.role === 'admin' ? 'ADM' : 'Conta') : 'Entrar'}
            </span>
          </button>
        </div>
      </nav>
    </>
  );
};
