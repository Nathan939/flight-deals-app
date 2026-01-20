# 📧 Guide de Configuration SendGrid pour les Emails

## ✅ SMS Twilio - Fonctionnel !

Les SMS fonctionnent maintenant parfaitement via Twilio. Pour les emails, Twilio utilise **SendGrid** (qu'ils possèdent).

---

## 🎯 Configuration Rapide SendGrid

### Étape 1 : Accéder à SendGrid via Twilio

1. Allez sur votre compte Twilio : [https://console.twilio.com/](https://console.twilio.com/)
2. Dans le menu gauche, cliquez sur **SendGrid Email API**
3. OU allez directement sur : [https://app.sendgrid.com/](https://app.sendgrid.com/)

### Étape 2 : Créer une Clé API

1. Dans SendGrid, allez sur **Settings** > **API Keys**
2. Cliquez sur **Create API Key**
3. Configuration :
   - **API Key Name** : `Les Vols de Sylvain Production`
   - **API Key Permissions** : Sélectionnez **Full Access** (ou au minimum "Mail Send")
4. Cliquez sur **Create & View**
5. **IMPORTANT** : Copiez immédiatement la clé API (elle ne sera plus affichée)
   - Format : `SG.xxxxxxxxxxxxxxxxxx...`
   - Longueur : ~69 caractères

### Étape 3 : Vérifier un Domaine d'Envoi

Pour que les emails ne tombent pas en spam, vous devez vérifier votre domaine.

#### Option A : Utiliser un Email Single Sender (Rapide, Test)

1. Allez sur **Settings** > **Sender Authentication**
2. Cliquez sur **Verify a Single Sender**
3. Remplissez :
   - **From Email Address** : votre email personnel (ex: `sylvain@votre-email.com`)
   - **From Name** : `Les Vols de Sylvain`
   - **Reply To** : même email
   - Adresse, ville, pays
4. Cliquez sur **Create**
5. Vérifiez votre boîte email et cliquez sur le lien de vérification

#### Option B : Authentifier un Domaine Complet (Recommandé, Production)

**Prérequis** : Vous devez avoir accès au DNS de votre domaine (OVH par exemple)

1. Allez sur **Settings** > **Sender Authentication**
2. Cliquez sur **Authenticate Your Domain**
3. Sélectionnez **Other Host** (ou votre hébergeur DNS)
4. Entrez votre domaine : `votredomaine.com`
5. SendGrid vous donnera des enregistrements DNS à ajouter :

**Exemple d'enregistrements DNS à ajouter dans OVH** :

```
Type    Nom                                      Valeur
CNAME   em1234.votredomaine.com                 u1234567.wl134.sendgrid.net
CNAME   s1._domainkey.votredomaine.com          s1.domainkey.u1234567.wl134.sendgrid.net
CNAME   s2._domainkey.votredomaine.com          s2.domainkey.u1234567.wl134.sendgrid.net
```

6. Ajoutez ces enregistrements dans votre compte OVH (section DNS)
7. Retournez sur SendGrid et cliquez sur **Verify**
8. La vérification peut prendre 24-48h

---

## 🔧 Mise à Jour du Fichier `.env`

Une fois la clé API obtenue, mettez à jour le fichier `.env` :

```bash
# Email via Twilio (SendGrid)
EMAIL_FROM="noreply@votredomaine.com"  # L'email vérifié sur SendGrid
EMAIL_FROM_NAME="Les Vols de Sylvain"
```

**Note** : L'Auth Token Twilio sert également de clé API SendGrid, donc pas besoin de variable supplémentaire !

---

## 🧪 Tester l'Envoi d'Email

### Via le Dashboard Admin

1. Ouvrez Safari et allez sur : [http://localhost:3050/admin](http://localhost:3050/admin)
2. Password : `admin123`
3. Dans la section **Test Email**, entrez votre email
4. Cliquez sur "Envoyer Email de Test"
5. Vérifiez votre boîte de réception (et les spams)

### Via cURL

```bash
curl -X POST http://localhost:3050/api/admin/send-test-email \
  -H "Content-Type: application/json" \
  -d '{"email": "votre-email@example.com"}'
```

---

## 📊 Limitations et Quotas

### Mode Gratuit SendGrid (Twilio)

- **100 emails/jour** gratuits
- Parfait pour démarrer et tester
- Logo SendGrid dans les emails

### Mode Payant

Pour plus de volume :
- **Essentials** : $19.95/mois - 50,000 emails/mois
- **Pro** : $89.95/mois - 100,000 emails/mois
- Pas de logo SendGrid
- Support prioritaire

---

## 🐛 Problèmes Courants

### Erreur : "Sender not verified"

**Cause** : L'email `EMAIL_FROM` n'est pas vérifié sur SendGrid

**Solution** :
1. Vérifiez un Single Sender (rapide)
2. OU authentifiez votre domaine complet (recommandé)

---

### Emails arrivent en spam

**Causes possibles** :
- Domaine pas authentifié
- Contenu suspect
- Pas d'enregistrements SPF/DKIM/DMARC

**Solutions** :
1. Authentifiez votre domaine (enregistrements DNS)
2. Évitez les mots comme "gratuit", "urgent", trop de majuscules
3. Ajoutez un lien de désinscription
4. Testez avec [mail-tester.com](https://www.mail-tester.com/)

---

### Erreur 401 Unauthorized

**Cause** : Auth Token incorrect

**Solution** :
- Vérifiez que `TWILIO_AUTH_TOKEN` est bien configuré dans `.env`
- Redémarrez le serveur après modification

---

## 📝 Configuration Production (Vercel)

Quand vous déploierez sur Vercel, ajoutez ces variables d'environnement :

```
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_PHONE_NUMBER=+15104910296
EMAIL_FROM=noreply@votredomaine.com
EMAIL_FROM_NAME=Les Vols de Sylvain
```

---

## ✅ Checklist Configuration Email

- [ ] Clé API SendGrid créée
- [ ] Email Single Sender vérifié OU domaine authentifié
- [ ] Variable `EMAIL_FROM` mise à jour dans `.env`
- [ ] Serveur redémarré
- [ ] Email de test envoyé et reçu
- [ ] Email ne tombe pas en spam

---

## 🔗 Liens Utiles

- **SendGrid Dashboard** : [https://app.sendgrid.com/](https://app.sendgrid.com/)
- **Documentation SendGrid** : [https://docs.sendgrid.com/](https://docs.sendgrid.com/)
- **Twilio SendGrid** : [https://www.twilio.com/sendgrid/email-api](https://www.twilio.com/sendgrid/email-api)
- **Test Email (mail-tester)** : [https://www.mail-tester.com/](https://www.mail-tester.com/)

---

## 📱 État Actuel

✅ **SMS Twilio** : Fonctionnel
⏳ **Emails SendGrid** : Configuration requise

Une fois SendGrid configuré, vous aurez un système complet d'alertes SMS + Email ! 🚀
