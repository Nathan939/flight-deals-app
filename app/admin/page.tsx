'use client'

import { useState, useEffect } from 'react'

// Liste des emails autorisés à accéder à l'admin (depuis variable d'environnement)
const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase()).filter(Boolean)

// Vérifier si on est en production (Vercel)
const IS_PRODUCTION = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production'

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
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [activeTab, setActiveTab] = useState<'offers' | 'users' | 'searches' | 'tests'>('offers')
  const [searchRequests, setSearchRequests] = useState<any[]>([])
  const [loadingSearches, setLoadingSearches] = useState(false)
  const [selectedDestCode, setSelectedDestCode] = useState('')
  const [selectedDestCity, setSelectedDestCity] = useState('')
  const [offerForm, setOfferForm] = useState({
    from: '',
    fromCity: '',
    price: '',
    originalPrice: '',
    url: '',
    toCountry: '',
    flag: '',
    description: '',
    activities: '',
    airline: '',
  })
  const [dateRows, setDateRows] = useState<Array<{ month: string; date: string; price: string; url: string }>>([
    { month: '', date: '', price: '', url: '' }
  ])

  // Airport search state
  const [fromSearch, setFromSearch] = useState('')
  const [toSearch, setToSearch] = useState('')
  const [fromResults, setFromResults] = useState<Array<{ code: string; city: string; country: string }>>([])
  const [toResults, setToResults] = useState<Array<{ code: string; city: string; country: string }>>([])
  const [fromSearchLoading, setFromSearchLoading] = useState(false)
  const [toSearchLoading, setToSearchLoading] = useState(false)
  const [showFromDropdown, setShowFromDropdown] = useState(false)
  const [showToDropdown, setShowToDropdown] = useState(false)

  // Search airports function
  const searchAirports = async (query: string, type: 'from' | 'to') => {
    if (!query || query.length < 2) {
      if (type === 'from') {
        setFromResults([])
        setShowFromDropdown(false)
      } else {
        setToResults([])
        setShowToDropdown(false)
      }
      return
    }

    if (type === 'from') {
      setFromSearchLoading(true)
      setShowFromDropdown(true)
    } else {
      setToSearchLoading(true)
      setShowToDropdown(true)
    }

    try {
      const response = await fetch(`/api/destinations/search?q=${encodeURIComponent(query)}&limit=10`)
      if (response.ok) {
        const data = await response.json()
        const locations = data.results || []
        // Map to simpler format with code, city, country
        const airports = locations
          .filter((loc: any) => loc.code)
          .map((loc: any) => ({
            code: loc.code,
            city: loc.city,
            country: loc.country
          }))
        if (type === 'from') {
          setFromResults(airports.slice(0, 8))
        } else {
          setToResults(airports.slice(0, 8))
        }
      }
    } catch (error) {
      console.error('Error searching airports:', error)
    } finally {
      if (type === 'from') {
        setFromSearchLoading(false)
      } else {
        setToSearchLoading(false)
      }
    }
  }

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (fromSearch) {
        searchAirports(fromSearch, 'from')
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [fromSearch])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (toSearch) {
        searchAirports(toSearch, 'to')
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [toSearch])

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
    if (isAuthenticated && activeTab === 'searches') {
      loadSearchRequests()
    }
  }, [isAuthenticated, activeTab])

  const handleLogin = async () => {
    setLoginError('')
    setLoginLoading(true)

    try {
      // En production: uniquement connexion par email admin
      if (IS_PRODUCTION) {
        if (!email) {
          setLoginError('Veuillez entrer votre email admin')
          setLoginLoading(false)
          return
        }

        // Vérifier si l'email est dans la liste des admins
        if (!ADMIN_EMAILS.includes(email.toLowerCase())) {
          setLoginError('Cet email n\'est pas autorisé à accéder à l\'admin')
          setLoginLoading(false)
          return
        }

        // Se connecter via l'API
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        })

        if (response.ok) {
          setIsAuthenticated(true)
          sessionStorage.setItem('admin_auth', 'true')
          sessionStorage.setItem('admin_email', email.toLowerCase())
          loadDestinations()
        } else {
          const data = await response.json()
          setLoginError(data.error || 'Email ou mot de passe incorrect')
        }
      } else {
        // En local: mot de passe admin simple (pour dev uniquement)
        const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'
        if (password === adminPassword) {
          setIsAuthenticated(true)
          sessionStorage.setItem('admin_auth', 'true')
          loadDestinations()
        } else {
          setLoginError('Mot de passe incorrect')
        }
      }
    } catch (error) {
      setLoginError('Erreur de connexion')
    } finally {
      setLoginLoading(false)
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

  const updateDateRow = (idx: number, field: string, value: string) => {
    const updated = [...dateRows]
    updated[idx] = { ...updated[idx], [field]: value }
    setDateRows(updated)
  }

  const removeDateRow = (idx: number) => {
    if (dateRows.length <= 1) return
    setDateRows(dateRows.filter((_, i) => i !== idx))
  }

  const addDateRow = () => {
    const lastRow = dateRows[dateRows.length - 1]
    setDateRows([...dateRows, { month: lastRow?.month || '', date: '', price: '', url: lastRow?.url || '' }])
  }

  const loadSearchRequests = async () => {
    setLoadingSearches(true)
    try {
      const res = await fetch('/api/admin/search-requests')
      if (res.ok) {
        const data = await res.json()
        setSearchRequests(data.searchRequests || [])
      }
    } catch (error) {
      console.error('Error loading search requests:', error)
    } finally {
      setLoadingSearches(false)
    }
  }

  const handleSendOffer = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!offerForm.from) {
      alert('Veuillez sélectionner un aéroport de départ')
      return
    }

    if (!selectedDestCode || !selectedDestCity) {
      alert('Veuillez sélectionner une destination')
      return
    }

    if (!offerForm.price || !offerForm.originalPrice) {
      alert('Veuillez remplir le prix et le prix original')
      return
    }

    const discount = Math.round(
      ((parseFloat(offerForm.originalPrice) - parseFloat(offerForm.price)) /
        parseFloat(offerForm.originalPrice)) *
        100
    )

    // Group date rows by month
    const validRows = dateRows.filter(r => r.date && r.price)
    let structuredDates: Record<string, Array<{ date: string; price: number; url: string }>> | undefined
    if (validRows.length > 0) {
      structuredDates = {}
      for (const row of validRows) {
        const monthKey = row.month || 'Dates'
        if (!structuredDates[monthKey]) structuredDates[monthKey] = []
        structuredDates[monthKey].push({
          date: row.date,
          price: parseFloat(row.price),
          url: row.url || offerForm.url || ''
        })
      }
    }

    // Parse activities
    const activitiesArray = offerForm.activities
      .split('\n')
      .map(a => a.trim())
      .filter(Boolean)

    const offerData = {
      from: offerForm.from,
      fromCity: offerForm.fromCity || undefined,
      to: selectedDestCode,
      toCity: selectedDestCity,
      toCountry: offerForm.toCountry || undefined,
      flag: offerForm.flag || undefined,
      description: offerForm.description || undefined,
      activities: activitiesArray.length > 0 ? JSON.stringify(activitiesArray) : undefined,
      airline: offerForm.airline || undefined,
      price: parseFloat(offerForm.price),
      originalPrice: parseFloat(offerForm.originalPrice),
      currency: 'EUR',
      discount,
      dates: structuredDates ? JSON.stringify(structuredDates) : undefined,
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
        alert(`Offre envoyée avec succès à ${result.notificationsSent} utilisateur(s) !`)

        // Réinitialiser le formulaire
        setOfferForm({
          from: '',
          fromCity: '',
          price: '',
          originalPrice: '',
          url: '',
          toCountry: '',
          flag: '',
          description: '',
          activities: '',
          airline: '',
        })
        setDateRows([{ month: '', date: '', price: '', url: '' }])
        setSelectedDestCode('')
        setSelectedDestCity('')
        setFromSearch('')
        setToSearch('')
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

          {loginError && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-4">
              {loginError}
            </div>
          )}

          <div className="space-y-4">
            {IS_PRODUCTION ? (
              <>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email admin"
                  className="input-glass w-full"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  placeholder="Mot de passe"
                  className="input-glass w-full"
                />
              </>
            ) : (
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="Mot de passe admin (dev)"
                className="input-glass w-full"
              />
            )}
            <button
              onClick={handleLogin}
              disabled={loginLoading}
              className="btn-primary w-full disabled:opacity-50"
            >
              {loginLoading ? 'Connexion...' : 'Se connecter'}
            </button>
          </div>

          <p className="mt-4 text-center text-xs text-gray-500">
            {IS_PRODUCTION
              ? 'Connectez-vous avec votre compte admin autorise'
              : 'Mode developpement - Mot de passe simple'}
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
              onClick={() => setActiveTab('searches')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'searches'
                  ? 'bg-primary text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Recherches
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
                {/* Departure Airport Search */}
                <div className="mb-4 relative">
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Départ de
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={fromSearch}
                      onChange={(e) => {
                        setFromSearch(e.target.value)
                        if (!e.target.value) {
                          setOfferForm({ ...offerForm, from: '', fromCity: '' })
                        }
                      }}
                      onFocus={() => fromResults.length > 0 && setShowFromDropdown(true)}
                      placeholder="Rechercher un aéroport de départ..."
                      className="input-glass w-full"
                      autoComplete="off"
                    />
                    {fromSearchLoading && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
                      </div>
                    )}
                  </div>
                  {/* From Results Dropdown */}
                  {showFromDropdown && fromResults.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-gray-900 border border-white/20 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                      {fromResults.map((airport) => (
                        <button
                          key={airport.code}
                          type="button"
                          onClick={() => {
                            setOfferForm({ ...offerForm, from: airport.code, fromCity: airport.city })
                            setFromSearch(`${airport.city} (${airport.code})`)
                            setShowFromDropdown(false)
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-white/10 transition-colors border-b border-white/5 last:border-0"
                        >
                          <div className="font-medium">{airport.city} ({airport.code})</div>
                          <div className="text-sm text-gray-400">{airport.country}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Destination Airport Search */}
                <div className="mb-4 relative">
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Destination
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={toSearch}
                      onChange={(e) => {
                        setToSearch(e.target.value)
                        if (!e.target.value) {
                          setSelectedDestCode('')
                          setSelectedDestCity('')
                        }
                      }}
                      onFocus={() => toResults.length > 0 && setShowToDropdown(true)}
                      placeholder="Rechercher un aéroport de destination..."
                      className="input-glass w-full"
                      autoComplete="off"
                    />
                    {toSearchLoading && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
                      </div>
                    )}
                  </div>
                  {/* To Results Dropdown */}
                  {showToDropdown && toResults.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-gray-900 border border-white/20 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                      {toResults.map((airport) => (
                        <button
                          key={airport.code}
                          type="button"
                          onClick={() => {
                            setSelectedDestCode(airport.code)
                            setSelectedDestCity(airport.city)
                            setToSearch(`${airport.city} (${airport.code})`)
                            setShowToDropdown(false)
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-white/10 transition-colors border-b border-white/5 last:border-0"
                        >
                          <div className="font-medium">{airport.city} ({airport.code})</div>
                          <div className="text-sm text-gray-400">{airport.country}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Pays / Drapeau / Compagnie */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Pays</label>
                    <input
                      type="text"
                      value={offerForm.toCountry}
                      onChange={(e) => setOfferForm({ ...offerForm, toCountry: e.target.value })}
                      placeholder="Thaïlande"
                      className="input-glass w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Code pays</label>
                    <input
                      type="text"
                      value={offerForm.flag}
                      onChange={(e) => setOfferForm({ ...offerForm, flag: e.target.value.toUpperCase().slice(0, 2) })}
                      placeholder="TH"
                      maxLength={2}
                      className="input-glass w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Compagnie</label>
                    <input
                      type="text"
                      value={offerForm.airline}
                      onChange={(e) => setOfferForm({ ...offerForm, airline: e.target.value })}
                      placeholder="Thai Airways"
                      className="input-glass w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Prix de l&apos;offre (€)
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
                    Lien principal de l&apos;offre
                  </label>
                  <input
                    type="url"
                    value={offerForm.url}
                    onChange={(e) => setOfferForm({ ...offerForm, url: e.target.value })}
                    placeholder="https://www.google.com/flights/..."
                    className="input-glass w-full"
                  />
                </div>

                {/* Multi-date rows */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Dates et prix disponibles
                  </label>
                  <div className="space-y-2">
                    {dateRows.map((row, idx) => (
                      <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                        <input
                          type="text"
                          value={row.month}
                          onChange={(e) => updateDateRow(idx, 'month', e.target.value)}
                          placeholder="Mars 2026"
                          className="input-glass col-span-3 text-xs"
                        />
                        <input
                          type="text"
                          value={row.date}
                          onChange={(e) => updateDateRow(idx, 'date', e.target.value)}
                          placeholder="15-22 Mars"
                          className="input-glass col-span-3 text-xs"
                        />
                        <input
                          type="number"
                          value={row.price}
                          onChange={(e) => updateDateRow(idx, 'price', e.target.value)}
                          placeholder="249"
                          className="input-glass col-span-2 text-xs"
                        />
                        <input
                          type="url"
                          value={row.url}
                          onChange={(e) => updateDateRow(idx, 'url', e.target.value)}
                          placeholder="URL (optionnel)"
                          className="input-glass col-span-3 text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => removeDateRow(idx)}
                          className="col-span-1 text-red-400 hover:text-red-300 text-center text-lg"
                          title="Supprimer"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={addDateRow}
                    className="mt-2 text-primary hover:text-primary/80 text-sm font-medium"
                  >
                    + Ajouter une date
                  </button>
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Description de la destination
                  </label>
                  <textarea
                    value={offerForm.description}
                    onChange={(e) => setOfferForm({ ...offerForm, description: e.target.value })}
                    rows={3}
                    placeholder="Bangkok, la capitale vibrante de la Thaïlande..."
                    className="input-glass w-full"
                  />
                </div>

                {/* Activities */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Activités (une par ligne)
                  </label>
                  <textarea
                    value={offerForm.activities}
                    onChange={(e) => setOfferForm({ ...offerForm, activities: e.target.value })}
                    rows={4}
                    placeholder={"Visite du Grand Palais\nCroisière sur le fleuve\nDécouverte de la street food"}
                    className="input-glass w-full"
                  />
                </div>

                {offerForm.price && offerForm.originalPrice && (
                  <div className="mb-4 p-4 bg-primary/10 border border-primary/30 rounded-lg">
                    <p className="text-sm text-gray-300">
                      Réduction : <span className="text-primary font-bold text-lg">
                        {Math.round(
                          ((parseFloat(offerForm.originalPrice) - parseFloat(offerForm.price)) /
                            parseFloat(offerForm.originalPrice)) *
                            100
                        )}%
                      </span>
                      {dateRows.filter(r => r.date && r.price).length > 0 && (
                        <span className="ml-3 text-gray-400">
                          · {dateRows.filter(r => r.date && r.price).length} date(s)
                        </span>
                      )}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !selectedDestCode || !offerForm.from || !offerForm.price || !offerForm.originalPrice}
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

        {/* Searches Tab */}
        {activeTab === 'searches' && (
          <div className="glass-card">
            <h2 className="text-2xl font-bold mb-6">Recherches des utilisateurs</h2>
            {loadingSearches ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-400">Chargement...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-4 px-4 font-medium text-gray-300">Utilisateur</th>
                      <th className="text-left py-4 px-4 font-medium text-gray-300">Trajet</th>
                      <th className="text-left py-4 px-4 font-medium text-gray-300">Type</th>
                      <th className="text-left py-4 px-4 font-medium text-gray-300">Dates</th>
                      <th className="text-left py-4 px-4 font-medium text-gray-300">Budget max</th>
                      <th className="text-left py-4 px-4 font-medium text-gray-300">Statut</th>
                      <th className="text-left py-4 px-4 font-medium text-gray-300">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchRequests.map((req) => (
                      <tr key={req.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-4 px-4">
                          <div className="text-sm">{req.userName || '-'}</div>
                          <div className="text-xs text-gray-400">{req.userEmail}</div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-medium">{req.fromCity}</span>
                          <span className="text-gray-400 mx-2">&rarr;</span>
                          <span className="font-medium">{req.toCity}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 rounded text-xs ${
                            req.tripType === 'return'
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-purple-500/20 text-purple-400'
                          }`}>
                            {req.tripType === 'return' ? 'A/R' : 'Aller simple'}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-400">
                          {req.departureMonth || '-'}
                          {req.returnMonth ? ` / ${req.returnMonth}` : ''}
                        </td>
                        <td className="py-4 px-4">
                          {req.maxPrice ? `${req.maxPrice}€` : '-'}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 rounded text-xs ${
                            req.status === 'pending'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : req.status === 'processed'
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-green-500/20 text-green-400'
                          }`}>
                            {req.status === 'pending' ? 'En attente' : req.status === 'processed' ? 'Traité' : 'Envoyé'}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-400 text-sm">
                          {new Date(req.createdAt).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {searchRequests.length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    Aucune recherche pour le moment
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
