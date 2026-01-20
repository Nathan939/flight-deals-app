# 🚀 Guide de Déploiement Vercel - flightalert.fr

## 📋 Checklist Pré-Déploiement

Avant de commencer, assurez-vous d'avoir :
- [x] Compte Vercel actif
- [x] Domaine OVH : **flightalert.fr**
- [x] Twilio SMS configuré et fonctionnel
- [x] Code poussé sur Git (GitHub/GitLab)

---

## Étape 1 : Préparer le Projet pour Vercel

### 1.1 Créer un fichier `vercel.json`

Le fichier existe peut-être déjà, vérifions son contenu optimal :

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["cdg1"]
}
```

### 1.2 Vérifier `.gitignore`

Assurez-vous que ces fichiers sont ignorés :

```
.env
.env.local
node_modules/
.next/
*.db
*.db-journal
```

---

## Étape 2 : Créer une Base de Données PostgreSQL sur Vercel

### 2.1 Dans Vercel Dashboard

1. Allez sur [https://vercel.com/](https://vercel.com/)
2. Cliquez sur **Storage** (menu de gauche)
3. Cliquez sur **Create Database**
4. Sélectionnez **Postgres**
5. Configuration :
   - **Database Name** : `flightalert-production`
   - **Region** : Europe (Paris) - `cdg1`
   - **Plan** : Hobby (Gratuit pour commencer)
6. Cliquez sur **Create**

### 2.2 Récupérer l'URL de Connexion

1. Dans votre nouvelle base de données, allez sur l'onglet **.env.local**
2. Copiez la valeur de `POSTGRES_PRISMA_URL`
3. Format : `postgresql://user:password@host/database?sslmode=require`

---

## Étape 3 : Déployer l'Application sur Vercel

### 3.1 Créer un Nouveau Projet

#### Option A : Via l'Interface Web (Recommandé)

