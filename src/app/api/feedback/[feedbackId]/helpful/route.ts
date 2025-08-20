import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// POST /api/feedback/[feedbackId]/helpful - Ajouter ou supprimer un vote utile
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ feedbackId: string }> }
) {
  try {
    const resolvedParams = await params
    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'UserId is required' },
        { status: 400 }
      )
    }

    const { data: existingVote } = await supabase
      .from('helpful_votes')
      .select('feedbackId')
      .eq('feedbackId', resolvedParams.feedbackId)
      .eq('"userId"', userId)
      .maybeSingle()

    if (existingVote) {
      const { data: deleted } = await supabase
        .from('helpful_votes')
        .delete()
        .eq('feedbackId', resolvedParams.feedbackId)
        .eq('"userId"', userId)
        .select()
        .single()
      return NextResponse.json(deleted)
    }

    const { data: vote } = await supabase
      .from('helpful_votes')
      .insert({ "feedbackId": resolvedParams.feedbackId, "userId": userId })
      .select()
      .single()

    return NextResponse.json(vote)
  } catch (error) {
    console.error('Error handling helpful vote:', error)
    return NextResponse.json(
      { error: 'Failed to handle helpful vote' },
      { status: 500 }
    )
  }
}

// GET /api/feedback/[feedbackId]/helpful - Récupérer les votes utiles d'un feedback
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ feedbackId: string }> }
) {
  try {
    const resolvedParams = await params
    const { data: votes, error } = await supabase
      .from('helpful_votes')
      .select('user:users!helpful_votes_userId_fkey(id,name,email)')
      .eq('feedbackId', resolvedParams.feedbackId)

    if (error) {
      throw error
    }

    return NextResponse.json(votes)
  } catch (error) {
    console.error('Error fetching helpful votes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch helpful votes' },
      { status: 500 }
    )
  }
}