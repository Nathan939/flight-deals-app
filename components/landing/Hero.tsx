'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import Button from '../ui/Button'

export default function Hero() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem('user')
      setIsLoggedIn(!!user)
    }

    checkAuth()
    window.addEventListener('storage', checkAuth)
    window.addEventListener('auth-change', checkAuth)

    return () => {
      window.removeEventListener('storage', checkAuth)
      window.removeEventListener('auth-change', checkAuth)
    }
  }, [])

  return (
    <section className="relative py-32 px-4 overflow-hidden min-h-[85vh] flex items-center">
      {/* Animated gradient background */}
      <div className="absolute inset-0 gradient-radial-primary pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-black pointer-events-none" />

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Main heading with improved typography */}
          <h1 className="heading-xl mb-8 animate-fade-in-up">
            Marre de payer vos{' '}
            <span className="text-primary relative inline-block">
              billets trop cher
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-primary/30 blur-sm" />
            </span>{' '}
            ?
          </h1>

          {/* Subheading with better spacing */}
          <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed animate-fade-in-up max-w-3xl mx-auto" style={{ animationDelay: '0.1s' }}>
            On déniche pour vous les meilleures affaires de vols et vous alerte en temps réel
          </p>

          {/* CTA with glass effect */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up mb-8" style={{ animationDelay: '0.2s' }}>
            {isLoggedIn ? (
              <Link href="/destinations">
                <Button variant="primary" size="large" className="text-xl px-12 py-4 shadow-lg shadow-primary/30">
                  Rechercher des destinations
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/signup">
                  <Button variant="primary" size="large" className="text-xl px-12 py-4 shadow-lg shadow-primary/30">
                    S'inscrire gratuitement
                  </Button>
                </Link>
                <Link href="#tarifs">
                  <Button variant="glass" size="large" className="text-xl px-12 py-4">
                    Voir les tarifs
                  </Button>
                </Link>
              </>
            )}
          </div>

          {!isLoggedIn && (
            <p className="text-gray-400 text-sm animate-fade-in-up flex items-center justify-center gap-2" style={{ animationDelay: '0.3s' }}>
              <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Pas de carte bancaire requise pour le plan gratuit
            </p>
          )}

          {/* Stats section */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="glass-card text-center hover-lift">
              <div className="text-4xl font-bold text-primary mb-2">-76%</div>
              <div className="text-gray-400 text-sm">Économie moyenne</div>
            </div>
            <div className="glass-card text-center hover-lift">
              <div className="text-4xl font-bold text-primary mb-2">2x/sem</div>
              <div className="text-gray-400 text-sm">Nouveaux deals</div>
            </div>
            <div className="glass-card text-center hover-lift">
              <div className="text-4xl font-bold text-primary mb-2">12h</div>
              <div className="text-gray-400 text-sm">d'avance (Premium)</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
