import { randomBytes } from 'crypto'
import { db } from '@/lib/supabase'

export function generateRegistrationToken(eventId: string): string {
  const token = randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h expiration

  // Stocker le token en base de données
  db.registrationToken.create({
    data: {
      token,
      eventId,
      expiresAt,
      used: false
    }
  })

  return token
}

export async function validateRegistrationToken(token: string, eventId: string): Promise<boolean> {
  const tokenRecord = await db.registrationToken.findUnique({
    where: { token },
    select: { 
      eventId: true,
      expiresAt: true,
      used: true 
    }
  })

  if (!tokenRecord || 
      tokenRecord.eventId !== eventId || 
      tokenRecord.used ||
      new Date() > tokenRecord.expiresAt) {
    return false
  }

  return true
}

export async function markTokenAsUsed(token: string): Promise<void> {
  await db.registrationToken.update({
    where: { token },
    data: { used: true }
  })
}