#!/bin/bash
# Script complet d'initialisation de la base PanelEvent
# Effectue toutes les opérations en une seule commande

echo -e "\033[1;36m
   _____ _____ _____ _____ _____ _____ _____ 
  |     |     |     |     |     |     |     |
  |  P  |  a  |  n  |  e  |  l  |  E  |  v  |
  |_____|_____|_____|_____|_____|_____|_____|
  |     |     |     |     |     |     |     |
  |  e  |  n  |  t  |     |  D  |  B  |     |
  |_____|_____|_____|_____|_____|_____|_____|
\033[0m"

# 1. Nettoyage de la base existante
echo -e "\033[1;33m🔨 Nettoyage de l'ancienne base de données...\033[0m"
rm -f ./prisma/dev.db 2>/dev/null

# 2. Initialisation de la base
echo -e "\033[1;33m🚀 Initialisation de la base...\033[0m"
if ! npx prisma db push; then
  echo -e "\033[1;31m❌ Échec de l'initialisation\033[0m"
  exit 1
fi

# 3. Génération du client Prisma
echo -e "\033[1;33m⚙️  Génération du client...\033[0m"
if ! npx prisma generate; then
  echo -e "\033[1;31m❌ Échec de la génération\033[0m"
  exit 1
fi

# 4. Peuplement des données
echo -e "\033[1;33m🌱 Peuplement des données...\033[0m"
if ! npx prisma db seed; then
  echo -e "\033[1;31m❌ Échec du peuplement\033[0m"
  exit 1
fi

# 5. Vérification finale
echo -e "\033[1;33m🔍 Vérification...\033[0m"
npx prisma migrate status

echo -e "\033[1;32m
✅ Base de données prête à l'emploi!
   Compte admin: ${ADMIN_EMAIL:-non configuré}
\033[0m"