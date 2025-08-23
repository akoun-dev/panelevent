import { randomBytes } from 'crypto'
import { supabase } from '@/lib/supabase'

export function generateRegistrationToken(eventId: string): string {
  const token = randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h expiration

  // Stocker le token en base de données via Supabase
  supabase.from('registration_tokens').insert({
    token,
    event_id: eventId,
    expires_at: expiresAt.toISOString(),
    used: false
  })

  return token
}

export async function validateRegistrationToken(token: string, eventId: string): Promise<boolean> {
  const { data: tokenRecord } = await supabase
    .from('registration_tokens')
    .select('event_id, expires_at, used')
    .eq('token', token)
    .single()

  if (!tokenRecord ||
      tokenRecord.event_id !== eventId ||
      tokenRecord.used ||
      new Date() > new Date(tokenRecord.expires_at)) {
    return false
  }

  return true
}

export async function markTokenAsUsed(token: string): Promise<void> {
  await supabase
    .from('registration_tokens')
    .update({ used: true })
    .eq('token', token)
}