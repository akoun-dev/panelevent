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
      .eq('"organizerId"', session.user.id)

    if (error) throw error

    const events = (data || []).map(
      ({ "organizerId": organizerId, "startDate": startDate, "endDate": endDate, "isPublic": isPublic, "isActive": isActive, "maxAttendees": maxAttendees, ...rest }) => ({
        ...rest,
        organizerId,
        startDate,
        endDate,
        isPublic,
        isActive,
        maxAttendees
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
      .insert({ ...body, "organizerId": session.user.id })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      ...data,
      organizerId: data.organizerId,
      startDate: data.startDate,
      endDate: data.endDate,
      isPublic: data.isPublic,
      isActive: data.isActive,
      maxAttendees: data.maxAttendees
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    )
  }
}