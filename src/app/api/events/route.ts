import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import QRCode from 'qrcode'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    const events = await db.event.findMany({
      where: {
        isPublic: true
        // startDate: {
        //   gte: new Date()
        // }
      },
      include: {
        _count: {
          select: {
            registrations: true
          }
        },
        organizer: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        startDate: 'asc'
      },
      skip: offset,
      take: limit
    })

    const total = await db.event.count({
      where: {
        isPublic: true
        // startDate: {
        //   gte: new Date()
        // }
      }
    })

    return NextResponse.json({
      events,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      title, 
      description, 
      startDate, 
      endDate, 
      location, 
      organizerId, 
      slug,
      isPublic,
      isActive,
      maxAttendees
    } = body

    if (!title || !startDate || !organizerId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate slug from title if not provided
    const eventSlug = slug || title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Check if slug already exists
    const existingEvent = await db.event.findUnique({
      where: { slug: eventSlug }
    })

    if (existingEvent) {
      return NextResponse.json(
        { error: 'Event with this slug already exists' },
        { status: 400 }
      )
    }

    // Generate QR Code
    const qrCodeData = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/e/${eventSlug}`
    const qrCode = await QRCode.toDataURL(qrCodeData, {
      width: 200,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })

    const event = await db.event.create({
      data: {
        title,
        description,
        slug: eventSlug,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        location,
        organizerId,
        isPublic: isPublic ?? true,
        isActive: isActive ?? false,
        maxAttendees: maxAttendees ? parseInt(maxAttendees) : null,
        qrCode,
        branding: {
          qrCode
        }
      },
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    )
  }
}