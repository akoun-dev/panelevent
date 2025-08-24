-- Migration pour créer la table session_attendance
-- Cette table permet de suivre les présences aux sessions via QR codes

-- Créer la table session_attendance
CREATE TABLE IF NOT EXISTS session_attendance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  organization TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Contraintes
  CONSTRAINT fk_session_attendance_event
    FOREIGN KEY (event_id)
    REFERENCES events(id)
    ON DELETE CASCADE
);

-- Créer des index pour les recherches fréquentes
CREATE INDEX IF NOT EXISTS idx_session_attendance_event_id ON session_attendance(event_id);
CREATE INDEX IF NOT EXISTS idx_session_attendance_session_id ON session_attendance(session_id);
CREATE INDEX IF NOT EXISTS idx_session_attendance_email ON session_attendance(email);
CREATE INDEX IF NOT EXISTS idx_session_attendance_created_at ON session_attendance(created_at);

-- Ajouter des politiques RLS (Row Level Security)
ALTER TABLE session_attendance ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre aux administrateurs de voir toutes les présences
CREATE POLICY "Admins can view all session attendance" 
  ON session_attendance 
  FOR SELECT 
  USING (auth.jwt() ->> 'role' = 'ADMIN');

-- Politique pour permettre aux organisateurs de voir les présences de leurs événements
CREATE POLICY "Organizers can view their event session attendance" 
  ON session_attendance 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = session_attendance.event_id
      AND events."organizerId" = auth.uid()::text
    )
  );

-- Politique pour permettre l'insertion de nouvelles présences (public)
CREATE POLICY "Anyone can insert session attendance" 
  ON session_attendance 
  FOR INSERT 
  WITH CHECK (true);

-- Politique pour empêcher les mises à jour et suppressions
CREATE POLICY "No updates or deletions allowed" 
  ON session_attendance 
  FOR ALL 
  USING (false);

-- Fonction utilitaire pour obtenir les statistiques de présence par session
CREATE OR REPLACE FUNCTION get_session_attendance_stats(event_id_param UUID)
RETURNS TABLE (
  session_id TEXT,
  attendance_count BIGINT,
  last_attendance TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sa.session_id,
    COUNT(sa.id) as attendance_count,
    MAX(sa.created_at) as last_attendance
  FROM session_attendance sa
  WHERE sa.event_id = event_id_param
  GROUP BY sa.session_id
  ORDER BY attendance_count DESC;
END;
$$ LANGUAGE plpgsql STABLE;

-- Fonction pour vérifier si un email est déjà enregistré pour une session
CREATE OR REPLACE FUNCTION check_session_attendance_duplicate(
  event_id_param UUID,
  session_id_param TEXT,
  email_param TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM session_attendance 
    WHERE event_id = event_id_param 
    AND session_id = session_id_param 
    AND email = email_param
  );
END;
$$ LANGUAGE plpgsql STABLE;