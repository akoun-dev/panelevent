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
