import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const { id } = resolvedParams
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    
    // Si un email est fourni, vérifier l'inscription par email (pour les utilisateurs non authentifiés)
    if (email) {
      const { data: registration } = await supabase
        .from('event_registrations')
        .select('id')
        .eq('"eventId"', id)
        .eq('email', email.toLowerCase())
        .eq('"isPublic"', true)
        .maybeSingle()

      return NextResponse.json({
        registered: !!registration,
        registrationId: registration?.id
      })
    }
    
    // Vérification pour utilisateur authentifié
    if (!session || !session.user?.id) {
      return NextResponse.json({ registered: false })
    }

    const { data: registration } = await supabase
      .from('event_registrations')
      .select('id')
      .eq('"userId"', session.user.id)
      .eq('"eventId"', id)
      .maybeSingle()

    return NextResponse.json({ registered: !!registration })
  } catch (error) {
    console.error('Error checking registration status:', error)
    return NextResponse.json(
      { error: 'Failed to check registration status' },
      { status: 500 }
    )
  }
}