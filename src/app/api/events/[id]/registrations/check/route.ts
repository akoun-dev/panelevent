import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user?.id) {
      return NextResponse.json({ registered: false })
    }

    const registration = await db.eventRegistration.findUnique({
      where: {
        userId_eventId: {
          userId: session.user.id,
          eventId: id
        }
      }
    })

    return NextResponse.json({ registered: !!registration })
  } catch (error) {
    console.error('Error checking registration status:', error)
    return NextResponse.json(
      { error: 'Failed to check registration status' },
      { status: 500 }
    )
  }
}