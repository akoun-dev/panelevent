#!/bin/bash
# Script d'initialisation de la base PanelEvent avec Supabase

set -e

echo -e "\033[1;33m🚀 Application des migrations...\033[0m"
if ! supabase migration apply; then
  echo -e "\033[1;31m❌ Échec de l'application des migrations\033[0m"
  exit 1
fi

echo -e "\033[1;33m🌱 Peuplement des données...\033[0m"
if ! npm run db:seed; then
  echo -e "\033[1;31m❌ Échec du peuplement des données\033[0m"
  exit 1
fi

echo -e "\033[1;32m✅ Base de données prête!\033[0m"
