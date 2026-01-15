# 🔧 Configuration Vercel Production

Votre site : **https://flight-deals-phi.vercel.app**

## ⚠️ Problème Actuel

L'inscription ne fonctionne pas en production car :
- La base de données PostgreSQL n'est pas encore créée sur Vercel
- Les variables d'environnement ne sont pas configurées

---

## 📋 Étapes de Configuration (15 minutes)

### Étape 1 : Créer la Base PostgreSQL sur Vercel

1. Allez sur https://vercel.com/dashboard
2. Sélectionnez votre projet **flight-deals-phi**
3. Cliquez sur l'onglet **Storage**
4. Cliquez sur **Create Database**
5. Sélectionnez **Postgres**
6. Région : Choisissez **Frankfurt** (Europe)
7. Nom : `flightalert-db` (ou laissez le défaut)
8. Cliquez sur **Create**

✅ Vercel va automatiquement créer ces variables :
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL` ← Important !
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`
- `POSTGRES_HOST`

---

### Étape 2 : Changer le Provider Prisma en PostgreSQL

**Sur votre machine locale :**

Ouvrez `prisma/schema.prisma` et changez :

```prisma
datasource db {
  provider = "postgresql"  // Changé de "sqlite" à "postgresql"
  url      = env("DATABASE_URL")
}
```

---

### Étape 3 : Ajouter les Variables d'Environnement sur Vercel

1. Dans votre projet Vercel, allez dans **Settings** > **Environment Variables**
2. Ajoutez ces variables **une par une** :

#### Variables Obligatoires

```env
# Base de données (automatiquement ajouté par Postgres)
DATABASE_URL = <copiez POSTGRES_PRISMA_URL depuis Storage>

# Authentification (générez un secret aléatoire)
NEXTAUTH_SECRET = <générez avec: openssl rand -base64 32>
NEXTAUTH_URL = https://flight-deals-phi.vercel.app

# Kiwi.com (vous l'avez déjà)
KIWI_API_KEY = votre_clé_kiwi

# Admin
ADMIN_PASSWORD = votre_mot_de_passe_admin_sécurisé
NEXT_PUBLIC_ADMIN_PASSWORD = votre_mot_de_passe_admin_sécurisé
```

#### Variables Optionnelles (à ajouter quand vous aurez les clés)

```env
# Brevo (Emails) - À obtenir sur https://app.brevo.com
EMAIL_API_KEY = votre_clé_brevo
EMAIL_FROM = noreply@flightalert.fr

# Twilio (SMS Premium) - À obtenir sur https://www.twilio.com
TWILIO_ACCOUNT_SID = ACxxxxxxxxx
TWILIO_AUTH_TOKEN = votre_token
TWILIO_PHONE_NUMBER = +33XXXXXXXXX

# Stripe (Paiements) - À obtenir sur https://dashboard.stripe.com
STRIPE_SECRET_KEY = sk_live_xxxxx
STRIPE_PUBLISHABLE_KEY = pk_live_xxxxx
STRIPE_WEBHOOK_SECRET = whsec_xxxxx
STRIPE_PRICE_ID_MONTHLY = price_xxxxx
```

**Important** : Pour chaque variable, sélectionnez les 3 environnements :
- ✅ Production
- ✅ Preview
- ✅ Development

---

### Étape 4 : Générer un Secret NextAuth

Sur votre terminal local :

```bash
openssl rand -base64 32
```

Copiez le résultat et utilisez-le pour `NEXTAUTH_SECRET` sur Vercel.

---

### Étape 5 : Commiter le Changement Prisma

```bash
# Changer le provider dans prisma/schema.prisma de "sqlite" à "postgresql"

# Commiter
git add prisma/schema.prisma
git commit -m "fix: Change Prisma provider to PostgreSQL for production"
git push origin main
```

Vercel va automatiquement redéployer.

---

### Étape 6 : Migrer la Base de Données

**Option A : Via le Terminal Vercel (Recommandé)**

1. Sur Vercel, allez dans votre projet
2. Cliquez sur **Settings** > **General**
3. Trouvez votre **Project ID**
4. Dans votre terminal local :

```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter
vercel login

# Lier le projet
vercel link

# Migrer la base
vercel env pull .env.production.local
npx prisma db push
```

