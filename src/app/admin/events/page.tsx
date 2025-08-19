"use client"

import { useState, useEffect, useCallback } from 'react'
import { DeleteEventModal } from '@/components/admin/DeleteEventModal'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Calendar, MapPin, Users, Search, Filter, Plus, Edit, Trash2, Eye, ToggleLeft, ToggleRight, FileText, QrCode } from 'lucide-react'
import { QRCodeGenerator } from '@/components/QRCodeGenerator'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

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
  branding?: Record<string, unknown>
  program?: string
  createdAt: string
  updatedAt: string
  organizer: {
    id: string
    name?: string
    email: string
    role: string
  }
  _count: {
    registrations: number
    questions: number
    polls: number
    feedbacks: number
    certificates: number
  }
}

export default function AdminEventsPage() {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    isPublic: true,
    isActive: false
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })

  const fetchEvents = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString()
      })
      
      if (searchTerm) params.append('search', searchTerm)
      if (statusFilter !== 'all') params.append('status', statusFilter)

      const response = await fetch(`/api/admin/events?${params}`)
      if (response.ok) {
        const data = await response.json()
        setEvents(data.events || [])
        setPagination(prev => data.pagination || prev)
      }
    } catch (error) {
      console.error('Failed to fetch events:', error)
    } finally {
      setLoading(false)
    }
  }, [pagination.page, pagination.limit, searchTerm, statusFilter])

  const handleSearch = useCallback(() => {
    setPagination(prev => ({ ...prev, page: 1 }))
    fetchEvents()
  }, [fetchEvents])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch()
    }, 300)
    return () => clearTimeout(timeoutId)
  }, [handleSearch, searchTerm])

  const handleFilterChange = useCallback((status: string) => {
    setStatusFilter(status)
    setPagination(prev => ({ ...prev, page: 1 }))
  }, [])

  useEffect(() => {
    handleFilterChange(statusFilter)
  }, [handleFilterChange, statusFilter])

  const handleCreateEvent = async () => {
    try {
      const response = await fetch('/api/admin/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newEvent)
      })

      if (response.ok) {
        await fetchEvents()
        setIsCreateDialogOpen(false)
        setNewEvent({
          title: '',
          description: '',
          startDate: '',
          endDate: '',
          location: '',
          isPublic: true,
          isActive: false
        })
      }
    } catch (error) {
      console.error('Failed to create event:', error)
    }
  }

  const handleDeleteEvent = (eventId: string) => {
    setSelectedEventId(eventId)
    setDeleteModalOpen(true)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDeleteConfirmed = async () => {
    if (!selectedEventId) return
    
    try {
      const response = await fetch(`/api/admin/events/${selectedEventId}/delete`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchEvents()
      }
    } catch (error) {
      console.error('Failed to delete event:', error)
    } finally {
      setDeleteModalOpen(false)
    }
  }

  const handleToggleEventStatus = async (eventId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/events/${eventId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive })
      })

      if (response.ok) {
        await fetchEvents()
      }
    } catch (error) {
      console.error('Failed to toggle event status:', error)
    }
  }

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }))
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Date non définie'
    try {
      return format(new Date(dateString), 'dd MMM yyyy à HH:mm', { locale: fr })
    } catch (error) {
      console.error('Erreur de formatage de date:', error)
      return 'Date invalide'
    }
  }

  // Responsive event card component for mobile
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const EventCard = ({ event }: { event: Event }) => (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{event.title}</h3>
              {event.location && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                  <MapPin className="w-3 h-3" />
                  {event.location}
                </div>
              )}
            </div>
            <div className="flex gap-1">
              <Badge variant={event.isActive ? 'default' : 'secondary'}>
                {event.isActive ? 'Actif' : 'Inactif'}
              </Badge>
              <Badge variant={event.isPublic ? 'default' : 'outline'}>
                {event.isPublic ? 'Public' : 'Privé'}
              </Badge>
            </div>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="w-3 h-3" />
              {formatDate(event.startDate)}
            </div>
            {event.endDate && (
              <div className="text-muted-foreground">
                au {format(new Date(event.endDate), 'HH:mm')}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Users className="w-3 h-3" />
              {event._count.registrations} participant{event._count.registrations > 1 ? 's' : ''}
            </div>
            <div className="text-xs text-muted-foreground">
              {event.organizer.name || event.organizer.email}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleToggleEventStatus(event.id, !event.isActive)}
              title={event.isActive ? 'Désactiver' : 'Activer'}
            >
              {event.isActive ? (
                <ToggleRight className="w-4 h-4" />
              ) : (
                <ToggleLeft className="w-4 h-4" />
              )}
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href={`/dashboard/events/${event.id}`}>
                <Eye className="w-4 h-4" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href={`/admin/events/${event.id}/program`} title="Gérer le programme">
                <FileText className="w-4 h-4" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href={`/admin/events/${event.id}/edit`}>
                <Edit className="w-4 h-4" />
              </a>
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => handleDeleteEvent(event.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <DeleteEventModal
        eventId={selectedEventId || ''}
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onSuccess={fetchEvents}
      />
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des événements</h1>
          <p className="text-muted-foreground">
            Administrer tous les événements de la plateforme
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Créer un événement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Créer un nouvel événement</DialogTitle>
              <DialogDescription>
                Ajouter un nouvel événement à la plateforme
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div>
                <Label htmlFor="title">Titre</Label>
                <Input
                  id="title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="Titre de l'événement"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder="Description de l'événement"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="startDate">Date de début</Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={newEvent.startDate}
                  onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="endDate">Date de fin</Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  value={newEvent.endDate}
                  onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="location">Lieu</Label>
                <Input
                  id="location"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  placeholder="Lieu de l'événement"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="isPublic">Public</Label>
                <Switch
                  id="isPublic"
                  checked={newEvent.isPublic}
                  onCheckedChange={(checked) => setNewEvent({ ...newEvent, isPublic: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="isActive">Actif</Label>
                <Switch
                  id="isActive"
                  checked={newEvent.isActive}
                  onCheckedChange={(checked) => setNewEvent({ ...newEvent, isActive: checked })}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleCreateEvent}>
                  Créer
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total événements</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Événements actifs</CardTitle>
            <ToggleRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {events.filter(e => e.isActive).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total participants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {events.reduce((sum, event) => sum + event._count.registrations, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Événements publics</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {events.filter(e => e.isPublic).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Rechercher par titre, description ou lieu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="active">Actifs</SelectItem>
                <SelectItem value="inactive">Inactifs</SelectItem>
                <SelectItem value="public">Publics</SelectItem>
                <SelectItem value="private">Privés</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Events Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des événements</CardTitle>
          <CardDescription>
            {events.length} événement{events.length > 1 ? 's' : ''} trouvé{events.length > 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Événement</TableHead>
                <TableHead>Organisateur</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Participants</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{event.title}</div>
                      {event.location && (
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {event.location}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {event.organizer.name || event.organizer.email}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {event.organizer.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {formatDate(event.startDate)}
                    </div>
                    {event.endDate && (
                      <div className="text-xs text-muted-foreground">
                        au {formatDate(event.endDate)}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Badge variant={event.isActive ? 'default' : 'secondary'}>
                        {event.isActive ? 'Actif' : 'Inactif'}
                      </Badge>
                      <Badge variant={event.isPublic ? 'default' : 'outline'}>
                        {event.isPublic ? 'Public' : 'Privé'}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {event._count.registrations}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" title="Générer QR Code">
                            <QrCode className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>QR Code d'inscription</DialogTitle>
                            <DialogDescription>
                              Scannez ce code pour accéder à la page d'inscription
                            </DialogDescription>
                          </DialogHeader>
                          <QRCodeGenerator
                            url={`${process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL}/register/${event.id}`}
                            eventName={event.title}
                          />
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleEventStatus(event.id, !event.isActive)}
                        title={event.isActive ? 'Désactiver' : 'Activer'}
                      >
                        {event.isActive ? (
                          <ToggleRight className="w-4 h-4" />
                        ) : (
                          <ToggleLeft className="w-4 h-4" />
                        )}
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <a href={`/dashboard/events/${event.id}`}>
                          <Eye className="w-4 h-4" />
                        </a>
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <a href={`/admin/events/${event.id}/program`} title="Gérer le programme">
                          <FileText className="w-4 h-4" />
                        </a>
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <a href={`/events/${event.id}`}>
                          <Edit className="w-4 h-4" />
                        </a>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteEvent(event.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Page {pagination.page} sur {pagination.totalPages} ({pagination.total} événements au total)
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                >
                  Précédent
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                >
                  Suivant
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}