# 🚀 Démarrage Rapide en Local

## Problème résolu : Erreur 500 sur /signup

L'erreur venait du fait que **la base de données n'était pas initialisée**.

---

## ✅ Solution Appliquée

La base de données SQLite a été créée et est maintenant fonctionnelle.

---

## 🔧 Pour démarrer l'application

### 1. Vérifier que tout est installé

```bash
npm install
```

### 2. La base de données est déjà créée

Le fichier `dev.db` a été créé avec toutes les tables nécessaires :
- ✅ User
- ✅ Subscription
- ✅ Destination
- ✅ Deal
- ✅ Alert

### 3. Démarrer le serveur

```bash
npm run dev
```

L'application est disponible sur : **http://localhost:3000**

### 4. Tester l'inscription

1. Allez sur : http://localhost:3000/signup
2. Remplissez le formulaire :
   - Email : test@example.com
   - Mot de passe : password123
   - Plan : Gratuit ou Premium
3. Cliquez sur "S'inscrire"

✅ **Vous devriez maintenant pouvoir créer un compte sans erreur 500 !**

---

## 🔍 Vérifier la base de données

Pour voir vos données dans un interface graphique :

```bash
npx prisma studio
```

Cela ouvre une interface web sur http://localhost:5555

---

## 📝 Notes Importantes

### Base de données actuelle : SQLite (local)

Le projet utilise **SQLite** pour le développement local :
- Fichier : `dev.db`
- Avantage : Aucune configuration nécessaire
- Parfait pour tester localement

### Pour la production : PostgreSQL

Quand vous déploierez sur Vercel, vous utiliserez **PostgreSQL** :

1. **Modifiez `prisma/schema.prisma`** :
```prisma
datasource db {
  provider = "postgresql"  // Changer de "sqlite" à "postgresql"
  url      = env("DATABASE_URL")
}
```

2. **Ajoutez l'URL PostgreSQL dans les variables Vercel**
3. **Migrez** : `npx prisma db push`

---

## 🐛 En cas de problème

### Erreur "Table does not exist"

```bash
# Régénérer la base
npx prisma db push --accept-data-loss
```

### Réinitialiser complètement la base

```bash
# Supprimer la base existante
rm -f dev.db

# Recréer
npx prisma db push
```

### Voir les logs détaillés

Dans la console du serveur (terminal où tourne `npm run dev`), vous verrez maintenant les erreurs détaillées avec :
- Message d'erreur
- Code d'erreur
- Détails techniques

---

## ✨ Prochaines Étapes

Maintenant que l'inscription fonctionne, vous pouvez :

1. ✅ Créer un compte
2. ✅ Vous connecter
3. ✅ Tester la recherche de vols sur `/recherche`
4. ✅ Ajouter des destinations favorites
5. ✅ Voir votre historique sur `/historique`
6. ✅ Tester le panel admin sur `/admin`

---

## 🚀 Pour déployer en production

Suivez le fichier : **`GUIDE_DEPLOIEMENT_COMPLET.md`**

Il contient toutes les instructions pour :
- Créer la base PostgreSQL sur Vercel
- Configurer les variables d'environnement
- Déployer l'application
- Configurer le nom de domaine

---

## 📞 Support

Si vous rencontrez d'autres problèmes :
1. Vérifiez les logs du serveur
2. Regardez la console du navigateur (F12)
3. Consultez `GUIDE_DEPLOIEMENT_COMPLET.md`

Bon développement ! 🎉
