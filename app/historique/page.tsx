'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface DealHistory {
  id: string
  from: string
  to: string
  price: number
  originalPrice: number
  currency: string
  discount: number
  dates: string[] | null
  url: string | null
  sentAt: string | null
  channel: string
  expiresAt: string | null
  isExpired: boolean
}

export default function DealsHistory() {
  const router = useRouter()
  const [deals, setDeals] = useState<DealHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    try {
      // Get user from localStorage
      const userStr = localStorage.getItem('user')
      if (!userStr) {
        router.push('/login')
        return
      }

      const user = JSON.parse(userStr)

      // Fetch history
      const response = await fetch(`/api/deals/history?userId=${user.id}`)
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Erreur lors du chargement')
      }

      setDeals(data.deals || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Date inconnue'
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-300">Chargement de l'historique...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="heading-lg mb-4">Historique de vos deals</h1>
          <p className="text-gray-300 text-lg">
            Retrouvez tous les deals que vous avez reçus par email ou SMS
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-6 py-4 rounded-lg mb-8">
            {error}
          </div>
        )}

        {/* Empty State */}
        {deals.length === 0 && !error && (
          <div className="glass-card text-center py-16">
            <svg className="w-16 h-16 mx-auto mb-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            <h2 className="text-2xl font-bold mb-4">Aucun deal reçu pour le moment</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Vous n'avez pas encore reçu de deals. Configurez vos destinations favorites pour
              commencer à recevoir des alertes !
            </p>
            <Link
              href="/destinations"
              className="inline-block bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-lg transition-all duration-200"
            >
              Configurer mes destinations →
            </Link>
          </div>
        )}

        {/* Deals List */}
        {deals.length > 0 && (
          <div className="space-y-4">
            <div className="text-gray-400 mb-4">
              {deals.length} deal{deals.length > 1 ? 's' : ''} reçu{deals.length > 1 ? 's' : ''}
            </div>

            {deals.map((deal) => (
              <div
                key={deal.id}
                className={`glass-card ${
                  deal.isExpired ? 'opacity-60' : 'hover:border-primary/50'
                } transition-all`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Deal Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold">
                        {deal.from} → {deal.to}
                      </h3>
                      {deal.isExpired && (
                        <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">
                          Expiré
                        </span>
                      )}
                      <span className="text-xs bg-white/10 text-gray-300 px-2 py-1 rounded">
                        {deal.channel === 'email' ? 'Email' : 'SMS'}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 mb-3">
                      <div className="text-3xl font-bold text-primary">
                        {deal.price.toFixed(0)} {deal.currency}
                      </div>
                      <div className="text-sm text-gray-400 line-through">
                        {deal.originalPrice.toFixed(0)} {deal.currency}
                      </div>
                      <div className="text-sm font-bold text-green-400">
                        -{deal.discount}%
                      </div>
                    </div>

                    <div className="text-sm text-gray-400 space-y-1">
                      <div>Recu le {formatDate(deal.sentAt)}</div>
                      {deal.expiresAt && (
                        <div>
                          Expire le{' '}
                          {formatDate(deal.expiresAt)}
                        </div>
                      )}
                      {deal.dates && deal.dates.length > 0 && (
                        <div className="mt-2">
                          <span className="text-gray-300 font-medium">Dates disponibles:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {deal.dates.slice(0, 5).map((date: string, idx: number) => (
                              <span
                                key={idx}
                                className="text-xs bg-white/5 px-2 py-1 rounded"
                              >
                                {date}
                              </span>
                            ))}
                            {deal.dates.length > 5 && (
                              <span className="text-xs text-gray-500 px-2 py-1">
                                +{deal.dates.length - 5} autres
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="flex flex-col gap-2">
                    {deal.url && !deal.isExpired ? (
                      <a
                        href={deal.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 text-center whitespace-nowrap"
                      >
                        Voir le deal →
                      </a>
                    ) : deal.isExpired ? (
                      <button
                        disabled
                        className="bg-gray-700 text-gray-400 font-bold py-3 px-6 rounded-lg cursor-not-allowed"
                      >
                        Deal expiré
                      </button>
                    ) : (
                      <button
                        disabled
                        className="bg-gray-700 text-gray-400 font-bold py-3 px-6 rounded-lg cursor-not-allowed text-sm"
                      >
                        Lien indisponible
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link href="/destinations" className="text-primary hover:text-primary-light transition-colors">
            ← Retour à mes destinations
          </Link>
        </div>
      </div>
    </div>
  )
}
