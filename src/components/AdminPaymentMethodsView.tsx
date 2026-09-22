import React, { useState } from 'react';
import { 
  CreditCard, 
  Smartphone, 
  Banknote, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Info,
  Building,
  Save,
  Check,
  Building2
} from 'lucide-react';
import { StorePaymentConfig, AdminBankAccount, AdminExpressAccount } from '../types';

interface AdminPaymentMethodsViewProps {
  paymentConfig: StorePaymentConfig;
  onSavePaymentConfig: (newConfig: StorePaymentConfig) => void;
}

const ANGOLA_BANKS = [
  { code: 'BAI', name: 'Banco Angolano de Investimentos (BAI)' },
  { code: 'BFA', name: 'Banco de Fomento Angola (BFA)' },
  { code: 'BIC', name: 'Banco BIC Angola' },
  { code: 'ATLANTICO', name: 'Banco Millennium Atlântico' },
  { code: 'SOL', name: 'Banco Sol' },
  { code: 'STANDARD', name: 'Standard Bank Angola' },
  { code: 'BPC', name: 'Banco de Poupança e Crédito (BPC)' },
  { code: 'KEVE', name: 'Banco Keve' },
  { code: 'YETU', name: 'Banco Yetu' },
  { code: 'VALOR', name: 'Banco Valor' },
  { code: 'OUTRO', name: 'Outro Banco Nacional' }
];

