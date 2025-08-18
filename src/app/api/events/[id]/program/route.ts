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
    
    if (!session || (session.user?.role !== 'ADMIN' && session.user?.role !== 'ORGANIZER')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has access to this event
    const event = await db.event.findUnique({
      where: { id: params.id },
      select: { organizerId: true, program: true }
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    if (session.user?.role !== 'ADMIN' && event.organizerId !== session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let programData: any = null
    if (event.program) {
      try {
        programData = JSON.parse(event.program)
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
  { params }: { params: { id: string } }
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

    const body = await request.json()
    const { hasProgram, programText, programItems } = body

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
      where: { id: params.id },
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