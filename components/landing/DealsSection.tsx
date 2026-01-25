'use client';

import DealCard from './DealCard'
import { DealData } from '@/lib/types'
import { useInViewport } from '@/hooks/useInViewport'

const exampleDeals: DealData[] = [
  {
    id: '1',
    from: 'Paris',
    to: 'Reykjavik',
    price: 99,
    originalPrice: 450,
    currency: 'EUR',
    dates: 'Mars - Mai 2026',
    discount: 78,
    createdAt: new Date(),
  },
  {
    id: '2',
    from: 'Paris',
    to: 'Marrakech',
    price: 30,
    originalPrice: 280,
    currency: 'EUR',
    dates: 'Février - Avril 2026',
    discount: 89,
    createdAt: new Date(),
  },
  {
    id: '3',
    from: 'Lyon',
    to: 'Tokyo',
    price: 329,
    originalPrice: 950,
    currency: 'EUR',
    dates: 'Avril - Juin 2026',
    discount: 65,
    createdAt: new Date(),
  },
]

export default function DealsSection() {
  const { elementRef, isInViewport } = useInViewport({ threshold: 0.1, triggerOnce: true });

  return (
    <section ref={elementRef as React.RefObject<HTMLElement>} className="py-16 px-4 relative">
      <div className="container mx-auto relative z-10">
        {/* Header */}
        <div className={`text-center mb-10 transition-all duration-700 ${isInViewport ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="heading-md mb-4">
            Exemples de <span className="text-primary">deals récents</span>
          </h2>
          <p className="subtitle max-w-2xl mx-auto">
            Voici le type de deals que nos membres recoivent regulierement par email
          </p>
        </div>

        {/* Deals list using DealCard component */}
        <div className="flex flex-col gap-4 max-w-5xl mx-auto">
          {exampleDeals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
      </div>
    </section>
  )
}
