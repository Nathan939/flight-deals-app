'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

// Liste des emails admin
const ADMIN_EMAILS = ['sylvain.raynaud31@orange.fr']

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = () => {
      const userStr = localStorage.getItem('user')
      setIsLoggedIn(!!userStr)

      if (userStr) {
        try {
          const user = JSON.parse(userStr)
          setIsAdmin(ADMIN_EMAILS.includes(user.email?.toLowerCase()))
        } catch {
          setIsAdmin(false)
        }
      } else {
        setIsAdmin(false)
      }
    }

    checkAuth()

    // Listen for storage changes (login/logout events)
    window.addEventListener('storage', checkAuth)

    // Custom event for same-tab updates
    window.addEventListener('auth-change', checkAuth)

    return () => {
      window.removeEventListener('storage', checkAuth)
      window.removeEventListener('auth-change', checkAuth)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    window.dispatchEvent(new Event('auth-change'))
    window.location.href = '/'
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/5">
      <nav className="container mx-auto px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo gauche */}
          <Link href="/" className="text-2xl font-bold text-white font-mono hover:text-primary transition-colors">
            FlightAlert
          </Link>

          {/* Desktop Menu - Droite */}
          <div className="hidden md:flex items-center gap-3">
            {/* Search Button - Premium Flight Search */}
            <Link
              href="/recherche"
              className="p-2.5 rounded-full hover:bg-white/10 transition-all duration-200 group"
              title="Recherche de vols (Premium)"
            >
              <svg className="w-6 h-6 text-gray-300 group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>

            {isLoggedIn ? (
              <>
                {/* History Icon Button */}
                <Link
                  href="/historique"
                  className="p-2.5 rounded-full hover:bg-white/10 transition-all duration-200 group"
                  title="Historique"
                >
                  <svg className="w-6 h-6 text-gray-300 group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </Link>

                {/* Admin Icon - Only for admin users */}
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="p-2.5 rounded-full hover:bg-white/10 transition-all duration-200 group"
                    title="Console Admin"
                  >
                    <svg className="w-6 h-6 text-primary group-hover:text-primary-light transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </Link>
                )}

                {/* Settings Menu */}
                <div className="relative">
                  <button
                    onClick={() => setSettingsOpen(!settingsOpen)}
                    className="p-2.5 rounded-full hover:bg-white/10 transition-all duration-200 group"
                    title="Menu"
                  >
                    <svg className="w-6 h-6 text-gray-300 group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>

                  {/* Dropdown Settings */}
                  {settingsOpen && (
                    <div className="absolute right-0 mt-2 w-48 glass-card py-2 animate-scale-in">
                      <Link
                        href="/upgrade"
                        className="block px-4 py-2 hover:bg-white/10 transition-colors"
                        onClick={() => setSettingsOpen(false)}
                      >
                        Mon Abonnement
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 hover:bg-white/10 transition-colors text-red-400"
                      >
                        Deconnexion
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Sign In Icon Button */}
                <Link
                  href="/login"
                  className="p-2.5 rounded-full hover:bg-white/10 transition-all duration-200 group"
                  title="Se connecter"
                >
                  <svg className="w-6 h-6 text-gray-300 group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                </Link>

                {/* Settings Menu (vide pour non-connectés) */}
                <div className="relative">
                  <button
                    onClick={() => setSettingsOpen(!settingsOpen)}
                    className="p-2.5 rounded-full hover:bg-white/10 transition-all duration-200 group"
                    title="Menu"
                  >
                    <svg className="w-6 h-6 text-gray-300 group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {settingsOpen && (
                    <div className="absolute right-0 mt-2 w-48 glass-card py-2 animate-scale-in">
                      <Link
                        href="/signup"
                        className="block px-4 py-2 hover:bg-white/10 transition-colors"
                        onClick={() => setSettingsOpen(false)}
                      >
                        S'inscrire
                      </Link>
                      <Link
                        href="/login"
                        className="block px-4 py-2 hover:bg-white/10 transition-colors"
                        onClick={() => setSettingsOpen(false)}
                      >
                        Se connecter
                      </Link>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2 glass-card animate-fade-in-up">
            <Link
              href="/recherche"
              className="block px-4 py-3 hover:bg-white/10 transition-colors rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              Recherche de vols
            </Link>
            {isLoggedIn ? (
              <>
                <Link
                  href="/historique"
                  className="block px-4 py-3 hover:bg-white/10 transition-colors rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Historique
                </Link>
                <Link
                  href="/upgrade"
                  className="block px-4 py-3 hover:bg-white/10 transition-colors rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Mon Abonnement
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="block px-4 py-3 hover:bg-white/10 transition-colors rounded-lg text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Console Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 hover:bg-white/10 transition-colors rounded-lg text-red-400"
                >
                  Deconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/signup"
                  className="block px-4 py-3 hover:bg-white/10 transition-colors rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  S'inscrire
                </Link>
                <Link
                  href="/login"
                  className="block px-4 py-3 hover:bg-white/10 transition-colors rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Se connecter
                </Link>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  )
}
