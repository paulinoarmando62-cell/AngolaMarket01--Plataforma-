import React, { useState, useEffect } from 'react';
import { 
  X, 
  DollarSign, 
  Copy, 
  Check, 
  TrendingUp, 
  ShoppingBag, 
  Share2, 
  Sparkles, 
  Wallet, 
  CheckCircle2, 
  Home, 
  LayoutDashboard, 
  Layers, 
  UserCheck, 
  BookmarkCheck, 
  User, 
  ExternalLink, 
  MessageCircle, 
  Percent, 
  Plus, 
  ArrowUpRight, 
  Clock, 
  CreditCard, 
  Building2, 
  ShieldCheck, 
  Tag, 
  CheckCircle, 
  Zap,
  Camera,
  Upload,
  Package
} from 'lucide-react';
import { AppUser, Product, Order, AffiliateTab, PayoutRequest } from '../types';
import { formatKwanzas } from '../data/mockData';

interface AffiliatePortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AppUser;
  products: Product[];
  orders: Order[];
  payoutRequests?: PayoutRequest[];
  onRequestPayout?: (request: Omit<PayoutRequest, 'id' | 'requestedAt' | 'status'>) => void;
  onToggleAffiliateProduct?: (productId: string) => void;
  onBatchAffiliateProducts?: (productIds: string[]) => void;
  onUpdateAffiliateProfile?: (updatedUser: AppUser) => void;
  initialTab?: AffiliateTab;
}

