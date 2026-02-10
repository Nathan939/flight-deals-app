'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { PLANS } from '@/lib/utils'

interface Subscription {
  plan: 'free' | 'premium'
  status: 'active' | 'inactive' | 'cancelled'
  startDate?: string
  endDate?: string
  stripeCustomerId?: string
  stripeSubscriptionId?: string
}

interface User {
  id: string
  email: string
  name: string
  subscription: Subscription
}

type BillingPeriod = 'monthly' | 'quarterly' | 'yearly'

const PRICING = {
  monthly: {
    price: PLANS.premium.price,
    period: 'mois',
    total: PLANS.premium.price,
    savings: null,
  },
  quarterly: {
    price: PLANS.premium.priceQuarterly,
    period: 'trimestre',
    total: PLANS.premium.priceQuarterly,
    savings: Math.round((1 - (PLANS.premium.priceQuarterly / (PLANS.premium.price * 3))) * 100),
    monthlyEquivalent: (PLANS.premium.priceQuarterly / 3).toFixed(2),
  },
  yearly: {
    price: PLANS.premium.priceYearly,
    period: 'an',
    total: PLANS.premium.priceYearly,
    savings: Math.round((1 - (PLANS.premium.priceYearly / (PLANS.premium.price * 12))) * 100),
    monthlyEquivalent: (PLANS.premium.priceYearly / 12).toFixed(2),
  },
}

