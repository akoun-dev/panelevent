import { db } from '@/lib/supabase'
import bcrypt from 'bcryptjs'

async function createAdmin() {
  const hashedPassword = await bcrypt.hash('supersecret', 10)
  
  await db.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin',
      role: 'ADMIN',
      passwordHash: hashedPassword
    }
  })

  console.log('Admin user created/updated')
}

createAdmin()
  .catch(e => {
    console.error('Error creating admin:', e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })