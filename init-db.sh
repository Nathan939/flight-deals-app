#!/bin/bash

echo "🚀 Initialisation de la base de données FlightAlert"
echo ""

# Vérifier si .env existe
if [ ! -f .env ]; then
    echo "❌ Fichier .env introuvable"
    echo "📝 Créez un fichier .env avec DATABASE_URL"
    echo "   Exemple: DATABASE_URL=\"file:./dev.db\""
    exit 1
fi

# Vérifier si DATABASE_URL est défini
if ! grep -q "DATABASE_URL" .env; then
    echo "❌ DATABASE_URL non défini dans .env"
    exit 1
fi

echo "✅ Fichier .env trouvé"
echo ""

# Générer le client Prisma
echo "📦 Génération du client Prisma..."
npx prisma generate

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de la génération du client Prisma"
    exit 1
fi

echo "✅ Client Prisma généré"
echo ""

# Créer/migrer la base de données
echo "🗄️  Création de la base de données..."
npx prisma db push

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de la création de la base de données"
    exit 1
fi

echo "✅ Base de données créée et migrée"
echo ""

echo "🎉 Initialisation terminée avec succès !"
echo ""
echo "Vous pouvez maintenant :"
echo "  1. Démarrer le serveur : npm run dev"
echo "  2. Créer un compte sur : http://localhost:3000/signup"
echo "  3. Ouvrir Prisma Studio : npx prisma studio"
echo ""
