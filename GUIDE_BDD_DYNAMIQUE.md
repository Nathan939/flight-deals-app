# 🗄️ Guide Base de Données & Système Dynamique

## 📊 Vue d'ensemble du système

Le projet FlightDeals est maintenant **entièrement dynamique** et connecté à une base de données Prisma (SQLite). Tout est automatisé et facile à gérer.

---

## 🎯 Comment tout fonctionne ensemble

### 1. Les Destinations (40 destinations monde entier)

**Fichier**: `lib/destinations.ts`

Liste complète de 40 destinations avec:
- **Images** provenant d'Unsplash (gratuites, HD)
- Ville, pays, continent
- Code aéroport (LON, TYO, NYC, etc.)
- Description courte

**Comment les utiliser**:

```typescript
import { DESTINATIONS, searchDestinations } from '@/lib/destinations'

// Toutes les destinations
const allDestinations = DESTINATIONS

// Recherche
const results = searchDestinations('tokyo')

// Filtrer par continent
const europeDestinations = DESTINATIONS.filter(d => d.continent === 'Europe')
```

**Page de recherche**: http://localhost:3050/destinations
- Moteur de recherche en temps réel
- Filtrage par continent
- Images animées avec hover effects
- Lien vers les deals de chaque destination

---

### 2. La Base de Données (Prisma + SQLite)

#### Schema Prisma (structure de la BDD)

**Fichier**: `prisma/schema.prisma`

```prisma
model User {
  id           String         @id @default(cuid())
  email        String         @unique
  password     String         // Hashé avec bcrypt
  name         String?
  createdAt    DateTime       @default(now())
  subscription Subscription?
  destinations Destination[]  // Destinations favorites (Premium)
  alerts       Alert[]        // Historique des alertes
}

model Subscription {
  id                    String   @id @default(cuid())
  userId                String   @unique
  plan                  String   @default("free")  // "free" ou "premium"
  status                String   @default("active")
  stripeCustomerId      String?  // ID Stripe
  stripeSubscriptionId  String?
  currentPeriodEnd      DateTime?
  user                  User     @relation(fields: [userId], references: [id])
}

model Destination {
  id        String   @id @default(cuid())
  userId    String
  city      String
  country   String
  code      String   // Code de destination (ex: TYO, NYC)
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
}

model Deal {
  id            String   @id @default(cuid())
  from          String   // Ville de départ
  to            String   // Destination
  price         Float
  originalPrice Float?
  currency      String   @default("EUR")
  departureDate String?
  returnDate    String?
  url           String?  // URL de réservation
  description   String?
  createdAt     DateTime @default(now())
  alerts        Alert[]
}

model Alert {
  id        String   @id @default(cuid())
  userId    String
  dealId    String
  type      String   // "email" ou "sms"
  sentAt    DateTime @default(now())
  status    String   @default("sent")
  user      User     @relation(fields: [userId], references: [id])
  deal      Deal     @relation(fields: [dealId], references: [id])
}
```

---

## 🔧 Gérer la Base de Données

### Option 1: Interface Admin (RECOMMANDÉ)

**URL**: http://localhost:3050/admin
**Mot de passe**: `admin123`

**3 onglets disponibles**:

