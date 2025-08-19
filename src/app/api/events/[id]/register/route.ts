import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateRegistrationToken } from '@/lib/tokens'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const event = await db.event.findUnique({
      where: { id: params.id },
      select: { id: true, title: true }
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    const token = generateRegistrationToken(event.id)
    const registrationUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/register/${event.id}?token=${token}`

    return NextResponse.json({
      url: registrationUrl,
      qrCodeData: registrationUrl
    })
  } catch (error) {
    console.error('Error generating registration link:', error)
    return NextResponse.json(
      { error: 'Failed to generate registration link' },
      { status: 500 }
    )
  }
}