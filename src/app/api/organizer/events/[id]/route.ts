import { NextResponse } from 'next/server'
import supabase from '@/lib/supabase'
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

interface EventUpdateData {
  title?: string;
  description?: string;
  slug?: string;
  startDate?: Date;
  endDate?: Date | null;
  location?: string;
  isPublic?: boolean;
  isActive?: boolean;
  maxAttendees?: number;
}

const eventSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  slug: z.string().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional().nullable(),
  location: z.string().optional(),
  isPublic: z.boolean(),
  isActive: z.boolean(),
  maxAttendees: z.number().optional()
})

export async function GET(
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
      .select(
        `id, title, description, slug, startDate, endDate, location, isPublic, isActive, program, organizerId,
         registrations:event_registrations(id),
         questions:questions(id),
         polls:polls(id)`
      )
      .eq('id', id)
      .single()

    if (error || !data) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    if (data.organizerId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Not event owner' },
        { status: 403 }
      )
    }

    let parsedProgram: ProgramData | null = null
    if (data?.program) {
      try {
        parsedProgram = JSON.parse(data.program)
      } catch {
        parsedProgram = {
          hasProgram: true,
          programText: data.program,
          programItems: [],
        }
      }
    }

    const event = {
      ...data,
      _count: {
        registrations: data.registrations?.length || 0,
        questions: data.questions?.length || 0,
        polls: data.polls?.length || 0,
      },
      program: parsedProgram,
    }

    return NextResponse.json(event)
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

    const { data: existingEvent, error: findError } = await supabase
      .from('events')
      .select('organizerId')
      .eq('id', id)
      .single()

    if (findError || !existingEvent) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    if (existingEvent.organizerId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Not event owner' },
        { status: 403 }
      )
    }

    const { data: event, error: updateError } = await supabase
      .from('events')
      .update({
        ...body,
        startDate: new Date(body.startDate),
        endDate: body.endDate ? new Date(body.endDate) : null,
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      throw updateError
    }

    return NextResponse.json(event)
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
    const parsed = eventSchema.partial().safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: parsed.error },
        { status: 400 }
      )
    }

    const { data: existingEvent, error: findError } = await supabase
      .from('events')
      .select('organizerId')
      .eq('id', id)
      .single()

    if (findError || !existingEvent) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    if (existingEvent.organizerId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Not event owner' },
        { status: 403 }
      )
    }

    const updateData: EventUpdateData = { ...body }

    if (body.startDate) {
      updateData.startDate = new Date(body.startDate)
    }
    if (body.endDate) {
      updateData.endDate = body.endDate ? new Date(body.endDate) : null
    }

    const { data, error: updateError } = await supabase
      .from('events')
      .update(updateData)
      .eq('id', id)
      .select(
        `id, title, description, slug, startDate, endDate, location, isPublic, isActive, maxAttendees, organizerId, createdAt, updatedAt,
         registrations:event_registrations(id),
         questions:questions(id),
         polls:polls(id)`
      )
      .single()

    if (updateError || !data) {
      throw updateError
    }

    const event = {
      ...data,
      _count: {
        registrations: data.registrations?.length || 0,
        questions: data.questions?.length || 0,
        polls: data.polls?.length || 0,
      },
    }

    return NextResponse.json(event)
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

    const { data: existingEvent, error: findError } = await supabase
      .from('events')
      .select('organizerId')
      .eq('id', id)
      .single()

    if (findError || !existingEvent) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    if (existingEvent.organizerId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Not event owner' },
        { status: 403 }
      )
    }

    await supabase.from('events').delete().eq('id', id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete event:', error)
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    )
  }
}