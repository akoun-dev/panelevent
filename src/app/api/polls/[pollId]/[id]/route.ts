import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// PATCH /api/polls/[id] - Mettre à jour un sondage (activer/désactiver)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { isActive } = body

    if (typeof isActive !== 'boolean') {
      return NextResponse.json(
        { error: 'isActive must be a boolean' },
        { status: 400 }
      )
    }

    const poll = await db.poll.update({
      where: { id: params.id },
      data: { isActive },
      include: {
        panel: {
          select: {
            id: true,
            title: true,
            startTime: true,
            endTime: true
          }
        },
        options: {
          include: {
            responses: true
          }
        }
      }
    })

    // Calculer les stats
    const totalVotes = poll.options.reduce((sum, option) => sum + option.responses.length, 0)
    const optionsWithStats = poll.options.map(option => ({
      ...option,
      votes: option.responses.length,
      percentage: totalVotes > 0 ? Math.round((option.responses.length / totalVotes) * 100) : 0
    }))

    const pollWithStats = {
      ...poll,
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

// DELETE /api/polls/[id] - Supprimer un sondage
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.poll.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting poll:', error)
    return NextResponse.json(
      { error: 'Failed to delete poll' },
      { status: 500 }
    )
  }
}