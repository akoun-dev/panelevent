// scripts/seed_users.ts
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  // ⚠️ Table ciblée : users (table applicative, pas auth.users)
  // Assure-toi que la colonne `email` est UNIQUE pour que onConflict fonctionne.
  const payload = [
    {
      id: 'admin-user-id',
      email: 'admin@panelevent.com',
      name: 'Administrateur',
      role: 'ADMIN',
      passwordHash: bcrypt.hashSync('AdminPanelEvent', 10),
    },
    {
      id: 'organizer-user-id',
      email: 'organizer@panelevent.com',
      name: 'Organisateur Demo',
      role: 'ORGANIZER',
      passwordHash: bcrypt.hashSync('organizerPanelEvent', 10),
    },
  ];

  const { error } = await supabase
    .from('users')
    .upsert(payload, { onConflict: 'email' });

  if (error) {
    throw error;
  }

  console.log('🌱 Comptes seedés (users uniquement).');
}

main().catch((err) => {
  console.error('❌ Erreur seed users:', err);
  process.exit(1);
});
