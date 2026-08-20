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
  Sparkles,
  KeyRound
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
  const [loginError, setLoginError] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('+244 9');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('affiliate');
  
  // Courier specific fields
  const [vehicle, setVehicle] = useState('Moto Haojue 150cc');
  const [licensePlate, setLicensePlate] = useState('LD-00-00-AA');
  const [operatingZones, setOperatingZones] = useState('Maianga, Talatona, Kilamba');
  
  const [regError, setRegError] = useState('');
  const [regSuccessMessage, setRegSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const trimmedInput = loginEmail.trim().toLowerCase();
    const foundUser = users.find(
      (u) => 
        (u.email.toLowerCase() === trimmedInput || u.phone.includes(trimmedInput))
    );

    if (!foundUser) {
      setLoginError('Utilizador não encontrado. Verifique o e-mail ou telefone.');
      return;
    }

    // Check password if set
    if (foundUser.password && loginPassword && foundUser.password !== loginPassword) {
      setLoginError('Senha incorreta.');
      return;
    }

    onLogin(foundUser);
    onClose();
  };

  const handleQuickLogin = (userToLogin: AppUser) => {
    onLogin(userToLogin);
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
      setRegError('A conta de Administrador principal já foi configurada no AngolaMarket 01.');
      return;
    }

    let courierStatus: 'pendente' | 'aprovado' | undefined = undefined;
    if (regRole === 'courier') {
      courierStatus = 'pendente'; // Required to be approved by ADM!
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
      password: regPassword || '123',
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
      setRegSuccessMessage('Conta de entregador submetida com sucesso! Aguarda aprovação do Administrador.');
      setTimeout(() => {
        onLogin(newUser);
        onClose();
      }, 1800);
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
      id="auth-modal-container"
      className="fixed inset-0 z-50 bg-stone-100 flex flex-col w-screen h-screen overflow-hidden text-stone-900 animate-in fade-in"
    >
      <div className="flex flex-col w-full h-full bg-white overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-white sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center font-black text-sm shadow-md">
              01
            </div>
            <div>
              <h2 className="font-bold text-base text-stone-900">
                {tab === 'login' ? 'Aceder à Conta' : 'Criar Nova Conta'}
              </h2>
              <p className="text-xs text-stone-500">AngolaMarket 01 • Luanda</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-stone-100 text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Full screen body container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center items-start">
          <div className="w-full max-w-xl bg-white sm:border sm:border-stone-200 rounded-3xl sm:p-8 space-y-6 sm:shadow-sm">
            {/* Tab Selector */}
            <div className="p-1 bg-stone-100 rounded-2xl">
              <div className="grid grid-cols-2 p-1 bg-stone-200 rounded-2xl gap-1">
                <button
                  onClick={() => { setTab('login'); setLoginError(''); }}
                  className={`py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    tab === 'login' 
                      ? 'bg-white text-stone-900 shadow-sm' 
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Iniciar Sessão
                </button>
                <button
                  onClick={() => { setTab('register'); setLoginError(''); }}
                  className={`py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
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
                <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{loginError}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">E-mail ou Telefone</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="admin@angolamarket01.ao ou +244 9..."
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2.5 pl-10 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-red-500 focus:bg-white"
                  />
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Senha de Acesso</label>
                <div className="relative">
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Introduza a sua senha (padrão: 123)"
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2.5 pl-10 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-red-500 focus:bg-white"
                  />
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Entrar no AngolaMarket 01</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Quick 1-click Test Logins */}
              <div className="pt-4 border-t border-stone-200 space-y-2.5">
                <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider text-center">
                  Acesso Rápido de Teste por Função:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {users.map((u) => {
                    let roleLabel = 'Cliente';
                    let roleBg = 'bg-stone-50 border-stone-200 text-stone-800';
                    let icon = <ShoppingBag className="w-3.5 h-3.5 text-stone-600" />;

                    if (u.role === 'admin') {
                      roleLabel = 'ADM (Dono)';
                      roleBg = 'bg-red-50 border-red-200 text-red-800';
                      icon = <ShieldCheck className="w-3.5 h-3.5 text-red-600" />;
                    } else if (u.role === 'courier') {
                      roleLabel = `Entregador (${u.courierStatus === 'aprovado' ? 'Aprovado' : 'Pendente'})`;
                      roleBg = u.courierStatus === 'aprovado' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-amber-50 border-amber-200 text-amber-800';
                      icon = <Truck className="w-3.5 h-3.5 text-amber-600" />;
                    } else if (u.role === 'affiliate') {
                      roleLabel = 'Afiliado';
                      roleBg = 'bg-blue-50 border-blue-200 text-blue-800';
                      icon = <DollarSign className="w-3.5 h-3.5 text-blue-600" />;
                    }

                    return (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => handleQuickLogin(u)}
                        className={`p-2.5 rounded-2xl border text-left flex items-center justify-between gap-2 hover:scale-[1.02] transition-all cursor-pointer ${roleBg}`}
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          {icon}
                          <div className="truncate">
                            <span className="block font-bold text-xs truncate">{u.name.split('(')[0]}</span>
                            <span className="block text-[10px] opacity-75">{roleLabel}</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded-lg shrink-0 border border-stone-200">
                          Entrar
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </form>
          ) : (
            /* REGISTER FORM */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {regError && (
                <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{regError}</span>
                </div>
              )}

              {regSuccessMessage && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
                  <span>{regSuccessMessage}</span>
                </div>
              )}

              {/* Account Role Selector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-700">Tipo de Conta Pretendida:</label>
                  <span className="text-[10px] text-stone-500 font-medium">Clientes compram sem conta</span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  
                  {/* Option: Affiliate */}
                  <label 
                    className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                      regRole === 'affiliate' ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' : 'bg-stone-50 border-stone-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-white text-blue-600 shadow-sm">
                        <DollarSign className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-xs text-stone-900 block">Afiliado (Comissões por Venda)</span>
                        <span className="text-[11px] text-stone-500 block">Divulgue links dos produtos e ganhe comissão em Kwanzas</span>
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
                      <div className="p-2 rounded-xl bg-white text-amber-600 shadow-sm">
                        <Truck className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-xs text-stone-900 block">Entregador / Estafeta</span>
                        <span className="text-[11px] text-stone-500 block">Entregas em Luanda (Requer aprovação prévia do ADM)</span>
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

                  {/* Option: ADMIN MASTER (Hidden if an Admin account already exists!) */}
                  {!adminExists && (
                    <label 
                      className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                        regRole === 'admin' ? 'bg-red-50 border-red-600 ring-1 ring-red-600' : 'bg-stone-50 border-stone-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-red-600 text-white shadow-sm">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-stone-900">Conta de ADM (Dono da Plataforma)</span>
                            <span className="text-[9px] bg-red-600 text-white px-1.5 py-0.5 rounded-md font-black">ÚNICA</span>
                          </div>
                          <span className="text-[11px] text-stone-500 block">
                            Gere todos os produtos, taxas de entrega e aprova estafetas.
                          </span>
                        </div>
                      </div>
                      <input 
                        type="radio" 
                        name="role" 
                        checked={regRole === 'admin'} 
                        onChange={() => setRegRole('admin')}
                        className="accent-red-600 w-4 h-4"
                      />
                    </label>
                  )}

                </div>
              </div>

              {/* Basic Fields */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Nome Completo *</label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Ex: Paulino Armando"
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-3.5 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-red-500 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">E-mail *</label>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="exemplo@gmail.com"
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-3.5 py-2 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-red-500 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">Telefone / WhatsApp *</label>
                    <input
                      type="text"
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+244 923 000 000"
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-3.5 py-2 text-xs text-stone-900 font-mono focus:outline-none focus:border-red-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Senha de Acesso</label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Defina uma senha segura"
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-3.5 py-2 text-xs text-stone-900 focus:outline-none focus:border-red-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Courier Specific Fields */}
              {regRole === 'courier' && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-3">
                  <div className="flex items-center gap-2 text-amber-800 text-xs font-bold">
                    <Truck className="w-4 h-4 text-amber-600" />
                    <span>Dados do Estafeta & Veículo em Luanda</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-amber-900">Modelo do Veículo</label>
                      <input
                        type="text"
                        value={vehicle}
                        onChange={(e) => setVehicle(e.target.value)}
                        placeholder="Ex: Moto Haojue 150cc"
                        className="w-full bg-white border border-amber-200 rounded-xl px-3 py-1.5 text-xs text-stone-900"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-amber-900">Matrícula</label>
                      <input
                        type="text"
                        value={licensePlate}
                        onChange={(e) => setLicensePlate(e.target.value)}
                        placeholder="LD-44-89-HT"
                        className="w-full bg-white border border-amber-200 rounded-xl px-3 py-1.5 text-xs text-stone-900 font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-amber-900">Municípios / Bairros de Atuação</label>
                    <input
                      type="text"
                      value={operatingZones}
                      onChange={(e) => setOperatingZones(e.target.value)}
                      placeholder="Ex: Maianga, Talatona, Kilamba, Viana"
                      className="w-full bg-white border border-amber-200 rounded-xl px-3 py-1.5 text-xs text-stone-900"
                    />
                  </div>

                  <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
                    ⚠️ <strong>Nota:</strong> A sua conta de entregador será submetida em estado <strong>Pendente</strong> e só ficará ativa após a aprovação do Administrador no painel de controlo.
                  </p>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Criar Conta no AngolaMarket 01</span>
              </button>
            </form>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};
