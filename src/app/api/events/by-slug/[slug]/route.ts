import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params
    const { slug } = resolvedParams

    // Récupérer l'événement par son slug
    const { data: event, error } = await supabase
      .from('events')
      .select('*')
      .eq('slug', slug)
      .maybeSingle()

    if (error) {
      throw error
    }

    if (!event) {
      return NextResponse.json(
        { error: "Événement non trouvé" },
        { status: 404 }
      )
    }

      // Vérifier si l'événement est public
      if (!event.isPublic) {
        return NextResponse.json(
          { error: 'Événement non public' },
          { status: 403 }
        )
      }

    // Créer un client avec la clé de service role pour contourner RLS pour le comptage
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: 'Configuration serveur manquante' },
        { status: 500 }
      )
    }
    
    const serviceRoleSupabase = createClient(supabaseUrl, serviceRoleKey)
    
    // Récupérer le nombre d'inscriptions publiques
    const { count: registeredCount } = await serviceRoleSupabase
      .from('event_registrations')
      .select('*', { count: 'exact', head: true })
      .eq('eventId', event.id)
      .eq('isPublic', true)

    // Récupérer l'organisateur séparément
    const { data: organizer } = await supabase
      .from('users')
      .select('id, name, email')
      .eq('id', event.organizerId)
      .single()

    // Formater la réponse
    const eventResponse = {
      id: event.id,
      title: event.title,
      description: event.description,
      slug: event.slug,
      startDate: event.startDate,
      endDate: event.endDate,
      location: event.location,
      isActive: event.isActive,
      program: event.program,
      qrCode: event.qrCode,
      maxAttendees: event.maxAttendees,
      registeredCount: registeredCount || 0,
      organizer,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt
    }

    return NextResponse.json(eventResponse)

  } catch (error) {
    console.error('Erreur lors de la récupération de l\'événement:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la récupération de l\'événement' },
      { status: 500 }
    )
  }
}