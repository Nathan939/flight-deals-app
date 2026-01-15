# ⚡ Actions Requises de Votre Part

## 🎯 Priorité 1 : Obtenir les Clés API (URGENT)

### 1. Brevo (Emails) - GRATUIT
**Temps estimé : 5 minutes**

1. Allez sur : https://app.brevo.com
2. Créez un compte gratuit
3. Confirmez votre email
4. Allez dans **Settings** (⚙️) > **API Keys**
5. Copiez votre clé API v3
6. **Gratuit jusqu'à 300 emails/jour** ✅

📝 **Conservez cette clé** : `EMAIL_API_KEY`

---

### 2. Twilio (SMS) - $15 CRÉDIT GRATUIT
**Temps estimé : 10 minutes**

1. Allez sur : https://www.twilio.com/try-twilio
2. Créez un compte (nécessite un numéro de téléphone)
3. Vérifiez votre email
4. Obtenez $15 de crédit gratuit
5. Allez dans **Console** > **Account Info**
   - Copiez `Account SID`
   - Copiez `Auth Token`
6. Allez dans **Phone Numbers** > **Buy a Number**
   - Choisissez un numéro français (+33) avec capacité SMS
   - Environ $1/mois

📝 **Conservez ces informations** :
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_NUMBER` (format: +33XXXXXXXXX)

---

### 3. Stripe (Paiements) - GRATUIT
**Temps estimé : 15 minutes**

1. Allez sur : https://dashboard.stripe.com/register
2. Créez un compte
3. **Mode Test (pour commencer)** :
   - Allez dans **Developers** > **API keys**
   - Copiez `Publishable key` (pk_test_...)
   - Copiez `Secret key` (sk_test_...)

4. **Créer un produit** :
   - Allez dans **Products** > **Add Product**
   - Nom : "FlightAlert Premium"
   - Description : "Alertes SMS illimitées"
   - Prix : 4€/mois
   - Copiez le `Price ID` (price_...)

5. **Plus tard (en production)** :
   - Activez votre compte Stripe (documents requis)
   - Utilisez les clés "Live" au lieu de "Test"

📝 **Conservez ces clés** :
- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY`
- `STRIPE_PRICE_ID_MONTHLY`

---

## 🎯 Priorité 2 : Compléter les Mentions Légales

### Informations à ajouter dans `/app/mentions-legales/page.tsx`

Remplacez les `[À compléter]` par :

```typescript
Forme juridique : [ex: Auto-entrepreneur, SAS, SARL...]
Capital social : [ex: 1000€ ou "N/A" si AE]
SIRET : [Vous l'obtiendrez après immatriculation]
Adresse du siège : [Votre adresse]
Téléphone : [Votre numéro]
Directeur de publication : [Votre nom]
```

**Note** : Si vous n'êtes pas encore immatriculé, vous pouvez lancer le site et compléter après.

---

## 🎯 Priorité 3 : Configurer le Domaine OVH

### Étapes sur OVH

1. Connectez-vous à https://www.ovh.com/manager/
2. Allez dans **Web Cloud** > **Noms de domaine**
3. Cliquez sur `flightalert.fr`
4. Allez dans **Zone DNS**
5. Cliquez sur **Ajouter une entrée**

**Ajoutez ces 2 enregistrements :**

#### Enregistrement 1 : www
```
Type : CNAME
Sous-domaine : www
Cible : cname.vercel-dns.com.
TTL : 3600
```

#### Enregistrement 2 : Domaine racine
```
Type : A
Sous-domaine : @ (ou laissez vide)
Adresse IPv4 : 76.76.21.21
TTL : 3600
```

6. **Sauvegardez** et attendez 1-2h pour la propagation

---

## 🎯 Priorité 4 : Déployer sur Vercel

### Étapes rapides

1. **Créer un compte Vercel** : https://vercel.com/signup
   - Connectez votre GitHub

2. **Importer le projet** :
   - Cliquez sur "New Project"
   - Sélectionnez votre repository GitHub
   - Vercel détecte automatiquement Next.js

3. **Ajouter les variables d'environnement** :
   - Avant de déployer, cliquez sur "Environment Variables"
   - Ajoutez TOUTES les clés API obtenues ci-dessus
   - (Voir le fichier `GUIDE_DEPLOIEMENT_COMPLET.md` pour la liste complète)

4. **Créer la base de données** :
   - Dans le projet Vercel, allez dans **Storage**
   - Cliquez sur **Create Database** > **Postgres**
   - Région : **Frankfurt** ou **Paris**
   - Vercel ajoute automatiquement `DATABASE_URL`

5. **Déployer** :
   - Cliquez sur "Deploy"
   - Attendez 2-3 minutes

