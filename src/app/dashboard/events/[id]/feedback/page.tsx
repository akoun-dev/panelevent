'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  MessageSquare, 
  Star, 
  TrendingUp, 
  ThumbsUp,
  Filter,
  Download,
  Eye,
  Calendar
} from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface Feedback {
  id: string
  userId: string
  userName: string
  userEmail: string
  rating: number
  comment?: string
  category: string
  createdAt: string
  eventId: string
  helpful: number
  resolved: boolean
}

interface FeedbackStats {
  averageRating: number
  totalFeedbacks: number
  ratingDistribution: {
    rating: number
    count: number
    percentage: number
  }[]
  categoryStats: {
    category: string
    averageRating: number
    count: number
  }[]
  recentTrend: 'up' | 'down' | 'stable'
}

export default function EventFeedbackPage() {
  const { id } = useParams<{ id: string }>()
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [filteredFeedbacks, setFilteredFeedbacks] = useState<Feedback[]>([])
  const [stats, setStats] = useState<FeedbackStats | null>(null)
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null)
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [ratingFilter, setRatingFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)

  // Simuler le chargement des données
  useEffect(() => {
    const loadData = async () => {
      // Données de démonstration
      const mockFeedbacks: Feedback[] = [
        {
          id: '1',
          userId: '1',
          userName: 'Marie Dubois',
          userEmail: 'marie@example.com',
          rating: 5,
          comment: 'Excellente conférence ! Les intervenants étaient très compétents et les sujets pertinents. J\'ai particulièrement apprécié la session sur l\'IA.',
          category: 'Général',
          createdAt: '2024-01-15T18:30:00',
          eventId: id,
          helpful: 8,
          resolved: true
        },
        {
          id: '2',
          userId: '2',
          userName: 'Jean Martin',
          userEmail: 'jean@example.com',
          rating: 4,
          comment: 'Très bon événement dans l\'ensemble. Peut-être améliorer la logistique pour le café.',
          category: 'Logistique',
          createdAt: '2024-01-15T19:15:00',
          eventId: id,
          helpful: 5,
          resolved: false
        },
        {
          id: '3',
          userId: '3',
          userName: 'Sophie Bernard',
          userEmail: 'sophie@example.com',
          rating: 5,
          comment: 'Au top ! J\'ai appris énormément et le networking était génial.',
          category: 'Contenu',
          createdAt: '2024-01-15T20:00:00',
          eventId: id,
          helpful: 12,
          resolved: true
        },
        {
          id: '4',
          userId: '4',
          userName: 'Pierre Lefebvre',
          userEmail: 'pierre@example.com',
          rating: 3,
          comment: 'Correct mais j\'attendais plus de profondeur technique dans certaines présentations.',
          category: 'Contenu',
          createdAt: '2024-01-16T09:30:00',
          eventId: id,
          helpful: 2,
          resolved: false
        },
        {
          id: '5',
          userId: '5',
          userName: 'Claire Moreau',
          userEmail: 'claire@example.com',
          rating: 4,
          comment: 'Bonne organisation, salle confortable. Peut-être prévoir plus de temps pour les questions.',
          category: 'Format',
          createdAt: '2024-01-16T10:45:00',
          eventId: id,
          helpful: 6,
          resolved: true
        },
        {
          id: '6',
          userId: '6',
          userName: 'Lucas Petit',
          userEmail: 'lucas@example.com',
          rating: 2,
          comment: 'Décevant, son de mauvaise qualité et retards dans le programme.',
          category: 'Technique',
          createdAt: '2024-01-16T14:20:00',
          eventId: id,
          helpful: 1,
          resolved: false
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

      const categories = [...new Set(mockFeedbacks.map(f => f.category))]
      const categoryStats = categories.map(category => {
        const categoryFeedbacks = mockFeedbacks.filter(f => f.category === category)
        const avgRating = categoryFeedbacks.reduce((sum, f) => sum + f.rating, 0) / categoryFeedbacks.length
        return {
          category,
          averageRating: Math.round(avgRating * 10) / 10,
          count: categoryFeedbacks.length
        }
      })

      // Simuler une tendance récente (basée sur les derniers feedbacks)
      const recentFeedbacks = mockFeedbacks.slice(-3)
      const recentAverage = recentFeedbacks.reduce((sum, f) => sum + f.rating, 0) / recentFeedbacks.length
      const recentTrend = recentAverage > averageRating ? 'up' : recentAverage < averageRating ? 'down' : 'stable'

      const mockStats: FeedbackStats = {
        averageRating: Math.round(averageRating * 10) / 10,
        totalFeedbacks,
        ratingDistribution,
        categoryStats,
        recentTrend
      }

      setFeedbacks(mockFeedbacks)
      setStats(mockStats)
      setIsLoading(false)
    }

    loadData()
  }, [id])

  // Filtrer les feedbacks
  useEffect(() => {
    let filtered = feedbacks

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(f => f.category === categoryFilter)
    }

    if (ratingFilter !== 'all') {
      filtered = filtered.filter(f => f.rating === parseInt(ratingFilter))
    }

    if (statusFilter !== 'all') {
      if (statusFilter === 'resolved') {
        filtered = filtered.filter(f => f.resolved)
      } else if (statusFilter === 'unresolved') {
        filtered = filtered.filter(f => !f.resolved)
      }
    }

    setFilteredFeedbacks(filtered)
  }, [feedbacks, categoryFilter, ratingFilter, statusFilter])

  const handleMarkResolved = async (feedbackId: string) => {
    setFeedbacks(prev => 
      prev.map(f => 
        f.id === feedbackId ? { ...f, resolved: true } : f
      )
    )
  }

  const handleMarkUnresolved = async (feedbackId: string) => {
    setFeedbacks(prev => 
      prev.map(f => 
        f.id === feedbackId ? { ...f, resolved: false } : f
      )
    )
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'down':
        return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />
      default:
        return <TrendingUp className="w-4 h-4 text-gray-400" />
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
          <h1 className="text-3xl font-bold">Feedback des Participants</h1>
          <p className="text-muted-foreground">Analysez les retours et améliorez vos événements</p>
        </div>
        <Button>
          <Download className="w-4 h-4 mr-2" />
          Exporter les données
        </Button>
      </div>

      {/* Statistiques */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Note moyenne</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageRating}/5</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                {getTrendIcon(stats.recentTrend)}
                <span>Tendance récente</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total avis</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalFeedbacks}</div>
              <p className="text-xs text-muted-foreground">
                {feedbacks.filter(f => f.resolved).length} traités
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
              <ThumbsUp className="h-4 w-4 text-muted-foreground" />
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
              <CardTitle className="text-sm font-medium">À traiter</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {feedbacks.filter(f => !f.resolved).length}
              </div>
              <p className="text-xs text-muted-foreground">
                En attente
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="feedbacks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="feedbacks">Avis des participants</TabsTrigger>
          <TabsTrigger value="analytics">Analyse détaillée</TabsTrigger>
        </TabsList>

        <TabsContent value="feedbacks" className="space-y-4">
          {/* Filtres */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes catégories</SelectItem>
                    <SelectItem value="Général">Général</SelectItem>
                    <SelectItem value="Contenu">Contenu</SelectItem>
                    <SelectItem value="Logistique">Logistique</SelectItem>
                    <SelectItem value="Format">Format</SelectItem>
                    <SelectItem value="Technique">Technique</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={ratingFilter} onValueChange={setRatingFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Note" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes notes</SelectItem>
                    <SelectItem value="5">5 étoiles</SelectItem>
                    <SelectItem value="4">4 étoiles</SelectItem>
                    <SelectItem value="3">3 étoiles</SelectItem>
                    <SelectItem value="2">2 étoiles</SelectItem>
                    <SelectItem value="1">1 étoile</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous statuts</SelectItem>
                    <SelectItem value="resolved">Traités</SelectItem>
                    <SelectItem value="unresolved">Non traités</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Liste des feedbacks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Avis ({filteredFeedbacks.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  <div className="space-y-4">
                    {filteredFeedbacks.map((feedback) => (
                      <Card 
                        key={feedback.id} 
                        className={`cursor-pointer transition-colors ${
                          selectedFeedback?.id === feedback.id ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => setSelectedFeedback(feedback)}
                      >
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
                                <p className="text-sm text-muted-foreground">{feedback.userEmail}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={feedback.resolved ? "default" : "secondary"}>
                                {feedback.resolved ? 'Traité' : 'En attente'}
                              </Badge>
                              <Badge variant="outline">{feedback.category}</Badge>
                            </div>
                          </div>
                          
                          <div className="mb-2">
                            {renderStars(feedback.rating)}
                          </div>
                          
                          {feedback.comment && (
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                              {feedback.comment}
                            </p>
                          )}
                          
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>
                              {format(new Date(feedback.createdAt), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="flex items-center gap-1">
                                <ThumbsUp className="w-3 h-3" /> {feedback.helpful}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Détails du feedback */}
            <Card>
              <CardHeader>
                <CardTitle>Détails de l'avis</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedFeedback ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar>
                        <AvatarFallback>
                          {selectedFeedback.userName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{selectedFeedback.userName}</h3>
                        <p className="text-sm text-muted-foreground">{selectedFeedback.userEmail}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {renderStars(selectedFeedback.rating)}
                      <Badge variant="outline">{selectedFeedback.category}</Badge>
                      <Badge variant={selectedFeedback.resolved ? "default" : "secondary"}>
                        {selectedFeedback.resolved ? 'Traité' : 'En attente'}
                      </Badge>
                    </div>

                    {selectedFeedback.comment && (
                      <div>
                        <h4 className="font-medium mb-2">Commentaire:</h4>
                        <p className="text-sm">{selectedFeedback.comment}</p>
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(selectedFeedback.createdAt), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="w-4 h-4" /> {selectedFeedback.helpful} utile
                      </span>
                    </div>

                    <Separator />

                    <div className="flex gap-2">
                      {selectedFeedback.resolved ? (
                        <Button 
                          variant="outline" 
                          onClick={() => handleMarkUnresolved(selectedFeedback.id)}
                        >
                          Marquer comme non traité
                        </Button>
                      ) : (
                        <Button 
                          onClick={() => handleMarkResolved(selectedFeedback.id)}
                        >
                          Marquer comme traité
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64 text-muted-foreground">
                    <p>Sélectionnez un avis pour voir les détails</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {stats && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Distribution des notes */}
              <Card>
                <CardHeader>
                  <CardTitle>Distribution des notes</CardTitle>
                </CardHeader>
                <CardContent>
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
                </CardContent>
              </Card>

              {/* Stats par catégorie */}
              <Card>
                <CardHeader>
                  <CardTitle>Notes par catégorie</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats.categoryStats.map((item) => (
                      <div key={item.category} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{item.category}</span>
                          <Badge variant="outline" className="text-xs">
                            {item.count}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          {renderStars(item.averageRating)}
                          <span className="text-sm font-medium">{item.averageRating}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}