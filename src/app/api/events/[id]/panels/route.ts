import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/supabase'

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

    const panels = await db.panel.findMany({
      where: { eventId: id },
      orderBy: { order: 'asc' }
    })

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

    // Check if user has access to this event
    const event = await db.event.findUnique({
      where: { id: id },
      select: { organizerId: true }
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    if (session.user?.role !== 'ADMIN' && event.organizerId !== session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const panel = await db.panel.create({
      data: {
        title,
        description,
        startTime: new Date(startTime),
        endTime: endTime ? new Date(endTime) : null,
        speaker,
        location,
        order: order || 0,
        isActive: isActive ?? false,
        eventId: id
      }
    })

    return NextResponse.json({ panel }, { status: 201 })
  } catch (error) {
    console.error('Failed to create panel:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}