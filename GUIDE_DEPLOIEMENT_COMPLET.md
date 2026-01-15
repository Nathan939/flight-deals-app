# 🚀 Guide de Déploiement FlightAlert sur Vercel

## ✅ Checklist avant déploiement

### 1. Clés API nécessaires

Avant de déployer, assurez-vous d'avoir obtenu ces clés API :

- ✅ **Kiwi.com** (déjà obtenue) - Recherche de vols
  - Site : https://tequila.kiwi.com/portal/login
  - Plan gratuit : 100 requêtes/jour

- ⚠️ **Brevo (Sendinblue)** - Emails
  - Site : https://app.brevo.com
  - Plan gratuit : 300 emails/jour
  - Obtenir : `EMAIL_API_KEY`

- ⚠️ **Twilio** - SMS Premium
  - Site : https://www.twilio.com/try-twilio
  - $15 de crédit gratuit
  - Obtenir : `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`

- ⚠️ **Stripe** - Paiements
  - Site : https://dashboard.stripe.com
  - Obtenir : `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`
  - Créer un produit "FlightAlert Premium" à 4€/mois
  - Obtenir : `STRIPE_PRICE_ID_MONTHLY`, `STRIPE_WEBHOOK_SECRET`

---

## 📦 Étape 1 : Préparer le projet

### 1.1 Mettre à jour le package.json

Votre `package.json` doit contenir :

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start"
  }
}
```

### 1.2 Créer un fichier .env.production

```env
# Ne PAS commiter ce fichier !
# Ces variables seront ajoutées sur Vercel

DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="votre-secret-production"
NEXTAUTH_URL="https://www.flightalert.fr"

# APIs
KIWI_API_KEY="votre_clé_kiwi"
EMAIL_API_KEY="votre_clé_brevo"
EMAIL_FROM="noreply@flightalert.fr"
TWILIO_ACCOUNT_SID="votre_sid_twilio"
TWILIO_AUTH_TOKEN="votre_token_twilio"
TWILIO_PHONE_NUMBER="+33..."

# Stripe
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PRICE_ID_MONTHLY="price_..."

# Admin
ADMIN_PASSWORD="votre-mot-de-passe-admin-sécurisé"
NEXT_PUBLIC_ADMIN_PASSWORD="votre-mot-de-passe-admin-sécurisé"
```

---

## 🔧 Étape 2 : Configurer Vercel

### 2.1 Créer un compte Vercel

1. Allez sur https://vercel.com
2. Créez un compte (gratuit)
3. Connectez votre compte GitHub

### 2.2 Installer Vercel CLI (optionnel)

```bash
npm install -g vercel
vercel login
```

### 2.3 Créer un projet sur Vercel

**Option A : Via l'interface web**
1. Allez sur https://vercel.com/new
2. Sélectionnez votre repository GitHub
3. Configuration automatique détectée (Next.js)

**Option B : Via CLI**
```bash
vercel
# Suivez les instructions
```

---

## 🗄️ Étape 3 : Configurer Vercel Postgres

### 3.1 Créer une base de données

1. Dans votre projet Vercel, allez dans l'onglet **Storage**
2. Cliquez sur **Create Database**
3. Sélectionnez **Postgres**
4. Choisissez la région : **Europe (Frankfurt)** ou **Europe (Paris)**
5. Cliquez sur **Create**

### 3.2 Connecter la base de données

Vercel va automatiquement ajouter ces variables d'environnement :
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL` ← **Utilisez celle-ci pour Prisma !**
- `POSTGRES_URL_NON_POOLING`

### 3.3 Configurer les variables d'environnement

1. Allez dans **Settings** > **Environment Variables**
2. Ajoutez **TOUTES** les variables de votre `.env.production` :

```
DATABASE_URL = <copier POSTGRES_PRISMA_URL>
NEXTAUTH_SECRET = votre-secret-production-aléatoire-long
NEXTAUTH_URL = https://www.flightalert.fr
KIWI_API_KEY = votre_clé
EMAIL_API_KEY = votre_clé
EMAIL_FROM = noreply@flightalert.fr
TWILIO_ACCOUNT_SID = ACxxxxxxxxx
TWILIO_AUTH_TOKEN = votre_token
TWILIO_PHONE_NUMBER = +33XXXXXXXXX
STRIPE_SECRET_KEY = sk_live_xxxxx
STRIPE_PUBLISHABLE_KEY = pk_live_xxxxx
STRIPE_WEBHOOK_SECRET = whsec_xxxxx
STRIPE_PRICE_ID_MONTHLY = price_xxxxx
ADMIN_PASSWORD = votre-password-admin
NEXT_PUBLIC_ADMIN_PASSWORD = votre-password-admin
```

**Important** : Sélectionnez les environnements :
- ✅ Production
- ✅ Preview
- ✅ Development

---

## 🔄 Étape 4 : Exécuter les migrations Prisma

### Option A : Via Vercel CLI (recommandé)

```bash
# Installer les dépendances
npm install

# Générer le client Prisma
npx prisma generate

# Pousser le schéma vers la base de données
npx prisma db push

# Optionnel : Ouvrir Prisma Studio pour vérifier
npx prisma studio
```

### Option B : Script de migration automatique

Créez un fichier `migrate-production.sh` :

