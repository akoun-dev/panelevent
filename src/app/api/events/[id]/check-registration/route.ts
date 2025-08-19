import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { error: 'L\'email est requis' },
        { status: 400 }
      )
    }

    const eventId = resolvedParams.id

    // Vérifier si l'événement existe
    const event = await db.event.findUnique({
      where: { id: eventId }
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Événement non trouvé' },
        { status: 404 }
      )
    }

    // Vérifier l'inscription
    const { data: registration } = await supabase
      .from('event_registrations')
      .select('id, first_name, last_name, email, created_at')
      .eq('event_id', eventId)
      .eq('email', email)
      .eq('is_public', true)
      .maybeSingle()

    if (!registration) {
      return NextResponse.json({
        isRegistered: false,
        message: 'Non inscrit à cet événement'
      })
    }

    return NextResponse.json({
      isRegistered: true,
      registration: {
        id: registration.id,
        firstName: registration.first_name,
        lastName: registration.last_name,
        email: registration.email,
        registeredAt: registration.created_at
      },
      event: {
        id: event.id,
        title: event.title,
        slug: event.slug,
        program: event.program
      }
    })

  } catch (error) {
    console.error('Erreur lors de la vérification d\'inscription:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la vérification' },
      { status: 500 }
    )
  }
}