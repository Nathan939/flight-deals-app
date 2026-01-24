'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { PLANS } from '@/lib/utils'
import { useInViewport } from '@/hooks/useInViewport'

interface User {
  id: string
  email: string
  subscription?: {
    plan: 'free' | 'premium'
    status: 'active' | 'inactive' | 'cancelled'
  }
}

export default function PricingSection() {
  const { elementRef, isInViewport } = useInViewport({ threshold: 0.1, triggerOnce: true })
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser))
        } catch {
          setUser(null)
        }
      } else {
        setUser(null)
      }
    }

    checkAuth()
    window.addEventListener('storage', checkAuth)
    window.addEventListener('auth-change', checkAuth)

    return () => {
      window.removeEventListener('storage', checkAuth)
      window.removeEventListener('auth-change', checkAuth)
    }
  }, [])

  const isPremium = user?.subscription?.plan === 'premium' && user?.subscription?.status === 'active'
  const isFreeUser = user && user.subscription?.plan === 'free'

  // For logged-in free users: show premium upsell
  if (isFreeUser) {
    return (
      <section
        ref={elementRef as React.RefObject<HTMLElement>}
        className="py-20 px-4 relative"
        id="tarifs"
      >
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className={`text-center transition-all duration-700 ${isInViewport ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="text-primary font-medium mb-4 tracking-wide">PASSEZ A LA VITESSE SUPERIEURE</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Nos membres Premium<br />
              <span className="text-primary">economisent en moyenne 340€</span><br />
              par voyage
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              Rejoignez les voyageurs malins qui recoivent les meilleures offres en priorite
            </p>
          </div>

          <div className={`grid md:grid-cols-3 gap-8 mb-12 transition-all duration-700 ${isInViewport ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '150ms' }}>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Acces prioritaire</h3>
              <p className="text-gray-400 leading-relaxed">
                Recevez les deals avant tout le monde. Les meilleures offres partent en quelques heures.
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Vos destinations</h3>
              <p className="text-gray-400 leading-relaxed">
                On scrute les prix pour vos destinations preferees. Vous revez de Bali ? On surveille pour vous.
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Economies garanties</h3>
              <p className="text-gray-400 leading-relaxed">
                Un seul vol reserve grace a nos alertes rembourse votre abonnement pour l'annee entiere.
              </p>
            </div>
          </div>

          <div className={`text-center transition-all duration-700 ${isInViewport ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '300ms' }}>
            <p className="text-3xl font-bold mb-2">
              <span className="text-primary">{PLANS.premium.price}€</span>
              <span className="text-lg text-gray-400 font-normal">/mois</span>
            </p>
            <p className="text-gray-500 mb-6">Sans engagement - Annulez quand vous voulez</p>
            <Link href="/upgrade">
              <button className="bg-primary hover:bg-primary-dark text-white font-bold py-4 px-12 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg shadow-primary/30 text-lg">
                Devenir Premium
              </button>
            </Link>
          </div>
        </div>
      </section>
    )
  }

  // For premium users: show thank you message
  if (isPremium) {
    return (
      <section
        ref={elementRef as React.RefObject<HTMLElement>}
        className="py-16 px-4 relative"
        id="tarifs"
      >
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className={`text-center transition-all duration-700 ${isInViewport ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 mb-6">
              <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Merci d'etre <span className="text-primary">Premium</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-xl mx-auto">
              Vous profitez de tous les avantages Premium. On s'occupe de trouver les meilleurs deals pour vous.
            </p>
            <Link href="/upgrade">
              <button className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-8 rounded-lg transition-all duration-200 border border-white/20">
                Gerer mon abonnement
              </button>
            </Link>
          </div>
        </div>
      </section>
    )
  }

  // For non-logged users: show both plans
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
