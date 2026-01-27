'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect } from 'react'
import ConfirmationLayout from '@/components/ui/ConfirmationLayout'

function PaymentConfirmationContent() {
  const searchParams = useSearchParams()
  const plan = searchParams.get('plan') || 'monthly'

  // Mettre à jour le localStorage pour refléter le statut premium
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        const updatedUser = {
          ...userData,
          subscription: {
            ...userData.subscription,
            plan: 'premium',
            status: 'active',
          }
        }
        localStorage.setItem('user', JSON.stringify(updatedUser))
      } catch (error) {
        console.error('Erreur mise à jour localStorage:', error)
      }
    }
  }, [])

  const planDetails = {
    monthly: {
      name: 'Premium Mensuel',
      price: '4,99',
      period: 'mois',
      features: [
        'Alertes SMS instantanées',
        'Destinations illimitées',
        'Priorité sur les deals',
        'Support prioritaire'
      ]
    },
    quarterly: {
      name: 'Premium Trimestriel',
      price: '11,99',
      period: 'trimestre',
      features: [
        'Alertes SMS instantanées',
        'Destinations illimitées',
        'Priorité sur les deals',
        'Support prioritaire',
        'Économie de 20%!'
      ]
    },
    yearly: {
      name: 'Premium Annuel',
      price: '44,99',
      period: 'an',
      features: [
        'Alertes SMS instantanées',
        'Destinations illimitées',
        'Priorité sur les deals',
        'Support prioritaire',
        '2 mois gratuits!'
      ]
    }
  }

  const currentPlan = planDetails[plan as keyof typeof planDetails] || planDetails.monthly

  return (
    <ConfirmationLayout
      icon="🎉"
      title="Bienvenue dans le club Premium!"
      message="Votre abonnement a été activé avec succès. Vous pouvez maintenant profiter de toutes les fonctionnalités Premium."
      details={
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Plan souscrit</span>
            <span className="text-white font-semibold">{currentPlan.name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Prix</span>
            <span className="text-primary font-bold">{currentPlan.price}€/{currentPlan.period}</span>
          </div>
          <div className="border-t border-white/10 pt-4">
            <span className="text-gray-400 text-sm block mb-2">Vos avantages:</span>
            <ul className="space-y-2">
              {currentPlan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-white">
                  <span className="text-green-500">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-primary/10 border border-primary/30 rounded-lg p-3 mt-4">
            <p className="text-sm text-primary">
              📱 Vous pouvez maintenant activer les alertes SMS pour vos destinations favorites!
            </p>
          </div>
        </div>
      }
      primaryAction={{
        label: 'Configurer mes alertes SMS',
        href: '/recherche'
      }}
      secondaryAction={{
        label: 'Retour à l\'accueil',
        href: '/'
      }}
    />
  )
}

export default function PaymentConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin text-4xl">⟳</div>
      </div>
    }>
      <PaymentConfirmationContent />
    </Suspense>
  )
}
