-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE panels ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_votes ENABLE ROW LEVEL SECURITY;
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

-- Question votes
CREATE POLICY "Users manage own question votes" ON question_votes
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Panels
CREATE POLICY "Panels are viewable by everyone" ON panels
  FOR SELECT USING (true);
CREATE POLICY "Organizers manage panels" ON panels
  FOR ALL USING (
    auth.uid() = (
      SELECT organizer_id FROM events WHERE events.id = panels.event_id
    )
  ) WITH CHECK (
    auth.uid() = (
      SELECT organizer_id FROM events WHERE events.id = panels.event_id
    )
  );

-- Questions
CREATE POLICY "Questions are viewable by everyone" ON questions
  FOR SELECT USING (true);
CREATE POLICY "Anyone can create questions" ON questions
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Organizers update questions" ON questions
  FOR UPDATE USING (
    auth.uid() = (
      SELECT organizer_id FROM events e
      JOIN panels p ON p.event_id = e.id
      WHERE p.id = panel_id
    )
  ) WITH CHECK (
    auth.uid() = (
      SELECT organizer_id FROM events e
      JOIN panels p ON p.event_id = e.id
      WHERE p.id = panel_id
    )
  );
CREATE POLICY "Organizers delete questions" ON questions
  FOR DELETE USING (
    auth.uid() = (
      SELECT organizer_id FROM events e
      JOIN panels p ON p.event_id = e.id
      WHERE p.id = panel_id
    )
  );

-- Polls
CREATE POLICY "Polls are viewable by everyone" ON polls
  FOR SELECT USING (true);
CREATE POLICY "Organizers manage polls" ON polls
  FOR ALL USING (
    auth.uid() = (
      SELECT organizer_id FROM events WHERE events.id = polls.event_id
    )
  ) WITH CHECK (
    auth.uid() = (
      SELECT organizer_id FROM events WHERE events.id = polls.event_id
    )
  );

-- Poll options
CREATE POLICY "Poll options are viewable by everyone" ON poll_options
  FOR SELECT USING (true);
CREATE POLICY "Organizers manage poll options" ON poll_options
  FOR ALL USING (
    auth.uid() = (
      SELECT organizer_id FROM events e
      JOIN polls pl ON pl.event_id = e.id
      WHERE pl.id = poll_id
    )
  ) WITH CHECK (
    auth.uid() = (
      SELECT organizer_id FROM events e
      JOIN polls pl ON pl.event_id = e.id
      WHERE pl.id = poll_id
    )
  );

-- Certificate templates
CREATE POLICY "Organizers manage certificate templates" ON certificate_templates
  FOR ALL USING (
    auth.uid() = (
      SELECT organizer_id FROM events WHERE events.id = event_id
    )
  ) WITH CHECK (
    auth.uid() = (
      SELECT organizer_id FROM events WHERE events.id = event_id
    )
  );

-- Certificates
CREATE POLICY "Users view own certificates" ON certificates
  FOR SELECT USING (
    auth.uid() = user_id OR auth.uid() = (
      SELECT organizer_id FROM events WHERE events.id = event_id
    )
  );
CREATE POLICY "Organizers manage certificates" ON certificates
  FOR ALL USING (
    auth.uid() = (
      SELECT organizer_id FROM events WHERE events.id = event_id
    )
  ) WITH CHECK (
    auth.uid() = (
      SELECT organizer_id FROM events WHERE events.id = event_id
    )
  );

-- Feedbacks
CREATE POLICY "Users view own feedbacks" ON feedbacks
  FOR SELECT USING (
    auth.uid() = user_id OR auth.uid() = (
      SELECT organizer_id FROM events WHERE events.id = event_id
    )
  );
CREATE POLICY "Users manage own feedbacks" ON feedbacks
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Helpful votes
CREATE POLICY "Users manage own helpful votes" ON helpful_votes
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Registration tokens
CREATE POLICY "Organizers manage registration tokens" ON registration_tokens
  FOR ALL USING (
    auth.uid() = (
      SELECT organizer_id FROM events WHERE events.id = event_id
    )
  ) WITH CHECK (
    auth.uid() = (
      SELECT organizer_id FROM events WHERE events.id = event_id
    )
  );
