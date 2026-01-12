# 🚀 Déploiement Vercel - Méthode Alternative (Interface Web)

Si le déploiement CLI ne fonctionne pas, voici la méthode via l'interface web (plus simple) :

## 📦 Étape 1 : Importer le projet sur Vercel

1. **Aller sur** : https://vercel.com/new
2. **Se connecter** avec GitHub (si pas déjà fait)
3. **Chercher et sélectionner** votre repository : `Nathan939/flight-deals-app`
4. **Cliquer sur** "Import"

## ⚙️ Étape 2 : Configuration du projet

### Framework Preset
- Vercel détectera automatiquement : **Next.js**
- Ne rien changer

### Root Directory
- Laisser : `./` (racine)

### Build and Output Settings
- **Build Command** : `prisma generate && next build`
- **Output Directory** : `.next`
- **Install Command** : `npm install`

### Environment Variables

Cliquer sur "Add" pour chaque variable :

```bash
# Database (à configurer après avoir créé la DB Vercel Postgres)
DATABASE_URL = "postgresql://..."

# Auth - GÉNÉRER UN NOUVEAU SECRET !
NEXTAUTH_SECRET = "generer-avec-openssl-rand-base64-32"
NEXTAUTH_URL = "https://votre-app.vercel.app"

# Kiwi.com API
KIWI_API_KEY = "f809c440-eee0-11f0-a57a-479dec5ea4fd"

# Stripe (Mode TEST pour commencer)
STRIPE_SECRET_KEY = "sk_test_votre_cle"
STRIPE_PUBLISHABLE_KEY = "pk_test_votre_cle"
STRIPE_WEBHOOK_SECRET = "whsec_a_configurer_apres"
STRIPE_PRICE_ID_MONTHLY = "price_votre_price_id"

# Email - Brevo (à obtenir sur brevo.com)
EMAIL_API_KEY = "xkeysib-votre_cle"
EMAIL_FROM = "noreply@votredomaine.com"

# SMS - Twilio (à obtenir sur twilio.com)
TWILIO_ACCOUNT_SID = "AC_votre_sid"
TWILIO_AUTH_TOKEN = "votre_token"
TWILIO_PHONE_NUMBER = "+33_ou_autre"

# Admin
ADMIN_PASSWORD = "votre-mot-de-passe-securise"
NEXT_PUBLIC_ADMIN_PASSWORD = "votre-mot-de-passe-securise"
```

**Important** : Pour `NEXTAUTH_SECRET`, générez un secret aléatoire :
```bash
openssl rand -base64 32
```

### Étape 3 : Déployer

1. **Cliquer sur** "Deploy"
2. **Attendre** 2-3 minutes
3. Votre app sera accessible sur : `https://flight-deals-app-xxxx.vercel.app`

## 🗄️ Étape 4 : Créer la base de données Postgres

1. Dans votre dashboard Vercel, aller dans l'onglet **"Storage"**
2. Cliquer sur **"Create Database"**
3. Choisir **"Postgres"**
4. Région : **"Frankfurt, Germany (cdg1)"** (plus proche de la France)
5. Cliquer sur **"Create"**
6. Attendre la création (1-2 minutes)

### Connecter la base de données au projet

1. Une fois créée, aller dans **Settings** de la base de données
2. Onglet **".env.local"**
3. Copier la variable **`POSTGRES_PRISMA_URL`**
4. Aller dans votre projet → **Settings** → **Environment Variables**
5. **Modifier** la variable `DATABASE_URL` avec l'URL copiée
6. **Redéployer** le projet (onglet Deployments → trois points → Redeploy)

## 📊 Étape 5 : Migrer le schéma de base de données

**Depuis votre terminal local** :

```bash
cd "/Users/nathanmartinelli/Desktop/les vols de sylvain"

# Installer Vercel CLI si pas déjà fait
npm i -g vercel

# Se connecter à Vercel
vercel login

# Lier le projet
vercel link

# Récupérer les variables d'environnement de production
vercel env pull .env.production

# Appliquer les migrations Prisma
npx prisma migrate deploy
```

**Ou via Vercel CLI directement** :
```bash
vercel env pull
DATABASE_URL="l_url_postgres_de_vercel" npx prisma migrate deploy
```

## 🌐 Étape 6 : Configurer votre domaine OVH

### Dans Vercel

1. Aller dans **Settings** → **Domains**
2. Cliquer sur **"Add"**
3. Entrer votre domaine OVH : `votredomaine.com`
4. Vercel affichera les enregistrements DNS nécessaires

### Dans OVH

1. Aller sur https://www.ovh.com/manager/
2. **Noms de domaine** → Votre domaine
3. Onglet **"Zone DNS"**
4. Cliquer sur **"Ajouter une entrée"**

