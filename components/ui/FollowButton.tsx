'use client'

import { useState, useEffect } from 'react'
import Tooltip from './Tooltip'

interface FollowButtonProps {
  destination: string  // Airport code
  destinationCity?: string  // Full city name
  userPlan: 'free' | 'premium' | 'sms'
  onSuccess?: () => void
  compact?: boolean
  className?: string
}

export default function FollowButton({
  destination,
  destinationCity,
  userPlan,
  onSuccess,
  compact = false,
  className = ''
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(false)
  const [selectedChannel, setSelectedChannel] = useState<'email' | 'sms'>('email')
  const [loading, setLoading] = useState(false)
  const [showChannelDropdown, setShowChannelDropdown] = useState(false)

  const isPremium = userPlan === 'premium' || userPlan === 'sms'

  // Check if destination is already followed
  useEffect(() => {
    const checkFollowStatus = async () => {
      try {
        const res = await fetch('/api/destinations/followed')
        if (res.ok) {
          const data = await res.json()
          const followed = data.destinations?.some((d: any) => d.code === destination)
          setIsFollowing(followed)

          if (followed) {
            const dest = data.destinations.find((d: any) => d.code === destination)
            if (dest) {
              setSelectedChannel(dest.notifyChannel || 'email')
            }
          }
        }
      } catch (error) {
        console.error('Error checking follow status:', error)
      }
    }

    checkFollowStatus()
  }, [destination])

  const handleFollow = async () => {
    setLoading(true)

    try {
      const res = await fetch('/api/destinations/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: destination,
          city: destinationCity || destination,
          country: 'Unknown',
          notifyChannel: selectedChannel
        })
      })

      if (res.ok) {
        setIsFollowing(true)
        onSuccess?.()

        // Show success message
        alert(`✅ Destination suivie! Vous recevrez des alertes par ${selectedChannel === 'email' ? 'email 📧' : 'SMS 📱'}`)
      } else {
        const data = await res.json()
        alert(`❌ Erreur: ${data.error || 'Impossible de suivre cette destination'}`)
      }
    } catch (error) {
      console.error('Error following destination:', error)
      alert('❌ Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  const handleUnfollow = async () => {
    if (!confirm('Êtes-vous sûr de vouloir arrêter de suivre cette destination?')) {
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/destinations/unfollow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: destination })
      })

      if (res.ok) {
        setIsFollowing(false)
        setSelectedChannel('email')
        onSuccess?.()
      } else {
        alert('❌ Erreur lors de l\'arrêt du suivi')
      }
    } catch (error) {
      console.error('Error unfollowing destination:', error)
      alert('❌ Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  const handleChangeChannel = async (newChannel: 'email' | 'sms') => {
    if (newChannel === 'sms' && !isPremium) {
      alert('📱 Les alertes SMS sont réservées aux membres Premium')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/destinations/update-channel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: destination,
          notifyChannel: newChannel
        })
      })

      if (res.ok) {
        setSelectedChannel(newChannel)
        alert(`✅ Canal de notification changé: ${newChannel === 'email' ? 'Email 📧' : 'SMS 📱'}`)
      } else {
        const data = await res.json()
        alert(`❌ ${data.error || 'Erreur'}`)
      }
    } catch (error) {
      console.error('Error changing channel:', error)
      alert('❌ Erreur de connexion')
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
            disabled={loading}
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
                  📧 Email
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
                  📱 SMS
                </button>
              </div>
            )}

            {/* Email only indicator for Free */}
            {!isPremium && (
              <Tooltip content="Passez Premium pour recevoir des alertes SMS">
                <div className="text-xs text-gray-500 text-center">
                  📧 Email uniquement
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
          disabled={loading}
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
                📧 Email
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
                  📱 SMS {!isPremium && '🔒'}
                </button>
              </Tooltip>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
