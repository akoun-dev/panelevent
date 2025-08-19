'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Save, Loader2, Calendar, MapPin, Users, Globe } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface EventSettings {
  id: string
  title: string
  description: string
  slug: string
  startDate: string
  endDate: string
  location: string
  isPublic: boolean
  isActive: boolean
  maxAttendees: number
  createdAt: string
  updatedAt: string
}

export default function EventSettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const [eventId, setEventId] = useState<string>('')
  const [settings, setSettings] = useState<EventSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    slug: '',
    startDate: '',
    endDate: '',
    location: '',
    isPublic: false,
    maxAttendees: 0,
    isActive: false
  })

  useEffect(() => {
    const loadEventSettings = async (eventId: string) => {
      try {
        const response = await fetch(`/api/organizer/events/${eventId}`)
        if (response.ok) {
          const eventData = await response.json()
          setSettings(eventData)
          setFormData({
            title: eventData.title || '',
            description: eventData.description || '',
            slug: eventData.slug || '',
            startDate: eventData.startDate ? format(new Date(eventData.startDate), 'yyyy-MM-dd') : '',
            endDate: eventData.endDate ? format(new Date(eventData.endDate), 'yyyy-MM-dd') : '',
            location: eventData.location || '',
            isPublic: eventData.isPublic || false,
            maxAttendees: eventData.maxAttendees || 0,
            isActive: eventData.isActive || false
          })
        }
      } catch (error) {
        console.error('Failed to fetch event settings:', error)
      } finally {
        setIsLoading(false)
      }
    }

    const init = async () => {
      try {
        const { id } = await params
        setEventId(id)
        loadEventSettings(id)
      } catch (error) {
        console.error('Failed to get params:', error)
        setIsLoading(false)
      }
    }

    init()
  }, [params])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch(`/api/organizer/events/${eventId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const updatedEvent = await response.json()
        setSettings(updatedEvent)
        // Afficher un message de succès
      }
    } catch (error) {
      console.error('Failed to save settings:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
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
          <h1 className="text-3xl font-bold">Paramètres de l'événement</h1>
          <p className="text-muted-foreground">Configurez les paramètres de votre événement</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Enregistrer
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informations de base */}
        <Card>
          <CardHeader>
            <CardTitle>Informations de base</CardTitle>
            <CardDescription>Les informations principales de votre événement</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Titre de l'événement</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Nom de votre événement"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Décrivez votre événement..."
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="slug">Slug (URL)</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                placeholder="mon-evenement-2024"
              />
            </div>

            <div>
              <Label htmlFor="location">Lieu</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Adresse ou lieu de l'événement"
              />
            </div>
          </CardContent>
        </Card>

        {/* Dates et capacité */}
        <Card>
          <CardHeader>
            <CardTitle>Dates et capacité</CardTitle>
            <CardDescription>Configurez les dates et la capacité de votre événement</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Date de début</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="endDate">Date de fin</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="maxAttendees">Nombre maximum de participants</Label>
              <Input
                id="maxAttendees"
                type="number"
                value={formData.maxAttendees}
                onChange={(e) => handleInputChange('maxAttendees', parseInt(e.target.value) || 0)}
                placeholder="0 pour illimité"
              />
            </div>
          </CardContent>
        </Card>

        {/* Paramètres de visibilité */}
        <Card>
          <CardHeader>
            <CardTitle>Visibilité</CardTitle>
            <CardDescription>Configurez la visibilité de votre événement</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Événement public</Label>
                <p className="text-sm text-muted-foreground">
                  Rendre cet événement visible par tous
                </p>
              </div>
              <Switch
                checked={formData.isPublic}
                onCheckedChange={(checked) => handleInputChange('isPublic', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Informations de l'événement */}
        {settings && (
          <Card>
            <CardHeader>
              <CardTitle>Informations de l'événement</CardTitle>
              <CardDescription>Détails techniques de votre événement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">ID de l'événement</span>
                <Badge variant="outline">{settings.id}</Badge>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Statut</span>
                <Badge variant={settings.isPublic ? "default" : "secondary"}>
                  {settings.isPublic ? 'Public' : 'Privé'}
                </Badge>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Créé le</span>
                <span>{format(new Date(settings.createdAt), 'dd/MM/yyyy à HH:mm', { locale: fr })}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Modifié le</span>
                <span>{format(new Date(settings.updatedAt), 'dd/MM/yyyy à HH:mm', { locale: fr })}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Statut</span>
                <Badge variant={settings.isActive ? "default" : "secondary"}>
                  {settings.isActive ? 'Actif' : 'Inactif'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}