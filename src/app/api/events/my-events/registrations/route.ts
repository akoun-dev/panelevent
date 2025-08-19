import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/supabase'

export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || (session.user?.role !== 'ORGANIZER' && session.user?.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!session.user?.id) {
      return NextResponse.json({ error: 'User ID not found' }, { status: 400 })
    }

    const registrations = await db.eventRegistration.findMany({
      where: {
        event: {
          organizerId: session.user.id
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        event: {
          select: {
            id: true,
            title: true,
            slug: true,
            startDate: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Transform the data to match the expected format
    const transformedRegistrations = registrations.map(reg => ({
      id: reg.id,
      user: reg.user,
      event: reg.event,
      registeredAt: reg.createdAt,
      status: reg.consent ? 'confirmed' : 'pending'
    }))

    return NextResponse.json({ registrations: transformedRegistrations })
  } catch (error) {
    console.error('Failed to fetch organizer registrations:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}