**Ajouter ces enregistrements** :

#### Type A (pour le domaine principal)
```
Sous-domaine : (vide ou @)
Cible : 76.76.21.21
TTL : Automatique
```

#### Type CNAME (pour www)
```
Sous-domaine : www
Cible : cname.vercel-dns.com
TTL : Automatique
```

5. **Sauvegarder**
6. Attendre la propagation DNS (5 minutes à 24 heures)

### Vérifier le domaine

- Dans Vercel, le statut passera à **"Valid"** une fois la propagation terminée
- Activer **"Automatic HTTPS"** (certificat SSL gratuit)
- Tester : `https://votredomaine.com`

## 🔐 Étape 7 : Configurer les Webhooks Stripe

Une fois le site déployé :

1. Aller sur https://dashboard.stripe.com/webhooks
2. Cliquer sur **"Add endpoint"**
3. **URL** : `https://votredomaine.com/api/stripe/webhook`
4. **Événements** à sélectionner :
   - `checkout.session.completed`
   - `customer.subscription.deleted`
   - `customer.subscription.updated`
5. Cliquer sur **"Add endpoint"**
6. **Copier le "Signing secret"** (commence par `whsec_`)
7. Dans Vercel → Settings → Environment Variables
8. **Modifier** `STRIPE_WEBHOOK_SECRET` avec le secret copié
9. **Redéployer** le projet

## ✅ Étape 8 : Tests

### Tests à effectuer :

1. **Page d'accueil** : https://votredomaine.com
   - [ ] La page charge correctement
   - [ ] Les animations fonctionnent
   - [ ] Navigation fonctionne

2. **Inscription/Connexion**
   - [ ] Inscription gratuite fonctionne
   - [ ] Inscription premium avec Stripe (mode test)
   - [ ] Connexion fonctionne

3. **Recherche de destinations**
   - [ ] Recherche fonctionne (ex: "Tokyo")
   - [ ] Ajout en favoris fonctionne
   - [ ] [Premium] Boutons SMS/Email apparaissent

4. **Dashboard Admin**
   - [ ] Accessible sur `/admin`
   - [ ] Connexion avec mot de passe fonctionne
   - [ ] Liste des destinations affichée
   - [ ] Envoi d'une offre test

### Test de paiement Stripe

**Cartes de test Stripe** :
- Succès : `4242 4242 4242 4242`
- Décliné : `4000 0000 0000 0002`
- Date : N'importe quelle date future
- CVC : N'importe quel 3 chiffres

## 🔄 Workflow de mise à jour

Après le déploiement initial, pour mettre à jour :

```bash
# 1. Modifier le code localement
# 2. Tester en local
npm run dev

# 3. Commiter et pousser
git add .
git commit -m "Description des changements"
git push

# 4. Vercel déploie automatiquement ! ✨
```

## 📊 Monitoring

### Voir les logs
- Vercel Dashboard → Votre projet → **"Logs"**
- Filtrer par niveau : Error, Warning, Info

### Voir les déploiements
- Vercel Dashboard → **"Deployments"**
- Historique complet avec preview de chaque version

### Analytics
- Vercel Dashboard → **"Analytics"**
- Visiteurs, pages vues, performances

## 🆘 Troubleshooting

### Erreur "Database connection failed"
- Vérifier que `DATABASE_URL` est correctement configuré
- Vérifier que les migrations sont appliquées
- Redéployer le projet

### Erreur "Module not found"
- Vérifier `package.json`
- Build command : `prisma generate && next build`
- Redéployer

### Domaine ne fonctionne pas
- Attendre 24h pour la propagation DNS
- Vérifier les enregistrements DNS sur OVH
- Utiliser https://www.whatsmydns.net pour vérifier

### Paiement Stripe échoue
- Vérifier que `STRIPE_WEBHOOK_SECRET` est configuré
- Consulter les logs Stripe : https://dashboard.stripe.com/events
- Tester en mode test d'abord

## 💡 Conseils

1. **Commencer en mode TEST** pour Stripe
2. **Configurer Twilio/Brevo** après avoir vérifié que tout fonctionne
3. **Tester sur le domaine Vercel** avant de configurer votre domaine OVH
4. **Sauvegarder** vos variables d'environnement dans un endroit sûr

## 🎉 Félicitations !

Une fois ces étapes terminées, votre application sera **100% opérationnelle** et accessible publiquement !

**Liens importants** :
- Votre app : `https://votredomaine.com`
- Dashboard admin : `https://votredomaine.com/admin`
- GitHub : https://github.com/Nathan939/flight-deals-app
- Vercel Dashboard : https://vercel.com/dashboard

---

**Besoin d'aide ?** Consultez [DEPLOY_GUIDE.md](DEPLOY_GUIDE.md) pour plus de détails.
