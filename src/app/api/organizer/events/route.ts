import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('organizer_id', session.user.id)

    if (error) throw error

    const events = (data || []).map(
      ({ organizer_id, start_date, end_date, is_public, is_active, max_attendees, ...rest }) => ({
        ...rest,
        organizerId: organizer_id,
        startDate: start_date,
        endDate: end_date,
        isPublic: is_public,
        isActive: is_active,
        maxAttendees: max_attendees
      })
    )

    return NextResponse.json(events)
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { data, error } = await supabase
      .from('events')
      .insert({ ...body, organizer_id: session.user.id })
      .select()
      .single()

    if (error) throw error

    const event = {
      ...data,
      organizerId: data.organizer_id,
      startDate: data.start_date,
      endDate: data.end_date,
      isPublic: data.is_public,
      isActive: data.is_active,
      maxAttendees: data.max_attendees
    }

    return NextResponse.json(event)
  } catch {
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    )
  }
}