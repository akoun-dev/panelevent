import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(request: NextRequest) {
  try {
    // Récupérer l'événement actuel ou le prochain événement
    const now = new Date().toISOString()
    
    // Chercher d'abord les événements en cours (startDate <= now et endDate >= now)
    const { data: currentEvents, error: currentError } = await supabase
      .from('events')
      .select('*')
      .lte('startDate', now)
      .gte('endDate', now)
      .eq('isActive', true)
      .eq('isPublic', true)
      .order('startDate', { ascending: true })
      .limit(1)

    if (currentError) {
      console.error('Error fetching current events:', currentError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    if (currentEvents && currentEvents.length > 0) {
      return NextResponse.json({ event: currentEvents[0], type: 'current' })
    }

    // Si aucun événement en cours, chercher le prochain événement (startDate > now)
    const { data: nextEvents, error: nextError } = await supabase
      .from('events')
      .select('*')
      .gt('startDate', now)
      .eq('isActive', true)
      .eq('isPublic', true)
      .order('startDate', { ascending: true })
      .limit(1)

    if (nextError) {
      console.error('Error fetching next events:', nextError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    if (nextEvents && nextEvents.length > 0) {
      return NextResponse.json({ event: nextEvents[0], type: 'next' })
    }

    // Aucun événement trouvé
    return NextResponse.json({ event: null, type: 'none' })

  } catch (error) {
    console.error('Error in current event API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}