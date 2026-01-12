# Détection d'Anomalies de Prix - Algorithme Simple

## 📊 Objectif

Détecter automatiquement les prix de vols anormalement bas en utilisant vos propres données historiques, **sans coût supplémentaire**.

## 🔍 Principe de base

L'algorithme utilise des **statistiques simples** pour identifier les deals exceptionnels :

1. **Moyenne mobile** : Prix moyen d'une destination sur les 30-90 derniers jours
2. **Écart-type** : Mesure de la variation des prix
3. **Seuil d'anomalie** : Un prix est considéré comme un "deal" s'il est significativement inférieur à la moyenne

## 💡 Algorithme recommandé (gratuit)

### Étape 1 : Collecter les données historiques

Pour chaque trajet (ex: Paris → Tokyo), stocker :
- Date de collecte
- Prix trouvé
- Date de départ du vol

```typescript
interface PriceHistory {
  route: string // "CDG-TYO"
  price: number
  currency: string
  collectedAt: Date
  departureDate: Date
}
```

### Étape 2 : Calculer les statistiques

Pour chaque route, calculer :

```typescript
// Prix moyen sur les 60 derniers jours
const prices = getPricesLast60Days("CDG-TYO")
const average = prices.reduce((sum, p) => sum + p, 0) / prices.length

// Écart-type
const variance = prices.reduce((sum, p) => sum + Math.pow(p - average, 2), 0) / prices.length
const stdDev = Math.sqrt(variance)
```

### Étape 3 : Détecter les anomalies

Un prix est un **deal exceptionnel** si :

```typescript
const threshold = average - (2 * stdDev) // 2 écarts-types en dessous de la moyenne

if (currentPrice < threshold) {
  const discount = ((average - currentPrice) / average) * 100

  if (discount >= 40) {
    // 🔥 DEAL EXCEPTIONNEL
    notifyUsers(currentPrice, discount)
  } else if (discount >= 25) {
    // ⚡ BON DEAL
    notifyPremiumUsers(currentPrice, discount)
  }
}
```

## 📈 Exemple concret

### Paris → Tokyo

**Données collectées (14 derniers jours):**
- Jour 1-7 : 850€, 920€, 880€, 900€, 870€, 910€, 895€
- Jour 8-14 : 860€, 890€, 905€, 875€, 920€, 885€, 900€

**Calculs:**
- Moyenne : 891€
- Écart-type : 23€
- Seuil anomalie : 891 - (2 × 23) = **845€**

**Prix trouvé aujourd'hui : 329€**
- Réduction : ((891 - 329) / 891) × 100 = **63%**
- ✅ **DEAL EXCEPTIONNEL** → Alerter tous les utilisateurs !

## 🛠️ Implémentation simple

### Fichier : `lib/price-anomaly-detector.ts`

```typescript
import { prisma } from './prisma'

interface RouteStats {
  average: number
  stdDev: number
  threshold: number
}

/**
 * Calcule les statistiques de prix pour une route donnée
 */
async function getRouteStats(from: string, to: string, days: number = 60): Promise<RouteStats | null> {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - days)

  // Récupérer l'historique des prix
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

  return { average, stdDev, threshold }
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
}> {
  const stats = await getRouteStats(from, to)

  if (!stats) {
    // Pas assez de données, on ne peut pas détecter
    return { isAnomaly: false }
  }

  const discount = ((stats.average - currentPrice) / stats.average) * 100

  if (currentPrice < stats.threshold) {
    if (discount >= 40) {
      return {
        isAnomaly: true,
        discount,
        category: 'exceptional',
        stats
      }
    } else if (discount >= 25) {
      return {
        isAnomaly: true,
        discount,
        category: 'good',
        stats
      }
    }
  }

  return {
    isAnomaly: false,
    discount,
    category: 'normal',
    stats
  }
}

/**
 * Enregistre un nouveau prix dans l'historique
 */
export async function recordPrice(
  from: string,
  to: string,
  price: number,
  currency: string,
  departureDate: Date
) {
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
}
```

## 🗄️ Schéma Prisma requis

Ajoutez cette table à votre `schema.prisma` :

