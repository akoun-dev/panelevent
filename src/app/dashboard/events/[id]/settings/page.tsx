'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Save, Loader2 } from 'lucide-react'
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
  title_translations?: Record<string, string>
  description_translations?: Record<string, string>
  location_translations?: Record<string, string>
  branding?: {
    primaryColor?: string
    secondaryColor?: string
    accentColor?: string
  }
  program?: string
  qrCode?: string
  _count?: {
    registrations: number
    questions: number
    polls: number
  }
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
    isActive: false,
    title_translations: {} as Record<string, string>,
    description_translations: {} as Record<string, string>,
    location_translations: {} as Record<string, string>,
    branding: {
      primaryColor: '#3b82f6',
      secondaryColor: '#64748b',
      accentColor: '#f59e0b'
    },
    hasCertificates: false,
    hasQa: false,
    hasPolls: false
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
            isActive: eventData.isActive || false,
            title_translations: eventData.title_translations || {},
            description_translations: eventData.description_translations || {},
            location_translations: eventData.location_translations || {},
            branding: eventData.branding || {
              primaryColor: '#3b82f6',
              secondaryColor: '#64748b',
              accentColor: '#f59e0b'
            },
            hasCertificates: eventData.hasCertificates || false,
            hasQa: eventData.hasQa || false,
            hasPolls: eventData.hasPolls || false
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
            <CardTitle>Dates, capacité et couleurs</CardTitle>
            <CardDescription>Configurez les dates, la capacité et les couleurs de votre événement</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
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

            {/* Couleurs de l'événement */}
            <div className="pt-4 border-t space-y-4">
              <h4 className="text-sm font-medium">Couleurs de l'événement</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="primaryColor" className="block mb-2">Couleur principale</Label>
                  <div className="flex items-center gap-2">
                    <input
                      id="primaryColor"
                      type="color"
                      value={formData.branding?.primaryColor || '#3b82f6'}
                      onChange={(e) => {
                        const newBranding = {
                          ...formData.branding,
                          primaryColor: e.target.value
                        }
                        handleInputChange('branding', newBranding)
                      }}
                      className="w-10 h-10 rounded border cursor-pointer"
                    />
                    <Input
                      value={formData.branding?.primaryColor || '#3b82f6'}
                      onChange={(e) => {
                        const newBranding = {
                          ...formData.branding,
                          primaryColor: e.target.value
                        }
                        handleInputChange('branding', newBranding)
                      }}
                      placeholder="#3b82f6"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="secondaryColor" className="block mb-2">Couleur secondaire</Label>
                  <div className="flex items-center gap-2">
                    <input
                      id="secondaryColor"
                      type="color"
                      value={formData.branding?.secondaryColor || '#64748b'}
                      onChange={(e) => {
                        const newBranding = {
                          ...formData.branding,
                          secondaryColor: e.target.value
                        }
                        handleInputChange('branding', newBranding)
                      }}
                      className="w-10 h-10 rounded border cursor-pointer"
                    />
                    <Input
                      value={formData.branding?.secondaryColor || '#64748b'}
                      onChange={(e) => {
                        const newBranding = {
                          ...formData.branding,
                          secondaryColor: e.target.value
                        }
                        handleInputChange('branding', newBranding)
                      }}
                      placeholder="#64748b"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="accentColor" className="block mb-2">Couleur d'accent</Label>
                  <div className="flex items-center gap-2">
                    <input
                      id="accentColor"
                      type="color"
                      value={formData.branding?.accentColor || '#f59e0b'}
                      onChange={(e) => {
                        const newBranding = {
                          ...formData.branding,
                          accentColor: e.target.value
                        }
                        handleInputChange('branding', newBranding)
                      }}
                      className="w-10 h-10 rounded border cursor-pointer"
                    />
                    <Input
                      value={formData.branding?.accentColor || '#f59e0b'}
                      onChange={(e) => {
                        const newBranding = {
                          ...formData.branding,
                          accentColor: e.target.value
                        }
                        handleInputChange('branding', newBranding)
                      }}
                      placeholder="#f59e0b"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <div
                    className="w-4 h-4 rounded border"
                    style={{ backgroundColor: formData.branding?.primaryColor || '#3b82f6' }}
                  ></div>
                  <span>Primaire</span>
                </div>
                <div className="flex items-center gap-1">
                  <div
                    className="w-4 h-4 rounded border"
                    style={{ backgroundColor: formData.branding?.secondaryColor || '#64748b' }}
                  ></div>
                  <span>Secondaire</span>
                </div>
                <div className="flex items-center gap-1">
                  <div
                    className="w-4 h-4 rounded border"
                    style={{ backgroundColor: formData.branding?.accentColor || '#f59e0b' }}
                  ></div>
                  <span>Accent</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Paramètres multilingues */}
        <Card>
          <CardHeader>
            <CardTitle>Traductions</CardTitle>
            <CardDescription>Gérez les traductions multilingues de votre événement</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="mb-2 block">Titre multilingue</Label>
              <div className="space-y-2">
                {['fr', 'en', 'pt', 'es', 'ar'].map((lang) => (
                  <div key={lang} className="flex items-center gap-2">
                    <span className="text-sm font-medium w-8">{lang.toUpperCase()}</span>
                    <Input
                      placeholder={`Titre en ${lang}`}
                      value={formData.title_translations?.[lang] || ''}
                      onChange={(e) => {
                        const newTranslations = {
                          ...formData.title_translations,
                          [lang]: e.target.value
                        }
                        handleInputChange('title_translations', newTranslations)
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Description multilingue</Label>
              <div className="space-y-2">
                {['fr', 'en', 'pt', 'es', 'ar'].map((lang) => (
                  <div key={lang} className="flex items-center gap-2">
                    <span className="text-sm font-medium w-8">{lang.toUpperCase()}</span>
                    <Textarea
                      placeholder={`Description en ${lang}`}
                      value={formData.description_translations?.[lang] || ''}
                      onChange={(e) => {
                        const newTranslations = {
                          ...formData.description_translations,
                          [lang]: e.target.value
                        }
                        handleInputChange('description_translations', newTranslations)
                      }}
                      rows={2}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Lieu multilingue</Label>
              <div className="space-y-2">
                {['fr', 'en', 'pt', 'es', 'ar'].map((lang) => (
                  <div key={lang} className="flex items-center gap-2">
                    <span className="text-sm font-medium w-8">{lang.toUpperCase()}</span>
                    <Input
                      placeholder={`Lieu en ${lang}`}
                      value={formData.location_translations?.[lang] || ''}
                      onChange={(e) => {
                        const newTranslations = {
                          ...formData.location_translations,
                          [lang]: e.target.value
                        }
                        handleInputChange('location_translations', newTranslations)
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Visibilité et Informations de l'événement */}
        {settings && (
          <Card>
            <CardHeader>
              <CardTitle>Visibilité et Informations</CardTitle>
              <CardDescription>Configurez la visibilité et consultez les informations de votre événement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Section Visibilité */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Paramètres de visibilité</h4>
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

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Événement actif</Label>
                    <p className="text-sm text-muted-foreground">
                      Activer ou désactiver l'événement
                    </p>
                  </div>
                  <Switch
                    checked={formData.isActive}
                    onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                  />
                </div>
              </div>

              {/* Section Informations */}
              <div className="pt-4 border-t space-y-4">
                <h4 className="text-sm font-medium">Informations de l'événement</h4>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">ID de l'événement</span>
                  <Badge variant="outline">{settings.id}</Badge>
                </div>

                {settings.createdAt && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Créé le</span>
                    <span>{format(new Date(settings.createdAt), 'dd/MM/yyyy à HH:mm', { locale: fr })}</span>
                  </div>
                )}

                {settings.updatedAt && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Modifié le</span>
                    <span>{format(new Date(settings.updatedAt), 'dd/MM/yyyy à HH:mm', { locale: fr })}</span>
                  </div>
                )}

                {/* Fonctionnalités avec switches */}
                {settings._count && (
                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium mb-3">Fonctionnalités activées</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Certificats</Label>
                          <p className="text-sm text-muted-foreground">
                            Activer les certificats de participation
                          </p>
                        </div>
                        <Switch
                          checked={formData.hasCertificates}
                          onCheckedChange={(checked) => handleInputChange('hasCertificates', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Questions/Réponses</Label>
                          <p className="text-sm text-muted-foreground">
                            Activer les questions et réponses
                          </p>
                        </div>
                        <Switch
                          checked={formData.hasQa}
                          onCheckedChange={(checked) => handleInputChange('hasQa', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Sondages</Label>
                          <p className="text-sm text-muted-foreground">
                            Activer les sondages interactifs
                          </p>
                        </div>
                        <Switch
                          checked={formData.hasPolls}
                          onCheckedChange={(checked) => handleInputChange('hasPolls', checked)}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}