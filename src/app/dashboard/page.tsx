"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin, Users, Plus, BarChart, MessageSquare, BarChart as Poll, Edit, QrCode, Trash2 } from 'lucide-react'
import Link from 'next/link'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { QRCodeGenerator } from '@/components/QRCodeGenerator'
import EditEventForm from '@/components/events/EditEventForm'

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
  _count?: {
    registrations: number
    questions: number
    polls: number
  }
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (status === 'authenticated' && session.user?.role !== 'ORGANIZER' && session.user?.role !== 'ADMIN') {
      router.push('/')
      return
    }

    fetchEvents()
  }, [status, session, router])

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events/my-events')
      if (response.ok) {
        const { events } = await response.json()
        setEvents(events || [])
      }
    } catch (error) {
      console.error('Failed to fetch events:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteEvent = async (eventId: string, eventTitle: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'événement "${eventTitle}" ? Cette action est irréversible.`)) return
    
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        // Mettre à jour l'état local
        setEvents(prev => prev.filter(event => event.id !== eventId))
        // Afficher un message de succès
        alert('Événement supprimé avec succès')
      } else {
        const error = await response.json()
        alert(`Erreur lors de la suppression: ${error.message || 'Erreur inconnue'}`)
      }
    } catch (error) {
      console.error('Failed to delete event:', error)
      alert('Erreur lors de la suppression de l\'événement')
    }
  }

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

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h2 className="text-3xl font-bold mb-2">
          Bienvenue, {session.user?.name} !
        </h2>
        <p className="text-muted-foreground">
          Gérez vos événements et suivez leur performance en temps réel
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Événements</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events.length}</div>
            <p className="text-xs text-muted-foreground">
              {events.filter(e => e.isActive).length} actifs
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Participants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {events.reduce((acc, event) => acc + (event._count?.registrations || 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total inscrits
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Questions</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {events.reduce((acc, event) => acc + (event._count?.questions || 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Questions posées
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sondages</CardTitle>
            <Poll className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {events.reduce((acc, event) => acc + (event._count?.polls || 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Sondages créés
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Events Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">Tous les événements</TabsTrigger>
            <TabsTrigger value="active">Actifs</TabsTrigger>
            <TabsTrigger value="upcoming">À venir</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="space-y-4">
          {events.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucun événement</h3>
                <p className="text-muted-foreground mb-4">
                  Commencez par créer votre premier événement
                </p>
                <Link href="/events/create">
                  <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                    <Plus className="w-4 h-4 mr-2" />
                    Créer un événement
                  </div>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <Card key={event.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-xl">{event.title}</CardTitle>
                      <div className="flex gap-2">
                        {event.isActive && <Badge variant="default">Actif</Badge>}
                        {event.isPublic && <Badge variant="secondary">Public</Badge>}
                      </div>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {event.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(event.startDate)}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{event._count?.registrations || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          <span>{event._count?.questions || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Poll className="w-4 h-4" />
                          <span>{event._count?.polls || 0}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <TooltipProvider>
                        <Link href={`/dashboard/events/${event.id}`} className="flex-1">
                          <Button className="w-full">
                            Gérer
                          </Button>
                        </Link>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Dialog>
                              <DialogTrigger asChild>
                                <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10 px-0">
                                  <Edit className="w-4 h-4" />
                                </div>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[600px]">
                                <DialogHeader>
                                  <DialogTitle>Modifier l'événement</DialogTitle>
                                  <DialogDescription>
                                    Modifiez les informations de votre événement
                                  </DialogDescription>
                                </DialogHeader>
                                <EditEventForm
                                  event={event}
                                  onSuccess={() => {
                                    window.location.reload()
                                  }}
                                  onCancel={() => {
                                    // Fermer le dialog
                                    const dialog = document.querySelector('[data-state="open"]')
                                    if (dialog) {
                                      dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
                                    }
                                  }}
                                />
                              </DialogContent>
                            </Dialog>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Modifier les informations</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link href={`/dashboard/events/${event.id}/qa`}>
                              <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10 px-0">
                                <MessageSquare className="w-4 h-4" />
                              </div>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Questions & Réponses</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link href={`/dashboard/events/${event.id}/polls`}>
                              <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10 px-0">
                                <Poll className="w-4 h-4" />
                              </div>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Sondages</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Dialog>
                              <DialogTrigger asChild>
                                <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10 px-0">
                                  <QrCode className="w-4 h-4" />
                                </div>
                              </DialogTrigger>
                              <DialogContent className="max-w-md">
                                <DialogHeader>
                                  <DialogTitle>QR Code d'inscription</DialogTitle>
                                  <DialogDescription>
                                    Scannez ce code pour accéder à la page d'inscription
                                  </DialogDescription>
                                </DialogHeader>
                                <QRCodeGenerator
                                  url={`${process.env.NEXTAUTH_URL || process.env.NEXTAUTH_URL}/register/${event.id}`}
                                  eventName={event.title}
                                />
                              </DialogContent>
                            </Dialog>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>QR Code d'inscription</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => handleDeleteEvent(event.id, event.title)}
                              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10 px-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Supprimer l'événement</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.filter(e => e.isActive).map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl">{event.title}</CardTitle>
                    <Badge variant="default">Actif</Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {event.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(event.startDate)}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/dashboard/events/${event.id}`} className="flex-1">
                      <Button className="w-full">
                        Gérer
                      </Button>
                    </Link>
                    <Link href={`/dashboard/events/${event.id}/qa`}>
                      <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10 px-0">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                    </Link>
                    <Link href={`/dashboard/events/${event.id}/polls`}>
                      <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10 px-0">
                        <Poll className="w-4 h-4" />
                      </div>
                    </Link>
                    <Link href={`/e/${event.slug}`}>
                      <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10 px-0">
                        <BarChart className="w-4 h-4" />
                      </div>
                    </Link>
                    <button
                      onClick={() => handleDeleteEvent(event.id, event.title)}
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10 px-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.filter(e => new Date(e.startDate) > new Date()).map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl">{event.title}</CardTitle>
                    <Badge variant="outline">À venir</Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {event.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(event.startDate)}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/dashboard/events/${event.id}`} className="flex-1">
                      <Button className="w-full">
                        Gérer
                      </Button>
                    </Link>
                    <Link href={`/dashboard/events/${event.id}/qa`}>
                      <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10 px-0">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                    </Link>
                    <Link href={`/dashboard/events/${event.id}/polls`}>
                      <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10 px-0">
                        <Poll className="w-4 h-4" />
                      </div>
                    </Link>
                    <Link href={`/e/${event.slug}`}>
                      <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10 px-0">
                        <BarChart className="w-4 h-4" />
                      </div>
                    </Link>
                    <button
                      onClick={() => handleDeleteEvent(event.id, event.title)}
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10 px-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}