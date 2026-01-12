// Système de recherche universel de destinations
// Combine recherche locale + API Kiwi.com pour couvrir TOUTES les destinations

import { searchAirports, AIRPORTS, type Airport } from './airports'
import { searchKiwiLocations, convertKiwiToLocation } from './kiwi-api'

export interface Location {
  type: 'airport' | 'city' | 'region' | 'country'
  code?: string // IATA code si aéroport
  name: string
  displayName: string
  city: string
  country: string
  continent?: string
  coordinates?: {
    lat: number
    lng: number
  }
  airportName?: string
  relevance: number // Score de pertinence 0-100
}

/**
 * Recherche universelle de destinations
 * Combine recherche locale dans notre DB d'aéroports + API Kiwi.com + suggestions intelligentes
 */
export async function searchDestinations(query: string, limit: number = 20): Promise<Location[]> {
  if (!query || query.trim().length < 2) {
    return []
  }

  const searchTerm = query.toLowerCase().trim()
  const results: Location[] = []

  // 1. Recherche dans notre base d'aéroports (prioritaire)
  const airportResults = searchAirports(searchTerm, limit)

  for (const airport of airportResults) {
    results.push({
      type: 'airport',
      code: airport.code,
      name: airport.name,
      displayName: `${airport.city} (${airport.code})`,
      city: airport.city,
      country: airport.country,
      continent: airport.continent,
      coordinates: airport.coordinates,
      airportName: airport.name,
      relevance: calculateRelevance(airport, searchTerm)
    })
  }

  // 2. Recherche via API Kiwi.com (si pas assez de résultats locaux)
  if (results.length < 10) {
    try {
      const kiwiResults = await searchKiwiLocations(query, 10)
      const convertedResults = kiwiResults.map(convertKiwiToLocation)
      results.push(...convertedResults)
    } catch (error) {
      console.error('Kiwi API search failed, using local results only:', error)
    }
  }

  // 3. Recherche étendue par pays (si pas assez de résultats)
  if (results.length < 5) {
    const countryResults = searchByCountry(searchTerm)
    results.push(...countryResults)
  }

  // 4. Suggestions de villes connues (fallback)
  if (results.length < 3) {
    const citySuggestions = getFallbackCitySuggestions(searchTerm)
    results.push(...citySuggestions)
  }

  // Trier par pertinence et dédupliquer
  const uniqueResults = deduplicateResults(results)
  return uniqueResults
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, limit)
}

/**
 * Calcule un score de pertinence pour un résultat
 */
function calculateRelevance(airport: Airport, searchTerm: string): number {
  const term = searchTerm.toLowerCase()
  const code = airport.code.toLowerCase()
  const city = airport.city.toLowerCase()
  const country = airport.country.toLowerCase()
  const name = airport.name.toLowerCase()

  // Code IATA exact = 100 points
  if (code === term) return 100

  // Début de ville = 90 points
  if (city.startsWith(term)) return 90

  // Début de pays = 80 points
  if (country.startsWith(term)) return 80

  // Ville contient = 70 points
  if (city.includes(term)) return 70

  // Pays contient = 60 points
  if (country.includes(term)) return 60

  // Nom d'aéroport contient = 50 points
  if (name.includes(term)) return 50

  // Par défaut
  return 40
}

/**
 * Recherche par pays pour trouver tous les aéroports d'un pays
 */
function searchByCountry(searchTerm: string): Location[] {
  const results: Location[] = []
  const countriesMap = new Map<string, Airport[]>()

  // Grouper les aéroports par pays
  for (const airport of AIRPORTS) {
    const countryLower = airport.country.toLowerCase()
    if (countryLower.includes(searchTerm)) {
      if (!countriesMap.has(airport.country)) {
        countriesMap.set(airport.country, [])
      }
      countriesMap.get(airport.country)!.push(airport)
    }
  }

  // Convertir en résultats
  countriesMap.forEach((airports, country) => {
    // Prendre les 3 plus grands aéroports du pays
    airports.slice(0, 3).forEach(airport => {
      results.push({
        type: 'airport',
        code: airport.code,
        name: airport.name,
        displayName: `${airport.city} (${airport.code})`,
        city: airport.city,
        country: airport.country,
        continent: airport.continent,
        coordinates: airport.coordinates,
        airportName: airport.name,
        relevance: 55
      })
    })
  })

  return results
}

