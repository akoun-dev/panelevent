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
      .select('id,title,description,slug,start_date,end_date,location,is_public,is_active,program,organizer_id, registrations(count), questions(count), polls(count)')
      .eq('id', id)
      .eq('organizer_id', session.user.id)
      .single()

    if (error || !data) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    const counts = {
      registrations: data.registrations?.[0]?.count ?? 0,
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
      startDate: data.start_date,
      endDate: data.end_date,
      location: data.location,
      isPublic: data.is_public,
      isActive: data.is_active,
      program: parsedProgram,
      organizerId: data.organizer_id,
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
      start_date: body.startDate,
      end_date: body.endDate ?? null,
      location: body.location,
      is_public: body.isPublic,
      is_active: body.isActive,
      max_attendees: body.maxAttendees
    }

    const { data, error } = await supabase
      .from('events')
      .update(updateData)
      .eq('id', id)
      .eq('organizer_id', session.user.id)
      .select()
      .single()

    if (error || !data) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      ...data,
      startDate: data.start_date,
      endDate: data.end_date,
      isPublic: data.is_public,
      isActive: data.is_active,
      maxAttendees: data.max_attendees,
      organizerId: data.organizer_id
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
    const parsed = eventSchema.partial().safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: parsed.error },
        { status: 400 }
      )
    }

    const updateData: Record<string, any> = {}
    if (body.title !== undefined) updateData.title = body.title
    if (body.description !== undefined) updateData.description = body.description
    if (body.slug !== undefined) updateData.slug = body.slug
    if (body.startDate !== undefined) updateData.start_date = body.startDate
    if (body.endDate !== undefined) updateData.end_date = body.endDate ?? null
    if (body.location !== undefined) updateData.location = body.location
    if (body.isPublic !== undefined) updateData.is_public = body.isPublic
    if (body.isActive !== undefined) updateData.is_active = body.isActive
    if (body.maxAttendees !== undefined) updateData.max_attendees = body.maxAttendees

    const { data, error } = await supabase
      .from('events')
      .update(updateData)
      .eq('id', id)
      .eq('organizer_id', session.user.id)
      .select('id,title,description,slug,start_date,end_date,location,is_public,is_active,max_attendees,organizer_id,created_at,updated_at, registrations(count), questions(count), polls(count)')
      .single()

    if (error || !data) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: data.id,
      title: data.title,
      description: data.description,
      slug: data.slug,
      startDate: data.start_date,
      endDate: data.end_date,
      location: data.location,
      isPublic: data.is_public,
      isActive: data.is_active,
      maxAttendees: data.max_attendees,
      organizerId: data.organizer_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      _count: {
        registrations: data.registrations?.[0]?.count ?? 0,
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
      .eq('organizer_id', session.user.id)
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