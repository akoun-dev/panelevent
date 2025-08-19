import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/supabase'

interface ProgramData {
  hasProgram: boolean
  programText?: string
  programItems?: Array<{
    id: string
    time: string
    title: string
    description?: string
    speaker?: string
    location?: string
  }>
  updatedAt?: string
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params to ensure they're resolved
    const { id } = await params
    const session = await getServerSession(authOptions)
    
    if (!session || (session.user?.role !== 'ADMIN' && session.user?.role !== 'ORGANIZER')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has access to this event
    const event = await db.event.findUnique({
      where: { id },
      select: { organizerId: true, program: true }
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    if (session.user?.role !== 'ADMIN' && event.organizerId !== session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let programData: ProgramData | null = null
    if (event.program) {
      try {
        programData = JSON.parse(event.program) as ProgramData
      } catch {
        // If it's not JSON, treat it as plain text
        programData = {
          hasProgram: true,
          programText: event.program,
          programItems: []
        }
      }
    } else {
      programData = {
        hasProgram: false,
        programText: '',
        programItems: []
      }
    }

    return NextResponse.json({ program: programData })
  } catch (error) {
    console.error('Failed to fetch event program:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params to ensure they're resolved
    const { id } = await params
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

    const body = await request.json()
    const { hasProgram, programText, programItems } = body

    // Validate program items time format
    if (programItems) {
      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
      for (const item of programItems) {
        if (!timeRegex.test(item.time)) {
          return NextResponse.json(
            { error: `Format d'heure invalide pour "${item.title}"` },
            { status: 400 }
          )
        }
      }
    }

    let programValue: string | null = null
    if (hasProgram) {
      programValue = JSON.stringify({
        hasProgram: true,
        programText: programText || '',
        programItems: programItems || [],
        updatedAt: new Date().toISOString()
      })
    }

    const updatedEvent = await db.event.update({
      where: { id },
      data: { program: programValue },
      select: {
        id: true,
        title: true,
        program: true
      }
    })

    return NextResponse.json({ event: updatedEvent })
  } catch (error) {
    console.error('Failed to update event program:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}