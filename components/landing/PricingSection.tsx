'use client'

import Link from 'next/link'
import { PLANS } from '@/lib/utils'
import Badge from '@/components/ui/Badge'
import { useInViewport } from '@/hooks/useInViewport'

export default function PricingSection() {
  const { elementRef, isInViewport } = useInViewport({ threshold: 0.1, triggerOnce: true })

  return (
    <section
      ref={elementRef as React.RefObject<HTMLElement>}
      className="py-16 px-4 relative"
      id="tarifs"
    >
      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Header */}
        <div className={`text-center mb-10 transition-all duration-700 ${isInViewport ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="heading-lg mb-4">
            Choisissez votre <span className="text-primary">plan</span>
          </h2>
          <p className="text-gray-300 text-xl leading-relaxed max-w-2xl mx-auto">
            Commencez gratuitement, passez au premium quand vous voulez
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <div className={`glass-card hover-lift flex flex-col transition-all duration-700 ${isInViewport ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="mb-8">
              <h3 className="text-3xl font-bold mb-3">{PLANS.free.name}</h3>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-6xl font-bold font-mono">
                  {PLANS.free.price}€
                </span>
                <span className="text-gray-400 text-lg">/mois</span>
              </div>
              <p className="text-gray-500 text-sm">Pour toujours</p>
            </div>

            <ul className="space-y-4 mb-6 flex-1">
              {PLANS.free.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300 leading-relaxed">{feature}</span>
                </li>
              ))}
              {PLANS.free.limitations?.map((limitation, index) => (
                <li key={`limit-${index}`} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-gray-400 leading-relaxed">{limitation}</span>
                </li>
              ))}
            </ul>

            <Link href="/signup?plan=free" className="mt-auto">
              <button className="w-full bg-white hover:bg-gray-100 text-black font-bold py-4 rounded-lg transition-all duration-200 transform hover:scale-105">
                Commencer gratuitement
              </button>
            </Link>
          </div>

          {/* Premium Plan */}
          <div
            className={`glass-card hover-lift flex flex-col relative transition-all duration-700 ${isInViewport ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transitionDelay: '150ms' }}
          >
            {/* Popular badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-white text-black text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                POPULAIRE
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-3xl font-bold mb-3">{PLANS.premium.name}</h3>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-6xl font-bold font-mono text-primary">
                  {PLANS.premium.price}€
                </span>
                <span className="text-gray-400 text-lg">/mois</span>
              </div>
              <p className="text-gray-400 text-sm">
                ou {PLANS.premium.priceQuarterly}€/trimestre ou {PLANS.premium.priceYearly}€/an
              </p>
            </div>

            <ul className="space-y-4 mb-6 flex-1">
              {PLANS.premium.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300 leading-relaxed">{feature}</span>
                </li>
              ))}
            </ul>

            <Link href="/signup?plan=premium" className="mt-auto">
              <button className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg shadow-primary/30">
                Passer au premium
              </button>
            </Link>
          </div>
        </div>

        {/* Trust badges */}
        <div className={`text-center mt-10 space-y-3 transition-all duration-700 ${isInViewport ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '300ms' }}>
          <div className="flex flex-wrap justify-center gap-6 text-gray-400 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Annulation a tout moment</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Sans engagement</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Paiement securise par Stripe</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
