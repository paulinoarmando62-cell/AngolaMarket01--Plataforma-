import { Category, LuandaZone, Product, AppUser, PayoutRequest } from '../types';

export const INITIAL_USERS: AppUser[] = [
  {
    id: 'user-admin-master',
    name: 'Paulino Armando (Administrador Geral)',
    email: 'paulinoarmando62@gmail.com',
    phone: '+244 938 243 909',
    role: 'admin',
    password: 'Armando@123',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: Date.now(),
    iban: '',
    multicaixaExpressPhone: '+244 938 243 909'
  }
];

// Production state starts clean for real delivery zones and fees configured by the administrator
export const LUANDA_ZONES: LuandaZone[] = [];

export const CATEGORIES: Category[] = [
  {
    id: 'todos',
    name: 'Todos os Produtos',
    icon: 'Sparkles',
    description: 'Catálogo completo do AngolaMarket 01',
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

// Production products state starts completely clean
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
