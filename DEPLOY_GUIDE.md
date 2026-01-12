# 🚀 Guide de Déploiement

## 📋 Prérequis

- Compte GitHub
- Compte Vercel (gratuit)
- Nom de domaine OVH configuré

## 🔗 Étape 1: Pousser sur GitHub

### 1.1 Créer un nouveau repository sur GitHub

1. Aller sur https://github.com/new
2. Nom du repository: `flight-deals-app` (ou autre nom)
3. Description: "Application d'alertes de vols avec API Kiwi.com"
4. **Important**: NE PAS cocher "Initialize with README" (déjà fait localement)
5. Cliquer sur "Create repository"

### 1.2 Lier le repository local à GitHub

Copier et exécuter ces commandes (remplacer `VOTRE_USERNAME` par votre nom d'utilisateur GitHub):

```bash
cd "/Users/nathanmartinelli/Desktop/les vols de sylvain"

# Ajouter le remote GitHub
git remote add origin https://github.com/VOTRE_USERNAME/flight-deals-app.git

# Renommer la branche en main si nécessaire
git branch -M main

# Pousser le code
git push -u origin main
```

## 🌐 Étape 2: Déployer sur Vercel

### 2.1 Créer un compte Vercel

1. Aller sur https://vercel.com/signup
2. Se connecter avec GitHub (recommandé)
3. Autoriser Vercel à accéder à vos repositories

### 2.2 Importer le projet

1. Sur Vercel, cliquer sur "Add New..." → "Project"
2. Sélectionner votre repository `flight-deals-app`
3. Cliquer sur "Import"

### 2.3 Configurer les variables d'environnement

Dans la section "Environment Variables", ajouter TOUTES ces variables:

```bash
# Database (Vercel Postgres - voir plus bas)
DATABASE_URL="postgresql://..."

# Auth
NEXTAUTH_SECRET="votre-secret-aleatoire-tres-long"
NEXTAUTH_URL="https://votredomaine.com"

# Stripe
STRIPE_SECRET_KEY="sk_live_..." # Utiliser les clés LIVE en production
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PRICE_ID_MONTHLY="price_..."

# Email - Brevo
EMAIL_API_KEY="xkeysib-..."
EMAIL_FROM="noreply@votredomaine.com"

# SMS - Twilio
TWILIO_ACCOUNT_SID="AC..."
TWILIO_AUTH_TOKEN="..."
TWILIO_PHONE_NUMBER="+15551234567"

# Admin
ADMIN_PASSWORD="un-mot-de-passe-securise"
NEXT_PUBLIC_ADMIN_PASSWORD="un-mot-de-passe-securise"

# Kiwi.com API
KIWI_API_KEY="f809c440-eee0-11f0-a57a-479dec5ea4fd"
```

### 2.4 Déployer

1. Cliquer sur "Deploy"
2. Attendre 2-3 minutes
3. Votre app sera accessible sur: `https://votre-projet.vercel.app`

## 🗄️ Étape 3: Configurer la base de données Vercel Postgres

### 3.1 Créer une base de données

1. Dans votre projet Vercel, aller dans l'onglet "Storage"
2. Cliquer sur "Create Database"
3. Choisir "Postgres"
4. Cliquer sur "Continue"
5. Sélectionner la région (Europe pour vous)
6. Cliquer sur "Create"

### 3.2 Récupérer l'URL de connexion

1. Une fois créée, aller dans "Settings" de la base de données
2. Copier le `POSTGRES_PRISMA_URL`
3. Aller dans votre projet → "Settings" → "Environment Variables"
4. Modifier la variable `DATABASE_URL` avec l'URL copiée

### 3.3 Migrer le schéma

Dans votre terminal local:

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter à Vercel
vercel login

# Lier le projet
vercel link

# Exécuter les migrations
vercel env pull .env.production
npx prisma migrate deploy
```

## 🌍 Étape 4: Configurer le domaine OVH

### 4.1 Dans Vercel

1. Aller dans votre projet → "Settings" → "Domains"
2. Cliquer sur "Add"
3. Entrer votre domaine: `votredomaine.com`
4. Vercel vous donnera des enregistrements DNS à configurer

### 4.2 Dans OVH

1. Se connecter à https://www.ovh.com/manager/
2. Aller dans "Noms de domaine" → Votre domaine
3. Onglet "Zone DNS"
4. Ajouter/modifier les enregistrements fournis par Vercel:

**Type A:**
```
Nom: @ (ou vide)
Cible: 76.76.21.21
```

**Type CNAME (pour www):**
```
Nom: www
Cible: cname.vercel-dns.com
```

5. Attendre la propagation DNS (5 minutes à 24h)

### 4.3 Vérifier le domaine

1. Retourner sur Vercel
2. Attendre que le statut passe à "Valid"
3. Activer "Automatic HTTPS" (SSL gratuit)

## 🔐 Étape 5: Configuration Stripe Webhooks

1. Aller sur https://dashboard.stripe.com/webhooks
2. Cliquer sur "Add endpoint"
3. URL: `https://votredomaine.com/api/stripe/webhook`
4. Événements à écouter:
   - `checkout.session.completed`
   - `customer.subscription.deleted`
   - `customer.subscription.updated`
5. Copier le "Signing secret"
6. L'ajouter dans Vercel → Environment Variables → `STRIPE_WEBHOOK_SECRET`

## ✅ Étape 6: Tests en production

### 6.1 Tester les fonctionnalités principales

- [ ] Page d'accueil charge correctement
- [ ] Inscription avec email/premium fonctionne
- [ ] Recherche de destinations fonctionne
- [ ] Admin dashboard accessible sur `/admin`
- [ ] Paiement Stripe en mode test fonctionne

### 6.2 Tester les notifications

1. S'inscrire avec un compte test
2. Ajouter une destination en favori
3. Depuis l'admin, envoyer une offre
4. Vérifier réception email/SMS

### 6.3 Basculer Stripe en mode LIVE

**IMPORTANT**: Une fois les tests terminés:

1. Aller sur https://dashboard.stripe.com
2. Basculer en mode "Live"
3. Récupérer les nouvelles clés API
4. Mettre à jour dans Vercel Environment Variables:
   - `STRIPE_SECRET_KEY` → `sk_live_...`
   - `STRIPE_PUBLISHABLE_KEY` → `pk_live_...`
5. Recréer le webhook en mode live
6. Redéployer l'application

## 🔄 Workflow de développement

### Pour faire des modifications:

```bash
# 1. Modifier le code localement
# 2. Tester en local
npm run dev

# 3. Commiter et pousser
git add .
git commit -m "Description des changements"
git push

# 4. Vercel déploie automatiquement !
```

## 📊 Monitoring et logs

- **Logs d'application**: Vercel → Votre projet → "Logs"
- **Base de données**: Vercel → Storage → Votre DB → "Data"
- **Analytics**: Vercel → Votre projet → "Analytics"
- **Stripe events**: https://dashboard.stripe.com/events
- **Twilio logs**: https://console.twilio.com/logs

## 🆘 Troubleshooting

### Erreur de base de données
- Vérifier que `DATABASE_URL` est correct
- Vérifier que les migrations sont appliquées: `npx prisma migrate deploy`

### Domaine ne fonctionne pas
- Attendre 24h pour propagation DNS
- Vérifier les enregistrements DNS sur OVH
- Utiliser https://www.whatsmydns.net pour vérifier la propagation

### Paiement Stripe échoue
- Vérifier que les clés API sont en mode live
- Vérifier que le webhook est configuré
- Consulter les logs Stripe

### SMS/Email non envoyés
- Vérifier les clés Twilio/Brevo dans Environment Variables
- Consulter les logs Vercel
- Vérifier les quotas (limites gratuites)

## 💰 Coûts mensuels estimés

- **Vercel Hobby**: Gratuit (suffisant pour démarrer)
- **Vercel Postgres**: ~5€/mois (plan basic)
- **Twilio SMS**: ~10€/mois (1000 SMS)
- **Brevo Email**: Gratuit (300/jour) ou 25€/mois (illimité)
- **Stripe**: Gratuit (2.9% + 0.25€ par transaction)
- **OVH Domaine**: ~10€/an

**Total estimé: 15-20€/mois + domaine**

## 📞 Support

- **Vercel**: https://vercel.com/docs
- **Prisma**: https://www.prisma.io/docs
- **Stripe**: https://stripe.com/docs
- **Twilio**: https://www.twilio.com/docs
- **Brevo**: https://developers.brevo.com

---

Bon déploiement ! 🚀
