import { NextResponse } from 'next/server'
import supabase from '@/lib/supabase'
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

    const { data: event, error: findError } = await supabase
      .from('events')
      .select('organizerId')
      .eq('id', id)
      .single()

    if (findError || !event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    if (event.organizerId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Not event owner' },
        { status: 403 }
      )
    }

    const { data: registrations, error } = await supabase
      .from('event_registrations')
      .select(
        `id, email, firstName, lastName, phone, company, position, attended, createdAt,
         user:users(email,name)`
      )
      .eq('eventId', id)
      .order('createdAt', { ascending: false })

    if (error) {
      throw error
    }

    const formattedRegistrations = (registrations || []).map((reg) => ({
      id: reg.id,
      email: reg.email || reg.user?.email || '',
      firstName: reg.firstName || reg.user?.name?.split(' ')[0] || '',
      lastName: reg.lastName || reg.user?.name?.split(' ').slice(1).join(' ') || '',
      phone: reg.phone || '',
      company: reg.company || '',
      position: reg.position || '',
      attended: reg.attended,
      createdAt: reg.createdAt,
    }))

    return NextResponse.json({
      registrations: formattedRegistrations,
      total: formattedRegistrations.length,
    })
  } catch (error) {
    console.error('Failed to fetch registrations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch registrations' },
      { status: 500 }
    )
  }
}