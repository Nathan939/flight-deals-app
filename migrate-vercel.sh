#!/bin/bash
# Script pour migrer la base de données Vercel

echo "🔄 Récupération des variables d'environnement de Vercel..."
vercel env pull .env.production

echo "📊 Application des migrations Prisma..."
npx prisma migrate deploy

echo "✅ Migrations terminées !"
echo "🔄 Maintenant, redéployez votre application sur Vercel"
