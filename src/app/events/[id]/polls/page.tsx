'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  CheckCircle,
  Users,
  Vote
} from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface PollOption {
  id: string
  text: string
  votes: number
  percentage: number
  isSelected?: boolean
}

interface Poll {
  id: string
  question: string
  description?: string
  isActive: boolean
  isAnonymous: boolean
  allowMultipleVotes: boolean
  createdAt: string
  panelId: string
  totalVotes: number
  options: PollOption[]
  userVoted?: boolean
}

interface Panel {
  id: string
  title: string
  description: string
  startTime: string
  endTime: string
  eventId: string
  allowQuestions?: boolean
  isActive: boolean
}

export default function EventPollsPage() {
  const params = useParams()
  const id = params.id as string
  
  const [activePanel, setActivePanel] = useState<string>('')
  const [panels, setPanels] = useState<Panel[]>([])
  const [polls, setPolls] = useState<Poll[]>([])
  const [filteredPolls, setFilteredPolls] = useState<Poll[]>([])
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
          isActive: false
        },
        {
          id: '2',
          title: 'Table ronde: Innovation technologique',
          description: 'Discussion sur les dernières tendances tech',
          startTime: '2024-01-15T10:30:00',
          endTime: '2024-01-15T12:00:00',
          eventId: id,
          isActive: true
        },
        {
          id: '3',
          title: 'Atelier: Développement durable',
          description: 'Atelier pratique sur les solutions durables',
          startTime: '2024-01-15T14:00:00',
          endTime: '2024-01-15T15:30:00',
          eventId: id,
          isActive: false
        }
      ]

      const mockPolls: Poll[] = [
        {
          id: '1',
          question: 'Quelle technologie vous intéresse le plus pour 2024 ?',
          description: 'Votez pour la technologie qui vous semble la plus prometteuse',
          isActive: true,
          isAnonymous: true,
          allowMultipleVotes: false,
          createdAt: '2024-01-15T10:45:00',
          panelId: '2',
          totalVotes: 45,
          userVoted: false,
          options: [
            { id: '1', text: 'Intelligence Artificielle', votes: 18, percentage: 40 },
            { id: '2', text: 'Blockchain', votes: 8, percentage: 18 },
            { id: '3', text: 'Internet des Objets', votes: 12, percentage: 27 },
            { id: '4', text: 'Réalité Virtuelle', votes: 7, percentage: 15 }
          ]
        },
        {
          id: '2',
          question: 'Préférez-vous les présentations en présentiel ou en ligne ?',
          description: 'Votre opinion sur le format des futures conférences',
          isActive: false,
          isAnonymous: true,
          allowMultipleVotes: false,
          createdAt: '2024-01-15T09:30:00',
          panelId: '1',
          totalVotes: 32,
          userVoted: true,
          options: [
            { id: '1', text: 'Présentiel', votes: 20, percentage: 62.5, isSelected: true },
            { id: '2', text: 'En ligne', votes: 5, percentage: 15.6 },
            { id: '3', text: 'Hybride', votes: 7, percentage: 21.9 }
          ]
        },
        {
          id: '3',
          question: 'Quel sujet souhaitez-vous approfondir dans les prochains ateliers ?',
          description: 'Sélectionnez jusqu\'à 3 sujets qui vous intéressent',
          isActive: true,
          isAnonymous: true,
          allowMultipleVotes: true,
          createdAt: '2024-01-15T11:15:00',
          panelId: '2',
          totalVotes: 28,
          userVoted: false,
          options: [
            { id: '1', text: 'Développement durable', votes: 15, percentage: 54 },
            { id: '2', text: 'Cybersécurité', votes: 12, percentage: 43 },
            { id: '3', text: 'Cloud Computing', votes: 8, percentage: 29 },
            { id: '4', text: 'Data Science', votes: 10, percentage: 36 },
            { id: '5', text: 'DevOps', votes: 6, percentage: 21 }
          ]
        }
      ]

      setPanels(mockPanels)
      setPolls(mockPolls)
      
      // Sélectionner le panel actif par défaut
      const activePanel = mockPanels.find(p => p.isActive)
      if (activePanel) {
        setActivePanel(activePanel.id)
      } else if (mockPanels.length > 0) {
        setActivePanel(mockPanels[0].id)
      }
      
      setIsLoading(false)
    }

    loadData()
   }, [id])

  // Filtrer les sondages
  useEffect(() => {
    let filtered = polls

    // Filtrer par panel actif
    if (activePanel) {
      filtered = filtered.filter(p => p.panelId === activePanel)
    }

    // Ne montrer que les sondages actifs pour les participants
    filtered = filtered.filter(p => p.isActive)

    setFilteredPolls(filtered)
  }, [polls, activePanel])

  const handleVote = async (pollId: string, optionId: string) => {
    const poll = polls.find(p => p.id === pollId)
    if (!poll) return

    setPolls(prev => 
      prev.map(p => {
        if (p.id === pollId) {
          let newOptions = [...p.options]
          let newTotalVotes = p.totalVotes

          if (p.allowMultipleVotes) {
            // Pour les votes multiples, toggle l'option
            const optionIndex = newOptions.findIndex(opt => opt.id === optionId)
            const wasSelected = newOptions[optionIndex].isSelected
            
            newOptions[optionIndex] = {
              ...newOptions[optionIndex],
              isSelected: !wasSelected,
              votes: wasSelected ? newOptions[optionIndex].votes - 1 : newOptions[optionIndex].votes + 1
            }
            
            newTotalVotes = wasSelected ? newTotalVotes - 1 : newTotalVotes + 1
          } else {
            // Pour les votes uniques, désélectionner les autres et sélectionner celle-ci
            newOptions = newOptions.map(opt => ({
              ...opt,
              isSelected: opt.id === optionId,
              votes: opt.id === optionId ? (opt.isSelected ? opt.votes : opt.votes + 1) : (opt.isSelected ? opt.votes - 1 : opt.votes)
            }))
            
            const hadPreviousVote = newOptions.some(opt => opt.id !== optionId && opt.isSelected)
            newTotalVotes = hadPreviousVote ? newTotalVotes : newTotalVotes + 1
          }

          // Recalculer les pourcentages
          newOptions = newOptions.map(opt => ({
            ...opt,
            percentage: newTotalVotes > 0 ? Math.round((opt.votes / newTotalVotes) * 100) : 0
          }))

          return {
            ...p,
            totalVotes: newTotalVotes,
            options: newOptions,
            userVoted: true
          }
        }
        return p
      })
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


  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sondages Interactifs</h1>
          <p className="text-muted-foreground">Participez aux sondages et voyez les résultats en temps réel</p>
        </div>
      </div>

      {/* Sélection du panel */}
      <Card>
        <CardHeader>
          <CardTitle>Session en cours</CardTitle>
          <CardDescription>Sélectionnez la session pour voir ses sondages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {panels.map((panel) => (
              <Button
                key={panel.id}
                variant={activePanel === panel.id ? "default" : "outline"}
                className="h-auto p-4 flex flex-col items-start text-left"
                onClick={() => setActivePanel(panel.id)}
              >
                <div className="font-medium">{panel.title}</div>
                <div className="text-xs opacity-70 mt-1">
                  {format(new Date(panel.startTime), 'HH:mm', { locale: fr })} - {format(new Date(panel.endTime), 'HH:mm', { locale: fr })}
                </div>
                {panel.isActive && (
                  <Badge variant="secondary" className="mt-2 text-xs">
                    En direct
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Liste des sondages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPolls.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Vote className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucun sondage actif</h3>
                <p className="text-muted-foreground text-center">
                  Il n'y a aucun sondage actif pour cette session.
                  <br />
                  Revenez plus tard ou consultez une autre session.
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          filteredPolls.map((poll) => (
            <Card key={poll.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{poll.question}</CardTitle>
                    {poll.description && (
                      <CardDescription>{poll.description}</CardDescription>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default">
                      <Vote className="w-3 h-3 mr-1" />
                      Actif
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      {poll.totalVotes}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Options de vote */}
                {!poll.userVoted ? (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">
                      {poll.allowMultipleVotes ? 'Sélectionnez vos options :' : 'Choisissez une option :'}
                    </p>
                    <div className="space-y-2">
                      {poll.options.map((option) => (
                        <Button
                          key={option.id}
                          variant="outline"
                          className="w-full justify-start text-left h-auto p-3"
                          onClick={() => handleVote(poll.id, option.id)}
                        >
                          <span className="flex-1">{option.text}</span>
                          {poll.allowMultipleVotes && (
                            <div className={`w-4 h-4 rounded border-2 ${
                              option.isSelected ? 'bg-primary border-primary' : 'border-muted-foreground'
                            }`} />
                          )}
                        </Button>
                      ))}
                    </div>
                    {poll.allowMultipleVotes && (
                      <p className="text-xs text-muted-foreground">
                        Vous pouvez sélectionner plusieurs options
                      </p>
                    )}
                  </div>
                ) : (
                  /* Résultats */
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Résultats en temps réel</p>
                      <span className="text-xs text-muted-foreground">
                        {poll.totalVotes} vote{poll.totalVotes > 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {poll.options.map((option) => (
                        <div key={option.id} className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              {option.isSelected && <CheckCircle className="w-4 h-4 text-green-600" />}
                              <span className={option.isSelected ? 'font-medium' : ''}>{option.text}</span>
                            </div>
                            <span className="font-medium">{option.percentage}%</span>
                          </div>
                          <div className="w-full bg-secondary rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-500 ${
                                option.isSelected ? 'bg-green-500' : 'bg-primary'
                              }`}
                              style={{ width: `${option.percentage}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{option.votes} vote{option.votes > 1 ? 's' : ''}</span>
                            {option.isSelected && (
                              <span className="text-green-600">Votre vote</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Separator />

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {poll.isAnonymous ? 'Vote anonyme' : 'Vote public'}
                  </span>
                  <span>
                    Créé le {format(new Date(poll.createdAt), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}