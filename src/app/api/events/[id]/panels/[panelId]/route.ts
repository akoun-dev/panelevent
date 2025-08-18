import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; panelId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || (session.user?.role !== 'ADMIN' && session.user?.role !== 'ORGANIZER')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, startTime, endTime, speaker, location, order, isActive } = body

    // Check if user has access to this event
    const event = await db.event.findUnique({
      where: { id: params.id },
      select: { organizerId: true }
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    if (session.user?.role !== 'ADMIN' && event.organizerId !== session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (startTime !== undefined) updateData.startTime = new Date(startTime)
    if (endTime !== undefined) updateData.endTime = endTime ? new Date(endTime) : null
    if (speaker !== undefined) updateData.speaker = speaker
    if (location !== undefined) updateData.location = location
    if (order !== undefined) updateData.order = order
    if (isActive !== undefined) updateData.isActive = isActive

    const panel = await db.panel.update({
      where: { 
        id: params.panelId,
        eventId: params.id
      },
      data: updateData
    })

    return NextResponse.json({ panel })
  } catch (error) {
    console.error('Failed to update panel:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; panelId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || (session.user?.role !== 'ADMIN' && session.user?.role !== 'ORGANIZER')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has access to this event
    const event = await db.event.findUnique({
      where: { id: params.id },
      select: { organizerId: true }
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    if (session.user?.role !== 'ADMIN' && event.organizerId !== session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await db.panel.delete({
      where: { 
        id: params.panelId,
        eventId: params.id
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete panel:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}