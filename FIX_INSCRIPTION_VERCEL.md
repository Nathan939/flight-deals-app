# 🚨 FIX URGENT : Inscription ne fonctionne pas sur Vercel

## 🔍 Diagnostic

**Symptôme** : Erreur 500 lors de l'inscription sur https://flight-deals-phi.vercel.app/signup

**Cause** : La base de données PostgreSQL n'existe pas encore sur Vercel. Le code essaie d'insérer des données dans une base qui n'existe pas.

**Solution** : Créer la base PostgreSQL sur Vercel (5 minutes)

---

## ✅ Solution en 3 Étapes (5 minutes)

### Étape 1 : Créer la Base PostgreSQL

1. **Allez sur Vercel Dashboard**
   - URL : https://vercel.com/dashboard
   - Connectez-vous si nécessaire

2. **Sélectionnez votre projet**
   - Cliquez sur `flight-deals-phi` (ou le nom de votre projet)

3. **Allez dans Storage**
   - En haut, cliquez sur l'onglet **"Storage"**

4. **Créez la base de données**
   - Cliquez sur le bouton **"Create Database"**
   - Sélectionnez **"Postgres"**
   - Donnez un nom : `flightalert-db` (ou laissez le défaut)
   - Région : **"Frankfurt, Germany (fra1)"** OU **"Paris, France"**
   - Cliquez sur **"Create"**

5. **Attendez la création**
   - Ça prend 30 secondes - 1 minute
   - Vercel va créer la base et les variables d'environnement automatiquement

✅ **Résultat** : Vercel a créé automatiquement ces variables :
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL` ← **Important !**
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`
- `POSTGRES_HOST`

---

### Étape 2 : Vérifier les Variables d'Environnement

1. **Allez dans Settings**
   - En haut, cliquez sur **"Settings"**

2. **Allez dans Environment Variables**
   - Dans le menu de gauche, cliquez sur **"Environment Variables"**

3. **Vérifiez DATABASE_URL**
   - Cherchez la variable `DATABASE_URL`
   - Elle doit pointer vers `POSTGRES_PRISMA_URL`

   **Si DATABASE_URL n'existe pas, créez-la :**
   - Cliquez sur **"Add New"**
   - Key : `DATABASE_URL`
   - Value : Copiez la valeur de `POSTGRES_PRISMA_URL` (commence par `postgresql://`)
   - Sélectionnez les 3 environnements :
     - ✅ Production
     - ✅ Preview
     - ✅ Development
   - Cliquez sur **"Save"**

