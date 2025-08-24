-- Initial Supabase schema
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'UserRole') THEN
        CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'ORGANIZER', 'ATTENDEE');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'QuestionStatus') THEN
        CREATE TYPE "QuestionStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'VoteType') THEN
        CREATE TYPE "VoteType" AS ENUM ('UP', 'DOWN');
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS users (
  id text PRIMARY KEY,
  email text NOT NULL,
  name text,
  role "UserRole" NOT NULL DEFAULT 'ATTENDEE',
  avatar text,
  "passwordHash" text,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT users_email_key UNIQUE (email)
);
-- Events are organized by users; an event can have many panels and registrations
CREATE TABLE IF NOT EXISTS events (
  id text PRIMARY KEY,
  title text NOT NULL,
  description text,
  slug text NOT NULL,
  "startDate" timestamptz NOT NULL,
  "endDate" timestamptz,
  location text,
  "isPublic" boolean NOT NULL DEFAULT true,
  "isActive" boolean NOT NULL DEFAULT false,
  branding jsonb,
  program text,
  "qrCode" text,
  "maxAttendees" integer,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now(),
  "organizerId" text NOT NULL,
  CONSTRAINT events_slug_key UNIQUE (slug),
  CONSTRAINT events_organizerId_fkey FOREIGN KEY ("organizerId") REFERENCES users(id) ON DELETE RESTRICT
);

