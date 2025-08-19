import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/events/[id]/feedback - Récupérer tous les feedbacks d'un événement
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const { id } = resolvedParams
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const rating = searchParams.get('rating')
    const resolved = searchParams.get('resolved')

    let query = supabase
      .from('feedbacks')
      .select(
        `*, user:users(id,name,email), helpfulVotes:helpful_votes(user_id)`
      )
      .eq('event_id', id)
      .order('created_at', { ascending: false })

    if (category) {
      query = query.eq('category', category)
    }

    if (rating) {
      query = query.eq('rating', parseInt(rating))
    }

    if (resolved !== null) {
      query = query.eq('resolved', resolved === 'true')
    }

    const { data: feedbacks, error } = await query
    if (error) throw error

    // Calculer les votes utiles
    const feedbacksWithVotes = (feedbacks || []).map(feedback => ({
      ...feedback,
      helpful: feedback.helpfulVotes?.length || 0
    }))

    return NextResponse.json(feedbacksWithVotes)
  } catch (error) {
    console.error('Error fetching feedbacks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch feedbacks' },
      { status: 500 }
    )
  }
}

// POST /api/events/[id]/feedback - Créer un nouveau feedback
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const { id } = resolvedParams
    const body = await request.json()
    const { userId, rating, comment, category } = body

    if (!userId || !rating || !category) {
      return NextResponse.json(
        { error: 'UserId, rating, and category are required' },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    // Vérifier si l'utilisateur a participé à l'événement
    const { data: registration } = await supabase
      .from('event_registrations')
      .select('id')
      .eq('user_id', userId)
      .eq('event_id', id)
      .eq('attended', true)
      .maybeSingle()

    if (!registration) {
      return NextResponse.json(
        { error: 'User did not attend the event' },
        { status: 400 }
      )
    }

    // Vérifier si l'utilisateur a déjà laissé un feedback
    const { data: existingFeedback } = await supabase
      .from('feedbacks')
      .select('id')
      .eq('user_id', userId)
      .eq('event_id', id)
      .maybeSingle()

    if (existingFeedback) {
      return NextResponse.json(
        { error: 'User has already submitted feedback for this event' },
        { status: 400 }
      )
    }
    const { data: feedback, error: feedbackError } = await supabase
      .from('feedbacks')
      .insert({
        user_id: userId,
        event_id: id,
        rating,
        comment: comment || null,
        category,
        resolved: false
      })
      .select(
        `*, user:users(id,name,email), helpfulVotes:helpful_votes(user_id)`
      )
      .single()

    if (feedbackError) throw feedbackError

    const feedbackWithVotes = {
      ...feedback,
      helpful: feedback.helpfulVotes?.length || 0
    }

    return NextResponse.json(feedbackWithVotes)
  } catch (error) {
    console.error('Error creating feedback:', error)
    return NextResponse.json(
      { error: 'Failed to create feedback' },
      { status: 500 }
    )
  }
}