4. **Ajoutez les variables manquantes obligatoires**

   Cliquez sur **"Add New"** pour chaque variable :

   **NEXTAUTH_SECRET** (générez un secret aléatoire)
   ```bash
   # Sur votre terminal, générez un secret :
   openssl rand -base64 32
   ```
   - Key : `NEXTAUTH_SECRET`
   - Value : Collez le résultat de la commande ci-dessus
   - Environnements : ✅ Production, Preview, Development

   **NEXTAUTH_URL**
   - Key : `NEXTAUTH_URL`
   - Value : `https://flight-deals-phi.vercel.app`
   - Environnements : ✅ Production

   **KIWI_API_KEY** (vous l'avez déjà)
   - Key : `KIWI_API_KEY`
   - Value : Votre clé Kiwi.com
   - Environnements : ✅ Production, Preview, Development

   **ADMIN_PASSWORD**
   - Key : `ADMIN_PASSWORD`
   - Value : Choisissez un mot de passe admin sécurisé
   - Environnements : ✅ Production, Preview, Development

   **NEXT_PUBLIC_ADMIN_PASSWORD**
   - Key : `NEXT_PUBLIC_ADMIN_PASSWORD`
   - Value : Le même mot de passe que ci-dessus
   - Environnements : ✅ Production, Preview, Development

---

### Étape 3 : Migrer la Base de Données

Maintenant que la base existe, il faut créer les tables.

**Option A : Via Vercel CLI (Recommandé)**

Dans votre terminal local :

```bash
# 1. Installer Vercel CLI (si pas déjà fait)
npm install -g vercel

# 2. Se connecter à Vercel
vercel login

# 3. Lier le projet
vercel link

# 4. Télécharger les variables d'environnement
vercel env pull .env.production.local

# 5. Migrer la base de données
npx prisma db push

# 6. Vérifier que ça a marché
npx prisma studio
# Cela ouvre une interface pour voir votre base de données
```

**Option B : Via un script de migration (Alternative)**

Créez un fichier temporaire sur Vercel :

1. Dans votre projet local, créez `scripts/migrate.ts` :

```typescript
// scripts/migrate.ts
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function migrate() {
  console.log('🚀 Starting migration...');
  try {
    const { stdout, stderr } = await execAsync('npx prisma db push --accept-data-loss');
    console.log('✅ Migration successful!');
    console.log(stdout);
    if (stderr) console.error(stderr);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
```

2. Ajoutez dans `package.json` :

```json
{
  "scripts": {
    "migrate": "ts-node scripts/migrate.ts"
  }
}
```

3. Exécutez :

```bash
npm run migrate
```

---

## 🧪 Test de Validation

### 1. Redéployer le projet

Vercel devrait automatiquement redéployer après avoir ajouté les variables.

Si ce n'est pas le cas :

```bash
# Forcer un redéploiement
git commit --allow-empty -m "chore: trigger redeploy"
git push origin main
```

Ou sur le dashboard Vercel :
- Deployments > ... > Redeploy

### 2. Attendre le déploiement

- Allez dans **Deployments**
- Attendez que le statut soit "Ready" (2-3 minutes)

### 3. Tester l'inscription

1. Allez sur : **https://flight-deals-phi.vercel.app/signup**
2. Remplissez le formulaire :
   - Email : test@example.com
   - Mot de passe : password123
   - Nom (optionnel)
3. Cliquez sur **"S'inscrire gratuitement"**

✅ **Ça devrait fonctionner !**

---

## 🔍 Si ça ne fonctionne toujours pas

### Vérifier les logs d'erreur

1. Sur Vercel Dashboard > Deployments
2. Cliquez sur le dernier déploiement
3. Cliquez sur **"View Function Logs"**
4. Cherchez les erreurs de `/api/auth/signup`

Les erreurs courantes :

**Erreur : "Table does not exist"**
```
Invalid `prisma.user.create()` invocation:
The table `public.User` does not exist in the current database.
```

**Solution** : La migration n'a pas été faite. Répétez l'Étape 3.

**Erreur : "Invalid DATABASE_URL"**
```
Error: P1001: Can't reach database server
```

**Solution** : DATABASE_URL est mal configuré. Vérifiez qu'il pointe vers `POSTGRES_PRISMA_URL`.

**Erreur : "NEXTAUTH_SECRET is not defined"**
```
Error: NEXTAUTH_SECRET environment variable is not set
```

**Solution** : Ajoutez `NEXTAUTH_SECRET` dans les variables d'environnement Vercel.

---

## 🐛 Dépannage Avancé

### Vérifier la connexion à la base

Créez un endpoint de test : `app/api/test-db/route.ts`

```typescript
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Essayer de compter les utilisateurs
    const count = await prisma.user.count()

    return NextResponse.json({
      success: true,
      message: 'Database connection OK',
      userCount: count,
      database: process.env.DATABASE_URL?.split('@')[1]?.split('/')[0] || 'unknown'
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code
    }, { status: 500 })
  }
}
```

Puis testez : https://flight-deals-phi.vercel.app/api/test-db

Si ça retourne `success: true`, la base est connectée.

### Réinitialiser complètement

Si vraiment rien ne fonctionne :

1. Sur Vercel, allez dans Storage
2. Supprimez la base PostgreSQL
3. Recréez-la
4. Refaites les Étapes 1, 2, 3

---

## ✅ Checklist Complète

- [ ] Base PostgreSQL créée sur Vercel (Storage)
- [ ] Variable `DATABASE_URL` configurée
- [ ] Variable `NEXTAUTH_SECRET` générée et ajoutée
- [ ] Variable `NEXTAUTH_URL` ajoutée
- [ ] Variable `KIWI_API_KEY` ajoutée
- [ ] Variables `ADMIN_PASSWORD` ajoutées
- [ ] Base de données migrée (`npx prisma db push`)
- [ ] Projet redéployé sur Vercel
- [ ] Inscription testée et fonctionnelle

---

## 📞 Besoin d'Aide ?

Si vous êtes toujours bloqué après avoir suivi toutes ces étapes :

1. **Copiez l'erreur exacte** des logs Vercel
2. **Vérifiez** que toutes les variables d'environnement sont bien configurées
3. **Testez** la connexion avec l'endpoint `/api/test-db`

---

## 🎯 Résumé : Les 3 Actions Critiques

1. **Créer la base PostgreSQL** sur Vercel (Storage > Create Database)
2. **Ajouter les variables d'environnement** (Settings > Environment Variables)
3. **Migrer la base** (`vercel link` puis `npx prisma db push`)

**Temps total : 5-10 minutes**

Après ça, l'inscription fonctionnera ! 🎉
