# 🚀 Déploiement Final - Récapitulatif

## ✅ Ce qui a été fait

### 1. GitHub Repository créé ✅
- **URL** : https://github.com/Nathan939/flight-deals-app
- **Statut** : Code poussé avec succès
- **Branche** : main
- **Derniers fichiers ajoutés** :
  - `.env.example` - Template des variables d'environnement
  - `README_GITHUB.md` - Documentation complète
  - `vercel.json` - Configuration Vercel
  - `DEPLOY_GUIDE.md` - Guide de déploiement détaillé

### 2. Vercel CLI installé ✅
- Version : 50.1.6
- Prêt pour le déploiement

## 🔄 Étapes en cours

### Connexion Vercel (EN ATTENTE)
Vous devez compléter l'authentification Vercel :

**Lien d'authentification** : https://vercel.com/oauth/device?user_code=CJFF-TQSN

**Une fois connecté**, exécutez dans votre terminal :
```bash
cd "/Users/nathanmartinelli/Desktop/les vols de sylvain"
vercel --prod
```

## 📋 Prochaines étapes (après connexion Vercel)

### 1. Créer une base de données Vercel Postgres

**Dans votre dashboard Vercel** :
1. Aller dans votre projet → "Storage"
2. Cliquer "Create Database" → "Postgres"
3. Choisir la région "Europe (Frankfurt)" - cdg1
4. Cliquer "Create"

**Récupérer l'URL** :
1. Dans Settings de la DB → copier `POSTGRES_PRISMA_URL`
2. Ajouter dans Environment Variables de votre projet

### 2. Configurer TOUTES les variables d'environnement

**Dans Vercel → votre projet → Settings → Environment Variables**, ajouter :

```bash
# Database (copier depuis Vercel Postgres)
DATABASE_URL="postgresql://..."

# Auth (générer un secret aléatoire)
NEXTAUTH_SECRET="votre-secret-aleatoire-tres-long-minimum-32-caracteres"
NEXTAUTH_URL="https://votredomaine.com"

# Kiwi.com API
KIWI_API_KEY="f809c440-eee0-11f0-a57a-479dec5ea4fd"

# Stripe (utiliser les clés TEST d'abord)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..." # À créer après déploiement
STRIPE_PRICE_ID_MONTHLY="price_..." # Créer un prix dans Stripe

# Email - Brevo
EMAIL_API_KEY="xkeysib-..." # À obtenir sur brevo.com
EMAIL_FROM="noreply@votredomaine.com"

# SMS - Twilio
TWILIO_ACCOUNT_SID="AC..." # À obtenir sur twilio.com
TWILIO_AUTH_TOKEN="..."
TWILIO_PHONE_NUMBER="+..."

# Admin
ADMIN_PASSWORD="votre-mot-de-passe-securise"
NEXT_PUBLIC_ADMIN_PASSWORD="votre-mot-de-passe-securise"
```

### 3. Migrer le schéma de base de données

**Depuis votre terminal local** :

```bash
# 1. Récupérer les variables d'environnement de production
vercel env pull .env.production

# 2. Appliquer les migrations Prisma
npx prisma migrate deploy
```

### 4. Configurer votre domaine OVH

**Dans Vercel** :
1. Aller dans Settings → Domains
2. Ajouter votre domaine OVH
3. Vercel vous donnera des enregistrements DNS

**Dans OVH** (https://www.ovh.com/manager/) :
1. Aller dans "Noms de domaine" → votre domaine
2. Onglet "Zone DNS"
3. Ajouter les enregistrements fournis par Vercel :

```
Type A :
Nom : @
Cible : 76.76.21.21

Type CNAME :
Nom : www
Cible : cname.vercel-dns.com
```

4. Sauvegarder et attendre la propagation (5min à 24h)

### 5. Configurer les Webhooks Stripe

Une fois le site déployé :

1. Aller sur https://dashboard.stripe.com/webhooks
2. Cliquer "Add endpoint"
3. URL : `https://votredomaine.com/api/stripe/webhook`
4. Événements à sélectionner :
   - `checkout.session.completed`
   - `customer.subscription.deleted`
   - `customer.subscription.updated`
5. Copier le "Signing secret"
6. L'ajouter dans Vercel Environment Variables : `STRIPE_WEBHOOK_SECRET`

### 6. Tester l'application

**Tests à effectuer** :

- [ ] Page d'accueil charge
- [ ] Inscription fonctionne
- [ ] Recherche de destinations fonctionne
- [ ] Admin accessible (/admin)
- [ ] Paiement Stripe (mode test)
- [ ] Envoi d'une offre test
- [ ] Réception email/SMS

## 📊 Commandes utiles

### Déployer une nouvelle version
```bash
cd "/Users/nathanmartinelli/Desktop/les vols de sylvain"
git add .
git commit -m "Description des changements"
git push
# Vercel déploie automatiquement !
```

### Voir les logs en direct
```bash
vercel logs --follow
```

### Ouvrir le dashboard Vercel
```bash
vercel open
```

### Rollback vers une version précédente
Dans le dashboard Vercel → Deployments → Cliquer sur un déploiement ancien → Promote to Production

## 🔐 Sécurité - IMPORTANT

### Avant de lancer en production :

1. **Changer tous les mots de passe** :
   - `ADMIN_PASSWORD` → Utiliser un mot de passe fort
   - `NEXTAUTH_SECRET` → Générer avec : `openssl rand -base64 32`

2. **Basculer Stripe en mode LIVE** :
   - Récupérer les clés `sk_live_...` et `pk_live_...`
   - Recréer le webhook en mode live
   - Mettre à jour les variables dans Vercel

3. **Vérifier les quotas** :
   - Kiwi.com : 100 requêtes/jour (gratuit)
   - Twilio : Crédit initial puis payant
   - Brevo : 300 emails/jour (gratuit)

## 💰 Coûts Mensuels

### Configuration actuelle (après déploiement) :
- **Vercel Hobby** : Gratuit
- **Vercel Postgres** : ~5€/mois (basic)
- **Kiwi.com API** : Gratuit (100 req/jour)
- **Brevo Email** : Gratuit (300/jour)
- **Twilio SMS** : ~10€/mois (1000 SMS)
- **OVH Domaine** : ~10€/an

**Total estimé : ~15€/mois + 10€/an**

## 📞 Support et Ressources

### Documentation
- **Vercel** : https://vercel.com/docs
- **Prisma** : https://www.prisma.io/docs
- **Stripe** : https://stripe.com/docs
- **Twilio** : https://www.twilio.com/docs
- **Brevo** : https://developers.brevo.com

### Votre projet
- **GitHub** : https://github.com/Nathan939/flight-deals-app
- **Vercel Dashboard** : À obtenir après connexion
- **Documentation locale** : Voir [DEPLOY_GUIDE.md](DEPLOY_GUIDE.md)

## ✨ Félicitations !

Une fois toutes ces étapes complétées, votre application sera **100% opérationnelle en production** ! 🎉

Les utilisateurs pourront :
- S'inscrire et payer avec Stripe
- Rechercher des destinations dans le monde entier
- Recevoir des alertes SMS/Email automatiques

Et vous pourrez :
- Gérer les offres depuis /admin
- Voir les utilisateurs et leurs préférences
- Envoyer des offres en un clic

---

**Dernière mise à jour** : 11 janvier 2026

**Créé par** : Nathan Martinelli avec l'assistance de Claude
