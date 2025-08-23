# Guide Utilisateur PanelEvent - Architecture des Rôles et Workflows

## 1. Rôles et Permissions

### Super Administrateur
**Description** : Accès complet à toute la plateforme avec droits de gestion système.

**Permissions** :
- ✅ Gestion de tous les utilisateurs (création, modification, suppression)
- ✅ Configuration des paramètres système globaux
- ✅ Accès à tous les événements et données analytiques
- ✅ Supervision des opérations de tous les rôles
- ✅ Gestion des templates de certificats et exports

### Administrateur d'Événement
**Description** : Responsable de la création et gestion complète d'un ou plusieurs événements.

**Permissions** :
- ✅ Création et configuration d'événements
- ✅ Gestion des sessions, programmes et intervenants
- ✅ Configuration des équipes de scanning et management
- ✅ Génération de rapports et statistiques d'événement
- ✅ Gestion des certificats et badges participants

### Participant
**Description** : Utilisateur final inscrit à un événement.

**Permissions** :
- 📝 Inscription aux événements disponibles
- 📅 Consultation du planning et programme
- 📋 Accès aux ressources de l'événement
- 📊 Feedback et évaluation de sessions

---

### Workflow des participants
- Scanne le QR code généré par l'administrateur d'événement (afficher sur les totems etc...)
- il prend connaissance du consentement