export default function UpgradePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<BillingPeriod>('quarterly')

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (!storedUser) {
      router.push('/login')
      return
    }

    try {
      const userData = JSON.parse(storedUser)
      setUser(userData)
    } catch (error) {
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }, [router])

  const handleUpgrade = async (plan: BillingPeriod) => {
    if (!user) return

    setActionLoading(true)
    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, billingPeriod: plan })
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        alert('Erreur lors de la création de la session de paiement')
      }
    } catch (error) {
      console.error('Erreur upgrade:', error)
      alert('Une erreur est survenue')
    } finally {
      setActionLoading(false)
    }
  }

  const handleCancelSubscription = async () => {
    if (!user?.subscription.stripeSubscriptionId) return

    if (!confirm('Êtes-vous sûr de vouloir annuler votre abonnement Premium ?')) {
      return
    }

    setActionLoading(true)
    try {
      const response = await fetch('/api/stripe/cancel-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          subscriptionId: user.subscription.stripeSubscriptionId
        })
      })

      if (response.ok) {
        const updatedUser = {
          ...user,
          subscription: {
            ...user.subscription,
            status: 'cancelled' as const
          }
        }
        localStorage.setItem('user', JSON.stringify(updatedUser))
        setUser(updatedUser)
        alert('Votre abonnement a été annulé. Il restera actif jusqu\'à la fin de la période payée.')
      } else {
        alert('Erreur lors de l\'annulation')
      }
    } catch (error) {
      console.error('Erreur annulation:', error)
      alert('Une erreur est survenue')
    } finally {
      setActionLoading(false)
    }
  }

  const handleManageBilling = async () => {
    if (!user) return

    setActionLoading(true)
    try {
      const response = await fetch('/api/stripe/billing-portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        alert(data.error || 'Erreur lors de l\'ouverture du portail de facturation')
      }
    } catch (error) {
      console.error('Erreur billing portal:', error)
      alert('Une erreur est survenue')
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) return null

  const isPremium = user.subscription?.plan === 'premium' && user.subscription?.status === 'active'
  const isCancelled = user.subscription?.status === 'cancelled'

  return (
    <div className="min-h-screen relative">
      {/* Background effects */}
      <div className="fixed inset-0 bg-gradient-to-b from-black via-gray-900/20 to-black pointer-events-none" />
      <div className="fixed top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float pointer-events-none" />
      <div className="fixed bottom-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: '3s' }} />

      <div className="container mx-auto px-4 py-16 max-w-4xl relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="heading-xl mb-6">
            Mon <span className="text-primary">Abonnement</span>
          </h1>
          <p className="subtitle text-gray-300">
            Gérez votre abonnement et vos informations de paiement
          </p>
        </div>

        {/* Account Info */}
        <div className="glass-card mb-8 animate-fade-in-up" style={{ animationDelay: '50ms' }}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-400">Connecte en tant que</p>
              <p className="font-bold text-lg">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Current Plan */}
        <div className="glass-card mb-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                {isPremium ? 'Plan Premium' : 'Plan Gratuit'}
              </h2>
              <p className="text-gray-400">
                {isPremium
                  ? 'Vous profitez de toutes les fonctionnalités premium'
                  : 'Passez en Premium pour recevoir des alertes SMS'}
              </p>
            </div>
            <div className={`px-4 py-2 rounded-full text-sm font-bold ${
              isPremium
                ? isCancelled
                  ? 'bg-orange-500/20 text-orange-400'
                  : 'bg-green-500/20 text-green-400'
                : 'bg-gray-500/20 text-gray-400'
            }`}>
              {isPremium
                ? isCancelled ? 'Annule' : 'Actif'
                : 'Gratuit'}
            </div>
          </div>

          {/* Plan Details */}
          <div className="border-t border-white/10 pt-6 mb-6">
            <h3 className="font-bold mb-4">Fonctionnalités incluses :</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <span className="text-green-400">✓</span>
                <div>
                  <p className="font-medium">Alertes Email</p>
                  <p className="text-sm text-gray-400">Recevez les deals par email</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-400">✓</span>
                <div>
                  <p className="font-medium">Destinations illimitées</p>
                  <p className="text-sm text-gray-400">Suivez autant de destinations que vous voulez</p>
                </div>
              </div>
              <div className={`flex items-start gap-3 ${!isPremium && 'opacity-50'}`}>
                <span className={isPremium ? 'text-green-400' : 'text-gray-500'}>
                  {isPremium ? '✓' : '✗'}
                </span>
                <div>
                  <p className="font-medium">Alertes SMS</p>
                  <p className="text-sm text-gray-400">
                    {isPremium ? 'Recevez les deals par SMS instantané' : 'Premium uniquement'}
                  </p>
                </div>
              </div>
              <div className={`flex items-start gap-3 ${!isPremium && 'opacity-50'}`}>
                <span className={isPremium ? 'text-green-400' : 'text-gray-500'}>
                  {isPremium ? '✓' : '✗'}
                </span>
                <div>
                  <p className="font-medium">Priorité support</p>
                  <p className="text-sm text-gray-400">
                    {isPremium ? 'Support client prioritaire' : 'Premium uniquement'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Info for Premium users */}
          {isPremium && (
            <div className="border-t border-white/10 pt-6 mb-6">
              <h3 className="font-bold mb-4">Informations d'abonnement :</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Email :</span>
                  <span className="font-medium">{user.email}</span>
                </div>
                {user.subscription.startDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Date de début :</span>
                    <span className="font-medium">
                      {new Date(user.subscription.startDate).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                )}
                {user.subscription.endDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">
                      {isCancelled ? 'Actif jusqu\'au' : 'Prochaine facturation'} :
                    </span>
                    <span className="font-medium">
                      {new Date(user.subscription.endDate).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-400">Prix :</span>
                  <span className="font-medium">4,99€ / mois</span>
                </div>
              </div>
            </div>
          )}

          {/* Actions for Premium users */}
          {isPremium && (
            <div className="flex flex-col sm:flex-row gap-4">
              {!isCancelled && (
                <button
                  onClick={handleCancelSubscription}
                  disabled={actionLoading}
                  className="flex-1 glass hover:bg-white/10 text-red-400 border border-red-400/50 px-6 py-4 rounded-lg font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading ? 'Chargement...' : 'Annuler l\'abonnement'}
                </button>
              )}
              <button
                onClick={handleManageBilling}
                disabled={actionLoading}
                className="flex-1 glass hover:bg-white/10 text-white px-6 py-4 rounded-lg font-bold transition-all duration-200 border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading ? 'Chargement...' : 'Gérer la facturation'}
              </button>
            </div>
          )}

          {isCancelled && (
            <div className="mt-4 p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
              <p className="text-sm text-orange-300">
                Votre abonnement a ete annule mais reste actif jusqu'à la fin de la période payée.
                Vous pouvez le réactiver à tout moment.
              </p>
            </div>
          )}
        </div>

        {/* Pricing Selection for Free users */}
        {!isPremium && (
          <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <h2 className="text-2xl font-bold mb-2 text-center">Choisissez votre formule</h2>
            <p className="text-gray-400 text-center mb-8">Sans engagement, annulez a tout moment</p>

            <div className="grid md:grid-cols-3 gap-4 mb-8">
              {/* Monthly */}
              <button
                onClick={() => setSelectedPlan('monthly')}
                className={`relative p-6 rounded-2xl border-2 transition-all duration-200 text-left ${
                  selectedPlan === 'monthly'
                    ? 'border-primary bg-primary/10'
                    : 'border-white/10 hover:border-white/30 bg-white/5'
                }`}
              >
                <div className="mb-4">
                  <p className="text-sm text-gray-400 mb-1">Mensuel</p>
                  <p className="text-3xl font-bold">
                    {PRICING.monthly.price}€
                    <span className="text-base font-normal text-gray-400">/mois</span>
                  </p>
                </div>
                <p className="text-sm text-gray-400">Facture chaque mois</p>
                {selectedPlan === 'monthly' && (
                  <div className="absolute top-4 right-4 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>

              {/* Quarterly - Popular */}
              <button
                onClick={() => setSelectedPlan('quarterly')}
                className={`relative p-6 rounded-2xl border-2 transition-all duration-200 text-left ${
                  selectedPlan === 'quarterly'
                    ? 'border-primary bg-primary/10'
                    : 'border-white/10 hover:border-white/30 bg-white/5'
                }`}
              >
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                    POPULAIRE
                  </span>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-400 mb-1">Trimestriel</p>
                  <p className="text-3xl font-bold">
                    {PRICING.quarterly.price}€
                    <span className="text-base font-normal text-gray-400">/3 mois</span>
                  </p>
                </div>
                <p className="text-sm text-gray-400">
                  Soit {PRICING.quarterly.monthlyEquivalent}€/mois
                </p>
                <p className="text-sm text-green-400 font-medium mt-1">
                  Economisez {PRICING.quarterly.savings}%
                </p>
                {selectedPlan === 'quarterly' && (
                  <div className="absolute top-4 right-4 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>

              {/* Yearly */}
              <button
                onClick={() => setSelectedPlan('yearly')}
                className={`relative p-6 rounded-2xl border-2 transition-all duration-200 text-left ${
                  selectedPlan === 'yearly'
                    ? 'border-primary bg-primary/10'
                    : 'border-white/10 hover:border-white/30 bg-white/5'
                }`}
              >
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    MEILLEURE OFFRE
                  </span>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-400 mb-1">Annuel</p>
                  <p className="text-3xl font-bold">
                    {PRICING.yearly.price}€
                    <span className="text-base font-normal text-gray-400">/an</span>
                  </p>
                </div>
                <p className="text-sm text-gray-400">
                  Soit {PRICING.yearly.monthlyEquivalent}€/mois
                </p>
                <p className="text-sm text-green-400 font-medium mt-1">
                  Economisez {PRICING.yearly.savings}%
                </p>
                {selectedPlan === 'yearly' && (
                  <div className="absolute top-4 right-4 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            </div>

            {/* CTA Button */}
            <div className="text-center">
              <button
                onClick={() => handleUpgrade(selectedPlan)}
                disabled={actionLoading}
                className="bg-primary hover:bg-primary-dark text-white px-12 py-4 rounded-lg font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Redirection vers le paiement...
                  </span>
                ) : (
                  `Passer à Premium - ${PRICING[selectedPlan].price}€`
                )}
              </button>
              <p className="text-sm text-gray-500 mt-4">
                Paiement sécurisé par Stripe
              </p>
            </div>

            {/* Features reminder */}
            <div className="mt-12 grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-bold mb-1">Alertes prioritaires</h3>
                <p className="text-sm text-gray-400">Recevez les deals avant tout le monde</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="font-bold mb-1">Vos destinations</h3>
                <p className="text-sm text-gray-400">On surveille vos destinations préférées</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="font-bold mb-1">Alertes SMS</h3>
                <p className="text-sm text-gray-400">Ne ratez plus jamais un deal</p>
              </div>
            </div>
          </div>
        )}

        {/* FAQ */}
        <div className="glass-card mt-8 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <h2 className="text-2xl font-bold mb-6">Questions fréquentes</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold mb-2">Comment fonctionne le paiement ?</h3>
              <p className="text-sm text-gray-400">
                Paiement sécurisé via Stripe. Carte bancaire, Apple Pay, Google Pay acceptés.
                Facturation mensuelle automatique.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-2">Puis-je annuler a tout moment ?</h3>
              <p className="text-sm text-gray-400">
                Oui, sans engagement. Vous gardez l'accès Premium jusqu'à la fin de la période payée.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-2">Que se passe-t-il si j'annule ?</h3>
              <p className="text-sm text-gray-400">
                Vous repassez automatiquement en plan gratuit (emails uniquement) à la fin de votre période.
                Vos destinations suivies sont conservées.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-2">Que comprend le plan gratuit ?</h3>
              <p className="text-sm text-gray-400">
                Alertes par email illimitées, destinations illimitées. Seuls les SMS sont réservés au Premium.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
