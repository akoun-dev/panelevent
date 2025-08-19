'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Star,
  MessageSquare,
  Send,
  ThumbsUp,
  TrendingUp,
  Users,
  CheckCircle,
  Clock
} from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface Feedback {
  id: string
  userName: string
  rating: number
  comment?: string
  category: string
  createdAt: string
  helpful: number
  userVoted?: boolean
}

interface EventStats {
  averageRating: number
  totalFeedbacks: number
  ratingDistribution: {
    rating: number
    count: number
    percentage: number
  }[]
}

interface Event {
  id: string
  title: string
  description?: string
  startDate: string
  endDate?: string
  location?: string
  isPublic: boolean
  isActive: boolean
  userRegistered: boolean
  userAttended: boolean
  userFeedback?: Feedback
}

export default function EventFeedbackPage() {
  const params = useParams()
  const id = params.id as string
  
  const [event, setEvent] = useState<Event | null>(null)
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [stats, setStats] = useState<EventStats | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [newFeedback, setNewFeedback] = useState({
    rating: 0,
    comment: '',
    category: 'Général'
  })
  const [isLoading, setIsLoading] = useState(true)

  // Simuler le chargement des données
  useEffect(() => {
    const loadData = async () => {
      // Données de démonstration pour l'événement
      const mockEvent: Event = {
        id: id,
        title: 'Conférence Technologique 2024',
        description: 'La plus grande conférence sur les innovations technologiques',
        startDate: '2024-01-15T09:00:00',
        endDate: '2024-01-15T18:00:00',
        location: 'Paris, France',
        isPublic: true,
        isActive: false,
        userRegistered: true,
        userAttended: true
      }

      // Données de démonstration pour les feedbacks
      const mockFeedbacks: Feedback[] = [
        {
          id: '1',
          userName: 'Marie Dubois',
          rating: 5,
          comment: 'Excellente conférence ! Les intervenants étaient très compétents et les sujets pertinents.',
          category: 'Général',
          createdAt: '2024-01-15T18:30:00',
          helpful: 8
        },
        {
          id: '2',
          userName: 'Jean Martin',
          rating: 4,
          comment: 'Très bon événement dans l\'ensemble. Peut-être améliorer la logistique.',
          category: 'Logistique',
          createdAt: '2024-01-15T19:15:00',
          helpful: 5
        },
        {
          id: '3',
          userName: 'Sophie Bernard',
          rating: 5,
          comment: 'Au top ! J\'ai appris énormément et le networking était génial.',
          category: 'Contenu',
          createdAt: '2024-01-15T20:00:00',
          helpful: 12,
          userVoted: true
        },
        {
          id: '4',
          userName: 'Pierre Lefebvre',
          rating: 3,
          comment: 'Correct mais j\'attendais plus de profondeur technique.',
          category: 'Contenu',
          createdAt: '2024-01-16T09:30:00',
          helpful: 2
        },
        {
          id: '5',
          userName: 'Claire Moreau',
          rating: 4,
          comment: 'Bonne organisation, salle confortable.',
          category: 'Format',
          createdAt: '2024-01-16T10:45:00',
          helpful: 6
        }
      ]

      // Calculer les statistiques
      const totalFeedbacks = mockFeedbacks.length
      const averageRating = mockFeedbacks.reduce((sum, f) => sum + f.rating, 0) / totalFeedbacks
      
      const ratingDistribution = [5, 4, 3, 2, 1].map(rating => {
        const count = mockFeedbacks.filter(f => f.rating === rating).length
        return {
          rating,
          count,
          percentage: Math.round((count / totalFeedbacks) * 100)
        }
      })

      const mockStats: EventStats = {
        averageRating: Math.round(averageRating * 10) / 10,
        totalFeedbacks,
        ratingDistribution
      }

      setEvent(mockEvent)
      setFeedbacks(mockFeedbacks)
      setStats(mockStats)
      setIsLoading(false)
    }

    loadData()
   }, [id])

  const handleSubmitFeedback = async () => {
    if (newFeedback.rating === 0 || isSubmitting) return

    setIsSubmitting(true)
    
    // Simuler l'envoi
    const feedback: Feedback = {
      id: Date.now().toString(),
      userName: 'Vous',
      rating: newFeedback.rating,
      comment: newFeedback.comment,
      category: newFeedback.category,
      createdAt: new Date().toISOString(),
      helpful: 0
    }

    setFeedbacks(prev => [feedback, ...prev])
    setHasSubmitted(true)
    setIsSubmitting(false)

    // Mettre à jour les stats
    if (stats) {
      const newTotalFeedbacks = stats.totalFeedbacks + 1
      const newAverageRating = ((stats.averageRating * stats.totalFeedbacks) + newFeedback.rating) / newTotalFeedbacks
      const newRatingDistribution = stats.ratingDistribution.map(item => 
        item.rating === newFeedback.rating 
          ? { ...item, count: item.count + 1, percentage: Math.round(((item.count + 1) / newTotalFeedbacks) * 100) }
          : { ...item, percentage: Math.round((item.count / newTotalFeedbacks) * 100) }
      )

      setStats({
        averageRating: Math.round(newAverageRating * 10) / 10,
        totalFeedbacks: newTotalFeedbacks,
        ratingDistribution: newRatingDistribution
      })
    }
  }

  const handleVoteHelpful = async (feedbackId: string) => {
    setFeedbacks(prev => 
      prev.map(f => {
        if (f.id === feedbackId) {
          const wasVoted = f.userVoted
          return {
            ...f,
            helpful: wasVoted ? f.helpful - 1 : f.helpful + 1,
            userVoted: !wasVoted
          }
        }
        return f
      })
    )
  }

  const renderStars = (rating: number, interactive = false, onRate?: (rating: number) => void) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-6 h-6 cursor-pointer transition-colors ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 hover:text-yellow-300'
            } ${interactive ? 'cursor-pointer' : ''}`}
            onClick={interactive && onRate ? () => onRate(star) : undefined}
          />
        ))}
      </div>
    )
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

  if (!event) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Événement non trouvé</h3>
            <p className="text-muted-foreground">L'événement demandé n'existe pas.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!event.userAttended) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Clock className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Feedback non disponible</h3>
            <p className="text-muted-foreground text-center mb-4">
              Vous devez avoir participé à l'événement pour laisser un feedback.
            </p>
            <Badge variant="secondary">
              {event.userRegistered ? 'Inscrit mais non présent' : 'Non inscrit'}
            </Badge>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Votre Feedback</h1>
          <p className="text-muted-foreground">
            Partagez votre expérience pour l'événement: {event.title}
          </p>
        </div>
      </div>

      {/* Statistiques */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Note moyenne</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageRating}/5</div>
              <p className="text-xs text-muted-foreground">
                Basé sur {stats.totalFeedbacks} avis
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round((stats.ratingDistribution.filter(r => r.rating >= 4).reduce((sum, r) => sum + r.count, 0) / stats.totalFeedbacks) * 100)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Notes 4-5 étoiles
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Participants</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalFeedbacks}</div>
              <p className="text-xs text-muted-foreground">
                Avis laissés
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulaire de feedback */}
        <Card>
          <CardHeader>
            <CardTitle>
              {hasSubmitted ? <CheckCircle className="w-5 h-5 text-green-500 inline mr-2" /> : null}
              {hasSubmitted ? 'Merci pour votre feedback !' : 'Votre avis'}
            </CardTitle>
            <CardDescription>
              {hasSubmitted 
                ? 'Votre feedback a été enregistré avec succès.' 
                : 'Aidez-nous à améliorer nos futurs événements'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!hasSubmitted && (
              <>
                <div>
                  <label className="text-sm font-medium mb-2 block">Votre note globale</label>
                  {renderStars(newFeedback.rating, true, (rating) => 
                    setNewFeedback(prev => ({ ...prev, rating }))
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Catégorie</label>
                  <Select value={newFeedback.category} onValueChange={(value) => 
                    setNewFeedback(prev => ({ ...prev, category: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Général">Général</SelectItem>
                      <SelectItem value="Contenu">Contenu</SelectItem>
                      <SelectItem value="Logistique">Logistique</SelectItem>
                      <SelectItem value="Format">Format</SelectItem>
                      <SelectItem value="Technique">Technique</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Commentaires (optionnel)</label>
                  <Textarea
                    value={newFeedback.comment}
                    onChange={(e) => setNewFeedback(prev => ({ ...prev, comment: e.target.value }))}
                    placeholder="Partagez votre expérience, suggestions ou commentaires..."
                    rows={4}
                  />
                </div>

                <Button 
                  onClick={handleSubmitFeedback}
                  disabled={newFeedback.rating === 0 || isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Envoyer mon feedback
                    </>
                  )}
                </Button>
              </>
            )}

            {hasSubmitted && (
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Votre feedback nous aide à créer de meilleurs événements.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setHasSubmitted(false)
                    setNewFeedback({
                      rating: 0,
                      comment: '',
                      category: 'Général'
                    })
                  }}
                >
                  Modifier mon feedback
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Distribution des notes */}
        <Card>
          <CardHeader>
            <CardTitle>Distribution des notes</CardTitle>
          </CardHeader>
          <CardContent>
            {stats && (
              <div className="space-y-3">
                {stats.ratingDistribution.map((item) => (
                  <div key={item.rating} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-16">
                      <span className="text-sm">{item.rating}</span>
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    </div>
                    <div className="flex-1 bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <div className="flex items-center gap-2 w-20 justify-end">
                      <span className="text-sm font-medium">{item.count}</span>
                      <span className="text-xs text-muted-foreground">({item.percentage}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Feedbacks récents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Avis récents des participants
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            <div className="space-y-4">
              {feedbacks.map((feedback) => (
                <Card key={feedback.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {feedback.userName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{feedback.userName}</h4>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(feedback.createdAt), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">{feedback.category}</Badge>
                    </div>
                    
                    <div className="mb-2">
                      {renderStars(feedback.rating)}
                    </div>
                    
                    {feedback.comment && (
                      <p className="text-sm mb-3">{feedback.comment}</p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVoteHelpful(feedback.id)}
                        className={`text-xs ${
                          feedback.userVoted ? 'text-primary' : 'text-muted-foreground'
                        }`}
                      >
                        <ThumbsUp className={`w-3 h-3 mr-1 ${
                          feedback.userVoted ? 'fill-current' : ''
                        }`} />
                        Utile ({feedback.helpful})
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}