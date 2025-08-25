# Test du nouveau flux d'inscription aux sessions

## Nouveau flux implémenté :

1. **Page de vérification d'email** : `/session/{eventId}/{sessionId}/check-email`
   - Demande seulement l'email du participant
   - Vérifie si l'utilisateur est déjà inscrit à l'événement

2. **Scénario 1 : Utilisateur déjà inscrit à l'événement**
   - L'API retourne `exists: true` avec les données utilisateur
   - Redirection vers `/session/{eventId}/{sessionId}/register?email={email}`
   - Le formulaire est pré-rempli avec les informations existantes

3. **Scénario 2 : Utilisateur non inscrit à l'événement**
   - L'API retourne `exists: false`
   - Redirection vers `/register/{eventId}?redirectTo=/session/{eventId}/{sessionId}/register`
   - L'utilisateur doit d'abord s'inscrire à l'événement

## Modifications apportées :

### 1. API d'inscription aux sessions (`/api/sessions/register`)
- Ajout du paramètre `checkOnly` pour la vérification d'email
- Retourne les informations utilisateur si déjà inscrit à l'événement
- Gère à la fois la vérification et l'inscription complète

### 2. Nouvelle page de vérification d'email
- `/session/[eventId]/[sessionId]/check-email/page.tsx`
- Formulaire simple avec seulement l'email
- Redirection vers le bon flux selon le résultat

### 3. Formulaire d'inscription aux sessions mis à jour
- Accepte un paramètre `prefillEmail` pour pré-remplir les champs
- Charge automatiquement les données utilisateur si email fourni

### 4. Liens d'inscription modifiés
- Tous les liens pointent maintenant vers `/check-email` au lieu de `/register`
- Les QR codes et liens directs utilisent le nouveau flux

## Tests à effectuer :

1. **Test de la vérification d'email** : 
   - Accéder à `/session/event-123/session-456/check-email`
   - Entrer un email d'un utilisateur déjà inscrit à l'événement
   - Vérifier que le formulaire est pré-rempli

2. **Test de la redirection** :
   - Entrer un email d'un utilisateur non inscrit
   - Vérifier la redirection vers l'inscription à l'événement

3. **Test de l'inscription complète** :
   - Vérifier que l'inscription fonctionne normalement après la vérification

4. **Test des QR codes** :
   - Vérifier que les QR codes pointent vers la bonne URL