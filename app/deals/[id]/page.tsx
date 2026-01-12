'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

// Données fictives pour les deals
const DEALS_DATA: Record<string, any> = {
  'bangkok': {
    country: 'Thaïlande',
    city: 'Bangkok',
    flag: '🇹🇭',
    description: 'Bangkok, la capitale vibrante de la Thaïlande, vous offre un mélange fascinant de temples dorés, de marchés flottants animés et d\'une vie nocturne électrisante. Découvrez le Grand Palais, dégustez la street food légendaire et explorez les canaux historiques de la ville.',
    activities: [
      'Visite du Grand Palais et du Wat Pho',
      'Croisière sur le fleuve Chao Phraya',
      'Shopping aux marchés de Chatuchak',
      'Découverte de la street food locale',
      'Vie nocturne à Khao San Road'
    ],
    originalPrice: 850,
    salePrice: 249,
    discount: 71,
    departureAirport: 'CDG',
    arrivalAirport: 'BKK',
    airline: 'Thai Airways',
    airlineLogo: '✈️',
    dates: {
      'Mars 2026': [
        { date: '15-22 Mars', price: 249, url: 'https://www.skyscanner.fr' },
        { date: '20-27 Mars', price: 259, url: 'https://www.skyscanner.fr' },
        { date: '25-01 Avr', price: 249, url: 'https://www.skyscanner.fr' }
      ],
      'Avril 2026': [
        { date: '05-12 Avril', price: 269, url: 'https://www.skyscanner.fr' },
        { date: '10-17 Avril', price: 279, url: 'https://www.skyscanner.fr' },
        { date: '20-27 Avril', price: 249, url: 'https://www.skyscanner.fr' }
      ],
      'Mai 2026': [
        { date: '05-12 Mai', price: 289, url: 'https://www.skyscanner.fr' },
        { date: '15-22 Mai', price: 249, url: 'https://www.skyscanner.fr' },
        { date: '25-01 Juin', price: 269, url: 'https://www.skyscanner.fr' }
      ]
    }
  },
  'tokyo': {
    country: 'Japon',
    city: 'Tokyo',
    flag: '🇯🇵',
    description: 'Tokyo, la capitale hypermoderne du Japon, marie tradition et innovation. Entre temples millénaires et gratte-ciels futuristes, découvrez une culture unique, une gastronomie exceptionnelle et une technologie de pointe. Un voyage inoubliable vous attend.',
    activities: [
      'Découverte du temple Senso-ji à Asakusa',
      'Shopping à Shibuya et Harajuku',
      'Visite du Palais Impérial',
      'Dégustation de sushi au marché de Tsukiji',
      'Vue panoramique depuis Tokyo Skytree'
    ],
    originalPrice: 950,
    salePrice: 329,
    discount: 65,
    departureAirport: 'CDG',
    arrivalAirport: 'NRT',
    airline: 'Japan Airlines',
    airlineLogo: '✈️',
    dates: {
      'Avril 2026': [
        { date: '10-20 Avril', price: 329, url: 'https://www.skyscanner.fr' },
        { date: '15-25 Avril', price: 349, url: 'https://www.skyscanner.fr' },
        { date: '22-02 Mai', price: 339, url: 'https://www.skyscanner.fr' }
      ],
      'Mai 2026': [
        { date: '05-15 Mai', price: 359, url: 'https://www.skyscanner.fr' },
        { date: '12-22 Mai', price: 329, url: 'https://www.skyscanner.fr' },
        { date: '20-30 Mai', price: 349, url: 'https://www.skyscanner.fr' }
      ],
      'Juin 2026': [
        { date: '01-11 Juin', price: 369, url: 'https://www.skyscanner.fr' },
        { date: '10-20 Juin', price: 329, url: 'https://www.skyscanner.fr' },
        { date: '20-30 Juin', price: 339, url: 'https://www.skyscanner.fr' }
      ]
    }
  },
  'new-york': {
    country: 'États-Unis',
    city: 'New York',
    flag: '🇺🇸',
    description: 'New York, la ville qui ne dort jamais, vous promet une expérience unique. De Times Square à Central Park, en passant par la Statue de la Liberté et les musées de classe mondiale, chaque coin de rue raconte une histoire. Vivez le rêve américain!',
    activities: [
      'Visite de la Statue de la Liberté',
      'Promenade dans Central Park',
      'Shopping sur la 5ème Avenue',
      'Spectacle à Broadway',
      'Vue depuis l\'Empire State Building'
    ],
    originalPrice: 780,
    salePrice: 189,
    discount: 76,
    departureAirport: 'CDG',
    arrivalAirport: 'JFK',
    airline: 'Air France',
    airlineLogo: '✈️',
    dates: {
      'Mars 2026': [
        { date: '10-17 Mars', price: 189, url: 'https://www.skyscanner.fr' },
        { date: '18-25 Mars', price: 199, url: 'https://www.skyscanner.fr' },
        { date: '25-01 Avr', price: 189, url: 'https://www.skyscanner.fr' }
      ],
      'Avril 2026': [
        { date: '05-12 Avril', price: 209, url: 'https://www.skyscanner.fr' },
        { date: '15-22 Avril', price: 189, url: 'https://www.skyscanner.fr' },
        { date: '22-29 Avril', price: 199, url: 'https://www.skyscanner.fr' }
      ],
      'Mai 2026': [
        { date: '05-12 Mai', price: 219, url: 'https://www.skyscanner.fr' },
        { date: '15-22 Mai', price: 189, url: 'https://www.skyscanner.fr' },
        { date: '25-01 Juin', price: 209, url: 'https://www.skyscanner.fr' }
      ]
    }
  },
  'marrakech': {
    country: 'Maroc',
    city: 'Marrakech',
    flag: '🇲🇦',
    description: 'Marrakech, la perle du Sud marocain, vous transporte dans un univers de couleurs, de saveurs et de traditions. Explorez les souks animés de la médina, admirez les palais somptueux et détendez-vous dans un hammam traditionnel. Le dépaysement garanti!',
    activities: [
      'Exploration de la place Jemaa el-Fna',
      'Visite des jardins Majorelle',
      'Shopping dans les souks traditionnels',
      'Détente dans un hammam et spa',
      'Excursion dans le désert d\'Agafay'
    ],
    originalPrice: 280,
    salePrice: 30,
    discount: 89,
    departureAirport: 'LYS',
    arrivalAirport: 'RAK',
    airline: 'Royal Air Maroc',
    airlineLogo: '✈️',
    dates: {
      'Février 2026': [
        { date: '10-17 Fév', price: 30, url: 'https://www.skyscanner.fr' },
        { date: '15-22 Fév', price: 35, url: 'https://www.skyscanner.fr' },
        { date: '20-27 Fév', price: 30, url: 'https://www.skyscanner.fr' }
      ],
      'Mars 2026': [
        { date: '05-12 Mars', price: 40, url: 'https://www.skyscanner.fr' },
        { date: '15-22 Mars', price: 30, url: 'https://www.skyscanner.fr' },
        { date: '25-01 Avr', price: 35, url: 'https://www.skyscanner.fr' }
      ],
      'Avril 2026': [
        { date: '05-12 Avril', price: 45, url: 'https://www.skyscanner.fr' },
        { date: '15-22 Avril', price: 30, url: 'https://www.skyscanner.fr' },
        { date: '25-02 Mai', price: 40, url: 'https://www.skyscanner.fr' }
      ]
    }
  }
}

