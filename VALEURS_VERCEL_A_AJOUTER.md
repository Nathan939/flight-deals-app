# 📋 Valeurs à Ajouter sur Vercel

## 🎯 Variables d'Environnement Obligatoires

Allez sur : **https://vercel.com/dashboard** > Votre projet > **Settings** > **Environment Variables**

Cliquez sur **"Add New"** pour chaque variable ci-dessous :

---

### 1️⃣ DATABASE_URL

```
Key: DATABASE_URL
Value: [Copiez POSTGRES_PRISMA_URL depuis l'onglet Storage]
Environments: ✅ Production ✅ Preview ✅ Development
```

**Comment obtenir la valeur :**
1. Allez dans **Storage**
2. Cliquez sur votre base PostgreSQL
3. Copiez la valeur de **POSTGRES_PRISMA_URL**
4. Collez-la dans DATABASE_URL

---

### 2️⃣ NEXTAUTH_SECRET

```
Key: NEXTAUTH_SECRET
Value: [Voir ci-dessous - GÉNÉREZ MAINTENANT]
Environments: ✅ Production ✅ Preview ✅ Development
```

**Générer la valeur maintenant :**

Sur votre terminal, exécutez :
```bash
openssl rand -base64 32
```

**OU utilisez cette valeur générée :**
```
akBe/JprNz/rjx/ziLqYOUwhkN81cpjP+emN5ZFYLoQ=
```

---

### 3️⃣ NEXTAUTH_URL

```
Key: NEXTAUTH_URL
Value: https://flight-deals-phi.vercel.app
Environments: ✅ Production UNIQUEMENT
```

---

### 4️⃣ KIWI_API_KEY

```
Key: KIWI_API_KEY
Value: [Votre clé Kiwi.com que vous avez déjà]
Environments: ✅ Production ✅ Preview ✅ Development
```

---

### 5️⃣ ADMIN_PASSWORD

```
Key: ADMIN_PASSWORD
Value: [Créez un mot de passe sécurisé - voir suggestion ci-dessous]
Environments: ✅ Production ✅ Preview ✅ Development
```

**Suggestion de mot de passe sécurisé :**
```
bTEoo1vsufsG8bQiUg2PXtwGjOJpuA+d
```

**OU créez le vôtre :**
```bash
openssl rand -base64 24
```

---

### 6️⃣ NEXT_PUBLIC_ADMIN_PASSWORD

```
Key: NEXT_PUBLIC_ADMIN_PASSWORD
Value: [LE MÊME mot de passe que ADMIN_PASSWORD ci-dessus]
Environments: ✅ Production ✅ Preview ✅ Development
```

---

## ✅ Vérification

Après avoir ajouté toutes les variables, vous devriez avoir **6 variables** au minimum :

- ✅ DATABASE_URL
- ✅ NEXTAUTH_SECRET
- ✅ NEXTAUTH_URL
- ✅ KIWI_API_KEY
- ✅ ADMIN_PASSWORD
- ✅ NEXT_PUBLIC_ADMIN_PASSWORD

---

## 🔄 Variables Optionnelles (À ajouter plus tard)

Ces variables sont pour les fonctionnalités avancées. Vous pouvez les ajouter après :

### EMAIL_API_KEY (Brevo - pour les emails)
```
Key: EMAIL_API_KEY
Value: [À obtenir sur https://app.brevo.com]
Environments: ✅ Production ✅ Preview ✅ Development
```

### EMAIL_FROM
```
Key: EMAIL_FROM
Value: noreply@flightalert.fr
Environments: ✅ Production ✅ Preview ✅ Development
```

### TWILIO_ACCOUNT_SID (pour SMS Premium)
```
Key: TWILIO_ACCOUNT_SID
Value: [À obtenir sur https://www.twilio.com]
Environments: ✅ Production ✅ Preview ✅ Development
```

### TWILIO_AUTH_TOKEN
```
Key: TWILIO_AUTH_TOKEN
Value: [À obtenir sur Twilio]
Environments: ✅ Production ✅ Preview ✅ Development
```

### TWILIO_PHONE_NUMBER
```
Key: TWILIO_PHONE_NUMBER
Value: +33XXXXXXXXX
Environments: ✅ Production ✅ Preview ✅ Development
```

### STRIPE_SECRET_KEY (pour les paiements)
```
Key: STRIPE_SECRET_KEY
Value: [À obtenir sur https://dashboard.stripe.com]
Environments: ✅ Production ✅ Preview ✅ Development
```

### STRIPE_PUBLISHABLE_KEY
```
Key: STRIPE_PUBLISHABLE_KEY
Value: [À obtenir sur Stripe]
Environments: ✅ Production ✅ Preview ✅ Development
```

### STRIPE_WEBHOOK_SECRET
```
Key: STRIPE_WEBHOOK_SECRET
Value: [À obtenir après création du webhook Stripe]
Environments: ✅ Production
```

### STRIPE_PRICE_ID_MONTHLY
```
Key: STRIPE_PRICE_ID_MONTHLY
Value: [À obtenir après création du produit Stripe]
Environments: ✅ Production ✅ Preview ✅ Development
```

---

## 📖 Documentation

Pour obtenir ces clés API optionnelles, consultez :
- **ACTIONS_UTILISATEUR_REQUISES.md**
- **GUIDE_DEPLOIEMENT_COMPLET.md**

---

## 🎯 Résumé

**Obligatoire maintenant (6 variables) :**
1. DATABASE_URL
2. NEXTAUTH_SECRET
3. NEXTAUTH_URL
4. KIWI_API_KEY
5. ADMIN_PASSWORD
6. NEXT_PUBLIC_ADMIN_PASSWORD

**Optionnel plus tard :**
- EMAIL_API_KEY, EMAIL_FROM (pour emails)
- TWILIO_* (pour SMS)
- STRIPE_* (pour paiements)

Bon courage ! 🚀
