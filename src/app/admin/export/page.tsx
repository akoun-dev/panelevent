'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { 
  Download, 
  FileText, 
  Database, 
  BarChart3,
  Users,
  MessageSquare,
  Poll,
  Certificate,
  Feedback,
  Calendar as CalendarIcon,
  Filter,
  RefreshCw,
  CheckCircle,
  Clock
} from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface ExportConfig {
  type: 'events' | 'users' | 'registrations' | 'questions' | 'polls' | 'certificates' | 'feedback' | 'financial'
  format: 'csv' | 'excel' | 'pdf' | 'json'
  dateRange: {
    start: Date | undefined
    end: Date | undefined
  }
  filters: {
    eventId?: string
    status?: string
    category?: string
    rating?: string
  }
  fields: string[]
  includeCharts: boolean
  includeStats: boolean
}

interface ExportJob {
  id: string
  type: string
  format: string
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
  progress: number
  createdAt: string
  completedAt?: string
  downloadUrl?: string
  fileSize?: number
  error?: string
}

interface Event {
  id: string
  title: string
  startDate: string
  endDate?: string
  isActive: boolean
}

export default function AdminExportPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [exportJobs, setExportJobs] = useState<ExportJob[]>([])
  const [config, setConfig] = useState<ExportConfig>({
    type: 'events',
    format: 'csv',
    dateRange: {
      start: undefined,
      end: undefined
    },
    filters: {},
    fields: [],
    includeCharts: false,
    includeStats: true
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Simuler le chargement des données
  useEffect(() => {
    const loadData = async () => {
      // Données de démonstration pour les événements
      const mockEvents: Event[] = [
        {
          id: '1',
          title: 'Conférence Technologique 2024',
          startDate: '2024-01-15T09:00:00',
          endDate: '2024-01-15T18:00:00',
          isActive: false
        },
        {
          id: '2',
          title: 'Sommet sur l\'IA',
          startDate: '2024-02-20T09:00:00',
          endDate: '2024-02-20T17:00:00',
          isActive: true
        },
        {
          id: '3',
          title: 'Festival de l\'Innovation',
          startDate: '2024-03-10T10:00:00',
          endDate: '2024-03-12T18:00:00',
          isActive: false
        }
      ]

      // Données de démonstration pour les jobs d'export
      const mockExportJobs: ExportJob[] = [
        {
          id: '1',
          type: 'events',
          format: 'excel',
          status: 'COMPLETED',
          progress: 100,
          createdAt: '2024-01-20T10:30:00',
          completedAt: '2024-01-20T10:32:00',
          downloadUrl: '/exports/events_report_2024-01-20.xlsx',
          fileSize: 2048000
        },
        {
          id: '2',
          type: 'feedback',
          format: 'csv',
          status: 'PROCESSING',
          progress: 75,
          createdAt: '2024-01-20T11:00:00'
        }
      ]

      setEvents(mockEvents)
      setExportJobs(mockExportJobs)
      setIsLoading(false)
    }

    loadData()
  }, [])

  // Définir les champs disponibles pour chaque type d'export
  const getAvailableFields = (type: string) => {
    switch (type) {
      case 'events':
        return [
          { id: 'id', label: 'ID', default: true },
          { id: 'title', label: 'Titre', default: true },
          { id: 'description', label: 'Description', default: false },
          { id: 'startDate', label: 'Date de début', default: true },
          { id: 'endDate', label: 'Date de fin', default: true },
          { id: 'location', label: 'Lieu', default: true },
          { id: 'isActive', label: 'Actif', default: true },
          { id: 'organizerName', label: 'Organisateur', default: true },
          { id: 'registrationsCount', label: 'Nombre d\'inscriptions', default: true },
          { id: 'createdAt', label: 'Date de création', default: false }
        ]
      case 'users':
        return [
          { id: 'id', label: 'ID', default: true },
          { id: 'name', label: 'Nom', default: true },
          { id: 'email', label: 'Email', default: true },
          { id: 'role', label: 'Rôle', default: true },
          { id: 'createdAt', label: 'Date de création', default: true },
          { id: 'lastLogin', label: 'Dernière connexion', default: false },
          { id: 'eventsCount', label: 'Nombre d\'événements', default: false }
        ]
      case 'registrations':
        return [
          { id: 'id', label: 'ID', default: true },
          { id: 'userName', label: 'Nom utilisateur', default: true },
          { id: 'userEmail', label: 'Email utilisateur', default: true },
          { id: 'eventTitle', label: 'Titre événement', default: true },
          { id: 'registeredAt', label: 'Date d\'inscription', default: true },
          { id: 'attended', label: 'Présent', default: true },
          { id: 'certificateIssued', label: 'Certificat émis', default: false }
        ]
      case 'questions':
        return [
          { id: 'id', label: 'ID', default: true },
          { id: 'content', label: 'Question', default: true },
          { id: 'authorName', label: 'Auteur', default: true },
          { id: 'status', label: 'Statut', default: true },
          { id: 'upvotes', label: 'Votes positifs', default: true },
          { id: 'downvotes', label: 'Votes négatifs', default: true },
          { id: 'answer', label: 'Réponse', default: false },
          { id: 'createdAt', label: 'Date de création', default: true }
        ]
      case 'polls':
        return [
          { id: 'id', label: 'ID', default: true },
          { id: 'question', label: 'Question', default: true },
          { id: 'isActive', label: 'Actif', default: true },
          { id: 'totalVotes', label: 'Votes totaux', default: true },
          { id: 'options', label: 'Options', default: true },
          { id: 'createdAt', label: 'Date de création', default: true }
        ]
      case 'certificates':
        return [
          { id: 'id', label: 'ID', default: true },
          { id: 'userName', label: 'Nom utilisateur', default: true },
          { id: 'userEmail', label: 'Email utilisateur', default: true },
          { id: 'templateTitle', label: 'Modèle', default: true },
          { id: 'issuedAt', label: 'Date d\'émission', default: true },
          { id: 'downloadUrl', label: 'URL de téléchargement', default: false }
        ]
      case 'feedback':
        return [
          { id: 'id', label: 'ID', default: true },
          { id: 'userName', label: 'Nom utilisateur', default: true },
          { id: 'rating', label: 'Note', default: true },
          { id: 'category', label: 'Catégorie', default: true },
          { id: 'comment', label: 'Commentaire', default: true },
          { id: 'helpful', label: 'Votes utiles', default: false },
          { id: 'createdAt', label: 'Date de création', default: true }
        ]
      case 'financial':
        return [
          { id: 'eventId', label: 'ID événement', default: true },
          { id: 'eventTitle', label: 'Titre événement', default: true },
          { id: 'revenue', label: 'Revenus', default: true },
          { id: 'costs', label: 'Coûts', default: true },
          { id: 'profit', label: 'Bénéfice', default: true },
          { id: 'registrationsCount', label: 'Inscriptions', default: true },
          { id: 'averageTicketPrice', label: 'Prix moyen', default: false }
        ]
      default:
        return []
    }
  }

  // Mettre à jour les champs quand le type change
  useEffect(() => {
    const availableFields = getAvailableFields(config.type)
    const defaultFields = availableFields.filter(field => field.default).map(field => field.id)
    setConfig(prev => ({
      ...prev,
      fields: defaultFields
    }))
  }, [config.type])

  const handleFieldToggle = (fieldId: string, checked: boolean) => {
    setConfig(prev => ({
      ...prev,
      fields: checked 
        ? [...prev.fields, fieldId]
        : prev.fields.filter(f => f !== fieldId)
    }))
  }

  const handleGenerateExport = async () => {
    if (config.fields.length === 0) {
      alert('Veuillez sélectionner au moins un champ à exporter')
      return
    }

    setIsGenerating(true)
    
    // Créer un job d'export
    const job: ExportJob = {
      id: Date.now().toString(),
      type: config.type,
      format: config.format,
      status: 'PROCESSING',
      progress: 0,
      createdAt: new Date().toISOString()
    }

    setExportJobs(prev => [job, ...prev])

    // Simuler la génération du rapport
    const interval = setInterval(() => {
      setExportJobs(prev => 
        prev.map(j => {
          if (j.id === job.id) {
            const newProgress = Math.min(j.progress + Math.random() * 30, 100)
            const newStatus = newProgress >= 100 ? 'COMPLETED' : 'PROCESSING'
            
            if (newStatus === 'COMPLETED') {
              clearInterval(interval)
              const fileSize = Math.round(Math.random() * 10000000) + 1000000 // 1-10 MB
              return {
                ...j,
                progress: 100,
                status: 'COMPLETED',
                completedAt: new Date().toISOString(),
                downloadUrl: `/exports/${config.type}_report_${Date.now()}.${config.format}`,
                fileSize
              }
            }
            
            return { ...j, progress: newProgress, status: newStatus }
          }
          return j
        })
      )
    }, 1500)

    setIsGenerating(false)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'events': return <CalendarIcon className="w-4 h-4" />
      case 'users': return <Users className="w-4 h-4" />
      case 'registrations': return <Users className="w-4 h-4" />
      case 'questions': return <MessageSquare className="w-4 h-4" />
      case 'polls': return <Poll className="w-4 h-4" />
      case 'certificates': return <Certificate className="w-4 h-4" />
      case 'feedback': return <Feedback className="w-4 h-4" />
      case 'financial': return <BarChart3 className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'events': return 'Événements'
      case 'users': return 'Utilisateurs'
      case 'registrations': return 'Inscriptions'
      case 'questions': return 'Questions'
      case 'polls': return 'Sondages'
      case 'certificates': return 'Certificats'
      case 'feedback': return 'Feedbacks'
      case 'financial': return 'Rapports financiers'
      default: return type
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />En attente</Badge>
      case 'PROCESSING':
        return <Badge variant="default"><RefreshCw className="w-3 h-3 mr-1 animate-spin" />En cours</Badge>
      case 'COMPLETED':
        return <Badge variant="default"><CheckCircle className="w-3 h-3 mr-1" />Terminé</Badge>
      case 'FAILED':
        return <Badge variant="destructive">Échec</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 Bytes'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Export de Données</h1>
          <p className="text-muted-foreground">Générez des rapports et exportez les données du système</p>
        </div>
      </div>

      <Tabs defaultValue="generate" className="space-y-4">
        <TabsList>
          <TabsTrigger value="generate">Générer un export</TabsTrigger>
          <TabsTrigger value="history">Historique des exports</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Configuration de l'export */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Configuration de l'export</CardTitle>
                <CardDescription>Définissez les paramètres pour générer votre rapport</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Type et format */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Type de données</Label>
                    <Select value={config.type} onValueChange={(value: any) => setConfig(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="events">Événements</SelectItem>
                        <SelectItem value="users">Utilisateurs</SelectItem>
                        <SelectItem value="registrations">Inscriptions</SelectItem>
                        <SelectItem value="questions">Questions</SelectItem>
                        <SelectItem value="polls">Sondages</SelectItem>
                        <SelectItem value="certificates">Certificats</SelectItem>
                        <SelectItem value="feedback">Feedbacks</SelectItem>
                        <SelectItem value="financial">Rapports financiers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Format d'export</Label>
                    <Select value={config.format} onValueChange={(value: any) => setConfig(prev => ({ ...prev, format: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="excel">Excel</SelectItem>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="json">JSON</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Filtres */}
                <div className="space-y-4">
                  <Label>Filtres</Label>
                  
                  {config.type === 'registrations' || config.type === 'questions' || config.type === 'polls' || config.type === 'feedback' ? (
                    <div>
                      <Label className="text-sm font-medium">Événement (optionnel)</Label>
                      <Select 
                        value={config.filters.eventId || ''} 
                        onValueChange={(value) => setConfig(prev => ({ 
                          ...prev, 
                          filters: { ...prev.filters, eventId: value || undefined }
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Tous les événements" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Tous les événements</SelectItem>
                          {events.map((event) => (
                            <SelectItem key={event.id} value={event.id}>
                              {event.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ) : null}

                  {config.type === 'feedback' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Note</Label>
                        <Select 
                          value={config.filters.rating || ''} 
                          onValueChange={(value) => setConfig(prev => ({ 
                            ...prev, 
                            filters: { ...prev.filters, rating: value || undefined }
                          }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Toutes les notes" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Toutes les notes</SelectItem>
                            <SelectItem value="5">5 étoiles</SelectItem>
                            <SelectItem value="4">4 étoiles</SelectItem>
                            <SelectItem value="3">3 étoiles</SelectItem>
                            <SelectItem value="2">2 étoiles</SelectItem>
                            <SelectItem value="1">1 étoile</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium">Catégorie</Label>
                        <Select 
                          value={config.filters.category || ''} 
                          onValueChange={(value) => setConfig(prev => ({ 
                            ...prev, 
                            filters: { ...prev.filters, category: value || undefined }
                          }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Toutes catégories" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Toutes catégories</SelectItem>
                            <SelectItem value="Général">Général</SelectItem>
                            <SelectItem value="Contenu">Contenu</SelectItem>
                            <SelectItem value="Logistique">Logistique</SelectItem>
                            <SelectItem value="Format">Format</SelectItem>
                            <SelectItem value="Technique">Technique</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>

                {/* Période */}
                <div>
                  <Label>Période (optionnel)</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Date de début</Label>
                      <div className="relative">
                        <Calendar
                          mode="single"
                          selected={config.dateRange.start}
                          onSelect={(date) => setConfig(prev => ({ 
                            ...prev, 
                            dateRange: { ...prev.dateRange, start: date }
                          }))}
                          className="rounded-md border"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Date de fin</Label>
                      <div className="relative">
                        <Calendar
                          mode="single"
                          selected={config.dateRange.end}
                          onSelect={(date) => setConfig(prev => ({ 
                            ...prev, 
                            dateRange: { ...prev.dateRange, end: date }
                          }))}
                          className="rounded-md border"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-3">
                  <Label>Options</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeStats"
                      checked={config.includeStats}
                      onCheckedChange={(checked) => setConfig(prev => ({ ...prev, includeStats: !!checked }))}
                    />
                    <Label htmlFor="includeStats">Inclure les statistiques</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeCharts"
                      checked={config.includeCharts}
                      onCheckedChange={(checked) => setConfig(prev => ({ ...prev, includeCharts: !!checked }))}
                    />
                    <Label htmlFor="includeCharts">Inclure les graphiques (PDF uniquement)</Label>
                  </div>
                </div>

                {/* Champs à exporter */}
                <div>
                  <Label>Champs à exporter</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                    {getAvailableFields(config.type).map((field) => (
                      <div key={field.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={field.id}
                          checked={config.fields.includes(field.id)}
                          onCheckedChange={(checked) => handleFieldToggle(field.id, !!checked)}
                        />
                        <Label htmlFor={field.id} className="text-sm">{field.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={handleGenerateExport}
                  disabled={isGenerating || config.fields.length === 0}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Génération en cours...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Générer l'export
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Aperçu et résumé */}
            <Card>
              <CardHeader>
                <CardTitle>Résumé de l'export</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  {getTypeIcon(config.type)}
                  <span className="font-medium">{getTypeLabel(config.type)}</span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Format:</span>
                    <span className="font-medium">{config.format.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Champs sélectionnés:</span>
                    <span className="font-medium">{config.fields.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Statistiques:</span>
                    <span className="font-medium">{config.includeStats ? 'Oui' : 'Non'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Graphiques:</span>
                    <span className="font-medium">{config.includeCharts ? 'Oui' : 'Non'}</span>
                  </div>
                </div>

                {(config.dateRange.start || config.dateRange.end) && (
                  <div className="pt-2 border-t">
                    <p className="text-sm font-medium mb-1">Période:</p>
                    <p className="text-xs text-muted-foreground">
                      {config.dateRange.start && format(config.dateRange.start, 'dd/MM/yyyy')}
                      {config.dateRange.start && config.dateRange.end && ' - '}
                      {config.dateRange.end && format(config.dateRange.end, 'dd/MM/yyyy')}
                    </p>
                  </div>
                )}

                {Object.keys(config.filters).some(key => config.filters[key as keyof typeof config.filters]) && (
                  <div className="pt-2 border-t">
                    <p className="text-sm font-medium mb-1">Filtres actifs:</p>
                    <div className="space-y-1">
                      {config.filters.eventId && (
                        <p className="text-xs text-muted-foreground">
                          Événement: {events.find(e => e.id === config.filters.eventId)?.title}
                        </p>
                      )}
                      {config.filters.rating && (
                        <p className="text-xs text-muted-foreground">
                          Note: {config.filters.rating} étoiles
                        </p>
                      )}
                      {config.filters.category && (
                        <p className="text-xs text-muted-foreground">
                          Catégorie: {config.filters.category}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historique des exports</CardTitle>
              <CardDescription>Suivez l'état de vos exports et téléchargez les rapports générés</CardDescription>
            </CardHeader>
            <CardContent>
              {exportJobs.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Aucun historique d'export
                </p>
              ) : (
                <div className="space-y-4">
                  {exportJobs.map((job) => (
                    <Card key={job.id}>
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            {getTypeIcon(job.type)}
                            <div>
                              <h4 className="font-medium">{getTypeLabel(job.type)}</h4>
                              <p className="text-sm text-muted-foreground">
                                {job.format.toUpperCase()} • {format(new Date(job.createdAt), 'dd/MM/yyyy HH:mm', { locale: fr })}
                              </p>
                            </div>
                          </div>
                          {getStatusBadge(job.status)}
                        </div>

                        {job.status === 'PROCESSING' && (
                          <div className="space-y-2">
                            <div className="w-full bg-secondary rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full transition-all duration-300"
                                style={{ width: `${job.progress}%` }}
                              />
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>{Math.round(job.progress)}% complété</span>
                            </div>
                          </div>
                        )}

                        {job.status === 'COMPLETED' && job.downloadUrl && (
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">
                              {job.fileSize && <span>{formatFileSize(job.fileSize)} • </span>}
                              Terminé le {job.completedAt && format(new Date(job.completedAt), 'dd/MM/yyyy HH:mm', { locale: fr })}
                            </div>
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4 mr-2" />
                              Télécharger
                            </Button>
                          </div>
                        )}

                        {job.status === 'FAILED' && job.error && (
                          <div className="text-sm text-red-600">
                            Erreur: {job.error}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}