const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ SUPABASE_URL ou SUPABASE_KEY non configurée')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function main() {
  console.log("Création de l'événement de démonstration...")

  const { data: event, error } = await supabase
    .from('events')
    .insert({
      id: 'event-2024',
      title: 'Événement 2024',
      description: 'Un événement exceptionnel avec des conférences, ateliers et sessions de networking',
      slug: 'evenement-2024',
      startDate: '2024-12-15T08:30:00.000Z',
      endDate: '2024-12-15T18:00:00.000Z',
      location: 'Centre de Conférences, Paris',
      isPublic: true,
      isActive: true,
      maxAttendees: 200,
      qrCode: 'https://example.com/qr/evenement-2024',
      organizerId: 'cmeahwvmz0001nudw0y8mvbym', // ID de l'organisateur existant
      program: JSON.stringify([
        {
          time: '08:30',
          title: 'Accueil et café',
          description: 'Bienvenue ! Prenez votre café et faites des connaissances avant le début des conférences.',
          location: "Hall d'entrée",
          type: 'break'
        },
        {
          time: '09:00',
          title: 'Ouverture officielle',
          description: "Discours d'ouverture et présentation du programme de la journée.",
          speaker: 'Marie Dubois - Directrice',
          location: 'Amphithéâtre principal',
          type: 'ceremony'
        },
        {
          time: '09:30',
          title: "L'avenir de l'intelligence artificielle",
          description: 'Découvrez les dernières avancées en IA et leur impact sur notre quotidien.',
          speaker: 'Dr. Jean Martin - Expert IA',
          location: 'Amphithéâtre principal',
          type: 'conference'
        },
        {
          time: '10:30',
          title: 'Atelier : Introduction au Machine Learning',
          description: 'Atelier pratique pour comprendre les bases du Machine Learning.',
          speaker: 'Sophie Bernard - Data Scientist',
          location: 'Salle A',
          type: 'workshop'
        },
        {
          time: '11:30',
          title: "Pause café et networking",
          description: "Moment d'échange et de networking entre les participants.",
          location: 'Espace détente',
          type: 'networking'
        },
        {
          time: '12:00',
          title: 'Déjeuner',
          description: 'Buffet déjeuner et continuation des échanges informels.',
          location: 'Restaurant',
          type: 'break'
        },
        {
          time: '14:00',
          title: 'Cybersécurité : Enjeux actuels',
          description: "Comprendre les menaces actuelles et comment s'en protéger.",
          speaker: 'Pierre Durand - Expert Cybersécurité',
          location: 'Amphithéâtre principal',
          type: 'conference'
        },
        {
          time: '15:00',
          title: 'Atelier : Sécurité des applications web',
          description: 'Apprenez à sécuriser vos applications web contre les attaques courantes.',
          speaker: 'Claire Lefebvre - Développeuse Senior',
          location: 'Salle A',
          type: 'workshop'
        },
        {
          time: '16:00',
          title: 'Pause café',
          description: 'Petite pause pour recharger les batteries.',
          location: 'Espace détente',
          type: 'break'
        },
        {
          time: '16:30',
          title: "Table ronde : L'avenir du travail",
          description: "Discussion sur le futur du travail à l'ère du numérique.",
          speaker: 'Plusieurs experts',
          location: 'Amphithéâtre principal',
          type: 'conference'
        },
        {
          time: '17:30',
          title: 'Cérémonie de clôture et remise des prix',
          description: "Clôture de l'événement et remise des prix aux meilleurs projets.",
          speaker: 'Organisateurs',
          location: 'Amphithéâtre principal',
          type: 'ceremony'
        }
      ])
    })
    .select()
    .single()

  if (error) throw error

  console.log('Événement créé avec succès:', event.title)
  console.log('ID:', event.id)
  console.log('Slug:', event.slug)
}

main().catch((e) => {
  console.error("Erreur lors de la création de l'événement:", e)
  process.exit(1)
})

