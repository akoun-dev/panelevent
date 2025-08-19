import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const { id } = resolvedParams
    const session = await getServerSession(authOptions)
    
    if (!session || (session.user?.role !== 'ADMIN' && session.user?.role !== 'ORGANIZER')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has access to this event
    const event = await db.event.findUnique({
      where: { id },
      select: { organizerId: true }
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    if (session.user?.role !== 'ADMIN' && event.organizerId !== session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const registrations = await db.eventRegistration.findMany({
      where: { eventId: id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ registrations })
  } catch (error) {
    console.error('Failed to fetch registrations:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const { id } = resolvedParams
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { email, consent } = body

    if (!email || consent !== true) {
      return NextResponse.json(
        { error: 'Email and consent are required' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Check if event exists and is active
    const event = await db.event.findUnique({
      where: { id }
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    if (!event.isActive) {
      return NextResponse.json({ error: 'Event is not active' }, { status: 400 })
    }

    // Find or create user
    let user = await db.user.findUnique({
      where: { email }
    })

    if (!user) {
      user = await db.user.create({
        data: {
          email,
          name: email.split('@')[0], // Default name from email
          role: 'ATTENDEE'
        }
      })
    }

    // Check if already registered
    const existingRegistration = await db.eventRegistration.findUnique({
      where: {
        userId_eventId: {
          userId: user.id,
          eventId: id
        }
      }
    })

    if (existingRegistration) {
      return NextResponse.json({ error: 'Already registered' }, { status: 400 })
    }

    // Create registration
    const registration = await db.eventRegistration.create({
      data: {
        userId: user.id,
        eventId: id,
        consent
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({ registration }, { status: 201 })
  } catch (error) {
    console.error('Failed to create registration:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}