#### 1️⃣ Créer un Deal
- Formulaire complet pour ajouter des deals
- Champs: Départ, Destination, Prix, Prix original, Dates, URL
- Le deal sera automatiquement:
  - Enregistré en BDD
  - Affiché sur la landing page
  - Envoyé aux utilisateurs (si système d'alertes activé)

**Exemple de deal à créer**:
```
Départ: Paris
Destination: Tokyo
Prix: 439
Prix original: 800
Devise: EUR
Dates: Mars - Mai 2026
URL: https://www.google.fr/flights
```

#### 2️⃣ Gérer les Utilisateurs
- Voir tous les utilisateurs inscrits
- Plan (free/premium) et statut
- Supprimer des utilisateurs
- Date d'inscription

#### 3️⃣ Tests
- Envoyer email de test
- Envoyer SMS de test

---

### Option 2: Prisma Studio (Interface Graphique)

Pour une gestion plus avancée:

```bash
npx prisma studio
```

Cela ouvre http://localhost:5555 avec:
- Vue de toutes les tables
- Création/modification/suppression de données
- Interface visuelle complète

**Avantages**:
- Voir toutes les relations
- Modifier plusieurs entrées en même temps
- Exporter des données

---

### Option 3: Commandes Prisma (Terminal)

#### Voir/Modifier le Schema

```bash
# Ouvrir le fichier schema
code prisma/schema.prisma
```

#### Après modification du schema

```bash
# 1. Créer une migration
npx prisma migrate dev --name nom_de_la_modification

# 2. Regénérer le client Prisma
npx prisma generate
```

#### Reset complet de la BDD

```bash
# ⚠️ ATTENTION: Supprime TOUTES les données
npx prisma migrate reset
```

#### Peupler la BDD avec des données de test

Créer un fichier `prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Créer des deals de test
  await prisma.deal.createMany({
    data: [
      {
        from: 'Paris',
        to: 'Tokyo',
        price: 439,
        originalPrice: 800,
        currency: 'EUR',
        departureDate: 'Mars - Mai 2026',
        url: 'https://www.google.fr/flights'
      },
      {
        from: 'Paris',
        to: 'New York',
        price: 189,
        originalPrice: 780,
        currency: 'EUR',
        departureDate: 'Avril - Juin 2026',
        url: 'https://www.google.fr/flights'
      }
    ]
  })

  console.log('Deals créés!')
}

main()
```

Puis:
```bash
npx ts-node prisma/seed.ts
```

---

## 🔗 Comment tout est connecté

### 1. Inscription Utilisateur

**Flow**:
```
Utilisateur remplit formulaire signup
         ↓
    /api/auth/signup
         ↓
   Prisma crée User + Subscription
         ↓
   localStorage.setItem('user')
         ↓
   Redirection /dashboard
```

**Fichiers impliqués**:
- `app/(auth)/signup/page.tsx` - Formulaire
- `app/api/auth/signup/route.ts` - API
- `lib/auth.ts` - Hash password + création user

### 2. Création d'un Deal (Admin)

**Flow**:
```
Admin remplit formulaire
         ↓
    /api/admin/create-deal
         ↓
   Prisma crée Deal en BDD
         ↓
   Deal visible sur homepage
         ↓
   (Optionnel) Alertes envoyées
```

**Fichiers impliqués**:
- `app/admin/page.tsx` - Interface admin
- `app/api/admin/create-deal/route.ts` - API

### 3. Alertes Destinations Premium

**Flow**:
```
User Premium crée alerte destination
         ↓
   Prisma crée Destination liée au user
         ↓
   Quand nouveau deal correspond
         ↓
   Alert créée + Email/SMS envoyé
```

**Fichiers impliqués**:
- `app/dashboard/page.tsx` - Création alertes
- `lib/destinations.ts` - Liste destinations

### 4. Recherche de Destinations

**Flow**:
```
User tape dans search bar
         ↓
   searchDestinations(query)
         ↓
   Filter + Group by continent
         ↓
   Affichage résultats avec images
         ↓
   Clic → Redirection /deals?destination=CODE
```

**Fichiers impliqués**:
- `app/destinations/page.tsx` - Page recherche
- `lib/destinations.ts` - Moteur de recherche

---

## 📝 Ajouter une Nouvelle Destination

### Méthode 1: Modifier le fichier

**Fichier**: `lib/destinations.ts`

Ajouter dans le tableau `DESTINATIONS`:

```typescript
{
  code: 'CODE',  // 3 lettres majuscules
  city: 'Ville',
  country: 'Pays',
  continent: 'Continent',  // Europe, Asie, Amérique du Nord, etc.
  imageUrl: 'https://images.unsplash.com/photo-XXXXX?w=800&auto=format&fit=crop',
  description: 'Description courte'
}
```

**Trouver une image Unsplash**:
1. Aller sur https://unsplash.com
2. Chercher la destination (ex: "bali beach")
3. Clic droit sur l'image → Copier l'adresse de l'image
4. Ajouter `?w=800&auto=format&fit=crop` à la fin

### Méthode 2: Via script automatisé

Créer un fichier `scripts/add-destination.ts`:

```typescript
import { DESTINATIONS } from '../lib/destinations'

const newDestination = {
  code: 'PAR',
  city: 'Paris',
  country: 'France',
  continent: 'Europe',
  imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop',
  description: 'Tour Eiffel, Louvre, romantisme'
}

// Ajouter au fichier destinations.ts
// ...puis regénérer
```

---

## 🚀 Workflows Complets

### Workflow 1: Ajouter un nouveau deal

1. **Admin se connecte** → http://localhost:3050/admin
2. **Onglet "Créer un deal"**
3. Remplir le formulaire:
   - Départ: Paris
   - Destination: Bali (ou chercher dans `lib/destinations.ts`)
   - Prix: 549€
   - Prix original: 890€
   - Dates: Juin - Septembre 2026
   - URL: Lien vers réservation
4. **Cliquer "Créer le deal"**
5. ✅ Deal automatiquement:
   - En BDD (table `Deal`)
   - Visible sur homepage
   - Prêt à être envoyé en alerte

### Workflow 2: User Premium crée une alerte

1. User se connecte → Dashboard
2. Section "Mes alertes destinations" (Premium uniquement)
3. Cliquer "+ Ajouter une alerte"
4. Sélectionner:
   - Départ: Paris
   - Destination: Bali (parmi les 40 destinations)
   - Date souhaitée: 01/06/2026
5. **Créer l'alerte**
6. ✅ Alerte sauvegardée (table `Destination`)
7. Quand deal Bali disponible → Notification SMS automatique

### Workflow 3: Rechercher une destination

1. User va sur http://localhost:3050/destinations
2. Tape "bali" dans la recherche
3. Ou filtre par continent "Asie"
4. Clic sur carte Bali
5. ✅ Redirigé vers deals disponibles pour Bali

---

## 🎨 Personnalisation des Images

### Remplacer une image de destination

**Option 1: Unsplash (gratuit)**
```
https://images.unsplash.com/photo-[ID]?w=800&auto=format&fit=crop
```

**Option 2: Upload local**
```
1. Mettre image dans /public/destinations/
2. Changer imageUrl: '/destinations/tokyo.jpg'
```

**Option 3: API Unsplash automatique**

Installer:
```bash
npm install unsplash-js
```

Créer `lib/unsplash.ts`:
```typescript
import { createApi } from 'unsplash-js'

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY || ''
})

export async function getDestinationImage(query: string) {
  const result = await unsplash.search.getPhotos({
    query,
    page: 1,
    perPage: 1
  })

  return result.response?.results[0]?.urls?.regular
}
```

---

## 📊 Statistiques et Rapports

### Voir le nombre d'utilisateurs par plan

Via Prisma Studio ou SQL direct:

```typescript
const stats = await prisma.subscription.groupBy({
  by: ['plan'],
  _count: true
})

// Résultat: { plan: 'free', _count: 150 }, { plan: 'premium', _count: 45 }
```

### Deals les plus populaires

```typescript
const popularDeals = await prisma.alert.groupBy({
  by: ['dealId'],
  _count: {
    id: true
  },
  orderBy: {
    _count: {
      id: 'desc'
    }
  },
  take: 10
})
```

---

## 🔐 Sécurité BDD

### Passwords

✅ **Hashés avec bcrypt**
```typescript
import bcrypt from 'bcryptjs'

const hashedPassword = await bcrypt.hash(password, 10)
```

❌ **Jamais en clair dans la BDD**

### Accès API

Protéger les routes sensibles:

```typescript
// Exemple: Vérifier si admin
const isAdmin = (req) => {
  const auth = req.headers.get('authorization')
  return auth === process.env.ADMIN_SECRET
}
```

---

## 🎯 Résumé

**Le système est maintenant**:
- ✅ 100% dynamique (BDD Prisma)
- ✅ 40 destinations avec images
- ✅ Moteur de recherche puissant
- ✅ Interface admin complète
- ✅ Mode dark uniquement
- ✅ Navbar flottante et transparente
- ✅ Prêt pour la production

**Pour gérer**:
- Interface admin: http://localhost:3050/admin (mot de passe: admin123)
- Prisma Studio: `npx prisma studio`
- Fichiers de config: `prisma/schema.prisma` et `lib/destinations.ts`

**Tout est connecté et automatisé!** 🚀
