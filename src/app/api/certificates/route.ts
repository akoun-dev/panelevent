import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { supabase } from '@/lib/supabase'
import { Prisma } from '@prisma/client'

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

    // Vérifier si l'utilisateur est inscrit et a participé à l'événement
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

    // Vérifier si un certificat existe déjà pour ce modèle et utilisateur
    const existingCertificate = await db.certificate.findFirst({
      where: {
        templateId,
        userId
      }
    })

    if (existingCertificate) {
      return NextResponse.json(
        { error: 'Certificate already exists for this user and template' },
        { status: 400 }
      )
    }

    // Récupérer le modèle pour obtenir le contenu
    const template = await db.certificateTemplate.findUnique({
      where: { id: templateId },
      include: {
        event: {
          include: {
            organizer: true
          }
        },
        user: true
      }
    })

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    // Récupérer les informations de l'utilisateur
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

    // Générer le contenu du certificat en remplaçant les variables
    let content = template.content
    const issuedAt = new Date()

    content = content
      .replace('[NOM DU PARTICIPANT]', user.name || 'Participant')
      .replace('[TITRE DE L\'ÉVÉNEMENT]', template.event.title)
      .replace('[DATE DE DÉBUT]', template.event.startDate.toLocaleDateString('fr-FR'))
      .replace('[DATE DE FIN]', template.event.endDate?.toLocaleDateString('fr-FR') || '')
      .replace('[DATE DE DÉLIVRANCE]', issuedAt.toLocaleDateString('fr-FR'))
      .replace('[ORGANISATEUR]', template.event.organizer?.name || 'Organisateur')

    // Générer un URL unique pour le certificat (simulation)
    const certificateUrl = `/certificates/${templateId}_${userId}_${Date.now()}.pdf`
    const qrCodeUrl = `/qrcodes/${templateId}_${userId}_${Date.now()}.png`

    // Créer le certificat
    const certificate = await db.certificate.create({
      data: {
        templateId,
        userId,
        eventId,
        content,
        issuedAt,
        certificateUrl,
        qrCodeUrl
      },
      include: {
        template: {
          select: {
            id: true,
            title: true,
            description: true
          }
        },
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
            startDate: true,
            endDate: true
          }
        }
      }
    })

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

    const whereClause: Prisma.CertificateWhereInput = {}

    if (userId) whereClause.userId = userId
    if (eventId) whereClause.eventId = eventId
    if (templateId) whereClause.templateId = templateId

    const certificates = await db.certificate.findMany({
      where: whereClause,
      include: {
        template: {
          select: {
            id: true,
            title: true,
            description: true
          }
        },
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
            startDate: true,
            endDate: true
          }
        }
      },
      orderBy: {
        issuedAt: 'desc'
      }
    })

    return NextResponse.json(certificates)
  } catch (error) {
    console.error('Error fetching certificates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch certificates' },
      { status: 500 }
    )
  }
}