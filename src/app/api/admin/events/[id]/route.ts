import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const event = await db.event.findUnique({
      where: { id: params.id },
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
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, description, startDate, endDate, location, isPublic, isActive, organizerId } = await request.json()

    const updateData: any = {}
    if (title !== undefined) {
      updateData.title = title
      // Update slug if title changes
      updateData.slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    }
    if (description !== undefined) updateData.description = description
    if (startDate !== undefined) updateData.startDate = new Date(startDate)
    if (endDate !== undefined) updateData.endDate = endDate ? new Date(endDate) : null
    if (location !== undefined) updateData.location = location
    if (isPublic !== undefined) updateData.isPublic = isPublic
    if (isActive !== undefined) updateData.isActive = isActive
    if (organizerId !== undefined) updateData.organizerId = organizerId

    const event = await db.event.update({
      where: { id: params.id },
      data: updateData,
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
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Delete related data first due to foreign key constraints
    await db.$transaction([
      db.eventRegistration.deleteMany({
        where: { eventId: params.id }
      }),
      db.question.deleteMany({
        where: { eventId: params.id }
      }),
      db.poll.deleteMany({
        where: { eventId: params.id }
      }),
      db.feedback.deleteMany({
        where: { eventId: params.id }
      }),
      db.certificate.deleteMany({
        where: { eventId: params.id }
      }),
      db.panel.deleteMany({
        where: { eventId: params.id }
      }),
      db.event.delete({
        where: { id: params.id }
      })
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete event:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}