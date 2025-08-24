-- Script SQL pour créer la table session_attendance
-- À exécuter manuellement dans l'interface Supabase SQL Editor

-- Créer la table session_attendance
CREATE TABLE IF NOT EXISTS session_attendance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL,
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
      AND events.organizerId = auth.uid()
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

-- Message de confirmation
SELECT 'Table session_attendance créée avec succès!' as status;