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
