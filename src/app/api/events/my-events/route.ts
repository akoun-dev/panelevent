import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: eventsData = [], error } = await supabase
      .from('events')
      .select(
        'id,title,description,slug,"startDate","endDate",location,"isPublic","isActive",program,"organizerId", event_registrations(count), questions(count), polls(count)'
      )
      .eq('"organizerId"', session.user.id)
      .order('"startDate"', { ascending: false })

    if (error) {
      throw error
    }

    const events = (eventsData || []).map(event => ({
      id: event.id,
      title: event.title,
      description: event.description,
      slug: event.slug,
      startDate: event.startDate,
      endDate: event.endDate,
      location: event.location,
      isPublic: event.isPublic,
      isActive: event.isActive,
      _count: {
        registrations: event.event_registrations?.[0]?.count ?? 0,
        questions: event.questions?.[0]?.count ?? 0,
        polls: event.polls?.[0]?.count ?? 0
      }
    }))

    return NextResponse.json({ events })
  } catch (error) {
    console.error('Error fetching organizer events:', error)
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}