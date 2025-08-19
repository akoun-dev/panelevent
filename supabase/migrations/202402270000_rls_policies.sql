-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE panels ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificate_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE helpful_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE registration_tokens ENABLE ROW LEVEL SECURITY;

-- Additional indexes for frequent queries
CREATE INDEX IF NOT EXISTS event_registrations_user_id_idx ON event_registrations(user_id);
CREATE INDEX IF NOT EXISTS poll_responses_poll_id_idx ON poll_responses(poll_id);

-- RLS Policies
-- Users
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own row" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Events
CREATE POLICY "Events are viewable by everyone" ON events
  FOR SELECT USING (true);
CREATE POLICY "Organizers manage events" ON events
  FOR ALL USING (auth.uid() = organizer_id) WITH CHECK (auth.uid() = organizer_id);

-- Event registrations
CREATE POLICY "Users view own registrations" ON event_registrations
  FOR SELECT USING (
    auth.uid() = user_id
    OR auth.uid() = (SELECT organizer_id FROM events WHERE events.id = event_id)
  );
CREATE POLICY "Users manage own registrations" ON event_registrations
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Poll responses
CREATE POLICY "Users manage own poll responses" ON poll_responses
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
