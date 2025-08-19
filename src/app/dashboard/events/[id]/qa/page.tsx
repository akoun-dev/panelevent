'use client'

import { useState, useEffect } from 'react'
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
import { 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  CheckCircle, 
  XCircle, 
  Clock,
  Search,
  Filter,
  MoreVertical
} from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface Question {
  id: string
  content: string
  authorName: string
  authorEmail: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  upvotes: number
  downvotes: number
  createdAt: string
  panelId: string
  answer?: string
  answeredAt?: string
  answeredBy?: string
}

interface Panel {
  id: string
  title: string
  description: string
  startTime: string
  endTime: string
  eventId: string
}

export default function EventQAPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id ?? ''
  const [activePanel, setActivePanel] = useState<string>('')
  const [panels, setPanels] = useState<Panel[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)
  const [answerText, setAnswerText] = useState('')
  const [isLoading, setIsLoading] = useState(true)

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
          eventId: id,
        },
        {
          id: '2',
          title: 'Table ronde: Innovation technologique',
          description: 'Discussion sur les dernières tendances tech',
          startTime: '2024-01-15T10:30:00',
          endTime: '2024-01-15T12:00:00',
          eventId: id,
        },
        {
          id: '3',
          title: 'Atelier: Développement durable',
          description: 'Atelier pratique sur les solutions durables',
          startTime: '2024-01-15T14:00:00',
          endTime: '2024-01-15T15:30:00',
          eventId: id,
        }
      ]

      const mockQuestions: Question[] = [
        {
          id: '1',
          content: 'Quelles sont les principales innovations présentées cette année ?',
          authorName: 'Marie Dubois',
          authorEmail: 'marie@example.com',
          status: 'PENDING',
          upvotes: 15,
          downvotes: 2,
          createdAt: '2024-01-15T09:15:00',
          panelId: '1'
        },
        {
          id: '2',
          content: 'Comment puis-je participer au programme d\'incubation ?',
          authorName: 'Jean Martin',
          authorEmail: 'jean@example.com',
          status: 'APPROVED',
          upvotes: 23,
          downvotes: 1,
          createdAt: '2024-01-15T09:30:00',
          panelId: '1',
          answer: 'Vous pouvez postuler via notre site web à partir du mois prochain. Nous organiserons aussi des sessions d\'information.',
          answeredAt: '2024-01-15T09:45:00',
          answeredBy: 'Admin'
        },
        {
          id: '3',
          content: 'Est-ce que les présentations seront enregistrées ?',
          authorName: 'Sophie Bernard',
          authorEmail: 'sophie@example.com',
          status: 'APPROVED',
          upvotes: 31,
          downvotes: 0,
          createdAt: '2024-01-15T10:45:00',
          panelId: '2',
          answer: 'Oui, toutes les présentations seront enregistrées et disponibles sur notre plateforme dans 48h.',
          answeredAt: '2024-01-15T11:00:00',
          answeredBy: 'Organisateur'
        },
        {
          id: '4',
          content: 'Cette question n\'est pas pertinente',
          authorName: 'Test User',
          authorEmail: 'test@example.com',
          status: 'REJECTED',
          upvotes: 0,
          downvotes: 5,
          createdAt: '2024-01-15T11:15:00',
          panelId: '2'
        }
      ]

      setPanels(mockPanels)
      setQuestions(mockQuestions)
      if (mockPanels.length > 0) {
        setActivePanel(mockPanels[0].id)
      }
      setIsLoading(false)
    }

    loadData()
  }, [id])

  // Filtrer les questions
  useEffect(() => {
    let filtered = questions

    // Filtrer par panel actif
    if (activePanel) {
      filtered = filtered.filter(q => q.panelId === activePanel)
    }

    // Filtrer par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(q => q.status === statusFilter.toUpperCase())
    }

    // Filtrer par terme de recherche
    if (searchTerm) {
      filtered = filtered.filter(q => 
        q.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.authorName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredQuestions(filtered)
  }, [questions, activePanel, statusFilter, searchTerm])

  const handleApproveQuestion = async (questionId: string) => {
    setQuestions(prev => 
      prev.map(q => 
        q.id === questionId ? { ...q, status: 'APPROVED' as const } : q
      )
    )
  }

  const handleRejectQuestion = async (questionId: string) => {
    setQuestions(prev => 
      prev.map(q => 
        q.id === questionId ? { ...q, status: 'REJECTED' as const } : q
      )
    )
  }

  const handleAnswerQuestion = async () => {
    if (!selectedQuestion || !answerText.trim()) return

    setQuestions(prev => 
      prev.map(q => 
        q.id === selectedQuestion.id 
          ? { 
              ...q, 
              answer: answerText, 
              answeredAt: new Date().toISOString(),
              answeredBy: 'Organisateur'
            } 
          : q
      )
    )

    setAnswerText('')
    setSelectedQuestion(null)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />En attente</Badge>
      case 'APPROVED':
        return <Badge variant="default"><CheckCircle className="w-3 h-3 mr-1" />Approuvée</Badge>
      case 'REJECTED':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rejetée</Badge>
      default:
        return <Badge>{status}</Badge>
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
          <h1 className="text-3xl font-bold">Gestion des Questions-Réponses</h1>
          <p className="text-muted-foreground">Modérez et répondez aux questions des participants</p>
        </div>
      </div>

      {/* Sélection du panel */}
      <Card>
        <CardHeader>
          <CardTitle>Panel actif</CardTitle>
          <CardDescription>Sélectionnez le panel pour gérer ses questions</CardDescription>
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

      {/* Filtres */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Rechercher une question..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="approved">Approuvées</SelectItem>
                <SelectItem value="rejected">Rejetées</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Liste des questions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Questions ({filteredQuestions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              <div className="space-y-4">
                {filteredQuestions.map((question) => (
                  <Card 
                    key={question.id} 
                    className={`cursor-pointer transition-colors ${
                      selectedQuestion?.id === question.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedQuestion(question)}
                  >
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback>
                              {question.authorName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-sm">{question.authorName}</span>
                        </div>
                        {getStatusBadge(question.status)}
                      </div>
                      
                      <p className="text-sm mb-3">{question.content}</p>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          {format(new Date(question.createdAt), 'HH:mm', { locale: fr })}
                        </span>
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="w-3 h-3" /> {question.upvotes}
                          </span>
                          <span className="flex items-center gap-1">
                            <ThumbsDown className="w-3 h-3" /> {question.downvotes}
                          </span>
                        </div>
                      </div>

                      {question.answer && (
                        <div className="mt-3 p-3 bg-muted rounded-lg">
                          <p className="text-sm font-medium mb-1">Réponse:</p>
                          <p className="text-sm">{question.answer}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Par {question.answeredBy} - {question.answeredAt ? format(new Date(question.answeredAt), 'HH:mm', { locale: fr }) : ''}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Détails et actions */}
        <Card>
          <CardHeader>
            <CardTitle>Détails de la question</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedQuestion ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar>
                    <AvatarFallback>
                      {selectedQuestion.authorName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{selectedQuestion.authorName}</h3>
                    <p className="text-sm text-muted-foreground">{selectedQuestion.authorEmail}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-1">Question:</p>
                  <p className="text-sm">{selectedQuestion.content}</p>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <span>Posée à: {format(new Date(selectedQuestion.createdAt), 'HH:mm', { locale: fr })}</span>
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="w-4 h-4" /> {selectedQuestion.upvotes}
                  </span>
                  <span className="flex items-center gap-1">
                    <ThumbsDown className="w-4 h-4" /> {selectedQuestion.downvotes}
                  </span>
                </div>

                <Separator />

                {selectedQuestion.status === 'PENDING' && (
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleApproveQuestion(selectedQuestion.id)}
                      className="flex-1"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approuver
                    </Button>
                    <Button 
                      onClick={() => handleRejectQuestion(selectedQuestion.id)}
                      variant="destructive"
                      className="flex-1"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Rejeter
                    </Button>
                  </div>
                )}

                {selectedQuestion.status === 'APPROVED' && !selectedQuestion.answer && (
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Votre réponse:</label>
                    <Textarea
                      value={answerText}
                      onChange={(e) => setAnswerText(e.target.value)}
                      placeholder="Écrivez votre réponse ici..."
                      rows={4}
                    />
                    <Button 
                      onClick={handleAnswerQuestion}
                      disabled={!answerText.trim()}
                      className="w-full"
                    >
                      Envoyer la réponse
                    </Button>
                  </div>
                )}

                {selectedQuestion.answer && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Réponse envoyée:</p>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm">{selectedQuestion.answer}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Par {selectedQuestion.answeredBy} - {selectedQuestion.answeredAt ? format(new Date(selectedQuestion.answeredAt), 'HH:mm', { locale: fr }) : ''}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                <p>Sélectionnez une question pour voir les détails</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}