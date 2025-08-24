-- Migration pour ajouter le champ isSession aux éléments de programme
-- Ce champ permet de marquer une activité comme session nécessitant une inscription

-- Fonction pour mettre à jour les programmes existants avec le champ isSession
CREATE OR REPLACE FUNCTION update_program_with_is_session()
RETURNS void AS $$
DECLARE
    event_record RECORD;
    program_data JSONB;
    updated_program JSONB;
    program_items JSONB;
    updated_items JSONB := '[]'::JSONB;
    item JSONB;
BEGIN
    -- Parcourir tous les événements qui ont un programme
    FOR event_record IN 
        SELECT id, program 
        FROM events 
        WHERE program IS NOT NULL 
        AND program::text != 'null'
    LOOP
        -- Convertir le programme en JSONB
        program_data := event_record.program::JSONB;
        
        -- Vérifier si le programme a des éléments
        IF program_data ? 'programItems' AND jsonb_typeof(program_data->'programItems') = 'array' THEN
            program_items := program_data->'programItems';
            updated_items := '[]'::JSONB;
            
            -- Parcourir chaque élément du programme
            FOR i IN 0..jsonb_array_length(program_items) - 1 LOOP
                item := program_items->i;
                
                -- Ajouter le champ isSession avec la valeur par défaut false
                item := jsonb_set(
                    item, 
                    '{isSession}', 
                    'false'::JSONB,
                    true
                );
                
                -- Ajouter l'élément mis à jour au tableau
                updated_items := updated_items || item;
            END LOOP;
            
            -- Mettre à jour le programme avec les éléments modifiés
            updated_program := jsonb_set(
                program_data,
                '{programItems}',
                updated_items,
                true
            );
            
            -- Mettre à jour l'événement avec le programme modifié
            UPDATE events 
            SET program = updated_program::text
            WHERE id = event_record.id;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Exécuter la fonction de mise à jour
SELECT update_program_with_is_session();

-- Nettoyer la fonction après utilisation
DROP FUNCTION update_program_with_is_session();

-- Ajouter un commentaire pour documenter le nouveau champ
COMMENT ON COLUMN events.program IS 'Programme de l''événement au format JSON, incluant maintenant le champ isSession pour chaque activité (booléen indiquant si c''est une session nécessitant inscription)';