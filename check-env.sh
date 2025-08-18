#!/bin/bash

echo "🔍 Vérification de l'environnement PanelEvent"
echo "=========================================="

# Vérifier les fichiers d'environnement
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

# Vérifier la base de données
echo ""
echo "🗄️  Base de données:"
if [ -f "dev.db" ]; then
    echo "✅ dev.db existe"
    echo "📊 Taille: $(ls -lh dev.db | awk '{print $5}')"
else
    echo "❌ dev.db manquante"
fi

# Vérifier les variables d'environnement clés
echo ""
echo "🔑 Variables d'environnement:"
if [ -n "$DATABASE_URL" ]; then
    echo "✅ DATABASE_URL configurée"
else
    echo "❌ DATABASE_URL non configurée"
fi

if [ -n "$NEXTAUTH_URL" ]; then
    echo "✅ NEXTAUTH_URL configurée"
else
    echo "❌ NEXTAUTH_URL non configurée"
fi

if [ -n "$NEXTAUTH_SECRET" ]; then
    echo "✅ NEXTAUTH_SECRET configurée"
else
    echo "❌ NEXTAUTH_SECRET non configurée"
fi

if [ -n "$ADMIN_EMAIL" ] && [ -n "$ADMIN_PASSWORD" ]; then
    echo "✅ Identifiants admin configurés"
else
    echo "❌ Identifiants admin non configurés"
fi

# Vérifier si le serveur est en cours d'exécution
echo ""
echo "🌐 Serveur de développement:"
if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "✅ Serveur en cours d'exécution sur http://localhost:3000"
    
    # Tester les endpoints clés
    echo ""
    echo "🧪 Test des endpoints:"
    
    # Health check
    if curl -s http://localhost:3000/api/health | grep -q "Good!"; then
        echo "✅ Health check: OK"
    else
        echo "❌ Health check: Échec"
    fi
    
    # Events API
    events_count=$(curl -s http://localhost:3000/api/events | jq '.events | length' 2>/dev/null || echo "0")
    if [ "$events_count" -gt 0 ]; then
        echo "✅ Events API: $events_count événements trouvés"
    else
        echo "❌ Events API: Aucun événement trouvé"
    fi
    
    # Auth providers
    if curl -s http://localhost:3000/api/auth/providers | grep -q "credentials"; then
        echo "✅ Auth providers: Configuré"
    else
        echo "❌ Auth providers: Non configuré"
    fi
    
else
    echo "❌ Serveur non démarré ou inaccessible"
fi

echo ""
echo "🎯 Comptes de démonstration:"

[ -n "$ADMIN_EMAIL" ] && echo "   Admin: $ADMIN_EMAIL"
[ -n "$ORGANIZER_EMAIL" ] && echo "   Organisateur: $ORGANIZER_EMAIL"
[ -n "$ATTENDEE_EMAIL" ] && echo "   Participant: $ATTENDEE_EMAIL"

echo "   Organisateur: organizer@example.com / demo123"
echo "   Participant: attendee@example.com / demo123"

echo ""
echo "✨ Environnement vérifié!"