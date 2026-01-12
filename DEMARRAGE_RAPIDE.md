# 🚀 Démarrage rapide

## Installation et lancement en 3 commandes

```bash
# 1. Installer les dépendances
npm install

# 2. Initialiser la base de données
npm run prisma:generate && npm run prisma:push

# 3. Lancer le projet
npm run dev
```

Le site sera accessible sur **http://localhost:3000**

## ✅ Le projet fonctionne immédiatement

Le fichier `.env` est déjà configuré avec des valeurs par défaut pour le développement local.

### Ce qui fonctionne sans configuration:
- ✅ Toutes les pages du site
- ✅ Navigation complète
- ✅ Design et responsive
- ✅ Formulaires d'inscription/connexion
- ✅ Dashboard utilisateur
- ✅ Page admin (mot de passe: `admin123`)

### Ce qui nécessite vos clés API (optionnel pour tester):
- ⏳ Paiements Stripe
- ⏳ Envoi d'emails
- ⏳ Envoi de SMS

## 🔑 Configurer les clés API (après avoir testé)

### 1. Stripe
```env
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_PRICE_ID_MONTHLY=price_xxx
```

### 2. Email (Brevo)
```env
EMAIL_API_KEY=xkeysib-xxx
EMAIL_FROM=noreply@votredomaine.com
```

### 3. SMS (Twilio)
```env
TWILIO_ACCOUNT_SID=ACxxx
TWILIO_AUTH_TOKEN=xxx
TWILIO_PHONE_NUMBER=+33xxx
```

Puis décommentez le code dans `lib/email.ts` et `lib/sms.ts`.

## 📱 Tester le site

1. **Landing page**: http://localhost:3000
2. **Inscription**: http://localhost:3000/signup
3. **Dashboard**: http://localhost:3000/dashboard
4. **Admin**: http://localhost:3000/admin (mot de passe: admin123)

## 🎨 Ouvrir dans VS Code

```bash
cd flight-deals-alerts
code .
```

Bon développement! 🚀
