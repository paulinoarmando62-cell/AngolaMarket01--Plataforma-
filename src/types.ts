export type CategoryId = 
  | 'todos'
  | 'telemoveis_eletronicos'
  | 'moda_calcado'
  | 'eletrodomesticos_casa'
  | 'supermercado_frescos'
  | 'beleza_cosmeticos'
  | 'auto_pecas'
  | 'bebes_brinquedos';

export interface Category {
  id: CategoryId;
  name: string;
  icon: string;
  description: string;
  itemCount: number;
}

export type DeliveryType = 'porta' | 'paragem';

export interface LuandaZone {
  id: string;
  name: string;
  municipality: string;
  neighborhood: string;
  estimatedHours: string;
  deliveryFee: number; // in AOA (Kwanzas) - fallback default
  deliveryFeeDoor: number; // Taxa configurada para entrega à porta de casa (Kz)
  deliveryFeeBusStop: number; // Taxa configurada para entrega na paragem do bairro (Kz)
  popularBusStops?: string[]; // Paragens principais/pontos de paragem do bairro
  popularAreas: string[];
  active?: boolean;
}

export type UserRole = 'admin' | 'affiliate' | 'courier' | 'buyer';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  password?: string;
  avatar?: string;
  createdAt: number;
  iban?: string;
  multicaixaExpressPhone?: string;
  bankName?: string;
  preferredPaymentMethod?: PaymentMethodType | 'multicaixa_express' | 'transferencia_iban';
  defaultNeighborhood?: string;
  defaultMunicipality?: string;
  defaultStreetAddress?: string;
  defaultReferencePoint?: string;
  
  // Gestão Administrativa de Clientes:
  isBlocked?: boolean;
  blockReason?: string;
  adminNotes?: string;
  
  // Entregador fields:
  courierStatus?: 'pendente' | 'aprovado' | 'rejeitado';
  vehicle?: string;
  licensePlate?: string;
  operatingZones?: string[];
  totalDeliveriesCompleted?: number;
  todayDeliveriesCount?: number; // Total de entregas realizadas / atribuídas no dia corrente
  courierBalanceAOA?: number; // Saldo de taxas ganhas
  cashCollectedToDeposit?: number; // Dinheiro físico cobrado em mãos a prestar contas ao ADM
  
  // Afiliado fields:
  affiliateCode?: string;
  commissionRate?: number; // fallback default %
  totalSalesCount?: number;
  totalCommissionEarned?: number;
  balanceAOA?: number;
  withdrawnAOA?: number;
  affiliatedProductIds?: string[]; // IDs dos produtos aos quais o afiliado se afiliou
}

