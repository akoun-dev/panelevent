import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { generateRegistrationToken } from '@/lib/tokens'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const { data: event } = await supabase
      .from('events')
      .select('id, title')
      .eq('id', resolvedParams.id)
      .maybeSingle()

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