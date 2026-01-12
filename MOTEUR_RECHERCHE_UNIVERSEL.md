# 🌍 Moteur de Recherche Universel - FlightDeals

## ✨ Qu'est-ce qui a changé ?

Le système de recherche de destinations a été **complètement transformé** pour devenir un vrai moteur de recherche comme celui des compagnies aériennes.

---

## 🚀 Nouvelles Fonctionnalités

### 1. Recherche Universelle d'Aéroports

**Avant** : 40 destinations fixes avec images préchargées
**Maintenant** : ~100+ aéroports majeurs recherchables en temps réel

**Comment ça marche** :
- Tapez au moins 2 caractères dans la barre de recherche
- Recherche par ville, pays, code IATA, ou nom d'aéroport
- Résultats instantanés (pas besoin de cliquer sur "rechercher")
- Limite à 20 résultats pour une meilleure performance

**Exemples de recherche** :
- `Tokyo` → Trouve Narita (NRT), Haneda (HND)
- `CDG` → Trouve Charles de Gaulle, Paris
- `New York` → Trouve JFK, Newark (EWR), LaGuardia (LGA)
- `France` → Trouve tous les aéroports français

### 2. Système de Follow/Unfollow

**Bouton étoile sur chaque destination** :
- ☆ (vide) = Non suivie → Cliquez pour suivre
- ⭐ (pleine) = Suivie → Cliquez pour ne plus suivre

**Quand vous suivez une destination** :
- Elle est sauvegardée dans votre profil
- Vous recevrez des alertes quand un deal apparaît pour cette destination
- Email pour les utilisateurs gratuits
- SMS pour les utilisateurs Premium

### 3. Interface Simplifiée

**Supprimé** :
- ❌ Filtre par continent (trop restrictif)
- ❌ Liste statique de 40 destinations
- ❌ Groupement par continent
- ❌ Images fixes et parfois incohérentes

**Ajouté** :
- ✅ Barre de recherche simple et puissante
- ✅ Résultats dynamiques en temps réel
- ✅ Section "Mes destinations suivies" (visible quand pas de recherche)
- ✅ Images automatiques basées sur la ville
- ✅ Informations complètes (code IATA, timezone, etc.)

---

## 📁 Fichiers Créés/Modifiés

### Nouveaux Fichiers

1. **`lib/airports.ts`**
   - Base de données de ~100+ aéroports majeurs
   - Fonction `searchAirports(query, limit)`
   - Fonction `getAirportByCode(code)`
   - Fonction `getDestinationImage(city)` pour les images dynamiques

2. **`app/api/destinations/followed/route.ts`**
   - API GET pour récupérer les destinations suivies d'un utilisateur
   - Format : `/api/destinations/followed?userId=xxx`

3. **`app/api/destinations/follow/route.ts`**
   - API POST pour suivre une destination
   - Body : `{ userId, code, city, country }`

4. **`app/api/destinations/unfollow/route.ts`**
   - API DELETE pour ne plus suivre une destination
   - Body : `{ userId, code }`

### Fichiers Modifiés

1. **`app/destinations/page.tsx`** (réécriture complète)
   - Nouvelle UI avec recherche universelle
   - Intégration du système follow/unfollow
   - Affichage conditionnel (recherche vs destinations suivies)
   - Messages d'aide et CTA

---

## 🎯 Comment Utiliser

### Scénario 1 : Visiteur Non-Connecté

1. Va sur http://localhost:3050/destinations
2. Voit un message "Recherchez votre prochaine destination"
3. Tape une recherche (ex: "tokyo")
4. Voit les résultats avec images
5. Clic sur l'étoile → Redirigé vers /login

### Scénario 2 : Utilisateur Connecté

1. Va sur http://localhost:3050/destinations
2. Voit "Commencez votre recherche" (si aucune destination suivie)
3. Tape une recherche (ex: "bali")
4. Voit Ngurah Rai International Airport (DPS)
5. Clic sur ⭐ → Destination ajoutée à "Mes destinations suivies"
6. Efface la recherche → Voit sa liste de destinations suivies
7. Clic sur ⭐ pleine → Destination retirée

### Scénario 3 : Premium User avec Alertes

1. User suit Tokyo (NRT)
2. Admin crée un deal Paris → Tokyo
3. Système détecte le match
4. User reçoit SMS + Email avec le deal

---

## 🗄️ Base de Données

Le système utilise le modèle Prisma `Destination` existant :

```prisma
model Destination {
  id        String   @id @default(cuid())
  userId    String
  city      String
  country   String
  code      String   // Code IATA (ex: NRT, CDG, JFK)
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
}
```

**Champs** :
- `userId` : ID de l'utilisateur qui suit cette destination
- `code` : Code IATA de l'aéroport (3 lettres)
- `city` : Ville de destination
- `country` : Pays

---

## 🔍 Fonctionnalités de Recherche

### Recherche Intelligente

La fonction `searchAirports()` recherche dans :
- **Ville** : "Tokyo", "Paris", "New York"
- **Pays** : "Japon", "France", "États-Unis"
- **Code IATA** : "NRT", "CDG", "JFK"
- **Nom d'aéroport** : "Charles de Gaulle", "Narita"

### Priorité de Résultats

Les résultats sont retournés dans cet ordre :
1. Match exact du code IATA (ex: "CDG")
2. Match de début de ville (ex: "Par" → Paris)
3. Match partiel dans ville, pays, ou nom

### Limite de Résultats

Par défaut : 20 résultats maximum pour :
- Performance optimale
- UI claire et lisible
- Temps de réponse rapide

---

## 🎨 Design

### Cartes de Destination

