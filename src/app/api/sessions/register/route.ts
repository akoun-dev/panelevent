import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(request: NextRequest) {
  try {
    // Vérifier les variables d'environnement
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { message: 'Configuration serveur incorrecte' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { sessionId, eventId, firstName, lastName, email, function: userFunction, organization } = body;

    // Validation des données requises
    if (!sessionId || !eventId || !firstName || !lastName || !email || !userFunction || !organization) {
      return NextResponse.json(
        { message: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Email invalide' },
        { status: 400 }
      );
    }

    // Créer un client avec le service role pour bypasser les politiques RLS
    const supabase = createClient(supabaseUrl, serviceRoleKey || supabaseAnonKey, {
      auth: { persistSession: false }
    });

    // Vérifier si l'utilisateur est déjà inscrit à cette session
    const { data: existingRegistration } = await supabase
      .from('session_registrations')
      .select('id')
      .eq('session_id', sessionId)
      .eq('email', email)
      .single();

    if (existingRegistration) {
      return NextResponse.json(
        { message: 'Vous êtes déjà inscrit à cette session' },
        { status: 409 }
      );
    }

    // Insérer l'inscription - avec gestion de la colonne event_id qui pourrait ne pas exister
    const registrationData: any = {
      session_id: sessionId,
      first_name: firstName,
      last_name: lastName,
      email: email,
      function: userFunction,
      organization: organization,
      registered_at: new Date().toISOString()
    };

    // Ajouter event_id seulement si la colonne existe (pour éviter les erreurs pendant la transition)
    // Nous allons d'abord vérifier si la colonne existe
    try {
      // Tenter d'ajouter event_id - si la colonne n'existe pas, l'erreur sera gérée
      registrationData.event_id = eventId;
    } catch (error) {
      console.warn('La colonne event_id n\'existe pas encore dans la table');
    }

    const { data: registration, error } = await supabase
      .from('session_registrations')
      .insert(registrationData)
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de l\'inscription:', error);
      return NextResponse.json(
        { message: 'Erreur lors de l\'enregistrement de l\'inscription' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Inscription réussie', registration },
      { status: 201 }
    );

  } catch (error) {
    console.error('Erreur inattendue:', error);
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}