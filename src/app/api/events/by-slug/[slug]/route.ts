import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params
    const { slug } = resolvedParams

    // Créer un client avec la clé de service role pour contourner RLS
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: 'Configuration serveur manquante' },
        { status: 500 }
      )
    }
    
    const serviceRoleSupabase = createClient(supabaseUrl, serviceRoleKey)

    // Récupérer l'événement par slug
    const { data: event, error: eventError } = await serviceRoleSupabase
      .from('events')
      .select('*')
      .eq('slug', slug)
      .eq('isPublic', true)
      .maybeSingle()

    if (eventError) {
      console.error('Event lookup error:', eventError)
      return NextResponse.json(
        { error: 'Erreur lors de la récupération de l\'événement' },
        { status: 500 }
      )
    }

    if (!event) {
      return NextResponse.json(
        { error: 'Événement non trouvé' },
        { status: 404 }
      )
    }

    // Récupérer le nombre d'inscriptions
    const { count: registrationCount } = await serviceRoleSupabase
      .from('event_registrations')
      .select('*', { count: 'exact', head: true })
      .eq('"eventId"', event.id)
      .eq('"isPublic"', true)

    // Récupérer les informations de branding si disponibles
    let branding = null
    if (event.brandingId) {
      const { data: brandingData } = await serviceRoleSupabase
        .from('branding')
        .select('*')
        .eq('id', event.brandingId)
        .maybeSingle()
      branding = brandingData
    }

    return NextResponse.json({
      ...event,
      registeredCount: registrationCount || 0,
      branding
    })

  } catch (error) {
    console.error('Unexpected error in event by slug:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la récupération de l\'événement' },
      { status: 500 }
    )
  }
}