import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const role = searchParams.get('role') || ''

    const from = (page - 1) * limit
    const to = from + limit - 1

    let query = supabase
      .from('users')
      .select(
        `id, email, name, role, createdAt,
         eventRegistrations:event_registrations(id),
         organizedEvents:events!organizerId(id),
         pollResponses:poll_responses(id),
         feedbacks:feedback(id),
         certificates:certificates(id)`,
        { count: 'exact' }
      )
      .order('createdAt', { ascending: false })
      .range(from, to)

    if (search) {
      query = query.or(`email.ilike.%${search}%,name.ilike.%${search}%`)
    }

    if (role && role !== 'all') {
      query = query.eq('role', role)
    }

    const { data, count, error: usersError } = await query

    if (usersError) {
      throw usersError
    }

    const users = (data || []).map((u) => ({
      ...u,
      _count: {
        eventRegistrations: u.eventRegistrations?.length || 0,
        organizedEvents: u.organizedEvents?.length || 0,
        pollResponses: u.pollResponses?.length || 0,
        feedbacks: u.feedbacks?.length || 0,
        certificates: u.certificates?.length || 0,
      },
    }))

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error('Failed to fetch users:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { email, name, role } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle()

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('users')
      .insert({ email, name: name || null, role: role || 'ATTENDEE' })
      .select(
        `id, email, name, role, createdAt,
         eventRegistrations:event_registrations(id),
         organizedEvents:events!organizerId(id),
         pollResponses:poll_responses(id),
         feedbacks:feedback(id),
         certificates:certificates(id)`
      )
      .single()

    if (error) {
      throw error
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
    console.error('Failed to create user:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}