import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// PATCH /api/questions/[id] - Mettre à jour une question (statut, réponse)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { status, answer, answeredBy } = body

    const updateData: any = {}
    
    if (status) {
      updateData.status = status
    }
    
    if (answer !== undefined) {
      updateData.answer = answer
      updateData.answeredAt = answer ? new Date() : null
    }
    
    if (answeredBy) {
      updateData.answeredBy = answeredBy
    }

    const question = await db.question.update({
      where: { id: params.id },
      data: updateData,
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
    console.error('Error updating question:', error)
    return NextResponse.json(
      { error: 'Failed to update question' },
      { status: 500 }
    )
  }
}

// DELETE /api/questions/[id] - Supprimer une question
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.question.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting question:', error)
    return NextResponse.json(
      { error: 'Failed to delete question' },
      { status: 500 }
    )
  }
}