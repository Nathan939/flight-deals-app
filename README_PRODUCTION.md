# ✈️ FlightAlert - Guide de Production

🌐 **Production** : https://flight-deals-phi.vercel.app
🎯 **Domaine final** : www.flightalert.fr

---

## ⚠️ URGENT : Configuration Requise

L'inscription ne fonctionne pas encore en production car la base de données PostgreSQL n'est pas configurée sur Vercel.

### 📋 Étapes Critiques (15 minutes)

1. **Créer la base PostgreSQL sur Vercel**
   - Allez sur : https://vercel.com/dashboard
   - Sélectionnez votre projet
   - Storage > Create Database > Postgres
   - Région : Frankfurt

2. **Migrer la base de données**
   ```bash
   vercel link
   vercel env pull .env.production.local
   npx prisma db push
   ```

3. **Ajouter les variables d'environnement**
   ```env
   DATABASE_URL = <copiez POSTGRES_PRISMA_URL>
   NEXTAUTH_SECRET = <générez avec: openssl rand -base64 32>
   NEXTAUTH_URL = https://flight-deals-phi.vercel.app
   KIWI_API_KEY = votre_clé_kiwi
   ADMIN_PASSWORD = votre_password_admin
   ```

4. **Push et déployer**
   ```bash
   git push origin main
   ```

**Guide complet** : [CONFIGURATION_VERCEL_PRODUCTION.md](CONFIGURATION_VERCEL_PRODUCTION.md)

---

## 👥 Pour Travailler à Deux

### Configuration Git

```bash
# Ajouter le collaborateur sur GitHub :
# Settings > Collaborators > Add people

# Le collaborateur clone :
git clone <votre-repo>
npm install
cp .env.example .env
# Configurer DATABASE_URL="file:./dev.db"
npx prisma db push
npm run dev
```

### Workflow

```bash
# Avant de coder
git pull origin main

# Créer une branche
git checkout -b feature/nom-feature

# Après avoir codé
git add .
git commit -m "feat: description"
git push origin feature/nom-feature

# Créer une Pull Request sur GitHub
```

Vercel déploiera automatiquement chaque push sur `main`.

---

## 📚 Documentation Complète

- **[CONFIGURATION_VERCEL_PRODUCTION.md](CONFIGURATION_VERCEL_PRODUCTION.md)** - 🔥 À faire en premier
- **[DEMARRAGE_RAPIDE_LOCAL.md](DEMARRAGE_RAPIDE_LOCAL.md)** - Développement local
- **[GUIDE_DEPLOIEMENT_COMPLET.md](GUIDE_DEPLOIEMENT_COMPLET.md)** - Déploiement détaillé
- **[ACTIONS_UTILISATEUR_REQUISES.md](ACTIONS_UTILISATEUR_REQUISES.md)** - Clés API à obtenir

---

## ✅ Checklist

- [ ] Base PostgreSQL créée sur Vercel
- [ ] Variables d'environnement configurées
- [ ] Database migrée
- [ ] Inscription testée sur https://flight-deals-phi.vercel.app/signup
- [ ] Clés API obtenues (Brevo, Twilio, Stripe)
- [ ] Domaine flightalert.fr configuré

---

Bon déploiement ! 🚀
