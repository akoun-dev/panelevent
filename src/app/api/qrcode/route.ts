import { NextRequest, NextResponse } from 'next/server'
import QRCode from 'qrcode'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const eventId = searchParams.get('eventId')
    const size = parseInt(searchParams.get('size') || '280')

    if (!eventId) {
      return NextResponse.json(
        { error: 'eventId parameter is required' },
        { status: 400 }
      )
    }

    const eventUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/event/${eventId}`
    
    // Générer le QR code en tant que buffer
    const qrCodeBuffer = await QRCode.toBuffer(eventUrl, {
      width: size,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })

    // Retourner l'image PNG - convertir Buffer en Uint8Array
    return new NextResponse(new Uint8Array(qrCodeBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `inline; filename="qrcode-${eventId}.png"`,
        'Cache-Control': 'public, max-age=86400', // Cache pour 24h
      },
    })
  } catch (error) {
    console.error('Error generating QR code:', error)
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    )
  }
}