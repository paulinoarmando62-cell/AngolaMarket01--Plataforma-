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
    iban: 'AO06.0040.0000.9382.4390.9012.3',
    multicaixaExpressPhone: '+244 938 243 909',
    bankName: 'Banco BAI'
  }
];

// Zonas reais de Luanda com taxas de entrega autênticas
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

// Produtos reais e autênticos do mercado de Luanda
export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'real-prod-iphone-15-pro-max',
    title: 'Apple iPhone 15 Pro Max 256GB Titânio Natural',
    category: 'telemoveis_eletronicos',
    price: 1250000,
    originalPrice: 1350000,
    discountPercent: 7,
    rating: 4.9,
    reviewCount: 42,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80'
    ],
    inStock: true,
    stockCount: 14,
    cashOnDelivery: true,
    expressDeliveryLuanda: true,
    affiliateCommissionPercent: 5,
    seller: {
      id: 'seller-angolamarket-oficial',
      name: 'AngolaMarket Oficial',
      location: 'Talatona, Luanda',
      rating: 4.9,
      salesCount: 128,
      verified: true,
      phone: '+244 938 243 909'
    },
    condition: 'Novo',
    description: 'Apple iPhone 15 Pro Max original, 256GB de armazenamento em Titânio Natural. Equipado com o chip A17 Pro de alto rendimento, câmara tripla profissional de 48MP com zoom ótico 5x e conector USB-C. Aparelho novo na caixa selada com 1 ano de garantia. Verifique no ato da entrega em Luanda antes de efetuar o pagamento.',
    features: [
      'Chip A17 Pro com GPU de 6 núcleos',
      'Ecrã Super Retina XDR OLED de 6.7" ProMotion 120Hz',
      'Câmara Principal de 48 MP + Teleobjetiva 5x + Ultra Grande-Angular',
      'Estrutura em Titânio Aeroespacial leve e resistente',
      'Garantia oficial de 1 ano com suporte em Luanda'
    ],
    tags: ['iPhone', 'Apple', 'Smartphone', 'iOS', 'Titânio', 'Luanda Express']
  },
  {
    id: 'real-prod-samsung-s24-ultra',
    title: 'Samsung Galaxy S24 Ultra 512GB Titânio Cinzento com S-Pen',
    category: 'telemoveis_eletronicos',
    price: 1180000,
    originalPrice: 1280000,
    discountPercent: 8,
    rating: 4.9,
    reviewCount: 38,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80'
    ],
    inStock: true,
    stockCount: 10,
    cashOnDelivery: true,
    expressDeliveryLuanda: true,
    affiliateCommissionPercent: 5,
    seller: {
      id: 'seller-angolamarket-oficial',
      name: 'AngolaMarket Oficial',
      location: 'Talatona, Luanda',
      rating: 4.9,
      salesCount: 95,
      verified: true,
      phone: '+244 938 243 909'
    },
    condition: 'Novo',
    description: 'Samsung Galaxy S24 Ultra 512GB com Galaxy AI integrada, estrutura em titânio e câmara quádrupla de 200MP. Inclui a caneta S-Pen integrada para anotações e produtividade. Aparelho novo na caixa selada com garantia.',
    features: [
      'Processador Snapdragon 8 Gen 3 for Galaxy',
      'Ecrã Dynamic AMOLED 2X de 6.8" Quad HD+ 120Hz',
      'Câmara de 200MP com gravação 8K e Nightography AI',
      'S-Pen integrada com funções remotas',
      'Bateria de 5000 mAh com carregamento ultra-rápido'
    ],
    tags: ['Samsung', 'Galaxy S24 Ultra', 'Android', 'Smartphone', '512GB']
  },
  {
    id: 'real-prod-lutian-gerador-65kva',
    title: 'Gerador a Gasolina Lutian 6.5kVA LT6500EB com Arranque Elétrico',
    category: 'eletrodomesticos_casa',
    price: 385000,
    originalPrice: 420000,
    discountPercent: 8,
    rating: 4.8,
    reviewCount: 56,
    image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80'
    ],
    inStock: true,
    stockCount: 18,
    cashOnDelivery: true,
    expressDeliveryLuanda: true,
    affiliateCommissionPercent: 6,
    seller: {
      id: 'seller-angolamarket-oficial',
      name: 'AngolaMarket Oficial',
      location: 'Viana, Luanda',
      rating: 4.9,
      salesCount: 210,
      verified: true,
      phone: '+244 938 243 909'
    },
    condition: 'Novo',
    description: 'Gerador elétrico Lutian 6.5 kVA modelo LT6500EB com chave de arranque elétrico, enrolamento 100% cobre e regulador automático de voltagem (AVR). Ideal para manter em funcionamento ar condicionado, geleira, iluminação e equipamentos residenciais ou comerciais em Luanda.',
    features: [
      'Potência nominal: 6.0 kVA / Potência máxima: 6.5 kVA',
      'Enrolamento do motor em cobre de alta condutividade',
      'Arranque por chave elétrica e puxador manual de emergência',
      'Tanque de combustível de 25 Litros com autonomia de 10 a 12 horas',
      'Rodas e pega de transporte reforçadas incluídas'
    ],
    tags: ['Gerador', 'Lutian', 'Energia', 'Casa', '6.5kVA', 'Eletricidade']
  },
  {
    id: 'real-prod-ar-condicionado-beko-12000',
    title: 'Ar Condicionado Split Beko 12.000 BTUs Inverter Gás R410A',
    category: 'eletrodomesticos_casa',
    price: 265000,
    originalPrice: 295000,
    discountPercent: 10,
    rating: 4.7,
    reviewCount: 29,
    image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&auto=format&fit=crop&q=80'
    ],
    inStock: true,
    stockCount: 12,
    cashOnDelivery: true,
    expressDeliveryLuanda: true,
    affiliateCommissionPercent: 5,
    seller: {
      id: 'seller-angolamarket-oficial',
      name: 'AngolaMarket Oficial',
      location: 'Talatona, Luanda',
      rating: 4.9,
      salesCount: 84,
      verified: true,
      phone: '+244 938 243 909'
    },
    condition: 'Novo',
    description: 'Ar condicionado Split mural Beko de 12.000 BTUs com tecnologia ProSmart Inverter de alta eficiência energética, baixo consumo elétrico e operação ultra silenciosa. Acompanha comando à distância com ecrã LCD e kit de instalação.',
    features: [
      'Capacidade de refrigeração: 12.000 BTUs / h',
      'Compressor Inverter com economia de até 60% de energia',
      'Filtro de ar de alta densidade lavável antibacteriano',
      'Gás ecológico R410A amigo do ambiente',
      'Modo Turbo de refrigeração rápida para o clima de Luanda'
    ],
    tags: ['Ar Condicionado', 'Beko', 'Inverter', '12000 BTU', 'Casa']
  },
  {
    id: 'real-prod-samakaka-tradicional-6jardas',
    title: 'Pano Tradicional Samakaka Autêntico (Peça 6 Jardas 100% Algodão)',
    category: 'moda_calcado',
    price: 18500,
    originalPrice: 22000,
    discountPercent: 16,
    rating: 5.0,
    reviewCount: 64,
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=800&auto=format&fit=crop&q=80'
    ],
    inStock: true,
    stockCount: 45,
    cashOnDelivery: true,
    expressDeliveryLuanda: true,
    affiliateCommissionPercent: 10,
    seller: {
      id: 'seller-angolamarket-oficial',
      name: 'AngolaMarket Oficial',
      location: 'Maianga, Luanda',
      rating: 4.9,
      salesCount: 312,
      verified: true,
      phone: '+244 938 243 909'
    },
    condition: 'Novo',
    description: 'Pano Samakaka original com estampagem viva e geométrica tradicional angolana. Tecido 100% algodão de qualidade premium, toque macio e cores resistentes à lavagem. Peça com 6 jardas (aproximadamente 5.48 metros), perfeita para confecção de vestidos, fatos, camisas e acessórios de gala ou uso casual.',
    features: [
      'Comprimento: 6 Jardas (aprox. 5.5 metros) x 1.2 metros de largura',
      'Composição: 100% Algodão encorpado',
      'Cores tradicionais de Angola: Vermelho, Amarelo, Preto e Branco',
      'Estamparia autêntica frente e verso sem desbotamento',
      'Ideal para alfaiataria e alta-costura africana'
    ],
    tags: ['Samakaka', 'Angola', 'Moda Africana', 'Tecido', 'Algodão', 'Tradição']
  },
  {
    id: 'real-prod-nike-air-force-1',
    title: 'Ténis Nike Air Force 1 07 Branco Original Masculino e Feminino',
    category: 'moda_calcado',
    price: 65000,
    originalPrice: 75000,
    discountPercent: 13,
    rating: 4.9,
    reviewCount: 48,
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80'
    ],
    inStock: true,
    stockCount: 22,
    cashOnDelivery: true,
    expressDeliveryLuanda: true,
    affiliateCommissionPercent: 8,
    seller: {
      id: 'seller-angolamarket-oficial',
      name: 'AngolaMarket Oficial',
      location: 'Ingombota, Luanda',
      rating: 4.9,
      salesCount: 160,
      verified: true,
      phone: '+244 938 243 909'
    },
    condition: 'Novo',
    description: 'Ténis Nike Air Force 1 07 na cor branca clássica original na caixa. Fabricado em couro genuíno durável, com amortecimento Nike Air encapsulado para conforto durante todo o dia. Tamanhos disponíveis do 38 ao 44.',
    features: [
      'Couro genuíno com costuras reforçadas',
      'Amortecimento Nike Air na sola para absorção de impacto',
      'Sola de borracha com círculos de rotação para aderência superior',
      'Design icónico atemporal para qualquer ocasião',
      'Tamanhos disponíveis: 38, 39, 40, 41, 42, 43, 44'
    ],
    tags: ['Nike', 'Air Force 1', 'Calçado', 'Ténis', 'Moda', 'Branco']
  },
  {
    id: 'real-prod-cesta-basica-familiar-luanda',
    title: 'Cesta Básica Familiar Luanda Completa (Arroz 25kg, Açúcar, Óleo, Feijão e Massas)',
    category: 'supermercado_frescos',
    price: 58000,
    originalPrice: 65000,
    discountPercent: 11,
    rating: 5.0,
    reviewCount: 88,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80'
    ],
    inStock: true,
    stockCount: 50,
    cashOnDelivery: true,
    expressDeliveryLuanda: true,
    affiliateCommissionPercent: 5,
    seller: {
      id: 'seller-angolamarket-oficial',
      name: 'AngolaMarket Oficial',
      location: 'Viana, Luanda',
      rating: 4.9,
      salesCount: 420,
      verified: true,
      phone: '+244 938 243 909'
    },
    condition: 'Novo',
    description: 'Cesta básica familiar com produtos alimentares de marcas conceituadas no mercado angolano. Entregue diretamente na sua morada com todo o conforto, evitando filas e deslocações aos armazéns.',
    features: [
      '1x Saco de Arroz Agulha Chaimite ou Cigala de 25 kg',
      '1x Garrafão de Óleo Alimentar de 5 Litros',
      '1x Saco de Açúcar Branco de 5 kg',
      '1x Saco de Feijão Manteiga Nacional de 5 kg',
      '1x Saco de Fuba de Milho ou Bombó de 5 kg',
      '5x Pacotes de Massa Esparguete 500g e 2x Latas de Tomate Pelado'
    ],
    tags: ['Cesta Básica', 'Alimentação', 'Supermercado', 'Arroz 25kg', 'Óleo', 'Luanda']
  },
  {
    id: 'real-prod-perfume-sauvage-100ml',
    title: 'Perfume Masculino Dior Sauvage Eau de Parfum 100ml Original',
    category: 'beleza_cosmeticos',
    price: 145000,
    originalPrice: 160000,
    discountPercent: 9,
    rating: 4.9,
    reviewCount: 35,
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&auto=format&fit=crop&q=80'
    ],
    inStock: true,
    stockCount: 16,
    cashOnDelivery: true,
    expressDeliveryLuanda: true,
    affiliateCommissionPercent: 7,
    seller: {
      id: 'seller-angolamarket-oficial',
      name: 'AngolaMarket Oficial',
      location: 'Talatona, Luanda',
      rating: 4.9,
      salesCount: 110,
      verified: true,
      phone: '+244 938 243 909'
    },
    condition: 'Novo',
    description: 'Dior Sauvage Eau de Parfum de 100ml para homem, 100% original com selo de autenticidade e caixa lacrada. Fragrância amadeirada e fresca com notas de Bergamota da Calábria, Pimenta de Sichuan e Absoluto de Baunilha da Papuásia.',
    features: [
      'Concentração: Eau de Parfum (EDP) com alta fixação de 12+ horas',
      'Família olfativa: Aromático Fougère Amadeirado',
      'Frasco recarregável de 100ml com tampa magnética de precisão',
      'Produto selado e autenticado'
    ],
    tags: ['Perfume', 'Dior', 'Sauvage', 'Beleza', 'Cosméticos', 'Fragrância']
  },
  {
    id: 'real-prod-oleo-total-quartz-9000',
    title: 'Óleo de Motor Sintético TotalEnergies Quartz 9000 5W-40 (Galão 5L)',
    category: 'auto_pecas',
    price: 34000,
    originalPrice: 38000,
    discountPercent: 11,
    rating: 4.9,
    reviewCount: 41,
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&auto=format&fit=crop&q=80'
    ],
    inStock: true,
    stockCount: 30,
    cashOnDelivery: true,
    expressDeliveryLuanda: true,
    affiliateCommissionPercent: 8,
    seller: {
      id: 'seller-angolamarket-oficial',
      name: 'AngolaMarket Oficial',
      location: 'Viana, Luanda',
      rating: 4.9,
      salesCount: 175,
      verified: true,
      phone: '+244 938 243 909'
    },
    condition: 'Novo',
    description: 'Óleo lubrificante 100% sintético Total Quartz 9000 5W40 em embalagem de 5 Litros. Protege o motor contra desgaste, depósitos e altas temperaturas típicas do trânsito de Luanda. Adequado para motores a gasolina e a gasóleo.',
    features: [
      'Viscosidade: SAE 5W-40 100% Sintético',
      'Capacidade da embalagem: Galão de 5 Litros lacrado',
      'Normas: API SP / CF, ACEA A3/B4, MB 229.5, VW 502.00 / 505.00',
      'Excelente fluidez no arranque a frio e proteção térmica a quente'
    ],
    tags: ['Óleo de Motor', 'TotalEnergies', 'Auto', 'Lubrificante', '5W40', 'Manutenção']
  },
  {
    id: 'real-prod-fraldas-pampers-pants-jumbo',
    title: 'Fraldas Descartáveis Pampers Pants Tamanho 4 (Pacote Jumbo 104 Unidades)',
    category: 'bebes_brinquedos',
    price: 32000,
    originalPrice: 36000,
    discountPercent: 11,
    rating: 4.8,
    reviewCount: 52,
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&auto=format&fit=crop&q=80'
    ],
    inStock: true,
    stockCount: 28,
    cashOnDelivery: true,
    expressDeliveryLuanda: true,
    affiliateCommissionPercent: 6,
    seller: {
      id: 'seller-angolamarket-oficial',
      name: 'AngolaMarket Oficial',
      location: 'Talatona, Luanda',
      rating: 4.9,
      salesCount: 230,
      verified: true,
      phone: '+244 938 243 909'
    },
    condition: 'Novo',
    description: 'Fraldas formato cuequinha Pampers Pants tamanho 4 (indicado para bebés de 9 a 15 kg). Cintura elástica 360 graus que se ajusta ao corpinho do bebé e canais de ar ultra absorventes que mantêm a pele seca até 12 horas de sono.',
    features: [
      'Tamanho 4 (para bebés de 9 kg a 15 kg)',
      'Quantidade: 104 fraldas descartáveis por embalagem Jumbo',
      'Cintura anatómica fácil de vestir e rasgar nas laterais para descarte',
      'Proteção e absorção reforçada anti-vazamentos até 12 horas'
    ],
    tags: ['Fraldas', 'Pampers', 'Bebé', 'Puericultura', 'Crianças', 'Higiene']
  }
];

export const COURIER_COMMISSION_PER_DELIVERY_AOA = 1000;

export const INITIAL_PAYOUT_REQUESTS: PayoutRequest[] = [];

export function formatKwanzas(value: number): string {
  return new Intl.NumberFormat('pt-AO', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value) + ' Kz';
}
