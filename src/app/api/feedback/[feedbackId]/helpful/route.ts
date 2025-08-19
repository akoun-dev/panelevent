import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

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

    // Vérifier si l'utilisateur a déjà voté
    const existingVote = await db.helpfulVote.findUnique({
      where: {
        feedbackId_userId: {
          feedbackId: resolvedParams.feedbackId,
          userId
        }
      }
    })

    let vote

    if (existingVote) {
      // Si le vote existe déjà, le supprimer (toggle)
      vote = await db.helpfulVote.delete({
        where: {
          feedbackId_userId: {
            feedbackId: resolvedParams.feedbackId,
            userId
          }
        }
      })
    } else {
      // Créer un nouveau vote
      vote = await db.helpfulVote.create({
        data: {
          feedbackId: resolvedParams.feedbackId,
          userId
        }
      })
    }

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
    const votes = await db.helpfulVote.findMany({
      where: { feedbackId: resolvedParams.feedbackId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(votes)
  } catch (error) {
    console.error('Error fetching helpful votes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch helpful votes' },
      { status: 500 }
    )
  }
}