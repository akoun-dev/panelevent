-- Documentation des politiques RLS pour Supabase

-- Table: users
--   - Users can view/update/insert only their own record.
--   - Policies:
--       CREATE POLICY "Users can view own data" ON users
--         FOR SELECT USING (auth.uid() = id);
--       CREATE POLICY "Users can update own data" ON users
--         FOR UPDATE USING (auth.uid() = id);
--       CREATE POLICY "Users can insert own row" ON users
--         FOR INSERT WITH CHECK (auth.uid() = id);

-- Table: events
--   - All users can view events.
--   - Only the organizer (auth.uid() = organizer_id) can insert, update or delete.
--       CREATE POLICY "Events are viewable by everyone" ON events
--         FOR SELECT USING (true);
--       CREATE POLICY "Organizers manage events" ON events
--         FOR ALL USING (auth.uid() = organizer_id) WITH CHECK (auth.uid() = organizer_id);

-- Table: event_registrations
--   - Users can view their own registrations and organizers can view registrations for their events.
--   - Users can insert/update/delete only their own registrations.
--       CREATE POLICY "Users view own registrations" ON event_registrations
--         FOR SELECT USING (
--           auth.uid() = user_id
--           OR auth.uid() = (SELECT organizer_id FROM events WHERE events.id = event_id)
--         );
--       CREATE POLICY "Users manage own registrations" ON event_registrations
--         FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Table: poll_responses
--   - Users can insert/update/delete only their own responses.
--       CREATE POLICY "Users manage own poll responses" ON poll_responses
--         FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Table: question_votes
--   - Users can manage their own votes.
--       CREATE POLICY "Users manage own question votes" ON question_votes
--         FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Table: panels
--   - All users can view panels; only the organizer of the related event can modify.
--       CREATE POLICY "Panels are viewable by everyone" ON panels
--         FOR SELECT USING (true);
--       CREATE POLICY "Organizers manage panels" ON panels
--         FOR ALL USING (auth.uid() = (SELECT organizer_id FROM events WHERE events.id = panels.event_id)) WITH CHECK (auth.uid() = (SELECT organizer_id FROM events WHERE events.id = panels.event_id));

-- Table: questions
--   - Everyone can view and create questions.
--   - Only event organizers can update or delete questions.
--       CREATE POLICY "Questions are viewable by everyone" ON questions
--         FOR SELECT USING (true);
--       CREATE POLICY "Anyone can create questions" ON questions
--         FOR INSERT WITH CHECK (true);
--       CREATE POLICY "Organizers update questions" ON questions
--         FOR UPDATE USING (auth.uid() = (SELECT organizer_id FROM events e JOIN panels p ON p.event_id = e.id WHERE p.id = panel_id)) WITH CHECK (auth.uid() = (SELECT organizer_id FROM events e JOIN panels p ON p.event_id = e.id WHERE p.id = panel_id));
--       CREATE POLICY "Organizers delete questions" ON questions
--         FOR DELETE USING (auth.uid() = (SELECT organizer_id FROM events e JOIN panels p ON p.event_id = e.id WHERE p.id = panel_id));

-- Table: polls
--   - All users can view polls; only the organizer can modify them.
--       CREATE POLICY "Polls are viewable by everyone" ON polls
--         FOR SELECT USING (true);
--       CREATE POLICY "Organizers manage polls" ON polls
--         FOR ALL USING (auth.uid() = (SELECT organizer_id FROM events WHERE events.id = polls.event_id)) WITH CHECK (auth.uid() = (SELECT organizer_id FROM events WHERE events.id = polls.event_id));

-- Table: poll_options
--   - All users can view options; only the organizer can modify.
--       CREATE POLICY "Poll options are viewable by everyone" ON poll_options
--         FOR SELECT USING (true);
--       CREATE POLICY "Organizers manage poll options" ON poll_options
--         FOR ALL USING (auth.uid() = (SELECT organizer_id FROM events e JOIN polls pl ON pl.event_id = e.id WHERE pl.id = poll_id)) WITH CHECK (auth.uid() = (SELECT organizer_id FROM events e JOIN polls pl ON pl.event_id = e.id WHERE pl.id = poll_id));

-- Table: certificate_templates
--   - Only event organizers can view and manage templates.
--       CREATE POLICY "Organizers manage certificate templates" ON certificate_templates
--         FOR ALL USING (auth.uid() = (SELECT organizer_id FROM events WHERE events.id = event_id)) WITH CHECK (auth.uid() = (SELECT organizer_id FROM events WHERE events.id = event_id));

-- Table: certificates
--   - Users can view their own certificates and organizers can manage certificates for their events.
--       CREATE POLICY "Users view own certificates" ON certificates
--         FOR SELECT USING (auth.uid() = user_id OR auth.uid() = (SELECT organizer_id FROM events WHERE events.id = event_id));
--       CREATE POLICY "Organizers manage certificates" ON certificates
--         FOR ALL USING (auth.uid() = (SELECT organizer_id FROM events WHERE events.id = event_id)) WITH CHECK (auth.uid() = (SELECT organizer_id FROM events WHERE events.id = event_id));

-- Table: feedbacks
--   - Users can view their feedback and organizers can view feedback for their events.
--   - Users can insert/update/delete only their own feedback.
--       CREATE POLICY "Users view own feedbacks" ON feedbacks
--         FOR SELECT USING (auth.uid() = user_id OR auth.uid() = (SELECT organizer_id FROM events WHERE events.id = event_id));
--       CREATE POLICY "Users manage own feedbacks" ON feedbacks
--         FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Table: helpful_votes
--   - Users can manage their own helpful votes.
--       CREATE POLICY "Users manage own helpful votes" ON helpful_votes
--         FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Table: registration_tokens
--   - Only organizers can manage tokens for their events.
--       CREATE POLICY "Organizers manage registration tokens" ON registration_tokens
--         FOR ALL USING (auth.uid() = (SELECT organizer_id FROM events WHERE events.id = event_id)) WITH CHECK (auth.uid() = (SELECT organizer_id FROM events WHERE events.id = event_id));
