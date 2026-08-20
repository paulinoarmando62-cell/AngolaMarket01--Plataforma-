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

export type PaymentMethodType = 'dinheiro_entrega' | 'express_transferencia';

export interface OrderCustomerInfo {
  fullName: string;
  phone: string;
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
  needChangeFor?: number; // Troco para quanto em dinheiro
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
