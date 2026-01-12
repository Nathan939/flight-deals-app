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
      className="py-32 px-4 relative overflow-hidden"
      id="tarifs"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/30 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.03)_0%,transparent_70%)]" />

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Header */}
        <div className={`text-center mb-20 transition-all duration-700 ${isInViewport ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Badge variant="primary" className="mb-6">
            💎 Tarifs
          </Badge>
          <h2 className="heading-lg mb-6">
            Choisissez votre <span className="text-primary">plan</span>
          </h2>
          <p className="text-gray-300 text-xl leading-relaxed max-w-2xl mx-auto">
            Commencez gratuitement, passez au premium quand vous voulez
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <div className={`glass-card hover-lift transition-all duration-700 ${isInViewport ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
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

            <ul className="space-y-4 mb-10">
              {PLANS.free.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300 leading-relaxed">{feature}</span>
                </li>
              ))}
            </ul>

            <Link href="/signup?plan=free">
              <button className="w-full bg-white hover:bg-gray-100 text-black font-bold py-4 rounded-lg transition-all duration-200 transform hover:scale-105">
                Commencer gratuitement
              </button>
            </Link>
          </div>

          {/* Premium Plan */}
          <div
            className={`glass-card hover-lift border-2 border-primary relative transition-all duration-700 ${isInViewport ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transitionDelay: '150ms' }}
          >
            {/* Popular badge with pulse */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <Badge variant="primary" className="animate-pulse-slow shadow-lg shadow-primary/50">
                🔥 POPULAIRE
              </Badge>
            </div>

            <div className="mb-8">
              <h3 className="text-3xl font-bold mb-3 text-primary">{PLANS.premium.name}</h3>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-6xl font-bold text-primary font-mono">
                  {PLANS.premium.price}€
                </span>
                <span className="text-gray-400 text-lg">/mois</span>
              </div>
              <p className="text-gray-400 text-sm">ou {PLANS.premium.priceYearly}€/an (économisez 2 mois)</p>
            </div>

            <ul className="space-y-4 mb-10">
              {PLANS.premium.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300 leading-relaxed">{feature}</span>
                </li>
              ))}
            </ul>

            <Link href="/upgrade">
              <button className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg shadow-primary/30">
                Passer au premium
              </button>
            </Link>
          </div>
        </div>

        {/* Trust badges */}
        <div className={`text-center mt-16 space-y-3 transition-all duration-700 ${isInViewport ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '300ms' }}>
          <div className="flex flex-wrap justify-center gap-6 text-gray-400 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Annulation à tout moment</span>
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
              <span>Paiement sécurisé par Stripe</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
