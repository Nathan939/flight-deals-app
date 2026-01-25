'use client';

import DealCard from './DealCard'
import { DealData } from '@/lib/types'
import { useInViewport } from '@/hooks/useInViewport'

const exampleDeals: (DealData & { publishedAgo: string })[] = [
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

export default function DealsSection() {
  const { elementRef, isInViewport } = useInViewport({ threshold: 0.1, triggerOnce: true });

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
          {exampleDeals.map((deal, index) => (
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