/**
 * Suggestions de villes connues (fallback quand aucun résultat)
 * Couvre les destinations majeures qui pourraient manquer
 */
function getFallbackCitySuggestions(searchTerm: string): Location[] {
  const suggestions: Array<{
    keywords: string[]
    city: string
    country: string
    code: string
    continent: string
  }> = [
    // Destinations populaires qui pourraient manquer
    { keywords: ['bali', 'denpasar'], city: 'Denpasar', country: 'Indonésie', code: 'DPS', continent: 'Asie' },
    { keywords: ['maldives', 'male'], city: 'Malé', country: 'Maldives', code: 'MLE', continent: 'Asie' },
    { keywords: ['tahiti', 'papeete'], city: 'Papeete', country: 'Polynésie Française', code: 'PPT', continent: 'Océanie' },
    { keywords: ['martinique', 'fort-de-france'], city: 'Fort-de-France', country: 'Martinique', code: 'FDF', continent: 'Amérique' },
    { keywords: ['guadeloupe', 'pointe-a-pitre'], city: 'Pointe-à-Pitre', country: 'Guadeloupe', code: 'PTP', continent: 'Amérique' },
    { keywords: ['reunion', 'saint-denis'], city: 'Saint-Denis', country: 'La Réunion', code: 'RUN', continent: 'Afrique' },
    { keywords: ['maurice', 'mauritius'], city: 'Port Louis', country: 'Maurice', code: 'MRU', continent: 'Afrique' },
    { keywords: ['seychelles'], city: 'Victoria', country: 'Seychelles', code: 'SEZ', continent: 'Afrique' },
    { keywords: ['zanzibar'], city: 'Zanzibar', country: 'Tanzanie', code: 'ZNZ', continent: 'Afrique' },
    { keywords: ['bora bora'], city: 'Bora Bora', country: 'Polynésie Française', code: 'BOB', continent: 'Océanie' },
  ]

  const results: Location[] = []
  const term = searchTerm.toLowerCase()

  for (const suggestion of suggestions) {
    // Si un des mots-clés matche
    if (suggestion.keywords.some(keyword =>
      keyword.includes(term) || term.includes(keyword)
    )) {
      results.push({
        type: 'city',
        code: suggestion.code,
        name: suggestion.city,
        displayName: `${suggestion.city} (${suggestion.code})`,
        city: suggestion.city,
        country: suggestion.country,
        continent: suggestion.continent,
        relevance: 65
      })
    }
  }

  return results
}

/**
 * Déduplique les résultats (même ville/code)
 */
function deduplicateResults(results: Location[]): Location[] {
  const seen = new Set<string>()
  const unique: Location[] = []

  for (const result of results) {
    const key = result.code || `${result.city}-${result.country}`
    if (!seen.has(key)) {
      seen.add(key)
      unique.push(result)
    }
  }

  return unique
}

/**
 * Obtenir les détails d'une destination par code
 */
export function getLocationByCode(code: string): Location | null {
  const airport = AIRPORTS.find(a => a.code === code)
  if (!airport) return null

  return {
    type: 'airport',
    code: airport.code,
    name: airport.name,
    displayName: `${airport.city} (${airport.code})`,
    city: airport.city,
    country: airport.country,
    continent: airport.continent,
    coordinates: airport.coordinates,
    airportName: airport.name,
    relevance: 100
  }
}

/**
 * Suggestions de destinations populaires (pour affichage initial)
 */
export function getPopularDestinations(limit: number = 12): Location[] {
  const popularCodes = [
    'CDG', // Paris
    'LHR', // Londres
    'BCN', // Barcelone
    'FCO', // Rome
    'AMS', // Amsterdam
    'DXB', // Dubaï
    'JFK', // New York
    'BKK', // Bangkok
    'NRT', // Tokyo
    'SIN', // Singapour
    'LAX', // Los Angeles
    'MIA', // Miami
  ]

  return popularCodes
    .slice(0, limit)
    .map(code => getLocationByCode(code))
    .filter(loc => loc !== null) as Location[]
}
