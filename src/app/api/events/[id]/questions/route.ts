import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import type { QuestionStatus } from '@/types/supabase'



// GET /api/events/[id]/questions - Récupérer toutes les questions d'un événement
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const { id } = resolvedParams
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    let query = supabase
      .from('questions')
      .select('*')
      .eq('"eventId"', id)
      .order('created_at', { ascending: false })

    if (status && status !== 'all') {
      query = query.eq('status', status.toUpperCase())
    }

    if (search) {
      query = query.or(
        `content.ilike.%${search}%,author_name.ilike.%${search}%`
      )
    }

    const { data: questions, error } = await query
    if (error) throw error

    const questionIds = questions.map(q => q.id)
    const { data: voteCounts } = await supabase.rpc(
      'get_question_vote_counts',
      { question_ids: questionIds }
    )

    const questionsWithVotes = questions.map(question => {
      const vote = voteCounts?.find(
        (v: any) => v.question_id === question.id
      ) || { upvotes: 0, downvotes: 0 }
      return {
        ...question,
        upvotes: vote.upvotes,
        downvotes: vote.downvotes
      }
    })

    return NextResponse.json(questionsWithVotes)
  } catch (error) {
    console.error('Error fetching questions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    )
  }
}

// POST /api/events/[id]/questions - Créer une nouvelle question
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const { id } = resolvedParams
    const body = await request.json()
    const { content, authorName, authorEmail } = body

    if (!content || !authorName || !authorEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }


    const { data: question, error } = await supabase
      .from('questions')
      .insert({
        content,
        "authorName": authorName,
        "authorEmail": authorEmail,
        status: 'PENDING' as QuestionStatus
      })
      .select('*')
      .single()

    if (error) throw error

    return NextResponse.json(question)
  } catch (error) {
    console.error('Error creating question:', error)
    return NextResponse.json(
      { error: 'Failed to create question' },
      { status: 500 }
    )
  }
}