'use client'

import { useState, useEffect } from 'react'
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
  BarChart3,
  Plus,
  Edit,
  Trash2,
  Play,
  Pause,
  Users,
  CheckCircle,
  Clock,
  MoreVertical,
  Vote
} from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface PollOption {
  id: string
  text: string
  votes: number
  percentage: number
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
}

interface Panel {
  id: string
  title: string
  description: string
  startTime: string
  endTime: string
  eventId: string
}

export default function EventPollsPage({ params }: { params: { id: string } }) {
  const [activePanel, setActivePanel] = useState<string>('')
  const [panels, setPanels] = useState<Panel[]>([])
  const [polls, setPolls] = useState<Poll[]>([])
  const [filteredPolls, setFilteredPolls] = useState<Poll[]>([])
  const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [newPoll, setNewPoll] = useState({
    question: '',
    description: '',
    isAnonymous: false,
    allowMultipleVotes: false,
    options: ['', '']
  })
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
          eventId: params.id
        },
        {
          id: '2',
          title: 'Table ronde: Innovation technologique',
          description: 'Discussion sur les dernières tendances tech',
          startTime: '2024-01-15T10:30:00',
          endTime: '2024-01-15T12:00:00',
          eventId: params.id
        },
        {
          id: '3',
          title: 'Atelier: Développement durable',
          description: 'Atelier pratique sur les solutions durables',
          startTime: '2024-01-15T14:00:00',
          endTime: '2024-01-15T15:30:00',
          eventId: params.id
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
          options: [
            { id: '1', text: 'Présentiel', votes: 20, percentage: 62.5 },
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
      if (mockPanels.length > 0) {
        setActivePanel(mockPanels[0].id)
      }
      setIsLoading(false)
    }

    loadData()
  }, [params.id])

  // Filtrer les sondages
  useEffect(() => {
    let filtered = polls

    // Filtrer par panel actif
    if (activePanel) {
      filtered = filtered.filter(p => p.panelId === activePanel)
    }

    setFilteredPolls(filtered)
  }, [polls, activePanel])

  const handleCreatePoll = async () => {
    if (!newPoll.question.trim() || newPoll.options.some(opt => !opt.trim())) {
      return
    }

    const poll: Poll = {
      id: Date.now().toString(),
      question: newPoll.question,
      description: newPoll.description,
      isActive: false,
      isAnonymous: newPoll.isAnonymous,
      allowMultipleVotes: newPoll.allowMultipleVotes,
      createdAt: new Date().toISOString(),
      panelId: activePanel,
      totalVotes: 0,
      options: newPoll.options
        .filter(opt => opt.trim())
        .map((opt, index) => ({
          id: (index + 1).toString(),
          text: opt,
          votes: 0,
          percentage: 0
        }))
    }

    setPolls(prev => [poll, ...prev])
    setNewPoll({
      question: '',
      description: '',
      isAnonymous: false,
      allowMultipleVotes: false,
      options: ['', '']
    })
    setIsCreating(false)
  }

  const handleTogglePoll = async (pollId: string) => {
    setPolls(prev => 
      prev.map(p => 
        p.id === pollId ? { ...p, isActive: !p.isActive } : p
      )
    )
  }

  const handleDeletePoll = async (pollId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce sondage ?')) {
      setPolls(prev => prev.filter(p => p.id !== pollId))
      if (selectedPoll?.id === pollId) {
        setSelectedPoll(null)
      }
    }
  }

  const addOption = () => {
    setNewPoll(prev => ({
      ...prev,
      options: [...prev.options, '']
    }))
  }

  const updateOption = (index: number, value: string) => {
    setNewPoll(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === index ? value : opt)
    }))
  }

  const removeOption = (index: number) => {
    if (newPoll.options.length > 2) {
      setNewPoll(prev => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index)
      }))
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
          <h1 className="text-3xl font-bold">Gestion des Sondages</h1>
          <p className="text-muted-foreground">Créez et gérez des sondages interactifs</p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau sondage
        </Button>
      </div>

      {/* Sélection du panel */}
      <Card>
        <CardHeader>
          <CardTitle>Panel actif</CardTitle>
          <CardDescription>Sélectionnez le panel pour gérer ses sondages</CardDescription>
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

      {/* Formulaire de création */}
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Créer un nouveau sondage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="question">Question</Label>
              <Input
                id="question"
                value={newPoll.question}
                onChange={(e) => setNewPoll(prev => ({ ...prev, question: e.target.value }))}
                placeholder="Écrivez votre question ici..."
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description (optionnelle)</Label>
              <Textarea
                id="description"
                value={newPoll.description}
                onChange={(e) => setNewPoll(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Ajoutez une description ou des instructions..."
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="anonymous"
                  checked={newPoll.isAnonymous}
                  onCheckedChange={(checked) => setNewPoll(prev => ({ ...prev, isAnonymous: checked }))}
                />
                <Label htmlFor="anonymous">Sondage anonyme</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="multiple"
                  checked={newPoll.allowMultipleVotes}
                  onCheckedChange={(checked) => setNewPoll(prev => ({ ...prev, allowMultipleVotes: checked }))}
                />
                <Label htmlFor="multiple">Autoriser plusieurs votes</Label>
              </div>
            </div>

            <div>
              <Label>Options de réponse</Label>
              <div className="space-y-2 mt-2">
                {newPoll.options.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                    />
                    {newPoll.options.length > 2 && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeOption(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={addOption}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter une option
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCreatePoll} className="flex-1">
                Créer le sondage
              </Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Liste des sondages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Vote className="w-5 h-5" />
              Sondages ({filteredPolls.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              <div className="space-y-4">
                {filteredPolls.map((poll) => (
                  <Card 
                    key={poll.id} 
                    className={`cursor-pointer transition-colors ${
                      selectedPoll?.id === poll.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedPoll(poll)}
                  >
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant={poll.isActive ? "default" : "secondary"}>
                            {poll.isActive ? <Play className="w-3 h-3 mr-1" /> : <Pause className="w-3 h-3 mr-1" />}
                            {poll.isActive ? 'Actif' : 'Inactif'}
                          </Badge>
                          {poll.isAnonymous && <Badge variant="outline">Anonyme</Badge>}
                          {poll.allowMultipleVotes && <Badge variant="outline">Multiple</Badge>}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Users className="w-4 h-4" />
                          {poll.totalVotes}
                        </div>
                      </div>
                      
                      <h3 className="font-medium mb-1">{poll.question}</h3>
                      {poll.description && (
                        <p className="text-sm text-muted-foreground mb-3">{poll.description}</p>
                      )}
                      
                      <div className="text-xs text-muted-foreground">
                        Créé le {format(new Date(poll.createdAt), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                      </div>

                      {/* Mini aperçu des résultats */}
                      <div className="mt-3 space-y-1">
                        {poll.options.slice(0, 3).map((option) => (
                          <div key={option.id} className="flex items-center justify-between text-xs">
                            <span className="truncate">{option.text}</span>
                            <span className="font-medium">{option.percentage}%</span>
                          </div>
                        ))}
                        {poll.options.length > 3 && (
                          <div className="text-xs text-muted-foreground">
                            +{poll.options.length - 3} autres options
                          </div>
                        )}
                      </div>
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
            <CardTitle>Détails du sondage</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedPoll ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-lg">{selectedPoll.question}</h3>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTogglePoll(selectedPoll.id)}
                    >
                      {selectedPoll.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeletePoll(selectedPoll.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {selectedPoll.description && (
                  <p className="text-sm text-muted-foreground">{selectedPoll.description}</p>
                )}

                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {selectedPoll.totalVotes} votes
                  </span>
                  <span>Créé le {format(new Date(selectedPoll.createdAt), 'dd/MM/yyyy à HH:mm', { locale: fr })}</span>
                </div>

                <div className="flex gap-2">
                  {selectedPoll.isAnonymous && <Badge variant="outline">Anonyme</Badge>}
                  {selectedPoll.allowMultipleVotes && <Badge variant="outline">Votes multiples</Badge>}
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-3">Résultats en temps réel</h4>
                  <div className="space-y-3">
                    {selectedPoll.options.map((option) => (
                      <div key={option.id} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>{option.text}</span>
                          <span className="font-medium">{option.votes} votes ({option.percentage}%)</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${option.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                <p>Sélectionnez un sondage pour voir les détails</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}