-- Panels are sessions within events
CREATE TABLE IF NOT EXISTS panels (
  id text PRIMARY KEY,
  title text NOT NULL,
  description text,
  "startTime" timestamptz,
  "endTime" timestamptz,
  "eventId" text NOT NULL,
  "allowQuestions" boolean NOT NULL DEFAULT false,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT panels_eventId_fkey FOREIGN KEY ("eventId") REFERENCES events(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS questions (
  id text PRIMARY KEY,
  content text NOT NULL,
  status "QuestionStatus" NOT NULL DEFAULT 'PENDING',
  "authorName" text NOT NULL,
  "authorEmail" text NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now(),
  "eventId" text NOT NULL,
  "panelId" text,
  CONSTRAINT questions_eventId_fkey FOREIGN KEY ("eventId") REFERENCES events(id) ON DELETE CASCADE,
  CONSTRAINT questions_panelId_fkey FOREIGN KEY ("panelId") REFERENCES panels(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS question_votes (
  "questionId" text NOT NULL,
  "userId" text NOT NULL,
  type "VoteType" NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT question_votes_pkey PRIMARY KEY ("questionId", "userId"),
  CONSTRAINT question_votes_questionId_fkey FOREIGN KEY ("questionId") REFERENCES questions(id) ON DELETE CASCADE,
  CONSTRAINT question_votes_userId_fkey FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS polls (
  id text PRIMARY KEY,
  question text NOT NULL,
  description text,
  "isActive" boolean NOT NULL DEFAULT false,
  "isAnonymous" boolean NOT NULL DEFAULT false,
  "allowMultipleVotes" boolean NOT NULL DEFAULT false,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now(),
  "eventId" text NOT NULL,
  CONSTRAINT polls_eventId_fkey FOREIGN KEY ("eventId") REFERENCES events(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS poll_options (
  id text PRIMARY KEY,
  text text NOT NULL,
  "order" integer NOT NULL DEFAULT 0,
  "pollId" text NOT NULL,
  CONSTRAINT poll_options_pollId_fkey FOREIGN KEY ("pollId") REFERENCES polls(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS poll_responses (
  id text PRIMARY KEY,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "userId" text NOT NULL,
  "pollId" text NOT NULL,
  "optionId" text NOT NULL,
  CONSTRAINT poll_responses_userId_pollId_optionId_key UNIQUE ("userId", "pollId", "optionId"),
  CONSTRAINT poll_responses_userId_fkey FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT poll_responses_pollId_fkey FOREIGN KEY ("pollId") REFERENCES polls(id) ON DELETE CASCADE,
  CONSTRAINT poll_responses_optionId_fkey FOREIGN KEY ("optionId") REFERENCES poll_options(id) ON DELETE CASCADE
);
-- Association table linking users and events with dedicated RLS policies
CREATE TABLE IF NOT EXISTS event_registrations (
  id text PRIMARY KEY,
  email text,
  "firstName" text,
  "lastName" text,
  phone text,
  company text,
  position text,
  experience text,
  expectations text,
  "dietaryRestrictions" text,
  consent boolean NOT NULL DEFAULT false,
  "isPublic" boolean NOT NULL DEFAULT true,
  attended boolean NOT NULL DEFAULT false,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "userId" text,
  "eventId" text NOT NULL,
  CONSTRAINT event_registrations_userId_eventId_key UNIQUE ("userId", "eventId"),
  CONSTRAINT event_registrations_userId_fkey FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT event_registrations_eventId_fkey FOREIGN KEY ("eventId") REFERENCES events(id) ON DELETE CASCADE
);

-- Enable row level security for the association table
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

-- Users can manage their own registrations
CREATE POLICY "Users manage own registrations" ON event_registrations
  FOR ALL USING (auth.uid()::text = "userId") WITH CHECK (auth.uid()::text = "userId");

-- Event organizers can manage registrations for their events
CREATE POLICY "Organizers manage event registrations" ON event_registrations
  FOR ALL USING (
    auth.uid()::text = (
      SELECT "organizerId" FROM events WHERE events.id = event_registrations."eventId"
    )
  );

CREATE TABLE IF NOT EXISTS certificate_templates (
  id text PRIMARY KEY,
  title text NOT NULL,
  description text,
  content text NOT NULL,
  "autoGenerate" boolean NOT NULL DEFAULT false,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now(),
  "eventId" text NOT NULL,
  "userId" text,
  CONSTRAINT certificate_templates_eventId_fkey FOREIGN KEY ("eventId") REFERENCES events(id) ON DELETE CASCADE,
  CONSTRAINT certificate_templates_userId_fkey FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS certificates (
  id text PRIMARY KEY,
  content text NOT NULL,
  "issuedAt" timestamptz NOT NULL DEFAULT now(),
  "certificateUrl" text NOT NULL,
  "qrCodeUrl" text NOT NULL,
  "verifiedAt" timestamptz,
  "templateId" text NOT NULL,
  "userId" text NOT NULL,
  "eventId" text NOT NULL,
  CONSTRAINT certificates_templateId_userId_key UNIQUE ("templateId", "userId"),
  CONSTRAINT certificates_templateId_fkey FOREIGN KEY ("templateId") REFERENCES certificate_templates(id) ON DELETE CASCADE,
  CONSTRAINT certificates_userId_fkey FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT certificates_eventId_fkey FOREIGN KEY ("eventId") REFERENCES events(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS feedbacks (
  id text PRIMARY KEY,
  rating integer NOT NULL,
  comment text,
  category text NOT NULL,
  resolved boolean NOT NULL DEFAULT false,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "userId" text NOT NULL,
  "eventId" text NOT NULL,
  CONSTRAINT feedbacks_userId_eventId_key UNIQUE ("userId", "eventId"),
  CONSTRAINT feedbacks_userId_fkey FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT feedbacks_eventId_fkey FOREIGN KEY ("eventId") REFERENCES events(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS helpful_votes (
  "feedbackId" text NOT NULL,
  "userId" text NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT helpful_votes_pkey PRIMARY KEY ("feedbackId", "userId"),
  CONSTRAINT helpful_votes_feedbackId_fkey FOREIGN KEY ("feedbackId") REFERENCES feedbacks(id) ON DELETE CASCADE,
  CONSTRAINT helpful_votes_userId_fkey FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "RegistrationToken" (
  id text PRIMARY KEY,
  token text NOT NULL,
  "eventId" text NOT NULL,
  "expiresAt" timestamptz NOT NULL,
  used boolean NOT NULL DEFAULT false,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT "RegistrationToken_token_key" UNIQUE (token),
  CONSTRAINT "RegistrationToken_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES events(id) ON DELETE RESTRICT
);

-- Indexes for frequently filtered columns
CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_feedbacks_eventId ON feedbacks("eventId");
