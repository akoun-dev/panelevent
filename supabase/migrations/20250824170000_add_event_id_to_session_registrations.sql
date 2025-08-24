-- Add event_id column to session_registrations table
ALTER TABLE session_registrations 
ADD COLUMN IF NOT EXISTS event_id UUID;

-- Update existing records with a default event ID if needed
-- Note: This is a placeholder - you may want to handle existing data differently
UPDATE session_registrations 
SET event_id = '00000000-0000-0000-0000-000000000000' 
WHERE event_id IS NULL;

-- Make event_id NOT NULL after updating existing records
ALTER TABLE session_registrations 
ALTER COLUMN event_id SET NOT NULL;

-- Update unique constraint to include event_id
ALTER TABLE session_registrations 
DROP CONSTRAINT IF EXISTS unique_session_email;

ALTER TABLE session_registrations 
ADD CONSTRAINT unique_session_email UNIQUE (event_id, session_id, email);

-- Create index for event_id for faster queries
CREATE INDEX IF NOT EXISTS idx_session_registrations_event_id ON session_registrations(event_id);

-- Update existing indexes if needed
DROP INDEX IF EXISTS idx_session_registrations_session_id;
CREATE INDEX IF NOT EXISTS idx_session_registrations_session_id ON session_registrations(session_id);