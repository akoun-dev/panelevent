"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { MessageSquare, Search, Calendar, Users, Eye, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'

interface Question {
  id: string
  content: string
  author: {
    name: string
    email: string
  }
  event: {
    id: string
    title: string
    slug: string
  }
  createdAt: string
  status: 'pending' | 'approved' | 'rejected'
  answer?: string
  answeredAt?: string
}

export default function QAPage() {
  const { data: session } = useSession()
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')

  useEffect(() => {
    fetchQuestions()
  }, [])

  const fetchQuestions = async () => {
    try {
      const response = await fetch('/api/events/my-events/questions')
      if (response.ok) {
        const data = await response.json()
        setQuestions(data.questions || [])
      }
    } catch (error) {
      console.error('Failed to fetch questions:', error)
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

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.event.title.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || question.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const handleStatusChange = async (questionId: string, newStatus: 'approved' | 'rejected') => {
    try {
      const response = await fetch(`/api/questions/${questionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setQuestions(questions.map(q => 
          q.id === questionId ? { ...q, status: newStatus } : q
        ))
      }
    } catch (error) {
      console.error('Failed to update question status:', error)
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
          <h1 className="text-3xl font-bold tracking-tight">Questions & Réponses</h1>
          <p className="text-muted-foreground">
            Modérez les questions posées lors de vos événements
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Rechercher une question..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('all')}
          >
            Tous
          </Button>
          <Button
            variant={statusFilter === 'pending' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('pending')}
          >
            En attente
          </Button>
          <Button
            variant={statusFilter === 'approved' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('approved')}
          >
            Approuvés
          </Button>
          <Button
            variant={statusFilter === 'rejected' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('rejected')}
          >
            Rejetés
          </Button>
        </div>
      </div>

      {filteredQuestions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchTerm || statusFilter !== 'all' ? 'Aucun résultat trouvé' : 'Aucune question'}
            </h3>
            <p className="text-muted-foreground text-center">
              {searchTerm || statusFilter !== 'all'
                ? 'Aucune question ne correspond à vos critères de recherche.'
                : 'Vous n\'avez pas encore reçu de questions pour vos événements.'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredQuestions.map((question) => (
            <Card key={question.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{question.content}</CardTitle>
                    <CardDescription>
                      Par {question.author.name} • {question.event.title}
                    </CardDescription>
                  </div>
                  <Badge variant={
                    question.status === 'approved' ? 'default' :
                    question.status === 'rejected' ? 'destructive' : 'secondary'
                  }>
                    {question.status === 'approved' ? 'Approuvé' :
                     question.status === 'rejected' ? 'Rejeté' : 'En attente'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Posée le {formatDate(question.createdAt)}</span>
                  </div>
                  {question.answeredAt && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Répondu le {formatDate(question.answeredAt)}</span>
                    </div>
                  )}
                </div>

                {question.answer && (
                  <div className="bg-muted p-3 rounded-lg mb-4">
                    <p className="text-sm"><strong>Réponse :</strong> {question.answer}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/e/${question.event.slug}`}>
                      <Eye className="w-4 h-4 mr-2" />
                      Voir l'événement
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/events/${question.event.id}/qa`}>
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Gérer Q&A
                    </Link>
                  </Button>
                  
                  {question.status === 'pending' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange(question.id, 'approved')}
                        className="text-green-600 hover:text-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approuver
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange(question.id, 'rejected')}
                        className="text-red-600 hover:text-red-700"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Rejeter
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}