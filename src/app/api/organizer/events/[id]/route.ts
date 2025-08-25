import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

interface ProgramItem {
  id?: string;
  title?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  speaker?: string;
  location?: string;
}

interface ProgramData {
  hasProgram?: boolean;
  programText?: string;
  programItems?: ProgramItem[];
}

const eventSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  slug: z.string().optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  location: z.string().optional(),
  isPublic: z.boolean(),
  isActive: z.boolean(),
  maxAttendees: z.number().optional(),
  title_translations: z.any().optional(),
  description_translations: z.any().optional(),
  location_translations: z.any().optional(),
  branding: z.object({
    primaryColor: z.string().optional(),
    secondaryColor: z.string().optional(),
    accentColor: z.string().optional()
  }).optional(),
  hasCertificates: z.boolean().optional(),
  hasQa: z.boolean().optional(),
  hasPolls: z.boolean().optional()
})

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    
    console.log('GET /api/organizer/events/[id] - Event ID:', id)
    console.log('Session user ID:', session?.user?.id)
    
    if (!session || !session.user) {
      console.log('Unauthorized: No session or user')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // D'abord vérifier si l'événement existe (sans vérifier l'organisateur)
    const { data: eventExists } = await supabase
      .from('events')
      .select('id, "organizerId"')
      .eq('id', id)
      .single()

    console.log('Event existence check:', eventExists)

    if (!eventExists) {
      console.log('Event does not exist in database')
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    // Vérifier si l'utilisateur est l'organisateur de cet événement
    if (eventExists.organizerId !== session.user.id) {
      console.log('User is not the organizer of this event')
      console.log('Event organizer ID:', eventExists.organizerId)
      console.log('Session user ID:', session.user.id)
      return NextResponse.json(
        { error: 'Unauthorized - Not the event organizer' },
        { status: 403 }
      )
    }

    const { data, error } = await supabase
      .from('events')
      .select('id,title,description,slug,"startDate","endDate",location,"isPublic","isActive",program,"organizerId",title_translations,description_translations,location_translations,branding,hascertificates,hasqa,haspolls, event_registrations(count), questions(count), polls(count)')
      .eq('id', id)
      .eq('"organizerId"', session.user.id)
      .single()

    console.log('Supabase query result - Error:', error)
    console.log('Supabase query result - Data:', data)

    if (error || !data) {
      console.log('Event not found or unauthorized - Error details:', error)
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    const counts = {
      registrations: data.event_registrations?.[0]?.count ?? 0,
      questions: data.questions?.[0]?.count ?? 0,
      polls: data.polls?.[0]?.count ?? 0
    }

    let parsedProgram: ProgramData | null = null
    if (data.program) {
      try {
        parsedProgram = JSON.parse(data.program as string)
      } catch {
        parsedProgram = {
          hasProgram: true,
          programText: data.program as string,
          programItems: []
        }
      }
    }

    return NextResponse.json({
      id: data.id,
      title: data.title,
      description: data.description,
      slug: data.slug,
      startDate: data.startDate,
      endDate: data.endDate,
      location: data.location,
      isPublic: data.isPublic,
      isActive: data.isActive,
      title_translations: data.title_translations,
      description_translations: data.description_translations,
      location_translations: data.location_translations,
      branding: data.branding,
      hasCertificates: data.hascertificates,
      hasQa: data.hasqa,
      hasPolls: data.haspolls,
      program: parsedProgram,
      organizerId: data.organizerId,
      _count: counts
    })
  } catch (error) {
    console.error('Failed to fetch event:', error)
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const parsed = eventSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: parsed.error },
        { status: 400 }
      )
    }

    const updateData = {
      title: body.title,
      description: body.description,
      slug: body.slug,
      "startDate": body.startDate,
      "endDate": body.endDate ?? null,
      location: body.location,
      "isPublic": body.isPublic,
      "isActive": body.isActive,
      "maxAttendees": body.maxAttendees,
      title_translations: body.title_translations,
      description_translations: body.description_translations,
      location_translations: body.location_translations,
      branding: body.branding,
      hascertificates: body.hasCertificates,
      hasqa: body.hasQa,
      haspolls: body.hasPolls
    }

    const { data, error } = await supabase
      .from('events')
      .update(updateData)
      .eq('id', id)
      .eq('"organizerId"', session.user.id)
      .select('id,title,description,slug,"startDate","endDate",location,"isPublic","isActive","maxAttendees","organizerId",branding,hascertificates,hasqa,haspolls')
      .single()

    if (error || !data) {
      return NextResponse.json(
        { error: 'Event not found or unauthorized' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      ...data,
      startDate: data.startDate,
      endDate: data.endDate,
      isPublic: data.isPublic,
      isActive: data.isActive,
      maxAttendees: data.maxAttendees,
      organizerId: data.organizerId,
      branding: data.branding,
      hasCertificates: data.hascertificates,
      hasQa: data.hasqa,
      hasPolls: data.haspolls
    })
  } catch (error) {
    console.error('Failed to update event:', error)
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    console.log('PATCH request body:', JSON.stringify(body, null, 2))
    
    const parsed = eventSchema.partial().safeParse(body)
    if (!parsed.success) {
      console.log('Validation error:', parsed.error)
      return NextResponse.json(
        { error: 'Invalid request data', details: parsed.error },
        { status: 400 }
      )
    }

    const updateData: Record<string, any> = {}
    if (body.title !== undefined) updateData.title = body.title
    if (body.description !== undefined) updateData.description = body.description
    if (body.slug !== undefined) updateData.slug = body.slug
    if (body.startDate !== undefined) updateData["startDate"] = body.startDate
    if (body.endDate !== undefined) updateData["endDate"] = body.endDate ?? null
    if (body.location !== undefined) updateData.location = body.location
    if (body.isPublic !== undefined) updateData["isPublic"] = body.isPublic
    if (body.isActive !== undefined) updateData["isActive"] = body.isActive
    if (body.maxAttendees !== undefined) updateData["maxAttendees"] = body.maxAttendees
    if (body.title_translations !== undefined) updateData.title_translations = body.title_translations
    if (body.description_translations !== undefined) updateData.description_translations = body.description_translations
    if (body.location_translations !== undefined) updateData.location_translations = body.location_translations
    if (body.branding !== undefined) updateData.branding = body.branding
    if (body.hasCertificates !== undefined) updateData.hascertificates = body.hasCertificates
    if (body.hasQa !== undefined) updateData.hasqa = body.hasQa
    if (body.hasPolls !== undefined) updateData.haspolls = body.hasPolls

    const { data, error } = await supabase
      .from('events')
      .update(updateData)
      .eq('id', id)
      .eq('"organizerId"', session.user.id)
      .select('id,title,description,slug,"startDate","endDate",location,"isPublic","isActive","maxAttendees","organizerId","createdAt","updatedAt",title_translations,description_translations,location_translations,branding,hascertificates,hasqa,haspolls, event_registrations(count), questions(count), polls(count)')
      .single()

    if (error || !data) {
      return NextResponse.json(
        { error: 'Event not found or unauthorized' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: data.id,
      title: data.title,
      description: data.description,
      slug: data.slug,
      startDate: data.startDate,
      endDate: data.endDate,
      location: data.location,
      isPublic: data.isPublic,
      isActive: data.isActive,
      maxAttendees: data.maxAttendees,
      title_translations: data.title_translations,
      description_translations: data.description_translations,
      location_translations: data.location_translations,
      branding: data.branding,
      hasCertificates: data.hascertificates,
      hasQa: data.hasqa,
      hasPolls: data.haspolls,
      organizerId: data.organizerId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      _count: {
        registrations: data.event_registrations?.[0]?.count ?? 0,
        questions: data.questions?.[0]?.count ?? 0,
        polls: data.polls?.[0]?.count ?? 0
      }
    })
  } catch (error) {
    console.error('Failed to update event:', error)
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { data, error } = await supabase
      .from('events')
      .delete()
      .eq('id', id)
      .eq('"organizerId"', session.user.id)
      .select('id')
      .single()

    if (error && error.code !== 'PGRST116') {
      return NextResponse.json(
        { error: 'Failed to delete event' },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete event:', error)
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    )
  }
}