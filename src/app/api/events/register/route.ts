import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'

// Simple in-memory rate limiting
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000 // 1 hour
const RATE_LIMIT_MAX = 600 // Augmenté pour le développement
const rateLimitStore = new Map<string, { count: number; firstRequest: number }>()

function isRateLimited(ip: string) {
  // Désactiver le rate limiting en mode développement
  if (process.env.NODE_ENV === 'development') {
    console.log('Rate limiting désactivé en mode développement pour IP:', ip)
    return false
  }

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
    console.log('Rate limit atteint pour IP:', ip, 'Count:', entry.count)
    return true
  }

  entry.count++
  console.log('Rate limit count pour IP:', ip, 'Count:', entry.count)
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
      email,
      firstName,
      lastName,
      phone,
      company,
      position,
      experience,
      expectations,
      dietaryRestrictions,
      consent,
      language,
      checkOnly = false
    } = body
    
    // eventId est optionnel pour les vérifications (checkOnly)
    const eventId = body.eventId

    // Validation des champs obligatoires pour l'inscription complète
    if (!checkOnly) {
      // Pour l'inscription complète, eventId est requis
      if (!eventId) {
        return NextResponse.json(
          { error: 'ID d\'événement requis pour l\'inscription' },
          { status: 400 }
        )
      }
      
      if (!email || !firstName || !lastName || consent !== true) {
        return NextResponse.json(
          {
            error:
              'Les champs email, prénom, nom et consentement sont obligatoires'
          },
          { status: 400 }
        )
      }
    }

    // Validation de l'email (toujours requis)
    if (!email) {
      return NextResponse.json(
        { error: 'Email requis' },
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

    // Si c'est juste une vérification, retourner les informations de l'utilisateur s'il existe
    if (checkOnly) {
      // Vérifier si l'email est déjà inscrit à N'IMPORTE QUEL événement
      console.log('CheckOnly - Searching for email:', email)
      
      console.log('CheckOnly - Searching for email:', email, '(exact match)')
      
      const { data: existingRegistrations, error: searchError } = await serviceRoleSupabase
        .from('event_registrations')
        .select('*')
        .eq('email', email)
        .order('createdAt', { ascending: false }) // Prendre la plus récente
        .limit(1)

      if (searchError) {
        console.error('CheckOnly - Search error:', searchError)
      }
      
      console.log('CheckOnly - Existing registrations:', existingRegistrations)
      console.log('CheckOnly - Number of results:', existingRegistrations?.length || 0)
      
      // Debug: Vérifier manuellement avec une requête directe
      console.log('=== DEBUG: Vérification manuelle ===');
      const { data: debugRegistrations, error: debugError } = await serviceRoleSupabase
        .from('event_registrations')
        .select('*')
        .eq('email', email)
        .limit(5);
      
      console.log('Debug - Manual query results:', debugRegistrations);
      console.log('Debug - Manual query error:', debugError);

      // Test de recherche insensible à la casse
      console.log('=== DEBUG: Recherche insensible à la casse ===');
      const { data: caseInsensitiveResults, error: caseError } = await serviceRoleSupabase
        .from('event_registrations')
        .select('*')
        .ilike('email', email.toLowerCase())
        .limit(5);
      
      console.log('Debug - Case insensitive results:', caseInsensitiveResults);
      console.log('Debug - Case insensitive error:', caseError);

      // Test avec toutes les variations de casse possibles
      console.log('=== DEBUG: Test avec variations de casse ===');
      const emailVariations = [
        email,
        email.toLowerCase(),
        email.toUpperCase(),
        email.charAt(0).toUpperCase() + email.slice(1).toLowerCase()
      ];
      
      for (const variation of emailVariations) {
        console.log('Testing variation:', variation);
        const { data: variationResults } = await serviceRoleSupabase
          .from('event_registrations')
          .select('*')
          .eq('email', variation)
          .limit(1);
        console.log('Variation results for', variation, ':', variationResults);
      }

      if (existingRegistrations && existingRegistrations.length > 0) {
        const latestRegistration = existingRegistrations[0];
        
        // Pour le test: simuler un utilisateur anglais
        const testLanguage = email.includes('aboa.akoun40@gmail.com') ? 'en' : latestRegistration.language;
        
        return NextResponse.json({
          exists: true,
          registrationId: latestRegistration.id,
          userData: {
            firstName: latestRegistration.firstName,
            lastName: latestRegistration.lastName,
            position: latestRegistration.position,
            company: latestRegistration.company,
            language: testLanguage
          }
        })
      } else {
        return NextResponse.json({
          exists: false,
          message: 'Utilisateur non inscrit à cet événement'
        })
      }
    }

    // Pour l'inscription complète, vérifier l'événement
    if (!checkOnly) {
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
    }

    // Vérifier si l'email est déjà inscrit à CET événement spécifique
    const { data: existingRegistration } = await serviceRoleSupabase
      .from('event_registrations')
      .select('*')
      .eq('email', email)
      .eq('"eventId"', eventId)
      .maybeSingle()

    console.log('Registration - Existing registration:', existingRegistration)

    if (existingRegistration) {
      console.log('Email already registered:', email)
      // Si l'utilisateur existe déjà, retourner un statut 409 (conflit)
      // pour indiquer que l'utilisateur est déjà inscrit
      return NextResponse.json({
        exists: true,
        registrationId: existingRegistration.id,
        userData: {
          firstName: existingRegistration.firstName,
          lastName: existingRegistration.lastName,
          position: existingRegistration.position,
          company: existingRegistration.company,
          language: existingRegistration.language
        }
      }, { status: 409 })
    }

    // Pour l'inscription complète, vérifier le nombre maximum de participants
    if (!checkOnly && eventId) {
      // Récupérer l'événement pour vérifier maxAttendees
      const { data: eventData, error: eventError } = await serviceRoleSupabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .maybeSingle()

      if (eventError) {
        console.error('Event lookup error for maxAttendees:', eventError)
        throw eventError
      }

      if (eventData && (eventData as any).maxAttendees) {
        const { count: registrationCount } = await serviceRoleSupabase
          .from('event_registrations')
          .select('*', { count: 'exact', head: true })
          .eq('"eventId"', eventId)
          .eq('"isPublic"', true)

        if ((registrationCount || 0) >= (eventData as any).maxAttendees) {
          return NextResponse.json(
            { error: "L'événement est complet" },
            { status: 409 }
          )
        }
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
        consent,
        language: language || 'fr' // Utiliser la langue fournie ou 'fr' par défaut
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
      registrationId: registration.id
    })

  } catch (error) {
    console.error('Unexpected error in registration:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de l\'inscription' },
      { status: 500 }
    )
  }
}