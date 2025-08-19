import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { supabase } from '@/lib/supabase'
import { authOptions } from '@/lib/auth'
import QRCode from 'qrcode'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    const { data: events = [], count, error } = await supabase
      .from('events')
      .select('*, registrations(*), organizer(id,name,email)', { count: 'exact' })
      .eq('isPublic', true)
      .order('startDate', { ascending: true })
      .range(offset, offset + limit - 1)

    if (error) {
      throw error
    }

    const total = count || 0

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
    const session = await getServerSession(authOptions)

    if (!session || (session.user?.role !== 'ADMIN' && session.user?.role !== 'ORGANIZER')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    const eventSchema = z.object({
      title: z.string().min(1, 'Title is required'),
      description: z.string().optional(),
      startDate: z
        .string()
        .refine(v => !isNaN(Date.parse(v)), { message: 'Invalid start date' }),
      endDate: z
        .string()
        .optional()
        .refine(v => !v || !isNaN(Date.parse(v)), { message: 'Invalid end date' }),
      location: z.string().optional(),
      slug: z.string().optional(),
      isPublic: z.boolean().optional(),
      isActive: z.boolean().optional(),
      maxAttendees: z
        .string()
        .optional()
        .transform(v => (v === undefined || v === '' ? undefined : v))
        .refine(v => v === undefined || !isNaN(Number(v)), {
          message: 'Invalid maxAttendees'
        })
        .transform(v => (v === undefined ? undefined : Number(v)))
    })

    const parsed = eventSchema.safeParse(body)
    if (!parsed.success) {
      const errors = parsed.error.issues.map(issue => issue.message)
      return NextResponse.json(
        { error: 'Invalid input', details: errors },
        { status: 400 }
      )
    }

    const {
      title,
      description,
      startDate,
      endDate,
      location,
      slug,
      isPublic,
      isActive,
      maxAttendees
    } = parsed.data

    const eventSlug = (slug || title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const { data: existingEvent } = await supabase
      .from('events')
      .select('id')
      .eq('slug', eventSlug)
      .maybeSingle()

    if (existingEvent) {
      return NextResponse.json(
        { error: 'Event with this slug already exists' },
        { status: 400 }
      )
    }

    const qrCodeData = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/e/${eventSlug}`
    const qrCode = await QRCode.toDataURL(qrCodeData, {
      width: 200,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })

    const { data: event, error } = await supabase
      .from('events')
      .insert({
        title,
        description,
        slug: eventSlug,
        startDate: new Date(startDate).toISOString(),
        endDate: endDate ? new Date(endDate).toISOString() : null,
        location,
        organizerId: session.user.id,
        isPublic: isPublic ?? true,
        isActive: isActive ?? false,
        maxAttendees: typeof maxAttendees === 'number' ? maxAttendees : null,
        qrCode,
        branding: { qrCode }
      })
      .select('*, organizer(id,name,email)')
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    )
  }
}