-- Migration pour ajouter le support multilingue aux événements
-- Cette migration modifie la table events pour supporter les titres, descriptions et lieux multilingues

-- Ajouter les nouveaux champs JSONB pour les données multilingues
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS title_translations JSONB,
ADD COLUMN IF NOT EXISTS description_translations JSONB,
ADD COLUMN IF NOT EXISTS location_translations JSONB;

-- Mettre à jour les événements existants pour migrer les données vers la nouvelle structure
UPDATE events 
SET 
  title_translations = jsonb_build_object('fr', title),
  description_translations = CASE 
    WHEN description IS NOT NULL THEN jsonb_build_object('fr', description)
    ELSE NULL 
  END,
  location_translations = CASE 
    WHEN location IS NOT NULL THEN jsonb_build_object('fr', location)
    ELSE NULL 
  END;

-- Créer des index pour les recherches dans les champs JSONB
CREATE INDEX IF NOT EXISTS idx_events_title_translations ON events USING GIN (title_translations);
CREATE INDEX IF NOT EXISTS idx_events_description_translations ON events USING GIN (description_translations);
CREATE INDEX IF NOT EXISTS idx_events_location_translations ON events USING GIN (location_translations);

-- Fonction utilitaire pour extraire une traduction avec fallback
CREATE OR REPLACE FUNCTION get_translation(translations JSONB, lang_code TEXT, fallback_lang TEXT DEFAULT 'fr')
RETURNS TEXT AS $$
BEGIN
  RETURN COALESCE(
    translations->>lang_code,
    translations->>fallback_lang,
    (SELECT value FROM jsonb_each_text(translations) LIMIT 1)
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Fonction pour obtenir le titre dans une langue spécifique
CREATE OR REPLACE FUNCTION get_event_title(event_id TEXT, lang_code TEXT DEFAULT 'fr')
RETURNS TEXT AS $$
DECLARE
  result TEXT;
BEGIN
  SELECT COALESCE(
    get_translation(title_translations, lang_code),
    title
  ) INTO result
  FROM events 
  WHERE id = event_id;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour obtenir la description dans une langue spécifique
CREATE OR REPLACE FUNCTION get_event_description(event_id TEXT, lang_code TEXT DEFAULT 'fr')
RETURNS TEXT AS $$
DECLARE
  result TEXT;
BEGIN
  SELECT COALESCE(
    get_translation(description_translations, lang_code),
    description
  ) INTO result
  FROM events 
  WHERE id = event_id;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour obtenir le lieu dans une langue spécifique
CREATE OR REPLACE FUNCTION get_event_location(event_id TEXT, lang_code TEXT DEFAULT 'fr')
RETURNS TEXT AS $$
DECLARE
  result TEXT;
BEGIN
  SELECT COALESCE(
    get_translation(location_translations, lang_code),
    location
  ) INTO result
  FROM events 
  WHERE id = event_id;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Vue pour faciliter l'accès aux événements avec les traductions
CREATE OR REPLACE VIEW events_with_translations AS
SELECT
  id,
  title,
  description,
  location,
  title_translations,
  description_translations,
  location_translations,
  slug,
  "startDate",
  "endDate",
  "isPublic",
  "isActive",
  "maxAttendees",
  "organizerId",
  program,
  "qrCode",
  branding,
  "createdAt",
  "updatedAt",
  -- Fonctions pour obtenir les traductions
  get_event_title(id, 'fr') as title_fr,
  get_event_title(id, 'en') as title_en,
  get_event_title(id, 'pt') as title_pt,
  get_event_title(id, 'es') as title_es,
  get_event_title(id, 'ar') as title_ar,
  get_event_description(id, 'fr') as description_fr,
  get_event_description(id, 'en') as description_en,
  get_event_description(id, 'pt') as description_pt,
  get_event_description(id, 'es') as description_es,
  get_event_description(id, 'ar') as description_ar,
  get_event_location(id, 'fr') as location_fr,
  get_event_location(id, 'en') as location_en,
  get_event_location(id, 'pt') as location_pt,
  get_event_location(id, 'es') as location_es,
  get_event_location(id, 'ar') as location_ar
FROM events;