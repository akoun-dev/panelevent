import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('users')
      .select(
        `id, email, name, role,
         organizedEvents:events!organizerId(id,title,startDate,isActive),
         eventRegistrations:event_registrations(
           id,
           event:events(id,title,startDate)
         ),
         pollResponses:poll_responses(id),
         feedbacks:feedback(id),
         certificates:certificates(id)`
      )
      .eq('id', resolvedParams.id)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const user = {
      ...data,
      _count: {
        eventRegistrations: data.eventRegistrations?.length || 0,
        organizedEvents: data.organizedEvents?.length || 0,
        pollResponses: data.pollResponses?.length || 0,
        feedbacks: data.feedbacks?.length || 0,
        certificates: data.certificates?.length || 0,
      },
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Failed to fetch user:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { role, name, email } = await request.json()

    const updateData: Record<string, unknown> = {}
    if (role) updateData.role = role as 'ADMIN' | 'ORGANIZER' | 'ATTENDEE'
    if (name !== undefined) updateData.name = name
    if (email) updateData.email = email

    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', resolvedParams.id)
      .select(
        `id, email, name, role,
         eventRegistrations:event_registrations(id),
         organizedEvents:events!organizerId(id),
         pollResponses:poll_responses(id),
         feedbacks:feedback(id),
         certificates:certificates(id)`
      )
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const user = {
      ...data,
      _count: {
        eventRegistrations: data.eventRegistrations?.length || 0,
        organizedEvents: data.organizedEvents?.length || 0,
        pollResponses: data.pollResponses?.length || 0,
        feedbacks: data.feedbacks?.length || 0,
        certificates: data.certificates?.length || 0,
      },
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Failed to update user:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: userToDelete, error } = await supabase
      .from('users')
      .select('id, role')
      .eq('id', resolvedParams.id)
      .single()

    if (error || !userToDelete) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (userToDelete.role === 'ADMIN') {
      const { count: adminCount } = await supabase
        .from('users')
        .select('id', { count: 'exact', head: true })
        .eq('role', 'ADMIN')

      if ((adminCount || 0) <= 1) {
        return NextResponse.json(
          { error: 'Cannot delete the last administrator' },
          { status: 400 }
        )
      }
    }

    await supabase.from('users').delete().eq('id', resolvedParams.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete user:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}