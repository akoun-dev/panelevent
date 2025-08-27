# Plan d'implémentation du nouveau flux d'enregistrement

## Objectif
Modifier le flux d'enregistrement après scan du QR code pour ajouter une étape de vérification d'email avant l'inscription complète.

## Flux actuel vs Flux souhaité

### Actuel
```
QR Code → /register/{slug} → Langue → RGPD → Formulaire complet
```

### Souhaité
```
QR Code → /register/{slug}/check-email → Vérification email
    → Si email existe: Inscription auto + Redirection vers formulaire pré-rempli
    → Si email n'existe pas: Redirection vers formulaire complet
```

## Étapes d'implémentation

### 1. Créer la nouvelle page de vérification d'email
**Fichier**: `src/app/register/[slug]/check-email/page.tsx`

Fonctionnalités:
- Formulaire de saisie d'email
- Appel API `/api/events/register` avec paramètre `checkOnly: true`
- Redirection conditionnelle basée sur l'existence de l'email

### 2. Modifier le composant QR Code
**Fichier**: `src/components/qr-code.tsx`

Modifications:
- Changer l'URL générée de `/register/{slug}` vers `/register/{slug}/check-email`
- Mettre à jour le texte descriptif

### 3. Mettre à jour l'API d'enregistrement
**Fichier**: `src/app/api/events/register/route.ts`

Nouvelles fonctionnalités:
- Ajouter le paramètre `checkOnly: boolean`
- Si `checkOnly: true`, retourner les informations de l'utilisateur s'il existe
- Si `checkOnly: false` et email existe, créer l'inscription automatiquement

### 4. Adapter le formulaire d'inscription
**Fichier**: `src/app/register/[slug]/page.tsx`

Modifications:
- Accepter les paramètres de pré-remplissage via query string
- Charger automatiquement les données si `prefill=true`
- Afficher un message de confirmation si inscription automatique

### 5. API Endpoints

#### POST `/api/events/register` (modifié)
```typescript
// Nouveau body avec checkOnly
{
  eventId: string,
  email: string,
  checkOnly?: boolean,
  // ... autres champs pour l'inscription complète
}

// Réponse si checkOnly: true
{
  exists: boolean,
  userData?: {
    firstName: string,
    lastName: string,
    // ... autres champs
  }
}
```

## Structure des URLs

### Nouvelles routes
- `/register/{slug}/check-email` - Vérification d'email
- `/register/{slug}?prefill=true&email=...` - Formulaire pré-rempli

### Redirections
- Email existe → `/register/{slug}?prefill=true&email=...&firstName=...&lastName=...`
- Email n'existe pas → `/register/{slug}`

## Sécurité et validation

- Validation des emails
- Rate limiting maintenu
- Gestion des erreurs
- Messages d'erreur utilisateur-friendly

## Tests à effectuer

1. ✅ Scan QR code → Page vérification email
2. ✅ Saisie email existant → Inscription auto + formulaire pré-rempli
3. ✅ Saisie email nouveau → Formulaire complet
4. ✅ Validation des emails invalides
5. ✅ Gestion des erreurs API