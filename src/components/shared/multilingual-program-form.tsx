"use client"

import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
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
  Languages,
  QrCode
} from 'lucide-react'
import { Language, getLanguageName } from '@/lib/translations'
import { TranslatedProgramItem } from '@/lib/program-translations'
import { QRCodeGenerator } from '@/components/QRCodeGenerator'

interface ProgramFormData {
  hasProgram: boolean
  programItems?: TranslatedProgramItem[]
}

interface ProgramFormProps {
  initialData?: Partial<ProgramFormData>
  onSave: (data: ProgramFormData) => Promise<void>
  loading?: boolean
  eventId?: string
}

// Fonction utilitaire pour créer un objet Record<Language, string> vide
const createEmptyLanguageRecord = (): Record<Language, string> => ({
  fr: '',
  en: '',
  pt: '',
  es: '',
  ar: ''
})

export function MultilingualProgramForm({ initialData, onSave, loading = false, eventId }: ProgramFormProps) {
  const [formData, setFormData] = useState<ProgramFormData>({
    hasProgram: initialData?.hasProgram ?? false,
    programItems: initialData?.programItems || []
  })
  
  const [newItem, setNewItem] = useState<Omit<TranslatedProgramItem, 'id'>>({
    time: '',
    title: createEmptyLanguageRecord(),
    description: undefined,
    speaker: undefined,
    location: undefined,
    isSession: false
  })
  const [editingItem, setEditingItem] = useState<TranslatedProgramItem | null>(null)
  const [currentLanguage, setCurrentLanguage] = useState<Language>('fr')

  const handleSave = async () => {
    await onSave(formData)
  }

  const addProgramItem = () => {
    if (!newItem.time || !newItem.title.fr) return
    
    const item: TranslatedProgramItem = {
      id: uuidv4(),
      ...newItem
    }
    
    setFormData(prev => ({
      ...prev,
      programItems: [...(prev.programItems || []), item]
    }))
    
    setNewItem({
      time: '',
      title: createEmptyLanguageRecord(),
      description: undefined,
      speaker: undefined,
      location: undefined,
      isSession: false
    })
  }

  const updateProgramItem = (item: TranslatedProgramItem) => {
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

  // Fonction pour mettre à jour un champ de manière sécurisée
  const updateNewItemField = (
    field: keyof Omit<TranslatedProgramItem, 'id'>,
    language: Language,
    value: string
  ) => {
    setNewItem(prev => {
      if (field === 'title') {
        return {
          ...prev,
          title: {
            ...prev.title,
            [language]: value
          }
        }
      }
      
      const currentField = prev[field]
      if (!currentField) {
        // Créer un nouvel objet si le champ n'existe pas
        return {
          ...prev,
          [field]: {
            fr: '',
            en: '',
            pt: '',
            es: '',
            ar: '',
            [language]: value
          }
        }
      }
      
      // Type guard pour vérifier si currentField est un objet Record
      if (typeof currentField === 'object' && currentField !== null) {
        return {
          ...prev,
          [field]: {
            ...currentField,
            [language]: value
          }
        }
      } else {
        // Créer un nouvel objet si ce n'est pas un Record
        return {
          ...prev,
          [field]: {
            fr: '',
            en: '',
            pt: '',
            es: '',
            ar: '',
            [language]: value
          }
        }
      }
    })
  }

  // Sélecteur de langue pour l'édition
  const LanguageSelector = ({ onLanguageChange }: { onLanguageChange: (lang: Language) => void }) => (
    <div className="flex gap-2 mb-4">
      {(['fr', 'en', 'pt', 'es', 'ar'] as Language[]).map(lang => (
        <Button
          key={lang}
          variant={currentLanguage === lang ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setCurrentLanguage(lang)
            onLanguageChange(lang)
          }}
        >
          {getLanguageName(lang)}
        </Button>
      ))}
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Languages className="w-5 h-5" />
          Programme Multilingue
        </CardTitle>
        <CardDescription>
          Ajoutez un programme détaillé avec support multilingue
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
                <CardTitle className="text-lg">Ajouter une activité / Session</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <LanguageSelector onLanguageChange={() => {}} />
                
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
                    <Label htmlFor="itemTitle">Titre ({getLanguageName(currentLanguage)}) *</Label>
                    <Input
                      id="itemTitle"
                      value={newItem.title[currentLanguage]}
                      onChange={(e) => updateNewItemField('title', currentLanguage, e.target.value)}
                      placeholder="Titre de l'activité"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="itemDescription">Description ({getLanguageName(currentLanguage)})</Label>
                  <Textarea
                    id="itemDescription"
                    value={newItem.description?.[currentLanguage] || ''}
                    onChange={(e) => updateNewItemField('description', currentLanguage, e.target.value)}
                    placeholder="Description de l'activité"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="itemSpeaker">Intervenant ({getLanguageName(currentLanguage)})</Label>
                    <Input
                      id="itemSpeaker"
                      value={newItem.speaker?.[currentLanguage] || ''}
                      onChange={(e) => updateNewItemField('speaker', currentLanguage, e.target.value)}
                      placeholder="Nom de l'intervenant"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="itemLocation">Lieu ({getLanguageName(currentLanguage)})</Label>
                    <Input
                      id="itemLocation"
                      value={newItem.location?.[currentLanguage] || ''}
                      onChange={(e) => updateNewItemField('location', currentLanguage, e.target.value)}
                      placeholder="Salle ou lieu spécifique"
                    />
                  </div>
                </div>

                {/* Switch pour isSession */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="isSession">Session nécessitant inscription</Label>
                    <p className="text-sm text-muted-foreground">
                      Activer pour générer un QR code d'inscription spécifique à cette session
                    </p>
                  </div>
                  <Switch
                    id="isSession"
                    checked={newItem.isSession || false}
                    onCheckedChange={(checked) => setNewItem(prev => ({ ...prev, isSession: checked }))}
                  />
                </div>

                <Button onClick={addProgramItem} disabled={!newItem.time || !newItem.title.fr}>
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
                                <h4 className="font-semibold">{item.title.fr}</h4>
                                {item.isSession && (
                                  <Badge variant="secondary" className="ml-2">
                                    Session
                                  </Badge>
                                )}
                              </div>
                              
                              {item.description?.fr && (
                                <p className="text-sm text-muted-foreground mb-2">
                                  {item.description.fr}
                                </p>
                              )}
                              
                              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                                {item.speaker?.fr && (
                                  <div className="flex items-center gap-1">
                                    <span className="font-medium">Intervenant:</span>
                                    {item.speaker.fr}
                                  </div>
                                )}
                                {item.location?.fr && (
                                  <div className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {item.location.fr}
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex gap-2">
                              {item.isSession && (
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-blue-600 hover:text-blue-700"
                                    >
                                      <QrCode className="w-4 h-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-sm">
                                    <DialogHeader>
                                      <DialogTitle>QR Code d'Inscription</DialogTitle>
                                    </DialogHeader>
                                    <div className="flex flex-col items-center space-y-4">
                                      <QRCodeGenerator
                                        url={`/session/${eventId}/${item.id}/check-email`}
                                        eventName={item.title.fr}
                                      />
                                      <p className="text-sm text-muted-foreground text-center">
                                        Scannez ce QR code pour accéder au formulaire d'inscription
                                      </p>
                                      <p className="text-xs text-muted-foreground text-center">
                                        Session: {item.title.fr}
                                      </p>
                                      <div className="text-center">
                                        <p className="text-xs text-muted-foreground mb-1">Lien d'inscription:</p>
                                        <a
                                          href={`/session/${eventId}/${item.id}/check-email`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-xs text-blue-600 hover:text-blue-700 break-all"
                                        >
                                          {`/session/${eventId}/${item.id}/check-email`}
                                        </a>
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              )}
                              
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
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>Modifier l'activité - Multilingue</DialogTitle>
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

// Sous-composant pour l'édition multilingue d'un élément de programme
interface ProgramItemFormProps {
  item: TranslatedProgramItem
  onSave: (item: TranslatedProgramItem) => void
  onCancel: () => void
}

function ProgramItemForm({ item, onSave, onCancel }: ProgramItemFormProps) {
  const [formData, setFormData] = useState(item)
  const [currentLanguage, setCurrentLanguage] = useState<Language>('fr')

  const handleSave = () => {
    onSave(formData)
  }

  const updateFormDataField = (
    field: keyof Omit<TranslatedProgramItem, 'id'>,
    language: Language,
    value: string
  ) => {
    setFormData(prev => {
      if (field === 'title') {
        return {
          ...prev,
          title: {
            ...prev.title,
            [language]: value
          }
        }
      }
      
      const currentField = prev[field]
      if (!currentField) {
        // Créer un nouvel objet si le champ n'existe pas
        return {
          ...prev,
          [field]: {
            fr: '',
            en: '',
            pt: '',
            es: '',
            ar: '',
            [language]: value
          }
        }
      }
      
      // Type guard pour vérifier si currentField est un objet Record
      if (typeof currentField === 'object' && currentField !== null) {
        return {
          ...prev,
          [field]: {
            ...currentField,
            [language]: value
          }
        }
      } else {
        // Créer un nouvel objet si ce n'est pas un Record
        return {
          ...prev,
          [field]: {
            fr: '',
            en: '',
            pt: '',
            es: '',
            ar: '',
            [language]: value
          }
        }
      }
    })
  }

  const LanguageSelector = () => (
    <div className="flex gap-2 mb-4">
      {(['fr', 'en', 'pt', 'es', 'ar'] as Language[]).map(lang => (
        <Button
          key={lang}
          variant={currentLanguage === lang ? "default" : "outline"}
          size="sm"
          onClick={() => setCurrentLanguage(lang)}
        >
          {getLanguageName(lang)}
        </Button>
      ))}
    </div>
  )

  return (
    <div className="space-y-4">
      <LanguageSelector />
      
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
          <Label htmlFor="editTitle">Titre ({getLanguageName(currentLanguage)}) *</Label>
          <Input
            id="editTitle"
            value={formData.title[currentLanguage]}
            onChange={(e) => updateFormDataField('title', currentLanguage, e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="editDescription">Description ({getLanguageName(currentLanguage)})</Label>
          <Textarea
            id="editDescription"
            value={formData.description?.[currentLanguage] || ''}
            onChange={(e) => updateFormDataField('description', currentLanguage, e.target.value)}
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="editSpeaker">Intervenant ({getLanguageName(currentLanguage)})</Label>
          <Input
            id="editSpeaker"
            value={formData.speaker?.[currentLanguage] || ''}
            onChange={(e) => updateFormDataField('speaker', currentLanguage, e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="editLocation">Lieu ({getLanguageName(currentLanguage)})</Label>
          <Input
            id="editLocation"
            value={formData.location?.[currentLanguage] || ''}
            onChange={(e) => updateFormDataField('location', currentLanguage, e.target.value)}
          />
        </div>
      </div>
      
      {/* Switch pour isSession dans le formulaire d'édition */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="editIsSession">Session nécessitant inscription</Label>
          <p className="text-sm text-muted-foreground">
            Activer pour générer un QR code d'inscription spécifique à cette session
          </p>
        </div>
        <Switch
          id="editIsSession"
          checked={formData.isSession || false}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isSession: checked }))}
        />
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