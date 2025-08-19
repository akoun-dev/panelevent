const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ SUPABASE_URL ou SUPABASE_KEY non configurée')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function main() {
  console.log('Vérification des utilisateurs existants...')

  const { data: users = [], error } = await supabase.from('users').select('*')
  if (error) throw error

  console.log('Utilisateurs trouvés:', users.length)
  users.forEach(user => {
    console.log(`- ID: ${user.id}, Email: ${user.email}, Rôle: ${user.role}`)
  })

  if (users.length === 0) {
    console.log("Création d'un utilisateur organisateur...")

    const { data: organizer, error: insertError } = await supabase
      .from('users')
      .insert({
        id: 'organizer-id',
        email: 'organizer@evenement.com',
        name: 'Organisateur Événement',
        role: 'ORGANIZER'
      })
      .select()
      .single()

    if (insertError) throw insertError

    console.log('Organisateur créé:', organizer.email)
    console.log('ID:', organizer.id)
  }
}

main().catch((e) => {
  console.error('Erreur:', e)
  process.exit(1)
})

