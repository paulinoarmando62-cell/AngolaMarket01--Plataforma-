import { Category, LuandaZone, Product, AppUser, PayoutRequest } from '../types';

export const INITIAL_USERS: AppUser[] = [
  {
    id: 'user-admin-master',
    name: 'Paulino Armando (Administrador Geral)',
    email: 'paulinoarmando62@gmail.com',
    phone: '+244 938 243 909',
    role: 'admin',
    password: 'Armando@123',
    avatar: '',
    createdAt: Date.now(),
    iban: '',
    multicaixaExpressPhone: '+244 938 243 909',
    bankName: ''
  }
];

// Zonas e Bairros de Luanda configuráveis pelo Administrador (inicia limpo sem dados de exemplo)
export const DEFAULT_BLANK_ZONE: LuandaZone = {
  id: 'zone-default',
  name: 'Luanda',
  municipality: '',
  neighborhood: '',
  estimatedHours: '24 a 48 horas',
  deliveryFee: 0,
  deliveryFeeDoor: 0,
  deliveryFeeBusStop: 0,
  popularBusStops: [],
  popularAreas: [],
  active: true
};

export const LUANDA_ZONES: LuandaZone[] = [];

export const CATEGORIES: Category[] = [
  {
    id: 'todos',
    name: 'Todos os Produtos',
    icon: 'Sparkles',
    description: 'Catálogo completo de artigos com entrega em Luanda',
    itemCount: 0
  },
  {
    id: 'telemoveis_eletronicos',
    name: 'Telemóveis & Tecnologia',
    icon: 'Smartphone',
    description: 'Smartphones, Laptops, Fones e Acessórios',
    itemCount: 0
  },
  {
    id: 'eletrodomesticos_casa',
    name: 'Eletrodomésticos & Casa',
    icon: 'Tv',
    description: 'Geleiras, ACs, Eletrodomésticos e Geradores',
    itemCount: 0
  },
  {
    id: 'moda_calcado',
    name: 'Moda & Calçado',
    icon: 'Shirt',
    description: 'Vestuário africano, Calçado, Ténis e Acessórios',
    itemCount: 0
  },
  {
    id: 'beleza_cosmeticos',
    name: 'Beleza & Cosméticos',
    icon: 'Sparkle',
    description: 'Cabelos, cremes, perfumes e cuidados pessoais',
    itemCount: 0
  },
  {
    id: 'supermercado_frescos',
    name: 'Supermercado & Alimentação',
    icon: 'ShoppingBag',
    description: 'Cesta básica, cereais, lacticínios e frescos',
    itemCount: 0
  },
  {
    id: 'auto_pecas',
    name: 'Auto & Acessórios',
    icon: 'Car',
    description: 'Acessórios automóveis, óleos e manutenção',
    itemCount: 0
  },
  {
    id: 'bebes_brinquedos',
    name: 'Bebés & Crianças',
    icon: 'Baby',
    description: 'Artigos infantis, fraldas e puericultura',
    itemCount: 0
  }
];

// Catálogo limpo para produtos reais adicionados pelo Administrador
export const INITIAL_PRODUCTS: Product[] = [];

export const COURIER_COMMISSION_PER_DELIVERY_AOA = 1000;

export const INITIAL_PAYOUT_REQUESTS: PayoutRequest[] = [];

export function formatKwanzas(value: number): string {
  return new Intl.NumberFormat('pt-AO', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value) + ' Kz';
}
