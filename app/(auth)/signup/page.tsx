'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

export default function Signup() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const planParam = searchParams.get('plan')

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    plan: planParam || 'free',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation du téléphone pour premium
    if (formData.plan === 'premium' && !formData.phone) {
      setError('Le numéro de téléphone est requis pour le plan Premium')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'inscription')
      }

      // If premium plan, redirect to Stripe checkout
      if (formData.plan === 'premium') {
        const checkoutResponse = await fetch('/api/stripe/create-checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: data.user.id }),
        })

        const checkoutData = await checkoutResponse.json()

        if (checkoutData.url) {
          window.location.href = checkoutData.url
          return
        }
      }

      // Store user session
      localStorage.setItem('user', JSON.stringify(data.user))

      // Trigger auth change event for header update
      window.dispatchEvent(new Event('auth-change'))

      router.push('/destinations')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/20 to-black" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />

      <div className="container mx-auto max-w-2xl relative z-10">
        <div className="text-center mb-8 animate-fade-in-up">
          <h1 className="heading-lg mb-4">Inscription</h1>
          <p className="subtitle">
            Créez votre compte et commencez à recevoir les meilleurs deals
          </p>
        </div>

        <div className="glass-card animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg animate-scale-in">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-300">
                Email *
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="input-glass w-full"
                placeholder="votre@email.com"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2 text-gray-300"
              >
                Mot de passe *
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="input-glass w-full"
                placeholder="Minimum 6 caractères"
                required
                minLength={6}
              />
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-300">
                Prénom (optionnel)
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="input-glass w-full"
                placeholder="Votre prénom"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-3 text-gray-300">Plan *</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, plan: 'free' })}
                  className={`p-6 rounded-xl border-2 transition-all duration-200 transform hover:scale-105 ${
                    formData.plan === 'free'
                      ? 'border-green-500 bg-green-500/10 shadow-lg shadow-green-500/20'
                      : 'glass border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="text-2xl mb-2 font-bold text-green-400">Gratuit</div>
                  <div className="font-bold text-lg mb-1">0€/mois</div>
                  <div className="text-sm text-gray-400">Alertes email uniquement</div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, plan: 'premium' })}
                  className={`p-6 rounded-xl border-2 transition-all duration-200 transform hover:scale-105 relative ${
                    formData.plan === 'premium'
                      ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                      : 'glass border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="absolute -top-3 -right-3 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                    POPULAIRE
                  </div>
                  <div className="text-2xl mb-2 font-bold text-primary">Premium</div>
                  <div className="font-bold text-lg mb-1">4,99€/mois</div>
                  <div className="text-sm text-gray-400">ou 11,99€/trimestre ou 44,99€/an</div>
                </button>
              </div>
            </div>

            {formData.plan === 'premium' && (
              <div className="animate-fade-in-up">
                <label htmlFor="phone" className="block text-sm font-medium mb-2 text-gray-300">
                  Numéro de téléphone * (pour les alertes SMS)
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="input-glass w-full"
                  placeholder="+33 6 12 34 56 78"
                  required={formData.plan === 'premium'}
                />
                <p className="text-xs text-gray-400 mt-1">
                  Format international recommandé (ex: +33612345678)
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-lg transition-all duration-200 disabled:opacity-50 transform hover:scale-105 shadow-lg shadow-primary/20"
            >
              {loading
                ? 'Inscription...'
                : formData.plan === 'premium'
                ? 'Continuer vers le paiement'
                : 'S\'inscrire gratuitement'}
            </button>
          </form>

          <div className="mt-6 text-center text-gray-400">
            <p>
              Déjà un compte?{' '}
              <Link href="/login" className="text-primary hover:text-primary-light transition-colors font-medium">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
