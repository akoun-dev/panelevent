'use client'

import type { Database } from '@/types/supabase'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'
import { format } from 'date-fns'

export default function EditEventForm({
  event,
  onSuccess,
}: {
  event: Database['public']['Tables']['events']['Row']
  onSuccess: () => void
}) {
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      title: event.title,
      description: event.description || '',
      startDate: format(new Date(event.startDate), "yyyy-MM-dd'T'HH:mm"),
      endDate: event.endDate ? format(new Date(event.endDate), "yyyy-MM-dd'T'HH:mm") : '',
      location: event.location || '',
      isPublic: event.isPublic,
      isActive: event.isActive
    }
  })

  const onSubmit = async (data: any) => {
    try {
      const response = await fetch(`/api/organizer/events/${event.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        toast({
          title: "Événement mis à jour",
          description: "Votre événement a été modifié avec succès"
        })
        onSuccess()
      }
    } catch (_error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la modification",
        variant: "destructive"
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label>Titre</Label>
        <Input {...register('title')} placeholder="Titre de l'événement" />
      </div>
      
      <div>
        <Label>Description</Label>
        <Textarea {...register('description')} placeholder="Description" rows={3} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Date de début</Label>
          <Input type="datetime-local" {...register('startDate')} />
        </div>
        <div>
          <Label>Date de fin (optionnel)</Label>
          <Input type="datetime-local" {...register('endDate')} />
        </div>
      </div>

      <div>
        <Label>Lieu</Label>
        <Input {...register('location')} placeholder="Lieu de l'événement" />
      </div>

      <div className="flex items-center justify-between">
        <Label>Événement public</Label>
        <Switch 
          checked={watch('isPublic')} 
          onCheckedChange={(checked) => setValue('isPublic', checked)}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label>Événement actif</Label>
        <Switch 
          checked={watch('isActive')} 
          onCheckedChange={(checked) => setValue('isActive', checked)}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="submit">Enregistrer</Button>
      </div>
    </form>
  )
}