```prisma
model PriceHistory {
  id            String   @id @default(cuid())
  from          String
  to            String
  price         Float
  currency      String   @default("EUR")
  departureDate DateTime
  collectedAt   DateTime @default(now())

  @@index([from, to, collectedAt])
}
```

## 📊 Stratégie de collecte de données

### Phase 1 : Démarrage (semaines 1-2)
- Scraper les prix **2 fois par jour** pour vos top 20 destinations
- Stocker tous les prix trouvés dans PriceHistory
- **Coût** : 0€ (scraping manuel ou API gratuite comme Kiwi.com sandbox)

### Phase 2 : Accumulation (mois 1-2)
- Continuer la collecte quotidienne
- Après 30 jours de données, commencer la détection d'anomalies
- Affiner les seuils selon les résultats

### Phase 3 : Opération normale (mois 3+)
- Détection automatique active
- Collecte 1-2 fois par jour
- Base de données historique robuste

## 💰 Coûts estimés

### Option 1 : Scraping manuel (0€)
- Utiliser une API gratuite comme Kiwi.com (limite : 100 requêtes/jour)
- Suffisant pour 20-50 routes principales
- **Coût : 0€/mois**

### Option 2 : API budget (50-100€/mois)
- Amadeus Self-Service (2000 requêtes/mois gratuites, puis 0.02€/requête)
- Skyscanner API (variable selon usage)
- **Coût : 50-100€/mois** pour 200-300 routes

### Option 3 : Solution premium (500€+/mois)
- Amadeus Enterprise
- Couverture mondiale complète
- **Coût : 500-2000€/mois**

## 🎯 Recommandation pour démarrage rapide

1. **Semaine 1** : Ajouter le modèle PriceHistory au schéma Prisma
2. **Semaine 2** : Créer un script de scraping simple (Kiwi.com gratuit)
3. **Semaine 3-6** : Collecter des données pour 20 destinations populaires
4. **Semaine 7** : Activer la détection d'anomalies
5. **Mois 2+** : Affiner et étendre

## 🔧 Script de test rapide

```typescript
// Test de détection d'anomalies
async function testAnomalyDetection() {
  // Enregistrer quelques prix factices pour tester
  const prices = [850, 920, 880, 900, 870, 910, 895, 860, 890, 905]

  for (const price of prices) {
    await recordPrice('CDG', 'TYO', price, 'EUR', new Date('2026-06-15'))
  }

  // Tester avec un prix très bas
  const result = await isPriceAnomaly('CDG', 'TYO', 329)

  console.log('Résultat détection:', result)
  // Attendu: { isAnomaly: true, discount: 63%, category: 'exceptional' }
}
```

## 📚 Ressources

### APIs de vols gratuites/low-cost
- **Kiwi.com** : https://docs.kiwi.com/ (gratuit pour débuter)
- **Amadeus Self-Service** : https://developers.amadeus.com/ (2000 req/mois gratuit)
- **Aviation Stack** : https://aviationstack.com/ (gratuit limité)

### Librairies utiles
- `node-cron` : Pour automatiser la collecte
- `axios` : Pour les requêtes HTTP
- `cheerio` : Pour le scraping web si nécessaire

## ✅ Checklist de mise en œuvre

- [ ] Ajouter le modèle PriceHistory au schéma Prisma
- [ ] Implémenter les fonctions de détection d'anomalies
- [ ] Créer un script de collecte de prix automatique
- [ ] Tester avec des données factices
- [ ] Collecter des données réelles pendant 30 jours minimum
- [ ] Activer les alertes automatiques basées sur les anomalies
- [ ] Monitorer et ajuster les seuils

## 🎓 Améliorations futures

1. **Machine Learning** : Utiliser des modèles plus sophistiqués (Prophet, ARIMA) pour prédire les tendances
2. **Saisonnalité** : Ajuster les seuils selon les saisons (été = plus cher, hiver = moins cher)
3. **Jour de la semaine** : Analyser les patterns (lundi = moins cher, vendredi = plus cher)
4. **Distance temporelle** : Prendre en compte le temps avant le départ
