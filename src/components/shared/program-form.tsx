"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Clock, 
  MapPin, 
  Plus, 
  Trash2, 
  Edit, 
  Save,
  FileText,
  List
} from 'lucide-react'

interface ProgramItem {
  id: string
  time: string
  title: string
  description?: string
  speaker?: string
  location?: string
}

interface ProgramFormData {
  hasProgram: boolean
  programItems?: ProgramItem[]
}

interface ProgramFormProps {
  initialData?: Partial<ProgramFormData>
  onSave: (data: ProgramFormData) => Promise<void>
  loading?: boolean
}

export function ProgramForm({ initialData, onSave, loading = false }: ProgramFormProps) {
  const [formData, setFormData] = useState<ProgramFormData>({
    hasProgram: initialData?.hasProgram ?? false,
    programItems: initialData?.programItems || []
  })
  
  const [activeTab, setActiveTab] = useState<'text' | 'structured'>('text')
  const [newItem, setNewItem] = useState<Omit<ProgramItem, 'id'>>({
    time: '',
    title: '',
    description: '',
    speaker: '',
    location: ''
  })
  const [, setEditingItem] = useState<ProgramItem | null>(null)

  const handleSave = async () => {
    await onSave(formData)
  }

  const addProgramItem = () => {
    if (!newItem.time || !newItem.title) return
    
    const item: ProgramItem = {
      id: Date.now().toString(),
      ...newItem
    }
    
    setFormData(prev => ({
      ...prev,
      programItems: [...(prev.programItems || []), item]
    }))
    
    setNewItem({
      time: '',
      title: '',
      description: '',
      speaker: '',
      location: ''
    })
  }

  const updateProgramItem = (item: ProgramItem) => {
    setFormData(prev => ({
      ...prev,
      programItems: prev.programItems?.map(i => i.id === item.id ? item : i) || []
    }))
    setEditingItem(null)
  }

  const deleteProgramItem = (id: string) => {
    setFormData(prev => ({
      ...prev,
      programItems: prev.programItems?.filter(item => item.id !== id) || []
    }))
  }

  const formatTime = (time: string) => {
    if (!time) return ''
    try {
      const [hours, minutes] = time.split(':')
      return `${hours}:${minutes}`
    } catch {
      return time
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Programme de l'événement
        </CardTitle>
        <CardDescription>
          Ajoutez un programme détaillé pour votre événement
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Toggle pour activer/désactiver le programme */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="hasProgram">Inclure un programme</Label>
            <p className="text-sm text-muted-foreground">
              Activer pour afficher un programme sur la page de l'événement
            </p>
          </div>
          <Switch
            id="hasProgram"
            checked={formData.hasProgram}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hasProgram: checked }))}
          />
        </div>

        {formData.hasProgram && (
          <div className="space-y-4">
              {/* Formulaire d'ajout d'élément */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Ajouter une activité</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="itemTime">Heure *</Label>
                      <Input
                        id="itemTime"
                        type="time"
                        value={newItem.time}
                        onChange={(e) => setNewItem(prev => ({ ...prev, time: e.target.value }))}
                        placeholder="HH:MM"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="itemTitle">Titre *</Label>
                      <Input
                        id="itemTitle"
                        value={newItem.title}
                        onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Titre de l'activité"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="itemDescription">Description</Label>
                    <Textarea
                      id="itemDescription"
                      value={newItem.description}
                      onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Description de l'activité"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="itemSpeaker">Intervenant</Label>
                      <Input
                        id="itemSpeaker"
                        value={newItem.speaker}
                        onChange={(e) => setNewItem(prev => ({ ...prev, speaker: e.target.value }))}
                        placeholder="Nom de l'intervenant"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="itemLocation">Lieu</Label>
                      <Input
                        id="itemLocation"
                        value={newItem.location}
                        onChange={(e) => setNewItem(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="Salle ou lieu spécifique"
                      />
                    </div>
                  </div>

                  <Button onClick={addProgramItem} disabled={!newItem.time || !newItem.title}>
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter l'activité
                  </Button>
                </CardContent>
              </Card>

              {/* Liste des éléments du programme */}
              {formData.programItems && formData.programItems.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Programme de l'événement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {formData.programItems
                        .sort((a, b) => a.time.localeCompare(b.time))
                        .map((item) => (
                          <div key={item.id} className="border rounded-lg p-4 space-y-2">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <Badge variant="outline" className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {formatTime(item.time)}
                                  </Badge>
                                  <h4 className="font-semibold">{item.title}</h4>
                                </div>
                                
                                {item.description && (
                                  <p className="text-sm text-muted-foreground mb-2">
                                    {item.description}
                                  </p>
                                )}
                                
                                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                                  {item.speaker && (
                                    <div className="flex items-center gap-1">
                                      <span className="font-medium">Intervenant:</span>
                                      {item.speaker}
                                    </div>
                                  )}
                                  {item.location && (
                                    <div className="flex items-center gap-1">
                                      <MapPin className="w-3 h-3" />
                                      {item.location}
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex gap-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setEditingItem(item)}
                                    >
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-md">
                                    <DialogHeader>
                                      <DialogTitle>Modifier l'activité</DialogTitle>
                                    </DialogHeader>
                                    <ProgramItemForm
                                      item={item}
                                      onSave={updateProgramItem}
                                      onCancel={() => setEditingItem(null)}
                                    />
                                  </DialogContent>
                                </Dialog>
                                
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteProgramItem(item.id)}
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
        )}

        <div className="flex justify-end pt-4">
          <Button onClick={handleSave} disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Enregistrement...' : 'Enregistrer le programme'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Sous-composant pour l'édition d'un élément de programme
interface ProgramItemFormProps {
  item: ProgramItem
  onSave: (item: ProgramItem) => void
  onCancel: () => void
}

function ProgramItemForm({ item, onSave, onCancel }: ProgramItemFormProps) {
  const [formData, setFormData] = useState(item)

  const handleSave = () => {
    onSave(formData)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="editTime">Heure *</Label>
          <Input
            id="editTime"
            type="time"
            value={formData.time}
            onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="editTitle">Titre *</Label>
          <Input
            id="editTitle"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="editDescription">Description</Label>
          <Textarea
            id="editDescription"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="editSpeaker">Intervenant</Label>
          <Input
            id="editSpeaker"
            value={formData.speaker}
            onChange={(e) => setFormData(prev => ({ ...prev, speaker: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="editLocation">Lieu</Label>
          <Input
            id="editLocation"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
          />
        </div>
      </div>
      
      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button onClick={handleSave}>
          Enregistrer
        </Button>
      </div>
    </div>
  )
}