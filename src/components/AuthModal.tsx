import React, { useState } from 'react';
import { 
  X, 
  User, 
  Lock, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Truck, 
  DollarSign, 
  ShoppingBag, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff
} from 'lucide-react';
import { AppUser, UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: AppUser[];
  onLogin: (user: AppUser) => void;
  onRegister: (newUser: AppUser) => void;
  adminExists: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  users,
  onLogin,
  onRegister,
  adminExists,
}) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('+244 9');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regRole, setRegRole] = useState<UserRole>('buyer');
  
  // Courier specific fields
  const [vehicle, setVehicle] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [operatingZones, setOperatingZones] = useState('');
  
  const [regError, setRegError] = useState('');
  const [regSuccessMessage, setRegSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const trimmedInput = loginEmail.trim().toLowerCase();
    const cleanPhone = trimmedInput.replace(/[\s\-\(\)]/g, '');

    const foundUser = users.find(
      (u) => {
        const uEmail = (u.email || '').toLowerCase();
        const uPhone = (u.phone || '').replace(/[\s\-\(\)]/g, '');
        return uEmail === trimmedInput || uPhone === cleanPhone || (cleanPhone.length > 6 && uPhone.includes(cleanPhone));
      }
    );

    if (!foundUser) {
      setLoginError('Credenciais incorretas. Verifique o seu e-mail ou número de telefone.');
      return;
    }

    // Check password
    if (foundUser.password && loginPassword && foundUser.password !== loginPassword) {
      setLoginError('Senha de acesso incorreta. Tente novamente.');
      return;
    }

    onLogin(foundUser);
    onClose();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setRegSuccessMessage('');

    if (!regName.trim() || !regEmail.trim() || !regPhone.trim()) {
      setRegError('Por favor preencha todos os campos obrigatórios.');
      return;
    }

    const emailExists = users.some(u => u.email.toLowerCase() === regEmail.trim().toLowerCase());
    if (emailExists) {
      setRegError('Já existe uma conta registada com este e-mail.');
      return;
    }

    if (regRole === 'admin' && adminExists) {
      setRegError('A conta de Administrador Geral já está configurada.');
      return;
    }

    let courierStatus: 'pendente' | 'aprovado' | undefined = undefined;
    if (regRole === 'courier') {
      courierStatus = 'pendente'; // Required to be approved by ADM
    }

    let affiliateCode: string | undefined = undefined;
    if (regRole === 'affiliate') {
      const randomSuffix = Math.floor(100 + Math.random() * 900);
      affiliateCode = regName.trim().toUpperCase().replace(/[^A-Z]/g, '').slice(0, 6) + '-' + randomSuffix;
    }

    const newUser: AppUser = {
      id: `user-${Date.now()}`,
      name: regName.trim(),
      email: regEmail.trim(),
      phone: regPhone.trim(),
      role: regRole,
      password: regPassword || '123456',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      createdAt: Date.now(),
      courierStatus,
      vehicle: regRole === 'courier' ? vehicle : undefined,
      licensePlate: regRole === 'courier' ? licensePlate : undefined,
      operatingZones: regRole === 'courier' ? operatingZones.split(',').map(z => z.trim()) : undefined,
      affiliateCode,
      commissionRate: regRole === 'affiliate' ? 7 : undefined,
      totalSalesCount: 0,
      totalCommissionEarned: 0,
      balanceAOA: 0
    };

    onRegister(newUser);
    
    if (regRole === 'courier') {
      setRegSuccessMessage('Candidatura de entregador enviada com sucesso! Aguarda validação do Administrador.');
      setTimeout(() => {
        onLogin(newUser);
        onClose();
      }, 1500);
    } else {
      setRegSuccessMessage('Conta criada com sucesso!');
      setTimeout(() => {
        onLogin(newUser);
        onClose();
      }, 800);
    }
  };

  return (
    <div 
      id="auth-fullscreen-page"
      className="fixed inset-0 z-50 bg-stone-100 text-stone-900 overflow-y-auto flex flex-col min-h-screen animate-in fade-in"
    >
      {/* Top Header */}
      <header className="sticky top-0 z-20 bg-white border-b border-stone-200 shadow-xs px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center font-black text-sm shadow-sm">
            AO01
          </div>
          <div>
            <h1 className="font-black text-sm sm:text-base text-stone-900">
              {tab === 'login' ? 'Entrar no AngolaMarket 01' : 'Registar Nova Conta'}
            </h1>
            <p className="text-[11px] text-stone-500 font-medium">Plataforma Oficial de Luanda • Pagamento na Entrega</p>
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

      {/* Main Container */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 w-full max-w-xl mx-auto">
        <div className="bg-white border border-stone-200 w-full rounded-3xl overflow-hidden shadow-xl flex flex-col p-6 sm:p-8 space-y-6">
          {/* Brand Presentation */}
          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
              {tab === 'login' ? 'Bem-vindo de Volta!' : 'Junte-se ao AngolaMarket 01'}
            </h2>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              {tab === 'login' 
                ? 'Inicie sessão para gerir compras, estafetas ou aceder ao painel.' 
                : 'Crie a sua conta de cliente, entregador ou afiliado em segundos.'}
            </p>
          </div>

          {/* Tab Selector */}
          <div className="p-1.5 bg-stone-100 rounded-2xl border border-stone-200">
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => { setTab('login'); setLoginError(''); }}
                className={`py-3 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  tab === 'login' 
                    ? 'bg-white text-stone-900 shadow-sm' 
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Iniciar Sessão
              </button>
              <button
                type="button"
                onClick={() => { setTab('register'); setLoginError(''); }}
                className={`py-3 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  tab === 'register' 
                    ? 'bg-white text-stone-900 shadow-sm' 
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Criar Conta
              </button>
            </div>
          </div>

          {tab === 'login' ? (
            /* LOGIN FORM */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {loginError && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{loginError}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">E-mail ou Telefone</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="exemplo@gmail.com ou +244 9..."
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-3 pl-10 text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-red-500 focus:bg-white"
                  />
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-700">Palavra-passe de Acesso</label>
                  <span className="text-[11px] text-stone-400">Protegida</span>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Digite a sua palavra-passe"
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-3 pl-10 pr-10 text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-red-500 focus:bg-white"
                  />
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-stone-400 hover:text-stone-700 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 px-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all transform active:scale-98 cursor-pointer mt-2"
              >
                <span>Entrar no AngolaMarket 01</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-4 text-center border-t border-stone-100">
                <p className="text-xs text-stone-500">
                  Precisa de assistência? Contacte a nossa equipa: <strong className="text-stone-800 font-mono">938 243 909 / 950 461 466</strong>
                </p>
              </div>
            </form>
          ) : (
            /* REGISTER FORM */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {regError && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{regError}</span>
                </div>
              )}

              {regSuccessMessage && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
                  <span>{regSuccessMessage}</span>
                </div>
              )}

              {/* Account Role Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-700">Tipo de Conta:</label>
                <div className="grid grid-cols-1 gap-2">
                  
                  {/* Option: Buyer */}
                  <label 
                    className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                      regRole === 'buyer' ? 'bg-stone-100 border-stone-400 ring-1 ring-stone-400' : 'bg-stone-50 border-stone-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-white text-stone-700 shadow-xs">
                        <ShoppingBag className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-xs text-stone-900 block">Cliente / Comprador</span>
                        <span className="text-[11px] text-stone-500 block">Compre com pagamento no ato e rastreie entregas</span>
                      </div>
                    </div>
                    <input 
                      type="radio" 
                      name="role" 
                      checked={regRole === 'buyer'} 
                      onChange={() => setRegRole('buyer')}
                      className="accent-red-600 w-4 h-4"
                    />
                  </label>

                  {/* Option: Affiliate */}
                  <label 
                    className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                      regRole === 'affiliate' ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' : 'bg-stone-50 border-stone-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-white text-blue-600 shadow-xs">
                        <DollarSign className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-xs text-stone-900 block">Afiliado (Comissões por Venda)</span>
                        <span className="text-[11px] text-stone-500 block">Divulgue links e ganhe comissão direta em Kwanzas</span>
                      </div>
                    </div>
                    <input 
                      type="radio" 
                      name="role" 
                      checked={regRole === 'affiliate'} 
                      onChange={() => setRegRole('affiliate')}
                      className="accent-red-600 w-4 h-4"
                    />
                  </label>

                  {/* Option: Courier */}
                  <label 
                    className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                      regRole === 'courier' ? 'bg-amber-50 border-amber-500 ring-1 ring-amber-500' : 'bg-stone-50 border-stone-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-white text-amber-600 shadow-xs">
                        <Truck className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-xs text-stone-900 block">Estafeta / Entregador</span>
                        <span className="text-[11px] text-stone-500 block">Entregas em Luanda (Requer aprovação do ADM)</span>
                      </div>
                    </div>
                    <input 
                      type="radio" 
                      name="role" 
                      checked={regRole === 'courier'} 
                      onChange={() => setRegRole('courier')}
                      className="accent-red-600 w-4 h-4"
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Nome Completo</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Ex: João Manuel"
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2.5 pl-10 text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-red-500 focus:bg-white"
                  />
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">E-mail</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="exemplo@gmail.com"
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2.5 pl-10 text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-red-500 focus:bg-white"
                    />
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Telefone (WhatsApp)</label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+244 9..."
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2.5 pl-10 text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-red-500 focus:bg-white font-mono"
                    />
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Definir Palavra-passe</label>
                <div className="relative">
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2.5 pl-10 pr-10 text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-red-500 focus:bg-white"
                  />
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-3.5 top-3 text-stone-400 hover:text-stone-700 cursor-pointer"
                  >
                    {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Courier Specific Fields */}
              {regRole === 'courier' && (
                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                    <Truck className="w-4 h-4 text-amber-600" />
                    <span>Dados Operacionais do Entregador</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[11px] font-bold text-stone-700 block mb-1">Veículo</label>
                      <input
                        type="text"
                        value={vehicle}
                        onChange={(e) => setVehicle(e.target.value)}
                        placeholder="Ex: Moto Haojue 150cc"
                        className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-stone-700 block mb-1">Matrícula</label>
                      <input
                        type="text"
                        value={licensePlate}
                        onChange={(e) => setLicensePlate(e.target.value)}
                        placeholder="Ex: LD-44-89-HT"
                        className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs uppercase font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-stone-700 block mb-1">Bairros de Luanda onde opera</label>
                    <input
                      type="text"
                      value={operatingZones}
                      onChange={(e) => setOperatingZones(e.target.value)}
                      placeholder="Ex: Maianga, Talatona, Kilamba, Viana"
                      className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-4 px-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all transform active:scale-98 cursor-pointer mt-3"
              >
                <span>Criar Conta Oficial</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
