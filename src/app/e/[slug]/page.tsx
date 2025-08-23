"use client"

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Users, ArrowLeft, Share2, QrCode } from 'lucide-react'
import Link from 'next/link'
import { RegistrationForm } from '@/components/shared/registration-form'
import { EventProgramDisplay } from '@/components/shared/event-program-display'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { Database } from '@/types/supabase'

type Event = Database['public']['Tables']['events']['Row'] & {
  branding?: { qrCode?: string } | null
  registeredCount?: number
}

export default function EventPage() {
  const { slug } = useParams<{ slug: string }>()
  const router = useRouter()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)

  const determinePhase = (ev: Event) => {
    const now = new Date()
    const start = new Date(ev.startDate)
    const end = ev.endDate ? new Date(ev.endDate) : null
    if (end && now > end) return 'post'
    if (now >= start) return 'live'
    return 'registration'
  }

  const fetchEvent = useCallback(async () => {
    try {
      const response = await fetch(`/api/events/by-slug/${slug}`)
      if (response.ok) {
        const data = await response.json()
        setEvent(data)
      } else {
        router.push('/')
      }
    } catch (error) {
      console.error('Failed to fetch event:', error)
      router.push('/')
    } finally {
      setLoading(false)
    }
  }, [slug, router])

  const handleRegistration = async (
    data: {
      firstName: string
      lastName: string
      email: string
      position: string
      company: string
      consent: boolean
    }
  ) => {
    setRegistering(true)
    try {
      if (!event?.id) return
      const response = await fetch('/api/events/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ eventId: event.id, ...data })
      })

      if (response.ok) {
        const result = await response.json()
        setIsRegistered(true)
        
        // Stocker l'ID d'inscription dans localStorage pour la page programme
        if (result.registrationId) {
          localStorage.setItem('registrationId', result.registrationId)
        }
        
        if (determinePhase(event) === 'live') {
          router.push('/program')
          return
        }
        fetchEvent()
      }
    } catch (error) {
      console.error('Failed to register:', error)
    } finally {
      setRegistering(false)
    }
  }

  useEffect(() => {
    fetchEvent()
  }, [fetchEvent])

  useEffect(() => {
    if (!event) return
    const currentPhase = determinePhase(event)
    if (currentPhase === 'post') {
      router.replace(`/events/${event.id}/feedback`)
    } else if (currentPhase === 'live' && isRegistered) {
      router.replace('/program')
    }
  }, [event, isRegistered, router])

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMM yyyy à HH:mm', { locale: fr })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-fern-frond/5 to-luxor-gold/5">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fern-frond"></div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-fern-frond/5 to-luxor-gold/5">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-fern-frond">Événement non trouvé</h1>
          <Button asChild className="bg-fern-frond hover:bg-fern-frond/90 text-white">
            <Link href="/">Retour à l'accueil</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-fern-frond/5 to-luxor-gold/5">
      {/* Header */}
      <header className="border-b border-fern-frond/20 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-fern-frond rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">P</span>
              </div>
              <h1 className="text-2xl font-bold text-fern-frond">PanelEvent</h1>
            </div>
            <Button variant="ghost" size="sm" asChild className="text-fern-frond hover:bg-fern-frond/10">
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Event Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tight text-fern-frond">{event.title}</h1>
                  {event.description && (
                    <p className="text-lg text-luxor-gold">{event.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  {event.isActive && <Badge variant="default" className="bg-fern-frond text-white border-fern-frond">Actif</Badge>}
                  {event.isPublic && <Badge variant="secondary" className="bg-luxor-gold/20 text-luxor-gold border-luxor-gold/30">Public</Badge>}
                </div>
              </div>

              {/* Event Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-luxor-gold" />
                  <span className="text-fern-frond">{formatDate(event.startDate)}</span>
                </div>
                {event.endDate && (
                  <div className="text-sm text-luxor-gold">
                    au {format(new Date(event.endDate), 'HH:mm')}
                  </div>
                )}
                {event.location && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-luxor-gold" />
                    <span className="text-fern-frond">{event.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-luxor-gold" />
                  <span className="text-fern-frond">{event.registeredCount || 0} participant{event.registeredCount !== 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-fern-frond/20 text-fern-frond hover:bg-fern-frond/10">
                <Share2 className="w-4 h-4 mr-2" />
                Partager
              </Button>
              {event.branding?.qrCode && (
                <Button variant="outline" size="sm" className="border-fern-frond/20 text-fern-frond hover:bg-fern-frond/10">
                  <QrCode className="w-4 h-4 mr-2" />
                  Code QR
                </Button>
              )}
            </div>

            {/* Event Content */}
            <Card className="border-fern-frond/20 bg-white">
              <CardHeader>
                <CardTitle className="text-fern-frond">À propos de cet événement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  {event.description ? (
                    <p className="text-fern-frond">{event.description}</p>
                  ) : (
                    <p className="text-luxor-gold">Aucune description disponible pour cet événement.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Event Program */}
            <EventProgramDisplay program={event.program || null} />
          </div>

          {/* Registration Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <RegistrationForm
                event={event}
                onSubmit={handleRegistration}
                loading={registering}
                isRegistered={isRegistered}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}