1. Allez sur [https://vercel.com/new](https://vercel.com/new)
2. **Import Git Repository** :
   - Sélectionnez votre repository GitHub/GitLab
   - Si pas encore connecté, autorisez Vercel à accéder à GitHub
3. **Configure Project** :
   - **Project Name** : `flightalert`
   - **Framework Preset** : Next.js (détecté automatiquement)
   - **Root Directory** : `./` (racine)
   - **Build Command** : `npm run build` (par défaut)
   - **Output Directory** : `.next` (par défaut)

#### Option B : Via CLI

```bash
npm install -g vercel
cd "/Users/nathanmartinelli/Desktop/les vols de sylvain"
vercel
```

### 3.2 Configurer les Variables d'Environnement

**IMPORTANT** : Avant de déployer, ajoutez ces variables d'environnement dans Vercel :

1. Dans Vercel Dashboard, allez sur votre projet
2. **Settings** > **Environment Variables**
3. Ajoutez **TOUTES** ces variables :

```bash
# Database (IMPORTANT: PostgreSQL, pas SQLite !)
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# Auth
NEXTAUTH_SECRET=votre_secret_super_long_et_aleatoire_ici_changez_moi
NEXTAUTH_URL=https://www.flightalert.fr

# Twilio SMS
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_PHONE_NUMBER=+15104910296

# Email
EMAIL_FROM=noreply@flightalert.fr
EMAIL_FROM_NAME=FlightAlert

# Admin
ADMIN_PASSWORD=votre_mot_de_passe_admin_securise
NEXT_PUBLIC_ADMIN_PASSWORD=votre_mot_de_passe_admin_securise

# Kiwi.com API
KIWI_API_KEY=f809c440-eee0-11f0-a57a-479dec5ea4fd

# Stripe (si vous l'utilisez plus tard)
STRIPE_SECRET_KEY=sk_live_votre_cle_ici
STRIPE_PUBLISHABLE_KEY=pk_live_votre_cle_ici
STRIPE_WEBHOOK_SECRET=whsec_votre_secret_ici
STRIPE_PRICE_ID_MONTHLY=price_votre_id_ici
```

**Important** :
- Pour chaque variable, cochez **Production**, **Preview**, et **Development**
- Changez `NEXTAUTH_SECRET` par une chaîne aléatoire longue
- Changez `ADMIN_PASSWORD` par un mot de passe sécurisé

### 3.3 Déployer

1. Cliquez sur **Deploy** (si interface web)
2. OU lancez `vercel --prod` (si CLI)
3. Attendez la fin du build (2-5 minutes)

---

## Étape 4 : Initialiser la Base de Données PostgreSQL

### 4.1 Via le Terminal Vercel

Une fois déployé, vous devez initialiser votre base PostgreSQL :

1. Dans Vercel Dashboard, allez sur votre projet
2. **Settings** > **Functions** > Ou utilisez la CLI
3. Exécutez :

```bash
vercel env pull .env.production
npx prisma db push --skip-generate
```

**Ou** utilisez le script automatique que nous avons créé précédemment.

### 4.2 Vérifier la Base de Données

Dans Vercel Storage > Postgres > votre base > **Query** :

```sql
SELECT * FROM "User" LIMIT 1;
```

Si ça fonctionne, votre base est prête ! 🎉

---

## Étape 5 : Configurer le Domaine OVH

### 5.1 Dans Vercel

1. Allez sur votre projet Vercel
2. **Settings** > **Domains**
3. Ajoutez votre domaine : `flightalert.fr`
4. Ajoutez aussi : `www.flightalert.fr` (recommandé)

### 5.2 Vercel vous donnera des enregistrements DNS à ajouter :

**Type A** (pour flightalert.fr) :
```
Type: A
Nom: @
Valeur: 76.76.21.21
```

**Type CNAME** (pour www.flightalert.fr) :
```
Type: CNAME
Nom: www
Valeur: cname.vercel-dns.com
```

### 5.3 Configurer les DNS dans OVH

1. Connectez-vous à [https://www.ovh.com/manager/](https://www.ovh.com/manager/)
2. Allez sur **Web Cloud** > **Nom de domaine** > **flightalert.fr**
3. Cliquez sur **Zone DNS**
4. Ajoutez les enregistrements fournis par Vercel :

**Enregistrement 1 (domaine principal)** :
- Type : `A`
- Sous-domaine : (vide ou `@`)
- Cible : `76.76.21.21`
- TTL : 3600

**Enregistrement 2 (www)** :
- Type : `CNAME`
- Sous-domaine : `www`
- Cible : `cname.vercel-dns.com.` (avec le point final)
- TTL : 3600

5. Cliquez sur **Suivant** puis **Valider**

### 5.4 Attendre la Propagation DNS

- Délai : 30 minutes à 48 heures (généralement 1-2 heures)
- Vérifiez avec : [https://dnschecker.org/](https://dnschecker.org/)

---

## Étape 6 : Tester le Déploiement

### 6.1 Vérifications de Base

1. Accédez à : [https://www.flightalert.fr](https://www.flightalert.fr)
2. Page d'accueil s'affiche ✅
3. Testez l'inscription : [https://www.flightalert.fr/signup](https://www.flightalert.fr/signup)
4. Créez un compte de test
5. Vérifiez que vous recevez un SMS de bienvenue (si premium)

### 6.2 Vérifications Admin

1. Accédez à : [https://www.flightalert.fr/admin](https://www.flightalert.fr/admin)
2. Connectez-vous avec le mot de passe admin
3. Testez l'envoi d'un SMS de test vers votre numéro
4. Créez un deal de test
5. Envoyez-le à vos abonnés de test

### 6.3 Vérifications Techniques

- [ ] SSL/HTTPS actif (cadenas vert)
- [ ] Pas d'erreur 500 dans les logs Vercel
- [ ] API Kiwi.com fonctionne (recherche de vols)
- [ ] SMS Twilio fonctionne
- [ ] Base de données répond (création de compte)

---

## Étape 7 : Configuration Post-Déploiement

### 7.1 Mettre à Jour les URLs

Dans Vercel, mettez à jour :

```bash
NEXTAUTH_URL=https://www.flightalert.fr
```

Redéployez si nécessaire.

### 7.2 Configurer SendGrid pour les Emails

Suivez le guide [GUIDE_SENDGRID_EMAIL.md](GUIDE_SENDGRID_EMAIL.md) pour activer les emails.

Important : Dans SendGrid, vérifiez le domaine **flightalert.fr** avec les enregistrements DNS fournis.

### 7.3 Activer les Webhooks (si Stripe)

Si vous utilisez Stripe pour les paiements :

1. Dashboard Stripe > **Developers** > **Webhooks**
2. Ajoutez : `https://www.flightalert.fr/api/stripe/webhook`
3. Événements : `checkout.session.completed`, `customer.subscription.updated`, etc.

---

## Étape 8 : Monitoring et Maintenance

### 8.1 Logs Vercel

- Allez sur Vercel Dashboard > Votre projet > **Logs**
- Surveillez les erreurs après le déploiement

### 8.2 Métriques

- **Analytics** : Activez Vercel Analytics (gratuit)
- **Performance** : Surveillez le temps de réponse
- **Erreurs** : Configurez des alertes si des erreurs 500 surviennent

### 8.3 Sauvegardes

Vercel Postgres inclut des sauvegardes automatiques, mais pour plus de sécurité :

```bash
# Export régulier de la base
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```

---

## 🐛 Problèmes Courants et Solutions

### Erreur : "Failed to connect to database"

**Cause** : URL de base de données incorrecte ou non configurée

**Solution** :
1. Vérifiez `DATABASE_URL` dans les variables d'environnement Vercel
2. Assurez-vous d'utiliser `POSTGRES_PRISMA_URL` (pas `POSTGRES_URL`)
3. Redéployez : `vercel --prod`

---

### Erreur : "NEXTAUTH_URL mismatch"

**Cause** : L'URL dans `.env` ne correspond pas au domaine

**Solution** :
```bash
NEXTAUTH_URL=https://www.flightalert.fr
```
Redéployez.

---

### Erreur 500 sur l'inscription

**Cause** : Base de données non initialisée

**Solution** :
```bash
vercel env pull
npx prisma db push
```

---

### DNS ne résout pas

**Cause** : Propagation DNS en cours ou enregistrements incorrects

**Solution** :
1. Attendez 1-2 heures
2. Vérifiez les enregistrements dans OVH
3. Testez avec : `nslookup flightalert.fr`

---

## ✅ Checklist Finale de Déploiement

- [ ] Projet déployé sur Vercel
- [ ] Base de données PostgreSQL créée et initialisée
- [ ] Toutes les variables d'environnement configurées
- [ ] Domaine flightalert.fr configuré dans Vercel
- [ ] DNS OVH pointés vers Vercel
- [ ] HTTPS actif (certificat SSL)
- [ ] Inscription fonctionne
- [ ] SMS Twilio fonctionne
- [ ] Recherche de vols fonctionne
- [ ] Admin accessible et fonctionnel
- [ ] Logs Vercel vérifiés (pas d'erreur)

---

## 🎉 Félicitations !

Votre application **FlightAlert** est maintenant en production sur **www.flightalert.fr** ! 🚀

Prochaines étapes :
1. Configurer SendGrid pour les emails (optionnel)
2. Enrichir la base de données avec des deals
3. Promouvoir votre site !

---

## 📞 Support

- **Vercel Support** : [https://vercel.com/support](https://vercel.com/support)
- **OVH Support** : [https://help.ovhcloud.com/](https://help.ovhcloud.com/)
- **Documentation Next.js** : [https://nextjs.org/docs](https://nextjs.org/docs)
