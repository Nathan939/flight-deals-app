'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

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

export default function UpgradePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

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

  const handleUpgrade = async () => {
    if (!user) return

    setActionLoading(true)
    try {
      // Créer une session Stripe Checkout
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      })

      const data = await response.json()

      if (data.url) {
        // Rediriger vers Stripe Checkout
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

  const handleManageBilling = () => {
    // Rediriger vers le portail client Stripe
    window.open('https://billing.stripe.com/p/login/test_YOUR_PORTAL_ID', '_blank')
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
          <p className="text-xl text-gray-300">
            Gérez votre abonnement et vos informations de paiement
          </p>
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
                ? isCancelled ? 'Annulé' : 'Actif'
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

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            {!isPremium ? (
              <button
                onClick={handleUpgrade}
                disabled={actionLoading}
                className="flex-1 bg-primary hover:bg-primary-dark text-white px-6 py-4 rounded-lg font-bold transition-all duration-200 transform hover:scale-105 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading ? 'Chargement...' : 'Passer en Premium - 4,99€/mois'}
              </button>
            ) : (
              <>
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
                  className="flex-1 glass hover:bg-white/10 text-white px-6 py-4 rounded-lg font-bold transition-all duration-200 border border-white/20"
                >
                  Gerer la facturation
                </button>
              </>
            )}
          </div>

          {isCancelled && (
            <div className="mt-4 p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
              <p className="text-sm text-orange-300">
                Votre abonnement a ete annule mais reste actif jusqu'à la fin de la période payée.
                Vous pouvez le réactiver à tout moment.
              </p>
            </div>
          )}
        </div>

        {/* Pricing Comparison */}
        {!isPremium && (
          <div className="glass-card animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <h2 className="text-2xl font-bold mb-6">Pourquoi passer en Premium ?</h2>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-2xl mb-3 font-bold text-primary">SMS</div>
                <h3 className="font-bold mb-2">SMS Instantanés</h3>
                <p className="text-sm text-gray-400">
                  Recevez les deals par SMS en temps réel, ne manquez plus jamais une bonne affaire
                </p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-3 font-bold text-yellow-400">FAST</div>
                <h3 className="font-bold mb-2">Réactivité</h3>
                <p className="text-sm text-gray-400">
                  Les meilleurs deals partent vite. Le SMS est 10x plus rapide que l'email
                </p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-3 font-bold text-green-400">$$$</div>
                <h3 className="font-bold mb-2">Économies</h3>
                <p className="text-sm text-gray-400">
                  Un seul vol économisé et l'abonnement est remboursé pour l'année entière
                </p>
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-6 text-center">
              <p className="text-2xl font-bold mb-2">
                4,99€ <span className="text-lg text-gray-400">/ mois</span>
              </p>
              <p className="text-sm text-gray-400 mb-4">
                Sans engagement • Annulez à tout moment
              </p>
              <button
                onClick={handleUpgrade}
                disabled={actionLoading}
                className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-bold transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading ? 'Chargement...' : 'Commencer maintenant'}
              </button>
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
