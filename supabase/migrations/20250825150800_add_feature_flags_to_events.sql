-- Add feature flags columns to events table
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS hasCertificates BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS hasQa BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS hasPolls BOOLEAN DEFAULT FALSE;

-- Add comments to explain the new columns
COMMENT ON COLUMN events.hasCertificates IS 'Indicates if certificates feature is enabled for this event';
COMMENT ON COLUMN events.hasQa IS 'Indicates if Q&A feature is enabled for this event';
COMMENT ON COLUMN events.hasPolls IS 'Indicates if polls feature is enabled for this event';

-- Update existing events to have default values
UPDATE events 
SET 
  hasCertificates = COALESCE(hasCertificates, FALSE),
  hasQa = COALESCE(hasQa, FALSE),
  hasPolls = COALESCE(hasPolls, FALSE)
WHERE hasCertificates IS NULL OR hasQa IS NULL OR hasPolls IS NULL;