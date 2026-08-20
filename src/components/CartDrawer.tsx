import React from 'react';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  Truck, 
  ShieldCheck, 
  CreditCard,
  Plus,
  Minus
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
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-stone-50 border-l border-stone-200 shadow-2xl flex flex-col text-stone-900">
          
          {/* Drawer Header */}
          <div className="p-4 bg-white border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-red-50 text-red-600 border border-red-100">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-base text-stone-900">Seu Carrinho</h2>
                <p className="text-xs text-stone-500">
                  {items.length} {items.length === 1 ? 'produto selecionado' : 'produtos selecionados'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <button
                  onClick={onClearCart}
                  className="text-xs font-bold text-stone-500 hover:text-red-600 transition-colors mr-2 cursor-pointer"
                >
                  Limpar
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-2xl bg-stone-100 text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Luanda Cash on Delivery Alert Bar */}
          <div className="bg-emerald-50 border-b border-emerald-100 px-4 py-2.5 flex items-center gap-2 text-xs text-emerald-900">
            <CreditCard className="w-4 h-4 shrink-0 text-emerald-600" />
            <span className="text-xs font-medium">
              <strong className="font-bold">Cash on Delivery:</strong> Pague só no ato da entrega em Luanda por TPA ou Dinheiro.
            </span>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-3xl bg-stone-100 flex items-center justify-center text-stone-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-base text-stone-900">Seu carrinho está vazio</h3>
                <p className="text-xs text-stone-500 max-w-xs">
                  Adicione artigos do nosso catálogo em Luanda e pague com toda a segurança na entrega.
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 px-5 py-2.5 rounded-2xl bg-stone-900 hover:bg-black text-white text-xs font-bold shadow-sm cursor-pointer"
                >
                  Continuar a Comprar
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.product.id}
                  className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-sm flex gap-3 items-center justify-between"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.title}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-xl object-cover bg-stone-100 shrink-0"
                  />

                  <div className="flex-1 min-w-0 pr-2">
                    <h4 className="text-xs font-bold text-stone-900 line-clamp-1">
                      {item.product.title}
                    </h4>
                    <p className="text-xs text-red-600 font-mono font-bold mt-0.5">
                      {formatKwanzas(item.product.price)}
                    </p>
                    <p className="text-[10px] text-stone-500 font-medium">
                      📍 {item.product.seller.location.split(',')[0]}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center rounded-xl bg-stone-100 border border-stone-200">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="px-2 py-1 text-stone-600 hover:text-stone-900 hover:bg-stone-200 rounded-l-xl text-xs font-bold cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 py-1 text-xs font-mono font-bold text-stone-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="px-2 py-1 text-stone-600 hover:text-stone-900 hover:bg-stone-200 rounded-r-xl text-xs font-bold cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-[11px] text-stone-500 font-mono">
                        = {formatKwanzas(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.product.id)}
                    className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                    title="Remover do Carrinho"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer / Summary */}
          {items.length > 0 && (
            <div className="p-4 bg-white border-t border-stone-200 space-y-3 shadow-lg">
              {/* Delivery Zone Row */}
              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-stone-700">
                  <span className="flex items-center gap-1.5 text-xs font-semibold">
                    <Truck className="w-3.5 h-3.5 text-amber-600" />
                    Destino: <strong className="text-stone-900">{selectedZone.name.split('(')[0]}</strong>
                  </span>
                  <button 
                    onClick={onOpenDeliveryInfo}
                    className="text-xs font-bold text-red-600 underline cursor-pointer"
                  >
                    Mudar Zona
                  </button>
                </div>
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span>Frete estimado Luanda:</span>
                  <span className="font-mono text-stone-900 font-bold">{formatKwanzas(selectedZone.deliveryFee)}</span>
                </div>
              </div>

              {/* Price Calculation */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-600 font-medium">
                  <span>Subtotal produtos:</span>
                  <span className="font-mono text-stone-900">{formatKwanzas(subtotal)}</span>
                </div>
                <div className="flex justify-between text-stone-600 font-medium">
                  <span>Taxa de Entrega Luanda:</span>
                  <span className="font-mono text-stone-900">{formatKwanzas(selectedZone.deliveryFee)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-100">
                  <span>Total a Pagar na Entrega:</span>
                  <span className="font-mono text-red-600 text-base font-black">{formatKwanzas(total)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                id="proceed-checkout-btn"
                onClick={() => {
                  onClose();
                  onOpenCheckout();
                }}
                className="w-full py-3 px-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition-all transform active:scale-95 cursor-pointer"
              >
                <span>Finalizar com Pagar na Entrega</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-stone-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Dinheiro físico ou TPA Multicaixa aceites</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
