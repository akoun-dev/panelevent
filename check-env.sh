#!/bin/bash

echo "🔍 Vérification de l'environnement PanelEvent"
echo "=========================================="

echo "📁 Fichiers d'environnement:"
if [ -f ".env" ]; then
    echo "✅ .env existe"
else
    echo "❌ .env manquant"
fi

if [ -f ".env.local" ]; then
    echo "✅ .env.local existe"
else
    echo "❌ .env.local manquant"
fi

echo ""
echo "🔑 Variables d'environnement:"
if [ -n "$SUPABASE_URL" ]; then
    echo "✅ SUPABASE_URL configurée"
else
    echo "❌ SUPABASE_URL non configurée"
fi

if [ -n "$SUPABASE_KEY" ]; then
    echo "✅ SUPABASE_KEY configurée"
else
    echo "❌ SUPABASE_KEY non configurée"
fi

echo ""
echo "✨ Environnement vérifié!"
