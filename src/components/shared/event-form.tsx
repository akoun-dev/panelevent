"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Save } from 'lucide-react'

interface EventFormData {
  title: string
  description: string
  startDate: string
  endDate: string
  location: string
  isPublic: boolean
  isActive: boolean
  maxAttendees?: string
}

interface EventFormProps {
  initialData?: Partial<EventFormData>
  onSubmit: (data: EventFormData, slug: string) => Promise<void>
  onCancel: () => void
  loading?: boolean
  submitText?: string
  showSlug?: boolean
}

export function EventForm({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
  submitText = "Créer l'événement",
  showSlug = true
}: EventFormProps) {
  const [formData, setFormData] = useState<EventFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    startDate: initialData?.startDate || '',
    endDate: initialData?.endDate || '',
    location: initialData?.location || '',
    isPublic: initialData?.isPublic ?? true,
    isActive: initialData?.isActive ?? false,
    maxAttendees: initialData?.maxAttendees || ''
  })
  
  const [slug, setSlug] = useState(initialData?.title ? 
    initialData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : 
    '')

  const handleInputChange = (field: keyof EventFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Generate slug automatically when title changes
    if (field === 'title' && typeof value === 'string') {
      const generatedSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      setSlug(generatedSlug)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData, slug)
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Informations de l'événement</CardTitle>
        <CardDescription>
          Les champs marqués d'un * sont obligatoires
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Titre *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Titre de l'événement"
              required
            />
          </div>

          {showSlug && (
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="slug-de-l-evenement"
                pattern="[a-z0-9-]+"
                title="Le slug ne peut contenir que des lettres minuscules, des chiffres et des tirets"
              />
              <p className="text-xs text-muted-foreground">
                Le slug est généré automatiquement à partir du titre mais peut être modifié
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Description de l'événement"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Date de début *</Label>
              <Input
                id="startDate"
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Date de fin</Label>
              <Input
                id="endDate"
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Lieu</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="Lieu de l'événement"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxAttendees">Nombre maximum de participants</Label>
            <Input
              id="maxAttendees"
              type="number"
              min="1"
              value={formData.maxAttendees}
              onChange={(e) => handleInputChange('maxAttendees', e.target.value)}
              placeholder="Illimité"
            />
            <p className="text-xs text-muted-foreground">
              Laissez vide pour un nombre illimité de participants
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="isPublic">Événement public</Label>
              <p className="text-sm text-muted-foreground">
                Les événements publics sont visibles par tout le monde
              </p>
            </div>
            <Switch
              id="isPublic"
              checked={formData.isPublic}
              onCheckedChange={(checked) => handleInputChange('isPublic', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="isActive">Événement actif</Label>
              <p className="text-sm text-muted-foreground">
                Les événements actifs permettent les interactions
              </p>
            </div>
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => handleInputChange('isActive', checked)}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Création...' : submitText}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}