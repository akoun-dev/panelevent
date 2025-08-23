import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('"organizerId"')
      .eq('id', id)
      .eq('"organizerId"', session.user.id)
      .single()

    if (eventError || !event) {
      return NextResponse.json(
        { error: 'Unauthorized - Not event owner' },
        { status: 403 }
      )
    }


    // Vérifier les dépendances avant suppression
    const { count: registrationCount } = await supabase
      .from('event_registrations')
      .select('*', { count: 'exact', head: true })
      .eq('"eventId"', id)

    const { count: feedbackCount } = await supabase
      .from('feedbacks')
      .select('*', { count: 'exact', head: true })
      .eq('"eventId"', id)

    const { count: certificateCount } = await supabase
      .from('certificates')
      .select('*', { count: 'exact', head: true })
      .eq('"eventId"', id)

    const dependencies = [registrationCount ?? 0, feedbackCount ?? 0, certificateCount ?? 0]

    if (dependencies.some(count => count > 0)) {
      return NextResponse.json(
        { error: 'Event has dependencies and cannot be deleted' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id)
      .eq('"organizerId"', session.user.id)

    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete event' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Event deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting event:', error)
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    )
  }
}