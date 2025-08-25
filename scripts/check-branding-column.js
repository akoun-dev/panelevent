import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kjprigldhepbqhwqehrq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqcHJpZ2xkaGVwYnFod3FlaHJxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTU0NTk5MywiZXhwIjoyMDcxMTIxOTkzfQ.PgrtDo9uhIJmsLl5Qj8Hs3QqlAqB3g0-AOxEfa0RRjE'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkBrandingColumn() {
  try {
    console.log('🔍 Vérification de la colonne branding dans la table events...')
    
    // Vérifier si la colonne branding existe
    const { data: columnInfo, error } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_name', 'events')
      .eq('column_name', 'branding')
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('❌ Erreur lors de la vérification de la colonne:', error)
      return
    }

    if (columnInfo) {
      console.log('✅ La colonne branding existe déjà:')
      console.log('   - Nom:', columnInfo.column_name)
      console.log('   - Type:', columnInfo.data_type)
      console.log('   - Nullable:', columnInfo.is_nullable)
    } else {
      console.log('❌ La colonne branding n\'existe pas dans la table events')
      console.log('📋 Création de la colonne branding...')
      
      // Ajouter la colonne branding
      const { error: alterError } = await supabase.rpc('add_branding_column')
      
      if (alterError) {
        console.log('⚠️  Impossible d\'exécuter la fonction RPC, tentative avec SQL direct...')
        
        // Alternative: exécuter directement le SQL
        const { error: sqlError } = await supabase
          .rpc('exec_sql', { 
            sql: 'ALTER TABLE events ADD COLUMN IF NOT EXISTS branding JSONB DEFAULT \'{"primaryColor":"#3b82f6","secondaryColor":"#64748b","accentColor":"#f59e0b"}\'::jsonb' 
          })
        
        if (sqlError) {
          console.error('❌ Erreur lors de l\'ajout de la colonne:', sqlError)
          console.log('💡 Vous devez exécuter manuellement cette commande SQL:')
          console.log('ALTER TABLE events ADD COLUMN IF NOT EXISTS branding JSONB DEFAULT \'{"primaryColor":"#3b82f6","secondaryColor":"#64748b","accentColor":"#f59e0b"}\'::jsonb;')
        } else {
          console.log('✅ Colonne branding ajoutée avec succès')
        }
      } else {
        console.log('✅ Colonne branding ajoutée avec succès via RPC')
      }
    }
  } catch (error) {
    console.error('❌ Erreur:', error)
  }
}

checkBrandingColumn()