import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db: any = supabase


// GET /api/events/[id]/polls - Récupérer tous les sondages d'un événement
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const { id } = resolvedParams
    const { searchParams } = new URL(request.url)
    const panelId = searchParams.get('panelId')


    const whereClause: any = {
      panel: {
        eventId: id
      }
    }

    let query = supabase
      .from('polls')
      .select(
        `*, panel:panels!inner(id,title,start_time,end_time), options:poll_options(*, responses:poll_responses(id))`
      )
      .eq('panel.event_id', id)
      .order('created_at', { ascending: false })

    if (panelId) {
      query = query.eq('panel_id', panelId)
    }

    const { data: polls, error } = await query
    if (error) throw error

    // Calculer les votes et pourcentages
    const pollsWithStats = (polls || []).map(poll => {
      const totalVotes = poll.options?.reduce(
        (sum: number, option: any) => sum + option.responses.length,
        0
      ) || 0

      const optionsWithStats = (poll.options || []).map((option: any) => ({
        ...option,
        votes: option.responses.length,
        percentage:
          totalVotes > 0
            ? Math.round((option.responses.length / totalVotes) * 100)
            : 0
      }))

      return {
        ...poll,
        totalVotes,
        options: optionsWithStats
      }
    })

    return NextResponse.json(pollsWithStats)
  } catch (error) {
    console.error('Error fetching polls:', error)
    return NextResponse.json(
      { error: 'Failed to fetch polls' },
      { status: 500 }
    )
  }
}

// POST /api/events/[id]/polls - Créer un nouveau sondage
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const { id } = resolvedParams
    const body = await request.json()
    const { question, description, panelId, isAnonymous, allowMultipleVotes, options } = body

    if (!question || !panelId || !options || options.length < 2) {
      return NextResponse.json(
        { error: 'Missing required fields or insufficient options' },
        { status: 400 }
      )
    }

    // Vérifier que le panel appartient à l'événement
    const { data: panel, error: panelError } = await supabase
      .from('panels')
      .select('id')
      .eq('id', panelId)
      .eq('event_id', id)
      .single()

    if (panelError || !panel) {
      return NextResponse.json(
        { error: 'Panel not found or does not belong to this event' },
        { status: 404 }
      )
    }

    const { data: createdPoll, error: pollError } = await supabase
      .from('polls')
      .insert({
        question,
        description,
        panel_id: panelId,
        event_id: id,
        is_anonymous: isAnonymous || false,
        allow_multiple_votes: allowMultipleVotes || false
      })
      .select('id')
      .single()

    if (pollError || !createdPoll) throw pollError

    const { error: optionsError } = await supabase.from('poll_options').insert(
      options.map((optionText: string, index: number) => ({
        poll_id: createdPoll.id,
        text: optionText,
        order: index
      }))
    )

    if (optionsError) throw optionsError

    const { data: poll, error: fetchError } = await supabase
      .from('polls')
      .select(
        `*, panel:panels(id,title,start_time,end_time), options:poll_options(*, responses:poll_responses(id))`
      )
      .eq('id', createdPoll.id)
      .single()

    if (fetchError || !poll) throw fetchError

    const totalVotes = poll.options.reduce(
      (sum: number, option: any) => sum + option.responses.length,
      0
    )
    const optionsWithStats = poll.options.map((option: any) => ({
      ...option,
      votes: option.responses.length,
      percentage: 0
    }))

    const pollWithStats = {
      ...poll,
      totalVotes,
      options: optionsWithStats
    }

    return NextResponse.json(pollWithStats)
  } catch (error) {
    console.error('Error creating poll:', error)
    return NextResponse.json(
      { error: 'Failed to create poll' },
      { status: 500 }
    )
  }
}