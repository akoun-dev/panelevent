"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { 
  Plus, 
  Edit, 
  Trash2, 
  ToggleLeft, 
  ToggleRight, 
  Clock, 
  MapPin, 
  User,
  MoveUp,
  MoveDown,
  GripVertical
} from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface Panel {
  id: string
  title: string
  description?: string
  startTime: string
  endTime?: string
  speaker?: string
  location?: string
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface EventProgramManagerProps {
  eventId: string
  isAdmin?: boolean
}

const sessionTypes = [
  { value: 'panel', label: 'Panel', icon: '🎤' },
  { value: 'conference', label: 'Conférence', icon: '🎯' },
  { value: 'workshop', label: 'Atelier', icon: '🛠️' },
  { value: 'break', label: 'Pause', icon: '☕' },
  { value: 'networking', label: 'Networking', icon: '🤝' },
  { value: 'meal', label: 'Repas', icon: '🍽️' },
  { value: 'ceremony', label: 'Cérémonie', icon: '🏆' },
  { value: 'other', label: 'Autre', icon: '📋' }
]

export default function EventProgramManager({ eventId, isAdmin = false }: EventProgramManagerProps) {
  const [panels, setPanels] = useState<Panel[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPanel, setEditingPanel] = useState<Panel | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    speaker: '',
    location: '',
    type: 'panel',
    isActive: false
  })

  useEffect(() => {
    const fetchPanels = async () => {
      try {
        const response = await fetch(`/api/events/${eventId}/panels`)
        if (response.ok) {
          const data = await response.json()
          setPanels(data.panels || [])
        }
      } catch (error) {
        console.error('Failed to fetch panels:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPanels()
  }, [eventId])

  const fetchPanels = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}/panels`)
      if (response.ok) {
        const data = await response.json()
        setPanels(data.panels || [])
      }
    } catch (error) {
      console.error('Failed to fetch panels:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async () => {
    try {
      const url = editingPanel 
        ? `/api/events/${eventId}/panels/${editingPanel.id}`
        : `/api/events/${eventId}/panels`
      
      const method = editingPanel ? 'PATCH' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          order: editingPanel ? editingPanel.order : panels.length
        })
      })

      if (response.ok) {
        await fetchPanels()
        setIsDialogOpen(false)
        resetForm()
      }
    } catch (error) {
      console.error('Failed to save panel:', error)
    }
  }

  const handleDelete = async (panelId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette session ?')) return

    try {
      const response = await fetch(`/api/events/${eventId}/panels/${panelId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchPanels()
      }
    } catch (error) {
      console.error('Failed to delete panel:', error)
    }
  }

  const handleToggleStatus = async (panelId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/events/${eventId}/panels/${panelId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive })
      })

      if (response.ok) {
        await fetchPanels()
      }
    } catch (error) {
      console.error('Failed to toggle panel status:', error)
    }
  }

  const handleReorder = async (panelId: string, direction: 'up' | 'down') => {
    const panelIndex = panels.findIndex(p => p.id === panelId)
    if (panelIndex === -1) return

    const newPanels = [...panels]
    const targetIndex = direction === 'up' ? panelIndex - 1 : panelIndex + 1

    if (targetIndex < 0 || targetIndex >= newPanels.length) return

    // Swap orders
    const tempOrder = newPanels[panelIndex].order
    newPanels[panelIndex].order = newPanels[targetIndex].order
    newPanels[targetIndex].order = tempOrder

    // Sort by order
    newPanels.sort((a, b) => a.order - b.order)

    try {
      // Update both panels
      await Promise.all([
        fetch(`/api/events/${eventId}/panels/${panelId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: newPanels[panelIndex].order })
        }),
        fetch(`/api/events/${eventId}/panels/${newPanels[targetIndex].id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: newPanels[targetIndex].order })
        })
      ])

      setPanels(newPanels)
    } catch (error) {
      console.error('Failed to reorder panels:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      startTime: '',
      endTime: '',
      speaker: '',
      location: '',
      type: 'panel',
      isActive: false
    })
    setEditingPanel(null)
  }

  const handleEdit = (panel: Panel) => {
    setEditingPanel(panel)
    setFormData({
      title: panel.title,
      description: panel.description || '',
      startTime: panel.startTime,
      endTime: panel.endTime || '',
      speaker: panel.speaker || '',
      location: panel.location || '',
      type: 'panel', // Default type, could be stored in DB
      isActive: panel.isActive
    })
    setIsDialogOpen(true)
  }

  const formatDateTime = (dateTimeString: string) => {
    return format(new Date(dateTimeString), 'dd MMM yyyy à HH:mm', { locale: fr })
  }

  const getSessionIcon = (type: string) => {
    const sessionType = sessionTypes.find(st => st.value === type)
    return sessionType?.icon || '📋'
  }

  const getSessionLabel = (type: string) => {
    const sessionType = sessionTypes.find(st => st.value === type)
    return sessionType?.label || 'Session'
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Gestion du programme</h3>
          <p className="text-sm text-muted-foreground">
            Organisez les sessions de votre événement
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une session
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingPanel ? 'Modifier la session' : 'Ajouter une session'}
              </DialogTitle>
              <DialogDescription>
                {editingPanel 
                  ? 'Modifiez les informations de la session'
                  : 'Ajoutez une nouvelle session au programme'
                }
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div>
                <Label htmlFor="title">Titre *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Titre de la session"
                  required
                />
              </div>

              <div>
                <Label htmlFor="type">Type de session</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sessionTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <span>{type.icon}</span>
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Description de la session"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime">Heure de début *</Label>
                  <Input
                    id="startTime"
                    type="datetime-local"
                    value={formData.startTime}
                    onChange={(e) => handleInputChange('startTime', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="endTime">Heure de fin</Label>
                  <Input
                    id="endTime"
                    type="datetime-local"
                    value={formData.endTime}
                    onChange={(e) => handleInputChange('endTime', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="speaker">Intervenant</Label>
                <Input
                  id="speaker"
                  value={formData.speaker}
                  onChange={(e) => handleInputChange('speaker', e.target.value)}
                  placeholder="Nom de l'intervenant"
                />
              </div>

              <div>
                <Label htmlFor="location">Lieu</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Salle ou lieu spécifique"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="isActive">Session active</Label>
                  <p className="text-xs text-muted-foreground">
                    Les sessions actives sont visibles par les participants
                  </p>
                </div>
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleSubmit}>
                  {editingPanel ? 'Modifier' : 'Créer'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Sessions List */}
      {panels.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Clock className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucune session</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Commencez par ajouter la première session à votre programme
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une session
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Sessions du programme</CardTitle>
            <CardDescription>
              {panels.length} session{panels.length > 1 ? 's' : ''} dans le programme
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {panels.map((panel, index) => (
                <div key={panel.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="flex items-center gap-2 mt-1">
                        <GripVertical className="w-4 h-4 text-muted-foreground" />
                        <span className="text-lg">{getSessionIcon('panel')}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{panel.title}</h4>
                          <Badge variant={panel.isActive ? 'default' : 'secondary'}>
                            {panel.isActive ? 'Actif' : 'Inactif'}
                          </Badge>
                        </div>
                        {panel.description && (
                          <p className="text-sm text-muted-foreground mb-2">
                            {panel.description}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDateTime(panel.startTime)}
                            {panel.endTime && ` - ${format(new Date(panel.endTime), 'HH:mm')}`}
                          </div>
                          {panel.speaker && (
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {panel.speaker}
                            </div>
                          )}
                          {panel.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {panel.location}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleReorder(panel.id, 'up')}
                        disabled={index === 0}
                        title="Monter"
                      >
                        <MoveUp className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleReorder(panel.id, 'down')}
                        disabled={index === panels.length - 1}
                        title="Descendre"
                      >
                        <MoveDown className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleStatus(panel.id, !panel.isActive)}
                        title={panel.isActive ? 'Désactiver' : 'Activer'}
                      >
                        {panel.isActive ? (
                          <ToggleRight className="w-4 h-4" />
                        ) : (
                          <ToggleLeft className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(panel)}
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(panel.id)}
                        title="Supprimer"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}