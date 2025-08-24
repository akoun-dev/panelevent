"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Users, Plus, Eye, FileText, QrCode, MessageSquare, BarChart, BarChart as Poll, Edit } from 'lucide-react'
import { QRCodeGenerator } from '@/components/QRCodeGenerator'
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
import CreateEventForm from '@/components/events/CreateEventForm'
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
  }
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events/my-events')
      if (response.ok) {
        const data = await response.json()
        setEvents(data.events || [])
      }
    } catch (error) {
      console.error('Failed to fetch events:', error)
    } finally {
      setLoading(false)
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mes événements</h1>
          <p className="text-muted-foreground">
            Gérez tous vos événements créés
          </p>
        </div>
        
        {/* Déplacer le Dialog au niveau racine */}
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Créer un événement
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Créer un nouvel événement</DialogTitle>
            </DialogHeader>
            <CreateEventForm onSuccess={() => window.location.reload()} />
          </DialogContent>
        </Dialog>
      </div>

      {events.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun événement</h3>
            <p className="text-muted-foreground text-center mb-4">
              Vous n'avez pas encore créé d'événement.
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Créer votre premier événement
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                  <DialogTitle>Créer un nouvel événement</DialogTitle>
                </DialogHeader>
                <CreateEventForm onSuccess={() => window.location.reload()} />
              </DialogContent>
            </Dialog>
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
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{event._count?.registrations || 0} participants</span>
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
                  </TooltipProvider>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}