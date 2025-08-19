import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || (session.user?.role !== 'ORGANIZER' && session.user?.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!session.user?.id) {
      return NextResponse.json({ error: 'User ID not found' }, { status: 400 })
    }


    const { data: registrationsData = [], error } = await supabase
      .from('event_registrations')
      .select(
        'id, consent, createdAt, user(id,name,email), event!inner(id,title,slug,startDate,organizerId)'
      )
      .eq('event.organizerId', session.user.id)
      .order('createdAt', { ascending: false })

    if (error) {
      throw error
    }

    const registrations = registrationsData.map(reg => ({
    const { data: registrations, error } = await supabase
      .from('event_registrations')
      .select(
        `id, consent, created_at, user:users(id, name, email), event:events(id, title, slug, start_date, organizer_id)`
      )
      .eq('event.organizer_id', session.user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to fetch organizer registrations:', error)
      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 }
      )
    }

    // Transform the data to match the expected format
    const transformedRegistrations = (registrations ?? []).map(reg => ({
      id: reg.id,
      user: reg.user,
      event: reg.event,
      registeredAt: reg.created_at,
      status: reg.consent ? 'confirmed' : 'pending'
    }))

    return NextResponse.json({ registrations })
  } catch (error) {
    console.error('Failed to fetch organizer registrations:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}