// Script de test pour vérifier la fonctionnalité multilingue
import { createClient } from '@supabase/supabase-js'
import { randomUUID } from 'crypto'

// Charger les variables d'environnement
import { config } from 'dotenv'
config({ path: '../.env' })

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement manquantes')
  console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
  console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'présent' : 'manquant')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testMultilingualFunctionality() {
  console.log('🧪 Test de la fonctionnalité multilingue...')
  
  try {
    // Récupérer un organisateur existant
    const { data: organizers, error: orgError } = await supabase
      .from('users')
      .select('id')
      .eq('role', 'ORGANIZER')
      .limit(1)

    if (orgError || !organizers || organizers.length === 0) {
      console.error('❌ Aucun organisateur trouvé:', orgError)
      return
    }

    const organizerId = organizers[0].id
    console.log('👤 Organisateur trouvé:', organizerId)

    // 1. Créer un événement de test avec des traductions
    const testEventData = {
      id: randomUUID(),
      title: 'Test Event FR',
      description: 'Description en français',
      slug: 'test-multilingual-' + Date.now(),
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 86400000).toISOString(),
      location: 'Paris, France',
      isPublic: true,
      isActive: true,
      maxAttendees: 100,
      title_translations: {
        fr: 'Test Event FR',
        en: 'Test Event EN',
        pt: 'Test Event PT',
        es: 'Test Event ES',
        ar: 'Test Event AR'
      },
      description_translations: {
        fr: 'Description en français',
        en: 'Description in English',
        pt: 'Descrição em português',
        es: 'Descripción en español',
        ar: 'وصف بالعربية'
      },
      location_translations: {
        fr: 'Paris, France',
        en: 'Paris, France',
        pt: 'Paris, França',
        es: 'París, Francia',
        ar: 'باريس، فرنسا'
      },
      organizerId: organizerId
    }

    console.log('📝 Création d\'un événement de test...')
    const { data: createdEvent, error: createError } = await supabase
      .from('events')
      .insert(testEventData)
      .select()
      .single()

    if (createError) {
      console.error('❌ Erreur lors de la création:', createError)
      return
    }

    console.log('✅ Événement créé avec succès:', createdEvent.id)

    // 2. Récupérer l'événement pour vérifier les traductions
    console.log('📖 Récupération de l\'événement...')
    const { data: retrievedEvent, error: retrieveError } = await supabase
      .from('events')
      .select('*')
      .eq('id', createdEvent.id)
      .single()

    if (retrieveError) {
      console.error('❌ Erreur lors de la récupération:', retrieveError)
      return
    }

    console.log('✅ Événement récupéré avec succès')
    console.log('📊 Données multilingues récupérées:')
    console.log('- Title translations:', retrievedEvent.title_translations)
    console.log('- Description translations:', retrievedEvent.description_translations)
    console.log('- Location translations:', retrievedEvent.location_translations)

    // 3. Vérifier que les données sont correctes
    const translationsValid = 
      retrievedEvent.title_translations &&
      retrievedEvent.description_translations &&
      retrievedEvent.location_translations &&
      retrievedEvent.title_translations.fr === testEventData.title_translations.fr &&
      retrievedEvent.description_translations.en === testEventData.description_translations.en

    if (translationsValid) {
      console.log('🎉 Test réussi ! Les traductions sont correctement sauvegardées et récupérées.')
    } else {
      console.log('❌ Test échoué : Les données ne correspondent pas')
    }

    // 4. Nettoyer - Supprimer l'événement de test
    console.log('🧹 Nettoyage...')
    const { error: deleteError } = await supabase
      .from('events')
      .delete()
      .eq('id', createdEvent.id)

    if (deleteError) {
      console.warn('⚠️ Impossible de supprimer l\'événement de test:', deleteError)
    } else {
      console.log('✅ Événement de test supprimé')
    }

  } catch (error) {
    console.error('❌ Erreur inattendue:', error)
  }
}

// Exécuter le test
testMultilingualFunctionality()