```bash
#!/bin/bash
echo "🚀 Migration de la base de données..."

# Charger les variables d'environnement
source .env.production

# Générer le client Prisma
npx prisma generate

# Pousser le schéma
npx prisma db push --accept-data-loss

echo "✅ Migration terminée !"
```

Exécutez-le :
```bash
chmod +x migrate-production.sh
./migrate-production.sh
```

---

## 🌐 Étape 5 : Configurer le nom de domaine

### 5.1 Chez OVH (votre registrar)

1. Connectez-vous à votre compte OVH
2. Allez dans **Web Cloud** > **Noms de domaine**
3. Sélectionnez `flightalert.fr`
4. Cliquez sur **Zone DNS**
5. Ajoutez ces enregistrements :

**Pour le domaine principal (www.flightalert.fr) :**
```
Type: CNAME
Sous-domaine: www
Cible: cname.vercel-dns.com.
TTL: 3600
```

**Pour le domaine racine (flightalert.fr) :**
```
Type: A
Sous-domaine: @
Cible: 76.76.21.21
TTL: 3600
```

**OU utilisez un ALIAS/ANAME si OVH le supporte :**
```
Type: ALIAS
Sous-domaine: @
Cible: cname.vercel-dns.com
TTL: 3600
```

### 5.2 Sur Vercel

1. Dans votre projet, allez dans **Settings** > **Domains**
2. Cliquez sur **Add Domain**
3. Entrez : `www.flightalert.fr`
4. Vercel va vous guider pour la vérification
5. Répétez pour `flightalert.fr`
6. Configurez la redirection : `flightalert.fr` → `www.flightalert.fr`

### 5.3 Vérification

Attendez 1-2 heures pour la propagation DNS, puis testez :

```bash
# Vérifier les DNS
nslookup www.flightalert.fr
nslookup flightalert.fr

# Tester le site
curl https://www.flightalert.fr
```

---

## 🔐 Étape 6 : Configurer Stripe Webhook

### 6.1 Créer le webhook

1. Allez sur https://dashboard.stripe.com/webhooks
2. Cliquez sur **Add endpoint**
3. URL : `https://www.flightalert.fr/api/stripe/webhook`
4. Événements à écouter :
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copiez le **Signing secret** (commence par `whsec_...`)
6. Ajoutez-le dans Vercel comme `STRIPE_WEBHOOK_SECRET`

---

## ✅ Étape 7 : Tester le déploiement

### 7.1 Vérifications

```bash
# 1. Build local
npm run build

# 2. Déployer sur Vercel
vercel --prod

# 3. Vérifier les logs
vercel logs
```

### 7.2 Tests fonctionnels

1. **Page d'accueil** : https://www.flightalert.fr
2. **Inscription** : Créer un compte gratuit
3. **Login** : Se connecter
4. **Recherche de vols** : Tester `/recherche`
5. **Destinations** : Ajouter des destinations
6. **Historique** : Vérifier `/historique`
7. **Admin** : `/admin` (tester envoi email/SMS)
8. **Paiement Premium** : Tester le checkout Stripe

---

## 🐛 Dépannage

### Erreur : "Table does not exist"

```bash
# Reconnectez-vous à la base de données et pushez le schéma
npx prisma db push --force-reset
```

### Erreur : "Invalid DATABASE_URL"

- Vérifiez que vous utilisez `POSTGRES_PRISMA_URL` de Vercel
- Format : `postgresql://user:password@host:5432/database?pgbouncer=true`

### Erreur : Build failed

```bash
# Vérifiez les logs Vercel
vercel logs

# Essayez un build local
npm run build
```

### DNS ne fonctionne pas

- Attendez 24h pour la propagation DNS complète
- Vérifiez avec : https://dnschecker.org

---

## 📊 Monitoring

### Vercel Analytics (gratuit)

1. Activez **Analytics** dans votre projet Vercel
2. Suivez les performances et le trafic

### Logs

```bash
# Voir les logs en temps réel
vercel logs --follow

# Voir les logs d'une fonction spécifique
vercel logs --follow /api/flights/search
```

---

## 🔄 Mises à jour

Pour déployer une nouvelle version :

```bash
# Commitez vos changements
git add .
git commit -m "feat: nouvelle fonctionnalité"
git push origin main

# Vercel déploie automatiquement !
```

---

## 📝 Checklist finale

- [ ] Base de données Postgres créée et migrée
- [ ] Toutes les variables d'environnement configurées
- [ ] Nom de domaine configuré (DNS + Vercel)
- [ ] Stripe webhook configuré
- [ ] Tests fonctionnels passés
- [ ] SSL/HTTPS activé (automatique avec Vercel)
- [ ] Pages légales accessibles (RGPD, CGV, etc.)
- [ ] Email de bienvenue fonctionne
- [ ] SMS premium fonctionne (si Twilio configuré)

---

## 🎉 Félicitations !

Votre application FlightAlert est maintenant en ligne sur **www.flightalert.fr** !

### Prochaines étapes

1. **Marketing** : Commencez à promouvoir votre service
2. **Monitoring** : Surveillez les erreurs et les performances
3. **Optimisation** : Améliorez en fonction des retours utilisateurs
4. **SEO** : Optimisez pour les moteurs de recherche

---

## 📞 Support

- **Documentation Vercel** : https://vercel.com/docs
- **Documentation Prisma** : https://www.prisma.io/docs
- **Documentation Stripe** : https://stripe.com/docs

Bon vol ! ✈️
