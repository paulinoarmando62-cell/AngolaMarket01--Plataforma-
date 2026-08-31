import React, { useState } from 'react';
import { 
  X, 
  PlusCircle, 
  Store, 
  MapPin, 
  Phone, 
  Tag, 
  Image, 
  CheckCircle2, 
  ShieldCheck,
  CreditCard,
  Sparkles,
  Layers
} from 'lucide-react';
import { CategoryId, Product } from '../types';
import { CATEGORIES, formatKwanzas } from '../data/mockData';
import { compressImageFile } from '../utils/imageOptimizer';

interface SellerPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: Product) => void;
}

export const SellerPortalModal: React.FC<SellerPortalModalProps> = ({
  isOpen,
  onClose,
  onAddProduct,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategoryId>('telemoveis_eletronicos');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [condition, setCondition] = useState<'Novo' | 'Usado - Como Novo' | 'Recondicionado'>('Novo');
  const [sellerName, setSellerName] = useState('');
  const [sellerLocation, setSellerLocation] = useState('');
  const [sellerPhone, setSellerPhone] = useState('+244 9');
  const [stockCount, setStockCount] = useState('1');
  const [description, setDescription] = useState('');
  const [featuresText, setFeaturesText] = useState('Garantia de satisfação\nEntrega rápida em Luanda\nPagamento no ato da entrega');
  const [imageUrl, setImageUrl] = useState('');
  const [cashOnDelivery, setCashOnDelivery] = useState(true);
  const [successNotice, setSuccessNotice] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const res = await compressImageFile(file, 1000, 1000, 0.82);
        setImageUrl(res);
      } catch {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            setImageUrl(reader.result);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = Number(price.replace(/[^0-9]/g, '')) || 10000;
    const origPriceNum = originalPrice ? Number(originalPrice.replace(/[^0-9]/g, '')) : undefined;

    const discountPercent = origPriceNum && origPriceNum > priceNum 
      ? Math.round(((origPriceNum - priceNum) / origPriceNum) * 100)
      : undefined;

    const featuresList = featuresText
      .split('\n')
      .map(f => f.trim())
      .filter(Boolean);

    const newProd: Product = {
      id: `seller-prod-${Date.now()}`,
      title: title || 'Novo Produto AngolaMarket',
      category,
      price: priceNum,
      originalPrice: origPriceNum,
      discountPercent,
      rating: 5.0,
      reviewCount: 1,
      image: imageUrl,
      gallery: [imageUrl],
      inStock: true,
      stockCount: Number(stockCount) || 5,
      cashOnDelivery,
      expressDeliveryLuanda: true,
      affiliateCommissionPercent: 8,
      seller: {
        id: `seller-${Date.now()}`,
        name: sellerName || 'Vendedor Verificado Luanda',
        location: sellerLocation || 'Luanda, Angola',
        rating: 5.0,
        salesCount: 1,
        verified: true,
        phone: sellerPhone || '+244 923 000 000'
      },
      condition,
      description: description || `${title} disponível para entrega imediata em Luanda com pagamento contra entrega.`,
      features: featuresList.length > 0 ? featuresList : ['Entrega rápida em Luanda', 'Pagamento por TPA no local'],
      tags: [category, 'Luanda', 'AngolaMarket']
    };

    onAddProduct(newProd);
    setSuccessNotice(true);
    setTimeout(() => {
      setSuccessNotice(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto">
      <div 
        id="seller-portal-modal"
        className="relative w-full max-w-2xl bg-white border border-stone-200 rounded-3xl shadow-2xl text-stone-900 overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-red-50 text-red-600 border border-red-100">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-stone-900">Vender no AngolaMarket 01</h2>
              <p className="text-xs text-stone-500">
                Publique o seu artigo com entrega e cobrança por TPA / Dinheiro em Luanda
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-stone-100 text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6 space-y-5">
          {successNotice ? (
            <div className="p-8 text-center bg-emerald-50 border border-emerald-300 rounded-3xl space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
              <h3 className="text-lg font-bold text-stone-900">Artigo Publicado com Sucesso!</h3>
              <p className="text-xs text-emerald-800">
                O seu produto já está disponível no catálogo com sistema de Cash on Delivery para Luanda.
              </p>
            </div>
          ) : (
            <>
              {/* Product Basic Info */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs text-stone-700 font-bold">Título do Artigo / Produto *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Smart TV LG 55 Polegadas 4K ThinQ AI com Garantia"
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-3.5 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-red-500 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-stone-700 font-bold">Categoria</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as CategoryId)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-3 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-red-500 focus:bg-white cursor-pointer"
                    >
                      {CATEGORIES.filter(c => c.id !== 'todos').map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-stone-700 font-bold">Estado do Produto</label>
                    <select
                      value={condition}
                      onChange={(e) => setCondition(e.target.value as any)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-3 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-red-500 focus:bg-white cursor-pointer"
                    >
                      <option value="Novo">Novo (Selado)</option>
                      <option value="Usado - Como Novo">Usado - Como Novo</option>
                      <option value="Recondicionado">Recondicionado com Garantia</option>
                    </select>
                  </div>
                </div>

                {/* Price & Discount */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-red-600 font-bold">Preço de Venda (Kz) *</label>
                    <input
                      type="number"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="45000"
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-3 py-2 text-xs text-red-600 font-mono font-bold focus:outline-none focus:border-red-500 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-stone-500 font-medium">Preço Antigo / Riscado (Kz)</label>
                    <input
                      type="number"
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(e.target.value)}
                      placeholder="55000 (opcional)"
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-3 py-2 text-xs text-stone-400 font-mono focus:outline-none focus:border-red-500 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-stone-700 font-medium">Unidades em Stock</label>
                    <input
                      type="number"
                      value={stockCount}
                      onChange={(e) => setStockCount(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-3 py-2 text-xs text-stone-900 font-mono focus:outline-none focus:border-red-500 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Image Picker */}
              <div className="space-y-2 pt-2 border-t border-stone-200">
                <label className="text-xs text-stone-700 font-bold flex items-center gap-1.5">
                  <Image className="w-4 h-4 text-red-600" />
                  <span>Foto Real do Artigo:</span>
                </label>

                <div className="flex flex-col sm:flex-row gap-2">
                  <label className="flex-1 border-2 border-dashed border-stone-200 hover:border-red-500 rounded-2xl p-3 text-center cursor-pointer bg-stone-50 hover:bg-red-50/20 transition-all flex flex-col items-center justify-center gap-1">
                    <PlusCircle className="w-5 h-5 text-stone-400" />
                    <span className="text-xs font-bold text-stone-700">Carregar Foto do Dispositivo</span>
                    <span className="text-[10px] text-stone-400">JPG, PNG ou WebP</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                  
                  {imageUrl && (
                    <div className="w-24 h-24 rounded-2xl border border-stone-200 overflow-hidden shrink-0 relative bg-stone-100">
                      <img src={imageUrl} alt="Pré-visualização" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <button
                        type="button"
                        onClick={() => setImageUrl('')}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 shadow-sm"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Ou cole a URL direta da imagem (https://...)"
                  className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:border-red-500 focus:bg-white"
                />
              </div>

              {/* Seller details in Luanda */}
              <div className="space-y-3 pt-2 border-t border-stone-200">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-stone-700 font-medium">Nome da sua Loja</label>
                    <input
                      type="text"
                      value={sellerName}
                      onChange={(e) => setSellerName(e.target.value)}
                      placeholder="Armazém Central Luanda"
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-red-500 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-stone-700 font-medium">Localização em Luanda</label>
                    <input
                      type="text"
                      value={sellerLocation}
                      onChange={(e) => setSellerLocation(e.target.value)}
                      placeholder="Talatona, Luanda"
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-red-500 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-stone-700 font-medium">WhatsApp do Vendedor</label>
                    <input
                      type="text"
                      value={sellerPhone}
                      onChange={(e) => setSellerPhone(e.target.value)}
                      placeholder="+244 923 000 000"
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-3 py-2 text-xs text-stone-900 font-mono focus:outline-none focus:border-red-500 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Description & Features */}
              <div className="space-y-3 pt-2 border-t border-stone-200">
                <div className="space-y-1">
                  <label className="text-xs text-stone-700 font-medium">Descrição do Produto</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Detalhes, especificações e condições de verificação no ato da entrega..."
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-2.5 text-xs text-stone-900 focus:outline-none focus:border-red-500 focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-stone-700 font-medium">Destaques (um por linha)</label>
                  <textarea
                    rows={2}
                    value={featuresText}
                    onChange={(e) => setFeaturesText(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-2 text-xs text-stone-900 font-mono focus:outline-none focus:border-red-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Cash on Delivery check */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs text-stone-800 font-semibold">
                    Aceitar Cash on Delivery (TPA Multicaixa / Dinheiro) na Província de Luanda
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={cashOnDelivery}
                  onChange={(e) => setCashOnDelivery(e.target.checked)}
                  className="w-4 h-4 accent-red-600 rounded cursor-pointer"
                />
              </div>

              {/* Submit */}
              <button
                id="submit-seller-product-btn"
                type="submit"
                className="w-full py-3.5 px-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Publicar Anúncio no AngolaMarket 01</span>
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};
