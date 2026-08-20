import React, { useState } from 'react';
import { 
  X, 
  ArrowLeft,
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
  Check,
  Package,
  Layers,
  ChevronRight
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
  const [deliveryMethodTab, setDeliveryMethodTab] = useState<'porta' | 'paragem'>('porta');

  if (!product) return null;

  const currentImage = selectedImage || product.image;
  const gallery = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];

  const doorFee = selectedZone.deliveryFeeDoor || selectedZone.deliveryFee;
  const busStopFee = selectedZone.deliveryFeeBusStop || Math.round(selectedZone.deliveryFee * 0.6);
  const currentFee = deliveryMethodTab === 'porta' ? doorFee : busStopFee;

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
    <div 
      id="product-detail-modal"
      className="fixed inset-0 z-50 bg-stone-50 text-stone-900 flex flex-col w-screen h-screen min-h-screen overflow-hidden animate-in fade-in"
    >
      {/* Top Header Bar (Full Screen Breadcrumb / Actions) */}
      <div className="flex items-center justify-between px-4 sm:px-8 py-3.5 border-b border-stone-200 bg-white sticky top-0 z-20 shrink-0 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition-colors cursor-pointer border border-stone-200"
          >
            <ArrowLeft className="w-4 h-4 text-stone-700" />
            <span className="hidden sm:inline">Voltar às Compras</span>
            <span className="sm:hidden">Voltar</span>
          </button>

          <div className="h-5 w-px bg-stone-200 hidden sm:block" />

          {/* Breadcrumb Info */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-stone-500">
            <span>AngolaMarket 01</span>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <span className="font-semibold text-stone-700 capitalize">{product.category.replace('_', ' ')}</span>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <span className="font-mono text-stone-400">Ref: #{product.id.slice(-6).toUpperCase()}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-red-50 text-red-700 border border-red-200 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase">
            {product.condition}
          </span>
          <button
            onClick={handleShare}
            className="p-2 sm:px-3 sm:py-2 rounded-2xl bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors text-xs font-semibold flex items-center gap-1.5 cursor-pointer border border-stone-200"
            title="Copiar Link do Produto"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-stone-600" />}
            <span className="hidden sm:inline">{copiedLink ? 'Link Copiado!' : 'Partilhar'}</span>
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-stone-100 text-stone-600 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer border border-stone-200"
            title="Fechar Detalhe"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Full-Screen Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-stone-50">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Main Grid: Left Gallery | Right Details & Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: Gallery & Guarantees */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative aspect-4/3 sm:aspect-square w-full rounded-3xl bg-white overflow-hidden border border-stone-200 flex items-center justify-center shadow-sm">
                <img
                  src={currentImage}
                  alt={product.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />
                {product.discountPercent && (
                  <span className="absolute top-4 left-4 bg-red-600 text-white font-black text-xs px-3 py-1.5 rounded-full shadow-md">
                    -{product.discountPercent}% DESCONTO
                  </span>
                )}
                <span className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md text-emerald-800 border border-emerald-200 text-xs font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  Pagar só na Entrega em Luanda
                </span>
              </div>

              {/* Thumbnails */}
              {gallery.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {gallery.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer bg-white ${
                        currentImage === img ? 'border-red-600 ring-2 ring-red-100 scale-95 shadow-sm' : 'border-stone-200 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>
              )}

              {/* Cash on Delivery & Luanda Guarantee Notice */}
              <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-2 text-xs text-stone-600">
                <div className="flex items-center gap-2 font-black text-sm text-stone-900">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span>Garantia de Compra Segura — AngolaMarket 01</span>
                </div>
                <p className="leading-relaxed text-stone-600">
                  Você só efetua o pagamento ao estafeta após inspecionar o produto no momento da entrega em Luanda.
                  Pague confortavelmente com <strong className="text-stone-900">Dinheiro Físico</strong> ou transferência <strong className="text-stone-900">Multicaixa Express</strong>.
                </p>
                <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] font-bold text-stone-700">
                  <div className="flex items-center gap-1.5 p-2 rounded-xl bg-stone-50 border border-stone-100">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verificação no Ato</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-2 rounded-xl bg-stone-50 border border-stone-100">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Estafeta Próprio em Luanda</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Product Info, Price, Delivery Calculator, CTAs */}
            <div className="lg:col-span-6 space-y-5">
              <div className="bg-white p-6 sm:p-7 rounded-3xl border border-stone-200 shadow-sm space-y-5">
                
                <div>
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                    <span className="text-red-600 font-bold uppercase tracking-wider text-[11px] bg-red-50 px-2.5 py-0.5 rounded-md border border-red-100">
                      {product.category.replace('_', ' ')}
                    </span>
                    <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      <span className="font-bold text-stone-900">{product.rating}</span>
                      <span className="text-stone-500">({product.reviewCount} avaliações)</span>
                    </div>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-black text-stone-900 leading-snug">
                    {product.title}
                  </h1>
                </div>

                {/* Price & Stock Card */}
                <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">Preço à Vista (Cash on Delivery)</span>
                    <div className="text-3xl sm:text-4xl font-black text-stone-900 font-mono">
                      {formatKwanzas(product.price)}
                    </div>
                    {product.originalPrice && (
                      <div className="text-xs text-stone-400 line-through font-mono mt-0.5">
                        {formatKwanzas(product.originalPrice)} (Economize {formatKwanzas(product.originalPrice - product.price)})
                      </div>
                    )}
                  </div>
                  <div className="sm:text-right">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Em Stock ({product.stockCount} un.)
                    </span>
                    <span className="text-[10px] text-stone-500 block mt-1">Pronto para entrega imediata</span>
                  </div>
                </div>

                {/* Luanda Shipping Selector & Estimation (Dual Door vs Bus Stop) */}
                <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-800 flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-red-600" />
                      Calcular Frete em Luanda:
                    </span>
                    <span className="text-[11px] text-stone-500 font-medium">Selecione o seu bairro</span>
                  </div>

                  <select
                    value={selectedZone.id}
                    onChange={(e) => {
                      const found = LUANDA_ZONES.find(z => z.id === e.target.value);
                      if (found) onSelectZone(found);
                    }}
                    className="w-full bg-white border border-stone-200 rounded-2xl p-3 text-xs text-stone-900 font-semibold focus:outline-none focus:border-red-500 cursor-pointer shadow-2xs"
                  >
                    {LUANDA_ZONES.map(z => (
                      <option key={z.id} value={z.id}>
                        {z.name} ({z.estimatedHours})
                      </option>
                    ))}
                  </select>

                  {/* Delivery Option Toggle in Product Detail */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setDeliveryMethodTab('porta')}
                      className={`p-2.5 rounded-xl text-xs font-bold transition-all text-left border cursor-pointer ${
                        deliveryMethodTab === 'porta'
                          ? 'bg-red-50 text-red-900 border-red-300 shadow-2xs'
                          : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      <span className="block text-[10px] uppercase font-bold text-red-600">🏠 À Porta de Casa</span>
                      <span className="font-mono font-black text-xs text-stone-900">{formatKwanzas(doorFee)}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryMethodTab('paragem')}
                      className={`p-2.5 rounded-xl text-xs font-bold transition-all text-left border cursor-pointer ${
                        deliveryMethodTab === 'paragem'
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-300 shadow-2xs'
                          : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      <span className="block text-[10px] uppercase font-bold text-emerald-700">🚏 Na Paragem</span>
                      <span className="font-mono font-black text-xs text-stone-900">{formatKwanzas(busStopFee)}</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs text-stone-600 pt-1 border-t border-stone-200/60">
                    <span>Prazo Estimado de Chegada:</span>
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {selectedZone.estimatedHours}
                    </span>
                  </div>
                </div>

                {/* Seller Box with WhatsApp CTA */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between">
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
                    className="px-3.5 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>
                </div>

                {/* Quantity and Primary Action CTAs */}
                <div className="space-y-4 pt-2 border-t border-stone-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-stone-700">Quantidade:</span>
                      <div className="flex items-center rounded-2xl bg-stone-100 border border-stone-200 overflow-hidden">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="px-3.5 py-1.5 text-stone-600 hover:bg-stone-200 text-sm font-bold cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-4 py-1 text-xs font-mono font-bold text-stone-900">
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                          className="px-3.5 py-1.5 text-stone-600 hover:bg-stone-200 text-sm font-bold cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <span className="text-xs text-stone-500 font-mono">
                      Subtotal: <strong className="text-stone-900 font-bold text-sm">{formatKwanzas(product.price * quantity)}</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        onAddToCart(product, quantity);
                        onClose();
                      }}
                      className="py-3.5 px-4 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-900 border border-stone-200 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
                    >
                      <ShoppingCart className="w-4 h-4 text-stone-700" />
                      <span>Adicionar ao Carrinho</span>
                    </button>

                    <button
                      onClick={() => {
                        onBuyNow(product, quantity);
                        onClose();
                      }}
                      className="py-3.5 px-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-black shadow-md flex items-center justify-center gap-2 transition-all transform active:scale-98 cursor-pointer"
                    >
                      <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                      <span>Pagar na Entrega Já</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Full-width Tabs Section: Description / Specifications / Reviews */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
            <div className="flex border-b border-stone-200 gap-6 text-xs sm:text-sm font-bold overflow-x-auto">
              <button
                onClick={() => setReviewTab('desc')}
                className={`pb-3 transition-colors cursor-pointer whitespace-nowrap ${
                  reviewTab === 'desc' ? 'border-b-2 border-red-600 text-red-600' : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                Descrição do Produto
              </button>
              <button
                onClick={() => setReviewTab('specs')}
                className={`pb-3 transition-colors cursor-pointer whitespace-nowrap ${
                  reviewTab === 'specs' ? 'border-b-2 border-red-600 text-red-600' : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                Especificações Técnicas
              </button>
              <button
                onClick={() => setReviewTab('reviews')}
                className={`pb-3 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  reviewTab === 'reviews' ? 'border-b-2 border-red-600 text-red-600' : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                <span>Opiniões de Clientes em Luanda</span>
                <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full text-[10px]">
                  {product.reviews?.length || 0}
                </span>
              </button>
            </div>

            <div className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {reviewTab === 'desc' && (
                <div className="space-y-5">
                  <p className="text-stone-700 leading-relaxed text-sm">{product.description}</p>
                  <div>
                    <span className="font-bold text-stone-900 block mb-3 text-sm">Destaques e Características:</span>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {product.features.map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-2.5 bg-stone-50 p-3.5 rounded-2xl border border-stone-200 text-stone-800 text-xs">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="font-medium">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {reviewTab === 'specs' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex justify-between items-center text-xs">
                    <span className="text-stone-500 font-medium">Condição do Artigo:</span>
                    <span className="font-bold text-stone-900">{product.condition}</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex justify-between items-center text-xs">
                    <span className="text-stone-500 font-medium">Localização do Stock:</span>
                    <span className="font-bold text-stone-900">{product.seller.location}</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex justify-between items-center text-xs">
                    <span className="text-stone-500 font-medium">Modalidade de Pagamento:</span>
                    <span className="font-bold text-emerald-700">Cash on Delivery / TPA Multicaixa</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex justify-between items-center text-xs">
                    <span className="text-stone-500 font-medium">Garantia Comercial:</span>
                    <span className="font-bold text-stone-900">Troca imediata com estafeta</span>
                  </div>
                </div>
              )}

              {reviewTab === 'reviews' && (
                <div className="space-y-4">
                  {product.reviews && product.reviews.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {product.reviews.map((rev) => (
                        <div key={rev.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
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
                              <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                            ))}
                          </div>
                          <p className="text-stone-700 text-xs leading-relaxed">{rev.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-stone-400 italic text-xs">Ainda não há avaliações para este produto. Seja o primeiro a receber e avaliar em Luanda!</p>
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
