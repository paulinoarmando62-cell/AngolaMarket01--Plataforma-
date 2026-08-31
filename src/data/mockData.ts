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

// Zonas reais de Luanda configuráveis pelo Administrador
export const LUANDA_ZONES: LuandaZone[] = [
  {
    id: 'zone-ingombota',
    name: 'Ingombota / Centro (Luanda)',
    municipality: 'Luanda',
    neighborhood: 'Ingombota',
    estimatedHours: '2 a 4 horas',
    deliveryFee: 2000,
    deliveryFeeDoor: 2000,
    deliveryFeeBusStop: 1500,
    popularBusStops: ['Kinaxixi', 'Mutamba', 'Largo do Baleizão', 'Sagrada Família'],
    popularAreas: ['Kinaxixi', 'Mutamba', 'Coqueiros', 'Maculusso', 'Ilha de Luanda', 'Cruzeiro'],
    active: true
  },
  {
    id: 'zone-maianga',
    name: 'Maianga / Alvalade',
    municipality: 'Luanda',
    neighborhood: 'Maianga',
    estimatedHours: '2 a 4 horas',
    deliveryFee: 2200,
    deliveryFeeDoor: 2200,
    deliveryFeeBusStop: 1600,
    popularBusStops: ['Paragem do Cassenda', 'Sagrada Família', 'Chicala', 'Gamek'],
    popularAreas: ['Alvalade', 'Cassenda', 'Prenda', 'Bairro Azul', 'Rocha Pinto', 'Morro da Luz'],
    active: true
  },
  {
    id: 'zone-talatona',
    name: 'Talatona / Patriota',
    municipality: 'Talatona',
    neighborhood: 'Talatona',
    estimatedHours: '3 a 5 horas',
    deliveryFee: 2500,
    deliveryFeeDoor: 2500,
    deliveryFeeBusStop: 1800,
    popularBusStops: ['Kero Talatona', 'Centro de Convenções', 'Paragem do Patriota', 'Maxi Morro Bento'],
    popularAreas: ['Morro Bento', 'Condomínio Dolce Vita', 'Patriota', 'Futungo de Belas', 'Cidade Financeira'],
    active: true
  },
  {
    id: 'zone-kilamba',
    name: 'Kilamba / Camama',
    municipality: 'Belas',
    neighborhood: 'Kilamba',
    estimatedHours: '3 a 6 horas',
    deliveryFee: 3000,
    deliveryFeeDoor: 3000,
    deliveryFeeBusStop: 2200,
    popularBusStops: ['Centralidade do Kilamba (Bloco A)', 'Desvio do Sapú', 'Rotunda da Cidade Universitária'],
    popularAreas: ['Centralidade do Kilamba', 'Camama', 'Cidade Universitária', 'Jardim de Rosas', 'Sapú'],
    active: true
  },
  {
    id: 'zone-viana',
    name: 'Viana / Zango',
    municipality: 'Viana',
    neighborhood: 'Viana',
    estimatedHours: '4 a 7 horas',
    deliveryFee: 3500,
    deliveryFeeDoor: 3500,
    deliveryFeeBusStop: 2500,
    popularBusStops: ['Ponte Amarela de Viana', 'Paragem da Moagem', 'Mercado do 30', 'Zango 1 Central'],
    popularAreas: ['Vila de Viana', 'Estalagem', 'Grafanil', 'Zango 0 a 4', 'Centralidade 8000', 'Capalanga'],
    active: true
  },
  {
    id: 'zone-belas',
    name: 'Belas / Benfica',
    municipality: 'Belas',
    neighborhood: 'Benfica',
    estimatedHours: '3 a 6 horas',
    deliveryFee: 3200,
    deliveryFeeDoor: 3200,
    deliveryFeeBusStop: 2400,
    popularBusStops: ['Mercado do Benfica', 'Kero Benfica', 'Paragem dos Ramiros', 'Corimba'],
    popularAreas: ['Benfica', 'Ramiros', 'Morro dos Veados', 'Bairro Militar', 'Kilamba Kiaxi'],
    active: true
  },
  {
    id: 'zone-cazenga',
    name: 'Cazenga / Hoji-ya-Henda',
    municipality: 'Cazenga',
    neighborhood: 'Cazenga',
    estimatedHours: '3 a 5 horas',
    deliveryFee: 2500,
    deliveryFeeDoor: 2500,
    deliveryFeeBusStop: 1800,
    popularBusStops: ['Marco Histórico do Cazenga', 'Paragem do Asa Branca', 'Mabor', 'Cuca'],
    popularAreas: ['Tala Hady', 'Calawenda', 'Quinta da Dona Amélia', '11 de Novembro', 'Hoji-ya-Henda'],
    active: true
  },
  {
    id: 'zone-cacuaco',
    name: 'Cacuaco / Sequele',
    municipality: 'Cacuaco',
    neighborhood: 'Cacuaco',
    estimatedHours: '4 a 7 horas',
    deliveryFee: 3800,
    deliveryFeeDoor: 3800,
    deliveryFeeBusStop: 2800,
    popularBusStops: ['Vila de Cacuaco', 'Entrada do Sequele', 'Desvio da Vidrul', 'Kifangondo'],
    popularAreas: ['Vila de Cacuaco', 'Centralidade do Sequele', 'Vidrul', 'Belo Monte', 'Kifangondo'],
    active: true
  }
];

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