6. **Migrer la base de données** :
   ```bash
   # Sur votre ordinateur
   npm install
   npx prisma db push
   ```

7. **Configurer le domaine sur Vercel** :
   - Settings > Domains
   - Ajoutez `www.flightalert.fr`
   - Ajoutez `flightalert.fr`
   - Configurez la redirection

---

## 📋 Checklist Complète

### Avant le lancement

- [ ] ✅ Clé API Kiwi.com (déjà obtenue)
- [ ] ⚠️ Clé API Brevo (emails)
- [ ] ⚠️ Clés API Twilio (SMS)
- [ ] ⚠️ Clés API Stripe (paiements)
- [ ] ⚠️ Compléter mentions légales
- [ ] ⚠️ Configurer DNS OVH
- [ ] ⚠️ Déployer sur Vercel
- [ ] ⚠️ Créer base de données Postgres
- [ ] ⚠️ Migrer le schéma Prisma
- [ ] ⚠️ Configurer webhook Stripe

### Tests après déploiement

- [ ] Page d'accueil fonctionne
- [ ] Inscription gratuite fonctionne
- [ ] Login fonctionne
- [ ] Recherche de vols fonctionne
- [ ] Ajout de destinations fonctionne
- [ ] Email de bienvenue reçu
- [ ] Admin panel accessible
- [ ] Test email depuis admin
- [ ] Test SMS depuis admin (si Premium)
- [ ] Paiement Stripe fonctionne
- [ ] Pages légales accessibles

---

## 🚀 Ordre Recommandé

### Jour 1 : Obtenir les API
1. Créer compte Brevo → Récupérer clé API (5 min)
2. Créer compte Twilio → Acheter numéro (15 min)
3. Créer compte Stripe → Créer produit (15 min)
4. Sauvegarder toutes les clés dans un fichier sécurisé

### Jour 2 : Déployer
1. Créer compte Vercel
2. Importer le projet GitHub
3. Ajouter toutes les variables d'environnement
4. Créer Postgres sur Vercel
5. Migrer la base avec Prisma
6. Déployer !

### Jour 3 : Domaine
1. Configurer DNS sur OVH
2. Ajouter domaine sur Vercel
3. Attendre propagation DNS (1-24h)
4. Tester www.flightalert.fr

### Jour 4 : Tests
1. Tester toutes les fonctionnalités
2. Créer quelques comptes tests
3. Envoyer des deals tests
4. Vérifier emails/SMS

---

## 💡 Conseils

### Budget estimé
- **Brevo** : Gratuit (300 emails/jour suffisant pour démarrer)
- **Twilio** : ~$2/mois (15$ de crédit = 7 mois gratuits)
- **Stripe** : Gratuit (commission 1.4% + 0.25€ par transaction)
- **Vercel** : Gratuit (plan Hobby suffisant)
- **Total : ~0-5€/mois au début** 🎉

### Sécurité
- Ne JAMAIS commiter les clés API sur GitHub
- Utilisez des mots de passe forts
- Activez 2FA sur Stripe et Twilio

### Support
- Vercel : https://vercel.com/support
- Stripe : Chat disponible 24/7
- Twilio : Documentation excellente

---

## ❓ Questions Fréquentes

**Q : Dois-je avoir une entreprise enregistrée ?**
R : Non, vous pouvez lancer en tant que particulier et créer une entreprise plus tard.

**Q : Combien de temps pour tout configurer ?**
R : 1-2 heures pour les API, 1 heure pour le déploiement. Total : ~3h

**Q : Et si j'ai une erreur ?**
R : Consultez le fichier `GUIDE_DEPLOIEMENT_COMPLET.md` section Dépannage

**Q : Puis-je tester avant de payer Twilio ?**
R : Oui ! Twilio offre $15 de crédit gratuit = plusieurs mois de tests

**Q : Dois-je activer Stripe en production immédiatement ?**
R : Non, commencez en mode Test. Activez le mode Live quand vous êtes prêt.

---

## 📞 Besoin d'Aide ?

Si vous êtes bloqué :

1. **Vérifiez les logs Vercel** : `vercel logs`
2. **Consultez** `GUIDE_DEPLOIEMENT_COMPLET.md`
3. **Testez localement** : `npm run dev`
4. **Vérifiez les variables d'environnement** sur Vercel

---

## ✅ Prêt à Lancer !

Une fois toutes les actions complétées, votre application sera **LIVE** sur :
- 🌐 https://www.flightalert.fr
- 📧 Envoi d'emails automatiques
- 📱 SMS pour utilisateurs Premium
- 💳 Paiements Stripe sécurisés

**Bon lancement !** 🚀✈️