export const AffiliatePortalModal: React.FC<AffiliatePortalModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  products,
  orders,
  payoutRequests = [],
  onRequestPayout,
  onToggleAffiliateProduct,
  onBatchAffiliateProducts,
  onUpdateAffiliateProfile,
  initialTab = 'home'
}) => {
  const [activeTab, setActiveTab] = useState<AffiliateTab>(initialTab);
  const [copiedGeneral, setCopiedGeneral] = useState(false);
  const [copiedProdId, setCopiedProdId] = useState<string | null>(null);
  const [payoutRequested, setPayoutRequested] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutMethod, setPayoutMethod] = useState<'multicaixa_express' | 'transferencia_iban'>('multicaixa_express');
  
  // Multi-select batch affiliation state
  const [selectedBatchIds, setSelectedBatchIds] = useState<string[]>([]);
  
  // Profile edit states
  const [affName, setAffName] = useState(currentUser.name || '');
  const [affEmail, setAffEmail] = useState(currentUser.email || '');
  const [affPhone, setAffPhone] = useState(currentUser.phone || '');
  const [affAvatar, setAffAvatar] = useState(currentUser.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80');
  const [affIban, setAffIban] = useState(currentUser.iban || '');
  const [affBank, setAffBank] = useState(currentUser.bankName || '');
  const [affExpress, setAffExpress] = useState(currentUser.multicaixaExpressPhone || currentUser.phone || '');
  const [profileSaved, setProfileSaved] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setAffName(currentUser.name || '');
      setAffEmail(currentUser.email || '');
      setAffPhone(currentUser.phone || '');
      setAffAvatar(currentUser.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80');
      setAffIban(currentUser.iban || '');
      setAffBank(currentUser.bankName || '');
      setAffExpress(currentUser.multicaixaExpressPhone || currentUser.phone || '');
    }
  }, [currentUser, isOpen]);

  const handleAffiliateAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAffAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  const affiliateCode = currentUser.affiliateCode || 'ANGOLA-01';
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://angolamarket01.ao';
  const generalAffiliateUrl = `${baseUrl}/?ref=${affiliateCode}`;

  const commissionRate = currentUser.commissionRate || 8;
  const totalSales = currentUser.totalSalesCount || 0;
  const totalEarned = currentUser.totalCommissionEarned || 0;
  const balance = currentUser.balanceAOA || 0;
  const withdrawn = currentUser.withdrawnAOA || 0;
  const affiliatedIds = currentUser.affiliatedProductIds || [];

  // Payout requests for this affiliate
  const myPayoutRequests = payoutRequests.filter(
    req => req.requesterId === currentUser.id || req.type === 'afiliado' || req.requesterRole === 'affiliate'
  );

  // Filter orders made through this affiliate
  const affiliateOrders = orders.filter(o => o.affiliateCode && o.affiliateCode === affiliateCode).slice(0, 10);

  const handleCopyGeneralLink = () => {
    navigator.clipboard.writeText(generalAffiliateUrl);
    setCopiedGeneral(true);
    setTimeout(() => setCopiedGeneral(false), 2000);
  };

  const handleCopyProductLink = (productId: string) => {
    const prodUrl = `${baseUrl}/?ref=${affiliateCode}&prod=${productId}`;
    navigator.clipboard.writeText(prodUrl);
    setCopiedProdId(productId);
    setTimeout(() => setCopiedProdId(null), 2000);
  };

  const handleToggleSelectProduct = (productId: string) => {
    setSelectedBatchIds(prev => 
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedBatchIds.length === products.length) {
      setSelectedBatchIds([]);
    } else {
      setSelectedBatchIds(products.map(p => p.id));
    }
  };

  const handleAffiliateSelected = () => {
    if (selectedBatchIds.length === 0) return;
    if (onBatchAffiliateProducts) {
      onBatchAffiliateProducts(selectedBatchIds);
    } else if (onToggleAffiliateProduct) {
      selectedBatchIds.forEach(id => {
        if (!affiliatedIds.includes(id)) onToggleAffiliateProduct(id);
      });
    }
    setSelectedBatchIds([]);
  };

  const handleAffiliateAllProducts = () => {
    const allIds = products.map(p => p.id);
    if (onBatchAffiliateProducts) {
      onBatchAffiliateProducts(allIds);
    } else if (onToggleAffiliateProduct) {
      allIds.forEach(id => {
        if (!affiliatedIds.includes(id)) onToggleAffiliateProduct(id);
      });
    }
    setSelectedBatchIds([]);
  };

  const handleWhatsAppShare = (prod?: Product) => {
    let msg = '';
    if (prod) {
      const prodUrl = `${baseUrl}/?ref=${affiliateCode}&prod=${prod.id}`;
      msg = `Olá! Veja esta oferta incrível no AngolaMarket 01:\n\n🛍️ *${prod.title}*\n💰 Preço: ${formatKwanzas(prod.price)}\n🚚 Entrega rápida em Luanda (Paga só no ato da entrega por TPA ou Dinheiro!)\n\n👉 Compre aqui: ${prodUrl}`;
    } else {
      msg = `Olá! Recomendo a melhor loja online de Luanda - *AngolaMarket 01*! Produtos eletrónicos, eletrodomésticos, moda e cesta básica com pagamento no ato da entrega.\n\n👉 Conheça agora: ${generalAffiliateUrl}`;
    }
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleRequestPayout = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = Number(payoutAmount) || balance;
    if (amountNum <= 0) return;

    if (onRequestPayout) {
      onRequestPayout({
        type: 'afiliado',
        requesterId: currentUser.id,
        requesterName: currentUser.name || 'Afiliado Oficial',
        requesterRole: 'Afiliado AngolaMarket',
        amountAOA: amountNum,
        paymentMethod: payoutMethod,
        multicaixaExpressPhone: affExpress,
        iban: affIban,
        bankName: 'BAI / BFA / BIC / Atlântico',
        accountHolder: currentUser.name || 'Afiliado Oficial'
      });
    }

    setPayoutRequested(true);
    setTimeout(() => {
      setPayoutRequested(false);
      setPayoutAmount('');
    }, 3500);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateAffiliateProfile) {
      onUpdateAffiliateProfile({
        ...currentUser,
        name: affName,
        email: affEmail,
        phone: affPhone,
        avatar: affAvatar,
        iban: affIban,
        bankName: affBank,
        multicaixaExpressPhone: affExpress
      });
    }
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const tabs: { tab: AffiliateTab; label: string; icon: React.ReactNode }[] = [
    { tab: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { tab: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { tab: 'carteira', label: 'Carteira', icon: <Wallet className="w-4 h-4" /> },
    { tab: 'pedidos', label: 'Pedidos', icon: <Layers className="w-4 h-4" /> },
    { tab: 'afiliar_se', label: 'Afiliar-se', icon: <UserCheck className="w-4 h-4" /> },
    { tab: 'minhas_afiliacoes', label: 'Minhas Afiliações', icon: <BookmarkCheck className="w-4 h-4" /> },
    { tab: 'perfil', label: 'Perfil', icon: <User className="w-4 h-4" /> },
  ];

  return (
    <div 
      id="affiliate-portal-modal"
      className="fixed inset-0 z-50 bg-stone-100 flex flex-col w-screen h-screen overflow-hidden text-stone-900 animate-in fade-in"
    >
      <div className="flex flex-col w-full h-full bg-white overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3 border-b border-stone-200 bg-white sticky top-0 z-20 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600 text-white shadow-xs">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-base sm:text-lg text-stone-900 leading-none">Portal do Afiliado</h2>
                <span className="text-[9px] sm:text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-md border border-blue-200 uppercase font-mono">
                  {affiliateCode}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Divulgue produtos em Luanda e receba comissões automáticas por venda entregue
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-stone-100 text-stone-700 hover:bg-red-50 hover:text-red-600 transition-colors font-bold text-xs cursor-pointer border border-stone-200"
          >
            <span>Voltar à Loja</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 7 Tabs Bar */}
        <div className="px-3 sm:px-6 py-2 border-b border-stone-200 bg-stone-50 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {tabs.map((t) => {
            const isActive = activeTab === t.tab;
            return (
              <button
                key={t.tab}
                onClick={() => setActiveTab(t.tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-xs' 
                    : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-200'
                }`}
              >
                {t.icon}
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 bg-stone-50/50">
          
          {/* TAB 1: HOME */}
          {activeTab === 'home' && (
            <div className="space-y-4">
              {/* Compact Executive Status Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-900 text-white shadow-xs relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] uppercase font-black tracking-wider bg-white/20 px-2 py-0.5 rounded text-white inline-block">
                      Promotor Oficial
                    </span>
                    <span className="text-xs font-bold text-blue-100 truncate">
                      {currentUser.name}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black">
                    Ganhe comissões partilhando links
                  </h3>
                  <p className="text-xs text-blue-100 max-w-xl">
                    Partilhe produtos no WhatsApp. Quando a entrega COD for concluída em Luanda, a sua comissão entra na carteira.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    onClick={() => setActiveTab('afiliar_se')}
                    className="px-3.5 py-2 rounded-xl bg-white text-blue-700 font-bold text-xs shadow-xs hover:bg-stone-100 cursor-pointer flex items-center gap-1.5"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Catálogo & Links</span>
                  </button>
                  <button
                    onClick={() => handleWhatsAppShare()}
                    className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>

              {/* General Referral Link Card */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-stone-900 flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Seu Link Geral da Loja:</span>
                  </span>
                  <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                    Cód: {affiliateCode}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={generalAffiliateUrl}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 font-mono select-all focus:outline-none"
                  />
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={handleCopyGeneralLink}
                      className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      {copiedGeneral ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedGeneral ? 'Copiado!' : 'Copiar'}</span>
                    </button>
                    <button
                      onClick={() => handleWhatsAppShare()}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Fast Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3.5">
                <div 
                  onClick={() => setActiveTab('carteira')}
                  className="p-3.5 sm:p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs hover:border-blue-400 transition-all cursor-pointer space-y-1"
                >
                  <div className="flex items-center justify-between text-stone-500">
                    <span className="text-[10px] font-bold uppercase tracking-wide">Saldo Disponível</span>
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="text-xl sm:text-2xl font-black font-mono text-emerald-600 block">
                    {formatKwanzas(currentUser.balanceAOA || 0)}
                  </span>
                  <p className="text-[10px] text-stone-500 truncate">Clique para solicitar levantamento</p>
                </div>

                <div 
                  onClick={() => setActiveTab('relatorios')}
                  className="p-3.5 sm:p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs hover:border-blue-400 transition-all cursor-pointer space-y-1"
                >
                  <div className="flex items-center justify-between text-stone-500">
                    <span className="text-[10px] font-bold uppercase tracking-wide">Vendas Concluídas</span>
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-xl sm:text-2xl font-black font-mono text-stone-900 block">
                    {currentUser.totalSalesCount || 0}
                  </span>
                  <p className="text-[10px] text-stone-500 truncate">Vendas pagas na entrega</p>
                </div>

                <div 
                  onClick={() => setActiveTab('afiliar_se')}
                  className="p-3.5 sm:p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs hover:border-blue-400 transition-all cursor-pointer space-y-1"
                >
                  <div className="flex items-center justify-between text-stone-500">
                    <span className="text-[10px] font-bold uppercase tracking-wide">Artigos para Divulgar</span>
                    <Package className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-xl sm:text-2xl font-black font-mono text-stone-900 block">
                    {products.length}
                  </span>
                  <p className="text-[10px] text-stone-500 truncate">Catálogo completo de Luanda</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-black text-base text-stone-900">Dashboard de Ganhos & Conversões</h3>
                <p className="text-xs text-stone-500">Acompanhe cliques, vendas geradas e histórico de comissões ganhas</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-1">
                  <span className="text-[10px] uppercase font-bold text-stone-400">Comissão Acumulada</span>
                  <span className="text-2xl font-black font-mono text-emerald-600 block">{formatKwanzas(totalEarned)}</span>
                  <span className="text-[10px] text-stone-500">Ganhos desde o início</span>
                </div>

                <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-1">
                  <span className="text-[10px] uppercase font-bold text-stone-400">Saldo Pronto a Levantar</span>
                  <span className="text-2xl font-black font-mono text-blue-600 block">{formatKwanzas(balance)}</span>
                  <span className="text-[10px] text-stone-500">Via Multicaixa Express / IBAN</span>
                </div>

                <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-1">
                  <span className="text-[10px] uppercase font-bold text-stone-400">Total Levantado</span>
                  <span className="text-2xl font-black font-mono text-stone-900 block">{formatKwanzas(withdrawn)}</span>
                  <span className="text-[10px] text-stone-500">Transferido para o seu banco</span>
                </div>

                <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-1">
                  <span className="text-[10px] uppercase font-bold text-stone-400">Taxa Média de Comissão</span>
                  <span className="text-2xl font-black font-mono text-indigo-600 block">11.4%</span>
                  <span className="text-[10px] text-stone-500">Configurada pelo ADM</span>
                </div>
              </div>

              {/* Performance Guide */}
              <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-3">
                <h4 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Dicas para Vender Mais em Luanda</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-stone-600">
                  <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                    <span className="font-bold text-stone-900 block">1. Grupos de Bairro</span>
                    <span>Partilhe artigos em grupos de condomínio e comunidades de bairros em Luanda.</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                    <span className="font-bold text-stone-900 block">2. Destaque o Pagamento no Ato</span>
                    <span>Clientes em Angola preferem pagar só quando recebem o produto em mãos por TPA ou Dinheiro.</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                    <span className="font-bold text-stone-900 block">3. Status do WhatsApp</span>
                    <span>Publique as fotos com o seu link direto no seu estado do WhatsApp diariamente.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CARTEIRA */}
          {activeTab === 'carteira' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-black text-base text-stone-900">Carteira do Afiliado</h3>
                <p className="text-xs text-stone-500">Levantamento de comissões para conta bancária ou Multicaixa Express</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-6 rounded-3xl bg-stone-900 text-white shadow-md space-y-2 col-span-1 sm:col-span-2">
                  <div className="flex items-center justify-between text-stone-400">
                    <span className="text-xs font-bold uppercase">Saldo Disponível na Carteira</span>
                    <Wallet className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="text-3xl sm:text-4xl font-black font-mono text-white block">
                    {formatKwanzas(balance)}
                  </span>
                  <div className="pt-2 flex items-center gap-3 text-xs text-stone-300 flex-wrap">
                    <span>Express: <strong>{affExpress}</strong></span>
                    <span>•</span>
                    <span>IBAN: <strong className="font-mono">{affIban}</strong></span>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-2">
                  <span className="text-xs font-bold uppercase text-stone-400">Total Já Transferido</span>
                  <span className="text-2xl font-black font-mono text-emerald-600 block">
                    {formatKwanzas(withdrawn)}
                  </span>
                  <p className="text-[11px] text-stone-500">
                    Ganhos pagos pontualmente pela administração.
                  </p>
                </div>
              </div>

              {/* Payout Request */}
              <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    <span>Pedir Levantamento de Comissões ao ADM</span>
                  </h4>
                  <span className="text-[11px] font-bold text-stone-500">
                    Disponível: <strong className="text-blue-600 font-mono">{formatKwanzas(balance)}</strong>
                  </span>
                </div>

                {payoutRequested ? (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Pedido de levantamento de {formatKwanzas(Number(payoutAmount) || balance)} enviado com sucesso! O Administrador irá processar o pagamento na aba Gestão Financeira.</span>
                  </div>
                ) : (
                  <form onSubmit={handleRequestPayout} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-stone-700">Valor a Levantar (Kz) *</label>
                        <input
                          type="number"
                          required
                          min={1000}
                          max={balance > 0 ? balance : 1000000}
                          value={payoutAmount}
                          onChange={(e) => setPayoutAmount(e.target.value)}
                          placeholder={`Ex: ${balance > 0 ? balance : 25000}`}
                          className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-3.5 py-2.5 text-xs font-mono font-bold text-stone-900 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-stone-700">Canal de Recebimento</label>
                        <select 
                          value={payoutMethod}
                          onChange={(e) => setPayoutMethod(e.target.value as any)}
                          className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-3.5 py-2.5 text-xs text-stone-900 font-bold focus:outline-none focus:border-blue-500"
                        >
                          <option value="multicaixa_express">📱 Multicaixa Express ({affExpress || currentUser.phone || '9XX XXX XXX'})</option>
                          <option value="transferencia_iban">🏦 Transferência Bancária IBAN ({affIban ? affIban.slice(0, 14) + '...' : 'IBAN'})</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="submit"
                        disabled={balance <= 0 && !payoutAmount}
                        className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-sm cursor-pointer transition-all"
                      >
                        Enviar Solicitação ao ADM
                      </button>
                      <span className="text-[11px] text-stone-400">
                        Processamento direto pelo painel de gestão do ADM
                      </span>
                    </div>
                  </form>
                )}
              </div>

              {/* Payout History List */}
              <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-stone-500" />
                    <span>Histórico de Solicitações de Saque</span>
                  </h4>
                  <span className="text-xs text-stone-500">{myPayoutRequests.length} solicitações</span>
                </div>

                {myPayoutRequests.length === 0 ? (
                  <p className="text-xs text-stone-400 py-3 text-center">Nenhuma solicitação enviada ainda.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-stone-50 text-stone-400 uppercase text-[10px] border-b border-stone-200">
                        <tr>
                          <th className="py-2 px-3">Data</th>
                          <th className="py-2 px-3">Montante</th>
                          <th className="py-2 px-3">Método / Conta</th>
                          <th className="py-2 px-3">Comprovativo</th>
                          <th className="py-2 px-3 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {myPayoutRequests.map((req) => (
                          <tr key={req.id}>
                            <td className="py-2.5 px-3 font-mono text-stone-600">{typeof req.requestedAt === 'number' ? new Date(req.requestedAt).toLocaleDateString('pt-AO') : req.requestedAt}</td>
                            <td className="py-2.5 px-3 font-mono font-bold text-stone-900">{formatKwanzas(req.amountAOA || req.amount || 0)}</td>
                            <td className="py-2.5 px-3 text-stone-600">
                              {req.paymentMethod === 'multicaixa_express' || (!req.iban && req.multicaixaExpressPhone)
                                ? `📱 Express (${req.multicaixaExpressPhone || req.requesterPhone})`
                                : `🏦 IBAN (${(req.iban || '').slice(0, 16)}...)`}
                            </td>
                            <td className="py-2.5 px-3 font-mono text-stone-500 text-[11px]">
                              {req.transactionRef ? (
                                <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-lg border border-emerald-200 font-bold">
                                  {req.transactionRef}
                                </span>
                              ) : (
                                <span className="text-stone-400">-</span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                                req.status === 'pago'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : req.status === 'rejeitado'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-amber-100 text-amber-800 animate-pulse'
                              }`}>
                                {req.status === 'pago' && <CheckCircle2 className="w-3 h-3" />}
                                {req.status === 'pago' ? 'Pago' : req.status === 'rejeitado' ? 'Rejeitado' : 'Pendente ADM'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: PEDIDOS */}
          {activeTab === 'pedidos' && (
            <div className="space-y-5">
              <div>
                <h3 className="font-black text-base text-stone-900">Vendas Geradas pelo Seu Link</h3>
                <p className="text-xs text-stone-500">
                  Lista de encomendas realizadas por clientes com o seu código <strong>{affiliateCode}</strong> em Luanda.
                </p>
              </div>

              <div className="border border-stone-200 rounded-3xl overflow-hidden shadow-sm bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-50 text-stone-500 uppercase text-[10px] tracking-wider border-b border-stone-200">
                      <tr>
                        <th className="py-3 px-4">Ref. Pedido</th>
                        <th className="py-3 px-4">Artigos</th>
                        <th className="py-3 px-4">Destino</th>
                        <th className="py-3 px-4">Total Compra</th>
                        <th className="py-3 px-4">Sua Comissão</th>
                        <th className="py-3 px-4 text-right">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200 text-stone-900">
                      {affiliateOrders.map((ord) => {
                        const comm = ord.affiliateCommissionAmount || Math.round(ord.subtotal * 0.08);
                        return (
                          <tr key={ord.id} className="hover:bg-stone-50/80">
                            <td className="py-3 px-4 font-mono font-bold text-stone-900">{ord.orderNumber}</td>
                            <td className="py-3 px-4 max-w-xs truncate text-stone-700">
                              {ord.items.map(i => `${i.quantity}x ${i.product.title}`).join(', ')}
                            </td>
                            <td className="py-3 px-4 text-stone-600">{ord.customer.neighborhood}</td>
                            <td className="py-3 px-4 font-mono text-stone-700">{formatKwanzas(ord.subtotal)}</td>
                            <td className="py-3 px-4 font-mono font-bold text-emerald-600">
                              +{formatKwanzas(comm)}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                                ord.status === 'entregue' ? 'bg-emerald-100 text-emerald-800' :
                                ord.status === 'em_transito' ? 'bg-purple-100 text-purple-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {ord.status === 'entregue' ? '✓ Entregue (Creditado)' :
                                 ord.status === 'em_transito' ? '🚚 Em Rota' : '📦 A Preparar'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: AFILIAR-SE (Com Afiliação a Vários Produtos de Uma Vez) */}
          {activeTab === 'afiliar_se' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-3xl bg-blue-50 border border-blue-200">
                <div>
                  <h3 className="font-black text-base text-blue-950">Catálogo & Afiliação em Massa</h3>
                  <p className="text-xs text-blue-800">
                    Selecione vários produtos ou afilie-se a todos com 1 clique para gerar os seus links de divulgação exclusivos!
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="px-3.5 py-2 rounded-2xl bg-white hover:bg-stone-100 text-blue-900 border border-blue-300 font-bold text-xs cursor-pointer shadow-sm"
                  >
                    {selectedBatchIds.length === products.length ? 'Desmarcar Todos' : `Selecionar Todos (${selectedBatchIds.length}/${products.length})`}
                  </button>

                  <button
                    type="button"
                    disabled={selectedBatchIds.length === 0}
                    onClick={handleAffiliateSelected}
                    className={`px-4 py-2 rounded-2xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm ${
                      selectedBatchIds.length > 0
                        ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                        : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Afiliar-se aos Selecionados ({selectedBatchIds.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleAffiliateAllProducts}
                    className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Afiliar-se a TODOS de Uma Vez</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((prod) => {
                  const commPercent = prod.affiliateCommissionPercent ?? 8;
                  const commKz = Math.round(prod.price * (commPercent / 100));
                  const isAffiliated = affiliatedIds.includes(prod.id);
                  const isSelected = selectedBatchIds.includes(prod.id);
                  const prodUrl = `${baseUrl}/?ref=${affiliateCode}&prod=${prod.id}`;
                  const isCopied = copiedProdId === prod.id;

                  return (
                    <div 
                      key={prod.id} 
                      className={`p-4 rounded-3xl bg-white border shadow-sm flex flex-col justify-between space-y-3 transition-all ${
                        isAffiliated 
                          ? 'border-blue-400 ring-1 ring-blue-300' 
                          : isSelected
                            ? 'border-blue-500 bg-blue-50/30 ring-2 ring-blue-400'
                            : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="relative aspect-video rounded-2xl overflow-hidden bg-stone-100">
                          <img src={prod.image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          
                          {/* Selection Checkbox */}
                          <button
                            type="button"
                            onClick={() => handleToggleSelectProduct(prod.id)}
                            className="absolute top-2 left-2 p-1.5 rounded-xl bg-white/90 backdrop-blur-sm border border-stone-300 shadow-md cursor-pointer hover:bg-white flex items-center gap-1 text-[11px] font-bold text-stone-800"
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                              className="w-4 h-4 rounded text-blue-600 cursor-pointer pointer-events-none"
                            />
                            <span>{isSelected ? 'Selecionado' : 'Selecionar'}</span>
                          </button>

                          <span className="absolute top-2 right-2 bg-blue-600 text-white font-mono font-black text-xs px-2.5 py-1 rounded-xl shadow-md">
                            {commPercent}% Comissão
                          </span>
                        </div>

                        <div>
                          <h4 className="font-bold text-xs text-stone-900 line-clamp-2">{prod.title}</h4>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs font-mono font-black text-red-600">{formatKwanzas(prod.price)}</span>
                            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                              Ganhe {formatKwanzas(commKz)}
                            </span>
                          </div>
                        </div>

                        {/* Individual Referral Link Box */}
                        <div className="p-2.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Link de Divulgação:</span>
                            {isAffiliated && (
                              <span className="text-[9px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">Ativo</span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              readOnly
                              value={prodUrl}
                              className="w-full bg-white border border-stone-200 rounded-xl px-2 py-1 text-[10px] font-mono text-stone-600 truncate"
                            />
                            <button
                              type="button"
                              onClick={() => handleCopyProductLink(prod.id)}
                              className="p-1.5 rounded-xl bg-stone-200 hover:bg-blue-600 hover:text-white text-stone-700 transition-colors cursor-pointer shrink-0"
                              title="Copiar Link"
                            >
                              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleWhatsAppShare(prod)}
                              className="p-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer shrink-0"
                              title="Partilhar no WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-stone-100 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (onToggleAffiliateProduct) {
                              onToggleAffiliateProduct(prod.id);
                            }
                          }}
                          className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                            isAffiliated 
                              ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' 
                              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                          }`}
                        >
                          {isAffiliated ? (
                            <>
                              <BookmarkCheck className="w-3.5 h-3.5 text-blue-700" />
                              <span>Afiliado (Clique p/ Remover)</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              <span>Afiliar-se Individualmente</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 6: MINHAS AFILIAÇÕES */}
          {activeTab === 'minhas_afiliacoes' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-black text-base text-stone-900">Minhas Afiliações & Links Diretos ({affiliatedIds.length})</h3>
                  <p className="text-xs text-stone-500">
                    Produtos que escolheu divulgar. Cada produto possui o seu link único pronto para partilhar.
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('afiliar_se')}
                  className="px-3.5 py-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm w-fit"
                >
                  <Plus className="w-4 h-4" />
                  <span>Adicionar Mais Produtos</span>
                </button>
              </div>

              {affiliatedIds.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-3xl border border-stone-200 space-y-3">
                  <BookmarkCheck className="w-12 h-12 text-stone-300 mx-auto" />
                  <h4 className="font-black text-stone-800 text-sm">Ainda não tem produtos afiliados</h4>
                  <p className="text-xs text-stone-500 max-w-md mx-auto">
                    Vá à aba "Afiliar-se" para selecionar vários artigos de uma só vez e começar a faturar comissões em Luanda.
                  </p>
                  <button
                    onClick={() => setActiveTab('afiliar_se')}
                    className="px-4 py-2.5 rounded-2xl bg-blue-600 text-white font-bold text-xs cursor-pointer shadow-sm"
                  >
                    Ver Catálogo de Afiliação
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {products
                    .filter(p => affiliatedIds.includes(p.id))
                    .map((prod) => {
                      const commPercent = prod.affiliateCommissionPercent ?? 8;
                      const commKz = Math.round(prod.price * (commPercent / 100));
                      const prodUrl = `${baseUrl}/?ref=${affiliateCode}&prod=${prod.id}`;
                      const isCopied = copiedProdId === prod.id;

                      return (
                        <div key={prod.id} className="p-4 rounded-3xl bg-white border border-stone-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <img src={prod.image} alt="" className="w-16 h-16 rounded-2xl object-cover border border-stone-200 shrink-0" referrerPolicy="no-referrer" />
                            <div className="space-y-0.5">
                              <h4 className="font-bold text-xs text-stone-900 line-clamp-1">{prod.title}</h4>
                              <div className="flex items-center gap-3 text-xs">
                                <span className="font-mono font-bold text-stone-700">{formatKwanzas(prod.price)}</span>
                                <span>•</span>
                                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200 text-[10px]">
                                  {commPercent}% = {formatKwanzas(commKz)} por venda
                                </span>
                              </div>
                              <div className="text-[10px] text-stone-400 font-mono truncate max-w-sm">
                                {prodUrl}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                            <button
                              onClick={() => handleCopyProductLink(prod.id)}
                              className="px-3.5 py-2 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                            >
                              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-600" />}
                              <span>{isCopied ? 'Link Copiado!' : 'Copiar Link'}</span>
                            </button>

                            <button
                              onClick={() => handleWhatsAppShare(prod)}
                              className="px-3.5 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
                            </button>

                            <button
                              onClick={() => {
                                if (onToggleAffiliateProduct) onToggleAffiliateProduct(prod.id);
                              }}
                              className="p-2 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold cursor-pointer"
                              title="Remover Afiliação"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          )}

          {/* TAB 7: PERFIL */}
          {activeTab === 'perfil' && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div>
                <h3 className="font-black text-base text-stone-900">Perfil do Afiliado Oficial</h3>
                <p className="text-xs text-stone-500">Fotografia, dados de contacto e métodos bancários para saque de comissões</p>
              </div>

              {profileSaved && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Perfil de Afiliado e dados de pagamento atualizados com sucesso!</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-5">
                {/* Profile Photo Uploader */}
                <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative">
                    <img 
                      src={affAvatar} 
                      alt="Foto Afiliado" 
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-blue-600 shadow-xs"
                      referrerPolicy="no-referrer"
                    />
                    <label className="absolute -bottom-1.5 -right-1.5 p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md cursor-pointer transition-transform hover:scale-105">
                      <Camera className="w-3.5 h-3.5" />
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleAffiliateAvatarUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div className="space-y-1 text-center sm:text-left flex-1">
                    <span className="font-bold text-xs text-stone-900 block">Fotografia de Perfil do Afiliado</span>
                    <p className="text-[11px] text-stone-500">Foto personalizada exibida na sua conta e portal de comissões.</p>
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-200 hover:bg-stone-100 text-stone-800 text-[11px] font-bold cursor-pointer mt-1">
                      <Upload className="w-3 h-3 text-blue-600" />
                      <span>Carregar Foto</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleAffiliateAvatarUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Nome Completo</label>
                  <input
                    type="text"
                    required
                    value={affName}
                    onChange={(e) => setAffName(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-3.5 py-2.5 text-xs text-stone-900 focus:bg-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">E-mail</label>
                    <input
                      type="email"
                      required
                      value={affEmail}
                      onChange={(e) => setAffEmail(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-3.5 py-2.5 text-xs text-stone-900 focus:bg-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">Telefone / WhatsApp</label>
                    <input
                      type="text"
                      required
                      value={affPhone}
                      onChange={(e) => setAffPhone(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-3.5 py-2.5 text-xs text-stone-900 font-mono focus:bg-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Código Oficial de Afiliado</label>
                  <input
                    type="text"
                    readOnly
                    value={affiliateCode}
                    className="w-full bg-stone-100 border border-stone-200 rounded-2xl px-3.5 py-2.5 text-xs text-blue-700 font-mono font-black cursor-not-allowed"
                  />
                </div>

                {/* Métodos de Pagamento e Recebimento de Comissões */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-black uppercase tracking-wider text-stone-800">Métodos de Pagamento & Saque de Comissões</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-stone-700">Banco de Recebimento</label>
                      <select
                        value={affBank}
                        onChange={(e) => setAffBank(e.target.value)}
                        className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900"
                      >
                        <option value="BAI">Banco BAI</option>
                        <option value="BFA">Banco BFA</option>
                        <option value="ATLANTICO">Banco Millennium Atlântico</option>
                        <option value="BIC">Banco BIC</option>
                        <option value="SOL">Banco Sol</option>
                        <option value="BPC">Banco BPC</option>
                        <option value="KEVE">Banco Keve</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-stone-700">Telemóvel Multicaixa Express</label>
                      <input
                        type="text"
                        value={affExpress}
                        onChange={(e) => setAffExpress(e.target.value)}
                        placeholder="+244 9..."
                        className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 font-mono focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-700">IBAN Angolano para Transferências (AO06...)</label>
                    <input
                      type="text"
                      value={affIban}
                      onChange={(e) => setAffIban(e.target.value)}
                      placeholder="AO06.0040..."
                      className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 font-mono uppercase focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs sm:text-sm shadow-md cursor-pointer transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Guardar Perfil do Afiliado e Pagamentos</span>
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
