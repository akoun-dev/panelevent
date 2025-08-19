import { NextResponse } from 'next/server'
import { db } from '@/lib/supabase'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Vérifier que l'événement existe et que l'utilisateur est l'organisateur
    const event = await db.event.findUnique({
      where: { id }
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    if (event.organizerId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Not event owner' },
        { status: 403 }
      )
    }

    // Récupérer les inscriptions avec les informations utilisateur
    const registrations = await db.eventRegistration.findMany({
      where: { eventId: id },
      include: {
        user: {
          select: {
            email: true,
            name: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Formater les données pour inclure les informations utilisateur
    const formattedRegistrations = registrations.map(reg => ({
      id: reg.id,
      email: reg.email || reg.user?.email || '',
      firstName: reg.firstName || reg.user?.name?.split(' ')[0] || '',
      lastName: reg.lastName || reg.user?.name?.split(' ').slice(1).join(' ') || '',
      phone: reg.phone || '',
      company: reg.company || '',
      position: reg.position || '',
      attended: reg.attended,
      createdAt: reg.createdAt.toISOString()
    }))

    return NextResponse.json({ 
      registrations: formattedRegistrations,
      total: formattedRegistrations.length
    })
  } catch (error) {
    console.error('Failed to fetch registrations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch registrations' },
      { status: 500 }
    )
  }
}