import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const events = await db.event.findMany({
      where: {
        organizerId: session.user.id
      },
      select: {
        id: true,
        title: true,
        description: true,
        slug: true,
        startDate: true,
        endDate: true,
        location: true,
        isPublic: true,
        isActive: true,
        program: true,
        panels: {
          orderBy: {
            order: 'asc'
          }
        },
        _count: {
          select: {
            registrations: true,
            questions: true,
            polls: true
          }
        }
      },
      orderBy: {
        startDate: 'desc'
      }
    })

    return NextResponse.json({ events })
  } catch (error) {
    console.error('Error fetching organizer events:', error)
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}