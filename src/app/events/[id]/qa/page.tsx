'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Send,
  CheckCircle,
  Search
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
  userVote?: 'up' | 'down' | null
}

interface Panel {
  id: string
  title: string
  description: string
  startTime: string
  endTime: string
  eventId: string
  isActive: boolean
  allowQuestions: boolean
}

export default function EventQAPage() {
  const params = useParams()
  const id = params.id as string
  const [activePanel, setActivePanel] = useState<string | null>(null)
  const [panels, setPanels] = useState<Panel[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([])
  const [newQuestion, setNewQuestion] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent')
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
          isActive: false,
          allowQuestions: false
        },
        {
          id: '2',
          title: 'Table ronde: Innovation technologique',
          description: 'Discussion sur les dernières tendances tech',
          startTime: '2024-01-15T10:30:00',
          endTime: '2024-01-15T12:00:00',
          eventId: id,
          isActive: true,
          allowQuestions: true
        },
        {
          id: '3',
          title: 'Atelier: Développement durable',
          description: 'Atelier pratique sur les solutions durables',
          startTime: '2024-01-15T14:00:00',
          endTime: '2024-01-15T15:30:00',
          eventId: id,
          isActive: false,
          allowQuestions: true
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
          panelId: '1',
          userVote: null
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
          answeredBy: 'Admin',
          userVote: 'up'
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
          answeredBy: 'Organisateur',
          userVote: 'up'
        },
        {
          id: '4',
          content: 'Quels sont les critères de sélection pour les startups ?',
          authorName: 'Pierre Lefebvre',
          authorEmail: 'pierre@example.com',
          status: 'APPROVED',
          upvotes: 18,
          downvotes: 1,
          createdAt: '2024-01-15T11:15:00',
          panelId: '2',
          answer: 'Nous recherchons des startups avec un MVP valide, une équipe solide et un marché potentiel d\'au moins 10M€.',
          answeredAt: '2024-01-15T11:30:00',
          answeredBy: 'Organisateur',
          userVote: null
        },
        {
          id: '5',
          content: 'Y aura-t-il des opportunités de networking ?',
          authorName: 'Claire Moreau',
          authorEmail: 'claire@example.com',
          status: 'PENDING',
          upvotes: 12,
          downvotes: 0,
          createdAt: '2024-01-15T11:45:00',
          panelId: '2',
          userVote: null
        }
      ]

      const questionPanels = mockPanels.filter(p => p.allowQuestions)
      setPanels(questionPanels)
      setQuestions(mockQuestions)

      const active = questionPanels.find(p => p.isActive)
      if (active) {
        setActivePanel(active.id)
      }
      
      setIsLoading(false)
    }

    loadData()
  }, [id])

  // Filtrer et trier les questions
  useEffect(() => {
    let filtered = questions

    // Filtrer par panel actif
    if (activePanel) {
      filtered = filtered.filter(q => q.panelId === activePanel)
    }

    // N'afficher que les questions approuvées pour les participants
    filtered = filtered.filter(q => q.status === 'APPROVED')

    // Filtrer par terme de recherche
    if (searchTerm) {
      filtered = filtered.filter(q => 
        q.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (q.answer && q.answer.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Trier
    if (sortBy === 'popular') {
      filtered.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes))
    } else {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    setFilteredQuestions(filtered)
  }, [questions, activePanel, searchTerm, sortBy])

  const handleSubmitQuestion = async () => {
    if (!newQuestion.trim() || isSubmitting || !activePanel) return

    setIsSubmitting(true)
    
    // Simuler l'envoi
    const newQuestionObj: Question = {
      id: Date.now().toString(),
      content: newQuestion,
      authorName: 'Vous',
      authorEmail: 'user@example.com',
      status: 'PENDING',
      upvotes: 0,
      downvotes: 0,
      createdAt: new Date().toISOString(),
      panelId: activePanel as string,
      userVote: null
    }

    setQuestions(prev => [newQuestionObj, ...prev])
    setNewQuestion('')
    setIsSubmitting(false)

    // Afficher un message de confirmation
    alert('Votre question a été soumise et est en attente de modération.')
  }

  const handleVote = async (questionId: string, voteType: 'up' | 'down') => {
    setQuestions(prev => 
      prev.map(q => {
        if (q.id === questionId) {
          const currentVote = q.userVote
          let newUpvotes = q.upvotes
          let newDownvotes = q.downvotes
          let newUserVote: 'up' | 'down' | null = voteType

          if (currentVote === voteType) {
            // Retirer le vote
            newUserVote = null
            if (voteType === 'up') newUpvotes--
            else newDownvotes--
          } else if (currentVote) {
            // Changer de vote
            if (currentVote === 'up') {
              newUpvotes--
              newDownvotes++
            } else {
              newDownvotes--
              newUpvotes++
            }
          } else {
            // Nouveau vote
            if (voteType === 'up') newUpvotes++
            else newDownvotes++
          }

          return {
            ...q,
            upvotes: newUpvotes,
            downvotes: newDownvotes,
            userVote: newUserVote
          }
        }
        return q
      })
    )
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fern-frond"></div>
        </div>
      </div>
    )
  }

  const currentPanel = panels.find(p => p.id === activePanel)

  return (
    <div className="container mx-auto py-8 space-y-6 bg-gradient-to-br from-fern-frond/5 to-luxor-gold/5 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Questions-Réponses</h1>
          <p className="text-muted-foreground">Posez vos questions et participez aux discussions</p>
        </div>
      </div>

      {/* Informations sur la session actuelle */}
      {currentPanel ? (
        <Card>
          <CardHeader>
            <CardTitle>Session en cours : {currentPanel.title}</CardTitle>
            <CardDescription>
              {format(new Date(currentPanel.startTime), 'HH:mm', { locale: fr })} -
              {format(new Date(currentPanel.endTime), 'HH:mm', { locale: fr })}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Aucune session ouverte</CardTitle>
            <CardDescription>
              Il n'y a actuellement aucune activité permettant de poser des questions.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Formulaire de question */}
      {currentPanel && (
        <Card>
          <CardHeader>
            <CardTitle>Poser une question</CardTitle>
            <CardDescription>
              Votre question sera soumise pour modération avant d\'être affichée
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Écrivez votre question ici..."
                onKeyPress={(e) => e.key === 'Enter' && handleSubmitQuestion()}
                disabled={isSubmitting}
                className="flex-1"
              />
              <Button 
                onClick={handleSubmitQuestion}
                disabled={!newQuestion.trim() || isSubmitting}
                className="bg-fern-frond hover:bg-fern-frond/90"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Soyez respectueux et pertinent. Les questions inappropriées seront rejetées.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Filtres et tri */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Rechercher dans les questions et réponses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={sortBy} onValueChange={(value: 'recent' | 'popular') => setSortBy(value)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Plus récentes</SelectItem>
                <SelectItem value="popular">Plus populaires</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Liste des questions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Questions approuvées ({filteredQuestions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {filteredQuestions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Aucune question approuvée pour le moment</p>
                  <p className="text-sm">Soyez le premier à poser une question !</p>
                </div>
              ) : (
                filteredQuestions.map((question) => (
                  <Card key={question.id} className="overflow-hidden">
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="w-8 h-8 flex-shrink-0">
                          <AvatarFallback>
                            {question.authorName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-medium text-sm">{question.authorName}</span>
                              <span className="text-xs text-muted-foreground ml-2">
                                {format(new Date(question.createdAt), 'HH:mm', { locale: fr })}
                              </span>
                            </div>
                            <Badge variant="default" className="text-xs bg-luxor-gold text-white border-luxor-gold">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Approuvée
                            </Badge>
                          </div>
                          
                          <p className="text-sm">{question.content}</p>
                          
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                className={`h-8 px-2 ${
                                  question.userVote === 'up' ? 'text-fern-frond' : 'text-muted-foreground'
                                }`}
                                onClick={() => handleVote(question.id, 'up')}
                              >
                                <ThumbsUp className="w-4 h-4" />
                                <span className="ml-1 text-xs">{question.upvotes}</span>
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className={`h-8 px-2 ${
                                  question.userVote === 'down' ? 'text-luxor-gold' : 'text-muted-foreground'
                                }`}
                                onClick={() => handleVote(question.id, 'down')}
                              >
                                <ThumbsDown className="w-4 h-4" />
                                <span className="ml-1 text-xs">{question.downvotes}</span>
                              </Button>
                            </div>
                          </div>

                          {question.answer && (
                            <div className="mt-4 p-4 bg-muted rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-medium">Réponse:</span>
                                <span className="text-xs text-muted-foreground">
                                  Par {question.answeredBy} - {question.answeredAt && format(new Date(question.answeredAt), 'HH:mm', { locale: fr })}
                                </span>
                              </div>
                              <p className="text-sm">{question.answer}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}