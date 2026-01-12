# 🚀 Guide de Finalisation - Application de Vols

## ✅ Modifications Complétées

### 1. Flux Utilisateur Simplifié

#### Landing Page → Signup
- ✅ Le Hero CTA redirige maintenant vers `/signup` au lieu de `/dashboard`
- ✅ Bouton "Rechercher des destinations" pour les utilisateurs connectés

#### Formulaire d'inscription
- ✅ Champ téléphone **obligatoire pour Premium** uniquement
- ✅ Validation côté client et serveur
- ✅ Intégration Stripe fonctionnelle pour paiement Premium
- ✅ Redirection vers `/destinations` après inscription

#### Page Destinations = Page Principale
- ✅ Après connexion, l'utilisateur arrive sur `/destinations`
- ✅ C'est la **seule page** de l'application (en plus de la landing)
- ✅ `/dashboard` redirige automatiquement vers `/destinations`

### 2. Système de "Like" avec Images

#### Affichage des destinations
- ✅ Recherche universelle de toutes les destinations (style Skyscanner)
- ✅ **Images pour chaque destination** avec effet hover
- ✅ Code IATA affiché sur chaque carte
- ✅ Bouton étoile pour liker/unliker

#### Destinations récemment aimées
- ✅ Section dédiée "Destinations récemment aimées"
- ✅ Affichage avec images et animations
- ✅ Persistance en base de données (table Destination)

### 3. Système d'Alertes SMS Automatiques

#### Pour les utilisateurs Premium
- ✅ Quand un utilisateur "like" une destination → enregistré en BDD
- ✅ Quand un deal apparaît pour cette destination → SMS automatique
- ✅ Fichier créé : [lib/alert-system.ts](lib/alert-system.ts)
- ✅ API endpoint : `POST /api/deals/notify`

#### Fonctionnement
```typescript
// Quand un nouveau deal est trouvé
POST /api/deals/notify
{
  "from": "Paris",
  "to": "TYO",
  "toCity": "Tokyo",
  "price": 329,
  "originalPrice": 950,
  "currency": "EUR",
  "discount": 65,
  "url": "https://..."
}

// Le système :
// 1. Trouve tous les users qui ont "liké" Tokyo
// 2. Vérifie leur plan (premium = SMS, gratuit = email)
// 3. Envoie l'alerte correspondante automatiquement
```

### 4. Détection d'Anomalies de Prix

#### Documentation complète
- ✅ Fichier : [DETECTION_ANOMALIES_PRIX.md](DETECTION_ANOMALIES_PRIX.md)
- ✅ Algorithme statistique simple (moyenne + écart-type)
- ✅ **Coût : 0€** avec collecte de données propres
- ✅ Implémentation de base : [lib/price-anomaly-detector.ts](lib/price-anomaly-detector.ts)

#### Principe
- Collecter les prix quotidiennement pour chaque route
- Calculer moyenne et écart-type sur 60 jours
- Un prix < (moyenne - 2×écart-type) = **DEAL**
- Réduction ≥ 40% = **EXCEPTIONNEL** 🔥
- Réduction ≥ 25% = **BON DEAL** ⚡

## 📋 Prochaines Étapes pour Déploiement

### Étape 1 : Configuration SMS (Twilio)

1. **Créer un compte Twilio** : https://www.twilio.com/try-twilio
   - Compte d'essai : 15$ de crédit gratuit
   - Suffisant pour ~500 SMS de test

2. **Configurer les variables d'environnement** dans `.env` :
   ```bash
   TWILIO_ACCOUNT_SID="votre_account_sid"
   TWILIO_AUTH_TOKEN="votre_auth_token"
   TWILIO_PHONE_NUMBER="+15551234567"  # Numéro Twilio
   ```

3. **Activer l'envoi SMS réel** dans [lib/sms.ts](lib/sms.ts:11-23) :
   - Décommenter le code Twilio
   - Installer le package : `npm install twilio`

