#!/bin/bash

echo "🚀 Configuration automatique de Vercel PostgreSQL"
echo "=================================================="
echo ""

# Vérifier si Vercel CLI est installé
if ! command -v vercel &> /dev/null; then
    echo "📦 Installation de Vercel CLI..."
    npm install -g vercel
fi

echo "✅ Vercel CLI installé"
echo ""

# Se connecter à Vercel
echo "🔐 Connexion à Vercel..."
echo "   Une fenêtre va s'ouvrir dans votre navigateur"
echo ""
vercel login

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de la connexion à Vercel"
    exit 1
fi

echo ""
echo "✅ Connecté à Vercel"
echo ""

# Lier le projet
echo "🔗 Liaison du projet..."
echo "   Sélectionnez votre projet 'flight-deals-phi' quand demandé"
echo ""
vercel link

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de la liaison du projet"
    exit 1
fi

echo ""
echo "✅ Projet lié"
echo ""

# Télécharger les variables d'environnement
echo "📥 Téléchargement des variables d'environnement..."
vercel env pull .env.production.local

if [ $? -ne 0 ]; then
    echo "⚠️  Impossible de télécharger les variables"
    echo "   Assurez-vous d'avoir créé la base PostgreSQL sur Vercel"
    echo "   et ajouté les variables d'environnement"
    echo ""
    echo "📖 Suivez ce guide : GUIDE_VISUEL_RAPIDE.md"
    exit 1
fi

echo ""
echo "✅ Variables d'environnement téléchargées"
echo ""

# Générer le client Prisma
echo "📦 Génération du client Prisma..."
npx prisma generate

echo ""
echo "✅ Client Prisma généré"
echo ""

# Migrer la base de données
echo "🗄️  Migration de la base de données..."
echo "   Cela va créer toutes les tables nécessaires"
echo ""
npx prisma db push

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de la migration"
    echo ""
    echo "Vérifiez que :"
    echo "  1. La base PostgreSQL est créée sur Vercel (Storage)"
    echo "  2. DATABASE_URL est configuré dans les variables d'environnement"
    echo ""
    exit 1
fi

echo ""
echo "✅ Base de données migrée avec succès !"
echo ""
echo "🎉 Configuration terminée !"
echo ""
echo "📝 Prochaines étapes :"
echo "   1. Attendez 2 minutes que Vercel redéploie"
echo "   2. Testez l'inscription : https://flight-deals-phi.vercel.app/signup"
echo ""
echo "📊 Pour voir vos données :"
echo "   npx prisma studio"
echo ""