export const AdminPaymentMethodsView: React.FC<AdminPaymentMethodsViewProps> = ({
  paymentConfig,
  onSavePaymentConfig
}) => {
  const [config, setConfig] = useState<StorePaymentConfig>(paymentConfig);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // New IBAN Form State
  const [isAddingIban, setIsAddingIban] = useState(false);
  const [newBankName, setNewBankName] = useState('Banco BAI');
  const [newIban, setNewIban] = useState('');
  const [newAccountHolder, setNewAccountHolder] = useState('Paulino Armando');
  const [newIbanNotes, setNewIbanNotes] = useState('Transferências BAI Direto ou Interbancárias');
  const [ibanError, setIbanError] = useState('');

  // New Express Form State
  const [isAddingExpress, setIsAddingExpress] = useState(false);
  const [newExpressPhone, setNewExpressPhone] = useState('');
  const [newExpressName, setNewExpressName] = useState('AngolaMarket 01 / Paulino Armando');
  const [newExpressNotes, setNewExpressNotes] = useState('Pagamento instantâneo via app Multicaixa Express');
  const [expressError, setExpressError] = useState('');

  const handleSaveAll = () => {
    onSavePaymentConfig(config);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  // IBAN Handlers
  const handleAddIban = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIban.trim()) {
      setIbanError('Por favor preencha o IBAN.');
      return;
    }

    const cleanIban = newIban.trim().toUpperCase();
    if (!cleanIban.startsWith('AO06') && cleanIban.length < 15) {
      setIbanError('O IBAN em Angola deve iniciar com AO06 seguido de 21 dígitos numéricos.');
      return;
    }

    const newAccount: AdminBankAccount = {
      id: `iban_${Date.now()}`,
      bankName: newBankName,
      iban: cleanIban,
      accountHolder: newAccountHolder.trim() || 'Paulino Armando',
      isActive: true,
      notes: newIbanNotes.trim()
    };

    const updatedConfig: StorePaymentConfig = {
      ...config,
      bankAccounts: [...config.bankAccounts, newAccount]
    };

    setConfig(updatedConfig);
    onSavePaymentConfig(updatedConfig);
    setIsAddingIban(false);
    setNewIban('');
    setIbanError('');
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleToggleIbanActive = (id: string) => {
    const updated = config.bankAccounts.map(acc => 
      acc.id === id ? { ...acc, isActive: !acc.isActive } : acc
    );
    const updatedConfig = { ...config, bankAccounts: updated };
    setConfig(updatedConfig);
    onSavePaymentConfig(updatedConfig);
  };

  const handleDeleteIban = (id: string) => {
    if (config.bankAccounts.length <= 1) {
      alert('Deve manter pelo menos uma conta bancária registada.');
      return;
    }
    const updated = config.bankAccounts.filter(acc => acc.id !== id);
    const updatedConfig = { ...config, bankAccounts: updated };
    setConfig(updatedConfig);
    onSavePaymentConfig(updatedConfig);
  };

  // Express Handlers
  const handleAddExpress = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = newExpressPhone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 9) {
      setExpressError('Informe um número de telefone Express válido com pelo menos 9 dígitos.');
      return;
    }

    const newAcc: AdminExpressAccount = {
      id: `exp_${Date.now()}`,
      phone: cleanPhone,
      accountHolder: newExpressName.trim() || 'AngolaMarket 01 / Paulino Armando',
      bankName: 'Multicaixa Express',
      isActive: true,
      notes: newExpressNotes.trim()
    };

    const updatedConfig: StorePaymentConfig = {
      ...config,
      expressAccounts: [...config.expressAccounts, newAcc]
    };

    setConfig(updatedConfig);
    onSavePaymentConfig(updatedConfig);
    setIsAddingExpress(false);
    setNewExpressPhone('');
    setExpressError('');
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleToggleExpressActive = (id: string) => {
    const updated = config.expressAccounts.map(acc => 
      acc.id === id ? { ...acc, isActive: !acc.isActive } : acc
    );
    const updatedConfig = { ...config, expressAccounts: updated };
    setConfig(updatedConfig);
    onSavePaymentConfig(updatedConfig);
  };

  const handleDeleteExpress = (id: string) => {
    if (config.expressAccounts.length <= 1) {
      alert('Deve manter pelo menos um número de Multicaixa Express registado.');
      return;
    }
    const updated = config.expressAccounts.filter(acc => acc.id !== id);
    const updatedConfig = { ...config, expressAccounts: updated };
    setConfig(updatedConfig);
    onSavePaymentConfig(updatedConfig);
  };

  return (
    <div className="space-y-6">
      {/* Success Notification */}
      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-between shadow-md animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>Configurações de pagamento sincronizadas em tempo real com o Checkout dos clientes!</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-black text-lg text-stone-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-red-600" />
            <span>Configuração das Formas de Pagamento</span>
          </h3>
          <p className="text-xs text-stone-500">
            Cadastre os seus IBANs e números de Multicaixa Express. Os clientes escolherão estas opções no Checkout antes da entrega do produto.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          className="px-5 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm cursor-pointer transition-all active:scale-95 shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>Gravar Alterações</span>
        </button>
      </div>

      {/* Warning Notice About TPA Removal */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold">Política Oficial de Pagamento em Luanda:</h4>
          <p className="text-stone-700 leading-relaxed">
            A opção de TPA com os estafetas foi <strong>completamente desativada</strong>. Os estafetas recebem exclusivamente notas físicas de Kwanzas no ato de entrega. Caso o cliente prefira pagar por <strong>Multicaixa Express</strong> ou <strong>Transferência Bancária</strong>, o pagamento é feito diretamente para as contas da plataforma abaixo cadastradas antes da entrega.
          </p>
        </div>
      </div>

      {/* SECTION 1: MULTICAIXA EXPRESS NUMBERS */}
      <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-black text-sm text-stone-900">Números Multicaixa Express</h4>
              <p className="text-xs text-stone-500">O cliente pagará pelo aplicativo Express para estes números antes da entrega</p>
            </div>
          </div>

          <button
            onClick={() => setIsAddingExpress(true)}
            className="px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-blue-200"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Adicionar Número Express</span>
          </button>
        </div>

        {/* Add Express Form Modal */}
        {isAddingExpress && (
          <form onSubmit={handleAddExpress} className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200 space-y-3 animate-in fade-in">
            <h5 className="font-bold text-xs text-blue-900">Cadastrar Novo Número Express</h5>
            
            {expressError && (
              <p className="text-xs text-red-600 font-bold">{expressError}</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Número de Telefone Express *</label>
                <input
                  type="tel"
                  required
                  value={newExpressPhone}
                  onChange={(e) => setNewExpressPhone(e.target.value)}
                  placeholder="938 243 909"
                  className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-stone-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Nome / Titular da Conta Express</label>
                <input
                  type="text"
                  value={newExpressName}
                  onChange={(e) => setNewExpressName(e.target.value)}
                  placeholder="AngolaMarket 01 / Paulino Armando"
                  className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-bold text-stone-900 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">Instruções / Notas ao Cliente</label>
              <input
                type="text"
                value={newExpressNotes}
                onChange={(e) => setNewExpressNotes(e.target.value)}
                placeholder="Ex: Pagamento instantâneo via app Multicaixa Express"
                className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-700 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAddingExpress(false)}
                className="px-3 py-1.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-bold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer shadow-xs"
              >
                Salvar Número Express
              </button>
            </div>
          </form>
        )}

        {/* Express Accounts List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {config.expressAccounts.map((acc, index) => (
            <div 
              key={acc.id || index}
              className={`p-4 rounded-2xl border transition-all space-y-2.5 ${
                acc.isActive 
                  ? 'bg-stone-50 border-stone-200' 
                  : 'bg-stone-100/60 border-stone-200 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-sm text-blue-900">
                    {acc.phone.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')}
                  </span>
                  {index === 0 && (
                    <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full border border-blue-200">
                      Principal
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleToggleExpressActive(acc.id)}
                    title={acc.isActive ? 'Desativar este número' : 'Ativar este número'}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-colors ${
                      acc.isActive 
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                        : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                    }`}
                  >
                    {acc.isActive ? 'Ativo no Checkout' : 'Inativo'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteExpress(acc.id)}
                    title="Remover número Express"
                    className="p-1 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-stone-500 pt-1 border-t border-stone-200/60">
                <span>Titular: <strong>{acc.accountHolder}</strong></span>
              </div>
              {acc.notes && (
                <p className="text-[11px] text-stone-400">{acc.notes}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: IBANs AND BANK ACCOUNTS */}
      <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-black text-sm text-stone-900">Contas Bancárias & IBANs (Angola)</h4>
              <p className="text-xs text-stone-500">Para transferências interbancárias e depósito antes do envio</p>
            </div>
          </div>

          <button
            onClick={() => setIsAddingIban(true)}
            className="px-3.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-purple-200"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Adicionar Novo IBAN</span>
          </button>
        </div>

        {/* Add IBAN Form Modal */}
        {isAddingIban && (
          <form onSubmit={handleAddIban} className="p-4 rounded-2xl bg-purple-50/50 border border-purple-200 space-y-3 animate-in fade-in">
            <h5 className="font-bold text-xs text-purple-900">Cadastrar Novo IBAN Bancário</h5>

            {ibanError && (
              <p className="text-xs text-red-600 font-bold">{ibanError}</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Banco Angolano *</label>
                <select
                  value={newBankName}
                  onChange={(e) => setNewBankName(e.target.value)}
                  className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-bold text-stone-900 focus:outline-none focus:border-purple-500"
                >
                  {ANGOLA_BANKS.map((b) => (
                    <option key={b.code} value={b.name}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-bold text-stone-700">IBAN Completo (AO06...) *</label>
                <input
                  type="text"
                  required
                  value={newIban}
                  onChange={(e) => setNewIban(e.target.value)}
                  placeholder="AO06.0040.0000.9382.4390.9101.2"
                  className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-mono font-bold uppercase text-stone-900 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Nome do Titular da Conta *</label>
                <input
                  type="text"
                  required
                  value={newAccountHolder}
                  onChange={(e) => setNewAccountHolder(e.target.value)}
                  placeholder="AngolaMarket 01 / Paulino Armando"
                  className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-bold text-stone-900 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Instruções / Notas</label>
                <input
                  type="text"
                  value={newIbanNotes}
                  onChange={(e) => setNewIbanNotes(e.target.value)}
                  placeholder="Ex: Transferências BAI Direto ou Multicaixa"
                  className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-700 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAddingIban(false)}
                className="px-3 py-1.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-bold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold cursor-pointer shadow-xs"
              >
                Salvar Conta IBAN
              </button>
            </div>
          </form>
        )}

        {/* Bank Accounts List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {config.bankAccounts.map((acc, index) => (
            <div 
              key={acc.id || index}
              className={`p-4 rounded-2xl border transition-all space-y-2.5 ${
                acc.isActive 
                  ? 'bg-stone-50 border-stone-200' 
                  : 'bg-stone-100/60 border-stone-200 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-purple-950 bg-purple-100 px-2.5 py-0.5 rounded-md border border-purple-200">
                    {acc.bankName}
                  </span>
                  {index === 0 && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                      IBAN Principal
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleToggleIbanActive(acc.id)}
                    title={acc.isActive ? 'Desativar este IBAN' : 'Ativar este IBAN'}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-colors ${
                      acc.isActive 
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                        : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                    }`}
                  >
                    {acc.isActive ? 'Ativo no Checkout' : 'Inativo'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteIban(acc.id)}
                    title="Remover IBAN"
                    className="p-1 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-stone-200/80">
                <span className="text-[10px] text-stone-400 uppercase font-bold block">Número IBAN:</span>
                <span className="font-mono font-bold text-xs text-stone-900 select-all block tracking-wide">
                  {acc.iban}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
                <span>Titular: <strong>{acc.accountHolder}</strong></span>
              </div>
              {acc.notes && (
                <p className="text-[11px] text-stone-400">{acc.notes}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: CASH ON DELIVERY POLICIES */}
      <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Banknote className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-black text-sm text-stone-900">Dinheiro Físico na Entrega</h4>
              <p className="text-xs text-stone-500">Notas em Kwanzas recebidas pelo estafeta no ato de entrega (sem TPA)</p>
            </div>
          </div>

          <label className="flex items-center gap-2 text-xs font-bold text-stone-700 cursor-pointer">
            <span>Ativo no Checkout</span>
            <input
              type="checkbox"
              checked={config.acceptCashOnDelivery}
              onChange={(e) => {
                const updatedConfig = { ...config, acceptCashOnDelivery: e.target.checked };
                setConfig(updatedConfig);
                onSavePaymentConfig(updatedConfig);
              }}
              className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
            />
          </label>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-stone-700">Aviso informativo exibido aos clientes no Checkout:</label>
          <textarea
            rows={2}
            value={config.cashInstructions || ''}
            onChange={(e) => setConfig({ ...config, cashInstructions: e.target.value })}
            placeholder="O estafeta recebe exclusivamente notas físicas de Kwanzas no ato de entrega e NÃO transporta terminal TPA."
            className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-stone-900 focus:bg-white focus:outline-none focus:border-red-500"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleSaveAll}
            className="px-5 py-2.5 rounded-2xl bg-stone-900 hover:bg-black text-white font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Todas as Formas de Pagamento</span>
          </button>
        </div>
      </div>
    </div>
  );
};
