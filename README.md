# FlightDeals - Alertes de vols pas chers

Site complet d'alertes de vols avec Next.js 14, TypeScript, Tailwind CSS, Prisma, et Stripe.

## 🚀 Installation

### 1. Installer les dépendances

```bash
cd flight-deals-alerts
npm install
```

### 2. Configuration de l'environnement

Copiez le fichier `.env.example` vers `.env`:

```bash
cp .env.example .env
```

Puis éditez `.env` avec vos propres clés API.

### 3. Initialiser la base de données

```bash
npm run prisma:generate
npm run prisma:push
```

### 4. Lancer le projet

```bash
npm run dev
```

Le site sera accessible sur [http://localhost:3000](http://localhost:3000)

## 🔑 Configuration des services

### Stripe (Paiements)

1. Créez un compte sur [stripe.com](https://stripe.com)
2. Récupérez vos clés API dans le Dashboard Stripe
3. Créez un produit "Premium SMS" avec un prix mensuel (9.99€)
4. Ajoutez les clés dans `.env`:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_PRICE_ID_MONTHLY`

#### Configurer les webhooks Stripe:

1. Dans le Dashboard Stripe, allez dans Developers > Webhooks
2. Ajoutez un endpoint: `https://votre-domaine.com/api/stripe/webhook`
3. Sélectionnez ces événements:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copiez le secret du webhook dans `STRIPE_WEBHOOK_SECRET`

Pour tester en local, utilisez Stripe CLI:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

### Email (Brevo / MailerLite)

#### Option 1: Brevo (recommandé)

1. Créez un compte sur [brevo.com](https://brevo.com)
2. Allez dans SMTP & API > API Keys
3. Créez une clé API
4. Ajoutez dans `.env`:
   ```
   EMAIL_API_KEY=your_brevo_api_key
   EMAIL_FROM=noreply@votredomaine.com
   ```
5. Décommentez le code API Brevo dans `lib/email.ts`

#### Option 2: MailerLite

1. Créez un compte sur [mailerlite.com](https://mailerlite.com)
2. Récupérez votre API key
3. Modifiez `lib/email.ts` pour utiliser l'API MailerLite

### SMS (Twilio)

1. Créez un compte sur [twilio.com](https://twilio.com)
2. Achetez un numéro de téléphone Twilio
3. Récupérez vos credentials:
   - Account SID
   - Auth Token
   - Phone Number
4. Installez le SDK Twilio:
   ```bash
   npm install twilio
   ```
5. Ajoutez dans `.env`:
   ```
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_PHONE_NUMBER=+1234567890
   ```
6. Décommentez le code Twilio dans `lib/sms.ts`

## 📁 Structure du projet

```
flight-deals-alerts/
├── app/
│   ├── (auth)/
│   │   ├── login/          # Page de connexion
│   │   └── signup/         # Page d'inscription
│   ├── admin/              # Panel admin
│   ├── api/
│   │   ├── auth/           # Routes auth (login, signup)
│   │   ├── stripe/         # Routes Stripe (checkout, webhook)
│   │   ├── email/          # Routes email
│   │   ├── sms/            # Routes SMS
│   │   └── admin/          # Routes admin
│   ├── comment-ca-marche/  # Page explicative
│   ├── contact/            # Page contact
│   ├── dashboard/          # Dashboard utilisateur
│   ├── tarifs/             # Page tarifs
│   ├── layout.tsx          # Layout principal
│   ├── page.tsx            # Landing page
│   └── globals.css         # Styles globaux
├── components/
│   ├── landing/            # Composants landing page
│   └── ui/                 # Composants réutilisables
├── lib/
│   ├── auth.ts             # Logique d'authentification
│   ├── email.ts            # Service email
│   ├── prisma.ts           # Client Prisma
│   ├── sms.ts              # Service SMS
│   ├── stripe.ts           # Service Stripe
│   ├── types.ts            # Types TypeScript
│   └── utils.ts            # Utilitaires
├── prisma/
│   └── schema.prisma       # Schéma base de données
├── .env.example            # Variables d'environnement exemple
├── package.json
└── README.md
```

## 🎨 Pages disponibles

- `/` - Landing page avec hero, deals, comment ça marche, tarifs
- `/comment-ca-marche` - Explication détaillée du service
- `/tarifs` - Plans et FAQ
- `/contact` - Formulaire de contact
- `/login` - Connexion utilisateur
- `/signup` - Inscription avec choix de plan
- `/dashboard` - Espace utilisateur (destinations, alertes, abonnement)
- `/admin` - Panel admin (créer des deals, envoyer des tests)

## 🔐 Admin

Accédez à `/admin` avec le mot de passe défini dans `.env` (`ADMIN_PASSWORD`).

Fonctionnalités admin:
- Créer de nouveaux deals
- Envoyer des emails de test
- Envoyer des SMS de test

## 🗄️ Base de données

Le projet utilise Prisma avec SQLite par défaut (facile pour le développement).

Pour passer à PostgreSQL en production:

1. Modifiez `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. Mettez à jour `DATABASE_URL` dans `.env`:
   ```
   DATABASE_URL="postgresql://user:password@host:5432/dbname"
   ```

3. Relancez:
   ```bash
   npm run prisma:generate
   npm run prisma:push
   ```

## 📱 Responsive

Le site est entièrement responsive et optimisé pour:
- Desktop (1920px+)
- Laptop (1280px+)
- Tablet (768px+)
- Mobile (320px+)

## 🎨 Design

Le design suit les contraintes demandées:
- Fond noir (`#000000`)
- Rouge primary (`#DC2626`)
- Texte blanc
- Style "pirate web / chasse aux deals"
- Typographie Inter
- Animations et hover states

## 🚀 Déploiement

### Vercel (recommandé)

1. Poussez votre code sur GitHub
2. Connectez votre repo à Vercel
3. Ajoutez les variables d'environnement
4. Déployez!

### Autres plateformes

Le projet peut être déployé sur n'importe quelle plateforme supportant Next.js:
- Netlify
- Railway
- Render
- AWS Amplify
- etc.

## 📝 TODO après déploiement

- [ ] Configurer un vrai système de session (NextAuth, Auth0, Clerk)
- [ ] Implémenter un système de stockage de numéros de téléphone
- [ ] Ajouter un worker/cron pour scanner automatiquement les vols
- [ ] Implémenter la logique d'envoi automatique des alertes
- [ ] Configurer les webhooks Stripe en production
- [ ] Ajouter des tests (Jest, Playwright)
- [ ] Optimiser les images (next/image)
- [ ] Ajouter Google Analytics / Plausible
- [ ] Configurer un CDN
- [ ] Mettre en place un rate limiting sur les API

## 📄 Licence

Ce projet est fourni tel quel sans garantie. Libre à vous de le modifier selon vos besoins.

## 🆘 Support

Pour toute question, consultez:
- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Prisma](https://www.prisma.io/docs)
- [Documentation Stripe](https://stripe.com/docs)
- [Documentation Tailwind CSS](https://tailwindcss.com/docs)
