'use client';

import { useEffect, useState } from 'react'
import DealCard from './DealCard'
import { DealData } from '@/lib/types'
import { useInViewport } from '@/hooks/useInViewport'

// Deals par défaut si aucun deal en base
const fallbackDeals: (DealData & { publishedAgo: string })[] = [
  {
    id: '1',
    from: 'Paris',
    to: 'Reykjavik',
    price: 99,
    originalPrice: 450,
    currency: 'EUR',
    dates: 'Printemps 2026',
    discount: 78,
    createdAt: new Date(),
    publishedAgo: 'il y a 3 heures',
  },
  {
    id: '2',
    from: 'Paris',
    to: 'Marrakech',
    price: 30,
    originalPrice: 280,
    currency: 'EUR',
    dates: 'Hiver 2026',
    discount: 89,
    createdAt: new Date(),
    publishedAgo: 'il y a 1 jour',
  },
  {
    id: '3',
    from: 'Lyon',
    to: 'Tokyo',
    price: 329,
    originalPrice: 950,
    currency: 'EUR',
    dates: 'Été 2026',
    discount: 65,
    createdAt: new Date(),
    publishedAgo: 'il y a 3 jours',
  },
]

// Fonction pour calculer le temps écoulé
function getTimeAgo(date: Date | string): string {
  const now = new Date()
  const past = new Date(date)
  const diffMs = now.getTime() - past.getTime()
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMinutes < 1) {
    return "à l'instant"
  } else if (diffMinutes < 60) {
    return `il y a ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`
  } else if (diffHours < 24) {
    return `il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`
  } else if (diffDays === 1) {
    return 'il y a 1 jour'
  } else {
    return `il y a ${diffDays} jours`
  }
}

export default function DealsSection() {
  const { elementRef, isInViewport } = useInViewport({ threshold: 0.1, triggerOnce: true });
  const [deals, setDeals] = useState<(DealData & { publishedAgo: string })[]>(fallbackDeals);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const response = await fetch('/api/deals/recent')
        const data = await response.json()

        if (data.success && data.deals && data.deals.length > 0) {
          // Transformer les deals de la BDD au format attendu
          const formattedDeals = data.deals.map((deal: any) => ({
            id: deal.id,
            from: deal.from,
            to: deal.to,
            price: deal.price,
            originalPrice: deal.originalPrice,
            currency: deal.currency || 'EUR',
            dates: deal.dates || 'Dates flexibles',
            discount: deal.discount,
            createdAt: new Date(deal.createdAt),
            publishedAgo: getTimeAgo(deal.createdAt),
          }))
          setDeals(formattedDeals)
        }
        // Si pas de deals, on garde les fallback
      } catch (error) {
        console.error('Erreur chargement deals:', error)
        // En cas d'erreur, on garde les fallback
      } finally {
        setLoading(false)
      }
    }

    fetchDeals()

    // Mettre à jour les temps "il y a X" toutes les minutes
    const interval = setInterval(() => {
      setDeals(prevDeals =>
        prevDeals.map(deal => ({
          ...deal,
          publishedAgo: deal.createdAt ? getTimeAgo(deal.createdAt) : deal.publishedAgo,
        }))
      )
    }, 60000) // 1 minute

    return () => clearInterval(interval)
  }, [])

  return (
    <section ref={elementRef as React.RefObject<HTMLElement>} className="py-16 px-4 relative">
      <div className="container mx-auto relative z-10">
        {/* Header minimal */}
        <div className={`text-center mb-8 transition-all duration-700 ${isInViewport ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="heading-md">
            <span className="text-primary">Deals</span> du moment
          </h2>
        </div>

        {/* Deals list */}
        <div className="flex flex-col gap-4 max-w-4xl mx-auto">
          {deals.map((deal, index) => (
            <div
              key={deal.id}
              className={`transition-all duration-500 ${isInViewport ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <DealCard deal={deal} publishedAgo={deal.publishedAgo} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
