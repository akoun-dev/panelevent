"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Calendar, MapPin, Users, MessageSquare, BarChart, Settings, ArrowLeft, QrCode, CheckCircle, XCircle, CalendarDays, UsersRound, FileText } from 'lucide-react'
import { toast } from 'sonner'
import QRCodeComponent from '@/components/qr-code'

interface ProgramData {
  hasProgram: boolean
  programItems?: Array<{
    id: string
    time: string
    title: string
    description?: string
    speaker?: string
    location?: string
  }>
}

interface Event {
  id: string
  title: string
  description?: string
  slug: string
  startDate: string
  endDate?: string
  location?: string
  isPublic: boolean
  isActive: boolean
  maxAttendees?: number
  program?: ProgramData | null
  _count?: {
    registrations: number
    questions: number
    polls: number
  }
}

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [eventId, setEventId] = useState<string>('')
  const [isSaving, setIsSaving] = useState(false)
  const [eventSettings, setEventSettings] = useState({
    isActive: false,
    isPublic: false,
    maxAttendees: 0
  })

  useEffect(() => {
    const fetchEventAndProgram = async (eventId: string) => {
      try {
        // Fetch event details
        const eventResponse = await fetch(`/api/organizer/events/${eventId}`)
        if (eventResponse.ok) {
          const eventData = await eventResponse.json()
          
          // Fetch program data separately to ensure we get the correct structure
          const programResponse = await fetch(`/api/events/${eventId}/program`)
          if (programResponse.ok) {
            const programData = await programResponse.json()
            // Merge program data with event data
            setEvent({
              ...eventData,
              program: programData.program
            })
          } else {
            // If program API fails, use the event data as is
            setEvent(eventData)
          }
        } else if (eventResponse.status === 404) {
          toast.error('Événement non trouvé')
          router.push('/dashboard')
        } else if (eventResponse.status === 403) {
          toast.error('Accès non autorisé')
          router.push('/dashboard')
        }
      } catch (error) {
        console.error('Failed to fetch event:', error)
        toast.error('Erreur lors du chargement de l\'événement')
      } finally {
        setLoading(false)
      }
    }

    const init = async () => {
      const { id } = await params
      setEventId(id)
      
      if (status === 'unauthenticated') {
        router.push('/auth/signin')
        return
      }

      if (status === 'authenticated' && session.user?.role !== 'ORGANIZER' && session.user?.role !== 'ADMIN') {
        router.push('/')
        return
      }

      fetchEventAndProgram(id)
    }

    init()
  }, [status, session, router, params])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleSettingChange = async (field: string, value: any) => {
    setIsSaving(true)
    try {
      const response = await fetch(`/api/organizer/events/${eventId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [field]: value })
      })

      if (response.ok) {
        const updatedEvent = await response.json()
        setEventSettings(prev => ({
          ...prev,
          [field]: value
        }))
        setEvent(prev => prev ? { ...prev, [field]: value } : null)
        toast.success('Paramètre mis à jour avec succès')
      } else {
        toast.error('Erreur lors de la mise à jour')
      }
    } catch (error) {
      console.error('Failed to update setting:', error)
      toast.error('Erreur lors de la mise à jour')
    } finally {
      setIsSaving(false)
    }
  }

  // Mettre à jour les paramètres lorsque l'événement est chargé
  useEffect(() => {
    if (event) {
      setEventSettings({
        isActive: event.isActive,
        isPublic: event.isPublic,
        maxAttendees: event.maxAttendees || 0
      })
    }
  }, [event])

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session || (session.user?.role !== 'ORGANIZER' && session.user?.role !== 'ADMIN')) {
    return null
  }

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold mb-4">Événement non trouvé</h2>
        <Link href="/dashboard">
          <Button>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au tableau de bord
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Retour au tableau de bord
          </Link>
          <h2 className="text-3xl font-bold">{event.title}</h2>
          <p className="text-muted-foreground">
            Gérez votre événement et ses fonctionnalités
          </p>
        </div>
        <div className="flex gap-2">
          {event.isActive && <Badge variant="default">Actif</Badge>}
          {event.isPublic && <Badge variant="secondary">Public</Badge>}
        </div>
      </div>

      {/* Event Info */}
      <Card>
        <CardHeader>
          <CardTitle>Informations de l'événement</CardTitle>
          <CardDescription>
            Détails et configuration de votre événement
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informations de l'événement */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Date de début</p>
                  <p className="text-sm text-muted-foreground">{formatDate(event.startDate)}</p>
                </div>
              </div>
              {event.endDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Date de fin</p>
                    <p className="text-sm text-muted-foreground">{formatDate(event.endDate)}</p>
                  </div>
                </div>
              )}
              {event.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Lieu</p>
                    <p className="text-sm text-muted-foreground">{event.location}</p>
                  </div>
                </div>
              )}
            </div>

            {/* QR Code pour le check-in */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">QR Code de check-in</p>
                  <p className="text-sm text-muted-foreground">Scannez pour l'enregistrement</p>
                </div>
              </div>
              <QRCodeComponent eventId={eventId} size={160} />
            </div>
          </div>
          
          {event.description && (
            <div>
              <p className="text-sm font-medium mb-2">Description</p>
              <p className="text-sm text-muted-foreground">{event.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Management Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Aperçu</TabsTrigger>

          <TabsTrigger value="settings">Paramètres</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Participants</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{event._count?.registrations || 0}</div>
                <p className="text-xs text-muted-foreground">Total inscrits</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Questions</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{event._count?.questions || 0}</div>
                <p className="text-xs text-muted-foreground">Questions posées</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sondages</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{event._count?.polls || 0}</div>
                <p className="text-xs text-muted-foreground">Sondages créés</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Actions rapides</CardTitle>
                <CardDescription>Gérez rapidement votre événement</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href={`/dashboard/events/${eventId}/participants`}>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    Gérer les participants
                  </Button>
                </Link>
                <Link href={`/dashboard/events/${eventId}/qa`}>
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Modérer les questions
                  </Button>
                </Link>
                <Link href={`/dashboard/events/${eventId}/polls`}>
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart className="w-4 h-4 mr-2" />
                    Créer des sondages
                  </Button>
                </Link>
                <Link href={`/dashboard/events/${eventId}/program`}>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="w-4 h-4 mr-2" />
                    Éditer le programme
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Liens importants</CardTitle>
                <CardDescription>Accès rapide aux pages publiques</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href={`/register/${event.slug}`}>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    Page d'inscription
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Paramètres de visibilité */}
            <Card>
              <CardHeader>
                <CardTitle>Visibilité</CardTitle>
                <CardDescription>Contrôlez la visibilité de votre événement</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="isActive">Événement actif</Label>
                    <p className="text-sm text-muted-foreground">
                      Activer ou désactiver l'événement
                    </p>
                  </div>
                  <Switch
                    id="isActive"
                    checked={eventSettings.isActive}
                    onCheckedChange={(checked) => handleSettingChange('isActive', checked)}
                    disabled={isSaving}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="isPublic">Événement public</Label>
                    <p className="text-sm text-muted-foreground">
                      Rendre cet événement visible par tous
                    </p>
                  </div>
                  <Switch
                    id="isPublic"
                    checked={eventSettings.isPublic}
                    onCheckedChange={(checked) => handleSettingChange('isPublic', checked)}
                    disabled={isSaving}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Capacité */}
            <Card>
              <CardHeader>
                <CardTitle>Capacité</CardTitle>
                <CardDescription>Gérez la capacité de votre événement</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="maxAttendees">Nombre maximum de participants</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      id="maxAttendees"
                      type="number"
                      value={eventSettings.maxAttendees}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 0
                        setEventSettings(prev => ({ ...prev, maxAttendees: value }))
                      }}
                      onBlur={() => handleSettingChange('maxAttendees', eventSettings.maxAttendees)}
                      className="flex h-10 w-20 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="0"
                      disabled={isSaving}
                    />
                    <span className="text-sm text-muted-foreground">
                      {eventSettings.maxAttendees === 0 ? 'Illimité' : 'places'}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    0 pour capacité illimitée
                  </p>
                </div>

                {eventSettings.maxAttendees > 0 && event._count && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Places restantes</span>
                    <span className="font-medium">
                      {eventSettings.maxAttendees - (event._count.registrations || 0)}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions rapides */}
            <Card>
              <CardHeader>
                <CardTitle>Actions rapides</CardTitle>
                <CardDescription>Actions de gestion rapide</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href={`/dashboard/events/${eventId}/settings`}>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    Paramètres complets
                  </Button>
                </Link>
                
                {event && (
                  <div className="flex items-center justify-between text-sm pt-2 border-t">
                    <span className="text-muted-foreground">Participants inscrits</span>
                    <span className="font-medium">{event._count?.registrations || 0}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Statut de l'événement */}
            <Card>
              <CardHeader>
                <CardTitle>Statut</CardTitle>
                <CardDescription>État actuel de votre événement</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Visibilité</span>
                  <Badge variant={eventSettings.isPublic ? "default" : "secondary"}>
                    {eventSettings.isPublic ? 'Public' : 'Privé'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Statut</span>
                  <Badge variant={eventSettings.isActive ? "default" : "secondary"}>
                    {eventSettings.isActive ? 'Actif' : 'Inactif'}
                  </Badge>
                </div>

                {event && (
                  <>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Capacité</span>
                      <span>
                        {eventSettings.maxAttendees === 0
                          ? 'Illimitée'
                          : `${eventSettings.maxAttendees} places`
                        }
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Taux d'occupation</span>
                      <span className="font-medium">
                        {eventSettings.maxAttendees > 0
                          ? `${Math.round(((event._count?.registrations || 0) / eventSettings.maxAttendees) * 100)}%`
                          : `${event._count?.registrations || 0} inscrits`
                        }
                      </span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Fonctionnalités activées */}
            <Card>
              <CardHeader>
                <CardTitle>Fonctionnalités</CardTitle>
                <CardDescription>Fonctionnalités activées pour cet événement</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Certificats</span>
                  <Badge variant="outline">
                    {event._count?.registrations ? 'Disponible' : 'Non configuré'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Questions/Réponses</span>
                  <Badge variant={event._count?.questions ? "default" : "outline"}>
                    {event._count?.questions ? `${event._count.questions} questions` : 'Aucune'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Sondages</span>
                  <Badge variant={event._count?.polls ? "default" : "outline"}>
                    {event._count?.polls ? `${event._count.polls} sondages` : 'Aucun'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Programme</span>
                  <Badge variant={event.program?.hasProgram ? "default" : "outline"}>
                    {event.program?.hasProgram ? 'Configuré' : 'Non configuré'}
                  </Badge>
                </div>

                <div className="pt-2 border-t">
                  <Link href={`/dashboard/events/${eventId}/settings`}>
                    <Button variant="outline" size="sm" className="w-full">
                      <Settings className="w-3 h-3 mr-1" />
                      Configurer les fonctionnalités
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}