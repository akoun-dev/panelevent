// Script pour créer manuellement la table session_registrations
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function createSessionTable() {
  if (!supabaseUrl || !serviceRoleKey) {
    console.error('Variables d\'environnement manquantes');
    console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'défini' : 'indéfini');
    console.log('SUPABASE_SERVICE_ROLE_KEY:', serviceRoleKey ? 'défini' : 'indéfini');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false }
  });

  try {
    console.log('Création de la table session_registrations...');

    // SQL pour créer la table
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS session_registrations (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        session_id TEXT NOT NULL,
        event_id TEXT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT NOT NULL,
        function TEXT NOT NULL,
        organization TEXT NOT NULL,
        language TEXT DEFAULT 'fr',
        registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        
        -- Add unique constraint to prevent duplicate registrations
        CONSTRAINT unique_session_email UNIQUE (session_id, email)
      );

      -- Create indexes for faster queries
      CREATE INDEX IF NOT EXISTS idx_session_registrations_session_id ON session_registrations(session_id);
      CREATE INDEX IF NOT EXISTS idx_session_registrations_email ON session_registrations(email);
      CREATE INDEX IF NOT EXISTS idx_session_registrations_registered_at ON session_registrations(registered_at);

      -- Enable RLS (Row Level Security)
      ALTER TABLE session_registrations ENABLE ROW LEVEL SECURITY;

      -- Create policy to allow all operations (since we use service role for registration)
      CREATE POLICY "Allow all operations on session_registrations" 
      ON session_registrations 
      FOR ALL 
      USING (true);
    `;

    // Exécuter le SQL
    const { error } = await supabase.rpc('exec_sql', { sql: createTableSQL });

    if (error) {
      console.error('Erreur lors de la création de la table:', error);
    } else {
      console.log('Table session_registrations créée avec succès !');
    }

  } catch (error) {
    console.error('Erreur inattendue:', error);
  }
}

createSessionTable();