// Liste complète des destinations avec images Unsplash
export interface Destination {
  code: string
  city: string
  country: string
  continent: string
  imageUrl: string
  description: string
}

export const DESTINATIONS: Destination[] = [
  // Europe
  {
    code: 'LON',
    city: 'Londres',
    country: 'Royaume-Uni',
    continent: 'Europe',
    imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&auto=format&fit=crop',
    description: 'Big Ben, palais de Buckingham'
  },
  {
    code: 'ROM',
    city: 'Rome',
    country: 'Italie',
    continent: 'Europe',
    imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&auto=format&fit=crop',
    description: 'Colisée, Vatican, fontaine de Trevi'
  },
  {
    code: 'BCN',
    city: 'Barcelone',
    country: 'Espagne',
    continent: 'Europe',
    imageUrl: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&auto=format&fit=crop',
    description: 'Sagrada Familia, Park Güell'
  },
  {
    code: 'BER',
    city: 'Berlin',
    country: 'Allemagne',
    continent: 'Europe',
    imageUrl: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800&auto=format&fit=crop',
    description: 'Porte de Brandebourg, mur de Berlin'
  },
  {
    code: 'AMS',
    city: 'Amsterdam',
    country: 'Pays-Bas',
    continent: 'Europe',
    imageUrl: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800&auto=format&fit=crop',
    description: 'Canaux, musées, tulipes'
  },
  {
    code: 'LIS',
    city: 'Lisbonne',
    country: 'Portugal',
    continent: 'Europe',
    imageUrl: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&auto=format&fit=crop',
    description: 'Tramway, Belém, azulejos'
  },
  {
    code: 'PRG',
    city: 'Prague',
    country: 'République Tchèque',
    continent: 'Europe',
    imageUrl: 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=800&auto=format&fit=crop',
    description: 'Pont Charles, château'
  },
  {
    code: 'VIE',
    city: 'Vienne',
    country: 'Autriche',
    continent: 'Europe',
    imageUrl: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=800&auto=format&fit=crop',
    description: 'Palais impériaux, opéra'
  },
  {
    code: 'ATH',
    city: 'Athènes',
    country: 'Grèce',
    continent: 'Europe',
    imageUrl: 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=800&auto=format&fit=crop',
    description: 'Acropole, Parthénon'
  },
  {
    code: 'IST',
    city: 'Istanbul',
    country: 'Turquie',
    continent: 'Europe',
    imageUrl: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&auto=format&fit=crop',
    description: 'Mosquée bleue, Bosphore'
  },

  // Asie
  {
    code: 'TYO',
    city: 'Tokyo',
    country: 'Japon',
    continent: 'Asie',
    imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&auto=format&fit=crop',
    description: 'Temples, gratte-ciels, technologie'
  },
  {
    code: 'BKK',
    city: 'Bangkok',
    country: 'Thaïlande',
    continent: 'Asie',
    imageUrl: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&auto=format&fit=crop',
    description: 'Temples dorés, marchés flottants'
  },
  {
    code: 'SIN',
    city: 'Singapour',
    country: 'Singapour',
    continent: 'Asie',
    imageUrl: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&auto=format&fit=crop',
    description: 'Marina Bay, jardins futuristes'
  },
  {
    code: 'HKG',
    city: 'Hong Kong',
    country: 'Chine',
    continent: 'Asie',
    imageUrl: 'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=800&auto=format&fit=crop',
    description: 'Gratte-ciels, Victoria Peak'
  },
  {
    code: 'DXB',
    city: 'Dubaï',
    country: 'Émirats Arabes Unis',
    continent: 'Asie',
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&auto=format&fit=crop',
    description: 'Burj Khalifa, luxe, désert'
  },
  {
    code: 'DEL',
    city: 'New Delhi',
    country: 'Inde',
    continent: 'Asie',
    imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&auto=format&fit=crop',
    description: 'Taj Mahal, palais, temples'
  },
  {
    code: 'SEL',
    city: 'Séoul',
    country: 'Corée du Sud',
    continent: 'Asie',
    imageUrl: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800&auto=format&fit=crop',
    description: 'Palais, K-pop, technologie'
  },
  {
    code: 'BEJ',
    city: 'Pékin',
    country: 'Chine',
    continent: 'Asie',
    imageUrl: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&auto=format&fit=crop',
    description: 'Grande Muraille, Cité interdite'
  },
  {
    code: 'BAL',
    city: 'Bali',
    country: 'Indonésie',
    continent: 'Asie',
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop',
    description: 'Plages, temples, rizières'
  },

  // Amériques
  {
    code: 'NYC',
    city: 'New York',
    country: 'États-Unis',
    continent: 'Amérique du Nord',
    imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&auto=format&fit=crop',
    description: 'Statue de la Liberté, Times Square'
  },
  {
    code: 'LAX',
    city: 'Los Angeles',
    country: 'États-Unis',
    continent: 'Amérique du Nord',
    imageUrl: 'https://images.unsplash.com/photo-1534190239940-9ba8944ea261?w=800&auto=format&fit=crop',
    description: 'Hollywood, plages, célébrités'
  },
  {
    code: 'MIA',
    city: 'Miami',
    country: 'États-Unis',
    continent: 'Amérique du Nord',
    imageUrl: 'https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?w=800&auto=format&fit=crop',
    description: 'Plages, Art Déco, vie nocturne'
  },
  {
    code: 'MEX',
    city: 'Mexico',
    country: 'Mexique',
    continent: 'Amérique du Nord',
    imageUrl: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?w=800&auto=format&fit=crop',
    description: 'Pyramides aztèques, tacos, culture'
  },
  {
    code: 'RIO',
    city: 'Rio de Janeiro',
    country: 'Brésil',
    continent: 'Amérique du Sud',
    imageUrl: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&auto=format&fit=crop',
    description: 'Christ Rédempteur, Copacabana, carnaval'
  },
  {
    code: 'BUE',
    city: 'Buenos Aires',
    country: 'Argentine',
    continent: 'Amérique du Sud',
    imageUrl: 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=800&auto=format&fit=crop',
    description: 'Tango, steak, architecture européenne'
  },
  {
    code: 'CAN',
    city: 'Cancún',
    country: 'Mexique',
    continent: 'Amérique du Nord',
    imageUrl: 'https://images.unsplash.com/photo-1568402102990-bc541580b59f?w=800&auto=format&fit=crop',
    description: 'Plages paradisiaques, Mayas, fêtes'
  },

  // Afrique
  {
    code: 'MAR',
    city: 'Marrakech',
    country: 'Maroc',
    continent: 'Afrique',
    imageUrl: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=800&auto=format&fit=crop',
    description: 'Souks, Jemaa el-Fna, palais'
  },
  {
    code: 'CAI',
    city: 'Le Caire',
    country: 'Égypte',
    continent: 'Afrique',
    imageUrl: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=800&auto=format&fit=crop',
    description: 'Pyramides de Gizeh, Sphinx, Nil'
  },
  {
    code: 'CPT',
    city: 'Le Cap',
    country: 'Afrique du Sud',
    continent: 'Afrique',
    imageUrl: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&auto=format&fit=crop',
    description: 'Table Mountain, plages, vignobles'
  },
  {
    code: 'TUN',
    city: 'Tunis',
    country: 'Tunisie',
    continent: 'Afrique',
    imageUrl: 'https://images.unsplash.com/photo-1565011523534-747a8c6e0f9d?w=800&auto=format&fit=crop',
    description: 'Médina, Carthage, plages'
  },

  // Océanie
  {
    code: 'SYD',
    city: 'Sydney',
    country: 'Australie',
    continent: 'Océanie',
    imageUrl: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&auto=format&fit=crop',
    description: 'Opéra, Harbour Bridge, plages'
  },
  {
    code: 'AKL',
    city: 'Auckland',
    country: 'Nouvelle-Zélande',
    continent: 'Océanie',
    imageUrl: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=800&auto=format&fit=crop',
    description: 'Volcans, nature, Seigneur des Anneaux'
  },
  {
    code: 'PPT',
    city: 'Tahiti',
    country: 'Polynésie Française',
    continent: 'Océanie',
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&auto=format&fit=crop',
    description: 'Paradis tropical, lagons, bungalows'
  },

  // Autres destinations populaires
  {
    code: 'MLD',
    city: 'Maldives',
    country: 'Maldives',
    continent: 'Asie',
    imageUrl: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&auto=format&fit=crop',
    description: 'Atolls paradisiaques, plongée, luxe'
  },
  {
    code: 'SEY',
    city: 'Seychelles',
    country: 'Seychelles',
    continent: 'Afrique',
    imageUrl: 'https://images.unsplash.com/photo-1589197331516-6c79f44e107f?w=800&auto=format&fit=crop',
    description: 'Plages de rêve, nature préservée'
  },
  {
    code: 'SAN',
    city: 'Santorin',
    country: 'Grèce',
    continent: 'Europe',
    imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&auto=format&fit=crop',
    description: 'Maisons blanches, couchers de soleil'
  },
  {
    code: 'PRA',
    city: 'Phuket',
    country: 'Thaïlande',
    continent: 'Asie',
    imageUrl: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=800&auto=format&fit=crop',
    description: 'Plages, fêtes, temples'
  },
  {
    code: 'VEN',
    city: 'Venise',
    country: 'Italie',
    continent: 'Europe',
    imageUrl: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&auto=format&fit=crop',
    description: 'Canaux, gondoles, romantisme'
  },
  {
    code: 'DUB',
    city: 'Dublin',
    country: 'Irlande',
    continent: 'Europe',
    imageUrl: 'https://images.unsplash.com/photo-1549918864-48ac978761a4?w=800&auto=format&fit=crop',
    description: 'Pubs, Guinness, culture celte'
  },
  {
    code: 'EDI',
    city: 'Édimbourg',
    country: 'Écosse',
    continent: 'Europe',
    imageUrl: 'https://images.unsplash.com/photo-1555298916-fd47c537c67c?w=800&auto=format&fit=crop',
    description: 'Château, highlands, whisky'
  },
  {
    code: 'REY',
    city: 'Reykjavik',
    country: 'Islande',
    continent: 'Europe',
    imageUrl: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800&auto=format&fit=crop',
    description: 'Aurores boréales, sources chaudes'
  }
]

// Fonction de recherche
export function searchDestinations(query: string): Destination[] {
  if (!query || query.trim().length < 2) {
    return DESTINATIONS
  }

  const searchTerm = query.toLowerCase().trim()

  return DESTINATIONS.filter(dest =>
    dest.city.toLowerCase().includes(searchTerm) ||
    dest.country.toLowerCase().includes(searchTerm) ||
    dest.continent.toLowerCase().includes(searchTerm) ||
    dest.description.toLowerCase().includes(searchTerm)
  )
}

// Grouper par continent
export function groupByContinent(destinations: Destination[]) {
  return destinations.reduce((acc, dest) => {
    if (!acc[dest.continent]) {
      acc[dest.continent] = []
    }
    acc[dest.continent].push(dest)
    return acc
  }, {} as Record<string, Destination[]>)
}
