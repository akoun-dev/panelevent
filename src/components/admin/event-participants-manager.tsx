"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Users, 
  Search, 
  Mail, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Download,
  Eye,
  UserPlus
} from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface Registration {
  id: string
  email: string
  consent: boolean
  createdAt: string
  user: {
    id: string
    name?: string
    email: string
  }
}

interface EventParticipantsManagerProps {
  eventId: string
  isAdmin?: boolean
}

export default function EventParticipantsManager({ eventId, isAdmin = false }: EventParticipantsManagerProps) {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null)

  useEffect(() => {
    fetchRegistrations()
  }, [eventId])

  const fetchRegistrations = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}/registrations`)
      if (response.ok) {
        const data = await response.json()
        setRegistrations(data.registrations || [])
      }
    } catch (error) {
      console.error('Failed to fetch registrations:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredRegistrations = registrations.filter(registration => {
    const searchTermLower = searchTerm.toLowerCase()
    return (
      registration.user.email.toLowerCase().includes(searchTermLower) ||
      registration.user.name?.toLowerCase().includes(searchTermLower)
    )
  })

  const exportParticipants = () => {
    const csvContent = [
      ['Nom', 'Email', 'Date d\'inscription', 'Consentement'],
      ...filteredRegistrations.map(reg => [
        reg.user.name || '',
        reg.user.email,
        format(new Date(reg.createdAt), 'dd/MM/yyyy HH:mm', { locale: fr }),
        reg.consent ? 'Oui' : 'Non'
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `participants-${eventId}-${format(new Date(), 'yyyy-MM-dd')}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMM yyyy à HH:mm', { locale: fr })
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Gestion des participants</h3>
          <p className="text-sm text-muted-foreground">
            {registrations.length} participant{registrations.length > 1 ? 's' : ''} inscrit{registrations.length > 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportParticipants}>
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total inscrits</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{registrations.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consentement donné</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {registrations.filter(r => r.consent).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
            <XCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {registrations.filter(r => !r.consent).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Rechercher par nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Participants List */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des participants</CardTitle>
          <CardDescription>
            {filteredRegistrations.length} participant{filteredRegistrations.length > 1 ? 's' : ''} trouvé{filteredRegistrations.length > 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredRegistrations.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-muted-foreground mb-4 mx-auto" />
              <h3 className="text-lg font-medium mb-2">Aucun participant</h3>
              <p className="text-sm text-muted-foreground">
                {searchTerm ? 'Aucun participant ne correspond à votre recherche.' : 'Aucun participant inscrit pour le moment.'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Participant</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Date d'inscription</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRegistrations.map((registration) => (
                  <TableRow key={registration.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {registration.user.name?.charAt(0).toUpperCase() || registration.user.email.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium">
                            {registration.user.name || 'Nom non renseigné'}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm">{registration.user.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {formatDate(registration.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={registration.consent ? 'default' : 'secondary'}>
                        {registration.consent ? (
                          <div className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Confirmé
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <XCircle className="w-3 h-3" />
                            En attente
                          </div>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedRegistration(registration)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Détails du participant</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                                <span className="text-xl font-bold text-primary">
                                  {registration.user.name?.charAt(0).toUpperCase() || registration.user.email.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <h4 className="font-semibold text-lg">
                                  {registration.user.name || 'Nom non renseigné'}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {registration.user.email}
                                </p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium">ID utilisateur:</span>
                                <p className="text-muted-foreground font-mono text-xs">
                                  {registration.user.id}
                                </p>
                              </div>
                              <div>
                                <span className="font-medium">ID inscription:</span>
                                <p className="text-muted-foreground font-mono text-xs">
                                  {registration.id}
                                </p>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="font-medium">Date d'inscription:</span>
                                <span className="text-sm text-muted-foreground">
                                  {formatDate(registration.createdAt)}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="font-medium">Consentement:</span>
                                <Badge variant={registration.consent ? 'default' : 'secondary'}>
                                  {registration.consent ? 'Oui' : 'Non'}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}