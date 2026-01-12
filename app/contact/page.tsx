'use client'

import { useState } from 'react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>(
    'idle'
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')

    // Simulate API call
    setTimeout(() => {
      setStatus('sent')
      setFormData({ name: '', email: '', subject: '', message: '' })
      setTimeout(() => setStatus('idle'), 3000)
    }, 1000)
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">Contactez-nous</h1>
        <p className="text-gray-300 text-xl">
          Une question? Une suggestion? Nous sommes là pour vous aider.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-3">📧 Email</h3>
          <p className="text-gray-300 mb-2">contact@flightdeals.com</p>
          <p className="text-gray-400 text-sm">
            Nous répondons sous 24h
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-3">💬 Support</h3>
          <p className="text-gray-300 mb-2">support@flightdeals.com</p>
          <p className="text-gray-400 text-sm">
            Pour toute question technique
          </p>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-6">Envoyez-nous un message</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Nom
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors"
              required
            />
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium mb-2">
              Sujet
            </label>
            <input
              type="text"
              id="subject"
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
              className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors"
              required
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-2">
              Message
            </label>
            <textarea
              id="message"
              rows={6}
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors resize-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'sending'
              ? 'Envoi...'
              : status === 'sent'
              ? 'Message envoyé ✓'
              : 'Envoyer le message'}
          </button>
        </form>
      </div>
    </div>
  )
}
