import React, { useState } from 'react';
import { 
  X, 
  Star, 
  MapPin, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Banknote, 
  CheckCircle2, 
  ShoppingCart, 
  Zap, 
  MessageCircle, 
  Clock, 
  Share2, 
  Check
} from 'lucide-react';
import { Product, LuandaZone } from '../types';
import { LUANDA_ZONES, formatKwanzas } from '../data/mockData';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  selectedZone: LuandaZone;
  onSelectZone: (zone: LuandaZone) => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onBuyNow: (product: Product, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  selectedZone,
  onSelectZone,
  onAddToCart,
  onBuyNow,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [reviewTab, setReviewTab] = useState<'desc' | 'specs' | 'reviews'>('desc');

  if (!product) return null;

  const currentImage = selectedImage || product.image;
  const gallery = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleWhatsAppSeller = () => {
    const text = encodeURIComponent(
      `Olá ${product.seller.name}! Vi o anúncio do "${product.title}" no AngolaMarket 01 (${formatKwanzas(product.price)}). Gostaria de tirar uma dúvida sobre a entrega em Luanda.`
    );
    window.open(`https://wa.me/${product.seller.phone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto">
      <div 
        id="product-detail-modal"
        className="relative w-full max-w-4xl bg-white border border-stone-200 rounded-3xl shadow-2xl text-stone-900 overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-stone-200 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="bg-red-50 text-red-700 border border-red-200 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {product.condition}
            </span>
            <span className="text-xs text-stone-500 font-mono">Ref: #{product.id.slice(-6).toUpperCase()}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-2xl bg-stone-100 text-stone-600 hover:text-stone-900 transition-colors text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              title="Copiar Link"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copiedLink ? 'Copiado!' : 'Partilhar'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-2xl bg-stone-100 text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Gallery Section */}
            <div className="md:col-span-6 space-y-3">
              <div className="relative aspect-square w-full rounded-3xl bg-stone-100 overflow-hidden border border-stone-200 flex items-center justify-center">
                <img
                  src={currentImage}
                  alt={product.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />
                {product.discountPercent && (
                  <span className="absolute top-3 left-3 bg-red-600 text-white font-black text-xs px-2.5 py-1 rounded-full shadow-sm">
                    -{product.discountPercent}% DESCONTO
                  </span>
                )}
                <span className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md text-emerald-800 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                  <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                  Pagar só na Entrega em Luanda
                </span>
              </div>

              {/* Thumbnails */}
              {gallery.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {gallery.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`w-16 h-16 rounded-2xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                        currentImage === img ? 'border-red-600 scale-95 shadow-sm' : 'border-stone-200 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>
              )}

              {/* Cash on Delivery Guarantee Notice */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5 text-xs text-stone-600">
                <div className="flex items-center gap-1.5 font-bold text-stone-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Proteção Total ao Comprador de Luanda</span>
                </div>
                <p className="text-xs leading-relaxed">
                  Você só efetua o pagamento ao estafeta após abrir o pacote, conferir o equipamento e testar.
                  Aceitamos <strong className="text-stone-900">Dinheiro físico com troco</strong> ou transferência <strong className="text-stone-900">Multicaixa Express</strong>.
                </p>
              </div>
            </div>

            {/* Product Info & Action Section */}
            <div className="md:col-span-6 space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                  <span className="text-red-600 font-bold uppercase tracking-wider text-[10px]">
                    {product.category.replace('_', ' ')}
                  </span>
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <span className="font-bold text-stone-900">{product.rating}</span>
                    <span className="text-stone-400">({product.reviewCount} avaliações)</span>
                  </div>
                </div>

                <h1 className="text-xl sm:text-2xl font-black text-stone-900 leading-snug">
                  {product.title}
                </h1>
              </div>

              {/* Price Banner */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-stone-900 font-mono">
                    {formatKwanzas(product.price)}
                  </div>
                  {product.originalPrice && (
                    <div className="text-xs text-stone-400 line-through font-mono">
                      {formatKwanzas(product.originalPrice)} (Economize {formatKwanzas(product.originalPrice - product.price)})
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Em Stock ({product.stockCount} un.)
                  </span>
                </div>
              </div>

              {/* Luanda Shipping Selector & Estimation */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-800 flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-amber-600" />
                    Calcular Entrega em Luanda:
                  </span>
                </div>

                <select
                  value={selectedZone.id}
                  onChange={(e) => {
                    const found = LUANDA_ZONES.find(z => z.id === e.target.value);
                    if (found) onSelectZone(found);
                  }}
                  className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900 font-semibold focus:outline-none focus:border-red-500 cursor-pointer"
                >
                  {LUANDA_ZONES.map(z => (
                    <option key={z.id} value={z.id}>
                      {z.name} - {formatKwanzas(z.deliveryFee)} ({z.estimatedHours})
                    </option>
                  ))}
                </select>

                <div className="flex items-center justify-between text-xs text-stone-600 pt-1">
                  <span>Frete para {selectedZone.name.split('(')[0]}: <strong className="text-stone-900">{formatKwanzas(selectedZone.deliveryFee)}</strong></span>
                  <span className="text-emerald-700 font-bold">Prazo: {selectedZone.estimatedHours}</span>
                </div>
              </div>

              {/* Seller Box */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-stone-900">{product.seller.name}</span>
                    {product.seller.verified && (
                      <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] px-2 py-0.2 rounded-full font-bold flex items-center gap-0.5">
                        <CheckCircle2 className="w-2.5 h-2.5" /> Verificado
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-red-600" />
                    {product.seller.location}
                  </p>
                </div>

                <button
                  onClick={handleWhatsAppSeller}
                  className="px-3.5 py-1.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>
              </div>

              {/* Quantity and Actions */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-stone-700">Quantidade:</span>
                  <div className="flex items-center rounded-2xl bg-stone-100 border border-stone-200 overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1 text-stone-600 hover:bg-stone-200 text-sm font-bold cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 text-xs font-mono font-bold text-stone-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                      className="px-3 py-1 text-stone-600 hover:bg-stone-200 text-sm font-bold cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-stone-500 font-mono">
                    Total: <strong className="text-stone-900">{formatKwanzas(product.price * quantity)}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      onAddToCart(product, quantity);
                      onClose();
                    }}
                    className="py-3 px-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4 text-stone-700" />
                    <span>Adicionar ao Carrinho</span>
                  </button>

                  <button
                    onClick={() => {
                      onBuyNow(product, quantity);
                      onClose();
                    }}
                    className="py-3 px-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold shadow-sm flex items-center justify-center gap-2 transition-all transform active:scale-95 cursor-pointer"
                  >
                    <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                    <span>Pagar na Entrega Já</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Tabs Section: Description / Features / Reviews */}
          <div className="pt-6 border-t border-stone-200">
            <div className="flex border-b border-stone-200 gap-4 text-xs font-bold">
              <button
                onClick={() => setReviewTab('desc')}
                className={`pb-2 transition-colors cursor-pointer ${
                  reviewTab === 'desc' ? 'border-b-2 border-red-600 text-red-600' : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                Descrição do Produto
              </button>
              <button
                onClick={() => setReviewTab('specs')}
                className={`pb-2 transition-colors cursor-pointer ${
                  reviewTab === 'specs' ? 'border-b-2 border-red-600 text-red-600' : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                Especificações Técnicas
              </button>
              <button
                onClick={() => setReviewTab('reviews')}
                className={`pb-2 transition-colors cursor-pointer flex items-center gap-1 ${
                  reviewTab === 'reviews' ? 'border-b-2 border-red-600 text-red-600' : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                <span>Opiniões de Clientes em Luanda</span>
                <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full text-[10px]">
                  {product.reviews?.length || 0}
                </span>
              </button>
            </div>

            <div className="py-4 text-xs text-stone-600 leading-relaxed">
              {reviewTab === 'desc' && (
                <div className="space-y-3">
                  <p>{product.description}</p>
                  <div className="pt-2">
                    <span className="font-bold text-stone-900 block mb-2">Destaques do Artigo:</span>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {product.features.map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-2 bg-stone-50 p-2.5 rounded-2xl border border-stone-200 text-stone-800">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {reviewTab === 'specs' && (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                    <span className="text-stone-500">Condição:</span>
                    <span className="font-bold text-stone-900">{product.condition}</span>
                    <span className="text-stone-500">Localização do Stock:</span>
                    <span className="font-bold text-stone-900">{product.seller.location}</span>
                    <span className="text-stone-500">Modalidade de Pagamento:</span>
                    <span className="font-bold text-emerald-700">Cash on Delivery / TPA Multicaixa</span>
                    <span className="text-stone-500">Garantia Comercial:</span>
                    <span className="font-bold text-stone-900">Garantia com troca imediata no ato</span>
                  </div>
                </div>
              )}

              {reviewTab === 'reviews' && (
                <div className="space-y-3">
                  {product.reviews && product.reviews.length > 0 ? (
                    product.reviews.map((rev) => (
                      <div key={rev.id} className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-stone-900 text-xs">{rev.userName}</span>
                            <span className="text-[10px] text-stone-600 bg-stone-200/80 px-2 py-0.5 rounded-full font-medium">
                              📍 {rev.userCity}
                            </span>
                            {rev.verifiedPurchase && (
                              <span className="text-[9px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                                Compra COD Verificada
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-stone-400">{rev.date}</span>
                        </div>
                        <div className="flex items-center gap-1 text-amber-500">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-500" />
                          ))}
                        </div>
                        <p className="text-stone-700 text-xs">{rev.comment}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-stone-400 italic">Ainda não há avaliações para este produto. Seja o primeiro a receber e avaliar em Luanda!</p>
                  )}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
