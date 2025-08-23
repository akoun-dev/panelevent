-- Add indexes to frequently filtered columns
CREATE INDEX IF NOT EXISTS panels_event_id_idx ON panels("eventId");
CREATE INDEX IF NOT EXISTS questions_event_id_idx ON questions("eventId");
CREATE INDEX IF NOT EXISTS polls_event_id_idx ON polls("eventId");
CREATE INDEX IF NOT EXISTS event_registrations_event_id_idx ON event_registrations("eventId");
CREATE INDEX IF NOT EXISTS event_registrations_user_id_idx ON event_registrations("userId");
CREATE INDEX IF NOT EXISTS certificate_templates_event_id_idx ON certificate_templates("eventId");
CREATE INDEX IF NOT EXISTS certificate_templates_user_id_idx ON certificate_templates("userId");
CREATE INDEX IF NOT EXISTS certificates_event_id_idx ON certificates("eventId");
CREATE INDEX IF NOT EXISTS certificates_user_id_idx ON certificates("userId");
CREATE INDEX IF NOT EXISTS feedbacks_event_id_idx ON feedbacks("eventId");
CREATE INDEX IF NOT EXISTS feedbacks_user_id_idx ON feedbacks("userId");
