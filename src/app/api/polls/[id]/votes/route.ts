import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'

// POST /api/polls/[pollId]/votes - Ajouter ou modifier un vote
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const { id: pollId } = resolvedParams
    const body = await request.json()
    const { userId, optionIds } = body

    console.log('Received vote request:', { pollId, userId, optionIds })

    if (!userId || !optionIds || !Array.isArray(optionIds) || optionIds.length === 0) {
      console.log('Missing required fields:', { userId, optionIds })
      return NextResponse.json(
        { error: 'Missing userId or optionIds' },
        { status: 400 }
      )
    }

    let finalUserId = userId
    
    // Pour les votes anonymes, créer un utilisateur temporaire si nécessaire
    if (userId.startsWith('anonymous_')) {
      // Vérifier si l'utilisateur anonyme existe déjà
      const { data: existingUser, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('id', userId)
        .single()

      if (userError || !existingUser) {
        // Créer un utilisateur temporaire pour les votes anonymes
        const { error: createError } = await supabase
          .from('users')
          .insert({
            id: userId,
            name: 'Anonymous Voter',
            email: `${userId}@anonymous.panelevent`,
            role: 'ATTENDEE'
          })

        if (createError) {
          console.error('Error creating anonymous user:', createError)
          // Si la création échoue, utiliser un ID utilisateur par défaut
          finalUserId = 'anonymous-default-user'
        }
      }
    }

    // Récupérer le sondage pour vérifier s'il accepte les votes multiples
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .select('*, options:poll_options(*)')
      .eq('id', pollId)
      .single()

    if (pollError || !poll) {
      console.log('Poll not found error:', pollError)
      return NextResponse.json(
        { error: 'Poll not found' },
        { status: 404 }
      )
    }

    // Vérifier que le sondage est actif
    if (!poll.isActive && !poll.is_active) {
      console.log('Poll is not active:', poll.isActive, poll.is_active)
      return NextResponse.json(
        { error: 'Poll is not active' },
        { status: 400 }
      )
    }

    // Vérifier les contraintes de votes
    const allowMultiple = poll.allowMultipleVotes || poll.allow_multiple_votes
    if (!allowMultiple && optionIds.length > 1) {
      console.log('Multiple votes not allowed:', allowMultiple, 'but received:', optionIds.length)
      return NextResponse.json(
        { error: 'This poll does not allow multiple votes' },
        { status: 400 }
      )
    }

    // Vérifier que toutes les options existent et appartiennent au sondage
    const validOptions = poll.options.filter((option: any) => optionIds.includes(option.id))
    if (validOptions.length !== optionIds.length) {
      console.log('Invalid options detected. Valid options:', validOptions.length, 'Requested:', optionIds.length)
      console.log('Poll options:', poll.options.map((o: any) => o.id))
      console.log('Requested optionIds:', optionIds)
      return NextResponse.json(
        { error: 'One or more invalid options' },
        { status: 400 }
      )
    }

    // Récupérer les votes existants de l'utilisateur pour ce sondage
    const { data: existingVotes, error: votesError } = await supabase
      .from('poll_responses')
      .select('*')
      .eq('pollId', pollId)
      .eq('userId', userId)

    if (votesError) {
      console.error('Error fetching existing votes:', votesError)
      return NextResponse.json(
        { error: 'Failed to fetch existing votes' },
        { status: 500 }
      )
    }

    // Pour les votes uniques, supprimer l'ancien vote s'il existe
    if (!poll.allow_multiple_votes && existingVotes && existingVotes.length > 0) {
      const { error: deleteError } = await supabase
        .from('poll_responses')
        .delete()
        .eq('pollId', pollId)
        .eq('userId', userId)

      if (deleteError) {
        console.error('Error deleting existing votes:', deleteError)
        return NextResponse.json(
          { error: 'Failed to delete existing votes' },
          { status: 500 }
        )
      }
    }

    // Pour les votes multiples, supprimer seulement les votes pour les options désélectionnées
    if (poll.allow_multiple_votes && existingVotes) {
      const existingOptionIds = existingVotes.map((vote: any) => vote.optionId)
      const optionsToRemove = existingOptionIds.filter((id: string) => !optionIds.includes(id))
      
      if (optionsToRemove.length > 0) {
        const { error: deleteError } = await supabase
          .from('poll_responses')
          .delete()
          .eq('pollId', pollId)
          .eq('userId', userId)
          .in('optionId', optionsToRemove)

        if (deleteError) {
          console.error('Error removing deselected votes:', deleteError)
          return NextResponse.json(
            { error: 'Failed to remove deselected votes' },
            { status: 500 }
          )
        }
      }
    }

    // Créer les nouveaux votes (uniquement pour les options qui n'ont pas déjà été votées)
    const existingOptionIds = existingVotes ? existingVotes.map((vote: any) => vote.optionId) : []
    const newOptionIds = optionIds.filter((id: string) => !existingOptionIds.includes(id))

    if (newOptionIds.length > 0) {
      const votesToInsert = newOptionIds.map((optionId: string) => ({
        id: uuidv4(),
        pollId: pollId,
        optionId: optionId,
        userId: userId
      }))

      const { error: insertError } = await supabase
        .from('poll_responses')
        .insert(votesToInsert)

      if (insertError) {
        console.error('Error inserting new votes:', insertError)
        return NextResponse.json(
          { error: 'Failed to insert new votes' },
          { status: 500 }
        )
      }
    }

    // Récupérer le sondage mis à jour avec les stats
    const { data: updatedPoll, error: updatedPollError } = await supabase
      .from('polls')
      .select('*, options:poll_options(*, responses:poll_responses(id))')
      .eq('id', pollId)
      .single()

    if (updatedPollError || !updatedPoll) {
      return NextResponse.json(
        { error: 'Failed to fetch updated poll' },
        { status: 500 }
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
    console.error('Error handling vote:', error)
    return NextResponse.json(
      { error: 'Failed to handle vote' },
      { status: 500 }
    )
  }
}

// GET /api/polls/[pollId]/votes - Récupérer les votes d'un sondage
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const { id: pollId } = resolvedParams
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    const { data: responses, error } = await supabase
      .from('poll_responses')
      .select(`
        *,
        user:users(id, name, email),
        option:poll_options(id, text)
      `)
      .eq('pollId', pollId)

    if (error) {
      console.error('Error fetching votes:', error)
      return NextResponse.json(
        { error: 'Failed to fetch votes' },
        { status: 500 }
      )
    }

    return NextResponse.json(responses || [])
  } catch (error) {
    console.error('Error fetching votes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch votes' },
      { status: 500 }
    )
  }
}