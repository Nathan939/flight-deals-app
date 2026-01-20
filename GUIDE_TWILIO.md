# 📱 Guide de Configuration Twilio

## Pourquoi Twilio ?

Twilio vous permet d'envoyer des alertes SMS aux utilisateurs premium qui suivent des destinations.

---

## ⚡ Configuration Rapide (10 minutes)

### Étape 1 : Créer un Compte Twilio

1. **Allez sur** : [https://www.twilio.com/try-twilio](https://www.twilio.com/try-twilio)
2. **Cliquez sur** : "Sign up"
3. **Remplissez** :
   - Email
   - Mot de passe
   - Cochez "I'm not a robot"
4. **Vérifiez votre email** et confirmez

### Étape 2 : Obtenir vos Identifiants

Après connexion, vous êtes sur le **Console Dashboard**.

#### A. Account SID et Auth Token

Sur la page principale, vous verrez :

```
Account Info
├── ACCOUNT SID    : ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
└── AUTH TOKEN     : [Show] → cliquez pour voir
```

**Copiez ces deux valeurs** - vous en aurez besoin !

#### B. Obtenir un Numéro de Téléphone

1. Dans le menu gauche : **Develop** > **Phone Numbers** > **Manage** > **Buy a number**
2. **Sélectionnez le pays** : France (+33) ou votre pays
3. **Cochez** : "SMS" (pas besoin de Voice pour ce projet)
4. **Cliquez sur** : "Search"
5. **Sélectionnez un numéro** et cliquez sur "Buy"
   - En mode test/essai : **Gratuit** (crédit de $15 offert)
   - En production : ~1€/mois par numéro

Votre numéro ressemblera à : `+33 x xx xx xx xx` ou `+1 xxx xxx xxxx`

---

### Étape 3 : Ajouter les Clés dans `.env`

Ouvrez votre fichier `.env` et remplacez les placeholders :

```bash
# SMS (À CONFIGURER avec vos vraies clés)
TWILIO_ACCOUNT_SID="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
TWILIO_AUTH_TOKEN="votre_auth_token_ici"
TWILIO_PHONE_NUMBER="+33612345678"
```

**Exemple concret** :
```bash
TWILIO_ACCOUNT_SID="ACa1b2c3d4e5f6g7h8i9j0k1l2m3n4o5"
TWILIO_AUTH_TOKEN="a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
TWILIO_PHONE_NUMBER="+33756483920"
```

⚠️ **IMPORTANT** :
- Le numéro DOIT commencer par `+` (format international)
- Pas d'espaces dans le numéro de téléphone
- Ne committez JAMAIS ce fichier sur Git !

---

### Étape 4 : Tester l'Envoi de SMS

#### Option A : Via le Dashboard Admin

1. Démarrez l'application :
   ```bash
   npm run dev
   ```

2. Allez sur : [http://localhost:3000/admin](http://localhost:3000/admin)

3. Dans la section **Test SMS** :
   - Entrez votre numéro de téléphone (format : `+33612345678`)
   - Cliquez sur "Envoyer SMS de test"

4. **Vous devriez recevoir** :
   ```
   🧪 Test SMS depuis FlightAlert - Si vous recevez ce message, Twilio fonctionne correctement ! ✅
   ```

#### Option B : Via l'API directement

```bash
curl -X POST http://localhost:3000/api/admin/send-test-sms \
  -H "Content-Type: application/json" \
  -d '{"phone": "+33612345678"}'
```

---

## 📊 Mode Essai vs Production

### Mode Essai (Trial) - Gratuit

**Avantages** :
- $15 de crédit offert (~500 SMS)
- Parfait pour tester
- Aucune carte bancaire requise

**Limitations** :
- Vous ne pouvez envoyer des SMS qu'aux numéros **vérifiés**
- Les SMS contiennent un préfixe : "Sent from your Twilio trial account"

**Comment vérifier un numéro** :
1. Console Twilio : **Phone Numbers** > **Manage** > **Verified Caller IDs**
2. Cliquez sur "Add a new Caller ID"
3. Entrez votre numéro → vous recevrez un code de vérification

### Mode Production - Payant

**Pour activer** :
1. Allez sur : **Console** > **Billing**
2. Ajoutez une carte bancaire
3. Passez en mode "Production"

**Tarifs indicatifs** :
- SMS France → France : ~0.06€/SMS
- SMS France → International : ~0.10-0.20€/SMS selon pays
- Numéro de téléphone : ~1€/mois

**Avantages** :
- Envoi SMS à n'importe quel numéro
- Pas de préfixe "trial"
- Volume illimité

---

## 🧪 Vérifier que Ça Marche

### Test 1 : Les Credentials Sont-ils Bons ?

Regardez les logs de votre serveur après avoir essayé d'envoyer un SMS :

**✅ Ça marche** :
```
✅ SMS sent successfully: SMxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**❌ Problème de configuration** :
```
⚠️ Twilio not configured, SMS not sent
```
→ Vérifiez votre `.env`

**❌ Credentials invalides** :
```
❌ Error sending SMS: [HTTP 401] Unable to create record: Authenticate
```
→ Vérifiez vos `ACCOUNT_SID` et `AUTH_TOKEN`

**❌ Numéro invalide** :
```
❌ Error: The 'From' number +1234567890 is not a valid phone number
```
→ Utilisez votre vrai numéro Twilio

### Test 2 : Envoyer un Deal à un Utilisateur

1. Créez un compte premium : [http://localhost:3000/signup?plan=premium](http://localhost:3000/signup?plan=premium)
2. Ajoutez votre numéro de téléphone
3. Suivez une destination (ex: Tokyo, New York)
4. Depuis l'admin, créez un deal pour cette destination
5. Envoyez le deal → vous recevrez un SMS 🎉

---

## 🐛 Problèmes Courants

### Erreur : "Unable to create record: Authenticate"

**Cause** : Mauvais credentials (SID ou Token)

**Solution** :
1. Allez sur le [Console Dashboard](https://console.twilio.com/)
2. Copiez à nouveau votre `ACCOUNT_SID` et `AUTH TOKEN`
3. Mettez à jour `.env`
4. Redémarrez l'application

---

### Erreur : "The 'From' number is not a valid phone number"

**Cause** : Format du numéro incorrect

**Solution** :
- Format correct : `+33612345678` (pas d'espaces)
- Format incorrect : `06 12 34 56 78`, `+33 6 12 34 56 78`

---

### Erreur : "The number X is unverified"

**Cause** : Vous êtes en mode Trial et le destinataire n'est pas vérifié

**Solutions** :
1. **Vérifier le numéro** (Console > Verified Caller IDs)
2. **OU** passer en mode Production

---

### Je ne reçois pas les SMS

**Checklist** :
- [ ] Les credentials sont corrects dans `.env`
- [ ] Le numéro Twilio est au bon format (`+33...`)
- [ ] Mon numéro personnel est vérifié (si mode Trial)
- [ ] J'ai redémarré l'application après modification de `.env`
- [ ] Les logs ne montrent pas d'erreur

---

## 💰 Estimation des Coûts

Pour un projet avec **1000 utilisateurs premium** :

**Scénario 1 : Envoi modéré**
- 1 SMS/semaine par utilisateur = 4 SMS/mois
- 1000 users × 4 SMS × 0.06€ = **240€/mois**

**Scénario 2 : Envoi fréquent**
- 2 SMS/semaine par utilisateur = 8 SMS/mois
- 1000 users × 8 SMS × 0.06€ = **480€/mois**

**+ Numéro de téléphone** : 1€/mois

---

## ✅ Checklist Finale

Avant de passer en production :

- [ ] Compte Twilio créé
- [ ] Numéro de téléphone acheté
- [ ] Variables d'environnement configurées dans `.env`
- [ ] SMS de test envoyé et reçu
- [ ] Deal test envoyé et reçu
- [ ] Compte Twilio passé en mode Production (si besoin)
- [ ] Variables ajoutées sur Vercel (pour la prod)

---

## 🔗 Liens Utiles

- **Console Twilio** : [https://console.twilio.com/](https://console.twilio.com/)
- **Documentation SMS** : [https://www.twilio.com/docs/sms](https://www.twilio.com/docs/sms)
- **Tarifs SMS** : [https://www.twilio.com/en-us/sms/pricing](https://www.twilio.com/en-us/sms/pricing)
- **Support** : [https://support.twilio.com/](https://support.twilio.com/)

---

## 📝 Notes pour Vercel (Production)

Quand vous déployez sur Vercel, ajoutez ces variables :

1. Vercel Dashboard > Votre projet > **Settings** > **Environment Variables**
2. Ajoutez :
   ```
   TWILIO_ACCOUNT_SID    = ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN     = votre_auth_token_ici
   TWILIO_PHONE_NUMBER   = +33612345678
   ```
3. **Cochez** : Production, Preview, Development
4. Redéployez l'application

---

## 🎉 C'est Terminé !

Twilio est maintenant configuré et prêt à envoyer des alertes SMS aux utilisateurs premium ! 🚀

Pour tester :
```bash
npm run dev
# Puis allez sur http://localhost:3000/admin
```
