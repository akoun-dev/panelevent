import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db: any = supabase

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const event = await db.event.findUnique({
      where: { id: resolvedParams.id },
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        panels: {
          orderBy: { order: 'asc' },
          include: {
            _count: {
              select: {
                questions: true
              }
            }
          }
        },
        registrations: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        _count: {
          select: {
            registrations: true,
            questions: true,
            polls: true,
            feedbacks: true,
            certificates: true
          }
        }
      }
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    return NextResponse.json({ event })
  } catch (error) {
    console.error('Failed to fetch event:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, description, startDate, endDate, location, isPublic, isActive, organizerId } = await request.json()

    const updateData: Record<string, any> = {}
    if (title !== undefined) {
      updateData.title = title
      updateData.slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    }
    if (description !== undefined) updateData.description = description
    if (startDate !== undefined) updateData.startDate = new Date(startDate).toISOString()
    if (endDate !== undefined) updateData.endDate = endDate ? new Date(endDate).toISOString() : null
    if (location !== undefined) updateData.location = location
    if (isPublic !== undefined) updateData.isPublic = isPublic
    if (isActive !== undefined) updateData.isActive = isActive
    if (organizerId !== undefined) updateData.organizerId = organizerId

    const { error: updateError } = await supabase
      .from('events')
      .update(updateData)
      .eq('id', resolvedParams.id)

    if (updateError) {
      console.error('Failed to update event:', updateError)
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }

    const event = await db.event.findUnique({
      where: { id: resolvedParams.id },
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        _count: {
          select: {
            registrations: true,
            questions: true,
            polls: true,
            feedbacks: true,
            certificates: true
          }
        }
      }
    })

    return NextResponse.json({ event })
  } catch (error) {
    console.error('Failed to update event:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Delete related panels using Supabase
    const { error: panelError } = await supabase
      .from('panels')
      .delete()
      .eq('eventId', resolvedParams.id)

    if (panelError) {
      console.error('Failed to delete panels:', panelError)
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }

    // Delete related data first due to foreign key constraints
    await supabase
      .from('event_registrations')
      .delete()
      .eq('event_id', resolvedParams.id)

    await db.$transaction([
      db.question.deleteMany({
        where: { eventId: resolvedParams.id }
      }),
      db.poll.deleteMany({
        where: { eventId: resolvedParams.id }
      }),
      db.feedback.deleteMany({
        where: { eventId: resolvedParams.id }
      }),
      db.certificate.deleteMany({
        where: { eventId: resolvedParams.id }
      }),
      db.event.delete({
        where: { id: resolvedParams.id }
      })
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete event:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}