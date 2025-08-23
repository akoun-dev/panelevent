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
if [ -n "$NEXT_PUBLIC_SUPABASE_URL" ]; then
    echo "✅ NEXT_PUBLIC_SUPABASE_URL configurée"
else
    echo "❌ NEXT_PUBLIC_SUPABASE_URL non configurée"
fi

if [ -n "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
    echo "✅ NEXT_PUBLIC_SUPABASE_ANON_KEY configurée"
else
    echo "❌ NEXT_PUBLIC_SUPABASE_ANON_KEY non configurée"
fi

if [ -n "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "✅ SUPABASE_SERVICE_ROLE_KEY configurée (optionnelle)"
else
    echo "ℹ️ SUPABASE_SERVICE_ROLE_KEY non configurée (optionnelle)"
fi

echo ""
echo "✨ Environnement vérifié!"
