import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// POST /api/questions/[id]/votes - Ajouter ou modifier un vote
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params
  const { id } = resolvedParams
  try {
    const body = await request.json()
    const { userId, type } = body

    if (!userId || !type) {
      return NextResponse.json(
        { error: 'Missing userId or type' },
        { status: 400 }
      )
    }

    if (type !== 'UP' && type !== 'DOWN') {
      return NextResponse.json(
        { error: 'Type must be UP or DOWN' },
        { status: 400 }
      )
    }

    // Vérifier si l'utilisateur a déjà voté pour cette question
    const { data: existingVote } = await supabase
      .from('question_votes')
      .select('*')
      .eq('"questionId"', id)
      .eq('"userId"', userId)
      .single()

    let vote

    if (existingVote) {
      if (existingVote.type === type) {
        // Si le vote est le même, le supprimer (toggle)
        const { data } = await supabase
          .from('question_votes')
          .delete()
          .eq('"questionId"', id)
          .eq('"userId"', userId)
          .select()
          .single()
        vote = data
      } else {
        // Si le vote est différent, le mettre à jour
        const { data } = await supabase
          .from('question_votes')
          .update({ type })
          .eq('"questionId"', id)
          .eq('"userId"', userId)
          .select()
          .single()
        vote = data
      }
    } else {
      // Créer un nouveau vote
      const { data } = await supabase
        .from('question_votes')
        .insert({
          "questionId": id,
          "userId": userId,
          type
        })
        .select()
        .single()
      vote = data
    }

    return NextResponse.json(vote)
  } catch (error) {
    console.error('Error handling vote:', error)
    return NextResponse.json(
      { error: 'Failed to handle vote' },
      { status: 500 }
    )
  }
}

// GET /api/questions/[id]/votes - Récupérer les votes d'une question
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params
  const { id } = resolvedParams
  try {
    const { data: votes, error } = await supabase
      .from('question_votes')
      .select('*, user:users(id,name,email)')
      .eq('"questionId"', id)

    if (error) throw error

    return NextResponse.json(votes)
  } catch (error) {
    console.error('Error fetching votes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch votes' },
      { status: 500 }
    )
  }
}