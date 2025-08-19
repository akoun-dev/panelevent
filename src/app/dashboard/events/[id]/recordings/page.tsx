'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Mic,
  Square,
  Play,
  Pause,
  Download,
  FileText,
  Clock,
  Volume2,
  Trash2,
  Headphones,
  AudioLines,
  Save,
  Share2
} from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface AudioRecording {
  id: string
  title: string
  description?: string
  fileName: string
  duration: number
  fileSize: number
  createdAt: string
  panelId: string
  isProcessing: boolean
  transcription?: string
  transcriptionStatus: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
  speakerId?: string
}

interface Panel {
  id: string
  title: string
  description: string
  startTime: string
  endTime: string
  eventId: string
}

interface TranscriptionJob {
  id: string
  recordingId: string
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
  progress: number
  estimatedTimeRemaining?: number
  error?: string
}

export default function EventRecordingsPage() {
  const params = useParams()
  const id = params.id as string
  const [activePanel, setActivePanel] = useState<string>('')
  const [panels, setPanels] = useState<Panel[]>([])
  const [recordings, setRecordings] = useState<AudioRecording[]>([])
  const [filteredRecordings, setFilteredRecordings] = useState<AudioRecording[]>([])
  const [selectedRecording, setSelectedRecording] = useState<AudioRecording | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [newRecording, setNewRecording] = useState({
    title: '',
    description: '',
    autoTranscribe: true
  })
  const [transcriptionJobs, setTranscriptionJobs] = useState<TranscriptionJob[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackProgress, setPlaybackProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  
  const recordingInterval = useRef<NodeJS.Timeout | null>(null)
  const playbackInterval = useRef<NodeJS.Timeout | null>(null)

  // Simuler le chargement des données
  useEffect(() => {
    const loadData = async () => {
      // Données de démonstration
      const mockPanels: Panel[] = [
        {
          id: '1',
          title: 'Ouverture et présentation',
          description: 'Session d\'ouverture de la conférence',
          startTime: '2024-01-15T09:00:00',
          endTime: '2024-01-15T10:00:00',
          eventId: id
        },
        {
          id: '2',
          title: 'Table ronde: Innovation technologique',
          description: 'Discussion sur les dernières tendances tech',
          startTime: '2024-01-15T10:30:00',
          endTime: '2024-01-15T12:00:00',
          eventId: id
        },
        {
          id: '3',
          title: 'Atelier: Développement durable',
          description: 'Atelier pratique sur les solutions durables',
          startTime: '2024-01-15T14:00:00',
          endTime: '2024-01-15T15:30:00',
          eventId: id
        }
      ]

      const mockRecordings: AudioRecording[] = [
        {
          id: '1',
          title: 'Session d\'ouverture - Présentation',
          description: 'Enregistrement complet de la session d\'ouverture',
          fileName: 'opening_session.mp3',
          duration: 3540, // 59 minutes
          fileSize: 42500000, // ~42.5 MB
          createdAt: '2024-01-15T10:05:00',
          panelId: '1',
          isProcessing: false,
          transcriptionStatus: 'COMPLETED',
          transcription: 'Bonjour à tous et bienvenue à la Conférence Technologique 2024. Je suis ravi de vous accueillir pour cette journée dédiée à l\'innovation et aux nouvelles technologies. Nous avons aujourd\'hui un programme exceptionnel avec des intervenants de renommée mondiale...',
          speakerId: 'speaker_1'
        },
        {
          id: '2',
          title: 'Table ronde - Innovation IA',
          description: 'Discussion sur les avancées en intelligence artificielle',
          fileName: 'ai_roundtable.mp3',
          duration: 5400, // 90 minutes
          fileSize: 65000000, // ~65 MB
          createdAt: '2024-01-15T12:15:00',
          panelId: '2',
          isProcessing: false,
          transcriptionStatus: 'PROCESSING'
        },
        {
          id: '3',
          title: 'Atelier - Solutions durables',
          description: 'Enregistrement de l\'atelier sur le développement durable',
          fileName: 'sustainability_workshop.mp3',
          duration: 5400, // 90 minutes
          fileSize: 62000000, // ~62 MB
          createdAt: '2024-01-15T15:35:00',
          panelId: '3',
          isProcessing: false,
          transcriptionStatus: 'PENDING'
        }
      ]

      const mockTranscriptionJobs: TranscriptionJob[] = [
        {
          id: '1',
          recordingId: '2',
          status: 'PROCESSING',
          progress: 65,
          estimatedTimeRemaining: 300 // 5 minutes
        },
        {
          id: '2',
          recordingId: '3',
          status: 'PENDING',
          progress: 0
        }
      ]

      setPanels(mockPanels)
      setRecordings(mockRecordings)
      setTranscriptionJobs(mockTranscriptionJobs)
      if (mockPanels.length > 0) {
        setActivePanel(mockPanels[0].id)
      }
      setIsLoading(false)
    }

    loadData()
  }, [id])

  // Filtrer les enregistrements
  useEffect(() => {
    let filtered = recordings

    // Filtrer par panel actif
    if (activePanel) {
      filtered = filtered.filter(r => r.panelId === activePanel)
    }

    setFilteredRecordings(filtered)
  }, [recordings, activePanel])

  // Gérer l'enregistrement
  const startRecording = () => {
    setIsRecording(true)
    setRecordingTime(0)
    
    recordingInterval.current = setInterval(() => {
      setRecordingTime(prev => prev + 1)
    }, 1000)
  }

  const stopRecording = () => {
    setIsRecording(false)
    
    if (recordingInterval.current) {
      clearInterval(recordingInterval.current)
      recordingInterval.current = null
    }

    // Simuler la création d'un enregistrement
    const newRecordingObj: AudioRecording = {
      id: Date.now().toString(),
      title: newRecording.title || `Enregistrement du ${format(new Date(), 'dd/MM/yyyy HH:mm')}`,
      description: newRecording.description,
      fileName: `recording_${Date.now()}.mp3`,
      duration: recordingTime,
      fileSize: Math.round(recordingTime * 128000), // Simulation ~128kbps
      createdAt: new Date().toISOString(),
      panelId: activePanel,
      isProcessing: false,
      transcriptionStatus: 'PENDING'
    }

    setRecordings(prev => [newRecordingObj, ...prev])
    setNewRecording({
      title: '',
      description: '',
      autoTranscribe: true
    })
    setRecordingTime(0)

    // Démarrer la transcription si activée
    if (newRecording.autoTranscribe) {
      startTranscription(newRecordingObj.id)
    }
  }

  const startTranscription = async (recordingId: string) => {
    // Créer un job de transcription
    const job: TranscriptionJob = {
      id: Date.now().toString(),
      recordingId,
      status: 'PROCESSING',
      progress: 0
    }

    setTranscriptionJobs(prev => [...prev, job])

    // Simuler la progression de la transcription
    const interval = setInterval(() => {
      setTranscriptionJobs(prev => 
        prev.map(j => {
          if (j.id === job.id) {
            const newProgress = Math.min(j.progress + Math.random() * 20, 100)
            const newStatus = newProgress >= 100 ? 'COMPLETED' : 'PROCESSING'
            
            if (newStatus === 'COMPLETED') {
              clearInterval(interval)
              // Mettre à jour le statut de l'enregistrement
              setRecordings(prev => 
                prev.map(r => 
                  r.id === recordingId 
                    ? { 
                        ...r, 
                        transcriptionStatus: 'COMPLETED',
                        transcription: 'Transcription générée automatiquement. Ceci est une simulation de transcription texte pour l\'enregistrement audio...',
                        isProcessing: false
                      } 
                    : r
                )
              )
            }
            
            return {
              ...j,
              progress: newProgress,
              status: newStatus,
              estimatedTimeRemaining: newStatus === 'PROCESSING' ? Math.round((100 - newProgress) * 2) : undefined
            }
          }
          return j
        })
      )
    }, 2000)
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 Bytes'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const getTranscriptionStatus = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="secondary">En attente</Badge>
      case 'PROCESSING':
        return <Badge variant="default">En cours</Badge>
      case 'COMPLETED':
        return <Badge variant="default">Terminé</Badge>
      case 'FAILED':
        return <Badge variant="destructive">Échec</Badge>
      default:
        return <Badge>{status}</Badge>
      }
  }

  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false)
      if (playbackInterval.current) {
        clearInterval(playbackInterval.current)
        playbackInterval.current = null
      }
    } else {
      setIsPlaying(true)
      playbackInterval.current = setInterval(() => {
        setPlaybackProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false)
            if (playbackInterval.current) {
              clearInterval(playbackInterval.current)
              playbackInterval.current = null
            }
            return 0
          }
          return prev + 1
        })
      }, 1000)
    }
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
          <h1 className="text-3xl font-bold">Enregistrements Audio</h1>
          <p className="text-muted-foreground">Enregistrez, transcrivez et gérez les sessions audio</p>
        </div>
      </div>

      {/* Sélection du panel */}
      <Card>
        <CardHeader>
          <CardTitle>Panel actif</CardTitle>
          <CardDescription>Sélectionnez le panel pour gérer ses enregistrements</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={activePanel} onValueChange={setActivePanel}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez un panel" />
            </SelectTrigger>
            <SelectContent>
              {panels.map((panel) => (
                <SelectItem key={panel.id} value={panel.id}>
                  {panel.title} - {format(new Date(panel.startTime), 'HH:mm', { locale: fr })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Enregistreur audio */}
      <Card>
        <CardHeader>
          <CardTitle>Enregistreur audio</CardTitle>
          <CardDescription>
            Enregistrez les sessions pour archivage et transcription
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Titre de l'enregistrement</Label>
              <Input
                id="title"
                value={newRecording.title}
                onChange={(e) => setNewRecording(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Titre de l'enregistrement..."
                disabled={isRecording}
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description (optionnelle)</Label>
              <Input
                id="description"
                value={newRecording.description}
                onChange={(e) => setNewRecording(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Description..."
                disabled={isRecording}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="autoTranscribe"
              checked={newRecording.autoTranscribe}
              onCheckedChange={(checked) => setNewRecording(prev => ({ ...prev, autoTranscribe: checked }))}
              disabled={isRecording}
            />
            <Label htmlFor="autoTranscribe">Transcrire automatiquement après l'enregistrement</Label>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {!isRecording ? (
                <Button onClick={startRecording} size="lg">
                  <Mic className="w-4 h-4 mr-2" />
                  Commencer l'enregistrement
                </Button>
              ) : (
                <Button onClick={stopRecording} variant="destructive" size="lg">
                  <Square className="w-4 h-4 mr-2" />
                  Arrêter l'enregistrement
                </Button>
              )}
              
              {isRecording && (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="font-mono">{formatDuration(recordingTime)}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="recordings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recordings">Enregistrements</TabsTrigger>
          <TabsTrigger value="transcriptions">Transcriptions</TabsTrigger>
        </TabsList>

        <TabsContent value="recordings" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Liste des enregistrements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="w-5 h-5" />
                  Enregistrements ({filteredRecordings.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  <div className="space-y-4">
                    {filteredRecordings.map((recording) => (
                      <Card 
                        key={recording.id} 
                        className={`cursor-pointer transition-colors ${
                          selectedRecording?.id === recording.id ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => setSelectedRecording(recording)}
                      >
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {getTranscriptionStatus(recording.transcriptionStatus)}
                              {recording.isProcessing && (
                                <Badge variant="secondary">
                                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary mr-1" />
                                  Traitement
                                </Badge>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {format(new Date(recording.createdAt), 'dd/MM/yyyy HH:mm', { locale: fr })}
                            </div>
                          </div>
                          
                          <h3 className="font-medium mb-1">{recording.title}</h3>
                          {recording.description && (
                            <p className="text-sm text-muted-foreground mb-3">{recording.description}</p>
                          )}
                          
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDuration(recording.duration)}
                            </span>
                            <span>{formatFileSize(recording.fileSize)}</span>
                          </div>

                          {recording.transcription && (
                            <div className="mt-2 p-2 bg-muted rounded text-xs">
                              <FileText className="w-3 h-3 inline mr-1" />
                              Transcription disponible
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Détails et lecteur audio */}
            <Card>
              <CardHeader>
                <CardTitle>Détails de l'enregistrement</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedRecording ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-lg">{selectedRecording.title}</h3>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share2 className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {selectedRecording.description && (
                      <p className="text-sm text-muted-foreground">{selectedRecording.description}</p>
                    )}

                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatDuration(selectedRecording.duration)}
                      </span>
                      <span>{formatFileSize(selectedRecording.fileSize)}</span>
                      <span>
                        Créé le {format(new Date(selectedRecording.createdAt), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      {getTranscriptionStatus(selectedRecording.transcriptionStatus)}
                      {selectedRecording.transcriptionStatus === 'PENDING' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => startTranscription(selectedRecording.id)}
                        >
                          <AudioLines className="w-4 h-4 mr-2" />
                          Transcrire
                        </Button>
                      )}
                    </div>

                    <Separator />

                    {/* Lecteur audio simulé */}
                    <div>
                      <h4 className="font-medium mb-3">Lecteur audio</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={handlePlayPause}
                          >
                            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          </Button>
                          <div className="flex-1">
                            <div className="w-full bg-secondary rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full transition-all duration-300"
                                style={{ width: `${playbackProgress}%` }}
                              />
                            </div>
                          </div>
                          <Volume2 className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{formatDuration(Math.floor(selectedRecording.duration * playbackProgress / 100))}</span>
                          <span>{formatDuration(selectedRecording.duration)}</span>
                        </div>
                      </div>
                    </div>

                    {selectedRecording.transcription && (
                      <>
                        <Separator />
                        <div>
                          <h4 className="font-medium mb-2">Transcription</h4>
                          <div className="bg-muted p-3 rounded-lg max-h-40 overflow-y-auto">
                            <p className="text-sm whitespace-pre-wrap">{selectedRecording.transcription}</p>
                          </div>
                          <div className="flex gap-2 mt-2">
                            <Button variant="outline" size="sm">
                              <FileText className="w-4 h-4 mr-2" />
                              Exporter
                            </Button>
                            <Button variant="outline" size="sm">
                              <Save className="w-4 h-4 mr-2" />
                              Enregistrer
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64 text-muted-foreground">
                    <p>Sélectionnez un enregistrement pour voir les détails</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transcriptions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Jobs de transcription en cours</CardTitle>
            </CardHeader>
            <CardContent>
              {transcriptionJobs.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Aucune transcription en cours
                </p>
              ) : (
                <div className="space-y-4">
                  {transcriptionJobs.map((job) => {
                    const recording = recordings.find(r => r.id === job.recordingId)
                    return (
                      <Card key={job.id}>
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{recording?.title || 'Enregistrement inconnu'}</h4>
                            {getTranscriptionStatus(job.status)}
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
                                {job.estimatedTimeRemaining && (
                                  <span>~{Math.round(job.estimatedTimeRemaining / 60)} min restantes</span>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {job.status === 'FAILED' && job.error && (
                            <div className="text-sm text-red-600">
                              Erreur: {job.error}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}