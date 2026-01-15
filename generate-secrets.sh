#!/bin/bash

echo "🔐 Génération des secrets pour Vercel"
echo "======================================"
echo ""

echo "📝 NEXTAUTH_SECRET (copiez cette valeur dans Vercel) :"
openssl rand -base64 32
echo ""

echo "📝 ADMIN_PASSWORD suggéré (ou créez le vôtre) :"
openssl rand -base64 24
echo ""

echo "✅ Ajoutez ces valeurs dans :"
echo "   Vercel Dashboard > Settings > Environment Variables"
echo ""
