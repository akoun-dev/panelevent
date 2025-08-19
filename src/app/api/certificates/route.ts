import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'


// POST /api/certificates - Générer un nouveau certificat pour l'utilisateur authentifié
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user?.role !== 'ORGANIZER' && session.user?.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { templateId, eventId } = body
    const userId = session.user?.id
    if (!userId) {
      return NextResponse.json({ error: 'User ID not found' }, { status: 401 })
    }

    if (!templateId || !eventId) {
      return NextResponse.json(
        { error: 'TemplateId and eventId are required' },
        { status: 400 }
      )
    }


    const { data: registration } = await supabase
      .from('event_registrations')
      .select('id')
      .eq('user_id', userId)
      .eq('event_id', eventId)

      .eq('attended', true)
      .maybeSingle()

    if (!registration) {
      return NextResponse.json(
        { error: 'User did not attend the event' },
        { status: 400 }
      )
    }

    const { data: existingCertificate } = await supabase
      .from('certificates')
      .select('id')
      .eq('templateId', templateId)
      .eq('userId', userId)
      .maybeSingle()

    if (existingCertificate) {
      return NextResponse.json(
        { error: 'Certificate already exists for this user and template' },
        { status: 400 }
      )
    }

    const { data: template, error: templateError } = await supabase
      .from('certificate_templates')
      .select('*, event:events(*, organizer:users(*)), user:users(*)')
      .eq('id', templateId)
      .single()

    if (templateError || !template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }


    const { data: user } = await supabase
      .from('users')
      .select('id, name, email')
      .eq('id', userId)
      .single()
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    let content = template.content
    const issuedAt = new Date()

    content = content
      .replace('[NOM DU PARTICIPANT]', user.name || 'Participant')
      .replace('[TITRE DE L\'ÉVÉNEMENT]', template.event.title)
      .replace('[DATE DE DÉBUT]', new Date(template.event.startDate).toLocaleDateString('fr-FR'))
      .replace('[DATE DE FIN]', template.event.endDate ? new Date(template.event.endDate).toLocaleDateString('fr-FR') : '')
      .replace('[DATE DE DÉLIVRANCE]', issuedAt.toLocaleDateString('fr-FR'))
      .replace('[ORGANISATEUR]', template.event.organizer?.name || 'Organisateur')

    const certificateUrl = `/certificates/${templateId}_${userId}_${Date.now()}.pdf`
    const qrCodeUrl = `/qrcodes/${templateId}_${userId}_${Date.now()}.png`

    const { data: certificate, error: certError } = await supabase
      .from('certificates')
      .insert({
        templateId,
        userId,
        eventId,
        content,
        issuedAt,
        certificateUrl,
        qrCodeUrl
      })
      .select('*, template:certificate_templates(id,title,description), user:users(id,name,email), event:events(id,title,startDate,endDate)')
      .single()

    if (certError) {
      return NextResponse.json(
        { error: 'Failed to generate certificate' },
        { status: 500 }
      )
    }

    return NextResponse.json(certificate)
  } catch (error) {
    console.error('Error generating certificate:', error)
    return NextResponse.json(
      { error: 'Failed to generate certificate' },
      { status: 500 }
    )
  }
}

// GET /api/certificates - Récupérer les certificats (avec filtres)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const eventId = searchParams.get('eventId')
    const templateId = searchParams.get('templateId')

    let query = supabase
      .from('certificates')
      .select('*, template:certificate_templates(id,title,description), user:users(id,name,email), event:events(id,title,startDate,endDate)')
      .order('issuedAt', { ascending: false })

    if (userId) query = query.eq('userId', userId)
    if (eventId) query = query.eq('eventId', eventId)
    if (templateId) query = query.eq('templateId', templateId)

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching certificates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch certificates' },
      { status: 500 }
    )
  }
}

