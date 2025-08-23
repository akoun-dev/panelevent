import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'

// Simple in-memory rate limiting
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000 // 1 hour
const RATE_LIMIT_MAX = 5
const rateLimitStore = new Map<string, { count: number; firstRequest: number }>()

function isRateLimited(ip: string) {
  const now = Date.now()
  const entry = rateLimitStore.get(ip)

  if (!entry) {
    rateLimitStore.set(ip, { count: 1, firstRequest: now })
    return false
  }

  if (now - entry.firstRequest > RATE_LIMIT_WINDOW_MS) {
    rateLimitStore.set(ip, { count: 1, firstRequest: now })
    return false
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return true
  }

  entry.count++
  return false
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    
    // Créer un client avec la clé de service role pour contourner RLS
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: 'Configuration serveur manquante' },
        { status: 500 }
      )
    }
    
    const serviceRoleSupabase = createClient(supabaseUrl, serviceRoleKey)

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Trop de tentatives. Veuillez réessayer plus tard.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    console.log('Registration request body:', body)

    const {
      eventId,
      email,
      firstName,
      lastName,
      phone,
      company,
      position,
      experience,
      expectations,
      dietaryRestrictions,
      consent
    } = body

    // Validation des champs obligatoires
    if (!eventId || !email || !firstName || !lastName || consent !== true) {
      return NextResponse.json(
        {
          error:
            'Les champs email, prénom, nom et consentement sont obligatoires'
        },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Format d'adresse email invalide" },
        { status: 400 }
      )
    }

    // Vérifier si l'événement existe
    const { data: event, error: eventError } = await serviceRoleSupabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .maybeSingle()

    if (eventError) {
      console.error('Event lookup error:', eventError)
      throw eventError
    }

    if (!event) {
      console.log('Event not found:', eventId)
      return NextResponse.json(
        { error: 'Événement non trouvé' },
        { status: 404 }
      )
    }

    // Vérifier si l'événement est public
    if (!event.isPublic) {
      return NextResponse.json(
        { error: 'Cet événement n\'accepte pas les inscriptions publiques' },
        { status: 403 }
      )
    }

    // Vérifier si l'email est déjà inscrit
    const { data: existingRegistration } = await serviceRoleSupabase
      .from('event_registrations')
      .select('id')
      .eq('"eventId"', eventId)
      .eq('email', email)
      .eq('"isPublic"', true)
      .maybeSingle()

    if (existingRegistration) {
      console.log('Email already registered:', email)
      return NextResponse.json(
        { error: 'Cet email est déjà inscrit à cet événement' },
        { status: 409 }
      )
    }

    // Vérifier le nombre maximum de participants
    if (event.maxAttendees) {
      const { count: registrationCount } = await serviceRoleSupabase
        .from('event_registrations')
        .select('*', { count: 'exact', head: true })
        .eq('"eventId"', eventId)
        .eq('"isPublic"', true)

      if ((registrationCount || 0) >= event.maxAttendees) {
        return NextResponse.json(
          { error: "L'événement est complet" },
          { status: 409 }
        )
      }
    }

    // Créer l'inscription avec un ID généré
    const registrationId = uuidv4()
    const { data: registration, error: insertError } = await serviceRoleSupabase
      .from('event_registrations')
      .insert({
        id: registrationId,
        "eventId": eventId,
        email,
        "firstName": firstName,
        "lastName": lastName,
        phone,
        company,
        position,
        experience,
        expectations,
        dietaryRestrictions: dietaryRestrictions,
        "isPublic": true,
        consent
      })
      .select('id')
      .single()

    if (insertError) {
      console.error('Registration insert error:', insertError)
      return NextResponse.json(
        { error: "Une erreur est survenue lors de l'inscription" },
        { status: 500 }
      )
    }

    // Retourner une réponse de succès
    return NextResponse.json({
      message: 'Inscription réussie',
      registrationId: registration.id,
      event: {
        id: event.id,
        title: event.title,
        slug: event.slug
      }
    })

  } catch (error) {
    console.error('Unexpected error in registration:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de l\'inscription' },
      { status: 500 }
    )
  }
}