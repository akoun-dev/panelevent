import { createClient } from '@supabase/supabase-js'

// Configuration de Supabase
const supabaseUrl = 'https://kjprigldhepbqhwqehrq.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqcHJpZ2xkaGVwYnFod3FlaHJxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTU0NTk5MywiZXhwIjoyMDcxMTIxOTkzfQ.PgrtDo9uhIJmsLl5Qj8Hs3QqlAqB3g0-AOxEfa0RRjE'

const supabase = createClient(supabaseUrl, supabaseServiceKey, { 
  auth: { persistSession: false } 
})

async function migrateBrandingData() {
  console.log('🔄 Migration des données de branding...')
  
  try {
    // Récupérer tous les événements avec des données de branding
    const { data: events, error } = await supabase
      .from('events')
      .select('id, title, branding')
      .not('branding', 'is', null)
    
    if (error) {
      console.error('❌ Erreur lors de la récupération des événements:', error)
      return
    }
    
    if (!events || events.length === 0) {
      console.log('ℹ️ Aucun événement avec des données de branding trouvé')
      return
    }
    
    console.log(`📊 ${events.length} événement(s) avec des données de branding trouvé(s)`)
    
    let updatedCount = 0
    
    for (const event of events) {
      console.log(`\n🔍 Traitement de l'événement: ${event.title}`)
      console.log('Données de branding actuelles:', event.branding)
      
      let newBrandingData = {}
      
      // Si les données existantes contiennent un qrCode, le conserver
      if (event.branding && event.branding.qrCode) {
        newBrandingData.qrCode = event.branding.qrCode
      }
      
      // Ajouter les couleurs par défaut si elles n'existent pas
      if (!event.branding || !event.branding.primaryColor) {
        newBrandingData.primaryColor = '#3b82f6'
      } else {
        newBrandingData.primaryColor = event.branding.primaryColor
      }
      
      if (!event.branding || !event.branding.secondaryColor) {
        newBrandingData.secondaryColor = '#64748b'
      } else {
        newBrandingData.secondaryColor = event.branding.secondaryColor
      }
      
      if (!event.branding || !event.branding.accentColor) {
        newBrandingData.accentColor = '#f59e0b'
      } else {
        newBrandingData.accentColor = event.branding.accentColor
      }
      
      console.log('Nouvelles données de branding:', newBrandingData)
      
      // Mettre à jour l'événement
      const { error: updateError } = await supabase
        .from('events')
        .update({ branding: newBrandingData })
        .eq('id', event.id)
      
      if (updateError) {
        console.error(`❌ Erreur lors de la mise à jour de l'événement ${event.id}:`, updateError)
      } else {
        console.log('✅ Données de branding mises à jour avec succès')
        updatedCount++
      }
    }
    
    console.log(`\n🎉 Migration terminée: ${updatedCount}/${events.length} événement(s) mis à jour`)
    
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error)
  }
}

// Exécuter la migration
migrateBrandingData()