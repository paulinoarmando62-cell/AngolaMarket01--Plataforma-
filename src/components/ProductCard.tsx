import React from 'react';
import { 
  Star, 
  MapPin, 
  ShieldCheck, 
  ShoppingCart, 
  Zap, 
  Check,
  CreditCard,
  Eye
} from 'lucide-react';
import { Product, LuandaZone } from '../types';
import { formatKwanzas } from '../data/mockData';

interface ProductCardProps {
  product: Product;
  selectedZone: LuandaZone;
  onOpenDetails: (product: Product) => void;
  onAddToCart: (product: Product, e?: React.MouseEvent) => void;
  onBuyNow: (product: Product, e?: React.MouseEvent) => void;
  isAddedToCart?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  selectedZone,
  onOpenDetails,
  onAddToCart,
  onBuyNow,
  isAddedToCart = false,
}) => {
  return (
    <div 
      id={`product-card-${product.id}`}
      className="group bg-white border border-stone-200 rounded-2xl sm:rounded-3xl overflow-hidden hover:border-stone-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between p-2.5 sm:p-4"
    >
      {/* Image & Badges Container */}
      <div 
        onClick={() => onOpenDetails(product)} 
        className="relative h-36 sm:h-52 w-full bg-stone-100 rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer flex items-center justify-center"
      >
        <img
          src={product.image}
          alt={product.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-1.5 sm:top-2.5 left-1.5 sm:left-2.5 right-1.5 sm:right-2.5 flex items-center justify-between gap-1 pointer-events-none">
          {product.discountPercent ? (
            <span className="bg-red-600 text-white text-[9px] sm:text-[11px] font-black px-2 py-0.5 rounded-full shadow-sm">
              -{product.discountPercent}%
            </span>
          ) : (
            <span className="bg-white/90 backdrop-blur-sm text-stone-800 text-[8px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-stone-200 shadow-sm">
              {product.condition}
            </span>
          )}

          {product.cashOnDelivery && (
            <span className="bg-emerald-50/95 text-emerald-800 border border-emerald-200 text-[8px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1 backdrop-blur-sm">
              <CreditCard className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-emerald-600 shrink-0" />
              <span className="hidden xs:inline sm:inline">COD</span>
              <span>Luanda</span>
            </span>
          )}
        </div>

        {/* Quick View Button on Hover (desktop) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetails(product);
          }}
          className="hidden sm:flex absolute inset-x-3 bottom-3 py-2 rounded-2xl bg-white/95 hover:bg-white text-stone-900 text-xs font-bold backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center gap-1.5 border border-stone-200 shadow-sm cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5 text-red-600" />
          <span>Ver Detalhes</span>
        </button>
      </div>

      {/* Product Body */}
      <div className="pt-2.5 sm:pt-3.5 flex-1 flex flex-col justify-between space-y-2 sm:space-y-3">
        <div>
          {/* Seller & Rating in Luanda */}
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-stone-500 mb-1 gap-1">
            <span className="flex items-center gap-1 truncate text-stone-600 font-semibold max-w-[65%]">
              <MapPin className="w-2.5 sm:w-3 h-2.5 sm:h-3 shrink-0 text-red-600" />
              <span className="truncate">{product.seller.location.split(',')[0]}</span>
            </span>
            <span className="flex items-center gap-0.5 text-stone-700 bg-stone-100 px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold shrink-0">
              <Star className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-amber-500 fill-amber-500" />
              <span>{product.rating}</span>
            </span>
          </div>

          {/* Product Title */}
          <h3 
            onClick={() => onOpenDetails(product)}
            className="font-bold text-xs sm:text-sm text-stone-900 group-hover:text-red-600 transition-colors line-clamp-2 cursor-pointer leading-tight sm:leading-snug min-h-[2rem] sm:min-h-[2.5rem]"
          >
            {product.title}
          </h3>

          {/* Luanda Delivery ETA chip */}
          <div className="mt-1 sm:mt-1.5 text-[9px] sm:text-[11px] text-stone-500 flex items-center gap-1 truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            <span className="truncate">Entrega em <strong className="text-stone-800">{selectedZone.neighborhood || selectedZone.name.split('(')[0]}</strong></span>
          </div>
        </div>

        {/* Price & Actions */}
        <div className="pt-2 sm:pt-2.5 border-t border-stone-100 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-0.5">
            <div>
              <div className="text-xs sm:text-base font-black text-stone-900 font-mono tracking-tight">
                {formatKwanzas(product.price)}
              </div>
              {product.originalPrice && (
                <div className="text-[9px] sm:text-[11px] text-stone-400 line-through font-mono leading-none">
                  {formatKwanzas(product.originalPrice)}
                </div>
              )}
            </div>

            <span className="text-[8px] sm:text-[9px] text-emerald-800 font-bold bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200 self-start sm:self-auto">
              Pagar ao Receber
            </span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2 pt-0.5">
            <button
              id={`add-cart-${product.id}`}
              type="button"
              onClick={(e) => onAddToCart(product, e)}
              className={`py-2 px-1 sm:px-2 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                isAddedToCart
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200'
              }`}
            >
              {isAddedToCart ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span className="truncate">Salvo</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3 h-3 text-stone-700 shrink-0" />
                  <span className="truncate">Carrinho</span>
                </>
              )}
            </button>

            <button
              id={`buy-now-${product.id}`}
              type="button"
              onClick={(e) => onBuyNow(product, e)}
              className="py-2 px-1 sm:px-2 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-sm flex items-center justify-center gap-1 transition-all transform active:scale-95 cursor-pointer"
            >
              <Zap className="w-3 h-3 text-amber-300 fill-amber-300 shrink-0" />
              <span className="truncate">Comprar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
