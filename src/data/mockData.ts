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

export const LUANDA_ZONES: LuandaZone[] = [
  {
    id: 'luanda_maianga',
    name: 'Maianga (Alvalade, Bairro Azul, Cassenda, Sagrada Família)',
    municipality: 'Luanda',
    neighborhood: 'Maianga & Alvalade',
    estimatedHours: '1 a 2 horas',
    deliveryFee: 2000,
    deliveryFeeDoor: 2000,
    deliveryFeeBusStop: 1200,
    popularBusStops: ['Paragem da Sagrada Família', 'Paragem do Kinaxixi', 'Paragem do Cassenda', 'Paragem do Alvalade / Shoprite', 'Paragem da Maianga'],
    popularAreas: ['Maianga', 'Alvalade', 'Bairro Azul', 'Cassenda', 'Sagrada Família', 'Kinaxixi'],
    active: true
  },
  {
    id: 'luanda_ingombota',
    name: 'Ingombota (Mutamba, Miramar, Maculusso, Ilha de Luanda)',
    municipality: 'Luanda',
    neighborhood: 'Ingombota & Mutamba',
    estimatedHours: '1 a 2 horas',
    deliveryFee: 2000,
    deliveryFeeDoor: 2000,
    deliveryFeeBusStop: 1200,
    popularBusStops: ['Paragem da Mutamba / BNA', 'Paragem do Maculusso', 'Paragem do Baleizão / Marginal', 'Paragem do Ponto Final (Ilha)', 'Paragem da Miramar'],
    popularAreas: ['Mutamba', 'Miramar', 'Maculusso', 'Ilha de Luanda', 'Coqueiros', 'Patrice Lumumba'],
    active: true
  },
  {
    id: 'luanda_samba_morro_bento',
    name: 'Samba & Morro Bento (Corimba, Rocha Pinto, Nova Vida)',
    municipality: 'Luanda / Talatona',
    neighborhood: 'Morro Bento & Samba',
    estimatedHours: '1 a 3 horas',
    deliveryFee: 2200,
    deliveryFeeDoor: 2200,
    deliveryFeeBusStop: 1400,
    popularBusStops: ['Paragem do Rocha Pinto / Ponte', 'Paragem da Gamek', 'Paragem da Nova Vida (Entrada)', 'Paragem da Corimba / Mabunda', 'Paragem do Morro Bento'],
    popularAreas: ['Morro Bento', 'Samba', 'Corimba', 'Urbanização Nova Vida', 'Rocha Pinto', 'Futungo de Belas'],
    active: true
  },
  {
    id: 'talatona_centro',
    name: 'Talatona (Talatona Shopping, Patriota, Lar do Patriota)',
    municipality: 'Talatona',
    neighborhood: 'Talatona Centro & Patriota',
    estimatedHours: '2 a 3 horas',
    deliveryFee: 2400,
    deliveryFeeDoor: 2400,
    deliveryFeeBusStop: 1500,
    popularBusStops: ['Paragem do Belas Shopping', 'Paragem da Rotunda do Talatona', 'Paragem da Entrada do Patriota', 'Paragem da Cidade Financeira', 'Paragem do Lar do Patriota'],
    popularAreas: ['Talatona Centro', 'Patriota', 'Lar do Patriota', 'Condomínio Dolce Vita', 'Cidade Financeira'],
    active: true
  },
  {
    id: 'talatona_benfica',
    name: 'Benfica (Benfica Centro, Kifica, Zona Verde)',
    municipality: 'Talatona',
    neighborhood: 'Benfica',
    estimatedHours: '2 a 4 horas',
    deliveryFee: 2500,
    deliveryFeeDoor: 2500,
    deliveryFeeBusStop: 1500,
    popularBusStops: ['Paragem da Kifica', 'Paragem do Mercado do Benfica', 'Paragem da Zona Verde', 'Paragem do Bentiaba', 'Paragem do Panguila Benfica'],
    popularAreas: ['Benfica Centro', 'Kifica', 'Zona Verde', 'Praia do Bispo', 'Ramiros'],
    active: true
  },
  {
    id: 'belas_kilamba',
    name: 'Centralidade do Kilamba & KK5000 (Quarteirões A ao W)',
    municipality: 'Belas',
    neighborhood: 'Centralidade do Kilamba',
    estimatedHours: '2 a 4 horas',
    deliveryFee: 2800,
    deliveryFeeDoor: 2800,
    deliveryFeeBusStop: 1800,
    popularBusStops: ['Paragem do Bloco A / Xyami Kilamba', 'Paragem Central do Kilamba', 'Paragem do Bloco Q', 'Paragem do Bloco W', 'Paragem do KK5000 Principal'],
    popularAreas: ['Centralidade do Kilamba', 'KK5000', 'Quarteirão A ao W', 'Bairro 11 de Novembro', 'Vila Verde'],
    active: true
  },
  {
    id: 'kilamba_kiaxi_palanca',
    name: 'Kilamba Kiaxi (Palanca, Golf 1, Golf 2, Vila Estoril)',
    municipality: 'Kilamba Kiaxi',
    neighborhood: 'Palanca & Golf',
    estimatedHours: '2 a 4 horas',
    deliveryFee: 2200,
    deliveryFeeDoor: 2200,
    deliveryFeeBusStop: 1300,
    popularBusStops: ['Paragem da Rua da Gajajeira', 'Paragem do Triângulo da Palanca', 'Paragem do Golf 2 / Campo', 'Paragem do Hospital Geral de Luanda', 'Paragem da Unilins / Estoril'],
    popularAreas: ['Palanca', 'Golf 1', 'Golf 2', 'Vila Estoril', 'Calemba 2', 'Sapú', 'Rua da Gajajeira'],
    active: true
  },
  {
    id: 'cazenga_centro',
    name: 'Cazenga (Hoji-ya-Henda, Tala Hadi, Cazenga Popular, Asa Branca)',
    municipality: 'Cazenga',
    neighborhood: 'Cazenga & Hoji-ya-Henda',
    estimatedHours: '2 a 4 horas',
    deliveryFee: 2200,
    deliveryFeeDoor: 2200,
    deliveryFeeBusStop: 1400,
    popularBusStops: ['Paragem da Asa Branca', 'Paragem do Marco Histórico do Cazenga', 'Paragem da Terra Vermelha', 'Paragem do Tala Hadi / 5ª Avenida', 'Paragem da Mabor'],
    popularAreas: ['Hoji-ya-Henda', 'Tala Hadi', 'Cazenga Popular', 'Asa Branca', 'Mabor', 'Terra Vermelha'],
    active: true
  },
  {
    id: 'viana_centro',
    name: 'Viana (Viana Centro, Estalagem, Vila Flor, Grafanil, Regedoria)',
    municipality: 'Viana',
    neighborhood: 'Viana Centro & Estalagem',
    estimatedHours: '3 a 5 horas',
    deliveryFee: 3000,
    deliveryFeeDoor: 3000,
    deliveryFeeBusStop: 1800,
    popularBusStops: ['Paragem da Robaldina', 'Paragem da Estalagem', 'Paragem do Luanda Sul', 'Paragem do Grafanil Bar', 'Paragem da Vila de Viana / Linha do Comboio', 'Paragem do Kikuxi'],
    popularAreas: ['Viana Centro', 'Estalagem', 'Vila Flor', 'Grafanil', 'Regedoria', 'Capalanca', 'Kikuxi'],
    active: true
  },
  {
    id: 'viana_zango',
    name: 'Zango (Zango 0, 1, 2, 3, 4, 5 & Centralidade 8000)',
    municipality: 'Viana',
    neighborhood: 'Zango 1 a 5 & 8000',
    estimatedHours: '3 a 6 horas',
    deliveryFee: 3500,
    deliveryFeeDoor: 3500,
    deliveryFeeBusStop: 2000,
    popularBusStops: ['Paragem do Zango 0 / Entrada', 'Paragem do Zango 1', 'Paragem do Zango 2', 'Paragem do Zango 3 / Mercado', 'Paragem do Zango 4', 'Paragem da Centralidade 8000'],
    popularAreas: ['Zango 0', 'Zango 1', 'Zango 2', 'Zango 3', 'Zango 4', 'Zango 5', 'Centralidade 8000'],
    active: true
  },
  {
    id: 'cacuaco_sequele',
    name: 'Cacuaco (Vila de Cacuaco, Centralidade do Sequele, Kikolo)',
    municipality: 'Cacuaco',
    neighborhood: 'Sequele & Vila de Cacuaco',
    estimatedHours: '3 a 6 horas',
    deliveryFee: 3200,
    deliveryFeeDoor: 3200,
    deliveryFeeBusStop: 1900,
    popularBusStops: ['Paragem do Mercado do Kikolo', 'Paragem do Sequele Bloco 1', 'Paragem da Vila de Cacuaco / Porto', 'Paragem da Vidrul', 'Paragem do Belo Monte'],
    popularAreas: ['Centralidade do Sequele', 'Vila de Cacuaco', 'Mercado do Kikolo', 'Vidrul', 'Belo Monte'],
    active: true
  },
  {
    id: 'luanda_sambizanga_rangel',
    name: 'Sambizanga & Rangel (São Paulo, Terra Nova, Nelito Soares)',
    municipality: 'Luanda',
    neighborhood: 'São Paulo & Rangel',
    estimatedHours: '1 a 3 horas',
    deliveryFee: 2000,
    deliveryFeeDoor: 2000,
    deliveryFeeBusStop: 1200,
    popularBusStops: ['Paragem do Mercado dos Congolenses', 'Paragem de São Paulo / Igreja', 'Paragem da Terra Nova', 'Paragem do Nelito Soares', 'Paragem do Bairro Operário'],
    popularAreas: ['São Paulo', 'Mercado dos Congolenses', 'Terra Nova', 'Nelito Soares', 'Bairro Operário'],
    active: true
  }
];

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
    description: 'iPhones, Samsungs, Laptops, Fones e Acessórios',
    itemCount: 0
  },
  {
    id: 'eletrodomesticos_casa',
    name: 'Eletrodomésticos & Geradores',
    icon: 'Tv',
    description: 'Geleiras, ACs, Geradores a Gasolina, Fritadeiras',
    itemCount: 0
  },
  {
    id: 'moda_calcado',
    name: 'Moda, Samakaka & Ténis',
    icon: 'Shirt',
    description: 'Vestuário africano, Calçado, Ténis e Acessórios',
    itemCount: 0
  },
  {
    id: 'beleza_cosmeticos',
    name: 'Perucas, Cabelos & Beleza',
    icon: 'Sparkle',
    description: 'Perucas humanas, cremes corporais, perfumes e maquilhagem',
    itemCount: 0
  },
  {
    id: 'supermercado_frescos',
    name: 'Cesta Básica & Supermercado',
    icon: 'ShoppingBag',
    description: 'Fardos de arroz, óleo, caixas de leite e frescos',
    itemCount: 0
  },
  {
    id: 'auto_pecas',
    name: 'Auto & Acessórios',
    icon: 'Car',
    description: 'Baterias, óleos sintéticos, tapetes e alarmes',
    itemCount: 0
  },
  {
    id: 'bebes_brinquedos',
    name: 'Bebés & Crianças',
    icon: 'Baby',
    description: 'Fraldas em fardo, carrinhos e roupas infantis',
    itemCount: 0
  }
];

// Production products state starts clean for real items added by the administrator
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
