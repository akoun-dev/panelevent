-- Create session_registrations table
CREATE TABLE IF NOT EXISTS session_registrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    function TEXT NOT NULL,
    organization TEXT NOT NULL,
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Add unique constraint to prevent duplicate registrations
    CONSTRAINT unique_session_email UNIQUE (session_id, email)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_session_registrations_session_id ON session_registrations(session_id);
CREATE INDEX IF NOT EXISTS idx_session_registrations_email ON session_registrations(email);
CREATE INDEX IF NOT EXISTS idx_session_registrations_registered_at ON session_registrations(registered_at);

-- Enable RLS (Row Level Security)
ALTER TABLE session_registrations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (since we use service role for registration)
-- Note: In production, you might want more restrictive policies
CREATE POLICY "Allow all operations on session_registrations" 
ON session_registrations 
FOR ALL 
USING (true);