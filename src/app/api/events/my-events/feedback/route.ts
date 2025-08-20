import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Récupérer tous les événements de l'organisateur
    const { data: eventsData = [], error: eventsError } = await supabase
      .from('events')
      .select('id')
      .eq('"organizerId"', session.user.id)

    if (eventsError) {
      throw eventsError
    }

    const eventIds = (eventsData || []).map(event => event.id)

    if (eventIds.length === 0) {
      return NextResponse.json({ feedbacks: [] })
    }

    // Récupérer tous les feedbacks pour les événements de l'organisateur
    const { data: feedbacks, error: feedbacksError } = await supabase
      .from('feedbacks')
      .select(
        `*, user:users!feedbacks_userId_fkey(id,name,email), helpfulVotes:helpful_votes("userId")`
      )
      .in('"eventId"', eventIds)
      .order('"createdAt"', { ascending: false })

    if (feedbacksError) {
      throw feedbacksError
    }

    // Calculer les votes utiles
    const feedbacksWithVotes = (feedbacks || []).map(feedback => ({
      ...feedback,
      helpful: feedback.helpfulVotes?.length || 0
    }))

    return NextResponse.json({ feedbacks: feedbacksWithVotes })
  } catch (error) {
    console.error('Error fetching organizer feedbacks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch feedbacks' },
      { status: 500 }
    )
  }
}