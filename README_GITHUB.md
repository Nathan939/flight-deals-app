# ✈️ Flight Deals App

Application web moderne pour la recherche et la notification d'offres de vols exceptionnelles.

## 🌟 Fonctionnalités

- **🔍 Recherche Universelle** : Recherchez parmi tous les aéroports du monde avec l'API Kiwi.com
- **⭐ Favoris Intelligents** : Ajoutez vos destinations préférées en favoris
- **📱 Notifications SMS/Email** : Recevez instantanément les meilleures offres
- **💎 Plans Premium** : Choisissez entre notifications Email (gratuit) ou SMS (premium)
- **🎯 Choix par Destination** : Les utilisateurs premium peuvent choisir SMS ou Email pour chaque destination
- **🛠️ Dashboard Admin** : Interface complète pour envoyer des offres aux utilisateurs

## 🚀 Technologies

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Base de données**: PostgreSQL (Vercel Postgres)
- **Paiements**: Stripe
- **Notifications**: Twilio (SMS) + Brevo (Email)
- **API**: Kiwi.com pour la recherche de vols

## 📦 Installation Locale

```bash
# Cloner le repository
git clone https://github.com/Nathan939/flight-deals-app.git
cd flight-deals-app

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Configurer les variables dans .env
# (voir section Configuration ci-dessous)

# Lancer la base de données
npx prisma migrate dev

# Démarrer le serveur
npm run dev
```

L'application sera accessible sur http://localhost:3000

## ⚙️ Configuration

Créer un fichier `.env` avec les variables suivantes :

```bash
# Database
DATABASE_URL="file:./dev.db"

# Kiwi.com API (100 requêtes/jour gratuit)
KIWI_API_KEY="votre_cle_api"

# Stripe (Mode test pour développement)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Twilio (SMS)
TWILIO_ACCOUNT_SID="AC..."
TWILIO_AUTH_TOKEN="..."
TWILIO_PHONE_NUMBER="+..."

# Brevo (Email)
EMAIL_API_KEY="xkeysib-..."
EMAIL_FROM="noreply@votredomaine.com"

# Admin
ADMIN_PASSWORD="votre_mot_de_passe"
NEXT_PUBLIC_ADMIN_PASSWORD="votre_mot_de_passe"
```

### Obtenir les clés API

- **Kiwi.com** : https://tequila.kiwi.com/portal/login (Gratuit)
- **Stripe** : https://dashboard.stripe.com/apikeys
- **Twilio** : https://www.twilio.com/try-twilio (Crédit gratuit)
- **Brevo** : https://www.brevo.com (300 emails/jour gratuit)

## 📖 Guide d'utilisation

### Pour les utilisateurs

1. **S'inscrire** avec un compte gratuit ou premium
2. **Rechercher** des destinations (ex: "Tokyo", "New York", "Bali")
3. **Ajouter en favoris** en cliquant sur l'étoile ⭐
4. **[Premium] Choisir** SMS ou Email pour chaque destination
5. **Recevoir** les offres automatiquement !

### Pour l'administrateur

1. Accéder au dashboard : `/admin`
2. Voir la liste des destinations suivies
3. Créer une offre pour une destination
4. Le système envoie automatiquement les notifications

## 🏗️ Architecture

```
app/
├── (auth)/              # Pages d'authentification
├── admin/               # Dashboard admin
├── destinations/        # Page de recherche et favoris
├── api/
│   ├── admin/          # API admin (envoi d'offres)
│   ├── destinations/   # API destinations (recherche, favoris)
│   ├── stripe/         # Webhooks Stripe
│   └── user/           # API utilisateur
lib/
├── kiwi-api.ts         # Intégration API Kiwi.com
├── location-search.ts  # Recherche universelle
├── alert-system.ts     # Système de notifications
├── sms.ts              # Envoi SMS (Twilio)
└── email.ts            # Envoi Email (Brevo)
```

## 🚀 Déploiement

Voir [DEPLOY_GUIDE.md](DEPLOY_GUIDE.md) pour les instructions complètes de déploiement sur Vercel avec domaine personnalisé.

### Déploiement rapide

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel --prod
```

## 📊 Coûts Estimés

### Plan Minimal (Démarrage)
- Vercel Hobby : **Gratuit**
- Vercel Postgres : **~5€/mois**
- Kiwi.com API : **Gratuit** (100 req/jour)
- Brevo Email : **Gratuit** (300/jour)
- Twilio SMS : **~10€/mois** (1000 SMS)

**Total : ~15€/mois**

### Plan Standard (Croissance)
- Vercel Pro : **20€/mois**
- Postgres : **25€/mois**
- Emails : **25€/mois** (illimité)
- SMS : **30-50€/mois**

**Total : ~100€/mois**

## 🛠️ Développement

```bash
# Lancer en mode développement
npm run dev

# Build de production
npm run build

# Lancer la production localement
npm start

# Linting
npm run lint

# Formater le code
npm run format
```

## 📝 Scripts Prisma

```bash
# Générer le client Prisma
npx prisma generate

# Créer une migration
npx prisma migrate dev --name nom_migration

# Appliquer les migrations en production
npx prisma migrate deploy

# Ouvrir Prisma Studio (interface BDD)
npx prisma studio
```

## 🔒 Sécurité

- ✅ Variables d'environnement séparées du code
- ✅ Authentification sécurisée avec hashage bcrypt
- ✅ Validation des entrées utilisateur
- ✅ Protection CSRF
- ✅ HTTPS obligatoire en production
- ✅ Webhooks Stripe signés

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📄 Licence

Ce projet est sous licence MIT.

## 👨‍💻 Auteur

Nathan Martinelli ([@Nathan939](https://github.com/Nathan939))

Développé avec l'assistance de Claude (Anthropic)

## 📞 Support

Pour toute question ou problème :
- Ouvrir une [issue](https://github.com/Nathan939/flight-deals-app/issues)
- Consulter la [documentation](DEPLOY_GUIDE.md)

---

**Fait avec ❤️ et ☕**
