import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

// Générer un token de réinitialisation
function generateResetToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

// POST /api/auth/reset-password - Demander une réinitialisation
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email requis' },
        { status: 400 }
      )
    }

    // Vérifier si l'utilisateur existe
    const { data: user } = await supabase
      .from('users')
      .select('id, email, name')
      .eq('email', email)
      .single()

    if (!user) {
      // Pour des raisons de sécurité, on ne révèle pas si l'email existe
      return NextResponse.json(
        { message: 'Si cet email existe, un lien de réinitialisation a été envoyé' },
        { status: 200 }
      )
    }

    // Générer un token de réinitialisation
    const resetToken = generateResetToken()
    const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000) // 1 heure

    // Stocker le token dans la base de données
    const { error } = await supabase
      .from('password_reset_tokens')
      .upsert({
        userId: user.id,
        token: resetToken,
        expiresAt: expiresAt.toISOString()
      })

    if (error) {
      console.error('Error storing reset token:', error)
      return NextResponse.json(
        { error: 'Erreur lors de la génération du token' },
        { status: 500 }
      )
    }

    // En production, on enverrait un email ici
    console.log('Reset token generated:', {
      userId: user.id,
      email: user.email,
      resetToken,
      expiresAt
    })

    return NextResponse.json(
      { message: 'Si cet email existe, un lien de réinitialisation a été envoyé' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error in reset password request:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

// PATCH /api/auth/reset-password - Réinitialiser le mot de passe
export async function PATCH(request: NextRequest) {
  try {
    const { token, newPassword } = await request.json()

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: 'Token et nouveau mot de passe requis' },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 6 caractères' },
        { status: 400 }
      )
    }

    // Vérifier le token
    const { data: resetToken } = await supabase
      .from('password_reset_tokens')
      .select('*')
      .eq('token', token)
      .gt('expiresAt', new Date().toISOString())
      .single()

    if (!resetToken) {
      return NextResponse.json(
        { error: 'Token invalide ou expiré' },
        { status: 400 }
      )
    }

    // Hasher le nouveau mot de passe
    const saltRounds = 12
    const passwordHash = await bcrypt.hash(newPassword, saltRounds)

    // Mettre à jour le mot de passe
    const { error: updateError } = await supabase
      .from('users')
      .update({ passwordHash })
      .eq('id', resetToken.userId)

    if (updateError) {
      console.error('Error updating password:', updateError)
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour du mot de passe' },
        { status: 500 }
      )
    }

    // Supprimer le token utilisé
    await supabase
      .from('password_reset_tokens')
      .delete()
      .eq('token', token)

    return NextResponse.json(
      { message: 'Mot de passe réinitialisé avec succès' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error in password reset:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}