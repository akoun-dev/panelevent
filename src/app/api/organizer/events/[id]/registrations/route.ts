import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

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

    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('organizer_id')
      .eq('id', id)
      .eq('organizer_id', session.user.id)
      .single()

    if (eventError || !event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    const { data, error } = await supabase
      .from('event_registrations')
      .select('id,email,first_name,last_name,phone,company,position,attended,created_at, user:users(email,name)')
      .eq('event_id', id)
      .order('created_at', { ascending: false })

    if (error || !data) {
      return NextResponse.json(
        { error: 'Failed to fetch registrations' },
        { status: 500 }
      )
    }

    const formattedRegistrations = data.map(reg => ({
      id: reg.id,
      email: reg.email || reg.user?.email || '',
      firstName: reg.first_name || reg.user?.name?.split(' ')[0] || '',
      lastName: reg.last_name || reg.user?.name?.split(' ').slice(1).join(' ') || '',
      phone: reg.phone || '',
      company: reg.company || '',
      position: reg.position || '',
      attended: reg.attended,
      createdAt: reg.created_at
    }))

    return NextResponse.json({
      registrations: formattedRegistrations,
      total: formattedRegistrations.length
    })
  } catch (error) {
    console.error('Failed to fetch registrations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch registrations' },
      { status: 500 }
    )
  }
}