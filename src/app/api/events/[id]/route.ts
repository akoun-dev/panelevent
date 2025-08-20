import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const { id } = resolvedParams

    // Récupérer l'événement par son ID
    const { data: event, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
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
      isPublic: event.isPublic,
      program: event.program,
      qrCode: event.qrCode,
      maxAttendees: event.maxAttendees,
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