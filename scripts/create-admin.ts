import { supabase } from '@/lib/supabase'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'

async function createAdmin() {
  const hashedPassword = await bcrypt.hash('supersecret', 10)

  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('email', 'admin@example.com')
    .maybeSingle()

  if (existing) {
    await supabase
      .from('users')
      .update({ passwordHash: hashedPassword, role: 'ADMIN', name: 'Admin' })
      .eq('id', existing.id)
  } else {
    await supabase.from('users').insert({
      id: uuidv4(),
      email: 'admin@example.com',
      name: 'Admin',
      role: 'ADMIN',
      passwordHash: hashedPassword
    })
  }

  console.log('Admin user created/updated')
}

createAdmin().catch(e => {
  console.error('Error creating admin:', e)
  process.exit(1)
})
