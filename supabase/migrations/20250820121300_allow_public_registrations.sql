-- Allow public registrations for public events
CREATE POLICY "Allow public registrations" ON event_registrations
  FOR INSERT WITH CHECK (
    "isPublic" = true AND 
    "userId" IS NULL AND
    EXISTS (
      SELECT 1 FROM events 
      WHERE events.id = event_registrations."eventId" 
      AND events."isPublic" = true
    )
  );

-- Allow public to view public registrations (for counting purposes)
CREATE POLICY "Allow viewing public registrations" ON event_registrations
  FOR SELECT USING ("isPublic" = true);