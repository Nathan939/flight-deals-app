'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { flagToEmoji } from '@/lib/utils'

interface DateEntry {
  date: string
  price: number
  url: string
}

interface DealDetail {
  id: string
  from: string
  to: string
  fromCity?: string
  toCity?: string
  toCountry?: string
  flag?: string
  description?: string
  activities?: string[]
  airline?: string
  price: number
  originalPrice: number
  currency: string
  discount: number
  dates: Record<string, DateEntry[]> | string | null
  url?: string
  createdAt: string
}

export default function DealDetailPage() {
  const params = useParams()
  const dealId = params.id as string
  const [deal, setDeal] = useState<DealDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedMonths, setExpandedMonths] = useState<Record<string, boolean>>({})

  useEffect(() => {
    fetch(`/api/deals/${dealId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setDeal(data.deal)
          // Auto-expand first month
          if (data.deal.dates && typeof data.deal.dates === 'object') {
            const firstMonth = Object.keys(data.deal.dates)[0]
            if (firstMonth) setExpandedMonths({ [firstMonth]: true })
          }
        } else {
          setError('Deal introuvable')
        }
      })
      .catch(() => setError('Erreur de chargement'))
      .finally(() => setLoading(false))
  }, [dealId])

  const toggleMonth = (month: string) => {
    setExpandedMonths(prev => ({
      ...prev,
      [month]: !prev[month]
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !deal) {
    return (
      <div className="min-h-screen bg-black">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Deal introuvable</h1>
          <Link href="/" className="text-primary hover:underline">
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    )
  }

  const flagEmoji = deal.flag ? flagToEmoji(deal.flag) : ''
  const hasStructuredDates = deal.dates && typeof deal.dates === 'object' && !Array.isArray(deal.dates)

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-400">
          <Link href="/" className="hover:text-primary transition-colors">
            Accueil
          </Link>
          <span className="mx-2">›</span>
          <Link href="/deals" className="hover:text-primary transition-colors">
            Deals
          </Link>
          <span className="mx-2">›</span>
          <span className="text-white">{deal.toCity || deal.to}</span>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary/20 to-black border border-primary/30 rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            {flagEmoji && <span className="text-6xl">{flagEmoji}</span>}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                {deal.toCity || deal.to}
              </h1>
              {deal.toCountry && (
                <p className="text-xl text-gray-300">{deal.toCountry}</p>
              )}
            </div>
          </div>

          {deal.description && (
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              {deal.description}
            </p>
          )}

          {deal.activities && deal.activities.length > 0 && (
            <div>
              <h3 className="text-xl font-bold mb-3 text-primary">À faire sur place :</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {deal.activities.map((activity, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-300">
                    <span className="text-primary mt-1">✓</span>
                    <span>{activity}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Flight Ticket Style Section */}
        <div className="bg-gray-900 border-2 border-primary rounded-3xl overflow-hidden mb-8">
          <div className="flex flex-col md:flex-row">
            {/* Left column - Price block (40%) */}
            <div className="md:w-2/5 bg-gradient-to-br from-primary/20 to-black p-8 md:border-r-2 border-primary/30">
              <div className="flex flex-col justify-between h-full">
                <div className="space-y-6">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-400 mb-3">
                      Prix ~ Aller-Retour
                    </p>
                    <p className="text-7xl font-bold text-primary mb-2">
                      {deal.price}€
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-400 mb-3">
                      Réduction
                    </p>
                    <p className="text-6xl font-bold text-green-500 mb-3">
                      {deal.discount}%
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      moins cher que le prix régulier de <span className="font-bold text-white">{deal.originalPrice}€</span> pour ce trajet
                    </p>
                  </div>
                </div>

                <div className="mt-8">
                  <p className="text-xs text-gray-500">
                    *EUR, taxes incluses
                  </p>
                </div>
              </div>
            </div>

            {/* Right column - Flight info (60%) */}
            <div className="md:w-3/5 bg-black/50 p-8">
              <div className="space-y-8">
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-400 mb-6">
                    Trajet
                  </p>

                  <div className="flex items-center justify-center gap-8 mb-6">
                    <div className="text-center">
                      <p className="text-5xl font-bold text-primary mb-3">{deal.from}</p>
                    </div>
                    <div className="text-4xl text-primary">✈</div>
                    <div className="text-center">
                      <p className="text-5xl font-bold text-primary mb-3">{deal.to}</p>
                    </div>
                  </div>

                  <div className="flex items-start justify-between gap-8">
                    <div className="flex-1 text-left">
                      <p className="text-lg font-bold text-white mb-1">
                        {deal.fromCity || deal.from}
                      </p>
                    </div>
                    <div className="flex-1 text-right">
                      <p className="text-lg font-bold text-white mb-1">
                        {deal.toCity || deal.to}{deal.toCountry ? `, ${deal.toCountry}` : ''}
                      </p>
                    </div>
                  </div>
                </div>

                {deal.airline && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-400 mb-4">
                      Compagnie aérienne
                    </p>
                    <p className="text-3xl font-bold text-white mb-2">
                      {deal.airline.toUpperCase()}
                    </p>
                  </div>
                )}

                <div className="pt-6 border-t border-gray-700">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">✓</p>
                      <p className="text-xs text-gray-300">Bagages inclus</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">✓</p>
                      <p className="text-xs text-gray-300">Annulation flexible</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">✓</p>
                      <p className="text-xs text-gray-300">Sièges réservés</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dates Section */}
        {hasStructuredDates && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-6">Dates disponibles</h2>
            <p className="text-gray-400 mb-6">
              Sélectionnez un mois pour voir toutes les dates disponibles à prix réduit
            </p>

            <div className="space-y-4">
              {Object.entries(deal.dates as Record<string, DateEntry[]>).map(([month, dates]) => (
                <div key={month} className="border border-gray-700 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleMonth(month)}
                    className="w-full bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 px-6 py-4 flex items-center justify-between transition-all"
                  >
                    <span className="text-xl font-bold">{month}</span>
                    <span className="text-2xl text-primary transform transition-transform" style={{
                      transform: expandedMonths[month] ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}>
                      ▼
                    </span>
                  </button>

                  {expandedMonths[month] && (
                    <div className="bg-black/50 p-6 space-y-3">
                      {dates.map((dateOption, index) => (
                        <div
                          key={index}
                          className="bg-gray-900 border border-gray-700 rounded-lg p-4 flex items-center justify-between hover:border-primary/50 transition-all"
                        >
                          <div className="flex-1">
                            <p className="text-lg font-bold text-white mb-1">{dateOption.date}</p>
                            <p className="text-sm text-gray-400">Vol aller-retour</p>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-3xl font-bold text-primary">{dateOption.price}€</p>
                              <p className="text-xs text-gray-400">par personne</p>
                            </div>

                            {(dateOption.url || deal.url) && (
                              <a
                                href={dateOption.url || deal.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-primary hover:bg-primary-dark text-white font-bold px-6 py-3 rounded-lg transition-all transform hover:scale-105"
                              >
                                Réserver
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fallback: plain string dates */}
        {deal.dates && typeof deal.dates === 'string' && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-4">Dates disponibles</h2>
            <p className="text-gray-300 text-lg">{deal.dates}</p>
            {deal.url && (
              <a
                href={deal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 bg-primary hover:bg-primary-dark text-white font-bold px-8 py-3 rounded-lg transition-all transform hover:scale-105"
              >
                Réserver
              </a>
            )}
          </div>
        )}

        {/* CTA Footer */}
        <div className="mt-8 bg-gradient-to-r from-primary/20 to-transparent border-l-4 border-primary rounded-lg p-6">
          <p className="text-lg text-gray-300">
            <span className="text-primary font-bold">Astuce :</span> Les prix peuvent varier selon la disponibilité. Réservez rapidement pour profiter des meilleurs tarifs !
          </p>
        </div>
      </div>
    </div>
  )
}
