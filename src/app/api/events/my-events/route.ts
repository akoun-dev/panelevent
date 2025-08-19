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
        'id,title,description,slug,startDate,endDate,location,isPublic,isActive,program,panels(*),registrations(*),questions(*),polls(*)'
      )
      .eq('organizerId', session.user.id)
      .order('startDate', { ascending: false })

    if (error) {
      throw error
    }

    const events = eventsData.map(event => ({
      ...event,
      panels: (event.panels || []).sort((a: any, b: any) => a.order - b.order),
      _count: {
        registrations: event.registrations?.length || 0,
        questions: event.questions?.length || 0,
        polls: event.polls?.length || 0
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