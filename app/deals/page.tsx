'use client'

import { useState, useEffect } from 'react'
import FlightTicketCard from '@/components/ui/FlightTicketCard'

interface Deal {
  id: string
  from: string
  to: string
  price: number
  originalPrice: number
  discount: number
  currency: string
  dates?: string
  url?: string
  createdAt: string
  expiresAt?: string
}

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDeals()
  }, [])

  const fetchDeals = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/deals/list')
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Erreur lors du chargement des deals')
      }

      setDeals(data.deals || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const isExpired = (expiresAt?: string) => {
    if (!expiresAt) return false
    return new Date(expiresAt) < new Date()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(date)
  }

  const activeDeals = deals.filter((deal) => !isExpired(deal.expiresAt))
  const expiredDeals = deals.filter((deal) => isExpired(deal.expiresAt))

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="heading-lg mb-4">🔥 Deals du Jour</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Découvrez les meilleurs deals de vols sélectionnés spécialement pour vous.
            Ces offres sont également envoyées par email à nos abonnés.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="text-gray-400 mt-4">Chargement des deals...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="glass-card text-center py-12 animate-scale-in">
            <div className="text-6xl mb-4">⚠️</div>
            <p className="text-red-500 text-lg mb-2">Erreur</p>
            <p className="text-gray-400">{error}</p>
            <button
              onClick={fetchDeals}
              className="mt-6 btn-primary"
            >
              Réessayer
            </button>
          </div>
        )}

        {/* Empty State - No Deals Yet */}
        {!loading && !error && deals.length === 0 && (
          <div className="glass-card text-center py-16 animate-fade-in-up">
            <div className="text-8xl mb-6">✉️</div>
            <h2 className="text-3xl font-bold mb-4">Aucun deal pour le moment</h2>
            <p className="text-gray-300 text-lg mb-2 max-w-md mx-auto">
              Les deals n'ont pas encore été envoyés par email. Revenez bientôt ou inscrivez-vous
              pour être alerté dès qu'un nouveau deal est disponible !
            </p>
            <div className="flex gap-4 justify-center mt-8">
              <a href="/signup" className="btn-primary">
                S'inscrire gratuitement
              </a>
              <a href="/destinations" className="btn-outline">
                Suivre des destinations
              </a>
            </div>
          </div>
        )}

        {/* Active Deals */}
        {!loading && !error && activeDeals.length > 0 && (
          <div className="space-y-8 mb-12">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                🎯 Deals Actifs ({activeDeals.length})
              </h2>
              <div className="text-sm text-gray-400">
                Mis à jour {formatDate(new Date().toISOString())}
              </div>
            </div>

            <div className="space-y-6">
              {activeDeals.map((deal, index) => (
                <div
                  key={deal.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <FlightTicketCard
                    from={deal.from}
                    to={deal.to}
                    price={deal.price}
                    originalPrice={deal.originalPrice}
                    discount={deal.discount}
                    currency={deal.currency}
                    dates={deal.dates}
                    bookingUrl={deal.url}
                  />
                  {deal.expiresAt && (
                    <div className="text-center mt-2 text-sm text-gray-400">
                      ⏰ Expire le {formatDate(deal.expiresAt)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Expired Deals */}
        {!loading && !error && expiredDeals.length > 0 && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-500">
                📦 Deals Expirés ({expiredDeals.length})
              </h2>
            </div>

            <div className="space-y-6 opacity-50">
              {expiredDeals.map((deal, index) => (
                <div
                  key={deal.id}
                  className="relative"
                >
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
                    <div className="bg-gray-800/90 text-gray-300 px-6 py-2 rounded-full font-bold text-sm border border-gray-600">
                      ⏰ Expiré
                    </div>
                  </div>
                  <FlightTicketCard
                    from={deal.from}
                    to={deal.to}
                    price={deal.price}
                    originalPrice={deal.originalPrice}
                    discount={deal.discount}
                    currency={deal.currency}
                    dates={deal.dates}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        {!loading && !error && activeDeals.length > 0 && (
          <div className="mt-16 glass-card text-center py-12 animate-fade-in-up">
            <h3 className="text-2xl font-bold mb-4">
              Ne manquez plus aucun deal ! 🎯
            </h3>
            <p className="text-gray-300 mb-6 max-w-lg mx-auto">
              Inscrivez-vous gratuitement pour recevoir ces deals directement par email,
              ou passez en premium pour les recevoir par SMS en temps réel.
            </p>
            <div className="flex gap-4 justify-center">
              <a href="/signup?plan=free" className="btn-outline">
                Gratuit - Email
              </a>
              <a href="/signup?plan=premium" className="btn-primary">
                Premium - SMS + Email
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
