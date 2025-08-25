import { createClient } from '@supabase/supabase-js'

// Configuration de Supabase pour le script
const supabaseUrl = 'https://kjprigldhepbqhwqehrq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqcHJpZ2xkaGVwYnFod3FlaHJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NDU5OTMsImV4cCI6MjA3MTEyMTk5M30.rDwpZRssCq0gzPRnZl7w4t5o3coQGx88qkvslfGx5uc'

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false }
})

async function testBrandingAPI() {
  console.log('🧪 Test de l\'API de branding...')
  
  try {
    // Récupérer un événement existant pour tester
    const { data: events, error } = await supabase
      .from('events')
      .select('id, title, branding')
      .limit(1)
    
    if (error) {
      console.error('❌ Erreur lors de la récupération des événements:', error)
      return
    }
    
    if (!events || events.length === 0) {
      console.log('ℹ️ Aucun événement trouvé pour tester')
      return
    }
    
    const event = events[0]
    console.log('📋 Événement trouvé:', {
      id: event.id,
      title: event.title,
      branding: event.branding
    })
    
    // Tester une requête PATCH avec les nouvelles couleurs
    const testBrandingData = {
      branding: {
        primaryColor: '#3b82f6',
        secondaryColor: '#64748b',
        accentColor: '#f59e0b'
      }
    }
    
    console.log('🚀 Envoi des données de test:', testBrandingData)
    
    // Simuler une requête API
    const response = await fetch(`http://localhost:3000/api/organizer/events/${event.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testBrandingData)
    })
    
    console.log('📊 Réponse API:')
    console.log('Status:', response.status)
    console.log('Status Text:', response.statusText)
    
    if (!response.ok) {
      const errorData = await response.json()
      console.error('❌ Erreur de l\'API:', errorData)
    } else {
      const result = await response.json()
      console.log('✅ Succès:', result)
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error)
  }
}

// Exécuter le test
testBrandingAPI()