# 📁 Structure complète du projet

```
flight-deals-alerts/
│
├── 📱 app/                                 # Pages et routes Next.js 14 (App Router)
│   │
│   ├── 🔐 (auth)/                         # Groupe de routes authentification
│   │   ├── login/
│   │   │   └── page.tsx                   # Page de connexion
│   │   └── signup/
│   │       └── page.tsx                   # Page d'inscription avec choix de plan
│   │
│   ├── 🎯 api/                            # Routes API
│   │   ├── auth/
│   │   │   ├── login/route.ts             # API: Connexion
│   │   │   └── signup/route.ts            # API: Inscription + création user
│   │   ├── stripe/
│   │   │   ├── create-checkout/route.ts   # API: Créer session Stripe
│   │   │   ├── webhook/route.ts           # API: Webhooks Stripe
│   │   │   └── cancel-subscription/route.ts # API: Annuler abonnement
│   │   ├── email/
│   │   │   └── send-deal/route.ts         # API: Envoyer email de deal
│   │   ├── sms/
│   │   │   └── send-deal/route.ts         # API: Envoyer SMS de deal
│   │   └── admin/
│   │       ├── create-deal/route.ts       # API: Créer un deal (admin)
│   │       ├── send-test-email/route.ts   # API: Test email
│   │       └── send-test-sms/route.ts     # API: Test SMS
│   │
│   ├── 👤 dashboard/
│   │   └── page.tsx                       # Dashboard utilisateur
│   │
│   ├── 🔧 admin/
│   │   └── page.tsx                       # Panel admin
│   │
│   ├── 📄 Pages statiques
│   │   ├── comment-ca-marche/page.tsx     # Page explicative
│   │   ├── tarifs/page.tsx                # Plans et tarifs
│   │   ├── contact/page.tsx               # Formulaire de contact
│   │   └── mentions-legales/page.tsx      # Mentions légales
│   │
│   ├── layout.tsx                         # Layout principal (Header + Footer)
│   ├── page.tsx                           # 🏠 Landing page (Hero + Deals + HowItWorks + Pricing)
│   └── globals.css                        # Styles Tailwind + CSS customs
│
├── 🎨 components/
│   ├── landing/                           # Composants de la landing page
│   │   ├── DealCard.tsx                   # Carte de deal (rouge/noir)
│   │   ├── DealsSection.tsx               # Section exemples de deals
│   │   ├── Hero.tsx                       # Hero section
│   │   ├── HowItWorks.tsx                 # Section "Comment ça marche"
│   │   └── PricingSection.tsx             # Section tarifs
│   │
│   └── ui/                                # Composants UI réutilisables
│       ├── Button.tsx                     # Bouton avec variants
│       ├── Header.tsx                     # Header + navigation
│       └── Footer.tsx                     # Footer avec liens
│
├── 📚 lib/                                # Logique métier et utils
│   ├── auth.ts                            # Authentification (hash, verify, create user)
│   ├── email.ts                           # Service email (Brevo/MailerLite)
│   ├── prisma.ts                          # Client Prisma singleton
│   ├── sms.ts                             # Service SMS (Twilio)
│   ├── stripe.ts                          # Service Stripe
│   ├── types.ts                           # Types TypeScript
│   └── utils.ts                           # Utilitaires + DESTINATIONS + PLANS
│
├── 🗄️ prisma/
│   └── schema.prisma                      # Schéma BDD (User, Subscription, Deal, Alert, Destination)
│
├── ⚙️ Configuration
│   ├── .env                               # Variables d'environnement (avec valeurs par défaut)
│   ├── .env.example                       # Template des variables
│   ├── .gitignore                         # Fichiers à ignorer
│   ├── next.config.js                     # Config Next.js
│   ├── tailwind.config.ts                 # Config Tailwind (couleurs, fonts)
│   ├── postcss.config.js                  # Config PostCSS
│   ├── tsconfig.json                      # Config TypeScript
│   └── package.json                       # Dépendances et scripts
│
└── 📖 Documentation
    ├── README.md                          # Documentation complète
    ├── DEMARRAGE_RAPIDE.md                # Guide de démarrage en 3 commandes
    └── STRUCTURE.md                       # Ce fichier

```

## 🎨 Stack technique

- **Framework**: Next.js 14 (App Router)
- **Langage**: TypeScript
- **Styling**: Tailwind CSS + CSS custom
- **Base de données**: Prisma + SQLite (dev) / PostgreSQL (prod)
- **Authentification**: bcrypt + localStorage (à améliorer avec NextAuth)
- **Paiements**: Stripe Checkout + Webhooks
- **Email**: Brevo / MailerLite (API)
- **SMS**: Twilio (API)

## 🚀 Commandes

```bash
npm install              # Installer les dépendances
npm run dev              # Lancer le serveur de dev
npm run build            # Build production
npm run start            # Lancer en production
npm run prisma:generate  # Générer le client Prisma
npm run prisma:push      # Push le schema vers la BDD
npm run prisma:studio    # Ouvrir Prisma Studio (GUI)
```

## 📊 Modèles de données

### User
- id, email, password, name
- subscription (relation 1:1)
- destinations (relation 1:N)
- alerts (relation 1:N)

### Subscription
- id, userId, plan (free/sms), status
- stripeCustomerId, stripeSubscriptionId
- currentPeriodEnd

### Deal
- id, from, to, price, originalPrice, discount
- currency, dates, url
- createdAt, expiresAt

### Alert
- id, userId, dealId, channel (email/sms)
- sent, sentAt

### Destination
- id, userId, city, country, code

## 🎯 Features implémentées

✅ Landing page complète avec design noir/rouge
✅ Section deals avec style "pirate web"
✅ Inscription/connexion utilisateurs
✅ Dashboard avec gestion des destinations
✅ Intégration Stripe (checkout + webhooks)
✅ Routes API pour email/SMS
✅ Panel admin pour créer des deals
✅ Design responsive (mobile, tablet, desktop)
✅ Toutes les pages demandées
✅ Structure prête pour VS Code
