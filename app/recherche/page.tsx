'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface SearchCriteria {
  from: string
  fromCity: string
  to: string
  toCity: string
  departureMonth: string
  returnMonth: string
  tripType: 'oneway' | 'return'
  maxPrice: number | null
  checkedBaggage: boolean
}

interface FlightResult {
  id: string
  from: string
  fromCity: string
  to: string
  toCity: string
  price: number
  currency: string
  deep_link: string
  duration?: { total: number }
  route: any[]
}

// Liste des aéroports populaires
const popularAirports = [
  { code: 'CDG', city: 'Paris', country: 'France' },
  { code: 'ORY', city: 'Paris Orly', country: 'France' },
  { code: 'LYS', city: 'Lyon', country: 'France' },
  { code: 'MRS', city: 'Marseille', country: 'France' },
  { code: 'NCE', city: 'Nice', country: 'France' },
  { code: 'TLS', city: 'Toulouse', country: 'France' },
  { code: 'BOD', city: 'Bordeaux', country: 'France' },
  { code: 'NTE', city: 'Nantes', country: 'France' },
  { code: 'LIS', city: 'Lisbonne', country: 'Portugal' },
  { code: 'BCN', city: 'Barcelone', country: 'Espagne' },
  { code: 'MAD', city: 'Madrid', country: 'Espagne' },
  { code: 'ROM', city: 'Rome', country: 'Italie' },
  { code: 'MIL', city: 'Milan', country: 'Italie' },
  { code: 'LON', city: 'Londres', country: 'Royaume-Uni' },
  { code: 'AMS', city: 'Amsterdam', country: 'Pays-Bas' },
  { code: 'BER', city: 'Berlin', country: 'Allemagne' },
  { code: 'DUB', city: 'Dublin', country: 'Irlande' },
  { code: 'REK', city: 'Reykjavik', country: 'Islande' },
  { code: 'ATH', city: 'Athènes', country: 'Grèce' },
  { code: 'PRG', city: 'Prague', country: 'République Tchèque' },
  { code: 'VIE', city: 'Vienne', country: 'Autriche' },
  { code: 'BUD', city: 'Budapest', country: 'Hongrie' },
  { code: 'MAR', city: 'Marrakech', country: 'Maroc' },
  { code: 'TUN', city: 'Tunis', country: 'Tunisie' },
  { code: 'DXB', city: 'Dubaï', country: 'Émirats arabes unis' },
  { code: 'BKK', city: 'Bangkok', country: 'Thaïlande' },
  { code: 'TYO', city: 'Tokyo', country: 'Japon' },
  { code: 'NYC', city: 'New York', country: 'États-Unis' },
  { code: 'LAX', city: 'Los Angeles', country: 'États-Unis' },
  { code: 'MIA', city: 'Miami', country: 'États-Unis' },
]

const months = [
  { value: '01', label: 'Janvier' },
  { value: '02', label: 'Février' },
  { value: '03', label: 'Mars' },
  { value: '04', label: 'Avril' },
  { value: '05', label: 'Mai' },
  { value: '06', label: 'Juin' },
  { value: '07', label: 'Juillet' },
  { value: '08', label: 'Août' },
  { value: '09', label: 'Septembre' },
  { value: '10', label: 'Octobre' },
  { value: '11', label: 'Novembre' },
  { value: '12', label: 'Décembre' },
]