### Étape 2 : Configuration Email (Brevo)

1. **Créer un compte Brevo** (gratuit : 300 emails/jour) : https://www.brevo.com

2. **Configurer dans `.env`** :
   ```bash
   EMAIL_API_KEY="votre_api_key_brevo"
   EMAIL_FROM="noreply@votredomaine.com"
   ```

3. **Activer l'envoi email réel** dans [lib/email.ts](lib/email.ts:36-53) :
   - Décommenter le code Brevo

### Étape 3 : Collecte de Prix (Optionnel pour v1)

#### Option A : Manuel (pour démarrer)
Créer des deals manuellement via l'interface admin :
```
POST /api/admin/create-deal
{
  "from": "Paris",
  "to": "TYO",
  "toCity": "Tokyo",
  "price": 329,
  "originalPrice": 950,
  ...
}
```

#### Option B : Automatique (recommandé)

1. **Utiliser l'API gratuite Kiwi.com** :
   - Inscription : https://docs.kiwi.com/
   - 100 requêtes/jour gratuit

2. **Créer un script de collecte** : `scripts/collect-prices.ts`
   ```typescript
   import axios from 'axios'

   async function collectPrices() {
     const routes = [
       { from: 'CDG', to: 'TYO' },
       { from: 'CDG', to: 'JFK' },
       // ... vos routes principales
     ]

     for (const route of routes) {
       const response = await axios.get('https://api.kiwi.com/v2/search', {
         params: {
           fly_from: route.from,
           fly_to: route.to,
           date_from: '01/06/2026',
           date_to: '30/06/2026',
           partner: 'picky',
           curr: 'EUR'
         },
         headers: {
           'apikey': process.env.KIWI_API_KEY
         }
       })

       // Analyser les résultats et détecter anomalies
       // Notifier si deal exceptionnel
     }
   }

   // Exécuter 2 fois par jour
   collectPrices()
   ```

3. **Automatiser avec cron** :
   ```typescript
   // package.json
   {
     "scripts": {
       "collect": "tsx scripts/collect-prices.ts"
     }
   }
   ```

   ```bash
   # Crontab (2 fois par jour : 9h et 18h)
   0 9,18 * * * cd /path/to/app && npm run collect
   ```

### Étape 4 : Déploiement

#### Recommandé : Vercel (gratuit pour démarrer)

1. **Installer Vercel CLI** :
   ```bash
   npm i -g vercel
   ```

2. **Configurer la base de données** :
   - Option A : SQLite sur volume persistant (PlanetScale gratuit)
   - Option B : Migrer vers PostgreSQL (Vercel Postgres gratuit)

3. **Déployer** :
   ```bash
   vercel --prod
   ```

4. **Configurer les variables d'environnement** sur Vercel :
   - Dashboard → Settings → Environment Variables
   - Ajouter toutes les variables de `.env`

### Étape 5 : Configuration Stripe Webhooks

1. **Créer un webhook Stripe** :
   - Dashboard Stripe → Webhooks
   - URL : `https://votredomaine.com/api/stripe/webhook`
   - Events : `checkout.session.completed`, `customer.subscription.deleted`

2. **Copier le signing secret** dans `.env` :
   ```bash
   STRIPE_WEBHOOK_SECRET="whsec_..."
   ```

## 🎯 Fonctionnalités Opérationnelles

### ✅ Déjà fonctionnel
- [x] Landing page avec CTA vers signup
- [x] Inscription avec plan gratuit/premium
- [x] Collecte téléphone pour premium
- [x] Paiement Stripe
- [x] Page destinations avec recherche universelle
- [x] Images pour toutes les destinations
- [x] Système de "like" persistant
- [x] Affichage des destinations aimées
- [x] Structure alertes SMS/email

### ⚙️ À activer (configuration uniquement)
- [ ] Envoi SMS réel (décommenter code Twilio)
- [ ] Envoi email réel (décommenter code Brevo)
- [ ] Collecte automatique de prix (créer script)
- [ ] Webhooks Stripe (configurer URL)

