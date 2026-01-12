import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number, currency: string = 'EUR'): string {
  return `${price}${currency === 'EUR' ? '€' : currency}`
}

export function calculateDiscount(originalPrice: number, currentPrice: number): number {
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
}

export const DESTINATIONS = [
  { code: 'REK', city: 'Reykjavik', country: 'Islande' },
  { code: 'MAD', city: 'Madrid', country: 'Espagne' },
  { code: 'BCN', city: 'Barcelone', country: 'Espagne' },
  { code: 'ROM', city: 'Rome', country: 'Italie' },
  { code: 'LIS', city: 'Lisbonne', country: 'Portugal' },
  { code: 'LON', city: 'Londres', country: 'Royaume-Uni' },
  { code: 'BER', city: 'Berlin', country: 'Allemagne' },
  { code: 'AMS', city: 'Amsterdam', country: 'Pays-Bas' },
  { code: 'DUB', city: 'Dublin', country: 'Irlande' },
  { code: 'PRG', city: 'Prague', country: 'République Tchèque' },
  { code: 'VIE', city: 'Vienne', country: 'Autriche' },
  { code: 'BUD', city: 'Budapest', country: 'Hongrie' },
  { code: 'MAR', city: 'Marrakech', country: 'Maroc' },
  { code: 'TUN', city: 'Tunis', country: 'Tunisie' },
  { code: 'DXB', city: 'Dubaï', country: 'Émirats arabes unis' },
  { code: 'BKK', city: 'Bangkok', country: 'Thaïlande' },
  { code: 'TYO', city: 'Tokyo', country: 'Japon' },
  { code: 'NYC', city: 'New York', country: 'États-Unis' },
  { code: 'LAX', city: 'Los Angeles', country: 'États-Unis' },
  { code: 'MIA', city: 'Miami', country: 'États-Unis' },
]

export const PLANS = {
  free: {
    name: 'Gratuit',
    price: 0,
    features: [
      'Alertes email illimitées',
      'Jusqu\'à 5 destinations',
      'Deals envoyés 2x/semaine',
      'Accès aux deals publics',
    ],
  },
  premium: {
    name: 'Premium',
    price: 4,
    priceYearly: 40,
    features: [
      'Tout du plan gratuit',
      'Alertes SMS instantanées',
      'Destinations illimitées',
      'Deals envoyés en temps réel',
      'Accès prioritaire aux deals',
      'Support prioritaire',
    ],
  },
}
