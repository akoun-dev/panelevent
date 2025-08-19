import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

interface QuestionUpdateData {
  status?: string
  answer?: string | null
  answered_at?: string | null
  answered_by?: string
}

// PATCH /api/questions/[id] - Mettre à jour une question (statut, réponse)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const body = await request.json()
    const { status, answer, answeredBy } = body

    const updateData: QuestionUpdateData = {}

    if (status) {
      updateData.status = status
    }

    if (answer !== undefined) {
      updateData.answer = answer
      updateData.answered_at = answer ? new Date().toISOString() : null
    }

    if (answeredBy) {
      updateData.answered_by = answeredBy
    }

    const { data: question, error } = await supabase
      .from('questions')
      .update(updateData)
      .eq('id', resolvedParams.id)
      .select(`*, panel:panels(id,title,start_time,end_time)`)
      .single()

    if (error) throw error

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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const { error } = await supabase
      .from('questions')
      .delete()
      .eq('id', resolvedParams.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting question:', error)
    return NextResponse.json(
      { error: 'Failed to delete question' },
      { status: 500 }
    )
  }
}