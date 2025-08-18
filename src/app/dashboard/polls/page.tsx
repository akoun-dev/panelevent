"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { BarChart3, Search, Calendar, Users, Eye, Plus } from 'lucide-react'
import Link from 'next/link'

interface Poll {
  id: string
  question: string
  event: {
    id: string
    title: string
    slug: string
  }
  isActive: boolean
  createdAt: string
  options: {
    id: string
    text: string
    votes: number
  }[]
  _count?: {
    votes: number
  }
}

export default function PollsPage() {
  const { data: session } = useSession()
  const [polls, setPolls] = useState<Poll[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchPolls()
  }, [])

  const fetchPolls = async () => {
    try {
      const response = await fetch('/api/events/my-events/polls')
      if (response.ok) {
        const data = await response.json()
        setPolls(data.polls || [])
      }
    } catch (error) {
      console.error('Failed to fetch polls:', error)
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

  const filteredPolls = polls.filter(poll => 
    poll.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    poll.event.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const togglePollStatus = async (pollId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/polls/${pollId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      })

      if (response.ok) {
        setPolls(polls.map(p => 
          p.id === pollId ? { ...p, isActive: !currentStatus } : p
        ))
      }
    } catch (error) {
      console.error('Failed to update poll status:', error)
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
          <h1 className="text-3xl font-bold tracking-tight">Sondages</h1>
          <p className="text-muted-foreground">
            Gérez les sondages de vos événements
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/events/new-poll">
            <Plus className="w-4 h-4 mr-2" />
            Créer un sondage
          </Link>
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Rechercher un sondage..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filteredPolls.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchTerm ? 'Aucun résultat trouvé' : 'Aucun sondage'}
            </h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm 
                ? 'Aucun sondage ne correspond à votre recherche.'
                : 'Vous n\'avez pas encore créé de sondage pour vos événements.'
              }
            </p>
            {!searchTerm && (
              <Button asChild>
                <Link href="/dashboard/events/new-poll">
                  <Plus className="w-4 h-4 mr-2" />
                  Créer votre premier sondage
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredPolls.map((poll) => (
            <Card key={poll.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{poll.question}</CardTitle>
                    <CardDescription>
                      {poll.event.title}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={poll.isActive ? 'default' : 'secondary'}>
                      {poll.isActive ? 'Actif' : 'Inactif'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Créé le {formatDate(poll.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{poll._count?.votes || 0} votes</span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-sm font-medium">Options :</p>
                  {poll.options.map((option, index) => (
                    <div key={option.id} className="flex items-center justify-between text-sm">
                      <span>{option.text}</span>
                      <span className="text-muted-foreground">{option.votes} votes</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/e/${poll.event.slug}`}>
                      <Eye className="w-4 h-4 mr-2" />
                      Voir l'événement
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/events/${poll.event.id}/polls`}>
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Voir les résultats
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => togglePollStatus(poll.id, poll.isActive)}
                  >
                    {poll.isActive ? 'Désactiver' : 'Activer'}
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