**Option B : Via un Script de Migration**

Créez un fichier `migrate-production.js` :

```javascript
const { exec } = require('child_process');

console.log('🚀 Migration de la base de données production...');

exec('npx prisma db push', (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Erreur:', error);
    return;
  }
  console.log('✅ Migration réussie !');
  console.log(stdout);
});
```

Puis dans `package.json`, ajoutez :

```json
{
  "scripts": {
    "migrate:prod": "node migrate-production.js"
  }
}
```

---

### Étape 7 : Vérifier le Déploiement

1. Attendez que Vercel finisse de redéployer (2-3 minutes)
2. Allez sur : https://flight-deals-phi.vercel.app/signup
3. Essayez de créer un compte

✅ **Ça devrait fonctionner !**

---

## 🔍 Vérifier les Logs

Si ça ne fonctionne pas :

1. Sur Vercel, allez dans **Deployments**
2. Cliquez sur le dernier déploiement
3. Cliquez sur **View Function Logs**
4. Cherchez les erreurs dans `/api/auth/signup`

Ou en CLI :

```bash
vercel logs
```

---

## 🐛 Dépannage

### Erreur : "Table does not exist"

La base n'a pas été migrée. Répétez l'Étape 6.

### Erreur : "Invalid DATABASE_URL"

Vérifiez que vous utilisez `POSTGRES_PRISMA_URL` (avec pooling) et non `POSTGRES_URL`.

### Erreur : "Cannot connect to database"

1. Vérifiez que la base PostgreSQL est bien créée dans Storage
2. Vérifiez que `DATABASE_URL` pointe vers `POSTGRES_PRISMA_URL`
3. Essayez de redéployer : `vercel --prod`

---

## 📊 État Actuel vs État Cible

| Élément | Local | Production |
|---------|-------|------------|
| Base de données | ✅ SQLite | ⏳ PostgreSQL (à créer) |
| Provider Prisma | ✅ sqlite | ⏳ postgresql (à changer) |
| Variables ENV | ✅ .env | ⏳ À configurer sur Vercel |
| Inscription | ✅ Fonctionne | ⏳ En attente de config |

---

## ✅ Checklist de Configuration

- [ ] Base PostgreSQL créée sur Vercel
- [ ] Provider Prisma changé à "postgresql"
- [ ] Variables d'environnement ajoutées sur Vercel
- [ ] NEXTAUTH_SECRET généré
- [ ] Code committé et pushé
- [ ] Vercel a redéployé
- [ ] Base de données migrée (`npx prisma db push`)
- [ ] Inscription testée et fonctionnelle

---

## 🎯 Pour Travailler à Deux

Puisque vous travaillez avec un copain via GitHub :

### Configuration Git

```bash
# Ajouter le copain en collaborateur sur GitHub
# Settings > Collaborators > Add people

# Il devra cloner le repo
git clone https://github.com/votre-username/flight-deals.git
cd flight-deals
npm install

# Créer son .env local
cp .env.example .env
# Puis configurer DATABASE_URL="file:./dev.db"

# Initialiser sa base locale
npx prisma db push
npm run dev
```

### Workflow de Développement

```bash
# Avant de coder
git pull origin main

# Après avoir codé
git add .
git commit -m "feat: description"
git push origin main
```

Vercel redéploiera automatiquement à chaque push sur `main`.

### Branches pour Fonctionnalités

```bash
# Créer une branche pour une nouvelle feature
git checkout -b feature/nom-feature

# Pousser la branche
git push origin feature/nom-feature

# Créer une Pull Request sur GitHub
# Vercel créera un déploiement de preview automatiquement
```

---

## 🚀 Prochaines Étapes

1. **Maintenant** : Configurez PostgreSQL sur Vercel
2. **Ensuite** : Obtenez les clés API (Brevo, Twilio, Stripe)
3. **Puis** : Configurez le nom de domaine flightalert.fr
4. **Enfin** : Testez tout et lancez !

---

## 📞 Support

- **Vercel Docs** : https://vercel.com/docs/storage/vercel-postgres
- **Prisma Docs** : https://www.prisma.io/docs
- **GitHub Collaboration** : https://docs.github.com/en/pull-requests

Bon déploiement ! 🎉
