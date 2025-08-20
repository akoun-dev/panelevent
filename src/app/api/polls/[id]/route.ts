import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/polls/[pollId] - Récupérer un sondage spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const { id: pollId } = resolvedParams

    const { data: poll, error } = await supabase
      .from('polls')
      .select(
        `*, options:poll_options(*, responses:poll_responses(id))`
      )
      .eq('id', pollId)
      .single()

    if (error || !poll) {
      return NextResponse.json(
        { error: 'Poll not found' },
        { status: 404 }
      )
    }

    // Calculer les stats
    const totalVotes = poll.options?.reduce((sum: number, option: any) => 
      sum + (option.responses?.length || 0), 0) || 0
    
    const optionsWithStats = (poll.options || []).map((option: any) => ({
      ...option,
      votes: option.responses?.length || 0,
      percentage: totalVotes > 0 ? Math.round(((option.responses?.length || 0) / totalVotes) * 100) : 0
    }))

    const pollWithStats = {
      ...poll,
      totalVotes,
      options: optionsWithStats
    }

    return NextResponse.json(pollWithStats)
  } catch (error) {
    console.error('Error fetching poll:', error)
    return NextResponse.json(
      { error: 'Failed to fetch poll' },
      { status: 500 }
    )
  }
}

// PATCH /api/polls/[pollId] - Mettre à jour un sondage
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const { id: pollId } = resolvedParams
    const body = await request.json()
    const { isActive, question, description, isAnonymous, allowMultipleVotes } = body

    const updateData: Record<string, any> = {}
    if (isActive !== undefined) updateData.is_active = isActive
    if (question !== undefined) updateData.question = question
    if (description !== undefined) updateData.description = description
    if (isAnonymous !== undefined) updateData.is_anonymous = isAnonymous
    if (allowMultipleVotes !== undefined) updateData.allow_multiple_votes = allowMultipleVotes

    const { data: updatedPoll, error: updateError } = await supabase
      .from('polls')
      .update(updateData)
      .eq('id', pollId)
      .select(
        `*, options:poll_options(*, responses:poll_responses(id))`
      )
      .single()

    if (updateError || !updatedPoll) {
      return NextResponse.json(
        { error: 'Poll not found' },
        { status: 404 }
      )
    }

    // Calculer les stats
    const totalVotes = updatedPoll.options?.reduce((sum: number, option: any) => 
      sum + (option.responses?.length || 0), 0) || 0
    
    const optionsWithStats = (updatedPoll.options || []).map((option: any) => ({
      ...option,
      votes: option.responses?.length || 0,
      percentage: totalVotes > 0 ? Math.round(((option.responses?.length || 0) / totalVotes) * 100) : 0
    }))

    const pollWithStats = {
      ...updatedPoll,
      totalVotes,
      options: optionsWithStats
    }

    return NextResponse.json(pollWithStats)
  } catch (error) {
    console.error('Error updating poll:', error)
    return NextResponse.json(
      { error: 'Failed to update poll' },
      { status: 500 }
    )
  }
}

// DELETE /api/polls/[pollId] - Supprimer un sondage
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const { id: pollId } = resolvedParams

    // Supprimer d'abord les options et réponses associées
    const { error: optionsError } = await supabase
      .from('poll_options')
      .delete()
      .eq('"pollId"', pollId)

    if (optionsError) {
      console.error('Error deleting poll options:', optionsError)
      return NextResponse.json(
        { error: 'Failed to delete poll options' },
        { status: 500 }
      )
    }

    // Puis supprimer le sondage
    const { error: pollError } = await supabase
      .from('polls')
      .delete()
      .eq('id', pollId)

    if (pollError) {
      console.error('Error deleting poll:', pollError)
      return NextResponse.json(
        { error: 'Failed to delete poll' },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Poll deleted successfully' })
  } catch (error) {
    console.error('Error deleting poll:', error)
    return NextResponse.json(
      { error: 'Failed to delete poll' },
      { status: 500 }
    )
  }
}