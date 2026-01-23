'use client'

import { useState, useEffect } from 'react'
import { type Location } from '@/lib/location-search'
import { getDestinationImage } from '@/lib/airports'

interface FollowedDestination {
  id: string
  code: string
  city: string
  country: string
  notifyChannel: string
}

interface UserPlan {
  plan: string
  status: string
}

export default function DestinationsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Location[]>([])
  const [followedDestinations, setFollowedDestinations] = useState<FollowedDestination[]>([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [userPlan, setUserPlan] = useState<UserPlan | null>(null)
  const [loading, setLoading] = useState(false)
  const [searching, setSearching] = useState(false)

  // Check auth et charger les destinations suivies
  useEffect(() => {
    const checkAuth = async () => {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        try {
          const user = JSON.parse(userStr)
          setIsLoggedIn(true)
          setUserId(user.id)

          // Charger le plan de l'utilisateur
          const planRes = await fetch(`/api/user/subscription?userId=${user.id}`)
          if (planRes.ok) {
            const planData = await planRes.json()
            setUserPlan(planData.subscription)
          }

          loadFollowedDestinations(user.id)
        } catch (e) {
          setIsLoggedIn(false)
        }
      }
    }

    checkAuth()
    window.addEventListener('auth-change', checkAuth)
    return () => window.removeEventListener('auth-change', checkAuth)
  }, [])

  const loadFollowedDestinations = async (uid: string) => {
    try {
      const res = await fetch(`/api/destinations/followed?userId=${uid}`)
      if (res.ok) {
        const data = await res.json()
        setFollowedDestinations(data.destinations || [])
      }
    } catch (error) {
      console.error('Erreur chargement destinations:', error)
    }
  }

  // Recherche universelle de destinations avec API
  useEffect(() => {
    const performSearch = async () => {
      if (!searchQuery || searchQuery.trim().length < 2) {
        setSearchResults([])
        return
      }

      setSearching(true)
      try {
        const response = await fetch(`/api/destinations/search?q=${encodeURIComponent(searchQuery)}&limit=20`)
        if (response.ok) {
          const data = await response.json()
          setSearchResults(data.results || [])
        }
      } catch (error) {
        console.error('Error searching destinations:', error)
        setSearchResults([])
      } finally {
        setSearching(false)
      }
    }

    // Debounce la recherche (attendre 300ms après la dernière frappe)
    const timeoutId = setTimeout(performSearch, 300)
    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  // Follow/unfollow une destination
  const toggleFollow = async (location: Location) => {
    if (!isLoggedIn || !userId) {
      window.location.href = '/login'
      return
    }

    if (!location.code) {
      alert('Cette destination ne peut pas être suivie pour le moment')
      return
    }

    const isFollowed = followedDestinations.some(d => d.code === location.code)
    setLoading(true)

    try {
      if (isFollowed) {
        // Unfollow
        const res = await fetch('/api/destinations/unfollow', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, code: location.code })
        })

        if (res.ok) {
          setFollowedDestinations(prev => prev.filter(d => d.code !== location.code))
        }
      } else {
        // Follow
        const res = await fetch('/api/destinations/follow', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            code: location.code,
            city: location.city,
            country: location.country
          })
        })

        if (res.ok) {
          const data = await res.json()
          setFollowedDestinations(prev => [...prev, data.destination])
        }
      }
    } catch (error) {
      console.error('Erreur follow/unfollow:', error)
      alert('Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  const isFollowed = (code: string) => {
    return followedDestinations.some(d => d.code === code)
  }

  // Fonction pour changer le canal de notification
  const updateNotifyChannel = async (destinationId: string, channel: 'email' | 'sms') => {
    if (!userId) return

    try {
      const res = await fetch('/api/destinations/update-channel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          destinationId,
          channel
        })
      })

      if (res.ok) {
        // Mettre à jour l'état local
        setFollowedDestinations(prev => prev.map(dest =>
          dest.id === destinationId
            ? { ...dest, notifyChannel: channel }
            : dest
        ))
      } else {
        const error = await res.json()
        alert(error.error || 'Erreur lors de la mise à jour')
      }
    } catch (error) {
      console.error('Error updating channel:', error)
      alert('Une erreur est survenue')
    }
  }

  // Vérifier si l'utilisateur est premium
  const isPremium = userPlan && (userPlan.plan === 'premium' || userPlan.plan === 'sms')

  return (
    <div className="min-h-screen relative">
      {/* Background effects */}
      <div className="fixed inset-0 bg-gradient-to-b from-black via-gray-900/20 to-black pointer-events-none" />
      <div className="fixed top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float pointer-events-none" />
      <div className="fixed bottom-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: '3s' }} />

      <div className="container mx-auto px-4 py-16 max-w-7xl relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="heading-xl mb-6">
            Rechercher une <span className="text-primary">destination</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Recherchez parmi des milliers d'aéroports dans le monde entier.
            Suivez vos destinations favorites pour recevoir les meilleures offres.
          </p>
        </div>

        {/* Search Bar */}
        <div className="glass-card mb-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un aéroport, une ville, un pays... (ex: Tokyo, CDG, Paris)"
              className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-primary transition-all text-white placeholder-gray-400"
              autoFocus
            />
          </div>

          {searchQuery.trim().length > 0 && searchQuery.trim().length < 2 && (
            <div className="mt-4 text-sm text-gray-400">
              Tapez au moins 2 caractères pour rechercher
            </div>
          )}

          {searching && (
            <div className="mt-4 text-sm text-gray-400 flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary"></div>
              Recherche en cours...
            </div>
          )}

          {!searching && searchResults.length > 0 && (
            <div className="mt-4 text-sm text-gray-400">
              {searchResults.length} résultat{searchResults.length > 1 ? 's' : ''} trouvé{searchResults.length > 1 ? 's' : ''}
            </div>
          )}
        </div>

        {/* Destinations suivies (si connecté et pas de recherche) */}
        {isLoggedIn && !searchQuery && followedDestinations.length > 0 && (
          <div className="mb-12 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="text-primary">*</span>
              Destinations récemment aimées
              <span className="text-sm text-gray-400 font-normal">({followedDestinations.length})</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {followedDestinations.map((dest) => {
                const imageUrl = getDestinationImage(dest.city)
                return (
                  <div
                    key={dest.id}
                    className="group glass-card hover-lift hover-glow overflow-hidden relative"
                  >
                    {/* Image */}
                    <div className="relative h-40 w-full overflow-hidden rounded-t-xl">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                      <img
                        src={imageUrl}
                        alt={dest.city}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 z-20">
                        <div className="text-xs font-bold bg-primary/80 backdrop-blur-sm text-white px-2 py-1 rounded">
                          {dest.code}
                        </div>
                      </div>
                      <button
                        onClick={() => toggleFollow({
                          type: 'airport',
                          code: dest.code,
                          name: dest.city,
                          displayName: dest.city,
                          city: dest.city,
                          country: dest.country,
                          relevance: 100
                        })}
                        disabled={loading}
                        className="absolute top-3 right-3 z-20 p-2 rounded-full bg-yellow-500/90 hover:bg-yellow-600/90 backdrop-blur-sm transition-all"
                        title="Ne plus suivre"
                      >
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">
                        {dest.city}
                      </h3>
                      <p className="text-sm text-gray-400 mb-3">{dest.country}</p>

                      {/* Notification Channel Selector (Premium only) */}
                      {isPremium && (
                        <div className="mt-3 pt-3 border-t border-white/10">
                          <p className="text-xs text-gray-400 mb-2">Notifications par:</p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => updateNotifyChannel(dest.id, 'email')}
                              className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                                dest.notifyChannel === 'email'
                                  ? 'bg-primary text-white'
                                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
                              }`}
                            >
                              Email
                            </button>
                            <button
                              onClick={() => updateNotifyChannel(dest.id, 'sms')}
                              className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                                dest.notifyChannel === 'sms'
                                  ? 'bg-primary text-white'
                                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
                              }`}
                            >
                              SMS
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Free users - Email only */}
                      {!isPremium && (
                        <div className="mt-3 pt-3 border-t border-white/10">
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <span>@</span>
                            <span>Notifications par email</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Résultats de recherche */}
        {searchQuery.trim().length >= 2 && (
          <>
            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                {searchResults.map((location) => {
                  const followed = location.code ? isFollowed(location.code) : false
                  const imageUrl = getDestinationImage(location.city)

                  return (
                    <div
                      key={`${location.code || location.city}-${location.country}`}
                      className="group glass-card hover-lift hover-glow overflow-hidden relative"
                    >
                      {/* Image */}
                      <div className="relative h-40 w-full overflow-hidden rounded-t-xl">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                        <img
                          src={imageUrl}
                          alt={`${location.city}`}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 z-20 flex gap-2">
                          {location.code && (
                            <div className="text-xs font-bold bg-primary/80 backdrop-blur-sm text-white px-2 py-1 rounded">
                              {location.code}
                            </div>
                          )}
                          <div className="text-xs bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded">
                            {location.type === 'airport' ? 'Airport' : location.type === 'city' ? 'City' : 'Region'}
                          </div>
                        </div>
                        {/* Follow button */}
                        {location.code && (
                          <button
                            onClick={() => toggleFollow(location)}
                            disabled={loading}
                            className={`absolute top-3 right-3 z-20 p-2 rounded-full backdrop-blur-sm transition-all ${
                              followed
                                ? 'bg-yellow-500/90 hover:bg-yellow-600/90'
                                : 'bg-white/20 hover:bg-white/30'
                            }`}
                            title={followed ? 'Ne plus suivre' : 'Suivre cette destination'}
                          >
                            {followed ? (
                              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                            ) : (
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>
                            )}
                          </button>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">
                          {location.city}
                        </h3>
                        <p className="text-sm text-gray-400 mb-2">{location.country}</p>
                        {location.airportName && (
                          <p className="text-xs text-gray-500 leading-relaxed mb-3">
                            {location.airportName}
                          </p>
                        )}

                        {/* Score de pertinence (debug - optionnel) */}
                        {location.continent && (
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {location.continent}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="glass-card py-16 text-center animate-scale-in">
                <div className="text-4xl mb-4 text-gray-400">?</div>
                <h3 className="text-2xl font-bold mb-2">Aucun aéroport trouvé</h3>
                <p className="text-gray-400">
                  Essayez de modifier votre recherche (ville, pays, code IATA...)
                </p>
              </div>
            )}
          </>
        )}

        {/* Message initial (pas de recherche) */}
        {!searchQuery && followedDestinations.length === 0 && (
          <div className="glass-card py-16 text-center animate-scale-in">
            <svg className="w-16 h-16 mx-auto mb-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
            <h3 className="text-2xl font-bold mb-2">
              {isLoggedIn ? 'Commencez votre recherche' : 'Recherchez votre prochaine destination'}
            </h3>
            <p className="text-gray-400 max-w-md mx-auto mb-6">
              {isLoggedIn
                ? 'Utilisez la barre de recherche ci-dessus pour trouver votre destination et la suivre'
                : 'Connectez-vous pour suivre des destinations et recevoir les meilleures offres'}
            </p>
            {!isLoggedIn && (
              <div className="flex gap-4 justify-center">
                <a
                  href="/signup"
                  className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-bold transition-all duration-200 transform hover:scale-105"
                >
                  S'inscrire gratuitement
                </a>
                <a
                  href="/login"
                  className="glass hover:bg-white/15 text-white px-6 py-3 rounded-lg font-bold transition-all duration-200 transform hover:scale-105 border border-white/20"
                >
                  Se connecter
                </a>
              </div>
            )}
          </div>
        )}

        {/* CTA Section */}
        {isLoggedIn && (
          <div className="glass-card border-2 border-primary/30 p-8 md:p-12 text-center mt-16 animate-fade-in-up">
            <h2 className="text-3xl font-bold mb-4">Comment ça marche ?</h2>
            <div className="grid md:grid-cols-3 gap-8 text-left max-w-4xl mx-auto">
              <div>
                <div className="text-2xl mb-3 font-bold text-primary">1</div>
                <h3 className="font-bold mb-2">1. Recherchez</h3>
                <p className="text-sm text-gray-400">
                  Trouvez votre destination parmi des milliers d'aéroports
                </p>
              </div>
              <div>
                <div className="text-2xl mb-3 font-bold text-primary">2</div>
                <h3 className="font-bold mb-2">2. Suivez</h3>
                <p className="text-sm text-gray-400">
                  Cliquez sur l'étoile pour suivre une destination
                </p>
              </div>
              <div>
                <div className="text-2xl mb-3 font-bold text-primary">3</div>
                <h3 className="font-bold mb-2">3. Recevez</h3>
                <p className="text-sm text-gray-400">
                  Alertes email (gratuit) ou SMS (premium) quand un deal apparaît
                </p>
              </div>
            </div>
            <a
              href="/upgrade"
              className="inline-block bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-lg font-bold transition-all duration-200 transform hover:scale-105 shadow-lg shadow-primary/20 mt-8"
            >
              Passer en Premium pour les SMS
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
