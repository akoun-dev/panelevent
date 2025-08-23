-- Create password reset tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  "expiresAt" TIMESTAMPTZ NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT password_reset_tokens_token_key UNIQUE (token),
  CONSTRAINT password_reset_tokens_userId_key UNIQUE ("userId")
);

-- Create index for faster token lookups
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expiresAt ON password_reset_tokens("expiresAt");

-- Enable RLS
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can only access their own reset tokens
CREATE POLICY "Users can view their own reset tokens" ON password_reset_tokens
  FOR SELECT USING (auth.uid() = "userId");

-- Users can insert their own reset tokens
CREATE POLICY "Users can create their own reset tokens" ON password_reset_tokens
  FOR INSERT WITH CHECK (auth.uid() = "userId");

-- Users can delete their own reset tokens
CREATE POLICY "Users can delete their own reset tokens" ON password_reset_tokens
  FOR DELETE USING (auth.uid() = "userId");

-- Admin can manage all reset tokens
CREATE POLICY "Admins can manage all reset tokens" ON password_reset_tokens
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'ADMIN'
    )
  );