export default function SearchPage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isPremium, setIsPremium] = useState(false)
  const [loading, setLoading] = useState(true)

  // Wizard state
  const [showWizard, setShowWizard] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 5

  // Airport search state
  const [airportSearch, setAirportSearch] = useState('')
  const [airportResults, setAirportResults] = useState<Array<{ code: string; city: string; country: string }>>([])
  const [airportSearchLoading, setAirportSearchLoading] = useState(false)

  // Search criteria
  const [criteria, setCriteria] = useState<SearchCriteria>({
    from: '',
    fromCity: '',
    to: '',
    toCity: '',
    departureMonth: '',
    returnMonth: '',
    tripType: 'return',
    maxPrice: null,
    checkedBaggage: false,
  })

  // Results
  const [results, setResults] = useState<FlightResult[]>([])
  const [searchCompleted, setSearchCompleted] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState('')

  // Destination save state
  const [destinationSaved, setDestinationSaved] = useState(false)
  const [savingDestination, setSavingDestination] = useState(false)
  const [saveError, setSaveError] = useState('')

  // Saved destinations from DB (persist across refresh)
  const [savedDestinations, setSavedDestinations] = useState<Array<{ id: string; code: string; city: string; country: string; notifyChannel: string; createdAt: string }>>([])

  // Check auth and premium status, then load saved destinations
  useEffect(() => {
    const checkAuth = async () => {
      const userStr = localStorage.getItem('user')
      if (!userStr) {
        setLoading(false)
        return
      }

      try {
        const user = JSON.parse(userStr)
        setIsLoggedIn(true)

        // Fetch subscription from API (server-side handles admin check)
        const planRes = await fetch(`/api/user/subscription?userId=${user.id}`)
        if (planRes.ok) {
          const planData = await planRes.json()
          const sub = planData.subscription
          const isPremiumPlan = sub?.plan === 'premium' || sub?.plan === 'sms'
          const isActive = sub?.status === 'active'
          setIsPremium(isPremiumPlan && isActive)
        } else {
          // Fallback to localStorage
          const localSub = user.subscription
          const isPremiumPlan = localSub?.plan === 'premium' || localSub?.plan === 'sms'
          const isActive = localSub?.status === 'active'
          setIsPremium(isPremiumPlan && isActive)
        }

        // Load saved destinations from DB
        try {
          const destRes = await fetch(`/api/destinations/followed?userId=${user.id}`)
          if (destRes.ok) {
            const destData = await destRes.json()
            setSavedDestinations(destData.destinations || [])
          }
        } catch (e) {
          console.error('Error loading saved destinations:', e)
        }
      } catch (e) {
        console.error('Error checking auth:', e)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Airport search function
  const searchAirports = async (query: string) => {
    if (query.length < 2) {
      setAirportResults([])
      return
    }

    setAirportSearchLoading(true)
    try {
      const res = await fetch(`/api/destinations/search?q=${encodeURIComponent(query)}&limit=10`)
      if (res.ok) {
        const data = await res.json()
        // Transform results to match our format
        const formatted = data.results.map((r: any) => ({
          code: r.code,
          city: r.name || r.city,
          country: r.country || ''
        }))
        setAirportResults(formatted)
      }
    } catch (e) {
      console.error('Airport search error:', e)
      // Fallback to local search
      const lowerQuery = query.toLowerCase()
      const localResults = popularAirports.filter(
        a => a.city.toLowerCase().includes(lowerQuery) ||
             a.code.toLowerCase().includes(lowerQuery) ||
             a.country.toLowerCase().includes(lowerQuery)
      )
      setAirportResults(localResults)
    } finally {
      setAirportSearchLoading(false)
    }
  }

  const currentYear = new Date().getFullYear()
  const years = [currentYear, currentYear + 1]

  const isMonthDisabled = (year: number, monthValue: string) => {
    const now = new Date()
    const selectedDate = new Date(year, parseInt(monthValue) - 1)
    return selectedDate < new Date(now.getFullYear(), now.getMonth())
  }

  const getMonthLabel = (monthStr: string) => {
    if (!monthStr) return ''
    const [year, month] = monthStr.split('-')
    const monthObj = months.find(m => m.value === month)
    return monthObj ? `${monthObj.label} ${year}` : monthStr
  }

  const handleSelectAirport = (code: string, city: string, type: 'from' | 'to') => {
    if (type === 'from') {
      setCriteria({ ...criteria, from: code, fromCity: city })
    } else {
      setCriteria({ ...criteria, to: code, toCity: city })
    }
    setAirportSearch('')
    setAirportResults([])
    setCurrentStep(currentStep + 1)
  }

  const handleSelectMonth = (year: number, month: string, type: 'departure' | 'return') => {
    const monthStr = `${year}-${month}`
    if (type === 'departure') {
      setCriteria({ ...criteria, departureMonth: monthStr })
    } else {
      setCriteria({ ...criteria, returnMonth: monthStr })
    }
  }

  const handleSearch = async () => {
    setSearchLoading(true)
    setSearchError('')
    setShowWizard(false)
    setSearchCompleted(true)

    try {
      // Convert months to date ranges
      const monthToDateRange = (monthStr: string) => {
        if (!monthStr) return { from: '', to: '' }
        const [year, month] = monthStr.split('-')
        const firstDay = `${year}-${month}-01`
        const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate()
        const lastDayStr = `${year}-${month}-${lastDay.toString().padStart(2, '0')}`
        return { from: firstDay, to: lastDayStr }
      }

      const depRange = monthToDateRange(criteria.departureMonth)
      const retRange = monthToDateRange(criteria.returnMonth)

      const params = new URLSearchParams({
        from: criteria.from,
        to: criteria.to,
        dateFrom: depRange.from,
        dateTo: depRange.to,
        tripType: criteria.tripType,
        adults: '1',
        cabinBaggage: 'true',
        checkedBaggage: criteria.checkedBaggage ? '1' : '0',
        currency: 'EUR',
      })

      if (criteria.tripType === 'return' && criteria.returnMonth) {
        params.append('returnFrom', retRange.from)
        params.append('returnTo', retRange.to)
      }

      if (criteria.maxPrice) {
        params.append('maxPrice', criteria.maxPrice.toString())
      }

      const response = await fetch(`/api/flights/search?${params.toString()}`)
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Erreur lors de la recherche')
      }

      setResults(data.data || [])
    } catch (err: any) {
      setSearchError(err.message)
      setResults([])
    } finally {
      setSearchLoading(false)
    }
  }

  const resetSearch = () => {
    setCriteria({
      from: '',
      fromCity: '',
      to: '',
      toCity: '',
      departureMonth: '',
      returnMonth: '',
      tripType: 'return',
      maxPrice: null,
      checkedBaggage: false,
    })
    setCurrentStep(1)
    setSearchCompleted(false)
    setResults([])
    setSearchError('')
  }

  const startNewSearch = () => {
    resetSearch()
    setDestinationSaved(false)
    setShowWizard(true)
  }

  // Save destination to database
  const saveDestination = async () => {
    const userStr = localStorage.getItem('user')
    if (!userStr) return

    try {
      const user = JSON.parse(userStr)
      setSavingDestination(true)
      setSaveError('')

      // Save the destination to follow
      const response = await fetch('/api/destinations/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          code: criteria.to,
          city: criteria.toCity,
          country: '',
          notifyChannel: 'sms'
        })
      })

      const responseData = await response.json()

      if (response.ok) {
        setDestinationSaved(true)
        // Add to local saved destinations list
        if (responseData.destination) {
          setSavedDestinations(prev => [...prev, responseData.destination])
        }

        // Also save the search request to admin
        await fetch('/api/admin/search-requests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            userEmail: user.email,
            userName: user.name,
            from: criteria.from,
            fromCity: criteria.fromCity,
            to: criteria.to,
            toCity: criteria.toCity,
            departureMonth: criteria.departureMonth,
            returnMonth: criteria.returnMonth,
            tripType: criteria.tripType,
            maxPrice: criteria.maxPrice
          })
        })
      } else if (response.status === 400 && responseData.error?.includes('déjà suivie')) {
        // Destination already followed - treat as success
        setDestinationSaved(true)
      } else {
        setSaveError(responseData.error || 'Erreur lors de la sauvegarde')
      }
    } catch (error) {
      console.error('Error saving destination:', error)
      setSaveError('Erreur de connexion. Veuillez réessayer.')
    } finally {
      setSavingDestination(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Not logged in
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen relative">
        <div className="fixed inset-0 bg-gradient-to-b from-black via-gray-900/20 to-black pointer-events-none" />
        <div className="fixed top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float pointer-events-none" />

        <div className="container mx-auto px-4 py-16 max-w-4xl relative z-10">
          <div className="text-center mb-12 animate-fade-in-up">
            <h1 className="heading-xl mb-6">
              Envie d'une destination en <span className="text-primary">particulier</span> ?
            </h1>
            <p className="subtitle max-w-2xl mx-auto mb-8">
              Recherchez des vols vers n'importe quelle destination et on s'occupe de trouver les meilleurs prix pour vous !
            </p>
          </div>

          <div className="glass-card text-center py-12 animate-scale-in">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <h3 className="text-2xl font-bold mb-2">Connexion requise</h3>
            <p className="text-gray-400 max-w-md mx-auto mb-6">
              Connectez-vous à un compte premium pour accéder à la recherche de vols personnalisée.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/signup"
                className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-bold transition-all duration-200 transform hover:scale-105"
              >
                S'inscrire
              </Link>
              <Link
                href="/login"
                className="glass hover:bg-white/15 text-white px-6 py-3 rounded-lg font-bold transition-all duration-200 border border-white/20"
              >
                Se connecter
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Not premium
  if (!isPremium) {
    return (
      <div className="min-h-screen relative">
        <div className="fixed inset-0 bg-gradient-to-b from-black via-gray-900/20 to-black pointer-events-none" />
        <div className="fixed top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float pointer-events-none" />

        <div className="container mx-auto px-4 py-16 max-w-4xl relative z-10">
          <div className="text-center mb-12 animate-fade-in-up">
            <h1 className="heading-xl mb-6">
              Envie d'une destination en <span className="text-primary">particulier</span> ?
            </h1>
            <p className="subtitle max-w-2xl mx-auto mb-8">
              Recherchez des vols vers n'importe quelle destination et trouvez les meilleurs prix.
            </p>
          </div>

          <div className="glass-card text-center py-12 animate-scale-in border-2 border-primary/30">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center">
              <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h3 className="subtitle-lg font-extrabold mb-2">Fonctionnalité Premium</h3>
            <p className="subtitle-sm max-w-md mx-auto mb-6">
              La recherche de vols personnalisée est réservée aux membres Premium.
              Passez au Premium pour débloquer cette fonctionnalité.
            </p>
            <Link
              href="/upgrade"
              className="inline-block bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-lg font-bold transition-all duration-200 transform hover:scale-105 shadow-lg shadow-primary/20"
            >
              Passer au Premium - 3,99€/mois
            </Link>
            <p className="text-gray-500 text-xs mt-3">Facturé 11,99€ par trimestre</p>
          </div>
        </div>
      </div>
    )
  }

  // Premium user - main content
  return (
    <div className="min-h-screen relative">
      {/* Background effects */}
      <div className="fixed inset-0 bg-gradient-to-b from-black via-gray-900/20 to-black pointer-events-none" />
      <div className="fixed top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float pointer-events-none" />
      <div className="fixed bottom-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: '3s' }} />

      <div className="container mx-auto px-4 py-16 max-w-5xl relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="heading-xl mb-6">
            Envie d'une destination en <span className="text-primary">particulier</span> ?
          </h1>
          <p className="subtitle max-w-2xl mx-auto">
            Recherchez des vols vers n'importe quelle destination et trouvez les meilleurs prix en quelques clics.
          </p>
        </div>

        {/* CTA Card - Initial State */}
        {!searchCompleted && !showWizard && (
          <div className="space-y-6">
            <div className="glass-card text-center py-16 animate-scale-in">
              <svg className="w-20 h-20 mx-auto mb-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
              </svg>
              <h3 className="text-3xl font-bold mb-4">Commencez votre recherche</h3>
              <p className="text-gray-400 max-w-md mx-auto mb-8">
                Trouvez les meilleurs vols en définissant vos critères de recherche étape par étape.
              </p>
              <button
                onClick={startNewSearch}
                className="bg-primary hover:bg-primary-dark text-white px-10 py-4 rounded-lg font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg shadow-primary/30"
              >
                Nouvelle recherche
              </button>
            </div>

            {/* Saved destinations */}
            {savedDestinations.length > 0 && (
              <div className="glass-card animate-fade-in-up">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  Vos destinations suivies
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {savedDestinations.map((dest) => (
                    <div
                      key={dest.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-green-500/10 border border-green-500/20"
                    >
                      <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-green-400 font-bold text-sm">{dest.code}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{dest.city}</p>
                        <p className="text-gray-400 text-xs">
                          Alerte {dest.notifyChannel === 'sms' ? 'SMS' : 'Email'} active
                        </p>
                      </div>
                      <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Search Results */}
        {searchCompleted && (
          <div className="animate-fade-in-up">
            {/* Current Search Summary */}
            <div className="glass-card mb-6">
              <div className="flex flex-col gap-4">
                {/* Route display */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold font-mono">{criteria.from}</div>
                      <div className="text-xs text-gray-400">{criteria.fromCity}</div>
                    </div>
                    <div className="flex items-center px-2">
                      <div className="w-8 h-px bg-gradient-to-r from-transparent to-primary/50" />
                      <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                      <div className="w-8 h-px bg-gradient-to-r from-primary/50 to-transparent" />
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold font-mono">{criteria.to}</div>
                      <div className="text-xs text-gray-400">{criteria.toCity}</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                    <span className="bg-white/5 px-3 py-1 rounded-full">{getMonthLabel(criteria.departureMonth)}</span>
                    {criteria.tripType === 'return' && criteria.returnMonth && (
                      <span className="bg-white/5 px-3 py-1 rounded-full">{getMonthLabel(criteria.returnMonth)}</span>
                    )}
                    <span className="bg-white/5 px-3 py-1 rounded-full">
                      {criteria.tripType === 'return' ? 'Aller-retour' : 'Aller simple'}
                    </span>
                    {criteria.maxPrice && (
                      <span className="bg-white/5 px-3 py-1 rounded-full">Max {criteria.maxPrice}€</span>
                    )}
                  </div>
                </div>

                {/* Notification message or Save button */}
                {destinationSaved || savedDestinations.some(d => d.code === criteria.to) ? (
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/30">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-green-400 font-medium">On s'occupe de tout !</p>
                      <p className="text-gray-400 text-sm">
                        Vous recevrez une notification SMS des que l'on trouvera un vol vers {criteria.toCity} a un prix anormalement bas.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <button
                      onClick={saveDestination}
                      disabled={savingDestination}
                      className="flex items-center gap-3 p-4 rounded-xl bg-primary/10 border border-primary/30 hover:bg-primary/20 transition-all cursor-pointer w-full text-left"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        {savingDestination ? (
                          <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
                        ) : (
                          <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-primary font-medium">Recevoir une alerte pour cette destination</p>
                        <p className="text-gray-400 text-sm">
                          On s'occupe de tout ! Vous recevrez une notification SMS des qu'un vol a prix bas sera disponible.
                        </p>
                      </div>
                    </button>
                    {saveError && (
                      <p className="text-red-400 text-sm mt-2 px-4">{saveError}</p>
                    )}
                  </div>
                )}

                {/* Add another destination button */}
                <div className="flex items-center justify-center pt-2">
                  <button
                    onClick={startNewSearch}
                    className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors text-sm"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Ajouter une autre destination
                  </button>
                </div>
              </div>
            </div>

            {/* Loading */}
            {searchLoading && (
              <div className="glass-card text-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-400">Recherche en cours...</p>
              </div>
            )}

            {/* Error */}
            {searchError && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 px-6 py-4 rounded-lg mb-8">
                {searchError}
              </div>
            )}

            {/* Results */}
            {!searchLoading && !searchError && (
              <>
                <h2 className="text-2xl font-bold mb-6">
                  {results.length > 0 ? `${results.length} vols trouvés` : 'Aucun vol trouvé'}
                </h2>

                {results.length === 0 ? (
                  <div className="glass-card text-center py-12">
                    <p className="text-gray-300 text-lg mb-2">Aucun vol trouvé</p>
                    <p className="text-gray-400">Essayez de modifier vos critères de recherche</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {results.map((flight) => {
                      const departureRoute = flight.route[0]
                      const arrivalRoute = flight.route[flight.route.length - 1]

                      return (
                        <div key={flight.id} className="glass-card hover-lift group overflow-hidden">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            {/* Route */}
                            <div className="flex items-center gap-3 md:min-w-[200px]">
                              <div className="text-center">
                                <div className="text-2xl font-bold font-mono">{departureRoute?.flyFrom || flight.from}</div>
                                <div className="text-xs text-gray-400">{departureRoute?.cityFrom}</div>
                              </div>
                              <div className="flex items-center px-2">
                                <div className="w-8 h-px bg-gradient-to-r from-transparent to-primary/50" />
                                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                                <div className="w-8 h-px bg-gradient-to-r from-primary/50 to-transparent" />
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold font-mono">{arrivalRoute?.flyTo || flight.to}</div>
                                <div className="text-xs text-gray-400">{arrivalRoute?.cityTo}</div>
                              </div>
                            </div>

                            {/* Duration */}
                            {flight.duration && (
                              <div className="text-sm text-gray-400">
                                {Math.floor(flight.duration.total / 60)}h{(flight.duration.total % 60).toString().padStart(2, '0')}
                              </div>
                            )}

                            {/* Price */}
                            <div className="flex items-center gap-3">
                              <span className="text-3xl font-bold text-primary font-mono">{flight.price}€</span>
                            </div>

                            {/* CTA Button */}
                            <a
                              href={flight.deep_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="md:ml-auto bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-lg transition-all duration-200 transform group-hover:scale-105 whitespace-nowrap text-center"
                            >
                              Réserver
                            </a>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Wizard Modal */}
      {showWizard && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
            {/* Progress */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-400">Étape {currentStep} sur {totalSteps}</span>
                <button
                  onClick={() => setShowWizard(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
              </div>
            </div>

            {/* Step 1: Departure Airport */}
            {currentStep === 1 && (
              <div className="animate-fade-in-up">
                <h2 className="heading-sm text-center mb-2">D'où partez-vous ?</h2>
                <p className="subtitle text-center mb-6">Recherchez votre aéroport de départ</p>

                {/* Search Input */}
                <div className="relative mb-6">
                  <input
                    type="text"
                    value={airportSearch}
                    onChange={(e) => {
                      setAirportSearch(e.target.value)
                      searchAirports(e.target.value)
                    }}
                    placeholder="Rechercher une ville ou un aéroport..."
                    className="input-glass w-full pl-12"
                    autoFocus
                  />
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  {airportSearchLoading && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  )}
                </div>

                {/* Search Results */}
                {airportSearch.length >= 2 && airportResults.length > 0 && (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto mb-6">
                    {airportResults.map((airport) => (
                      <button
                        key={airport.code}
                        onClick={() => handleSelectAirport(airport.code, airport.city, 'from')}
                        className="w-full p-4 rounded-xl border-2 border-white/10 hover:border-primary hover:bg-primary/10 transition-all text-left flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold">{airport.city}</div>
                          <div className="text-sm text-gray-400">{airport.country}</div>
                        </div>
                        <div className="text-lg font-mono text-primary">{airport.code}</div>
                      </button>
                    ))}
                  </div>
                )}

                {/* No Results */}
                {airportSearch.length >= 2 && airportResults.length === 0 && !airportSearchLoading && (
                  <div className="text-center py-8 text-gray-400">
                    Aucun aéroport trouvé pour &quot;{airportSearch}&quot;
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Destination Airport */}
            {currentStep === 2 && (
              <div className="animate-fade-in-up">
                <h2 className="heading-sm text-center mb-2">Où souhaitez-vous aller ?</h2>
                <p className="subtitle text-center mb-6">Recherchez votre destination</p>

                {/* Search Input */}
                <div className="relative mb-6">
                  <input
                    type="text"
                    value={airportSearch}
                    onChange={(e) => {
                      setAirportSearch(e.target.value)
                      searchAirports(e.target.value)
                    }}
                    placeholder="Rechercher une ville ou un aéroport..."
                    className="input-glass w-full pl-12"
                    autoFocus
                  />
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  {airportSearchLoading && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  )}
                </div>

                {/* Search Results */}
                {airportSearch.length >= 2 && airportResults.length > 0 && (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto mb-6">
                    {airportResults.filter(a => a.code !== criteria.from).map((airport) => (
                      <button
                        key={airport.code}
                        onClick={() => handleSelectAirport(airport.code, airport.city, 'to')}
                        className="w-full p-4 rounded-xl border-2 border-white/10 hover:border-primary hover:bg-primary/10 transition-all text-left flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold">{airport.city}</div>
                          <div className="text-sm text-gray-400">{airport.country}</div>
                        </div>
                        <div className="text-lg font-mono text-primary">{airport.code}</div>
                      </button>
                    ))}
                  </div>
                )}

                {/* No Results */}
                {airportSearch.length >= 2 && airportResults.length === 0 && !airportSearchLoading && (
                  <div className="text-center py-8 text-gray-400">
                    Aucun aéroport trouvé pour &quot;{airportSearch}&quot;
                  </div>
                )}

                <button
                  onClick={() => {
                    setAirportSearch('')
                    setAirportResults([])
                    setCurrentStep(1)
                  }}
                  className="mt-6 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Retour
                </button>
              </div>
            )}

            {/* Step 3: Month Range Selection */}
            {currentStep === 3 && (
              <div className="animate-fade-in-up">
                <h2 className="heading-sm text-center mb-2">Vers quelle période de l'année souhaitez-vous partir ?</h2>
                <p className="subtitle text-center mb-6">Sélectionnez votre période de voyage</p>

                {/* Selected range display */}
                {criteria.departureMonth && (
                  <div className="flex items-center justify-center gap-2 mb-6">
                    <span className="bg-primary/20 border border-primary text-white px-4 py-2 rounded-lg font-medium">
                      {getMonthLabel(criteria.departureMonth)}
                    </span>
                    {criteria.returnMonth && criteria.returnMonth !== criteria.departureMonth && (
                      <>
                        <span className="text-gray-400">→</span>
                        <span className="bg-primary/20 border border-primary text-white px-4 py-2 rounded-lg font-medium">
                          {getMonthLabel(criteria.returnMonth)}
                        </span>
                      </>
                    )}
                    <button
                      onClick={() => setCriteria({ ...criteria, departureMonth: '', returnMonth: '' })}
                      className="ml-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}

                {/* Single calendar for month range */}
                <div className="space-y-6">
                  {years.map((year) => (
                    <div key={year}>
                      <div className="text-sm font-semibold text-primary mb-3 text-center">{year}</div>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {months.map((month) => {
                          const disabled = isMonthDisabled(year, month.value)
                          const monthKey = `${year}-${month.value}`
                          const isStart = criteria.departureMonth === monthKey
                          const isEnd = criteria.returnMonth === monthKey
                          const isSelected = isStart || isEnd

                          // Check if month is in range between departure and return
                          let isInRange = false
                          if (criteria.departureMonth && criteria.returnMonth) {
                            const start = criteria.departureMonth
                            const end = criteria.returnMonth
                            const minMonth = start < end ? start : end
                            const maxMonth = start < end ? end : start
                            isInRange = monthKey >= minMonth && monthKey <= maxMonth
                          }

                          return (
                            <button
                              key={`range-${year}-${month.value}`}
                              disabled={disabled}
                              onClick={() => {
                                if (!criteria.departureMonth) {
                                  // First click: set start month
                                  setCriteria({ ...criteria, departureMonth: monthKey, returnMonth: '' })
                                } else if (!criteria.returnMonth || criteria.returnMonth === criteria.departureMonth) {
                                  // Second click: set end month (ensure correct order)
                                  if (monthKey === criteria.departureMonth) {
                                    // Clicked same month - just keep single month selected
                                    return
                                  }
                                  const start = criteria.departureMonth
                                  if (monthKey < start) {
                                    setCriteria({ ...criteria, departureMonth: monthKey, returnMonth: start })
                                  } else {
                                    setCriteria({ ...criteria, returnMonth: monthKey })
                                  }
                                } else {
                                  // Third click: reset and start new selection
                                  setCriteria({ ...criteria, departureMonth: monthKey, returnMonth: '' })
                                }
                              }}
                              className={`py-3 px-2 rounded-lg border text-sm font-medium transition-all ${
                                disabled
                                  ? 'border-white/5 text-gray-600 cursor-not-allowed'
                                  : isSelected
                                    ? 'border-primary bg-primary text-white'
                                    : isInRange
                                      ? 'border-primary/50 bg-primary/20 text-white'
                                      : 'border-white/10 hover:border-primary hover:bg-primary/10 text-white'
                              }`}
                            >
                              {month.label.slice(0, 4)}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="flex-1 glass hover:bg-white/10 text-white py-3 rounded-lg font-bold transition-all border border-white/20"
                  >
                    Retour
                  </button>
                  <button
                    onClick={() => setCurrentStep(4)}
                    disabled={!criteria.departureMonth}
                    className={`flex-1 py-3 rounded-lg font-bold transition-all ${
                      criteria.departureMonth
                        ? 'bg-primary hover:bg-primary-dark text-white'
                        : 'bg-white/10 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Continuer
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Trip Type & Budget */}
            {currentStep === 4 && (
              <div className="animate-fade-in-up">
                <h2 className="heading-sm text-center mb-2">Options de voyage</h2>
                <p className="subtitle text-center mb-6">Configurez vos préférences</p>

                <div className="space-y-6">
                  {/* Trip Type */}
                  <div>
                    <label className="block text-sm font-medium mb-3 text-gray-300">Type de voyage</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setCriteria({ ...criteria, tripType: 'return' })}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          criteria.tripType === 'return'
                            ? 'border-primary bg-primary/10'
                            : 'border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="font-bold">Aller-retour</div>
                      </button>
                      <button
                        onClick={() => setCriteria({ ...criteria, tripType: 'oneway', returnMonth: '' })}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          criteria.tripType === 'oneway'
                            ? 'border-primary bg-primary/10'
                            : 'border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="font-bold">Aller simple</div>
                      </button>
                    </div>
                  </div>

                  {/* Max Price */}
                  <div>
                    <label className="block text-sm font-medium mb-3 text-gray-300">Budget maximum (optionnel)</label>
                    <input
                      type="number"
                      min="0"
                      step="50"
                      value={criteria.maxPrice || ''}
                      onChange={(e) => setCriteria({ ...criteria, maxPrice: e.target.value ? parseInt(e.target.value) : null })}
                      className="input-glass w-full"
                      placeholder="Ex: 500€"
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="flex-1 glass hover:bg-white/10 text-white py-3 rounded-lg font-bold transition-all border border-white/20"
                  >
                    Retour
                  </button>
                  <button
                    onClick={() => setCurrentStep(5)}
                    className="flex-1 bg-primary hover:bg-primary-dark text-white py-3 rounded-lg font-bold transition-all"
                  >
                    Continuer
                  </button>
                </div>
              </div>
            )}

            {/* Step 5: Baggage & Confirm */}
            {currentStep === 5 && (
              <div className="animate-fade-in-up">
                <h2 className="heading-sm text-center mb-2">Bagages et confirmation</h2>
                <p className="subtitle text-center mb-6">Dernière étape avant la recherche</p>

                <div className="space-y-6">
                  {/* Checked Baggage */}
                  <div>
                    <label className="flex items-center gap-4 cursor-pointer p-4 rounded-xl border-2 border-white/10 hover:border-white/20 transition-all">
                      <input
                        type="checkbox"
                        checked={criteria.checkedBaggage}
                        onChange={(e) => setCriteria({ ...criteria, checkedBaggage: e.target.checked })}
                        className="w-6 h-6 rounded border-white/20 bg-white/5 text-primary focus:ring-primary"
                      />
                      <div>
                        <div className="font-bold">Bagage en soute</div>
                        <div className="text-sm text-gray-400">Inclure un bagage en soute dans la recherche</div>
                      </div>
                    </label>
                  </div>

                  {/* Summary */}
                  <div className="bg-white/5 rounded-xl p-6">
                    <h3 className="font-bold mb-4">Résumé de votre recherche</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Départ :</span>
                        <span>{criteria.fromCity} ({criteria.from})</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Destination :</span>
                        <span>{criteria.toCity} ({criteria.to})</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Mois de départ :</span>
                        <span>{getMonthLabel(criteria.departureMonth)}</span>
                      </div>
                      {criteria.tripType === 'return' && criteria.returnMonth && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Mois de retour :</span>
                          <span>{getMonthLabel(criteria.returnMonth)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-400">Type :</span>
                        <span>{criteria.tripType === 'return' ? 'Aller-retour' : 'Aller simple'}</span>
                      </div>
                      {criteria.maxPrice && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Budget max :</span>
                          <span>{criteria.maxPrice}€</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-400">Bagage en soute :</span>
                        <span>{criteria.checkedBaggage ? 'Oui' : 'Non'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    onClick={() => setCurrentStep(4)}
                    className="flex-1 glass hover:bg-white/10 text-white py-3 rounded-lg font-bold transition-all border border-white/20"
                  >
                    Retour
                  </button>
                  <button
                    onClick={handleSearch}
                    className="flex-1 bg-primary hover:bg-primary-dark text-white py-4 rounded-lg font-bold transition-all shadow-lg shadow-primary/30"
                  >
                    Rechercher
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