**Éléments** :
- Image HD de la ville (générée automatiquement)
- Code IATA en badge rouge
- Bouton étoile (follow/unfollow) en haut à droite
- Nom de la ville en grand
- Pays en sous-titre
- Nom complet de l'aéroport
- Timezone avec icône horloge

**États** :
- Hover : Scale + Glow effect
- Followed : Étoile jaune pleine
- Not followed : Étoile vide blanche

### Responsive

- **Desktop** : Grille 4 colonnes
- **Tablet** : Grille 3 colonnes
- **Mobile** : Grille 1 colonne

---

## 🔐 Authentification

**Non-connecté** :
- Peut rechercher et voir les résultats
- Clic sur étoile → Redirigé vers /login
- Message CTA "Connectez-vous pour suivre"

**Connecté** :
- Peut rechercher, suivre, et ne plus suivre
- Voit ses destinations suivies
- Reçoit des alertes pour ses destinations

---

## 📧 Système d'Alertes

### Workflow Complet

1. **User suit Tokyo (NRT)**
   ```
   POST /api/destinations/follow
   { userId, code: "NRT", city: "Tokyo", country: "Japon" }
   → Saved in DB
   ```

2. **Admin crée deal Paris → Tokyo**
   ```
   Via /admin
   Deal créé avec destination "Tokyo"
   → Saved in Deal table
   ```

3. **Système de matching (à implémenter)**
   ```
   Cron job quotidien:
   - Cherche tous les deals récents
   - Pour chaque deal, trouve users avec destination matching
   - Envoie email (free) ou SMS (premium)
   - Crée record Alert
   ```

4. **User reçoit notification**
   ```
   Email: "🔥 Deal Tokyo à 439€ !"
   SMS (Premium): "Vol Paris→Tokyo 439€ (au lieu de 800€) - Réservez: https://..."
   ```

---

## ⚙️ API Routes

### GET `/api/destinations/followed`

**Description** : Récupère toutes les destinations suivies par un user

**Query Params** :
- `userId` (required) : ID de l'utilisateur

**Response** :
```json
{
  "destinations": [
    {
      "id": "clxxx",
      "code": "NRT",
      "city": "Tokyo",
      "country": "Japon",
      "createdAt": "2026-01-10T..."
    }
  ]
}
```

### POST `/api/destinations/follow`

**Description** : Suivre une destination

**Body** :
```json
{
  "userId": "clxxx",
  "code": "NRT",
  "city": "Tokyo",
  "country": "Japon"
}
```

**Response** :
```json
{
  "destination": {
    "id": "clxxx",
    "userId": "clxxx",
    "code": "NRT",
    "city": "Tokyo",
    "country": "Japon",
    "createdAt": "2026-01-10T..."
  }
}
```

### DELETE `/api/destinations/unfollow`

**Description** : Ne plus suivre une destination

**Body** :
```json
{
  "userId": "clxxx",
  "code": "NRT"
}
```

**Response** :
```json
{
  "success": true
}
```

---

## 🧪 Tests

### Test 1 : Recherche Simple

```
1. Aller sur /destinations
2. Taper "paris" dans la recherche
3. ✅ Doit afficher Charles de Gaulle (CDG) et Orly (ORY)
```

### Test 2 : Code IATA

```
1. Taper "JFK"
2. ✅ Doit afficher John F. Kennedy International (New York)
```

### Test 3 : Follow

```
1. Se connecter
2. Rechercher "tokyo"
3. Cliquer sur ⭐ vide sur Tokyo Narita
4. ✅ Étoile devient pleine
5. Effacer la recherche
6. ✅ Tokyo apparaît dans "Mes destinations suivies"
```

### Test 4 : Unfollow

```
1. Dans "Mes destinations suivies"
2. Cliquer sur ⭐ pleine
3. ✅ Destination disparaît de la liste
```

### Test 5 : Non-Connecté

```
1. Se déconnecter
2. Rechercher "bali"
3. Cliquer sur ⭐
4. ✅ Redirigé vers /login
```

---

## 🚀 Prochaines Étapes

### Court Terme

1. **Tester le système complet** :
   - Recherche
   - Follow/Unfollow
   - Affichage des destinations suivies

2. **Ajouter plus d'aéroports** :
   - Actuellement ~100 aéroports majeurs
   - Objectif : 500+ pour couvrir le monde entier

3. **Implémenter le système d'alertes automatique** :
   - Cron job pour matcher deals ↔ destinations
   - Envoi d'emails/SMS

### Moyen Terme

1. **Améliorer les images** :
   - API Unsplash automatique
   - Fallback images par région
   - Cache des images

2. **Filtres avancés** (optionnel) :
   - Par région (Europe, Asie, etc.)
   - Par pays
   - Tri (alphabétique, plus suivis, etc.)

3. **Analytics** :
   - Destinations les plus suivies
   - Taux de conversion follow → deal cliqué

---

## 📊 Statistiques

**Avant** :
- 40 destinations fixes
- Images manuelles
- Groupement par continent obligatoire
- Pas de système de follow

**Maintenant** :
- ~100+ aéroports recherchables
- Images dynamiques
- Recherche universelle simple
- Système de follow/unfollow complet
- API REST pour les destinations

**Gain** :
- ✅ Plus flexible
- ✅ Plus professionnel
- ✅ Vraiment comme une compagnie aérienne
- ✅ Personnalisable par utilisateur

---

## 🎉 Résultat

Le nouveau système est :
- ✅ **Universel** : Recherche tous les aéroports
- ✅ **Simple** : Juste une barre de recherche
- ✅ **Dynamique** : Résultats en temps réel
- ✅ **Fonctionnel** : Follow/Unfollow opérationnel
- ✅ **Professionnel** : Design moderne type compagnie aérienne
- ✅ **Personnalisé** : Chaque user ses destinations

**Prêt à être testé!** 🚀
