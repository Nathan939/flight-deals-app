'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate sending email (in production, you'd call an API)
    await new Promise(resolve => setTimeout(resolve, 1000))

    setSubmitted(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/20 to-black" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />

      <div className="container mx-auto max-w-md relative z-10">
        <div className="text-center mb-8 animate-fade-in-up">
          <h1 className="heading-lg mb-4">Mot de passe oublie</h1>
          <p className="text-gray-300 text-lg">
            Entrez votre email pour reinitialiser votre mot de passe
          </p>
        </div>

        <div className="glass-card animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          {submitted ? (
            <div className="text-center py-8">
              <svg className="w-16 h-16 mx-auto mb-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-bold mb-2">Email envoye !</h3>
              <p className="text-gray-400 mb-6">
                Si un compte existe avec cette adresse email, vous recevrez un lien pour reinitialiser votre mot de passe.
              </p>
              <Link
                href="/login"
                className="text-primary hover:text-primary-light transition-colors font-medium"
              >
                Retour a la connexion
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-glass w-full"
                  placeholder="votre@email.com"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-lg transition-all duration-200 disabled:opacity-50 transform hover:scale-105 shadow-lg shadow-primary/20"
              >
                {loading ? 'Envoi en cours...' : 'Envoyer le lien'}
              </button>
            </form>
          )}

          <div className="mt-6 text-center text-gray-400">
            <p>
              <Link href="/login" className="text-primary hover:text-primary-light transition-colors font-medium">
                Retour a la connexion
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
