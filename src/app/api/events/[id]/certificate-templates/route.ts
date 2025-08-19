import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/events/[id]/certificate-templates - Récupérer tous les modèles de certificats d'un événement
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params
  try {
    const { data, error } = await supabase
      .from('certificate_templates')
      .select('*, event:events(*), user:users(*), certificates:certificates(id, issuedAt)')
      .eq('eventId', resolvedParams.id)
      .order('createdAt', { ascending: false })

    if (error) throw error

    const templatesWithStats = (data || []).map(template => ({
      ...template,
      issuedCount: template.certificates ? template.certificates.length : 0
    }))

    return NextResponse.json(templatesWithStats)
  } catch (error) {
    console.error('Error fetching certificate templates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch certificate templates' },
      { status: 500 }
    )
  }
}

// POST /api/events/[id]/certificate-templates - Créer un nouveau modèle de certificat
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params
  try {
    const body = await request.json()
    const { title, description, content, autoGenerate } = body

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('certificate_templates')
      .insert({
        title,
        description,
        content,
        autoGenerate: autoGenerate || false,
        eventId: resolvedParams.id
      })
      .select('*, event:events(*), user:users(*), certificates:certificates(id, issuedAt)')
      .single()

    if (error) throw error

    const templateWithStats = {
      ...data,
      issuedCount: data?.certificates ? data.certificates.length : 0
    }

    return NextResponse.json(templateWithStats)
  } catch (error) {
    console.error('Error creating certificate template:', error)
    return NextResponse.json(
      { error: 'Failed to create certificate template' },
      { status: 500 }
    )
  }
}