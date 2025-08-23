import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params
  const { id } = resolvedParams
  try {
    const { data: registration } = await supabase
      .from('event_registrations')
      .select(
        `id, "firstName", "lastName", email, "createdAt", event:events(id, title, slug, program)`
      )
      .eq('id', id)
      .eq('"isPublic"', true)
      .maybeSingle()

    if (!registration) {
      return NextResponse.json(
        { error: "Inscription non trouvée" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      registration: {
        id: registration.id,
        firstName: registration.firstName,
        lastName: registration.lastName,
        email: registration.email,
        registeredAt: registration.createdAt,
        event: registration.event
      }
    })
  } catch (error) {
    console.error("Erreur lors de la récupération de l'inscription:", error)
    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500 }
    )
  }
}
