import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export interface FlightSearchParams {
  from: string // Airport code (e.g., "CDG", "ORY")
  to?: string // Optional destination
  dateFrom?: string // YYYY-MM-DD
  dateTo?: string // YYYY-MM-DD
  returnFrom?: string // YYYY-MM-DD
  returnTo?: string // YYYY-MM-DD
  adults?: number
  children?: number
  infants?: number
  cabinBaggage?: boolean // Main/cabin baggage
  checkedBaggage?: number // Number of checked bags (0-2)
  tripType?: 'oneway' | 'return' // One way or return trip
  maxPrice?: number
  currency?: string
}

export interface FlightResult {
  id: string
  price: number
  currency: string
  deep_link: string
  quality: number
  route: Array<{
    id: string
    flyFrom: string
    flyTo: string
    cityFrom: string
    cityTo: string
    local_departure: string
    local_arrival: string
    utc_departure: string
    utc_arrival: string
    airline: string
    flight_no: string
    operating_carrier: string
    bags_recheck_required: boolean
    guarantee: boolean
    equipment: string | null
    vi_connection: boolean
    return: number
  }>
  baglimit?: {
    hand_width: number
    hand_height: number
    hand_length: number
    hand_weight: number
    hold_width: number
    hold_height: number
    hold_length: number
    hold_dimensions_sum: number
    hold_weight: number
  }
  availability?: {
    seats: number
  }
  conversion?: {
    EUR: number
    USD: number
  }
  duration?: {
    departure: number
    return: number
    total: number
  }
  booking_token?: string
}

export interface FlightSearchResponse {
  success: boolean
  data?: FlightResult[]
  search_params?: FlightSearchParams
  currency?: string
  _results?: number
  error?: string
}

/**
 * API de recherche de vols avec l'API Kiwi.com
 * GET /api/flights/search?from=CDG&to=NYC&dateFrom=2024-03-01&dateTo=2024-03-10
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    // Parse query parameters
    const from = searchParams.get('from')
    const to = searchParams.get('to')
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const returnFrom = searchParams.get('returnFrom')
    const returnTo = searchParams.get('returnTo')
    const adults = parseInt(searchParams.get('adults') || '1')
    const children = parseInt(searchParams.get('children') || '0')
    const infants = parseInt(searchParams.get('infants') || '0')
    const cabinBaggage = searchParams.get('cabinBaggage') === 'true'
    const checkedBaggage = parseInt(searchParams.get('checkedBaggage') || '0')
    const tripType = (searchParams.get('tripType') || 'oneway') as 'oneway' | 'return'
    const maxPrice = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined
    const currency = searchParams.get('currency') || 'EUR'

    // Validate required parameters
    if (!from) {
      return NextResponse.json(
        { success: false, error: 'Le paramètre "from" (aéroport de départ) est requis' },
        { status: 400 }
      )
    }

    // Check if Kiwi API key is configured
    const apiKey = process.env.KIWI_API_KEY
    if (!apiKey || apiKey === 'your_kiwi_api_key') {
      return NextResponse.json(
        {
          success: false,
          error: 'API Kiwi.com non configurée. Veuillez ajouter KIWI_API_KEY dans les variables d\'environnement.'
        },
        { status: 503 }
      )
    }

    // Build Kiwi API URL
    const kiwiUrl = new URL('https://api.tequila.kiwi.com/v2/search')

    // Required params
    kiwiUrl.searchParams.append('fly_from', from)
    if (to) {
      kiwiUrl.searchParams.append('fly_to', to)
    }
    kiwiUrl.searchParams.append('curr', currency)

    // Dates
    if (dateFrom) {
      kiwiUrl.searchParams.append('date_from', dateFrom)
    }
    if (dateTo) {
      kiwiUrl.searchParams.append('date_to', dateTo)
    }
    if (returnFrom && tripType === 'return') {
      kiwiUrl.searchParams.append('return_from', returnFrom)
    }
    if (returnTo && tripType === 'return') {
      kiwiUrl.searchParams.append('return_to', returnTo)
    }

    // Passengers
    kiwiUrl.searchParams.append('adults', adults.toString())
    if (children > 0) {
      kiwiUrl.searchParams.append('children', children.toString())
    }
    if (infants > 0) {
      kiwiUrl.searchParams.append('infants', infants.toString())
    }

    // Baggage
    if (cabinBaggage) {
      kiwiUrl.searchParams.append('select_airlines_exclude', 'false')
      kiwiUrl.searchParams.append('adult_hold_bag', '0')
      kiwiUrl.searchParams.append('adult_hand_bag', '1')
    }
    if (checkedBaggage > 0) {
      kiwiUrl.searchParams.append('adult_hold_bag', checkedBaggage.toString())
    }

    // Other params
    kiwiUrl.searchParams.append('flight_type', tripType)
    if (maxPrice) {
      kiwiUrl.searchParams.append('price_to', maxPrice.toString())
    }
    kiwiUrl.searchParams.append('limit', '50')
    kiwiUrl.searchParams.append('sort', 'price')
    kiwiUrl.searchParams.append('locale', 'fr')

    console.log('🔍 Searching flights with Kiwi API:', kiwiUrl.toString())

    // Fetch from Kiwi API
    const response = await fetch(kiwiUrl.toString(), {
      method: 'GET',
      headers: {
        'apikey': apiKey,
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Kiwi API error:', response.status, errorText)
      return NextResponse.json(
        {
          success: false,
          error: `Erreur API Kiwi: ${response.status} ${response.statusText}`
        },
        { status: response.status }
      )
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      data: data.data || [],
      search_params: {
        from,
        to,
        dateFrom,
        dateTo,
        returnFrom,
        returnTo,
        adults,
        children,
        infants,
        cabinBaggage,
        checkedBaggage,
        tripType,
        maxPrice,
        currency,
      },
      currency: data.currency,
      _results: data._results || 0,
    })
  } catch (error: any) {
    console.error('Flight search error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Erreur lors de la recherche de vols'
      },
      { status: 500 }
    )
  }
}
