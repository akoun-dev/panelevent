"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { FileText, Search, Calendar, Star, CheckCircle, Eye } from 'lucide-react'
import Link from 'next/link'

interface Feedback {
  id: string
  rating: number
  comment: string
  event: {
    id: string
    title: string
    slug: string
  }
  author: {
    name: string
    email: string
  }
  createdAt: string
  isResolved: boolean
  isHelpful?: boolean
}

export default function FeedbacksPage() {
  const { data: session } = useSession()
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [ratingFilter, setRatingFilter] = useState<'all' | 'positive' | 'negative'>('all')
  const [resolvedFilter, setResolvedFilter] = useState<'all' | 'resolved' | 'unresolved'>('all')

  useEffect(() => {
    fetchFeedbacks()
  }, [])

  const fetchFeedbacks = async () => {
    try {
      const response = await fetch('/api/events/my-events/feedback')
      if (response.ok) {
        const data = await response.json()
        setFeedbacks(data.feedbacks || [])
      }
    } catch (error) {
      console.error('Failed to fetch feedbacks:', error)
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

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchesSearch = feedback.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feedback.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feedback.event.title.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRating = ratingFilter === 'all' || 
                          (ratingFilter === 'positive' && feedback.rating >= 4) ||
                          (ratingFilter === 'negative' && feedback.rating <= 2)
    
    const matchesResolved = resolvedFilter === 'all' ||
                           (resolvedFilter === 'resolved' && feedback.isResolved) ||
                           (resolvedFilter === 'unresolved' && !feedback.isResolved)
    
    return matchesSearch && matchesRating && matchesResolved
  })

  const toggleResolve = async (feedbackId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/feedback/${feedbackId}/resolve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isResolved: !currentStatus }),
      })

      if (response.ok) {
        setFeedbacks(feedbacks.map(f => 
          f.id === feedbackId ? { ...f, isResolved: !currentStatus } : f
        ))
      }
    } catch (error) {
      console.error('Failed to update feedback status:', error)
    }
  }

  const toggleHelpful = async (feedbackId: string, currentStatus?: boolean) => {
    try {
      const response = await fetch(`/api/feedback/${feedbackId}/helpful`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isHelpful: !currentStatus }),
      })

      if (response.ok) {
        setFeedbacks(feedbacks.map(f => 
          f.id === feedbackId ? { ...f, isHelpful: !currentStatus } : f
        ))
      }
    } catch (error) {
      console.error('Failed to update feedback helpful status:', error)
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
          <h1 className="text-3xl font-bold tracking-tight">Feedbacks</h1>
          <p className="text-muted-foreground">
            Analysez les retours des participants sur vos événements
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Rechercher un feedback..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={ratingFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setRatingFilter('all')}
          >
            Tous
          </Button>
          <Button
            variant={ratingFilter === 'positive' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setRatingFilter('positive')}
          >
            Positifs
          </Button>
          <Button
            variant={ratingFilter === 'negative' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setRatingFilter('negative')}
          >
            Négatifs
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            variant={resolvedFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setResolvedFilter('all')}
          >
            Tous
          </Button>
          <Button
            variant={resolvedFilter === 'resolved' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setResolvedFilter('resolved')}
          >
            Résolus
          </Button>
          <Button
            variant={resolvedFilter === 'unresolved' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setResolvedFilter('unresolved')}
          >
            Non résolus
          </Button>
        </div>
      </div>

      {filteredFeedbacks.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchTerm || ratingFilter !== 'all' || resolvedFilter !== 'all' 
                ? 'Aucun résultat trouvé' 
                : 'Aucun feedback'
              }
            </h3>
            <p className="text-muted-foreground text-center">
              {searchTerm || ratingFilter !== 'all' || resolvedFilter !== 'all'
                ? 'Aucun feedback ne correspond à vos critères de recherche.'
                : 'Vous n\'avez pas encore reçu de feedback pour vos événements.'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredFeedbacks.map((feedback) => (
            <Card key={feedback.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {renderStars(feedback.rating)}
                      <span className="text-sm text-muted-foreground">
                        {feedback.rating}/5
                      </span>
                    </div>
                    <CardTitle className="text-lg">{feedback.comment}</CardTitle>
                    <CardDescription>
                      Par {feedback.author.name} • {feedback.event.title}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={feedback.isResolved ? 'default' : 'secondary'}>
                      {feedback.isResolved ? 'Résolu' : 'Non résolu'}
                    </Badge>
                    {feedback.isHelpful && (
                      <Badge variant="outline">Utile</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Calendar className="w-4 h-4" />
                  <span>Donné le {formatDate(feedback.createdAt)}</span>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/e/${feedback.event.slug}`}>
                      <Eye className="w-4 h-4 mr-2" />
                      Voir l'événement
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/events/${feedback.event.id}/feedback`}>
                      <FileText className="w-4 h-4 mr-2" />
                      Voir les feedbacks
                    </Link>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleResolve(feedback.id, feedback.isResolved)}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {feedback.isResolved ? 'Marquer non résolu' : 'Marquer résolu'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleHelpful(feedback.id, feedback.isHelpful)}
                  >
                    {feedback.isHelpful ? 'Marquer non utile' : 'Marquer utile'}
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