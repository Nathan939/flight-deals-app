# 🚀 Guide Visuel Rapide - Fix Inscription Vercel

## ⏰ 5 Minutes pour Réparer

---

## 📍 ÉTAPE 1 : Créer la Base PostgreSQL (2 min)

```
1. Allez sur : https://vercel.com/dashboard
2. Cliquez sur : flight-deals-phi
3. Cliquez sur : Storage (en haut)
4. Cliquez sur : Create Database
5. Sélectionnez : Postgres
6. Nom : flightalert-db
7. Région : Frankfurt
8. Cliquez sur : Create
```

✅ **Attendez 30 secondes** - La base est créée automatiquement

---

## 📍 ÉTAPE 2 : Ajouter les Variables (2 min)

```
1. Cliquez sur : Settings (en haut)
2. Cliquez sur : Environment Variables (menu gauche)
3. Ajoutez ces 5 variables :
```

### Variable 1 : DATABASE_URL

```
Key   : DATABASE_URL
Value : [Copiez POSTGRES_PRISMA_URL depuis Storage]
Envs  : ✅ Production ✅ Preview ✅ Development
```

### Variable 2 : NEXTAUTH_SECRET

Sur votre terminal :
```bash
openssl rand -base64 32
```

Puis sur Vercel :
```
Key   : NEXTAUTH_SECRET
Value : [Collez le résultat de la commande]
Envs  : ✅ Production ✅ Preview ✅ Development
```

### Variable 3 : NEXTAUTH_URL

```
Key   : NEXTAUTH_URL
Value : https://flight-deals-phi.vercel.app
Envs  : ✅ Production
```

### Variable 4 : KIWI_API_KEY

```
Key   : KIWI_API_KEY
Value : [Votre clé Kiwi.com]
Envs  : ✅ Production ✅ Preview ✅ Development
```

### Variable 5 : ADMIN_PASSWORD

```
Key   : ADMIN_PASSWORD
Value : [Créez un mot de passe sécurisé]
Envs  : ✅ Production ✅ Preview ✅ Development
```

### Variable 6 : NEXT_PUBLIC_ADMIN_PASSWORD

```
Key   : NEXT_PUBLIC_ADMIN_PASSWORD
Value : [Le même mot de passe que ci-dessus]
Envs  : ✅ Production ✅ Preview ✅ Development
```

---

## 📍 ÉTAPE 3 : Migrer la Base (1 min)

Dans votre terminal :

```bash
# Se connecter à Vercel
vercel login

# Lier le projet
vercel link

# Télécharger les variables
vercel env pull .env.production.local

# Migrer la base
npx prisma db push
```

Vous verrez :
```
✔ Generated Prisma Client
```

✅ **C'est fait !** Les tables sont créées.

---

## 🧪 TEST FINAL

1. Attendez 2 minutes (Vercel redéploie automatiquement)

2. Allez sur : **https://flight-deals-phi.vercel.app/signup**

3. Créez un compte :
   - Email : test@example.com
   - Password : password123

4. Cliquez sur **"S'inscrire gratuitement"**

✅ **ÇA MARCHE !** 🎉

---

## 🚨 Si ça ne marche toujours pas

### Vérification 1 : Les tables existent-elles ?

```bash
npx prisma studio
```

Vous devriez voir : User, Subscription, Destination, Deal, Alert

### Vérification 2 : Voir les logs d'erreur

```
Vercel Dashboard > Deployments > [Dernier déploiement] > View Function Logs
```

Cherchez l'erreur de `/api/auth/signup`

### Vérification 3 : Forcer un redéploiement

```bash
git commit --allow-empty -m "chore: redeploy"
git push origin main
```

---

## 📋 Checklist Rapide

- [ ] Base PostgreSQL créée (Storage)
- [ ] 6 variables d'environnement ajoutées (Settings)
- [ ] Base migrée (`npx prisma db push`)
- [ ] Vercel a redéployé (Deployments = Ready)
- [ ] Inscription testée = ✅

---

## 🎯 Résumé Ultra-Court

```bash
# 1. Sur Vercel : Storage > Create Database > Postgres

# 2. Sur Vercel : Settings > Environment Variables
#    Ajoutez : DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL,
#              KIWI_API_KEY, ADMIN_PASSWORD, NEXT_PUBLIC_ADMIN_PASSWORD

# 3. Terminal :
vercel link
vercel env pull .env.production.local
npx prisma db push

# 4. Testez :
#    https://flight-deals-phi.vercel.app/signup
```

**Temps total : 5 minutes** ⏰

Bon fix ! 🚀
