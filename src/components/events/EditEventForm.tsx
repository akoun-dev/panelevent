"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { cn } from '@/lib/utils'

interface Event {
  id: string
  title: string
  description?: string
  slug: string
  startDate: string
  endDate?: string
  location?: string
  isPublic: boolean
  isActive: boolean
}

interface EditEventFormProps {
  event: Event
  onSuccess?: () => void
  onCancel?: () => void
}

export default function EditEventForm({ event, onSuccess, onCancel }: EditEventFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: event.title,
    description: event.description || '',
    location: event.location || '',
    startDate: new Date(event.startDate),
    endDate: event.endDate ? new Date(event.endDate) : undefined,
    isPublic: event.isPublic,
    isActive: event.isActive,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/events/${event.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          location: formData.location,
          startDate: formData.startDate.toISOString(),
          endDate: formData.endDate?.toISOString(),
          isPublic: formData.isPublic,
          isActive: formData.isActive,
        }),
      })

      if (response.ok) {
        onSuccess?.()
      } else {
        try {
          const errorText = await response.text();
          if (errorText) {
            const error = JSON.parse(errorText);
            console.error('Failed to update event:', error);
          } else {
            console.error('Failed to update event: Empty response');
          }
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
        }
        alert('Erreur lors de la mise à jour de l\'événement')
      }
    } catch (error) {
      console.error('Failed to update event:', error)
      alert('Erreur lors de la mise à jour de l\'événement')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Titre de l'événement</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder="Nom de votre événement"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Description de l'événement"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Lieu</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => handleInputChange('location', e.target.value)}
          placeholder="Adresse ou lieu de l'événement"
        />
      </div>

      <div className="space-y-2">
        <Label>Date de début</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !formData.startDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.startDate ? (
                format(formData.startDate, "PPP", { locale: fr })
              ) : (
                <span>Sélectionner une date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={formData.startDate}
              onSelect={(date) => date && handleInputChange('startDate', date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label>Date de fin (optionnel)</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !formData.endDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.endDate ? (
                format(formData.endDate, "PPP", { locale: fr })
              ) : (
                <span>Sélectionner une date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={formData.endDate}
              onSelect={(date) => handleInputChange('endDate', date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex items-center justify-between space-y-0">
        <div className="space-y-0.5">
          <Label>Événement public</Label>
          <p className="text-sm text-muted-foreground">
            Visible par tous les utilisateurs
          </p>
        </div>
        <Switch
          checked={formData.isPublic}
          onCheckedChange={(checked) => handleInputChange('isPublic', checked)}
        />
      </div>

      <div className="flex items-center justify-between space-y-0">
        <div className="space-y-0.5">
          <Label>Événement actif</Label>
          <p className="text-sm text-muted-foreground">
            L'événement est actuellement en cours
          </p>
        </div>
        <Switch
          checked={formData.isActive}
          onCheckedChange={(checked) => handleInputChange('isActive', checked)}
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Annuler
        </Button>
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? 'Mise à jour...' : 'Mettre à jour'}
        </Button>
      </div>
    </form>
  )
}