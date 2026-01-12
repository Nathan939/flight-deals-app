# 🎯 Guide d'utilisation - FlightDeals

## 📋 Vue d'ensemble

FlightDeals est une plateforme d'alertes de vols à prix réduits avec un design glassmorphism moderne. Le projet est **100% fonctionnel** et prêt à être déployé.

## 🚀 Démarrage rapide

### 1. Lancer le projet

```bash
# Installer les dépendances (si pas déjà fait)
npm install

# Lancer le serveur de développement sur le port 3050
PORT=3050 npm run dev
```

Le site sera accessible sur: **http://localhost:3050**

### 2. Accès rapide

- **Site public**: http://localhost:3050
- **Inscription**: http://localhost:3050/signup
- **Connexion**: http://localhost:3050/login
- **Dashboard**: http://localhost:3050/dashboard
- **Admin**: http://localhost:3050/admin (mot de passe: `admin123`)

## 🎨 Fonctionnalités principales

### ✅ Pour les utilisateurs

1. **Inscription gratuite ou Premium**
   - Plan gratuit: Alertes email seulement
   - Plan Premium (4€/mois): Alertes SMS + destinations personnalisées

2. **Dashboard personnalisé**
   - Voir l'historique des deals
   - Créer des alertes destinations (Premium uniquement)
   - Gérer son abonnement

3. **Paiements Stripe**
   - Intégration Stripe complète
   - Webhooks configurés
   - Gestion des abonnements

### 🎛️ Pour les administrateurs

**Accès**: http://localhost:3050/admin (mot de passe: `admin123`)

#### Onglet "Créer un deal"
- Ajouter de nouveaux deals de vols
- Spécifier: départ, destination, prix, dates, URL de réservation
- Les deals seront automatiquement affichés sur la landing page

#### Onglet "Utilisateurs"
- Voir tous les utilisateurs inscrits
- Filtrer par plan (free/premium)
- Supprimer des utilisateurs
- Voir les dates d'inscription

#### Onglet "Tests"
- Envoyer des emails de test
- Envoyer des SMS de test (si configuré)

## 🗄️ Gestion de la base de données

### Option 1: Via l'interface Admin (Recommandé)

La façon la plus simple de gérer la BDD est via l'interface admin:
- **URL**: http://localhost:3050/admin
- **Mot de passe**: `admin123`

### Option 2: Via Prisma Studio

Pour une gestion plus avancée de la BDD:

```bash
# Ouvrir Prisma Studio (interface graphique)
npx prisma studio
```

Cela ouvrira une interface web sur http://localhost:5555 où vous pouvez:
- Voir toutes les tables
- Ajouter/modifier/supprimer des données
- Explorer les relations

### Option 3: Via les commandes Prisma

```bash
# Voir les données dans la console
npx prisma db pull

# Réinitialiser la BDD (ATTENTION: supprime toutes les données!)
npx prisma migrate reset

# Créer une migration après modification du schema
npx prisma migrate dev --name description_du_changement

# Regénérer le client Prisma après changement du schema
npx prisma generate
```

## 📊 Structure de la base de données

### Tables principales

1. **User** - Utilisateurs
   - id, email, password (hashé), name
   - Relations: Subscription, Destinations, Alerts

2. **Subscription** - Abonnements
   - plan: 'free' | 'premium'
   - status: 'active' | 'cancelled' | 'expired'
   - stripeCustomerId, stripeSubscriptionId

3. **Destination** - Destinations favorites (Premium)
   - city, country, code
   - Relation: User

4. **Deal** - Deals de vols
   - from, to, price, originalPrice, currency
   - departureDate, returnDate, url, description

5. **Alert** - Historique des alertes envoyées
   - userId, dealId, type ('email' | 'sms')
   - sentAt, status

## 🎨 Design System

Le projet utilise un design system glassmorphism moderne:

### Classes Tailwind personnalisées

```css
/* Glassmorphism */
.glass              /* Effet verre de base */
.glass-card         /* Carte avec effet verre + padding + shadow */
.input-glass        /* Input avec effet verre */

/* Titres */
.heading-xl         /* Titre extra large (5xl-7xl) */
.heading-lg         /* Titre large (3xl-4xl) */

/* Effets hover */
.hover-lift         /* Élévation au survol */
.hover-glow         /* Glow au survol */
```

### Animations disponibles

```javascript
animate-fade-in-up      // Apparition du bas
animate-slide-in-right  // Glisse depuis la droite
animate-scale-in        // Zoom in
animate-float           // Flottement
animate-pulse-slow      // Pulsation lente
```

## 🔧 Configuration

### Variables d'environnement (.env)

```env
# Base de données
DATABASE_URL="file:./dev.db"

# Stripe (paiements)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PRICE_ID="price_..."

# Email (Resend)
RESEND_API_KEY="re_..."
EMAIL_FROM="noreply@flightdeals.com"

# SMS (Twilio - optionnel)
TWILIO_ACCOUNT_SID="AC..."
TWILIO_AUTH_TOKEN="..."
TWILIO_PHONE_NUMBER="+1..."

# Admin
NEXT_PUBLIC_ADMIN_PASSWORD="admin123"
```

## 📝 Modifier le design

### Couleurs principales

Fichier: `tailwind.config.ts`

```typescript
colors: {
  primary: {
    DEFAULT: '#3B82F6',  // Bleu principal
    light: '#60A5FA',
    dark: '#2563EB',
  },
}
```

### Polices

Fichier: `app/layout.tsx`

```typescript
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'] })
```

## 🚀 Déploiement

### Préparation

1. **Changer le mot de passe admin**
   - Fichier: `app/admin/page.tsx`
   - Ligne 23: Changer `'admin123'`

2. **Configurer les variables d'environnement de production**
   - Copier `.env` vers `.env.production`
   - Remplacer toutes les clés de test par les clés de production

3. **Build de production**

```bash
npm run build
```

### Déploiement sur Vercel (Recommandé)

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel
```

### Déploiement sur d'autres plateformes

Le projet est compatible avec:
- Vercel (recommandé)
- Netlify
- Railway
- Render
- VPS classique (avec Node.js)

## 🐛 Résolution de problèmes

### Erreur Prisma sur macOS

Si vous voyez une erreur "code signature not valid":

```bash
# Re-signer le binaire Prisma
codesign --force --deep --sign - node_modules/.prisma/client/libquery_engine-darwin-arm64.dylib.node

# Redémarrer le serveur
PORT=3050 npm run dev
```

### Port déjà utilisé

```bash
# Tuer le processus sur le port 3050
lsof -ti:3050 | xargs kill -9

# Relancer
PORT=3050 npm run dev
```

### Réinitialiser la base de données

```bash
# Sauvegarder d'abord si nécessaire
cp prisma/dev.db prisma/dev.db.backup

# Réinitialiser
npx prisma migrate reset

# Regénérer
npx prisma generate
```

## 📞 Support

Pour toute question ou problème:
1. Vérifier ce guide
2. Consulter les logs du serveur
3. Ouvrir l'interface admin pour diagnostic
4. Utiliser Prisma Studio pour inspecter la BDD

## 🎯 Prochaines étapes recommandées

1. **Ajouter des deals réels** via l'interface admin
2. **Configurer Stripe en mode production** pour les vrais paiements
3. **Configurer l'envoi d'emails** avec Resend
4. **Configurer les SMS** avec Twilio (optionnel)
5. **Créer un système de scraping** pour automatiser la recherche de deals
6. **Mettre en place des cron jobs** pour envoyer les alertes automatiquement

---

✨ **Le projet est maintenant complet, beau, fonctionnel et simple à gérer!**
