import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// POST /api/feedback/[feedbackId]/resolve - Marquer un feedback comme résolu/non résolu
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ feedbackId: string }> }
) {
  try {
    const resolvedParams = await params
    const body = await request.json()
    const { resolved } = body

    if (typeof resolved !== 'boolean') {
      return NextResponse.json(
        { error: 'Resolved must be a boolean' },
        { status: 400 }
      )
    }

    const { data: feedback, error } = await supabase
      .from('feedbacks')
      .update({ resolved })
      .eq('id', resolvedParams.feedbackId)
      .select('id, rating, comment, category, resolved, user:users(id,name,email), helpfulVotes:helpful_votes(userId)')
      .single()

    if (error || !feedback) {
      throw error
    }

    const feedbackWithVotes = {
      ...feedback,
      helpful: feedback.helpfulVotes?.length || 0
    }

    return NextResponse.json(feedbackWithVotes)
  } catch (error) {
    console.error('Error updating feedback resolved status:', error)
    return NextResponse.json(
      { error: 'Failed to update feedback resolved status' },
      { status: 500 }
    )
  }
}