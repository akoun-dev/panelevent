import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

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

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Trop de tentatives. Veuillez réessayer plus tard.' },
        { status: 429 }
      )
    }

    const body = await request.json()

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
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .maybeSingle()

    if (eventError) {
      throw eventError
    }

    if (!event) {
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
    const { data: existingRegistration } = await supabase
      .from('event_registrations')
      .select('id')
      .eq('eventId', eventId)
      .eq('email', email)
      .eq('isPublic', true)
      .maybeSingle()

    if (existingRegistration) {
      return NextResponse.json(
        { error: 'Cet email est déjà inscrit à cet événement' },
        { status: 409 }
      )
    }

    // Vérifier le nombre maximum de participants
    if (event.maxAttendees) {
      const { count: registrationCount } = await supabase
        .from('event_registrations')
        .select('*', { count: 'exact', head: true })
        .eq('eventId', eventId)
        .eq('isPublic', true)

      if ((registrationCount || 0) >= event.maxAttendees) {
        return NextResponse.json(
          { error: "L'événement est complet" },
          { status: 409 }
        )
      }
    }

    // Créer l'inscription
    const { data: registration, error: registrationError } = await supabase
      .from('event_registrations')
      .insert({
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
        isPublic: true,
        consent
      })
      .select('id')
      .single()

    if (registrationError) {
      throw registrationError
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

  } catch {
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de l\'inscription' },
      { status: 500 }
    )
  }
}