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

    const { data: polls, error } = await supabase
      .from('polls')
      .select(
        `id, question, is_active, created_at,
         event:events!inner(id,title,slug,"organizerId"),
         options:poll_options(id,text,responses:poll_responses(id))`
      )
      .eq('event."organizerId"', session.user.id)
      .order('"createdAt"', { ascending: false })

    if (error) {
      console.error('Failed to fetch organizer polls:', error)
      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 }
      )
    }

    const transformedPolls = (polls ?? []).map((poll: any) => ({
      id: poll.id,
      question: poll.question,
      event: {
        id: poll.event.id,
        title: poll.event.title,
        slug: poll.event.slug,
      },
      isActive: poll.is_active,
      createdAt: poll.created_at,
      options: (poll.options ?? []).map((option: any) => ({
        id: option.id,
        text: option.text,
        votes: option.responses?.length ?? 0,
      })),
      _count: {
        votes: (poll.options ?? []).reduce(
          (sum: number, option: any) => sum + (option.responses?.length ?? 0),
          0
        ),
      },
    }))

    return NextResponse.json({ polls: transformedPolls })
  } catch (error) {
    console.error('Failed to fetch organizer polls:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

