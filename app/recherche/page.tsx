'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FlightSearchParams, FlightResult } from '../api/flights/search/route'

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
    tripType: 'oneway',
    currency: 'EUR',
  })

  const [results, setResults] = useState<FlightResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    setSearched(true)

    try {
      // Build query string
      const params = new URLSearchParams()
      Object.entries(searchParams).forEach(([key, value]) => {
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
          <h1 className="heading-lg mb-4">🔍 Rechercher des vols</h1>
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
                  ✈️ Aller simple
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
                  🔄 Aller-retour
                </button>
              </div>
            </div>

            {/* Airports */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Aéroport de départ *
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

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Date de départ (de)
                </label>
                <input
                  type="date"
                  value={searchParams.dateFrom || ''}
                  onChange={(e) =>
                    setSearchParams({ ...searchParams, dateFrom: e.target.value })
                  }
                  className="input-glass w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Date de départ (à)
                </label>
                <input
                  type="date"
                  value={searchParams.dateTo || ''}
                  onChange={(e) =>
                    setSearchParams({ ...searchParams, dateTo: e.target.value })
                  }
                  className="input-glass w-full"
                />
              </div>
            </div>

            {/* Return Dates (if return trip) */}
            {searchParams.tripType === 'return' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Date de retour (de)
                  </label>
                  <input
                    type="date"
                    value={searchParams.returnFrom || ''}
                    onChange={(e) =>
                      setSearchParams({ ...searchParams, returnFrom: e.target.value })
                    }
                    className="input-glass w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Date de retour (à)
                  </label>
                  <input
                    type="date"
                    value={searchParams.returnTo || ''}
                    onChange={(e) =>
                      setSearchParams({ ...searchParams, returnTo: e.target.value })
                    }
                    className="input-glass w-full"
                  />
                </div>
              </div>
            )}

            {/* Passengers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Adultes (12+)
                </label>
                <input
                  type="number"
                  min="1"
                  max="9"
                  value={searchParams.adults}
                  onChange={(e) =>
                    setSearchParams({ ...searchParams, adults: parseInt(e.target.value) })
                  }
                  className="input-glass w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Enfants (2-11)
                </label>
                <input
                  type="number"
                  min="0"
                  max="9"
                  value={searchParams.children}
                  onChange={(e) =>
                    setSearchParams({ ...searchParams, children: parseInt(e.target.value) })
                  }
                  className="input-glass w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Bébés (0-2)
                </label>
                <input
                  type="number"
                  min="0"
                  max="9"
                  value={searchParams.infants}
                  onChange={(e) =>
                    setSearchParams({ ...searchParams, infants: parseInt(e.target.value) })
                  }
                  className="input-glass w-full"
                />
              </div>
            </div>

            {/* Baggage */}
            <div>
              <label className="block text-sm font-medium mb-3 text-gray-300">
                Bagages
              </label>
              <div className="space-y-4">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={searchParams.cabinBaggage}
                    onChange={(e) =>
                      setSearchParams({ ...searchParams, cabinBaggage: e.target.checked })
                    }
                    className="w-5 h-5 rounded border-white/20 bg-white/5 text-primary focus:ring-primary"
                  />
                  <span className="text-gray-300">🎒 Bagage cabine / main</span>
                </label>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Bagages en soute
                  </label>
                  <select
                    value={searchParams.checkedBaggage}
                    onChange={(e) =>
                      setSearchParams({
                        ...searchParams,
                        checkedBaggage: parseInt(e.target.value),
                      })
                    }
                    className="input-glass w-full md:w-48"
                  >
                    <option value="0">0 bagage en soute</option>
                    <option value="1">1 bagage en soute</option>
                    <option value="2">2 bagages en soute</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Max Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  className="input-glass w-full"
                  placeholder="Ex: 500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Devise
                </label>
                <select
                  value={searchParams.currency}
                  onChange={(e) =>
                    setSearchParams({ ...searchParams, currency: e.target.value })
                  }
                  className="input-glass w-full"
                >
                  <option value="EUR">EUR (€)</option>
                  <option value="USD">USD ($)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-lg transition-all duration-200 disabled:opacity-50 transform hover:scale-105 shadow-lg shadow-primary/20"
            >
              {loading ? '🔍 Recherche en cours...' : '🚀 Rechercher des vols'}
            </button>
          </form>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-6 py-4 rounded-lg mb-8">
            ⚠️ {error}
          </div>
        )}

        {/* Results */}
        {searched && !loading && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">
                {results.length > 0
                  ? `${results.length} vols trouvés`
                  : 'Aucun vol trouvé'}
              </h2>
            </div>

            {results.length === 0 && !error && (
              <div className="glass-card text-center py-12">
                <div className="text-6xl mb-4">✈️</div>
                <p className="text-gray-300 text-lg mb-2">Aucun vol trouvé</p>
                <p className="text-gray-400">
                  Essayez de modifier vos critères de recherche
                </p>
              </div>
            )}

            {results.map((flight) => (
              <div key={flight.id} className="glass-card hover:border-primary/50 transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Flight Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-2xl font-bold text-primary">
                        {flight.price.toFixed(0)} {flight.currency}
                      </span>
                      {flight.route[0] && (
                        <span className="text-sm text-gray-400">
                          {flight.route[0].airline}
                        </span>
                      )}
                    </div>
                    {flight.route.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-4 text-sm">
                          <div>
                            <div className="font-bold">{flight.route[0].flyFrom}</div>
                            <div className="text-gray-400">
                              {formatDate(flight.route[0].local_departure)}
                            </div>
                          </div>
                          <div className="flex-1 flex items-center gap-2">
                            <div className="h-px bg-gradient-to-r from-primary/50 to-primary flex-1" />
                            <span className="text-xs text-gray-400">
                              {flight.route.length === 1 ? 'Direct' : `${flight.route.length} escales`}
                            </span>
                            <div className="h-px bg-gradient-to-r from-primary to-primary/50 flex-1" />
                          </div>
                          <div>
                            <div className="font-bold">{flight.route[flight.route.length - 1].flyTo}</div>
                            <div className="text-gray-400">
                              {formatDate(flight.route[flight.route.length - 1].local_arrival)}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* CTA */}
                  <div className="flex flex-col gap-2">
                    <a
                      href={flight.deep_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 text-center"
                    >
                      Réserver →
                    </a>
                    {flight.availability && (
                      <span className="text-xs text-gray-400 text-center">
                        {flight.availability.seats} places restantes
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
