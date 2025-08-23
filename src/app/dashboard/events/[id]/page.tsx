"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar, MapPin, Users, MessageSquare, BarChart, Settings, ArrowLeft, QrCode } from 'lucide-react'
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
          <TabsTrigger value="participants">Participants</TabsTrigger>
          <TabsTrigger value="qa">Questions</TabsTrigger>
          <TabsTrigger value="polls">Sondages</TabsTrigger>
          <TabsTrigger value="program">Programme</TabsTrigger>
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
                <Link href={`/e/${event.slug}`}>
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart className="w-4 h-4 mr-2" />
                    Page publique de l'événement
                  </Button>
                </Link>
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

        <TabsContent value="participants">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des participants</CardTitle>
              <CardDescription>
                Consultez et gérez les inscriptions à votre événement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={`/dashboard/events/${eventId}/participants`}>
                <Button>
                  <Users className="w-4 h-4 mr-2" />
                  Accéder à la gestion des participants
                </Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="qa">
          <Card>
            <CardHeader>
              <CardTitle>Questions et réponses</CardTitle>
              <CardDescription>
                Modérez les questions des participants
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={`/dashboard/events/${eventId}/qa`}>
                <Button>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Modérer les questions
                </Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="polls">
          <Card>
            <CardHeader>
              <CardTitle>Sondages</CardTitle>
              <CardDescription>
                Créez et gérez les sondages de votre événement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={`/dashboard/events/${eventId}/polls`}>
                <Button>
                  <BarChart className="w-4 h-4 mr-2" />
                  Gérer les sondages
                </Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="program">
          <Card>
            <CardHeader>
              <CardTitle>Programme</CardTitle>
              <CardDescription>
                Organisez le programme de votre événement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {event.program?.hasProgram ? (
                <div className="space-y-4">
                  {/* Affichage des items de programme structurés */}
                  {event.program.programItems && event.program.programItems.length > 0 ? (
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold">Détails du programme</h3>
                      {event.program.programItems
                        .sort((a, b) => a.time.localeCompare(b.time))
                        .map((item) => (
                        <div key={item.id} className="border rounded-lg p-4 bg-card">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-foreground">{item.title}</h4>
                              {item.time && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  <Calendar className="w-4 h-4 inline mr-1" />
                                  {item.time}
                                </p>
                              )}
                              {item.description && (
                                <p className="text-sm text-muted-foreground mt-2">{item.description}</p>
                              )}
                              {item.speaker && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  <strong>Intervenant:</strong> {item.speaker}
                                </p>
                              )}
                              {item.location && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  <MapPin className="w-4 h-4 inline mr-1" />
                                  {item.location}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">Programme vide</p>
                      <p className="text-sm">Ajoutez des activités à votre programme</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">Aucun programme défini</p>
                  <p className="text-sm">Créez un programme pour votre événement</p>
                </div>
              )}
              <Link href={`/dashboard/events/${eventId}/program`}>
                <Button className="w-full">
                  <Calendar className="w-4 h-4 mr-2" />
                  {event.program?.hasProgram ? 'Modifier le programme' : 'Créer le programme'}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de l'événement</CardTitle>
              <CardDescription>
                Configurez les paramètres de votre événement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={`/dashboard/events/${eventId}/settings`}>
                <Button>
                  <Settings className="w-4 h-4 mr-2" />
                  Modifier les paramètres
                </Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}