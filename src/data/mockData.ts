import { Category, LuandaZone, Product, AppUser, PayoutRequest } from '../types';

export const INITIAL_USERS: AppUser[] = [
  {
    id: 'user-admin-master',
    name: 'Paulino Armando (Dono / ADM)',
    email: 'admin@angolamarket01.ao',
    phone: '+244 923 000 001',
    role: 'admin',
    password: '123',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: Date.now() - 30 * 86400000,
    iban: 'AO06.0040.0000.1234.5678.9012.3',
    multicaixaExpressPhone: '+244 923 000 001'
  },
  {
    id: 'user-courier-1',
    name: 'António Kapanda',
    email: 'estafeta.kapanda@gmail.com',
    phone: '+244 931 889 004',
    role: 'courier',
    password: '123',
    courierStatus: 'aprovado',
    vehicle: 'Moto Haojue 150cc',
    licensePlate: 'LD-44-89-HT',
    operatingZones: ['Maianga', 'Talatona', 'Kilamba'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    createdAt: Date.now() - 10 * 86400000,
    totalDeliveriesCompleted: 42,
    todayDeliveriesCount: 3,
    courierBalanceAOA: 42000, // 42 entregas x 1.000 Kz
    cashCollectedToDeposit: 340000,
    iban: 'AO06.0040.0000.9876.5432.1098.7',
    multicaixaExpressPhone: '+244 931 889 004'
  },
  {
    id: 'user-courier-3',
    name: 'Domingos Ndala (Flash Luanda)',
    email: 'domingos.flash@gmail.com',
    phone: '+244 923 774 210',
    role: 'courier',
    password: '123',
    courierStatus: 'aprovado',
    vehicle: 'Moto Yamaha YBR 125',
    licensePlate: 'LD-19-33-GP',
    operatingZones: ['Ingombota', 'Samba', 'Vila Alice', 'Alvalade'],
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    createdAt: Date.now() - 25 * 86400000,
    totalDeliveriesCompleted: 68,
    todayDeliveriesCount: 1,
    courierBalanceAOA: 68000, // 68 entregas x 1.000 Kz
    cashCollectedToDeposit: 185000,
    iban: 'AO06.0040.0000.1122.3344.5566.7',
    multicaixaExpressPhone: '+244 923 774 210'
  },
  {
    id: 'user-courier-4',
    name: 'João Baptista Zua',
    email: 'joao.zua.entregas@gmail.com',
    phone: '+244 940 339 812',
    role: 'courier',
    password: '123',
    courierStatus: 'aprovado',
    vehicle: 'Moto TVS Star HLX 150',
    licensePlate: 'LD-72-61-AZ',
    operatingZones: ['Kilamba Kiaxi', 'Palanca', 'Golf 2', 'Cazenga'],
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    createdAt: Date.now() - 18 * 86400000,
    totalDeliveriesCompleted: 53,
    todayDeliveriesCount: 0,
    courierBalanceAOA: 53000, // 53 entregas x 1.000 Kz
    cashCollectedToDeposit: 0,
    iban: 'AO06.0040.0000.4455.6677.8899.0',
    multicaixaExpressPhone: '+244 940 339 812'
  },
  {
    id: 'user-courier-2',
    name: 'Manuel Domingos Kiala',
    email: 'kiala.entregas@gmail.com',
    phone: '+244 924 110 992',
    role: 'courier',
    password: '123',
    courierStatus: 'pendente',
    vehicle: 'Moto Lingken 125cc',
    licensePlate: 'LD-88-12-MK',
    operatingZones: ['Viana', 'Cazenga', 'Cacuaco'],
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    createdAt: Date.now() - 1 * 86400000,
    totalDeliveriesCompleted: 0,
    todayDeliveriesCount: 0,
    courierBalanceAOA: 0,
    cashCollectedToDeposit: 0
  },
  {
    id: 'user-affiliate-1',
    name: 'Teresa Gonçalves (Afiliada Luanda)',
    email: 'teresa.marketing@gmail.com',
    phone: '+244 945 220 114',
    role: 'affiliate',
    password: '123',
    affiliateCode: 'TERESA-01',
    commissionRate: 8,
    totalSalesCount: 14,
    totalCommissionEarned: 148000,
    balanceAOA: 62000,
    withdrawnAOA: 86000,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    createdAt: Date.now() - 15 * 86400000,
    iban: 'AO06.0040.0000.5544.3322.1100.9',
    multicaixaExpressPhone: '+244 945 220 114',
    affiliatedProductIds: [
      'prod-iphone-15-pro',
      'prod-peruca-humana-front-lace',
      'prod-vestido-samakaka-moderno',
      'prod-cesta-basica-familiar'
    ]
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
    itemCount: 48
  },
  {
    id: 'telemoveis_eletronicos',
    name: 'Telemóveis & Tecnologia',
    icon: 'Smartphone',
    description: 'iPhones, Samsungs, Laptops, Fones e Acessórios',
    itemCount: 14
  },
  {
    id: 'eletrodomesticos_casa',
    name: 'Eletrodomésticos & Geradores',
    icon: 'Tv',
    description: 'Geleiras, ACs, Geradores a Gasolina, Fritadeiras',
    itemCount: 10
  },
  {
    id: 'moda_calcado',
    name: 'Moda, Samakaka & Ténis',
    icon: 'Shirt',
    description: 'Vestuário africano, Calçado, Ténis e Acessórios',
    itemCount: 9
  },
  {
    id: 'beleza_cosmeticos',
    name: 'Perucas, Cabelos & Beleza',
    icon: 'Sparkle',
    description: 'Perucas humanas, cremes corporais, perfumes e maquilhagem',
    itemCount: 8
  },
  {
    id: 'supermercado_frescos',
    name: 'Cesta Básica & Supermercado',
    icon: 'ShoppingBag',
    description: 'Fardos de arroz, óleo, caixas de leite e frescos',
    itemCount: 7
  },
  {
    id: 'auto_pecas',
    name: 'Auto & Acessórios',
    icon: 'Car',
    description: 'Baterias, óleos sintéticos, tapetes e alarmes',
    itemCount: 5
  },
  {
    id: 'bebes_brinquedos',
    name: 'Bebés & Crianças',
    icon: 'Baby',
    description: 'Fraldas em fardo, carrinhos e roupas infantis',
    itemCount: 4
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-iphone-15-pro',
    title: 'Apple iPhone 15 Pro 128GB Titânio Natural - Selado com Garantia',
    category: 'telemoveis_eletronicos',
    price: 1180000,
    originalPrice: 1290000,
    discountPercent: 9,
    rating: 4.9,
    reviewCount: 42,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1695048065050-c637424fb9c9?w=800&auto=format&fit=crop&q=80'
    ],
    inStock: true,
    stockCount: 8,
    cashOnDelivery: true,
    expressDeliveryLuanda: true,
    affiliateCommissionPercent: 5, // 5% = 59.000 Kz de comissão por venda
    seller: {
      id: 'admin-master',
      name: 'AngolaMarket 01 (Loja Oficial)',
      location: 'Talatona Mall & São Paulo, Luanda',
      rating: 5.0,
      salesCount: 384,
      verified: true,
      phone: '+244 923 000 001'
    },
    condition: 'Novo',
    description: 'iPhone 15 Pro 128GB em caixa selada de fábrica. Chip A17 Pro, estrutura em titânio aeroespacial e sistema de câmaras de 48 MP. Receba em sua casa ou condomínio em Luanda e pague por TPA ou Dinheiro apenas após abrir a embalagem e verificar o IMEI.',
    features: [
      'Memória Interna: 128GB',
      'Processador A17 Pro Bionic',
      'Cor: Natural Titanium',
      'Garantia Apple Oficial de 1 Ano',
      'Pague só no ato da entrega em Luanda'
    ],
    tags: ['Apple', 'iPhone', 'iOS', 'Smartphone', 'Premium'],
    reviews: [
      {
        id: 'rev-1',
        userName: 'Manuel Domingos de Sousa',
        userCity: 'Centralidade do Kilamba',
        rating: 5,
        date: 'Há 2 dias',
        comment: 'Excelente serviço! O estafeta chegou com a máquina de TPA na hora combinada. Conferi o selo antes de passar o cartão.',
        verifiedPurchase: true
      },
      {
        id: 'rev-2',
        userName: 'Teresa Gonçalves',
        userCity: 'Maianga',
        rating: 5,
        date: 'Há 5 dias',
        comment: 'Comprei com muita segurança no AngolaMarket 01. Entrega rápida no mesmo dia na Maianga.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'prod-samsung-s24-ultra',
    title: 'Samsung Galaxy S24 Ultra 256GB Titanium Gray com Caneta S-Pen',
    category: 'telemoveis_eletronicos',
    price: 1120000,
    originalPrice: 1240000,
    discountPercent: 10,
    rating: 4.8,
    reviewCount: 36,
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&auto=format&fit=crop&q=80'
    ],
    inStock: true,
    stockCount: 12,
    cashOnDelivery: true,
    expressDeliveryLuanda: true,
    affiliateCommissionPercent: 6, // 6% = 67.200 Kz
    seller: {
      id: 'admin-master',
      name: 'AngolaMarket 01 (Loja Oficial)',
      location: 'Ingombota, Rua Rainha Ginga, Luanda',
      rating: 5.0,
      salesCount: 215,
      verified: true,
      phone: '+244 923 000 001'
    },
    condition: 'Novo',
    description: 'Samsung Galaxy S24 Ultra topo de gama com Galaxy AI, câmara de 200MP e bateria de longa duração. Entregas expressas em qualquer município de Luanda com pagamento Multicaixa na entrega.',
    features: [
      'Ecrã AMOLED Dinâmico 2X 6.8" 120Hz',
      'Câmara Quádrupla 200MP com Zoom 100x',
      'Galaxy AI integrada (Tradução em tempo real)',
      'Bateria 5000 mAh com Carga Rápida 45W'
    ],
    tags: ['Samsung', 'Android', 'Galaxy AI', 'S-Pen'],
    reviews: [
      {
        id: 'rev-3',
        userName: 'António Kapinga',
        userCity: 'Talatona',
        rating: 5,
        date: 'Ontem',
        comment: 'O estafeta foi muito educado. Entregou no condomínio e passei por TPA sem problemas.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'prod-gerador-gasolina-6500w',
    title: 'Gerador Elétrico a Gasolina Lutian 6.5kVA com Arranque Elétrico e Chave',
    category: 'eletrodomesticos_casa',
    price: 340000,
    originalPrice: 385000,
    discountPercent: 12,
    rating: 4.9,
    reviewCount: 58,
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    inStock: true,
    stockCount: 15,
    cashOnDelivery: true,
    expressDeliveryLuanda: true,
    affiliateCommissionPercent: 10, // 10% = 34.000 Kz
    seller: {
      id: 'admin-master',
      name: 'AngolaMarket 01 (Loja Oficial)',
      location: 'Viana (Estrada de Catete) & São Paulo',
      rating: 5.0,
      salesCount: 520,
      verified: true,
      phone: '+244 923 000 001'
    },
    condition: 'Novo',
    description: 'Gerador de alta durabilidade e baixo consumo para residências e escritórios em Luanda. Aguenta geleira grande, ar condicionado de 12.000 BTU, televisores e iluminação completa. Teste com o técnico no ato da entrega e pague após o arranque!',
    features: [
      'Potência Máxima: 6.5 kVA / 6500W',
      'Sistema de Arranque Elétrico (Chave + Corda)',
      '100% Cobre no enrolamento do alternador',
      'Depósito de 25 Litros para autonomia de até 10 horas',
      'Rodas reforçadas para fácil transporte'
    ],
    tags: ['Gerador', 'Energia', 'Lutian', 'Casa', 'Segurança'],
    reviews: [
      {
        id: 'rev-4',
        userName: 'Joaquim Silva Morais',
        userCity: 'Zango 3, Viana',
        rating: 5,
        date: 'Há 3 dias',
        comment: 'Salvação para as noites no Zango. Entregaram de carrinha e o rapaz ajudou a ligar e testar. Paguei em dinheiro com troco certinho.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'prod-geleira-hisense-dupla',
    title: 'Frigorífico Combinado Hisense 260L No Frost Inox - Baixo Consumo',
    category: 'eletrodomesticos_casa',
    price: 265000,
    originalPrice: 295000,
    discountPercent: 10,
    rating: 4.7,
    reviewCount: 29,
    image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800&auto=format&fit=crop&q=80',
    inStock: true,
    stockCount: 6,
    cashOnDelivery: true,
    expressDeliveryLuanda: true,
    affiliateCommissionPercent: 8, // 8% = 21.200 Kz
    seller: {
      id: 'admin-master',
      name: 'AngolaMarket 01 (Loja Oficial)',
      location: 'Viana & Maianga, Luanda',
      rating: 5.0,
      salesCount: 520,
      verified: true,
      phone: '+244 923 000 001'
    },
    condition: 'Novo',
    description: 'Frigorífico Hisense No Frost que não cria gelo nas paredes. Ideal para a voltagem de Luanda com proteção contra variações elétricas. Entregamos direto na sua cozinha.',
    features: [
      'Capacidade total: 260 Litros',
      'Tecnologia Total No Frost',
      'Classe de Eficiência Energética A+',
      'Garantia do Motor de 5 Anos'
    ],
    tags: ['Geleira', 'Hisense', 'Cozinha', 'Eletrodomésticos']
  },
  {
    id: 'prod-peruca-humana-front-lace',
    title: 'Peruca Humana 100% Cabelo Virgem Brasileiro 30 Polegadas HD Front Lace',
    category: 'beleza_cosmeticos',
    price: 145000,
    originalPrice: 180000,
    discountPercent: 19,
    rating: 5.0,
    reviewCount: 67,
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop&q=80',
    inStock: true,
    stockCount: 18,
    cashOnDelivery: true,
    expressDeliveryLuanda: true,
    affiliateCommissionPercent: 15, // 15% = 21.750 Kz
    seller: {
      id: 'admin-master',
      name: 'AngolaMarket 01 (Loja Oficial)',
      location: 'Benfica & Mutamba, Luanda',
      rating: 5.0,
      salesCount: 490,
      verified: true,
      phone: '+244 923 000 001'
    },
    condition: 'Novo',
    description: 'Cabelo humano 100% natural sem misturas sintéticas. Textura sedosa, pode descolorir até tom 613, alisar ou encaracolar. Lace invisível HD que adapta a qualquer tom de pele angolana.',
    features: [
      'Comprimento: 30 Polegadas (Abaixo da cintura)',
      'Densidade 180% super cheia',
      'Lace Transparente HD 13x4',
      'Inclui touca de brinde e escova de baby hair'
    ],
    tags: ['Peruca', 'Cabelo Humano', 'Beleza', 'Lace HD'],
    reviews: [
      {
        id: 'rev-5',
        userName: 'Nazaré Chissola',
        userCity: 'Miramar, Luanda',
        rating: 5,
        date: 'Ontem',
        comment: 'Cabelo maravilhoso e cheiroso! Chegou em 2 horas no Miramar. Paguei por Express na entrega.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'prod-vestido-samakaka-moderno',
    title: 'Vestido Samakaka Angolana Design Exclusivo Moda Chic Luanda',
    category: 'moda_calcado',
    price: 35000,
    originalPrice: 45000,
    discountPercent: 22,
    rating: 4.9,
    reviewCount: 31,
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&auto=format&fit=crop&q=80',
    inStock: true,
    stockCount: 14,
    cashOnDelivery: true,
    expressDeliveryLuanda: true,
    affiliateCommissionPercent: 20, // 20% = 7.000 Kz
    seller: {
      id: 'admin-master',
      name: 'AngolaMarket 01 (Loja Oficial)',
      location: 'Vila Alice, Luanda',
      rating: 5.0,
      salesCount: 180,
      verified: true,
      phone: '+244 923 000 001'
    },
    condition: 'Novo',
    description: 'Vestido confeccionado com autêntico tecido Samakaka angolano de alta gramatura e corte contemporâneo elegante. Ideal para eventos, casamentos tradicionais (alambamentos) e saídas de fim de semana.',
    features: [
      'Padrão tradicional Samakaka Vermelho/Amarelo/Preto',
      'Tecido 100% Algodão respirável',
      'Tamanhos disponíveis: S, M, L, XL, XXL',
      'Experimente e confirme o caimento no ato da entrega'
    ],
    tags: ['Samakaka', 'Moda Angolana', 'Cultura', 'Vestido']
  },
  {
    id: 'prod-cesta-basica-familiar',
    title: 'Super Cesta Básica Familiar Luanda (Fardo de Arroz 25kg + Óleo + Açúcar + Massa)',
    category: 'supermercado_frescos',
    price: 68000,
    originalPrice: 78000,
    discountPercent: 13,
    rating: 4.8,
    reviewCount: 94,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80',
    inStock: true,
    stockCount: 40,
    cashOnDelivery: true,
    expressDeliveryLuanda: true,
    affiliateCommissionPercent: 5, // 5% = 3.400 Kz
    seller: {
      id: 'admin-master',
      name: 'AngolaMarket 01 (Loja Oficial)',
      location: 'Mercado do Kikolo & São Paulo',
      rating: 5.0,
      salesCount: 1200,
      verified: true,
      phone: '+244 923 000 001'
    },
    condition: 'Novo',
    description: 'Kit completo de alimentação para a família angolana. Produtos de primeira qualidade selecionados para o seu lar. Entregamos até ao seu quintal em qualquer ponto de Luanda com pagamento só ao descarregar.',
    features: [
      '1 Fardo de Arroz Agulha 25kg (Puro)',
      '1 Caixa de Óleo Alimentar 12L',
      '1 Saco de Açúcar Moreno 10kg',
      '1 Caixa de Massa Esparguete 10kg',
      '1 Fardo de Leite em Pó 2.5kg'
    ],
    tags: ['Cesta Básica', 'Alimentação', 'Arroz', 'Fardo', 'Kikolo'],
    reviews: [
      {
        id: 'rev-6',
        userName: 'Dona Maria de Fátima',
        userCity: 'Golf 2, Kilamba Kiaxi',
        rating: 5,
        date: 'Hoje',
        comment: 'Chegou tudo impecável e os produtos são de marcas muito boas. Vale muito a pena poupar o trânsito do Kikolo.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'prod-tenis-nike-air-force-1',
    title: 'Ténis Nike Air Force 1 07 All White Original - Edição Especial',
    category: 'moda_calcado',
    price: 75000,
    originalPrice: 90000,
    discountPercent: 16,
    rating: 4.9,
    reviewCount: 52,
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80',
    inStock: true,
    stockCount: 15,
    cashOnDelivery: true,
    expressDeliveryLuanda: true,
    affiliateCommissionPercent: 12, // 12% = 9.000 Kz
    seller: {
      id: 'admin-master',
      name: 'AngolaMarket 01 (Loja Oficial)',
      location: 'Kilamba Shopping & Alvalade',
      rating: 5.0,
      salesCount: 310,
      verified: true,
      phone: '+244 923 000 001'
    },
    condition: 'Novo',
    description: 'Ténis clássico Nike Air Force 1 em couro legítimo branco. Amortecimento Nike Air e solado de borracha anti-derrapante. Experimente o número antes de efetuar o pagamento ao estafeta.',
    features: [
      'Material: 100% Pele genuína',
      'Tamanhos: 39 ao 45',
      'Caixa original com etiquetas',
      'Possibilidade de troca imediata de tamanho com o estafeta'
    ],
    tags: ['Nike', 'Air Force', 'Ténis', 'Calçado', 'Urban']
  },
  {
    id: 'prod-airfryer-philips-walita',
    title: 'Fritadeira Sem Óleo Air Fryer Digital 6.2L XXL com Visor Touch',
    category: 'eletrodomesticos_casa',
    price: 88000,
    originalPrice: 105000,
    discountPercent: 16,
    rating: 4.8,
    reviewCount: 43,
    image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&auto=format&fit=crop&q=80',
    inStock: true,
    stockCount: 9,
    cashOnDelivery: true,
    expressDeliveryLuanda: true,
    affiliateCommissionPercent: 10, // 10% = 8.800 Kz
    seller: {
      id: 'admin-master',
      name: 'AngolaMarket 01 (Loja Oficial)',
      location: 'Viana & Maianga, Luanda',
      rating: 5.0,
      salesCount: 520,
      verified: true,
      phone: '+244 923 000 001'
    },
    condition: 'Novo',
    description: 'Cozinhe frango, peixe grelhado, batata e mufete sem fumo e com até 90% menos óleo. Capacidade XXL para toda a família angolana.',
    features: [
      'Capacidade de 6.2 Litros',
      'Painel Digital Touch com 8 programas pré-definidos',
      'Potência 2000W super rápida',
      'Cesto antiaderente fácil de lavar'
    ],
    tags: ['Airfryer', 'Cozinha', 'Saúde', 'Eletrodomésticos']
  },
  {
    id: 'prod-jbl-partybox-110',
    title: 'Coluna de Som Portátil JBL PartyBox 110 160W com Luzes LED e Bateria',
    category: 'telemoveis_eletronicos',
    price: 310000,
    originalPrice: 350000,
    discountPercent: 11,
    rating: 5.0,
    reviewCount: 47,
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80',
    inStock: true,
    stockCount: 7,
    cashOnDelivery: true,
    expressDeliveryLuanda: true,
    affiliateCommissionPercent: 8, // 8% = 24.800 Kz
    seller: {
      id: 'admin-master',
      name: 'AngolaMarket 01 (Loja Oficial)',
      location: 'Talatona Mall & São Paulo, Luanda',
      rating: 5.0,
      salesCount: 384,
      verified: true,
      phone: '+244 923 000 001'
    },
    condition: 'Novo',
    description: 'A coluna perfeita para os churrascos e festas de fim de semana em Luanda! Graves potentes JBL Original Pro Sound, espetáculo de luzes sincronizadas e bateria para 12 horas.',
    features: [
      'Potência de Saída: 160 Watts RMS',
      'Bateria recarregável com 12h de autonomia',
      'Entradas para microfone e guitarra (Karaoke)',
      'Resistente a salpicos IPX4'
    ],
    tags: ['JBL', 'Som', 'Música', 'Festa', 'Bluetooth']
  },
  {
    id: 'prod-bateria-carro-varta-75ah',
    title: 'Bateria Automóvel Varta Blue Dynamic 75Ah 12V Selada Blindada',
    category: 'auto_pecas',
    price: 95000,
    originalPrice: 110000,
    discountPercent: 13,
    rating: 4.9,
    reviewCount: 38,
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&auto=format&fit=crop&q=80',
    inStock: true,
    stockCount: 11,
    cashOnDelivery: true,
    expressDeliveryLuanda: true,
    affiliateCommissionPercent: 10, // 10% = 9.500 Kz
    seller: {
      id: 'admin-master',
      name: 'AngolaMarket 01 (Loja Oficial)',
      location: 'Samba & Cazenga, Luanda',
      rating: 5.0,
      salesCount: 280,
      verified: true,
      phone: '+244 923 000 001'
    },
    condition: 'Novo',
    description: 'Bateria alemã de primeira linha para veículos ligeiros, SUVs e carrinhas (Toyota Fortuner, Hilux, Hyundai, Kia, Nissan). Entregamos onde o seu carro estiver avariado em Luanda com teste de alternador grátis!',
    features: [
      'Capacidade: 75 Ah / Corrente de arranque 680A',
      'Tecnologia de grelha PowerFrame patenteada',
      '100% Livre de manutenção',
      'Garantia de 12 meses com substituição imediata'
    ],
    tags: ['Bateria', 'Carro', 'Varta', 'Auto', 'Toyota', 'Mecânica']
  },
  {
    id: 'prod-fraldas-pampers-mega-box',
    title: 'Fardo Económico Fraldas Pampers Premium Care Tamanho 4 (160 Unidades)',
    category: 'bebes_brinquedos',
    price: 32000,
    originalPrice: 38000,
    discountPercent: 15,
    rating: 4.9,
    reviewCount: 76,
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&auto=format&fit=crop&q=80',
    inStock: true,
    stockCount: 25,
    cashOnDelivery: true,
    expressDeliveryLuanda: true,
    affiliateCommissionPercent: 5, // 5% = 1.600 Kz
    seller: {
      id: 'admin-master',
      name: 'AngolaMarket 01 (Loja Oficial)',
      location: 'Patriota & Kinaxixi, Luanda',
      rating: 5.0,
      salesCount: 640,
      verified: true,
      phone: '+244 923 000 001'
    },
    condition: 'Novo',
    description: 'Máxima proteção e suavidade para a pele do seu bebé até 12 horas seco. Pacote gigante super económico para os pais em Luanda.',
    features: [
      'Quantidade: 160 Fraldas',
      'Indicador de humidade que muda de cor',
      'Canais de ar respiráveis',
      'Hipoalergénico e dermatologicamente testado'
    ],
    tags: ['Fraldas', 'Bebé', 'Pampers', 'Cuidado', 'Economia']
  }
];

export const COURIER_COMMISSION_PER_DELIVERY_AOA = 1000;

export const INITIAL_PAYOUT_REQUESTS: PayoutRequest[] = [
  {
    id: 'payout-aff-1',
    type: 'afiliado',
    requesterId: 'user-affiliate-1',
    requesterName: 'Teresa Gonçalves (Afiliada Luanda)',
    requesterPhone: '+244 945 220 114',
    requesterRole: 'affiliate',
    affiliateCode: 'TERESA-01',
    amount: 35000,
    iban: 'AO06.0040.0000.5544.3322.1100.9',
    multicaixaExpressPhone: '+244 945 220 114',
    bankName: 'Banco BAI',
    notes: 'Solicitação de saque de comissões acumuladas de vendas de iPhone e Perucas.',
    status: 'pendente',
    requestedAt: Date.now() - 4 * 3600000
  },
  {
    id: 'payout-cour-1',
    type: 'entregador',
    requesterId: 'user-courier-1',
    requesterName: 'António Kapanda',
    requesterPhone: '+244 931 889 004',
    requesterRole: 'courier',
    amount: 25000,
    iban: 'AO06.0040.0000.9876.5432.1098.7',
    multicaixaExpressPhone: '+244 931 889 004',
    bankName: 'Banco BFA',
    notes: 'Saque de 25 entregas concluídas em Luanda (25 x 1.000 Kz).',
    status: 'pendente',
    requestedAt: Date.now() - 2 * 3600000
  },
  {
    id: 'payout-cour-2',
    type: 'entregador',
    requesterId: 'user-courier-3',
    requesterName: 'Domingos Ndala (Flash Luanda)',
    requesterPhone: '+244 923 774 210',
    requesterRole: 'courier',
    amount: 30000,
    iban: 'AO06.0040.0000.1122.3344.5566.7',
    multicaixaExpressPhone: '+244 923 774 210',
    bankName: 'Banco Millennium Atlântico',
    notes: 'Saque de 30 entregas concluídas.',
    status: 'pendente',
    requestedAt: Date.now() - 1 * 3600000
  },
  {
    id: 'payout-aff-2',
    type: 'afiliado',
    requesterId: 'user-affiliate-1',
    requesterName: 'Teresa Gonçalves (Afiliada Luanda)',
    requesterPhone: '+244 945 220 114',
    requesterRole: 'affiliate',
    affiliateCode: 'TERESA-01',
    amount: 51000,
    iban: 'AO06.0040.0000.5544.3322.1100.9',
    multicaixaExpressPhone: '+244 945 220 114',
    bankName: 'Banco BAI',
    notes: 'Comissões de divulgação do mês anterior.',
    status: 'pago',
    requestedAt: Date.now() - 7 * 86400000,
    paidAt: Date.now() - 6 * 86400000,
    paymentProofReference: 'TRANSF-BAI-994821',
    paidByAdminName: 'Paulino Armando (ADM)'
  }
];

export function formatKwanzas(value: number): string {
  return new Intl.NumberFormat('pt-AO', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value) + ' Kz';
}
