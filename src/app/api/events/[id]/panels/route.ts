import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    
    if (!session || (session.user?.role !== 'ADMIN' && session.user?.role !== 'ORGANIZER')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: eventWithPanels, error } = await supabase
      .from('events')
      .select('panels(*)')
      .eq('id', id)
      .order('order', { ascending: true, foreignTable: 'panels' })
      .single()

    if (error) {
      console.error('Failed to fetch panels:', error)
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }

    const panels = eventWithPanels?.panels || []
    return NextResponse.json({ panels })
  } catch (error) {
    console.error('Failed to fetch panels:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    
    if (!session || (session.user?.role !== 'ADMIN' && session.user?.role !== 'ORGANIZER')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, startTime, endTime, speaker, location, order, isActive } = body

    if (!title || !startTime) {
      return NextResponse.json({ error: 'Title and start time are required' }, { status: 400 })
    }

    const { data: event } = await supabase
      .from('events')
      .select('organizerId')
      .eq('id', id)
      .maybeSingle()

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    if (session.user?.role !== 'ADMIN' && event.organizerId !== session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: panel, error: insertError } = await supabase
      .from('panels')
      .insert({
        title,
        description,
        startTime: new Date(startTime).toISOString(),
        endTime: endTime ? new Date(endTime).toISOString() : null,
        speaker,
        location,
        order: order || 0,
        isActive: isActive ?? false,
        eventId: id
      })
      .select()
      .single()

    if (insertError) {
      console.error('Failed to create panel:', insertError)
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }

    return NextResponse.json({ panel }, { status: 201 })
  } catch (error) {
    console.error('Failed to create panel:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}