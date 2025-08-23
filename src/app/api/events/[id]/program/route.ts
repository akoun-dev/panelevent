import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

import { ProgramData, convertToMultilingualProgram } from '@/lib/program-translations'

// Interface pour la compatibilité avec l'ancien format
interface LegacyProgramItem {
  id: string
  time: string
  title: string
  description?: string
  speaker?: string
  location?: string
}

interface LegacyProgramData {
  hasProgram: boolean
  programItems?: LegacyProgramItem[]
  updatedAt?: string
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params to ensure they're resolved
    const { id } = await params
    const session = await getServerSession(authOptions)
    
    if (!session || (session.user?.role !== 'ADMIN' && session.user?.role !== 'ORGANIZER')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: event } = await supabase
      .from('events')
      .select('organizerId, program')
      .eq('id', id)
      .maybeSingle()

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    if (session.user?.role !== 'ADMIN' && event.organizerId !== session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let programData: ProgramData | null = null
    if (event.program) {
      try {
        const parsedData = JSON.parse(event.program)
        
        // Vérifier si c'est l'ancien format (LegacyProgramData)
        if (parsedData.programItems && parsedData.programItems.length > 0 && typeof parsedData.programItems[0].title === 'string') {
          // Convertir l'ancien format au nouveau format multilingue
          console.log('Conversion du programme legacy vers le format multilingue')
          programData = {
            hasProgram: parsedData.hasProgram,
            programItems: convertToMultilingualProgram(parsedData.programItems),
            updatedAt: parsedData.updatedAt
          }
        } else {
          // C'est déjà le nouveau format
          programData = parsedData as ProgramData
        }
        
        // Nettoyer les anciens champs
        if (programData && 'programText' in programData) {
          programData = {
            hasProgram: programData.hasProgram,
            programItems: programData.programItems || [],
            updatedAt: programData.updatedAt
          }
        }
      } catch {
        // Si ce n'est pas du JSON valide
        programData = {
          hasProgram: false,
          programItems: []
        }
      }
    } else {
      programData = {
        hasProgram: false,
        programItems: []
      }
    }

    return NextResponse.json({ program: programData })
  } catch (error) {
    console.error('Failed to fetch event program:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params to ensure they're resolved
    const { id } = await params
    const session = await getServerSession(authOptions)
    
    if (!session || (session.user?.role !== 'ADMIN' && session.user?.role !== 'ORGANIZER')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: event } = await supabase
      .from('events')
      .select('organizerId')
      .eq('id', id)
      .maybeSingle()

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    if (session.user?.role !== 'ADMIN' && event.organizerId !== session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { hasProgram, programItems } = body
    
    // Convertir les données d'entrée au format multilingue si nécessaire
    let multilingualProgramItems = programItems
    
    // Vérifier si les items sont dans l'ancien format (chaînes simples)
    if (programItems && programItems.length > 0 && typeof programItems[0].title === 'string') {
      console.log('Conversion des nouvelles données au format multilingue')
      multilingualProgramItems = convertToMultilingualProgram(programItems)
    }

    // Validate program items time format
    if (programItems) {
      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
      for (const item of programItems) {
        if (!timeRegex.test(item.time)) {
          return NextResponse.json(
            { error: `Format d'heure invalide pour "${item.title}"` },
            { status: 400 }
          )
        }
      }
    }

    let programValue: string | null = null
    if (hasProgram) {
      programValue = JSON.stringify({
        hasProgram: true,
        programItems: multilingualProgramItems || [],
        updatedAt: new Date().toISOString()
      })
    }

    const { data: updatedEvent, error: updateError } = await supabase
      .from('events')
      .update({ program: programValue })
      .eq('id', id)
      .select('id, title, program')
      .single()

    if (updateError) {
      console.error('Failed to update event program:', updateError)
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }

    return NextResponse.json({ event: updatedEvent })
  } catch (error) {
    console.error('Failed to update event program:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}