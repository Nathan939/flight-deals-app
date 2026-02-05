'use client'

import { useState, useEffect } from 'react'
import Tooltip from './Tooltip'

interface FollowButtonProps {
  destination: string  // Airport code
  destinationCity?: string  // Full city name
  destinationCountry?: string  // Country name
  userPlan: 'free' | 'premium' | 'sms'
  onSuccess?: () => void
  compact?: boolean
  className?: string
}

export default function FollowButton({
  destination,
  destinationCity,
  destinationCountry,
  userPlan,
  onSuccess,
  compact = false,
  className = ''
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(false)
  const [selectedChannel, setSelectedChannel] = useState<'email' | 'sms'>('email')
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [destinationId, setDestinationId] = useState<string | null>(null)

  const isPremium = userPlan === 'premium' || userPlan === 'sms'

  // Get userId from localStorage
  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        const user = JSON.parse(userStr)
        setUserId(user.id)
      }
    } catch (e) {
      console.error('Error reading user from localStorage:', e)
    }
  }, [])

  // Check if destination is already followed
  useEffect(() => {
    if (!userId) return

    const checkFollowStatus = async () => {
      try {
        const res = await fetch(`/api/destinations/followed?userId=${userId}`)
        if (res.ok) {
          const data = await res.json()
          const followedDest = data.destinations?.find((d: any) => d.code === destination)
          setIsFollowing(!!followedDest)

          if (followedDest) {
            setDestinationId(followedDest.id)
            setSelectedChannel(followedDest.notifyChannel || 'email')
          }
        }
      } catch (error) {
        console.error('Error checking follow status:', error)
      }
    }

    checkFollowStatus()
  }, [destination, userId])

  const handleFollow = async () => {
    if (!userId) {
      alert('Veuillez vous connecter pour suivre une destination')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/destinations/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          code: destination,
          city: destinationCity || destination,
          country: destinationCountry || ''
        })
      })

      if (res.ok) {
        const data = await res.json()
        setIsFollowing(true)
        setDestinationId(data.destination?.id || null)
        onSuccess?.()
        alert(`Destination suivie! Vous recevrez des alertes par ${selectedChannel === 'email' ? 'email' : 'SMS'}`)
      } else {
        const data = await res.json()
        alert(`Erreur: ${data.error || 'Impossible de suivre cette destination'}`)
      }
    } catch (error) {
      console.error('Error following destination:', error)
      alert('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  const handleUnfollow = async () => {
    if (!userId) return
    if (!confirm('Arrêter de suivre cette destination?')) return

    setLoading(true)

    try {
      const res = await fetch('/api/destinations/unfollow', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, code: destination })
      })

      if (res.ok) {
        setIsFollowing(false)
        setDestinationId(null)
        setSelectedChannel('email')
        onSuccess?.()
      } else {
        alert('Erreur lors de la suppression du suivi')
      }
    } catch (error) {
      console.error('Error unfollowing destination:', error)
      alert('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  const handleChangeChannel = async (newChannel: 'email' | 'sms') => {
    if (newChannel === 'sms' && !isPremium) {
      alert('Les alertes SMS sont réservées aux membres Premium')
      return
    }
    if (!userId || !destinationId) return

    setLoading(true)

    try {
      const res = await fetch('/api/destinations/update-channel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          destinationId,
          channel: newChannel
        })
      })

      if (res.ok) {
        setSelectedChannel(newChannel)
      } else {
        const data = await res.json()
        alert(`${data.error || 'Erreur'}`)
      }
    } catch (error) {
      console.error('Error changing channel:', error)
      alert('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  if (compact) {
    return (
      <div className={`relative ${className}`}>
        {!isFollowing ? (
          <button
            onClick={handleFollow}
            disabled={loading || !userId}
            className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-primary/50 rounded-lg text-white text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '...' : '⭐ Suivre'}
          </button>
        ) : (
          <div className="space-y-2">
            <button
              onClick={handleUnfollow}
              disabled={loading}
              className="w-full px-4 py-2 bg-primary/20 border border-primary/50 rounded-lg text-primary text-sm font-medium transition-all duration-200 disabled:opacity-50"
            >
              {loading ? '...' : '✓ Suivi'}
            </button>

            {/* Channel Selector for Premium */}
            {isPremium && (
              <div className="flex gap-2">
                <button
                  onClick={() => selectedChannel !== 'email' && handleChangeChannel('email')}
                  disabled={loading || selectedChannel === 'email'}
                  className={`flex-1 px-2 py-1 rounded text-xs font-medium transition-all ${
                    selectedChannel === 'email'
                      ? 'bg-primary text-white'
                      : 'bg-white/10 text-gray-400 hover:bg-white/20'
                  }`}
                >
                  Email
                </button>
                <button
                  onClick={() => selectedChannel !== 'sms' && handleChangeChannel('sms')}
                  disabled={loading || selectedChannel === 'sms'}
                  className={`flex-1 px-2 py-1 rounded text-xs font-medium transition-all ${
                    selectedChannel === 'sms'
                      ? 'bg-primary text-white'
                      : 'bg-white/10 text-gray-400 hover:bg-white/20'
                  }`}
                >
                  SMS
                </button>
              </div>
            )}

            {/* Email only indicator for Free */}
            {!isPremium && (
              <Tooltip content="Passez Premium pour recevoir des alertes SMS">
                <div className="text-xs text-gray-500 text-center">
                  Email uniquement
                </div>
              </Tooltip>
            )}
          </div>
        )}
      </div>
    )
  }

  // Full version (non-compact)
  return (
    <div className={`${className}`}>
      {!isFollowing ? (
        <button
          onClick={handleFollow}
          disabled={loading || !userId}
          className="w-full px-6 py-3 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white font-bold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? 'Chargement...' : '⭐ Suivre cette destination'}
        </button>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-4 py-3 bg-primary/20 border border-primary/50 rounded-lg">
            <span className="text-primary font-medium">✓ Destination suivie</span>
            <button
              onClick={handleUnfollow}
              disabled={loading}
              className="text-xs text-gray-400 hover:text-white underline"
            >
              Arrêter
            </button>
          </div>

          {/* Channel Selection */}
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Canal de notification:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => selectedChannel !== 'email' && handleChangeChannel('email')}
                disabled={loading || selectedChannel === 'email'}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedChannel === 'email'
                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                    : 'bg-white/10 text-gray-400 hover:bg-white/20 border border-white/20'
                }`}
              >
                Email
              </button>

              <Tooltip
                content={!isPremium ? "Fonctionnalité Premium uniquement" : "Recevoir des alertes par SMS"}
              >
                <button
                  onClick={() => isPremium && selectedChannel !== 'sms' && handleChangeChannel('sms')}
                  disabled={loading || selectedChannel === 'sms' || !isPremium}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedChannel === 'sms'
                      ? 'bg-primary text-white shadow-lg shadow-primary/30'
                      : isPremium
                      ? 'bg-white/10 text-gray-400 hover:bg-white/20 border border-white/20'
                      : 'bg-white/5 text-gray-600 cursor-not-allowed border border-white/10'
                  }`}
                >
                  SMS {!isPremium && '🔒'}
                </button>
              </Tooltip>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
