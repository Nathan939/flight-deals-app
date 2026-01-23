'use client'

import { useState, useEffect } from 'react'

interface Destination {
  id: string
  userId: string
  code: string
  city: string
  country: string
  notifyChannel: string
  user: {
    email: string
    name: string | null
    phone: string | null
  }
}

interface User {
  id: string
  email: string
  name: string | null
  createdAt: string
  subscription: {
    plan: string
    status: string
  }
}

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [activeTab, setActiveTab] = useState<'offers' | 'users' | 'tests'>('offers')
  const [selectedDestCode, setSelectedDestCode] = useState('')
  const [offerForm, setOfferForm] = useState({
    from: 'CDG', // Paris par défaut
    price: '',
    originalPrice: '',
    url: '',
    dates: ''
  })

  // Vérifier si déjà authentifié
  useEffect(() => {
    const authStatus = sessionStorage.getItem('admin_auth')
    if (authStatus === 'true') {
      setIsAuthenticated(true)
      loadDestinations()
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated && activeTab === 'users') {
      loadUsers()
    }
  }, [isAuthenticated, activeTab])

  const handleLogin = () => {
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'
    if (password === adminPassword) {
      setIsAuthenticated(true)
      sessionStorage.setItem('admin_auth', 'true')
      loadDestinations()
    } else {
      alert('Mot de passe incorrect')
    }
  }

  const loadDestinations = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/destinations')
      if (res.ok) {
        const data = await res.json()
        setDestinations(data.destinations || [])
      }
    } catch (error) {
      console.error('Error loading destinations:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadUsers = async () => {
    setLoadingUsers(true)
    try {
      const res = await fetch('/api/admin/users')
      if (res.ok) {
        const data = await res.json()
        setUsers(data.users || [])
      }
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setLoadingUsers(false)
    }
  }

  const handleSendOffer = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedDestCode) {
      alert('Veuillez sélectionner une destination')
      return
    }

    if (!offerForm.price || !offerForm.originalPrice) {
      alert('Veuillez remplir le prix et le prix original')
      return
    }

    const destination = destinations.find(d => d.code === selectedDestCode)
    if (!destination) return

    const discount = Math.round(
      ((parseFloat(offerForm.originalPrice) - parseFloat(offerForm.price)) /
        parseFloat(offerForm.originalPrice)) *
        100
    )

    const offerData = {
      from: offerForm.from,
      to: destination.code,
      toCity: destination.city,
      price: parseFloat(offerForm.price),
      originalPrice: parseFloat(offerForm.originalPrice),
      currency: 'EUR',
      discount,
      dates: offerForm.dates || undefined,
      url: offerForm.url || undefined
    }

    setLoading(true)
    try {
      // Créer le deal dans la base de données et envoyer les notifications
      const res = await fetch('/api/admin/send-offer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(offerData)
      })

      if (res.ok) {
        const result = await res.json()
        alert(`Offre envoyee avec succes a ${result.notificationsSent} utilisateur(s) !`)

        // Réinitialiser le formulaire
        setOfferForm({
          from: 'CDG',
          price: '',
          originalPrice: '',
          url: '',
          dates: ''
        })
        setSelectedDestCode('')
      } else {
        const error = await res.json()
        alert(`Erreur: ${error.error}`)
      }
    } catch (error) {
      console.error('Error sending offer:', error)
      alert('Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId: string, email: string) => {
    if (!confirm(`Supprimer l'utilisateur ${email} ?`)) return

    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' })
      if (res.ok) {
        setUsers(users.filter((u) => u.id !== userId))
        alert('Utilisateur supprimé')
      } else {
        alert('Erreur lors de la suppression')
      }
    } catch (error) {
      alert('Erreur lors de la suppression')
    }
  }

  const handleSendTestEmail = async () => {
    const email = prompt('Email de test:')
    if (!email) return

    try {
      const response = await fetch('/api/admin/send-test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        alert('Email de test envoyé!')
      } else {
        alert('Erreur lors de l\'envoi')
      }
    } catch (error) {
      alert('Erreur lors de l\'envoi')
    }
  }

  const handleSendTestSMS = async () => {
    const phone = prompt('Numéro de téléphone (format international):')
    if (!phone) return

    try {
      const response = await fetch('/api/admin/send-test-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: phone }),
      })

      if (response.ok) {
        alert('SMS de test envoyé!')
      } else {
        alert('Erreur lors de l\'envoi')
      }
    } catch (error) {
      alert('Erreur lors de l\'envoi')
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black px-4">
        <div className="glass-card max-w-md w-full p-8">
          <h1 className="text-3xl font-bold mb-6 text-center">
            Admin Dashboard
          </h1>
          <p className="text-gray-400 mb-6 text-center">
            Connexion requise pour accéder au tableau de bord
          </p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="Mot de passe"
            className="input-glass w-full mb-4"
          />
          <button
            onClick={handleLogin}
            className="btn-primary w-full"
          >
            Se connecter
          </button>
          <p className="mt-4 text-center text-xs text-gray-500">
            Mot de passe par défaut: admin123
          </p>
        </div>
      </div>
    )
  }

  // Grouper les destinations par code d'aéroport
  const destinationGroups = destinations.reduce((acc, dest) => {
    if (!acc[dest.code]) {
      acc[dest.code] = {
        code: dest.code,
        city: dest.city,
        country: dest.country,
        users: []
      }
    }
    acc[dest.code].users.push({
      email: dest.user.email,
      name: dest.user.name,
      phone: dest.user.phone,
      notifyChannel: dest.notifyChannel
    })
    return acc
  }, {} as Record<string, {
    code: string
    city: string
    country: string
    users: Array<{
      email: string
      name: string | null
      phone: string | null
      notifyChannel: string
    }>
  }>)

  const destinationList = Object.values(destinationGroups)

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="fixed inset-0 bg-gradient-to-b from-black via-gray-900/20 to-black pointer-events-none" />

      <div className="container mx-auto px-4 py-16 max-w-7xl relative z-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">
            Dashboard Admin - <span className="text-primary">FlightDeals</span>
          </h1>
          <button
            onClick={() => {
              sessionStorage.removeItem('admin_auth')
              setIsAuthenticated(false)
            }}
            className="text-sm text-gray-400 hover:text-white px-4 py-2 rounded-lg hover:bg-white/5"
          >
            Déconnexion
          </button>
        </div>

        {/* Tabs */}
        <div className="glass-card mb-6">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('offers')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'offers'
                  ? 'bg-primary text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Envoyer des offres
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'users'
                  ? 'bg-primary text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Utilisateurs ({users.length})
            </button>
            <button
              onClick={() => setActiveTab('tests')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'tests'
                  ? 'bg-primary text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Tests
            </button>
          </div>
        </div>

        {/* Offers Tab */}
        {activeTab === 'offers' && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Formulaire d'envoi d'offre */}
            <div className="glass-card">
              <h2 className="text-2xl font-bold mb-6">Envoyer une offre de vol</h2>

              <form onSubmit={handleSendOffer}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Destination
                  </label>
                  <select
                    value={selectedDestCode}
                    onChange={(e) => setSelectedDestCode(e.target.value)}
                    className="input-glass w-full"
                    required
                  >
                    <option value="">Sélectionner une destination</option>
                    {destinationList.map(dest => (
                      <option key={dest.code} value={dest.code}>
                        {dest.city} ({dest.code}) - {dest.users.length} utilisateur(s)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Départ de
                  </label>
                  <input
                    type="text"
                    value={offerForm.from}
                    onChange={(e) => setOfferForm({ ...offerForm, from: e.target.value })}
                    placeholder="CDG, ORY, etc."
                    className="input-glass w-full"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Prix de l'offre (€)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={offerForm.price}
                      onChange={(e) => setOfferForm({ ...offerForm, price: e.target.value })}
                      placeholder="299"
                      className="input-glass w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Prix original (€)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={offerForm.originalPrice}
                      onChange={(e) => setOfferForm({ ...offerForm, originalPrice: e.target.value })}
                      placeholder="850"
                      className="input-glass w-full"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Lien de l'offre
                  </label>
                  <input
                    type="url"
                    value={offerForm.url}
                    onChange={(e) => setOfferForm({ ...offerForm, url: e.target.value })}
                    placeholder="https://www.google.com/flights/..."
                    className="input-glass w-full"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Dates disponibles (optionnel)
                  </label>
                  <input
                    type="text"
                    value={offerForm.dates}
                    onChange={(e) => setOfferForm({ ...offerForm, dates: e.target.value })}
                    placeholder="15-22 Mars 2026"
                    className="input-glass w-full"
                  />
                </div>

                {offerForm.price && offerForm.originalPrice && (
                  <div className="mb-4 p-4 bg-primary/10 border border-primary/30 rounded-lg">
                    <p className="text-sm text-gray-300">
                      Réduction: <span className="text-primary font-bold text-lg">
                        {Math.round(
                          ((parseFloat(offerForm.originalPrice) - parseFloat(offerForm.price)) /
                            parseFloat(offerForm.originalPrice)) *
                            100
                        )}%
                      </span>
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !selectedDestCode}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Envoi en cours...' : 'Envoyer l\'offre'}
                </button>
              </form>
            </div>

            {/* Liste des destinations avec utilisateurs */}
            <div className="glass-card">
              <h2 className="text-2xl font-bold mb-6">Destinations suivies</h2>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-gray-400">Chargement...</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {destinationList.map(dest => (
                    <div
                      key={dest.code}
                      className={`p-4 bg-white/5 rounded-lg border transition-all cursor-pointer ${
                        selectedDestCode === dest.code
                          ? 'border-primary/50 bg-primary/10'
                          : 'border-white/10 hover:border-primary/30'
                      }`}
                      onClick={() => setSelectedDestCode(dest.code)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-lg">{dest.city}</h3>
                          <p className="text-sm text-gray-400">{dest.country} · {dest.code}</p>
                        </div>
                        <div className="bg-primary/20 px-3 py-1 rounded-full">
                          <span className="text-primary font-bold">{dest.users.length}</span>
                          <span className="text-gray-400 text-sm ml-1">user(s)</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {dest.users.map((user, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 text-xs text-gray-400 pl-2 border-l-2 border-white/10"
                          >
                            <span>{user.notifyChannel === 'sms' ? 'SMS' : '@'}</span>
                            <span>{user.name || user.email}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {destinationList.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      Aucune destination suivie pour le moment
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="glass-card">
            {loadingUsers ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-400">Chargement des utilisateurs...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-4 px-4 font-medium text-gray-300">Email</th>
                      <th className="text-left py-4 px-4 font-medium text-gray-300">Nom</th>
                      <th className="text-left py-4 px-4 font-medium text-gray-300">Plan</th>
                      <th className="text-left py-4 px-4 font-medium text-gray-300">Statut</th>
                      <th className="text-left py-4 px-4 font-medium text-gray-300">Inscrit le</th>
                      <th className="text-left py-4 px-4 font-medium text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-4 px-4">{user.email}</td>
                        <td className="py-4 px-4">{user.name || '-'}</td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              user.subscription.plan === 'premium' || user.subscription.plan === 'sms'
                                ? 'bg-primary/20 text-primary'
                                : 'bg-gray-700 text-gray-300'
                            }`}
                          >
                            {user.subscription.plan}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              user.subscription.status === 'active'
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-red-500/20 text-red-400'
                            }`}
                          >
                            {user.subscription.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-400 text-sm">
                          {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="py-4 px-4">
                          <button
                            onClick={() => handleDeleteUser(user.id, user.email)}
                            className="text-red-500 hover:text-red-400 transition-colors text-sm font-medium"
                          >
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {users.length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    Aucun utilisateur pour le moment
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tests Tab */}
        {activeTab === 'tests' && (
          <div className="glass-card">
            <h2 className="text-2xl font-bold mb-6">Actions de test</h2>
            <div className="space-y-4">
              <button
                onClick={handleSendTestEmail}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                Envoyer un email de test
              </button>
              <button
                onClick={handleSendTestSMS}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                Envoyer un SMS de test
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
