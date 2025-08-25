-- Migration pour ajouter la colonne language aux tables d'inscription
-- Cette migration ajoute la colonne language aux tables event_registrations et session_registrations

-- Ajouter la colonne language à la table event_registrations
ALTER TABLE event_registrations 
ADD COLUMN IF NOT EXISTS language TEXT;

-- Ajouter la colonne language à la table session_registrations
ALTER TABLE session_registrations 
ADD COLUMN IF NOT EXISTS language TEXT;

-- Mettre à jour les inscriptions existantes avec une valeur par défaut si nécessaire
-- Pour les inscriptions existantes, on peut définir une langue par défaut (fr) ou laisser NULL
UPDATE event_registrations 
SET language = 'fr' 
WHERE language IS NULL;

UPDATE session_registrations 
SET language = 'fr' 
WHERE language IS NULL;

-- Créer des index pour faciliter les recherches par langue
CREATE INDEX IF NOT EXISTS idx_event_registrations_language ON event_registrations(language);
CREATE INDEX IF NOT EXISTS idx_session_registrations_language ON session_registrations(language);

-- Commentaire sur l'utilisation de la colonne
COMMENT ON COLUMN event_registrations.language IS 'Langue sélectionnée par le participant lors de l''inscription (fr, en, pt, es, ar)';
COMMENT ON COLUMN session_registrations.language IS 'Langue sélectionnée par le participant lors de l''inscription à la session (fr, en, pt, es, ar)';