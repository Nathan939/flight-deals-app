'use client';

import Link from 'next/link'
import DealCard from './DealCard'
import { DealData } from '@/lib/types'
import { useInViewport } from '@/hooks/useInViewport'
import Badge from '@/components/ui/Badge'

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
    <section ref={elementRef as React.RefObject<HTMLElement>} className="py-32 px-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/50 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.05)_0%,transparent_70%)]" />

      <div className="container mx-auto relative z-10">
        {/* Header with improved spacing */}
        <div className={`text-center mb-16 transition-all duration-700 ${isInViewport ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Badge variant="primary" className="mb-6 animate-pulse-slow">
            🔥 Deals récents
          </Badge>
          <h2 className="heading-lg mb-6">
            Exemples de <span className="text-primary">deals exclusifs</span>
          </h2>
          <p className="text-gray-300 text-xl leading-relaxed max-w-2xl mx-auto">
            Voici le type de deals que nos membres reçoivent régulièrement par email et SMS
          </p>
        </div>

        {/* Deals grid with improved spacing */}
        <div className="flex flex-col gap-6 max-w-5xl mx-auto">
          {exampleDeals.map((deal, index) => (
            <div
              key={deal.id}
              className={`transition-all duration-700 ${isInViewport ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <DealCard deal={deal} />
            </div>
          ))}
        </div>

        {/* CTA section with glass card */}
        <div className={`text-center mt-16 transition-all duration-700 ${isInViewport ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '600ms' }}>
          <div className="glass-card max-w-2xl mx-auto p-8">
            <p className="text-primary font-bold text-2xl mb-4">
              ⚡ Ne ratez plus jamais un bon plan !
            </p>
            <p className="text-gray-400 mb-6">
              Recevez les meilleures offres directement dans votre boîte mail
            </p>
            <Link href="/signup">
              <button className="bg-primary hover:bg-primary-dark text-white font-bold py-4 px-10 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg shadow-primary/30">
                Commencer gratuitement
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
