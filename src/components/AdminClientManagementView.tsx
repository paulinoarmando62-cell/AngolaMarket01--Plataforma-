import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  MapPin, 
  ShoppingBag, 
  Ban, 
  CheckCircle2, 
  MessageCircle, 
  ChevronRight, 
  Eye, 
  AlertCircle,
  Clock,
  DollarSign,
  ShieldAlert,
  ArrowUpDown,
  X,
  FileText
} from 'lucide-react';
import { AppUser, Order } from '../types';
import { formatKwanzas } from '../data/mockData';

export interface ClientProfileData {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: string;
  createdAt?: number;
  joinedDate?: string;
  avatar?: string;
  municipality?: string;
  neighborhood?: string;
  streetAddress?: string;
  referencePoint?: string;
  isBlocked?: boolean;
  blockReason?: string;
  notes?: string;
  ordersCount: number;
  totalSpent: number;
  orders: Order[];
  lastOrderDate?: string;
}

interface AdminClientManagementViewProps {
  users: AppUser[];
  orders: Order[];
  onUpdateUser?: (updatedUser: AppUser) => void;
}

export const AdminClientManagementView: React.FC<AdminClientManagementViewProps> = ({
  users,
  orders,
  onUpdateUser,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'blocked' | 'with_orders'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'orders_desc' | 'spent_desc' | 'name_asc'>('recent');
  const [selectedClient, setSelectedClient] = useState<ClientProfileData | null>(null);
  const [blockModalClient, setBlockModalClient] = useState<ClientProfileData | null>(null);
  const [blockReasonInput, setBlockReasonInput] = useState('');
  const [adminNoteInput, setAdminNoteInput] = useState('');
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // Consolidate clients: All users with role 'client' or 'cliente', plus customers from orders who may not be in users table
  const clientsList = useMemo<ClientProfileData[]>(() => {
    const clientsMap = new Map<string, ClientProfileData>();

    const normalizePhone = (p?: string) => {
      if (!p) return '';
      const digits = p.replace(/[^0-9]/g, '');
      return digits.length >= 9 ? digits.slice(-9) : digits;
    };

    // 1. Registered AppUsers
    users.forEach((u) => {
      // Exclude courier and admin from the pure clients list unless they also order
      if (u.role === 'admin' || u.role === 'courier') return;

      const uPhone9 = normalizePhone(u.phone);
      const uEmailClean = (u.email || '').toLowerCase().trim();

      const userOrders = orders.filter((o) => {
        if (o.customerId && o.customerId === u.id) return true;
        const oPhone9 = normalizePhone(o.customer?.phone);
        if (uPhone9 && oPhone9 && uPhone9 === oPhone9) return true;
        const oEmailClean = (o.customer?.email || '').toLowerCase().trim();
        if (uEmailClean && oEmailClean && uEmailClean === oEmailClean) return true;
        return false;
      });
      const totalSpent = userOrders.reduce((sum, ord) => sum + (ord.status !== 'cancelado' ? ord.total : 0), 0);
      const lastOrder = userOrders.length > 0 ? userOrders[0] : null;

      clientsMap.set(u.id, {
        id: u.id,
        name: u.name || 'Cliente Sem Nome',
        phone: u.phone || '',
        email: u.email || '',
        role: u.role || 'client',
        joinedDate: u.joinedDate || 'Recente',
        avatar: u.avatar || '',
        municipality: u.defaultMunicipality || lastOrder?.customer.municipalityName || '',
        neighborhood: u.defaultNeighborhood || lastOrder?.customer.neighborhood || '',
        streetAddress: u.defaultStreetAddress || lastOrder?.customer.streetAddress || '',
        referencePoint: u.defaultReferencePoint || lastOrder?.customer.referencePoint || '',
        isBlocked: !!u.isBlocked,
        blockReason: u.blockReason || '',
        notes: u.adminNotes || '',
        ordersCount: userOrders.length,
        totalSpent,
        orders: userOrders,
        lastOrderDate: lastOrder?.date
      });
    });

    // 2. Also register customers from Orders who checked out as guest
    orders.forEach((ord) => {
      const phone = ord.customer.phone;
      if (!phone) return;

      const ordPhone9 = normalizePhone(phone);

      // Check if already in map by phone
      let exists = false;
      for (const c of clientsMap.values()) {
        if (normalizePhone(c.phone) === ordPhone9) {
          exists = true;
          break;
        }
      }

      if (!exists) {
        const guestId = `client-guest-${phone.replace(/[^0-9]/g, '')}`;
        const guestOrders = orders.filter((o) => normalizePhone(o.customer.phone) === ordPhone9);
        const totalSpent = guestOrders.reduce((sum, o) => sum + (o.status !== 'cancelado' ? o.total : 0), 0);

        clientsMap.set(guestId, {
          id: guestId,
          name: ord.customer.fullName || 'Cliente Luanda',
          phone: ord.customer.phone,
          email: '',
          role: 'client',
          joinedDate: ord.date || 'Cliente Recente',
          municipality: ord.customer.municipalityName,
          neighborhood: ord.customer.neighborhood,
          streetAddress: ord.customer.streetAddress,
          referencePoint: ord.customer.referencePoint,
          isBlocked: false,
          ordersCount: guestOrders.length,
          totalSpent,
          orders: guestOrders,
          lastOrderDate: ord.date
        });
      }
    });

    return Array.from(clientsMap.values());
  }, [users, orders]);

  // Client metrics
  const totalClientsCount = clientsList.length;
  const activeClientsCount = clientsList.filter((c) => !c.isBlocked).length;
  const blockedClientsCount = clientsList.filter((c) => c.isBlocked).length;
  const clientsWithOrdersCount = clientsList.filter((c) => c.ordersCount > 0).length;
  const totalVolumeSpent = clientsList.reduce((acc, c) => acc + c.totalSpent, 0);

  // Filtered and sorted clients
  const filteredClients = useMemo(() => {
    return clientsList
      .filter((c) => {
        // Status filter
        if (statusFilter === 'active' && c.isBlocked) return false;
        if (statusFilter === 'blocked' && !c.isBlocked) return false;
        if (statusFilter === 'with_orders' && c.ordersCount === 0) return false;

        // Search filter
        if (!searchTerm.trim()) return true;
        const q = searchTerm.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.phone.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          (c.neighborhood && c.neighborhood.toLowerCase().includes(q)) ||
          (c.municipality && c.municipality.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => {
        if (sortBy === 'orders_desc') return b.ordersCount - a.ordersCount;
        if (sortBy === 'spent_desc') return b.totalSpent - a.totalSpent;
        if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
        // default recent
        return b.ordersCount - a.ordersCount;
      });
  }, [clientsList, searchTerm, statusFilter, sortBy]);

  const handleToggleBlock = (client: ClientProfileData) => {
    if (client.isBlocked) {
      // Unblock directly
      const updatedUser: AppUser = {
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        role: 'buyer',
        createdAt: client.createdAt || Date.now(),
        isBlocked: false,
        blockReason: undefined
      };
      if (onUpdateUser) onUpdateUser(updatedUser);
      setActionSuccessMessage(`Cliente "${client.name}" desbloqueado com sucesso.`);
      setTimeout(() => setActionSuccessMessage(null), 3000);
      if (selectedClient && selectedClient.id === client.id) {
        setSelectedClient({ ...selectedClient, isBlocked: false, blockReason: undefined });
      }
    } else {
      // Open block modal to ask for reason
      setBlockModalClient(client);
      setBlockReasonInput('');
    }
  };

  const confirmBlock = () => {
    if (!blockModalClient) return;
    const updatedUser: AppUser = {
      id: blockModalClient.id,
      name: blockModalClient.name,
      email: blockModalClient.email,
      phone: blockModalClient.phone,
      role: 'buyer',
      createdAt: blockModalClient.createdAt || Date.now(),
      isBlocked: true,
      blockReason: blockReasonInput.trim() || 'Bloqueado por decisão administrativa'
    };
    if (onUpdateUser) onUpdateUser(updatedUser);
    setActionSuccessMessage(`Cliente "${blockModalClient.name}" bloqueado.`);
    setTimeout(() => setActionSuccessMessage(null), 3000);
    if (selectedClient && selectedClient.id === blockModalClient.id) {
      setSelectedClient({ 
        ...selectedClient, 
        isBlocked: true, 
        blockReason: blockReasonInput.trim() || 'Bloqueado por decisão administrativa' 
      });
    }
    setBlockModalClient(null);
  };

  const handleSaveNotes = (client: ClientProfileData) => {
    const updatedUser: AppUser = {
      id: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone,
      role: 'buyer',
      createdAt: client.createdAt || Date.now(),
      adminNotes: adminNoteInput,
      isBlocked: client.isBlocked,
      blockReason: client.blockReason
    };
    if (onUpdateUser) onUpdateUser(updatedUser);
    setActionSuccessMessage(`Notas do cliente "${client.name}" atualizadas.`);
    setTimeout(() => setActionSuccessMessage(null), 3000);
    if (selectedClient && selectedClient.id === client.id) {
      setSelectedClient({ ...selectedClient, notes: adminNoteInput });
    }
  };

  const handleOpenWhatsApp = (phone: string, clientName: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const fullPhone = cleanPhone.startsWith('244') ? cleanPhone : `244${cleanPhone}`;
    const text = encodeURIComponent(
      `Olá ${clientName}, contactamos a partir do suporte administrativo da AngolaMarket 01 sobre a sua conta e encomendas em Luanda. Como podemos ajudar?`
    );
    window.open(`https://wa.me/${fullPhone}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {actionSuccessMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-2 shadow-md animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{actionSuccessMessage}</span>
        </div>
      )}

      {/* Header and Summary Cards */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-black text-lg text-stone-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-red-600" />
            <span>Gestão de Clientes Cadastrados</span>
          </h3>
          <p className="text-xs text-stone-500">
            Monitorize o total de clientes, verifique endereços em Luanda, histórico de encomendas e faça a gestão de acessos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-xl bg-red-50 text-red-700 border border-red-200 font-mono font-black text-xs">
            {totalClientsCount} Clientes Registados
          </span>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Total Clientes</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-black text-stone-900 font-mono">
            {totalClientsCount}
          </div>
          <span className="text-[10px] text-stone-400">Na base de dados oficial</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Com Encomendas</span>
            <ShoppingBag className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-black text-emerald-700 font-mono">
            {clientsWithOrdersCount}
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold">
            {totalClientsCount > 0 ? Math.round((clientsWithOrdersCount / totalClientsCount) * 100) : 0}% ativos em compras
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Volume Comprado</span>
            <DollarSign className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-base font-black text-stone-900 font-mono truncate">
            {formatKwanzas(totalVolumeSpent)}
          </div>
          <span className="text-[10px] text-stone-400">Em mercadorias finalizadas</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Contas Bloqueadas</span>
            <Ban className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-xl font-black text-red-600 font-mono">
            {blockedClientsCount}
          </div>
          <span className="text-[10px] text-stone-400">
            {activeClientsCount} clientes ativos normais
          </span>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar por nome, telefone, e-mail ou bairro de Luanda..."
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-900 focus:outline-none focus:border-red-500 focus:bg-white"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Status Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Todos ({clientsList.length})
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === 'active'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Ativos ({activeClientsCount})
            </button>
            <button
              onClick={() => setStatusFilter('with_orders')}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === 'with_orders'
                  ? 'bg-blue-600 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Com Encomendas ({clientsWithOrdersCount})
            </button>
            <button
              onClick={() => setStatusFilter('blocked')}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === 'blocked'
                  ? 'bg-red-600 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Bloqueados ({blockedClientsCount})
            </button>
          </div>
        </div>

        {/* Sort selector */}
        <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs text-stone-500">
          <span>A mostrar {filteredClients.length} de {totalClientsCount} clientes</span>
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
            <span className="font-medium text-stone-600">Ordenar:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-stone-100 border border-stone-200 rounded-lg px-2.5 py-1 text-xs text-stone-800 font-bold focus:outline-none focus:border-red-500"
            >
              <option value="recent">Mais Pedidos Primeiro</option>
              <option value="spent_desc">Maior Valor Gasto (Kz)</option>
              <option value="name_asc">Nome (A - Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Clients Table / Grid */}
      {filteredClients.length === 0 ? (
        <div className="p-12 text-center bg-white border border-stone-200 rounded-2xl space-y-3">
          <Users className="w-10 h-10 text-stone-300 mx-auto" />
          <h4 className="font-bold text-sm text-stone-800">Nenhum cliente encontrado</h4>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            {searchTerm
              ? `Não foram encontrados clientes que correspondam à pesquisa "${searchTerm}".`
              : 'Ainda não existem clientes cadastrados para o filtro selecionado.'}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Cliente / Contacto</th>
                  <th className="py-3 px-4">Localização Principal</th>
                  <th className="py-3 px-4">Encomendas</th>
                  <th className="py-3 px-4">Total Gasto</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-right">Ações Rápidas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredClients.map((client) => (
                  <tr 
                    key={client.id}
                    className={`hover:bg-stone-50/80 transition-colors ${
                      client.isBlocked ? 'bg-red-50/30' : ''
                    }`}
                  >
                    {/* Client Info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          client.isBlocked
                            ? 'bg-red-100 text-red-700'
                            : 'bg-stone-200 text-stone-800'
                        }`}>
                          {client.avatar ? (
                            <img src={client.avatar} alt="" className="w-full h-full rounded-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            client.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-stone-900 text-xs">
                              {client.name}
                            </span>
                            {client.isBlocked && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-700 border border-red-200">
                                Bloqueado
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-0.5">
                            {client.phone && (
                              <span className="font-mono text-stone-700 font-medium">
                                📞 {client.phone}
                              </span>
                            )}
                            {client.email && (
                              <span className="text-stone-400">
                                • {client.email}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5 text-xs">
                        <span className="font-bold text-stone-800 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                          {client.neighborhood || client.municipality || 'Luanda'}
                        </span>
                        {client.referencePoint && (
                          <span className="text-[10px] text-stone-400 block line-clamp-1">
                            Ref: {client.referencePoint}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Orders count */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded-md border border-stone-200 text-xs">
                          {client.ordersCount}
                        </span>
                        <span className="text-[11px] text-stone-400">pedidos</span>
                      </div>
                    </td>

                    {/* Total spent */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-black text-stone-900 text-xs">
                        {formatKwanzas(client.totalSpent)}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {client.isBlocked ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full border border-red-200">
                          <Ban className="w-3 h-3" /> Bloqueado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> Ativo
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* WhatsApp Contact */}
                        {client.phone && (
                          <button
                            onClick={() => handleOpenWhatsApp(client.phone, client.name)}
                            title="Conversar no WhatsApp"
                            className="p-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors cursor-pointer"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* View Profile & Orders */}
                        <button
                          onClick={() => {
                            setSelectedClient(client);
                            setAdminNoteInput(client.notes || '');
                          }}
                          className="px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-stone-500" />
                          <span>Detalhes</span>
                        </button>

                        {/* Block/Unblock toggle */}
                        <button
                          onClick={() => handleToggleBlock(client)}
                          title={client.isBlocked ? 'Desbloquear Cliente' : 'Bloquear Cliente'}
                          className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
                            client.isBlocked
                              ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                              : 'bg-red-50 hover:bg-red-100 text-red-600 border-red-200'
                          }`}
                        >
                          {client.isBlocked ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            <Ban className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Client Detail Drawer / Modal */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-stone-200 shadow-2xl p-5 sm:p-6 space-y-5 animate-in zoom-in-95">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-base ${
                  selectedClient.isBlocked ? 'bg-red-100 text-red-700' : 'bg-stone-900 text-white'
                }`}>
                  {selectedClient.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-black text-base text-stone-900">{selectedClient.name}</h4>
                    {selectedClient.isBlocked && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
                        Bloqueado
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-500">ID: {selectedClient.id}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedClient(null)}
                className="p-2 rounded-2xl hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-center">
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Total Comprado</span>
                <span className="font-mono font-black text-sm text-stone-900">
                  {formatKwanzas(selectedClient.totalSpent)}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-center">
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Encomendas</span>
                <span className="font-mono font-black text-sm text-stone-900">
                  {selectedClient.ordersCount} pedidos
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-center">
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Última Compra</span>
                <span className="font-bold text-xs text-stone-700">
                  {selectedClient.lastOrderDate || 'Sem compras'}
                </span>
              </div>
            </div>

            {/* Contact and Direct WhatsApp */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <span className="font-bold text-xs text-stone-700 uppercase tracking-wider block">
                Canais de Contacto Direto
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {selectedClient.phone && (
                  <button
                    onClick={() => handleOpenWhatsApp(selectedClient.phone, selectedClient.name)}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp ({selectedClient.phone})</span>
                  </button>
                )}

                {selectedClient.phone && (
                  <a
                    href={`tel:${selectedClient.phone}`}
                    className="px-3.5 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-4 h-4 text-red-600" />
                    <span>Ligar</span>
                  </a>
                )}

                {selectedClient.email && (
                  <a
                    href={`mailto:${selectedClient.email}`}
                    className="px-3.5 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Mail className="w-4 h-4 text-blue-600" />
                    <span>{selectedClient.email}</span>
                  </a>
                )}
              </div>
            </div>

            {/* Address in Luanda */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <span className="font-bold text-xs text-stone-700 uppercase tracking-wider block flex items-center gap-1">
                <MapPin className="w-4 h-4 text-red-600" /> Morada de Entrega em Luanda
              </span>
              <p className="text-xs text-stone-800 font-bold">
                {selectedClient.neighborhood || 'Bairro a definir'}, {selectedClient.municipality || 'Luanda'}
              </p>
              {selectedClient.streetAddress && (
                <p className="text-xs text-stone-600">Rua: {selectedClient.streetAddress}</p>
              )}
              {selectedClient.referencePoint && (
                <p className="text-xs text-red-700 font-medium">Ref: {selectedClient.referencePoint}</p>
              )}
            </div>

            {/* Block reason alert if blocked */}
            {selectedClient.isBlocked && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <ShieldAlert className="w-4 h-4 text-red-600" />
                  <span>Motivo do Bloqueio:</span>
                </div>
                <p className="text-stone-700">
                  {selectedClient.blockReason || 'Bloqueado por decisão administrativa.'}
                </p>
              </div>
            )}

            {/* Internal Admin Notes */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-stone-500" />
                <span>Notas Internas do Administrador para este Cliente:</span>
              </label>
              <textarea
                rows={2}
                value={adminNoteInput}
                onChange={(e) => setAdminNoteInput(e.target.value)}
                placeholder="Ex: Cliente prefere entregas após as 17h, contato alternativo da esposa..."
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-stone-900 focus:bg-white focus:outline-none focus:border-red-500"
              />
              <div className="flex justify-end">
                <button
                  onClick={() => handleSaveNotes(selectedClient)}
                  className="px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-black text-white font-bold text-xs cursor-pointer"
                >
                  Guardar Nota Interna
                </button>
              </div>
            </div>

            {/* Order History */}
            <div className="space-y-2 pt-2 border-t border-stone-200">
              <span className="font-bold text-xs text-stone-800 block">
                Histórico de Encomendas ({selectedClient.orders.length}):
              </span>

              {selectedClient.orders.length === 0 ? (
                <p className="text-xs text-stone-400 italic">Este cliente ainda não efetuou nenhuma encomenda.</p>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {selectedClient.orders.map((ord) => (
                    <div 
                      key={ord.id} 
                      className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-stone-900">{ord.orderNumber}</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            ord.status === 'entregue'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ord.status === 'cancelado'
                              ? 'bg-stone-200 text-stone-600'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {ord.status.toUpperCase()}
                          </span>
                        </div>
                        <span className="text-[10px] text-stone-400">{ord.date} • {ord.items.length} itens</span>
                      </div>

                      <div className="text-right font-mono">
                        <span className="font-black text-stone-900 block">{formatKwanzas(ord.total)}</span>
                        <span className="text-[10px] text-stone-500">
                          {ord.customer.paymentMethod === 'dinheiro_entrega' ? 'Dinheiro' : 'Express / IBAN'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
              <button
                onClick={() => handleToggleBlock(selectedClient)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  selectedClient.isBlocked
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200'
                }`}
              >
                {selectedClient.isBlocked ? 'Desbloquear Acesso' : 'Bloquear Cliente'}
              </button>

              <button
                onClick={() => setSelectedClient(null)}
                className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-black text-white font-bold text-xs cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Block Confirmation Modal */}
      {blockModalClient && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-stone-200 shadow-2xl animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h4 className="font-black text-base text-stone-900">Bloquear Cliente?</h4>
              <p className="text-xs text-stone-500">
                Tem a certeza que pretende suspender o acesso do cliente <strong>{blockModalClient.name}</strong>? O cliente não poderá realizar novas encomendas.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Motivo do bloqueio (opcional):</label>
              <input
                type="text"
                value={blockReasonInput}
                onChange={(e) => setBlockReasonInput(e.target.value)}
                placeholder="Ex: Cancelamentos repetidos no ato da entrega..."
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs focus:outline-none focus:border-red-500 focus:bg-white"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setBlockModalClient(null)}
                className="flex-1 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={confirmBlock}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer"
              >
                Sim, Bloquear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
