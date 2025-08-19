import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 403 }
    )
  }

  try {
    // Vérifier les dépendances avant suppression
    const dependencies = await db.$transaction([
      db.eventRegistration.count({ where: { eventId: params.id } }),
      db.feedback.count({ where: { eventId: params.id } }),
      db.certificate.count({ where: { eventId: params.id } })
    ])

    if (dependencies.some(count => count > 0)) {
      return NextResponse.json(
        { error: 'Event has dependencies and cannot be deleted' },
        { status: 400 }
      )
    }

    await db.event.delete({
      where: { id: params.id }
    })

    return NextResponse.json(
      { message: 'Event deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting event:', error)
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    )
  }
}