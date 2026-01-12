import { prisma } from './prisma'

interface RouteStats {
  average: number
  stdDev: number
  threshold: number
  dataPoints: number
}

/**
 * Calcule les statistiques de prix pour une route donnée
 */
async function getRouteStats(from: string, to: string, days: number = 60): Promise<RouteStats | null> {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - days)

  // Note: Ce code requiert la table PriceHistory dans Prisma
  // Pour l'instant, on retourne null car la table n'existe pas encore
  // Décommentez ce code après avoir ajouté PriceHistory à votre schema.prisma

  /*
  const priceHistory = await prisma.priceHistory.findMany({
    where: {
      from,
      to,
      collectedAt: {
        gte: cutoffDate
      }
    }
  })

  if (priceHistory.length < 5) {
    // Pas assez de données historiques
    return null
  }

  const prices = priceHistory.map(p => p.price)

  // Moyenne
  const average = prices.reduce((sum, p) => sum + p, 0) / prices.length

  // Écart-type
  const variance = prices.reduce((sum, p) => sum + Math.pow(p - average, 2), 0) / prices.length
  const stdDev = Math.sqrt(variance)

  // Seuil (2 écarts-types en dessous)
  const threshold = average - (2 * stdDev)

  return { average, stdDev, threshold, dataPoints: prices.length }
  */

  return null
}

/**
 * Vérifie si un prix est une anomalie (deal exceptionnel)
 */
export async function isPriceAnomaly(
  from: string,
  to: string,
  currentPrice: number
): Promise<{
  isAnomaly: boolean
  discount?: number
  category?: 'exceptional' | 'good' | 'normal'
  stats?: RouteStats
  message?: string
}> {
  const stats = await getRouteStats(from, to)

  if (!stats) {
    // Pas assez de données, on ne peut pas détecter
    return {
      isAnomaly: false,
      message: 'Pas assez de données historiques pour cette route'
    }
  }

  const discount = ((stats.average - currentPrice) / stats.average) * 100

  if (currentPrice < stats.threshold) {
    if (discount >= 40) {
      return {
        isAnomaly: true,
        discount: Math.round(discount),
        category: 'exceptional',
        stats,
        message: `Deal exceptionnel ! ${Math.round(discount)}% moins cher que la moyenne`
      }
    } else if (discount >= 25) {
      return {
        isAnomaly: true,
        discount: Math.round(discount),
        category: 'good',
        stats,
        message: `Bon deal ! ${Math.round(discount)}% moins cher que la moyenne`
      }
    }
  }

  return {
    isAnomaly: false,
    discount: Math.round(discount),
    category: 'normal',
    stats,
    message: 'Prix dans la moyenne habituelle'
  }
}

/**
 * Enregistre un nouveau prix dans l'historique
 *
 * Note: Cette fonction requiert la table PriceHistory
 */
export async function recordPrice(
  from: string,
  to: string,
  price: number,
  currency: string,
  departureDate: Date
): Promise<void> {
  // Décommentez après avoir ajouté PriceHistory au schema.prisma
  /*
  await prisma.priceHistory.create({
    data: {
      from,
      to,
      price,
      currency,
      departureDate,
      collectedAt: new Date()
    }
  })
  */

  console.log('recordPrice called:', { from, to, price, currency, departureDate })
  console.log('Note: PriceHistory table not yet implemented in Prisma schema')
}

/**
 * Fonction utilitaire pour calculer des statistiques simples
 * Peut être utilisée indépendamment de la base de données
 */
export function calculatePriceStats(prices: number[]): RouteStats | null {
  if (prices.length < 5) {
    return null
  }

  // Moyenne
  const average = prices.reduce((sum, p) => sum + p, 0) / prices.length

  // Écart-type
  const variance = prices.reduce((sum, p) => sum + Math.pow(p - average, 2), 0) / prices.length
  const stdDev = Math.sqrt(variance)

  // Seuil (2 écarts-types en dessous)
  const threshold = average - (2 * stdDev)

  return { average, stdDev, threshold, dataPoints: prices.length }
}

/**
 * Fonction de test avec des données factices
 */
export function testAnomalyDetectionWithMockData(currentPrice: number) {
  // Prix factices pour Paris → Tokyo (derniers 14 jours)
  const mockPrices = [850, 920, 880, 900, 870, 910, 895, 860, 890, 905, 875, 920, 885, 900]

  const stats = calculatePriceStats(mockPrices)

  if (!stats) {
    return { error: 'Pas assez de données' }
  }

  const discount = ((stats.average - currentPrice) / stats.average) * 100

  let category: 'exceptional' | 'good' | 'normal' = 'normal'
  let isAnomaly = false

  if (currentPrice < stats.threshold) {
    isAnomaly = true
    if (discount >= 40) {
      category = 'exceptional'
    } else if (discount >= 25) {
      category = 'good'
    }
  }

  return {
    currentPrice,
    stats: {
      average: Math.round(stats.average),
      threshold: Math.round(stats.threshold),
      stdDev: Math.round(stats.stdDev)
    },
    discount: Math.round(discount),
    category,
    isAnomaly,
    message: isAnomaly
      ? `🔥 ${category === 'exceptional' ? 'Deal exceptionnel' : 'Bon deal'} ! ${Math.round(discount)}% de réduction`
      : 'Prix normal'
  }
}