### 🚀 Améliorations futures (optionnelles)
- [ ] Historique de prix (table PriceHistory)
- [ ] Détection d'anomalies automatique
- [ ] Notifications push navigateur
- [ ] Filtres avancés (dates, budget, durée)
- [ ] Dashboard admin amélioré

## 💰 Coûts mensuels estimés

### Configuration Minimale (0-10€/mois)
- Hosting Vercel : **Gratuit** (hobby plan)
- Base de données : **Gratuit** (Vercel Postgres ou PlanetScale)
- Emails (Brevo) : **Gratuit** (300/jour)
- SMS (Twilio) : **~5-10€** (0.01€/SMS × 500-1000 SMS/mois)
- API Kiwi : **Gratuit** (100 requêtes/jour)

**Total : 5-10€/mois**

### Configuration Standard (50-100€/mois)
- Hosting : **20€** (Vercel Pro si besoin)
- Base de données : **Gratuit-25€**
- Emails : **Gratuit-10€** (plan supérieur si > 300/jour)
- SMS : **30-50€** (3000-5000 SMS/mois)
- API Amadeus : **30€** (accès API plus robuste)

**Total : 80-105€/mois**

## 📞 Support et Documentation

### Fichiers clés créés
- [DETECTION_ANOMALIES_PRIX.md](DETECTION_ANOMALIES_PRIX.md) - Algorithme détection
- [lib/alert-system.ts](lib/alert-system.ts) - Système alertes
- [lib/price-anomaly-detector.ts](lib/price-anomaly-detector.ts) - Implémentation détection
- [app/api/deals/notify/route.ts](app/api/deals/notify/route.ts) - API notifications

### Ressources externes
- **Twilio Docs** : https://www.twilio.com/docs/sms
- **Brevo Docs** : https://developers.brevo.com/
- **Kiwi.com API** : https://docs.kiwi.com/
- **Stripe Webhooks** : https://stripe.com/docs/webhooks
- **Vercel Deployment** : https://vercel.com/docs

## 🎓 Comment tester en local

### 1. Tester le formulaire d'inscription
```bash
npm run dev
# Aller sur http://localhost:3000
# Cliquer sur "S'inscrire gratuitement"
# Choisir Premium → Le champ téléphone apparaît
```

### 2. Tester la recherche de destinations
```bash
# Après inscription, vous êtes redirigé vers /destinations
# Recherchez "Tokyo", "Paris", "New York", etc.
# Cliquez sur l'étoile pour liker une destination
# Rechargez → La destination apparaît dans "Destinations récemment aimées"
```

### 3. Tester les alertes (en mode console)
```bash
# Dans votre terminal :
curl -X POST http://localhost:3000/api/deals/notify \
  -H "Content-Type: application/json" \
  -d '{
    "from": "Paris",
    "to": "TYO",
    "toCity": "Tokyo",
    "price": 329,
    "originalPrice": 950,
    "currency": "EUR",
    "discount": 65,
    "url": "https://example.com/deal"
  }'

# Les logs console montreront les alertes envoyées
```

### 4. Tester la détection d'anomalies
```typescript
// Dans la console Node ou un fichier test
import { testAnomalyDetectionWithMockData } from './lib/price-anomaly-detector'

const result = testAnomalyDetectionWithMockData(329)
console.log(result)
// Output: { isAnomaly: true, discount: 63, category: 'exceptional', ... }
```

## ✨ Résumé

Votre application est maintenant **prête pour le déploiement** !

Le flux utilisateur est simple et efficace :
1. Landing page → Call-to-action
2. Inscription (gratuit ou premium avec téléphone)
3. Paiement Stripe si premium
4. Page destinations unique : recherche + like
5. Alertes automatiques (SMS/email) pour deals correspondants

**Il ne reste plus qu'à activer les services externes** (Twilio, Brevo) et **déployer** !

Bonne chance avec votre projet ! 🚀✈️
