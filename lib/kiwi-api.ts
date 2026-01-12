// Kiwi.com API Integration
// Documentation: https://docs.kiwi.com/

export interface KiwiLocation {
  id: string
  name: string
  code: string // IATA code
  type: 'airport' | 'city' | 'country'
  city?: {
    name: string
    code: string
  }
  country?: {
    name: string
    code: string
  }
  region?: {
    name: string
  }
  location?: {
    lat: number
    lon: number
  }
}

export interface KiwiSearchResult {
  locations: KiwiLocation[]
  meta?: {
    count: number
  }
}

/**
 * Recherche de destinations via l'API Kiwi.com
 * API gratuite: 100 requêtes/jour
 */
export async function searchKiwiLocations(query: string, limit: number = 20): Promise<KiwiLocation[]> {
  try {
    const apiKey = process.env.KIWI_API_KEY || ''

    // Si pas de clé API, retourner un tableau vide (fallback sur recherche locale)
    if (!apiKey || apiKey === 'your_kiwi_api_key') {
      console.log('Kiwi API key not configured, using local search only')
      return []
    }

    const url = new URL('https://api.tequila.kiwi.com/locations/query')
    url.searchParams.append('term', query)
    url.searchParams.append('locale', 'fr-FR')
    url.searchParams.append('limit', limit.toString())
    url.searchParams.append('location_types', 'airport')
    url.searchParams.append('active_only', 'true')

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'apikey': apiKey,
        'Accept': 'application/json',
      },
      // Cache pendant 1 heure pour économiser les requêtes
      next: { revalidate: 3600 }
    })

    if (!response.ok) {
      console.error('Kiwi API error:', response.status, response.statusText)
      return []
    }

    const data: KiwiSearchResult = await response.json()
    return data.locations || []
  } catch (error) {
    console.error('Error fetching Kiwi locations:', error)
    return []
  }
}

/**
 * Convertit une location Kiwi en format Location de notre app
 */
export function convertKiwiToLocation(kiwiLoc: KiwiLocation) {
  return {
    type: kiwiLoc.type as 'airport' | 'city' | 'country',
    code: kiwiLoc.code,
    name: kiwiLoc.name,
    displayName: `${kiwiLoc.city?.name || kiwiLoc.name} (${kiwiLoc.code})`,
    city: kiwiLoc.city?.name || kiwiLoc.name,
    country: kiwiLoc.country?.name || '',
    continent: kiwiLoc.region?.name,
    coordinates: kiwiLoc.location ? {
      lat: kiwiLoc.location.lat,
      lng: kiwiLoc.location.lon
    } : undefined,
    airportName: kiwiLoc.name,
    relevance: 85 // Score de pertinence élevé pour résultats API
  }
}

/**
 * Recherche de vols via l'API Kiwi.com
 * Utile pour vérifier si des vols existent pour une destination
 */
export interface FlightSearchParams {
  from: string // IATA code
  to: string // IATA code
  dateFrom?: string // YYYY-MM-DD
  dateTo?: string // YYYY-MM-DD
  adults?: number
  limit?: number
}

export interface KiwiFlightResult {
  data: Array<{
    id: string
    price: number
    deep_link: string
    route: Array<{
      flyFrom: string
      flyTo: string
      cityFrom: string
      cityTo: string
    }>
  }>
}

/**
 * Recherche de vols disponibles (pour validation future)
 */
export async function searchKiwiFlights(params: FlightSearchParams): Promise<KiwiFlightResult | null> {
  try {
    const apiKey = process.env.KIWI_API_KEY || ''

    if (!apiKey || apiKey === 'your_kiwi_api_key') {
      console.log('Kiwi API key not configured')
      return null
    }

    const url = new URL('https://api.tequila.kiwi.com/v2/search')
    url.searchParams.append('fly_from', params.from)
    url.searchParams.append('fly_to', params.to)
    url.searchParams.append('adults', (params.adults || 1).toString())
    url.searchParams.append('limit', (params.limit || 5).toString())
    url.searchParams.append('curr', 'EUR')

    if (params.dateFrom) {
      url.searchParams.append('date_from', params.dateFrom)
    }
    if (params.dateTo) {
      url.searchParams.append('date_to', params.dateTo)
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'apikey': apiKey,
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      console.error('Kiwi Flight API error:', response.status)
      return null
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching Kiwi flights:', error)
    return null
  }
}
