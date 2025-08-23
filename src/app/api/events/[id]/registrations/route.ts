import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

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

    const { data: event } = await supabase
      .from('events')
      .select('organizerId')
      .eq('id', id)
      .maybeSingle()

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    if (session.user?.role !== 'ADMIN' && event.organizerId !== session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: registrations, error } = await supabase
      .from('event_registrations')
      .select(
        `id, consent, "createdAt", user:users(id, name, email)`
      )
      .eq('"eventId"', id)
      .order('"createdAt"', { ascending: false })

    if (error) {
      console.error('Failed to fetch registrations:', error)
      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 }
      )
    }

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
    const { data: event } = await supabase
      .from('events')
      .select('isActive')
      .eq('id', id)
      .maybeSingle()

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    if (!event.isActive) {
      return NextResponse.json({ error: 'Event is not active' }, { status: 400 })
    }

    // Find or create user
    let { data: user } = await supabase
      .from('users')
      .select('id, name, email')
      .eq('email', email)
      .maybeSingle()

    if (!user) {
      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert({
          email,
          name: email.split('@')[0],
          role: 'ATTENDEE'
        })
        .select('id, name, email')
        .single()
      if (userError) {
        return NextResponse.json(
          { error: 'Failed to create user' },
          { status: 500 }
        )
      }
      user = newUser
    }

    // Check if already registered
    const { data: existingRegistration } = await supabase
      .from('event_registrations')
      .select('id')
      .eq('"userId"', user.id)
      .eq('"eventId"', id)
      .maybeSingle()

    if (existingRegistration) {
      return NextResponse.json({ error: 'Already registered' }, { status: 400 })
    }

    // Create registration
    const { data: registration, error: insertError } = await supabase
      .from('event_registrations')
      .insert({
        "userId": user.id,
        "eventId": id,
        consent
      })
      .select('id, consent, "createdAt", user:users(id, name, email)')
      .single()

    if (insertError) {
      return NextResponse.json(
        { error: 'Failed to create registration' },
        { status: 500 }
      )
    }

    return NextResponse.json({ registration }, { status: 201 })
  } catch (error) {
    console.error('Failed to create registration:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}