'use client'

import { useState, useRef, useEffect } from 'react'
import { FlightSearchParams, FlightResult } from '../api/flights/search/route'
import FlightTicketCard from '@/components/ui/FlightTicketCard'

// Composant sélecteur de mois style Skyscanner
function MonthPicker({
  value,
  onChange,
  label,
  placeholder = "Sélectionner un mois"
}: {
  value: string
  onChange: (value: string) => void
  label: string
  placeholder?: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const currentYear = new Date().getFullYear()
  const years = [currentYear, currentYear + 1]

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (year: number, month: string) => {
    onChange(`${year}-${month}`)
    setIsOpen(false)
  }

  const getDisplayValue = () => {
    if (!value) return placeholder
    const [year, month] = value.split('-')
    const monthObj = months.find(m => m.value === month)
    return monthObj ? `${monthObj.label} ${year}` : value
  }

  const isMonthDisabled = (year: number, monthValue: string) => {
    const now = new Date()
    const selectedDate = new Date(year, parseInt(monthValue) - 1)
    return selectedDate < new Date(now.getFullYear(), now.getMonth())
  }

  return (
    <div className="relative" ref={ref}>
      <label className="block text-sm font-medium mb-2 text-gray-300">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="input-glass w-full text-left flex items-center justify-between"
      >
        <span className={value ? 'text-white' : 'text-gray-400'}>
          {getDisplayValue()}
        </span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-gray-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden">
          {years.map((year) => (
            <div key={year} className="p-4">
              <div className="text-sm font-semibold text-primary mb-3">{year}</div>
              <div className="grid grid-cols-3 gap-2">
                {months.map((month) => {
                  const disabled = isMonthDisabled(year, month.value)
                  const isSelected = value === `${year}-${month.value}`
                  return (
                    <button
                      key={`${year}-${month.value}`}
                      type="button"
                      disabled={disabled}
                      onClick={() => handleSelect(year, month.value)}
                      className={`py-2 px-3 rounded-lg text-sm transition-all ${
                        isSelected
                          ? 'bg-primary text-white'
                          : disabled
                          ? 'text-gray-600 cursor-not-allowed'
                          : 'text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      {month.label.slice(0, 3)}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function SearchFlights() {
  const [searchParams, setSearchParams] = useState<FlightSearchParams>({
    from: '',
    to: '',
    dateFrom: '',
    dateTo: '',
    returnFrom: '',
    returnTo: '',
    adults: 1,
    children: 0,
    infants: 0,
    cabinBaggage: true,
    checkedBaggage: 0,
    tripType: 'return',
    currency: 'EUR',
  })

  // État pour les mois sélectionnés
  const [departureMonth, setDepartureMonth] = useState('')
  const [returnMonth, setReturnMonth] = useState('')

  const [results, setResults] = useState<FlightResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)

  // Convertir mois en plage de dates
  const monthToDateRange = (monthStr: string) => {
    if (!monthStr) return { from: '', to: '' }
    const [year, month] = monthStr.split('-')
    const firstDay = `${year}-${month}-01`
    const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate()
    const lastDayStr = `${year}-${month}-${lastDay.toString().padStart(2, '0')}`
    return { from: firstDay, to: lastDayStr }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    setSearched(true)

    try {
      // Convertir les mois en dates
      const depRange = monthToDateRange(departureMonth)
      const retRange = monthToDateRange(returnMonth)

      const finalParams = {
        ...searchParams,
        dateFrom: depRange.from,
        dateTo: depRange.to,
        returnFrom: searchParams.tripType === 'return' ? retRange.from : '',
        returnTo: searchParams.tripType === 'return' ? retRange.to : '',
      }

      // Build query string
      const params = new URLSearchParams()
      Object.entries(finalParams).forEach(([key, value]) => {
        if (value !== '' && value !== undefined && value !== null) {
          params.append(key, value.toString())
        }
      })

      const response = await fetch(`/api/flights/search?${params.toString()}`)
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Erreur lors de la recherche')
      }

      setResults(data.data || [])
    } catch (err: any) {
      setError(err.message)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h${mins.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="heading-lg mb-4">Rechercher des vols</h1>
          <p className="text-gray-300 text-lg">
            Trouvez les meilleurs deals de vols avec notre moteur de recherche
          </p>
        </div>

        {/* Search Form */}
        <div className="glass-card mb-8">
          <form onSubmit={handleSearch} className="space-y-6">
            {/* Trip Type */}
            <div>
              <label className="block text-sm font-medium mb-3 text-gray-300">
                Type de voyage
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setSearchParams({ ...searchParams, tripType: 'oneway' })}
                  className={`flex-1 py-3 px-6 rounded-lg border-2 transition-all ${
                    searchParams.tripType === 'oneway'
                      ? 'border-primary bg-primary/10 text-white'
                      : 'border-white/10 text-gray-400 hover:border-white/20'
                  }`}
                >
                  Aller simple
                </button>
                <button
                  type="button"
                  onClick={() => setSearchParams({ ...searchParams, tripType: 'return' })}
                  className={`flex-1 py-3 px-6 rounded-lg border-2 transition-all ${
                    searchParams.tripType === 'return'
                      ? 'border-primary bg-primary/10 text-white'
                      : 'border-white/10 text-gray-400 hover:border-white/20'
                  }`}
                >
                  Aller-retour
                </button>
              </div>
            </div>

            {/* Airports */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Aeroport de depart *
                </label>
                <input
                  type="text"
                  value={searchParams.from}
                  onChange={(e) =>
                    setSearchParams({ ...searchParams, from: e.target.value.toUpperCase() })
                  }
                  className="input-glass w-full"
                  placeholder="Ex: CDG, ORY, PAR"
                  required
                />
                <p className="text-xs text-gray-400 mt-1">Code IATA (3 lettres)</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Destination (optionnel)
                </label>
                <input
                  type="text"
                  value={searchParams.to || ''}
                  onChange={(e) =>
                    setSearchParams({ ...searchParams, to: e.target.value.toUpperCase() })
                  }
                  className="input-glass w-full"
                  placeholder="Ex: NYC, TYO, LON"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Laissez vide pour voir toutes les destinations
                </p>
              </div>
            </div>

            {/* Month Pickers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MonthPicker
                label="Mois de depart"
                value={departureMonth}
                onChange={setDepartureMonth}
                placeholder="Choisir le mois"
              />
              {searchParams.tripType === 'return' && (
                <MonthPicker
                  label="Mois de retour"
                  value={returnMonth}
                  onChange={setReturnMonth}
                  placeholder="Choisir le mois"
                />
              )}
            </div>

            {/* Baggage - simplified to checkbox */}
            <div>
              <label className="block text-sm font-medium mb-3 text-gray-300">
                Options
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(searchParams.checkedBaggage ?? 0) > 0}
                  onChange={(e) =>
                    setSearchParams({
                      ...searchParams,
                      checkedBaggage: e.target.checked ? 1 : 0
                    })
                  }
                  className="w-5 h-5 rounded border-white/20 bg-white/5 text-primary focus:ring-primary"
                />
                <span className="text-gray-300">Inclure bagage en soute</span>
              </label>
            </div>

            {/* Max Price */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Prix maximum (optionnel)
              </label>
              <input
                type="number"
                min="0"
                step="10"
                value={searchParams.maxPrice || ''}
                onChange={(e) =>
                  setSearchParams({
                    ...searchParams,
                    maxPrice: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
                className="input-glass w-full md:w-64"
                placeholder="Ex: 500"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-lg transition-all duration-200 disabled:opacity-50 transform hover:scale-105 shadow-lg shadow-primary/20"
            >
              {loading ? 'Recherche en cours...' : 'Rechercher des vols'}
            </button>
          </form>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-6 py-4 rounded-lg mb-8">
            {error}
          </div>
        )}

        {/* Results */}
        {searched && !loading && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">
                {results.length > 0
                  ? `${results.length} vols trouves`
                  : 'Aucun vol trouve'}
              </h2>
            </div>

            {results.length === 0 && !error && (
              <div className="glass-card text-center py-12">
                <p className="text-gray-300 text-lg mb-2">Aucun vol trouve</p>
                <p className="text-gray-400">
                  Essayez de modifier vos criteres de recherche
                </p>
              </div>
            )}

            {results.map((flight) => {
              const departureRoute = flight.route[0]
              const arrivalRoute = flight.route[flight.route.length - 1]

              return (
                <FlightTicketCard
                  key={flight.id}
                  from={departureRoute?.flyFrom || flight.flyFrom}
                  to={arrivalRoute?.flyTo || flight.flyTo}
                  fromCity={departureRoute?.cityFrom}
                  toCity={arrivalRoute?.cityTo}
                  price={flight.price}
                  currency={flight.currency}
                  airline={departureRoute?.airline}
                  flightNumber={departureRoute?.flight_no}
                  departureTime={departureRoute ? formatDate(departureRoute.local_departure) : undefined}
                  arrivalTime={arrivalRoute ? formatDate(arrivalRoute.local_arrival) : undefined}
                  duration={flight.duration ? formatDuration(flight.duration.total) : undefined}
                  bookingUrl={flight.deep_link}
                  className="animate-fade-in-up"
                />
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
