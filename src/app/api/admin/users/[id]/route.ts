import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            eventRegistrations: true,
            organizedEvents: true,
            questions: true,
            pollResponses: true,
            feedbacks: true,
            certificates: true
          }
        },
        organizedEvents: {
          select: {
            id: true,
            title: true,
            startDate: true,
            isActive: true
          }
        },
        eventRegistrations: {
          include: {
            event: {
              select: {
                id: true,
                title: true,
                startDate: true
              }
            }
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Failed to fetch user:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { role, name, email } = await request.json()

    const updateData: any = {}
    if (role) updateData.role = role
    if (name !== undefined) updateData.name = name
    if (email) updateData.email = email

    const user = await db.user.update({
      where: { id: params.id },
      data: updateData,
      include: {
        _count: {
          select: {
            eventRegistrations: true,
            organizedEvents: true,
            questions: true,
            pollResponses: true,
            feedbacks: true,
            certificates: true
          }
        }
      }
    })

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Failed to update user:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Prevent deleting the last admin
    const userToDelete = await db.user.findUnique({
      where: { id: params.id }
    })

    if (!userToDelete) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (userToDelete.role === 'ADMIN') {
      const adminCount = await db.user.count({
        where: { role: 'ADMIN' }
      })

      if (adminCount <= 1) {
        return NextResponse.json({ 
          error: 'Cannot delete the last administrator' 
        }, { status: 400 })
      }
    }

    await db.user.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete user:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}