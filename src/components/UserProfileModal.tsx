import React, { useState, useRef } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Camera, 
  CreditCard, 
  Building2, 
  CheckCircle2, 
  ShieldCheck, 
  Truck, 
  DollarSign, 
  MapPin, 
  Lock, 
  Eye, 
  EyeOff, 
  Upload, 
  Image as ImageIcon,
  Wallet,
  Smartphone,
  Banknote,
  Sparkles
} from 'lucide-react';
import { AppUser, PaymentMethodType } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AppUser;
  onUpdateUser: (updatedUser: AppUser) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80'
];

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser
}) => {
  const [activeSection, setActiveSection] = useState<'dados' | 'pagamentos' | 'endereco' | 'seguranca'>('dados');
  
  // Profile fields
  const [name, setName] = useState(currentUser.name || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [avatar, setAvatar] = useState(currentUser.avatar || PRESET_AVATARS[0]);
  const [avatarUrlInput, setAvatarUrlInput] = useState('');
  const [showAvatarUrlForm, setShowAvatarUrlForm] = useState(false);

  // Payment methods fields
  const [preferredPaymentMethod, setPreferredPaymentMethod] = useState<string>(
    currentUser.preferredPaymentMethod || 'dinheiro_entrega'
  );
  const [multicaixaPhone, setMulticaixaPhone] = useState(currentUser.multicaixaExpressPhone || currentUser.phone || '');
  const [iban, setIban] = useState(currentUser.iban || '');
  const [bankName, setBankName] = useState(currentUser.bankName || 'BAI');

  // Address fields
  const [municipality, setMunicipality] = useState(currentUser.defaultMunicipality || 'Luanda');
  const [neighborhood, setNeighborhood] = useState(currentUser.defaultNeighborhood || '');
  const [streetAddress, setStreetAddress] = useState(currentUser.defaultStreetAddress || '');
  const [referencePoint, setReferencePoint] = useState(currentUser.defaultReferencePoint || '');

  // Password fields
  const [password, setPassword] = useState(currentUser.password || '');
  const [showPassword, setShowPassword] = useState(false);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem é muito pesada. Por favor escolha uma foto com menos de 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const updated: AppUser = {
      ...currentUser,
      name: name.trim() || currentUser.name,
      email: email.trim() || currentUser.email,
      phone: phone.trim() || currentUser.phone,
      avatar: avatar || currentUser.avatar,
      password: password || currentUser.password,
      preferredPaymentMethod: preferredPaymentMethod as any,
      multicaixaExpressPhone: multicaixaPhone.trim(),
      iban: iban.trim(),
      bankName: bankName.trim(),
      defaultMunicipality: municipality.trim(),
      defaultNeighborhood: neighborhood.trim(),
      defaultStreetAddress: streetAddress.trim(),
      defaultReferencePoint: referencePoint.trim()
    };

    onUpdateUser(updated);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 3000);
  };

  return (
    <div 
      id="user-profile-fullscreen-page"
      className="fixed inset-0 z-50 bg-stone-100 text-stone-900 overflow-y-auto flex flex-col animate-in fade-in"
    >
      {/* Top Header */}
      <header className="sticky top-0 z-20 bg-white border-b border-stone-200 shadow-xs px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center font-black text-sm shadow-sm">
            AO01
          </div>
          <div>
            <h1 className="font-black text-sm sm:text-base text-stone-900 flex items-center gap-2">
              <span>Meu Perfil & Métodos de Pagamento</span>
              {currentUser.role === 'admin' && (
                <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-black uppercase">
                  Administrador
                </span>
              )}
              {currentUser.role === 'courier' && (
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black uppercase">
                  Estafeta
                </span>
              )}
              {currentUser.role === 'affiliate' && (
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-black uppercase">
                  Afiliado
                </span>
              )}
            </h1>
            <p className="text-xs text-stone-500 font-medium">{currentUser.email || currentUser.phone}</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
          <span className="hidden sm:inline">Voltar à Loja</span>
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-8 space-y-6">
        {savedSuccess && (
          <div className="p-4 rounded-3xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-bold flex items-center gap-3 shadow-xs animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Perfil e métodos de pagamento atualizados com sucesso no sistema!</span>
          </div>
        )}

        {/* Section Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-stone-200/70 p-1.5 rounded-3xl">
          <button
            type="button"
            onClick={() => setActiveSection('dados')}
            className={`py-3 px-4 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeSection === 'dados'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <User className="w-4 h-4 text-red-600" />
            <span>Dados & Foto</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('pagamentos')}
            className={`py-3 px-4 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeSection === 'pagamentos'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <CreditCard className="w-4 h-4 text-emerald-600" />
            <span>Pagamentos & IBAN</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('endereco')}
            className={`py-3 px-4 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeSection === 'endereco'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <MapPin className="w-4 h-4 text-blue-600" />
            <span>Endereço Luanda</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('seguranca')}
            className={`py-3 px-4 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeSection === 'seguranca'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Lock className="w-4 h-4 text-stone-700" />
            <span>Segurança</span>
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* SECTION 1: DADOS PESSOAIS & FOTO DE PERFIL */}
          {activeSection === 'dados' && (
            <div className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-8 space-y-6 shadow-sm">
              <div className="border-b border-stone-100 pb-4">
                <h2 className="text-base font-black text-stone-900">Foto de Perfil & Dados Principais</h2>
                <p className="text-xs text-stone-500">Altere a sua fotografia, nome visível e contactos oficiais</p>
              </div>

              {/* Profile Photo Uploader */}
              <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-3xl bg-stone-50 border border-stone-200">
                <div className="relative group">
                  <img
                    src={avatar || PRESET_AVATARS[0]}
                    alt="Foto de Perfil"
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-white shadow-md"
                    referrerPolicy="no-referrer"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 p-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white shadow-lg cursor-pointer transition-transform hover:scale-105"
                    title="Adicionar ou alterar foto"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1 text-center sm:text-left space-y-2">
                  <h3 className="font-bold text-sm text-stone-900">Adicionar / Alterar Foto de Perfil</h3>
                  <p className="text-xs text-stone-500 max-w-md">
                    Carregue uma foto do seu telemóvel/computador ou selecione uma imagem padrão recomendada.
                  </p>

                  {/* Hidden File Input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Carregar Foto</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowAvatarUrlForm(!showAvatarUrlForm)}
                      className="px-3.5 py-2 rounded-2xl bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Usar Link de Imagem</span>
                    </button>
                  </div>

                  {showAvatarUrlForm && (
                    <div className="pt-2 flex gap-2">
                      <input
                        type="url"
                        placeholder="https://exemplo.com/minha-foto.jpg"
                        value={avatarUrlInput}
                        onChange={(e) => setAvatarUrlInput(e.target.value)}
                        className="flex-1 bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (avatarUrlInput.trim()) {
                            setAvatar(avatarUrlInput.trim());
                            setAvatarUrlInput('');
                            setShowAvatarUrlForm(false);
                          }
                        }}
                        className="px-3 py-1.5 bg-stone-900 text-white font-bold text-xs rounded-xl cursor-pointer"
                      >
                        Aplicar
                      </button>
                    </div>
                  )}

                  {/* Quick Avatar Gallery presets */}
                  <div className="pt-2">
                    <span className="text-[11px] font-bold text-stone-500 block mb-1.5">Modelos Rápidos:</span>
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      {PRESET_AVATARS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setAvatar(preset)}
                          className={`w-8 h-8 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                            avatar === preset ? 'border-red-600 scale-110' : 'border-stone-200 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={preset} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal Data Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700">Nome Completo</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2.5 pl-10 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-red-500 focus:bg-white"
                    />
                    <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700">E-mail</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2.5 pl-10 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-red-500 focus:bg-white"
                    />
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700">Telefone Principal (WhatsApp)</label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2.5 pl-10 text-xs sm:text-sm text-stone-900 font-mono focus:outline-none focus:border-red-500 focus:bg-white"
                    />
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700">Tipo de Conta</label>
                  <input
                    type="text"
                    readOnly
                    value={
                      currentUser.role === 'admin'
                        ? 'Administrador Geral'
                        : currentUser.role === 'courier'
                          ? 'Estafeta / Entregador Luanda'
                          : currentUser.role === 'affiliate'
                            ? 'Afiliado Oficial'
                            : 'Cliente / Comprador'
                    }
                    className="w-full bg-stone-100 border border-stone-200 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-stone-700 font-bold cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: MÉTODOS DE PAGAMENTO */}
          {activeSection === 'pagamentos' && (
            <div className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-8 space-y-6 shadow-sm">
              <div className="border-b border-stone-100 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black text-stone-900">Métodos de Pagamento & Dados Bancários</h2>
                  <p className="text-xs text-stone-500">Configure como prefere pagar as suas compras ou receber comissões e fretes em Luanda</p>
                </div>
                <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-700">
                  <Wallet className="w-6 h-6" />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-stone-700 block">
                  Método de Pagamento Preferido:
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label
                    className={`p-4 rounded-3xl border flex flex-col justify-between gap-3 cursor-pointer transition-all ${
                      preferredPaymentMethod === 'dinheiro_entrega'
                        ? 'bg-emerald-50/50 border-emerald-500 ring-2 ring-emerald-400'
                        : 'bg-stone-50 border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-2xl bg-white text-emerald-700 shadow-xs">
                        <Banknote className="w-5 h-5" />
                      </div>
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={preferredPaymentMethod === 'dinheiro_entrega'}
                        onChange={() => setPreferredPaymentMethod('dinheiro_entrega')}
                        className="accent-emerald-600 w-4 h-4"
                      />
                    </div>
                    <div>
                      <span className="font-black text-xs text-stone-900 block">Dinheiro no Ato</span>
                      <span className="text-[11px] text-stone-500 block">Paga em notas físicas ao estafeta após conferir o artigo</span>
                    </div>
                  </label>

                  <label
                    className={`p-4 rounded-3xl border flex flex-col justify-between gap-3 cursor-pointer transition-all ${
                      preferredPaymentMethod === 'express_transferencia' || preferredPaymentMethod === 'multicaixa_express'
                        ? 'bg-blue-50/50 border-blue-500 ring-2 ring-blue-400'
                        : 'bg-stone-50 border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-2xl bg-white text-blue-600 shadow-xs">
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={preferredPaymentMethod === 'express_transferencia' || preferredPaymentMethod === 'multicaixa_express'}
                        onChange={() => setPreferredPaymentMethod('multicaixa_express')}
                        className="accent-blue-600 w-4 h-4"
                      />
                    </div>
                    <div>
                      <span className="font-black text-xs text-stone-900 block">Multicaixa Express</span>
                      <span className="text-[11px] text-stone-500 block">Pagamento instantâneo via telemóvel ou código Express</span>
                    </div>
                  </label>

                  <label
                    className={`p-4 rounded-3xl border flex flex-col justify-between gap-3 cursor-pointer transition-all ${
                      preferredPaymentMethod === 'transferencia_iban'
                        ? 'bg-purple-50/50 border-purple-500 ring-2 ring-purple-400'
                        : 'bg-stone-50 border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-2xl bg-white text-purple-600 shadow-xs">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={preferredPaymentMethod === 'transferencia_iban'}
                        onChange={() => setPreferredPaymentMethod('transferencia_iban')}
                        className="accent-purple-600 w-4 h-4"
                      />
                    </div>
                    <div>
                      <span className="font-black text-xs text-stone-900 block">Transferência IBAN</span>
                      <span className="text-[11px] text-stone-500 block">Transferência direta interbancária AO06 em Angola</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Payment Details Input Fields */}
              <div className="p-5 rounded-3xl bg-stone-50 border border-stone-200 space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-stone-700">Dados Financeiros & Bancários</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700">Telemóvel Multicaixa Express</label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={multicaixaPhone}
                        onChange={(e) => setMulticaixaPhone(e.target.value)}
                        placeholder="+244 9..."
                        className="w-full bg-white border border-stone-200 rounded-2xl px-4 py-2.5 pl-10 text-xs sm:text-sm text-stone-900 font-mono focus:outline-none focus:border-red-500"
                      />
                      <Smartphone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    </div>
                    <span className="text-[10px] text-stone-400">Usado para receber saques ou pagamentos express</span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700">Banco de Preferência</label>
                    <div className="relative">
                      <select
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        className="w-full bg-white border border-stone-200 rounded-2xl px-4 py-2.5 pl-10 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-red-500"
                      >
                        <option value="BAI">Banco BAI (Banco Angolano de Investimentos)</option>
                        <option value="BFA">Banco BFA (Banco de Fomento Angola)</option>
                        <option value="ATLANTICO">Banco Millennium Atlântico</option>
                        <option value="BIC">Banco BIC</option>
                        <option value="SOL">Banco Sol</option>
                        <option value="BPC">Banco BPC</option>
                        <option value="KEVE">Banco Keve</option>
                        <option value="OUTRO">Outro Banco Angolano</option>
                      </select>
                      <Building2 className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700">IBAN Angolano (AO06...)</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={iban}
                      onChange={(e) => setIban(e.target.value)}
                      placeholder="AO06.0040.0000.1234.5678.9012.3"
                      className="w-full bg-white border border-stone-200 rounded-2xl px-4 py-2.5 pl-10 text-xs sm:text-sm text-stone-900 font-mono uppercase focus:outline-none focus:border-red-500"
                    />
                    <CreditCard className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  </div>
                  <span className="text-[10px] text-stone-400">Conta para liquidação de vendas, comissões de afiliados e fretes de estafetas</span>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: ENDEREÇO EM LUANDA */}
          {activeSection === 'endereco' && (
            <div className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-8 space-y-6 shadow-sm">
              <div className="border-b border-stone-100 pb-4">
                <h2 className="text-base font-black text-stone-900">Endereço de Entrega Padrão (Luanda)</h2>
                <p className="text-xs text-stone-500">Facilite o preenchimento automático das suas futuras compras na loja</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700">Município de Luanda</label>
                  <input
                    type="text"
                    value={municipality}
                    onChange={(e) => setMunicipality(e.target.value)}
                    placeholder="Ex: Luanda, Talatona, Viana, Belas..."
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-red-500 focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700">Bairro / Condomínio</label>
                  <input
                    type="text"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    placeholder="Ex: Alvalade, Vila Alice, Zango 3, Benfica..."
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-red-500 focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700">Rua / Número de Casa</label>
                  <input
                    type="text"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    placeholder="Ex: Rua Comandante Gika, Casa nº 42"
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-red-500 focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700">Ponto de Referência Conhecido</label>
                  <input
                    type="text"
                    value={referencePoint}
                    onChange={(e) => setReferencePoint(e.target.value)}
                    placeholder="Ex: Junto ao Colégio, Atrás da Padaria..."
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-red-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: SEGURANÇA & PALAVRA-PASSE */}
          {activeSection === 'seguranca' && (
            <div className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-8 space-y-6 shadow-sm">
              <div className="border-b border-stone-100 pb-4">
                <h2 className="text-base font-black text-stone-900">Segurança da Conta</h2>
                <p className="text-xs text-stone-500">Altere a sua palavra-passe de acesso ao AngolaMarket 01</p>
              </div>

              <div className="space-y-4 max-w-md">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700">Nova Palavra-passe</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Digite uma nova palavra-passe"
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2.5 pl-10 pr-10 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-red-500 focus:bg-white"
                    />
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-stone-400 hover:text-stone-700 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                  <strong>Dica de Segurança:</strong> Utilize uma palavra-passe forte com letras e números para proteger as suas compras e transações.
                </div>
              </div>
            </div>
          )}

          {/* Save Button Bar */}
          <div className="sticky bottom-4 z-10 bg-white/90 backdrop-blur-md p-4 rounded-3xl border border-stone-200 shadow-xl flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs cursor-pointer transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs sm:text-sm shadow-md flex items-center gap-2 cursor-pointer transition-all transform active:scale-98"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Guardar Alterações do Perfil</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};
