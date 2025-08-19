import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/supabase'
import { Prisma, QuestionStatus } from '@prisma/client'

// GET /api/events/[id]/questions - Récupérer toutes les questions d'un événement
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const { id } = resolvedParams
    const { searchParams } = new URL(request.url)
    const panelId = searchParams.get('panelId')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const whereClause: Prisma.QuestionWhereInput = {
      panel: {
        eventId: id
      }
    }

    if (panelId) {
      whereClause.panelId = panelId
    }

    if (status && status !== 'all') {
      whereClause.status = status.toUpperCase() as QuestionStatus
    }

    if (search) {
      whereClause.OR = [
        { content: { contains: search } },
        { authorName: { contains: search } }
      ]
    }

    const questions = await db.question.findMany({
      where: whereClause,
      include: {
        panel: {
          select: {
            id: true,
            title: true,
            startTime: true,
            endTime: true
          }
        },
        votes: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Calculer les votes
    const questionsWithVotes = questions.map(question => ({
      ...question,
      upvotes: question.votes.filter(vote => vote.type === 'UP').length,
      downvotes: question.votes.filter(vote => vote.type === 'DOWN').length
    }))

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
    const { content, panelId, authorName, authorEmail } = body

    if (!content || !panelId || !authorName || !authorEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Vérifier que le panel appartient à l'événement
    const panel = await db.panel.findFirst({
      where: {
        id: panelId,
        eventId: id
      }
    })

    if (!panel) {
      return NextResponse.json(
        { error: 'Panel not found or does not belong to this event' },
        { status: 404 }
      )
    }

    const question = await db.question.create({
      data: {
        content,
        panelId,
        authorName,
        authorEmail,
        status: 'PENDING'
      },
      include: {
        panel: {
          select: {
            id: true,
            title: true,
            startTime: true,
            endTime: true
          }
        },
        votes: true
      }
    })

    return NextResponse.json(question)
  } catch (error) {
    console.error('Error creating question:', error)
    return NextResponse.json(
      { error: 'Failed to create question' },
      { status: 500 }
    )
  }
}