'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import ConfirmationLayout from '@/components/ui/ConfirmationLayout'

function FollowConfirmationContent() {
  const searchParams = useSearchParams()
  const destination = searchParams.get('destination') || 'Destination'
  const city = searchParams.get('city') || destination
  const channel = searchParams.get('channel') || 'email'

  const channelInfo = {
    email: {
      icon: '📧',
      name: 'Email',
      description: 'Vous recevrez les alertes dans votre boîte mail',
      example: 'Un email sera envoyé dès qu\'un deal intéressant est disponible'
    },
    sms: {
      icon: '📱',
      name: 'SMS',
      description: 'Vous recevrez les alertes par SMS instantanément',
      example: 'Un SMS sera envoyé immédiatement pour les meilleurs deals'
    }
  }

  const currentChannel = channelInfo[channel as keyof typeof channelInfo] || channelInfo.email

  return (
    <ConfirmationLayout
      icon="⭐"
      title="Destination ajoutée à vos favoris!"
      message={`Vous suivez maintenant ${city}. Nous vous avertirons dès que de bons deals seront disponibles.`}
      details={
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Destination</span>
            <span className="text-white font-semibold">{city} ({destination})</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Canal de notification</span>
            <span className="text-primary font-semibold flex items-center gap-2">
              {currentChannel.icon} {currentChannel.name}
            </span>
          </div>
          <div className="border-t border-white/10 pt-4">
            <p className="text-gray-300 text-sm">
              {currentChannel.description}
            </p>
          </div>

          {/* Example Notification Preview */}
          <div className="bg-gray-800/50 border border-white/10 rounded-lg p-4 mt-4">
            <p className="text-xs text-gray-500 mb-2">Aperçu d'une notification:</p>
            <div className="bg-black/50 rounded-lg p-3">
              {channel === 'sms' ? (
                <p className="text-sm text-white">
                  🔥 DEAL ALERT: Paris → {city} à 99€ (-75%)! Réservez vite: https://flightalert.fr/...
                </p>
              ) : (
                <div>
                  <p className="text-sm font-semibold text-white mb-1">
                    ✈️ Nouveau deal pour {city}!
                  </p>
                  <p className="text-xs text-gray-400">
                    Paris → {city} à partir de 99€ • -75% de réduction
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mt-4">
            <p className="text-sm text-blue-400">
              💡 Astuce: Plus vous suivez de destinations, plus vous avez de chances de trouver des deals exceptionnels!
            </p>
          </div>
        </div>
      }
      primaryAction={{
        label: 'Voir mes destinations',
        href: '/recherche'
      }}
      secondaryAction={{
        label: 'Rechercher d\'autres vols',
        href: '/recherche'
      }}
    />
  )
}

export default function FollowConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin text-4xl">⟳</div>
      </div>
    }>
      <FollowConfirmationContent />
    </Suspense>
  )
}