export default function DealDetailPage() {
  const params = useParams()
  const dealId = params.id as string
  const deal = DEALS_DATA[dealId]

  const [expandedMonths, setExpandedMonths] = useState<Record<string, boolean>>({})

  if (!deal) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Deal introuvable</h1>
        <Link href="/dashboard" className="text-primary hover:underline">
          Retour au tableau de bord
        </Link>
      </div>
    )
  }

  const toggleMonth = (month: string) => {
    setExpandedMonths(prev => ({
      ...prev,
      [month]: !prev[month]
    }))
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-400">
          <Link href="/dashboard" className="hover:text-primary transition-colors">
            Dashboard
          </Link>
          <span className="mx-2">›</span>
          <span className="text-white">{deal.city}</span>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary/20 to-black border border-primary/30 rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-6xl">{deal.flag}</span>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                {deal.city}
              </h1>
              <p className="text-xl text-gray-300">{deal.country}</p>
            </div>
          </div>

          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            {deal.description}
          </p>

          <div>
            <h3 className="text-xl font-bold mb-3 text-primary">À faire sur place :</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {deal.activities.map((activity: string, index: number) => (
                <li key={index} className="flex items-start gap-2 text-gray-300">
                  <span className="text-primary mt-1">✓</span>
                  <span>{activity}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Flight Ticket Style Section */}
        <div className="bg-gray-900 border-2 border-primary rounded-3xl overflow-hidden mb-8">
          <div className="flex flex-col md:flex-row">
            {/* Colonne gauche - Bloc prix (40%) */}
            <div className="md:w-2/5 bg-gradient-to-br from-primary/20 to-black p-8 md:border-r-2 border-primary/30">
              <div className="flex flex-col justify-between h-full">
                <div className="space-y-6">
                  {/* Prix */}
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-400 mb-3">
                      Prix ~ Aller-Retour
                    </p>
                    <p className="text-7xl font-bold text-primary mb-2">
                      {deal.salePrice}€
                    </p>
                  </div>

                  {/* Réduction */}
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-400 mb-3">
                      Réduction
                    </p>
                    <p className="text-6xl font-bold text-green-500 mb-3">
                      {deal.discount}%
                    </p>
                  </div>

                  {/* Texte explicatif */}
                  <div>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      moins cher que le prix régulier de <span className="font-bold text-white">{deal.originalPrice}€</span> pour ce trajet
                    </p>
                  </div>
                </div>

                {/* Mention légale */}
                <div className="mt-8">
                  <p className="text-xs text-gray-500">
                    *EUR, taxes incluses
                  </p>
                </div>
              </div>
            </div>

            {/* Colonne droite - Bloc informations vol (60%) */}
            <div className="md:w-3/5 bg-black/50 p-8">
              <div className="space-y-8">
                {/* Section Trajet */}
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-400 mb-6">
                    Trajet
                  </p>

                  {/* Ligne principale du trajet */}
                  <div className="flex items-center justify-center gap-8 mb-6">
                    <div className="text-center">
                      <p className="text-5xl font-bold text-primary mb-3">{deal.departureAirport}</p>
                    </div>

                    <div className="text-4xl text-primary">
                      ✈
                    </div>

                    <div className="text-center">
                      <p className="text-5xl font-bold text-primary mb-3">{deal.arrivalAirport}</p>
                    </div>
                  </div>

                  {/* Détails sous chaque code */}
                  <div className="flex items-start justify-between gap-8">
                    <div className="flex-1 text-left">
                      <p className="text-lg font-bold text-white mb-1">
                        {deal.departureAirport === 'CDG' ? 'Paris, France' : deal.departureAirport === 'LYS' ? 'Lyon, France' : 'Paris, France'}
                      </p>
                      <p className="text-sm text-gray-400">
                        {deal.departureAirport === 'CDG' ? 'Charles de Gaulle' : deal.departureAirport === 'LYS' ? 'Lyon-Saint Exupéry' : 'Charles de Gaulle'}
                      </p>
                    </div>

                    <div className="flex-1 text-right">
                      <p className="text-lg font-bold text-white mb-1">
                        {deal.city}, {deal.country}
                      </p>
                      <p className="text-sm text-gray-400">
                        {deal.arrivalAirport === 'BKK' ? 'Suvarnabhumi' :
                         deal.arrivalAirport === 'NRT' ? 'Narita International' :
                         deal.arrivalAirport === 'JFK' ? 'John F. Kennedy' :
                         deal.arrivalAirport === 'RAK' ? 'Marrakech Menara' :
                         'International'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section Compagnie aérienne */}
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-400 mb-4">
                    Compagnie aérienne
                  </p>

                  <p className="text-3xl font-bold text-white mb-2">
                    {deal.airline.toUpperCase()}
                  </p>

                  <p className="text-sm text-gray-400">
                    Vols sans escale
                  </p>
                </div>

                {/* Informations supplémentaires */}
                <div className="pt-6 border-t border-gray-700">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">✓</p>
                      <p className="text-xs text-gray-300">Bagages inclus</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">✓</p>
                      <p className="text-xs text-gray-300">Annulation flexible</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">✓</p>
                      <p className="text-xs text-gray-300">Sièges réservés</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dates Section */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <h2 className="text-3xl font-bold mb-6">Dates disponibles</h2>
          <p className="text-gray-400 mb-6">
            Sélectionnez un mois pour voir toutes les dates disponibles à prix réduit
          </p>

          <div className="space-y-4">
            {Object.entries(deal.dates).map(([month, dates]: [string, any]) => (
              <div key={month} className="border border-gray-700 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleMonth(month)}
                  className="w-full bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 px-6 py-4 flex items-center justify-between transition-all"
                >
                  <span className="text-xl font-bold">{month}</span>
                  <span className="text-2xl text-primary transform transition-transform" style={{
                    transform: expandedMonths[month] ? 'rotate(180deg)' : 'rotate(0deg)'
                  }}>
                    ▼
                  </span>
                </button>

                {expandedMonths[month] && (
                  <div className="bg-black/50 p-6 space-y-3">
                    {dates.map((dateOption: any, index: number) => (
                      <div
                        key={index}
                        className="bg-gray-900 border border-gray-700 rounded-lg p-4 flex items-center justify-between hover:border-primary/50 transition-all"
                      >
                        <div className="flex-1">
                          <p className="text-lg font-bold text-white mb-1">{dateOption.date}</p>
                          <p className="text-sm text-gray-400">Vol aller-retour • 7 nuits</p>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-3xl font-bold text-primary">{dateOption.price}€</p>
                            <p className="text-xs text-gray-400">par personne</p>
                          </div>

                          <a
                            href={dateOption.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-primary hover:bg-primary-dark text-white font-bold px-6 py-3 rounded-lg transition-all transform hover:scale-105"
                          >
                            Voir détail
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Footer */}
        <div className="mt-8 bg-gradient-to-r from-primary/20 to-transparent border-l-4 border-primary rounded-lg p-6">
          <p className="text-lg text-gray-300">
            <span className="text-primary font-bold">💡 Astuce :</span> Les prix peuvent varier selon la disponibilité. Réservez rapidement pour profiter des meilleurs tarifs !
          </p>
        </div>
      </div>
    </div>
  )
}
