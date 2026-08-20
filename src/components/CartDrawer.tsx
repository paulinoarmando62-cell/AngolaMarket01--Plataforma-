import React from 'react';
import { 
  X, 
  ArrowLeft,
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  Truck, 
  ShieldCheck, 
  CreditCard,
  Plus,
  Minus,
  CheckCircle2,
  Lock,
  ChevronRight
} from 'lucide-react';
import { CartItem, LuandaZone } from '../types';
import { formatKwanzas } from '../data/mockData';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  selectedZone: LuandaZone;
  onOpenCheckout: () => void;
  onOpenDeliveryInfo: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  selectedZone,
  onOpenCheckout,
  onOpenDeliveryInfo,
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const total = subtotal + (items.length > 0 ? selectedZone.deliveryFee : 0);

  return (
    <div 
      id="cart-fullscreen-modal"
      className="fixed inset-0 z-50 bg-stone-50 text-stone-900 flex flex-col w-screen h-screen min-h-screen overflow-hidden animate-in fade-in"
    >
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-4 sm:px-8 py-3.5 border-b border-stone-200 bg-white sticky top-0 z-20 shrink-0 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition-colors cursor-pointer border border-stone-200"
          >
            <ArrowLeft className="w-4 h-4 text-stone-700" />
            <span className="hidden sm:inline">Continuar a Comprar</span>
            <span className="sm:hidden">Voltar</span>
          </button>

          <div className="h-5 w-px bg-stone-200 hidden sm:block" />

          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-50 text-red-600 border border-red-100">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h1 className="font-black text-sm sm:text-base text-stone-900 leading-tight">
                Carrinho de Compras
              </h1>
              <p className="text-[11px] text-stone-500 font-medium">
                {items.length} {items.length === 1 ? 'artigo adicionado' : 'artigos adicionados'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {items.length > 0 && (
            <button
              onClick={onClearCart}
              className="text-xs font-bold text-stone-500 hover:text-red-600 transition-colors px-3 py-1.5 rounded-xl hover:bg-red-50 cursor-pointer border border-transparent hover:border-red-200"
            >
              Esvaziar Carrinho
            </button>
          )}

          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-stone-100 text-stone-600 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer border border-stone-200"
            title="Fechar Carrinho"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Cash on Delivery Top Notification Banner */}
      <div className="bg-emerald-50 border-b border-emerald-200 px-4 sm:px-8 py-2.5 flex items-center justify-between text-xs text-emerald-900 shrink-0">
        <div className="flex items-center gap-2 max-w-4xl">
          <CreditCard className="w-4 h-4 shrink-0 text-emerald-700" />
          <span>
            <strong className="font-bold">Pagamento na Entrega (Cash on Delivery):</strong> Sem risco! Você só paga após receber e conferir os artigos na sua morada em Luanda.
          </span>
        </div>
        <span className="hidden md:inline-flex items-center gap-1 font-bold text-emerald-800 text-[11px] bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          Multicaixa Express ou Dinheiro
        </span>
      </div>

      {/* Main Fullscreen Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-stone-50">
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4 max-w-md mx-auto my-auto">
            <div className="w-20 h-20 rounded-3xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-400 shadow-xs">
              <ShoppingBag className="w-10 h-10 text-stone-400" />
            </div>
            <h2 className="font-black text-xl text-stone-900">O seu carrinho está vazio</h2>
            <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
              Explore o nosso catálogo de produtos disponíveis em Luanda e adicione os seus favoritos para pagar confortavelmente na entrega.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
            >
              Explorar Catálogo Agora
            </button>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: Items in cart (7 Cols on desktop) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-stone-700 uppercase tracking-wider">
                  Artigos Selecionados ({items.length})
                </h2>
                <span className="text-xs text-stone-500">
                  Preços com IVA incluído
                </span>
              </div>

              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="p-4 sm:p-5 rounded-3xl bg-white border border-stone-200 shadow-xs flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between transition-all hover:border-stone-300"
                  >
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <img
                        src={item.product.image}
                        alt={item.product.title}
                        referrerPolicy="no-referrer"
                        className="w-20 h-20 rounded-2xl object-cover bg-stone-100 border border-stone-200 shrink-0"
                      />

                      <div className="space-y-1 min-w-0 flex-1">
                        <span className="text-[10px] uppercase font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-100">
                          {item.product.category.replace('_', ' ')}
                        </span>
                        <h3 className="text-sm font-bold text-stone-900 truncate">
                          {item.product.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-mono font-bold text-stone-900">
                            {formatKwanzas(item.product.price)}
                          </span>
                          <span className="text-stone-400">/ unidade</span>
                        </div>
                        <p className="text-[11px] text-stone-500 flex items-center gap-1">
                          <span>📍 Stock: {item.product.seller.location}</span>
                        </p>
                      </div>
                    </div>

                    {/* Quantity Selector & Item Total */}
                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                      <div className="flex items-center rounded-2xl bg-stone-100 border border-stone-200 overflow-hidden">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="px-3 py-2 text-stone-600 hover:text-stone-900 hover:bg-stone-200 text-xs font-bold cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3.5 py-1 text-xs font-mono font-bold text-stone-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="px-3 py-2 text-stone-600 hover:text-stone-900 hover:bg-stone-200 text-xs font-bold cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-stone-400 block">Subtotal</span>
                        <span className="text-sm font-black font-mono text-stone-900">
                          {formatKwanzas(item.product.price * item.quantity)}
                        </span>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="p-2.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-colors cursor-pointer border border-transparent hover:border-red-100"
                        title="Remover do Carrinho"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT COLUMN: Order Summary & Checkout Box (5 Cols on desktop) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white p-6 sm:p-7 rounded-3xl border border-stone-200 shadow-sm space-y-5 sticky top-20">
                <h2 className="text-base font-black text-stone-900">
                  Resumo da Encomenda
                </h2>

                {/* Delivery Zone Card */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-800 flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-red-600" />
                      Zona de Entrega (Luanda)
                    </span>
                    <button 
                      onClick={onOpenDeliveryInfo}
                      className="text-xs font-bold text-red-600 hover:underline cursor-pointer"
                    >
                      Alterar
                    </button>
                  </div>
                  
                  <div className="p-2.5 rounded-xl bg-white border border-stone-200 flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-900">{selectedZone.name}</span>
                    <span className="font-mono font-bold text-emerald-700">{formatKwanzas(selectedZone.deliveryFee)}</span>
                  </div>

                  <p className="text-[11px] text-stone-500">
                    Prazo estimado de entrega: <strong className="text-stone-700">{selectedZone.estimatedHours}</strong>
                  </p>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between text-stone-600 font-medium">
                    <span>Subtotal de Artigos:</span>
                    <span className="font-mono text-stone-900 font-bold">{formatKwanzas(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-stone-600 font-medium">
                    <span>Taxa de Entrega Luanda:</span>
                    <span className="font-mono text-stone-900 font-bold">{formatKwanzas(selectedZone.deliveryFee)}</span>
                  </div>
                  
                  <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
                    <div>
                      <span className="text-sm font-black text-stone-900 block">Total a Pagar na Entrega:</span>
                      <span className="text-[10px] text-emerald-700 font-semibold">Paga ao estafeta no destino</span>
                    </div>
                    <span className="font-mono text-2xl font-black text-red-600">{formatKwanzas(total)}</span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <button
                  id="proceed-checkout-btn"
                  onClick={() => {
                    onClose();
                    onOpenCheckout();
                  }}
                  className="w-full py-4 px-6 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-sm sm:text-base shadow-md flex items-center justify-center gap-2 transition-all transform active:scale-98 cursor-pointer"
                >
                  <span>Avançar para Checkout (Pagar na Entrega)</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                {/* Guarantees */}
                <div className="space-y-2 pt-2 border-t border-stone-100 text-xs text-stone-500">
                  <div className="flex items-center gap-2 text-stone-700">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Conferência obrigatória antes do pagamento ao estafeta</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-700">
                    <Lock className="w-4 h-4 text-stone-500 shrink-0" />
                    <span>Dados de entrega protegidos e com acompanhamento via GPS</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};
