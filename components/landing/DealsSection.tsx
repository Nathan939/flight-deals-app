'use client';

import Link from 'next/link'
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
    dates: 'Fevrier - Avril 2026',
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
          <p className="subtitle text-gray-300 max-w-2xl mx-auto">
            Voici le type de deals que nos membres recoivent regulierement par email
          </p>
        </div>

        {/* Deals horizontal list */}
        <div className="flex flex-col gap-4 max-w-4xl mx-auto">
          {exampleDeals.map((deal, index) => (
            <div
              key={deal.id}
              className={`transition-all duration-700 ${isInViewport ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="glass-card hover-lift group overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Route */}
                  <div className="flex items-center gap-3 md:min-w-[200px]">
                    <div className="text-center">
                      <div className="text-2xl font-bold font-mono">{deal.from.substring(0, 3).toUpperCase()}</div>
                      <div className="text-xs text-gray-400">{deal.from}</div>
                    </div>
                    <div className="flex items-center px-2">
                      <div className="w-8 h-px bg-gradient-to-r from-transparent to-primary/50" />
                      <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                      <div className="w-8 h-px bg-gradient-to-r from-primary/50 to-transparent" />
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold font-mono">{deal.to.substring(0, 3).toUpperCase()}</div>
                      <div className="text-xs text-gray-400">{deal.to}</div>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {deal.dates}
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-primary font-mono">{deal.price}€</span>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500 line-through">{deal.originalPrice}€</span>
                      <span className="text-xs text-green-500 font-bold">-{deal.discount}%</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Link href="/signup" className="md:ml-auto">
                    <button className="w-full md:w-auto bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-lg transition-all duration-200 transform group-hover:scale-105 whitespace-nowrap">
                      Voir les dates
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
