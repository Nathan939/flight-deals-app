# ✈️ FlightAlert - Alertes de Deals de Vols

> **Recevez les meilleurs deals de vols avant tout le monde par email et SMS**

🌐 **Site web** : [www.flightalert.fr](https://www.flightalert.fr)

---

## 🚀 Fonctionnalités

### Pour les Utilisateurs

#### 🆓 Gratuit
- Alertes email illimitées
- Jusqu'à 5 destinations favorites
- Recherche de vols avancée
- Historique des deals reçus
- Interface moderne et responsive

#### ⭐ Premium (4€/mois ou 40€/an)
- Tout le plan gratuit +
- **Alertes SMS en temps réel**
- Destinations illimitées
- Alertes prioritaires
- Support client prioritaire

### 🔍 Moteur de Recherche
- Recherche par aéroport et destination
- Filtrage par dates (aller simple/retour)
- Sélection passagers (adultes/enfants/bébés)
- Options bagages (cabine/soute)
- Filtre par prix et devise

### 📱 Notifications
- **Email** : Via Brevo (Sendinblue)
- **SMS** : Via Twilio (Premium)
- Historique complet des deals

---

## 🛠️ Stack Technique

- **Framework** : Next.js 14 (App Router)
- **Language** : TypeScript
- **Styling** : Tailwind CSS
- **Base de données** : PostgreSQL (Prisma ORM)
- **Hébergement** : Vercel
- **Authentification** : bcrypt
- **Paiements** : Stripe
- **APIs** :
  - Kiwi.com (recherche de vols)
  - Brevo (emails)
  - Twilio (SMS)

---

## 📦 Installation

### Prérequis

- Node.js 18+
- npm ou yarn
- Compte PostgreSQL (ou Vercel Postgres)

### Clés API nécessaires

1. **Kiwi.com** : https://tequila.kiwi.com/portal/login
2. **Brevo** : https://app.brevo.com (300 emails/jour gratuits)
3. **Twilio** : https://www.twilio.com (15$ crédit gratuit)
4. **Stripe** : https://dashboard.stripe.com

### Installation locale

```bash
# Cloner le repository
git clone https://github.com/votre-username/flightalert.git
cd flightalert

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Configurer les variables d'environnement dans .env
# (voir .env.example pour la liste complète)

# Créer la base de données
npx prisma generate
npx prisma db push

# Lancer en développement
npm run dev
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000)

---

## 🚀 Déploiement

### Guide Complet

Consultez le fichier [`GUIDE_DEPLOIEMENT_COMPLET.md`](./GUIDE_DEPLOIEMENT_COMPLET.md) pour les instructions détaillées de déploiement sur Vercel.

### Résumé rapide

1. **Créer un compte Vercel** : https://vercel.com
2. **Importer le projet** depuis GitHub
3. **Créer Postgres** dans Storage
4. **Ajouter les variables d'environnement**
5. **Déployer** et migrer la base

**Actions requises** : Voir [`ACTIONS_UTILISATEUR_REQUISES.md`](./ACTIONS_UTILISATEUR_REQUISES.md)

---

## 📁 Structure du Projet

```
flightalert/
├── app/
│   ├── api/              # Routes API
│   │   ├── auth/         # Authentification
│   │   ├── flights/      # Recherche de vols
│   │   ├── deals/        # Gestion des deals
│   │   ├── destinations/ # Destinations favorites
│   │   └── stripe/       # Paiements
│   ├── (pages)/          # Pages publiques
│   ├── recherche/        # Moteur de recherche
│   ├── historique/       # Historique utilisateur
│   └── admin/            # Panel admin
├── components/
│   ├── ui/               # Composants UI
│   └── landing/          # Page d'accueil
├── lib/
│   ├── prisma.ts         # Client Prisma
│   ├── auth.ts           # Authentification
│   ├── email.ts          # Envoi emails (Brevo)
│   ├── sms.ts            # Envoi SMS (Twilio)
│   ├── stripe.ts         # Paiements
│   └── kiwi-api.ts       # API Kiwi.com
├── prisma/
│   └── schema.prisma     # Schéma de base de données
└── public/               # Assets statiques
```

---

## 🔐 Variables d'Environnement

Créez un fichier `.env` à la racine du projet :

```env
# Base de données
DATABASE_URL="postgresql://..."

# Authentification
NEXTAUTH_SECRET="votre-secret-aléatoire"
NEXTAUTH_URL="http://localhost:3000"

# Kiwi.com API
KIWI_API_KEY="votre_clé_kiwi"

# Brevo (Emails)
EMAIL_API_KEY="votre_clé_brevo"
EMAIL_FROM="noreply@flightalert.fr"

# Twilio (SMS)
TWILIO_ACCOUNT_SID="ACxxxxxxxxx"
TWILIO_AUTH_TOKEN="votre_token"
TWILIO_PHONE_NUMBER="+33XXXXXXXXX"

# Stripe
STRIPE_SECRET_KEY="sk_test_xxxxx"
STRIPE_PUBLISHABLE_KEY="pk_test_xxxxx"
STRIPE_WEBHOOK_SECRET="whsec_xxxxx"
STRIPE_PRICE_ID_MONTHLY="price_xxxxx"

# Admin
ADMIN_PASSWORD="votre-password-admin"
NEXT_PUBLIC_ADMIN_PASSWORD="votre-password-admin"
```

Voir `.env.example` pour la liste complète.

---

## 📊 Modèle de Base de Données

```prisma
model User {
  id            String         @id @default(cuid())
  email         String         @unique
  password      String
  name          String?
  phone         String?
  subscription  Subscription?
  destinations  Destination[]
  alerts        Alert[]
}

model Subscription {
  id                   String   @id @default(cuid())
  userId               String   @unique
  plan                 String   // "free", "email", "sms"
  status               String   // "active", "canceled"
  stripeCustomerId     String?
  stripeSubscriptionId String?
  currentPeriodEnd     DateTime?
}

model Destination {
  id            String   @id @default(cuid())
  userId        String
  city          String
  country       String
  code          String   // IATA code
  notifyChannel String   @default("email")
}

model Deal {
  id            String   @id @default(cuid())
  from          String
  to            String
  price         Float
  originalPrice Float
  currency      String   @default("EUR")
  discount      Int
  url           String?
  expiresAt     DateTime?
}
```

---

## 🧪 Tests

### Test des fonctionnalités

1. **Page d'accueil** : http://localhost:3000
2. **Inscription** : http://localhost:3000/signup
3. **Recherche** : http://localhost:3000/recherche
4. **Admin** : http://localhost:3000/admin

### Test des emails/SMS

Dans le panel admin, utilisez les boutons "Test Email" et "Test SMS".

---

## 📄 Pages Légales

Le projet inclut toutes les pages légales nécessaires :

- ✅ **RGPD** : `/rgpd`
- ✅ **Politique de Confidentialité** : `/politique-confidentialite`
- ✅ **CGV** : `/cgv`
- ✅ **Mentions Légales** : `/mentions-legales`

Toutes conformes à la législation européenne (RGPD).

---

## 💰 Tarifs & Business Model

### Plans

| Plan | Prix | Fonctionnalités |
|------|------|-----------------|
| **Gratuit** | 0€ | Alertes email, 5 destinations |
| **Premium** | 4€/mois | + SMS, destinations illimitées |
| **Premium Annuel** | 40€/an | 2 mois offerts |

### Coûts Opérationnels

| Service | Plan | Coût estimé |
|---------|------|-------------|
| Vercel | Hobby | 0€ |
| Postgres | Hobby | 0€ (jusqu'à 256 MB) |
| Brevo | Gratuit | 0€ (300 emails/jour) |
| Twilio | PAYG | ~2€/mois |
| Stripe | Commission | 1.4% + 0.25€/transaction |
| **Total** | | **~2-5€/mois au départ** |

---

## 🤝 Contribution

Les contributions sont les bienvenues !

1. Fork le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'Add AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

---

## 📝 License

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

## 📞 Contact

- **Email** : contact@flightalert.fr
- **Site web** : https://www.flightalert.fr
- **Support** : dpo@flightalert.fr

---

## 🙏 Remerciements

- [Next.js](https://nextjs.org/) - Framework React
- [Vercel](https://vercel.com/) - Hébergement
- [Kiwi.com](https://www.kiwi.com/) - API de recherche de vols
- [Brevo](https://www.brevo.com/) - Service d'emails
- [Twilio](https://www.twilio.com/) - Service SMS
- [Stripe](https://stripe.com/) - Paiements
- [Tailwind CSS](https://tailwindcss.com/) - Styling

---

## 📚 Documentation

- 📖 [Guide de Déploiement Complet](./GUIDE_DEPLOIEMENT_COMPLET.md)
- 📋 [Actions Utilisateur Requises](./ACTIONS_UTILISATEUR_REQUISES.md)
- 📝 [Récapitulatif du Travail](./RECAP_TRAVAIL_TERMINE.md)

---

## ⭐ Roadmap

### Phase 1 : MVP (Actuel) ✅
- [x] Système d'alertes email
- [x] Système d'alertes SMS premium
- [x] Recherche de vols avancée
- [x] Historique des deals
- [x] Paiements Stripe
- [x] Pages légales RGPD

### Phase 2 : Améliorations
- [ ] Filtres de recherche avancés
- [ ] Notifications push (PWA)
- [ ] Application mobile
- [ ] Système de parrainage
- [ ] Statistiques utilisateur
- [ ] API publique

### Phase 3 : Expansion
- [ ] Multi-langue (EN, ES, DE)
- [ ] Deals hôtels
- [ ] Deals locations de voiture
- [ ] Packages complets voyage

---

## 🎉 Statut du Projet

🟢 **Production Ready** - Le projet est prêt pour le déploiement en production !

**Dernière mise à jour** : 15 janvier 2026

---

<div align="center">
  <p>Fait avec ❤️ pour les voyageurs</p>
  <p>✈️ <strong>FlightAlert</strong> - Ne ratez plus jamais un bon plan !</p>
</div>
