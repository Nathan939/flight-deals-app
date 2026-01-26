'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import Button from '../ui/Button'
import WorldMap from '../ui/WorldMap'

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
    <section className="relative py-20 px-4 min-h-[75vh] flex items-center overflow-hidden">
      {/* World map background layer - between bg and content */}
      <WorldMap />

      <div className="container mx-auto relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Main heading */}
          <h1 className="heading-xl mb-6 animate-fade-in-up">
            Marre de payer vos{' '}
            <span className="text-primary">billets trop cher</span>{' '}
            ?
          </h1>

          {/* Subheading */}
          <p className="subtitle mb-10 animate-fade-in-up max-w-3xl mx-auto" style={{ animationDelay: '0.1s' }}>
            Nous analysons les prix des vols en continu pour détecter les vraies opportunités.
          </p>

          {/* CTA with glass effect */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up mb-8" style={{ animationDelay: '0.2s' }}>
            {isLoggedIn ? (
              <Link href="/recherche">
                <Button variant="primary" size="large" className="text-xl px-12 py-4 shadow-lg shadow-primary/30 tracking-wide" style={{ fontFamily: 'Impact, Arial Narrow, sans-serif', fontWeight: 400 }}>
                  Rechercher des vols
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/signup">
                  <Button variant="primary" size="large" className="text-xl px-12 py-4 shadow-lg shadow-primary/30 tracking-wide" style={{ fontFamily: 'Impact, Arial Narrow, sans-serif', fontWeight: 400 }}>
                    S'inscrire gratuitement
                  </Button>
                </Link>
                <Link href="#tarifs">
                  <Button variant="glass" size="large" className="text-xl px-12 py-4 tracking-wide" style={{ fontFamily: 'Impact, Arial Narrow, sans-serif', fontWeight: 400 }}>
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
        </div>
      </div>
    </section>
  )
}
