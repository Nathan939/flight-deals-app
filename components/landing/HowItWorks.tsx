'use client';

import Link from 'next/link'
import { useInViewport } from '@/hooks/useInViewport';
import Badge from '@/components/ui/Badge'

export default function HowItWorks() {
  const { elementRef, isInViewport } = useInViewport({ threshold: 0.2, triggerOnce: true });

  const steps = [
    {
      number: '1',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      title: 'Inscrivez-vous gratuitement',
      description:
        'Créez votre compte en 30 secondes. Choisissez vos destinations préférées ou suivez le monde entier.',
    },
    {
      number: '2',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      title: 'Nous trouvons les deals',
      description:
        'Notre algorithme scanne des milliers de vols chaque jour pour dénicher les meilleurs prix et erreurs tarifaires.',
    },
    {
      number: '3',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
      title: 'Recevez les alertes',
      description:
        'Soyez averti par email (gratuit) ou SMS (premium) dès qu\'un deal correspond à vos critères. Réservez avant qu\'il ne disparaisse!',
    },
  ]

  return (
    <section ref={elementRef as React.RefObject<HTMLElement>} className="py-32 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/20 to-black" />

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Header */}
        <div className={`text-center mb-20 transition-all duration-700 ${isInViewport ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Badge variant="primary" className="mb-6">
            ⚡ Simple & Efficace
          </Badge>
          <h2 className="heading-lg mb-6">
            Comment ça marche ?
          </h2>
          <p className="text-gray-300 text-xl leading-relaxed max-w-2xl mx-auto">
            3 étapes simples pour ne plus jamais rater un bon plan
          </p>
        </div>

        {/* Steps with timeline */}
        <div className="relative max-w-5xl mx-auto">
          {/* Timeline line (desktop only) */}
          <div className="hidden md:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary/50 to-primary/20" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`relative text-center transition-all duration-700 ${isInViewport ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                {/* Number badge with icon */}
                <div className="relative inline-block mb-6">
                  <div className="glass-card w-24 h-24 flex items-center justify-center mx-auto hover-lift hover-glow border-2 border-primary/30">
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 bg-primary w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg shadow-primary/50">
                    {step.number}
                  </div>
                </div>

                <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Card */}
        <div className={`mt-20 transition-all duration-700 ${isInViewport ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`} style={{ transitionDelay: '600ms' }}>
          <div className="glass-card max-w-3xl mx-auto p-10 text-center border-2 border-primary/30">
            <div className="mb-6">
              <span className="text-6xl">💰</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              En moyenne, nos membres économisent{' '}
              <span className="text-primary font-mono">300€</span> par an
            </h3>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Rejoignez plus de 10 000 voyageurs malins qui ne payent plus jamais le prix fort
            </p>
            <Link href="/signup">
              <button className="bg-white text-black hover:bg-gray-100 font-bold py-4 px-10 rounded-lg transition-all duration-200 transform hover:scale-105">
                Je veux économiser aussi
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
