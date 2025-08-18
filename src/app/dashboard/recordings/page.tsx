"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Mic, Search, Calendar, Play, Pause, Download, Trash2 } from 'lucide-react'

interface Recording {
  id: string
  title: string
  event: {
    id: string
    title: string
    slug: string
  }
  duration: number
  fileSize: number
  recordedAt: string
  isProcessed: boolean
  audioUrl?: string
}

export default function RecordingsPage() {
  const { data: session } = useSession()
  const [recordings, setRecordings] = useState<Recording[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchRecordings()
  }, [])

  const fetchRecordings = async () => {
    try {
      const response = await fetch('/api/events/my-events/recordings')
      if (response.ok) {
        const data = await response.json()
        setRecordings(data.recordings || [])
      }
    } catch (error) {
      console.error('Failed to fetch recordings:', error)
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
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const filteredRecordings = recordings.filter(recording => 
    recording.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recording.event.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const deleteRecording = async (recordingId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement ?')) {
      return
    }

    try {
      const response = await fetch(`/api/recordings/${recordingId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setRecordings(recordings.filter(r => r.id !== recordingId))
      }
    } catch (error) {
      console.error('Failed to delete recording:', error)
    }
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
          <h1 className="text-3xl font-bold tracking-tight">Enregistrements</h1>
          <p className="text-muted-foreground">
            Gérez les enregistrements audio de vos événements
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Rechercher un enregistrement..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filteredRecordings.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Mic className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchTerm ? 'Aucun résultat trouvé' : 'Aucun enregistrement'}
            </h3>
            <p className="text-muted-foreground text-center">
              {searchTerm 
                ? 'Aucun enregistrement ne correspond à votre recherche.'
                : 'Vous n\'avez pas encore d\'enregistrements audio pour vos événements.'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredRecordings.map((recording) => (
            <Card key={recording.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{recording.title}</CardTitle>
                    <CardDescription>
                      {recording.event.title}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={recording.isProcessed ? 'default' : 'secondary'}>
                      {recording.isProcessed ? 'Traité' : 'En traitement'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Enregistré le {formatDate(recording.recordedAt)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Play className="w-4 h-4" />
                    <span>{formatDuration(recording.duration)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Download className="w-4 h-4" />
                    <span>{formatFileSize(recording.fileSize)}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {recording.isProcessed && recording.audioUrl && (
                    <audio controls className="h-8">
                      <source src={recording.audioUrl} type="audio/mpeg" />
                      Votre navigateur ne supporte pas l'audio.
                    </audio>
                  )}
                  
                  {recording.isProcessed && recording.audioUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={recording.audioUrl} download>
                        <Download className="w-4 h-4 mr-2" />
                        Télécharger
                      </a>
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => deleteRecording(recording.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}