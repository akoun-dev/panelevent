import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kjprigldhepbqhwqehrq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqcHJpZ2xkaGVwYnFod3FlaHJxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTU0NTk5MywiZXhwIjoyMDcxMTIxOTkzfQ.PgrtDo9uhIJmsLl5Qj8Hs3QqlAqB3g0-AOxEfa0RRjE'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkEventsTable() {
  try {
    console.log('🔍 Vérification de la structure de la table events...')
    
    // Vérifier chaque colonne individuellement
    const columnsToCheck = ['branding', 'hasCertificates', 'hasQa', 'hasPolls']
    
    for (const column of columnsToCheck) {
      try {
        // Tenter de récupérer un événement avec la colonne spécifique
        const { data, error } = await supabase
          .from('events')
          .select(`id, title, ${column}`)
          .limit(1)
          .maybeSingle()

        if (error) {
          if (error.code === '42703') {
            console.log(`❌ La colonne ${column} n'existe pas dans la table events`)
            continue
          }
          console.error(`❌ Erreur avec la colonne ${column}:`, error)
          continue
        }

        if (data) {
          console.log(`✅ La colonne ${column} existe dans la table events`)
          console.log(`📊 Données d'exemple pour ${column}:`, {
            id: data.id,
            title: data.title,
            [column]: data[column]
          })
        } else {
          console.log(`ℹ️ Aucun événement trouvé, mais la colonne ${column} existe probablement`)
        }
      } catch (columnError) {
        console.error(`❌ Erreur lors de la vérification de ${column}:`, columnError)
      }
    }
  } catch (error) {
    console.error('❌ Erreur générale:', error)
  }
}

checkEventsTable()