export interface Review {
  id: string;
  userName: string;
  userCity: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface Product {
  id: string;
  title: string;
  category: CategoryId;
  price: number; // in AOA (Kwanzas)
  originalPrice?: number;
  discountPercent?: number;
  rating: number;
  reviewCount: number;
  image: string;
  gallery?: string[];
  inStock: boolean;
  stockCount: number;
  cashOnDelivery: boolean;
  expressDeliveryLuanda: boolean;
  
  // Comissão do Afiliado configurada pelo ADM (0% a 100%)
  affiliateCommissionPercent: number; 
  
  seller: {
    id: string;
    name: string;
    location: string; // e.g. "Talatona, Luanda"
    rating: number;
    salesCount: number;
    verified: boolean;
    phone: string;
  };
  condition: 'Novo' | 'Usado - Como Novo' | 'Recondicionado';
  description: string;
  features: string[];
  tags: string[];
  reviews?: Review[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type PaymentMethodType = 
  | 'dinheiro_entrega' 
  | 'transferencia_bancaria' 
  | 'multicaixa_express' 
  | 'express_transferencia';

export interface AdminBankAccount {
  id: string;
  bankName: string; // Ex: Banco BAI, BFA, BIC, Atlântico, Standard Bank
  accountHolder: string; // Titular
  iban: string; // Ex: AO06 0040 ...
  accountNumber?: string;
  isActive: boolean;
  notes?: string;
}

export interface AdminExpressAccount {
  id: string;
  phone: string; // Ex: 938243909
  accountHolder: string; // Titular
  bankName?: string;
  isActive: boolean;
  notes?: string;
}

export interface StorePaymentConfig {
  acceptCashOnDelivery: boolean;
  bankAccounts: AdminBankAccount[];
  expressAccounts: AdminExpressAccount[];
}

export const DEFAULT_PAYMENT_CONFIG: StorePaymentConfig = {
  acceptCashOnDelivery: true,
  bankAccounts: [
    {
      id: 'iban_bai_main',
      bankName: 'Banco BAI',
      accountHolder: 'AngolaMarket 01 / Paulino Armando',
      iban: 'AO06 0040 0000 9382 4390 9101 2',
      accountNumber: '93824390910',
      isActive: true,
      notes: 'Transferências BAI Direto ou Interbancárias'
    },
    {
      id: 'iban_bfa_main',
      bankName: 'Banco BFA',
      accountHolder: 'AngolaMarket 01 / Paulino Armando',
      iban: 'AO06 0006 0000 9382 4390 9202 5',
      accountNumber: '93824390920',
      isActive: true,
      notes: 'Transferências BFA Net ou Interbancárias'
    }
  ],
  expressAccounts: [
    {
      id: 'exp_main',
      phone: '938243909',
      accountHolder: 'AngolaMarket 01 / Paulino Armando',
      bankName: 'Multicaixa Express',
      isActive: true,
      notes: 'Pagamento instantâneo Multicaixa Express direto pelo telemóvel'
    }
  ]
};

export interface OrderCustomerInfo {
  fullName: string;
  phone: string;
  email?: string;
  alternatePhone?: string;
  municipalityId: string;
  municipalityName: string;
  neighborhood: string;
  deliveryType?: DeliveryType; // 'porta' (à porta de casa) ou 'paragem' (na paragem do endereço)
  busStopName?: string; // Nome da paragem se deliveryType === 'paragem'
  streetAddress: string;
  referencePoint: string; // "Ponto de referência" crucial in Luanda
  deliveryNotes?: string;
  paymentMethod: PaymentMethodType;
  needChangeFor?: number; // Troco para quanto em dinheiro físico na entrega
  paymentReference?: string; // Nº do Comprovativo ou referência para transferência bancária
  paymentPhoneUsed?: string; // Telemóvel do cliente que efetuou o Multicaixa Express
  selectedIbanId?: string; // ID do IBAN selecionado
  selectedIbanDetails?: string; // Nome do banco e IBAN para registro
  selectedExpressPhone?: string; // Número Express da loja selecionado
  affiliateCodeUsed?: string;
}

export type OrderStatus = 'recebido' | 'preparando' | 'em_transito' | 'entregue' | 'cancelado';

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  timestamp: number;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  customer: OrderCustomerInfo;
  status: OrderStatus;
  estimatedDeliveryDate: string;
  deliveryCode: string; // Código de 4 dígitos para dar ao estafeta
  customerId?: string;
  customerEmail?: string;
  assignedCourierId?: string;
  affiliateCode?: string;
  affiliateCommissionAmount?: number;
  courier?: {
    name: string;
    phone: string;
    vehicle: string;
    avatar: string;
  };
}

export interface CourierSettlement {
  id: string;
  courierId: string;
  courierName: string;
  courierPhone: string;
  courierVehicle?: string;
  amount: number; // Montante em Kwanzas (Kz)
  amountAOA: number;
  paymentMethod?: 'dinheiro_escritorio' | 'transferencia_iban' | string;
  date?: string;
  submittedAt: number | string;
  status: 'pendente' | 'confirmado' | 'rejeitado';
  notes?: string;
  proofUrl?: string;
  confirmedAt?: string;
  confirmedByAdminName?: string;
}

export interface AdminWithdrawal {
  id: string;
  amount: number; // in AOA (Kwanzas)
  amountAOA: number;
  purpose?: string;
  withdrawalType: 'dinheiro_fisico' | 'transferencia_bancaria';
  iban?: string;
  bankName?: string;
  accountHolder?: string;
  date?: string;
  requestedAt: number | string;
  status: 'concluido';
  reference: string;
  adminName?: string;
}

export type PayoutRequestType = 'afiliado' | 'entregador';
export type PayoutRequestStatus = 'pendente' | 'pago' | 'rejeitado';

export interface PayoutRequest {
  id: string;
  type: PayoutRequestType;
  requesterId: string;
  requesterName: string;
  requesterPhone?: string;
  requesterRole: 'affiliate' | 'courier' | string;
  affiliateCode?: string;
  amount: number; // in AOA (Kwanzas)
  amountAOA?: number; // alias for amount in AOA
  feeAmount?: number; // Taxa fixa da plataforma (ex: 200 Kz no saque de afiliado para o ADM)
  netAmount?: number; // Valor líquido a transferir ao solicitante (amount - feeAmount)
  iban?: string;
  multicaixaExpressPhone?: string;
  bankName?: string;
  accountHolder?: string;
  paymentMethod?: 'multicaixa_express' | 'transferencia_iban' | string;
  notes?: string;
  status: PayoutRequestStatus;
  requestedAt: number | string;
  paidAt?: number | string;
  transactionRef?: string;
  paymentProofReference?: string;
  paidByAdminName?: string;
}

// Exact tab definitions as requested:
export type AdminTab = 
  | 'home'
  | 'dashboard'
  | 'carteira'
  | 'gestao_financeira'
  | 'gestao_pedidos'
  | 'gestao_clientes'
  | 'formas_pagamento'
  | 'gestao_entregadores'
  | 'gestao_afiliados'
  | 'taxa_entrega'
  | 'cadastrar_produtos'
  | 'meus_produtos'
  | 'perfil';

export type AffiliateTab = 
  | 'home'
  | 'dashboard'
  | 'carteira'
  | 'pedidos'
  | 'afiliar_se'
  | 'minhas_afiliacoes'
  | 'perfil';

export type CourierTab = 
  | 'home'
  | 'dashboard'
  | 'carteira'
  | 'pedidos'
  | 'perfil';
