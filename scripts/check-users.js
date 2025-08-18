const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Vérification des utilisateurs existants...')
  
  const users = await prisma.user.findMany()
  console.log('Utilisateurs trouvés:', users.length)
  
  users.forEach(user => {
    console.log(`- ID: ${user.id}, Email: ${user.email}, Rôle: ${user.role}`)
  })
  
  if (users.length === 0) {
    console.log('Création d\'un utilisateur organisateur...')
    
    const organizer = await prisma.user.create({
      data: {
        id: 'organizer-id',
        email: 'organizer@evenement.com',
        name: 'Organisateur Événement',
        role: 'ORGANIZER'
      }
    })
    
    console.log('Organisateur créé:', organizer.email)
    console.log('ID:', organizer.id)
  }
}

main()
  .catch((e) => {
    console.error('Erreur:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })